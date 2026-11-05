-- =========================================================================
-- S&J-GEEK
-- Motor: MySQL 8.0.16+
-- =========================================================================

-- SOLO DESARROLLO
DROP DATABASE IF EXISTS sj_geek_db;
CREATE DATABASE sj_geek_db;
USE sj_geek_db;

-- =========================================================================
-- CATÁLOGOS (dominios que pueden crecer sin ALTER TABLE)
-- =========================================================================
CREATE TABLE roles (
    id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    descripcion VARCHAR(150) DEFAULT NULL,
    CONSTRAINT uk_roles_nombre UNIQUE (nombre)
) ENGINE=InnoDB;

CREATE TABLE tipos_contenido (
    id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    CONSTRAINT uk_tipos_nombre UNIQUE (nombre)
) ENGINE=InnoDB;

CREATE TABLE categorias (
    id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_categorias_nombre UNIQUE (nombre)
) ENGINE=InnoDB;

CREATE TABLE paises (
    id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    codigo_iso CHAR(2) NOT NULL,
    CONSTRAINT uk_paises_nombre UNIQUE (nombre),
    CONSTRAINT uk_paises_iso UNIQUE (codigo_iso)
) ENGINE=InnoDB;

-- =========================================================================
-- USUARIOS
-- =========================================================================
CREATE TABLE usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id TINYINT UNSIGNED NOT NULL DEFAULT 2,   -- 2 = USER (ver seeds de roles)
    avatar_url VARCHAR(255) DEFAULT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_usuarios_email UNIQUE (email),
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id)
        REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================================================================
-- PERSONAS (una sola entidad: una persona puede actuar y dirigir)
-- =========================================================================
CREATE TABLE personas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    biografia TEXT DEFAULT NULL,
    fecha_nacimiento DATE DEFAULT NULL,
    pais_id SMALLINT UNSIGNED DEFAULT NULL,
    foto_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_personas_nombre (nombre),
    CONSTRAINT fk_personas_pais FOREIGN KEY (pais_id)
        REFERENCES paises(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================================================================
-- CONTENIDOS (solo atributos propios del contenido; sin métricas)
-- =========================================================================
CREATE TABLE contenidos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    sinopsis TEXT NOT NULL,
    categoria_id SMALLINT UNSIGNED NOT NULL,
    tipo_id TINYINT UNSIGNED NOT NULL,
    anio SMALLINT UNSIGNED NOT NULL,
    duracion_minutos SMALLINT UNSIGNED DEFAULT NULL,
    clasificacion VARCHAR(3) NOT NULL DEFAULT '+13',
    imagen_url VARCHAR(255) DEFAULT NULL,
    estado ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
    motivo_rechazo VARCHAR(255) DEFAULT NULL,     -- solo con estado RECHAZADO
    usuario_id INT UNSIGNED NOT NULL,             -- quien lo propuso
    revisado_por INT UNSIGNED DEFAULT NULL,       -- ADMIN que aprobó o rechazó
    revisado_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_contenidos_titulo_tipo_anio UNIQUE (titulo, tipo_id, anio),
    CONSTRAINT chk_contenidos_anio CHECK (anio BETWEEN 1888 AND 2100),
    CONSTRAINT chk_contenidos_duracion CHECK (duracion_minutos IS NULL OR duracion_minutos > 0),
    CONSTRAINT chk_contenidos_motivo CHECK (estado = 'RECHAZADO' OR motivo_rechazo IS NULL),
    INDEX idx_contenidos_cat_estado (categoria_id, estado),
    INDEX idx_contenidos_tipo_estado (tipo_id, estado),
    INDEX idx_contenidos_estado_fecha (estado, created_at),
    FULLTEXT KEY ft_contenidos_busqueda (titulo, sinopsis),
    CONSTRAINT fk_contenidos_categoria FOREIGN KEY (categoria_id)
        REFERENCES categorias(id) ON DELETE RESTRICT,
    CONSTRAINT fk_contenidos_tipo FOREIGN KEY (tipo_id)
        REFERENCES tipos_contenido(id) ON DELETE RESTRICT,
    CONSTRAINT fk_contenidos_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE RESTRICT,
    CONSTRAINT fk_contenidos_revisor FOREIGN KEY (revisado_por)
        REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================================================================
-- TRÁILERS
-- =========================================================================
CREATE TABLE contenido_trailers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    contenido_id INT UNSIGNED NOT NULL,
    plataforma ENUM('YOUTUBE', 'VIMEO') NOT NULL,
    video_key VARCHAR(20) NOT NULL,
    titulo VARCHAR(150) DEFAULT NULL,             -- p. ej. "Tráiler oficial subtitulado"
    tipo ENUM('TRAILER', 'TEASER', 'CLIP') NOT NULL DEFAULT 'TRAILER',
    idioma CHAR(2) DEFAULT NULL,                  -- ISO 639-1: es, en, ja
    es_principal TINYINT(1) NULL DEFAULT NULL,    -- 1 = principal, NULL = secundario
    usuario_id INT UNSIGNED NOT NULL,             -- quien lo agregó
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_trailers_video UNIQUE (contenido_id, plataforma, video_key),
    CONSTRAINT uk_trailers_principal UNIQUE (contenido_id, es_principal),
    CONSTRAINT chk_trailers_principal CHECK (es_principal IS NULL OR es_principal = 1),
    CONSTRAINT chk_trailers_video_key CHECK (
        (plataforma = 'YOUTUBE' AND video_key REGEXP '^[A-Za-z0-9_-]{11}$')
        OR (plataforma = 'VIMEO' AND video_key REGEXP '^[0-9]{6,12}$')
    ),
    CONSTRAINT fk_trailers_contenido FOREIGN KEY (contenido_id)
        REFERENCES contenidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_trailers_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================================================================
-- RESEÑAS
-- Una reseña por usuario y contenido. Los usuarios no se borran (RESTRICT)
-- para no desincronizar contenido_estadisticas; se desactivan.
-- =========================================================================
CREATE TABLE resenas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    contenido_id INT UNSIGNED NOT NULL,
    usuario_id INT UNSIGNED NOT NULL,
    titulo_resena VARCHAR(120) NOT NULL,
    comentario TEXT NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    es_recomendada TINYINT(1) GENERATED ALWAYS AS (IF(rating >= 6, 1, 0)) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_resenas_rating CHECK (rating BETWEEN 1 AND 10),
    CONSTRAINT uk_resenas_usuario_contenido UNIQUE (usuario_id, contenido_id),
    INDEX idx_resenas_contenido_fecha (contenido_id, created_at),
    CONSTRAINT fk_resenas_contenido FOREIGN KEY (contenido_id)
        REFERENCES contenidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_resenas_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================================================================
-- REACCIONES (clave natural; sin id sustituto redundante)
-- Los likes/dislikes NO se guardan como contador: se cuentan con COUNT/SUM.
-- =========================================================================
CREATE TABLE reaccion_resenas (
    resena_id INT UNSIGNED NOT NULL,
    usuario_id INT UNSIGNED NOT NULL,
    tipo ENUM('LIKE', 'DISLIKE') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (resena_id, usuario_id),
    CONSTRAINT fk_reaccion_resena FOREIGN KEY (resena_id)
        REFERENCES resenas(id) ON DELETE CASCADE,
    CONSTRAINT fk_reaccion_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================================
-- ESTADÍSTICAS POR CONTENIDO (único lugar con datos derivados)
-- =========================================================================
CREATE TABLE contenido_estadisticas (
    contenido_id INT UNSIGNED PRIMARY KEY,
    total_votos INT UNSIGNED NOT NULL DEFAULT 0,
    suma_ratings INT UNSIGNED NOT NULL DEFAULT 0,
    total_recomendadas INT UNSIGNED NOT NULL DEFAULT 0,
    rating_promedio DECIMAL(4,2) GENERATED ALWAYS AS
        (IFNULL(ROUND(suma_ratings / NULLIF(total_votos, 0), 2), 0)) STORED,
    porcentaje_fresco DECIMAL(5,2) GENERATED ALWAYS AS
        (IFNULL(ROUND(100 * total_recomendadas / NULLIF(total_votos, 0), 2), 0)) STORED,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_est_recomendadas CHECK (total_recomendadas <= total_votos),
    CONSTRAINT chk_est_suma CHECK (suma_ratings >= total_votos AND suma_ratings <= total_votos * 10),
    INDEX idx_est_votos (total_votos),            -- orden por popularidad
    INDEX idx_est_promedio (rating_promedio),     -- orden por promedio simple
    CONSTRAINT fk_est_contenido FOREIGN KEY (contenido_id)
        REFERENCES contenidos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Cada contenido nuevo nace con su fila de estadísticas en cero.
CREATE TRIGGER trg_contenidos_crear_estadisticas
AFTER INSERT ON contenidos
FOR EACH ROW
INSERT INTO contenido_estadisticas (contenido_id) VALUES (NEW.id);

-- =========================================================================
-- TABLAS PUENTE (reparto y dirección son hechos independientes)
-- =========================================================================
CREATE TABLE contenido_actores (
    contenido_id INT UNSIGNED NOT NULL,
    persona_id INT UNSIGNED NOT NULL,
    personaje VARCHAR(120) NOT NULL DEFAULT 'Desconocido',
    es_principal TINYINT(1) NOT NULL DEFAULT 0,
    orden TINYINT UNSIGNED DEFAULT NULL,          -- orden de aparición en créditos
    PRIMARY KEY (contenido_id, persona_id, personaje),
    INDEX idx_ca_persona (persona_id),
    CONSTRAINT fk_ca_contenido FOREIGN KEY (contenido_id)
        REFERENCES contenidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_ca_persona FOREIGN KEY (persona_id)
        REFERENCES personas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE contenido_directores (
    contenido_id INT UNSIGNED NOT NULL,
    persona_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (contenido_id, persona_id),
    INDEX idx_cd_persona (persona_id),
    CONSTRAINT fk_cd_contenido FOREIGN KEY (contenido_id)
        REFERENCES contenidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_cd_persona FOREIGN KEY (persona_id)
        REFERENCES personas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================================
-- VISTAS PARA EL CÁLCULO BAYESIANO DEL RANKING
-- =========================================================================
CREATE VIEW v_reacciones_por_resena AS
SELECT rr.resena_id,
       CAST(SUM(rr.tipo = 'LIKE')    AS SIGNED) AS likes,
       CAST(SUM(rr.tipo = 'DISLIKE') AS SIGNED) AS dislikes
FROM reaccion_resenas rr
GROUP BY rr.resena_id;

CREATE VIEW v_resenas_ranking AS
SELECT r.contenido_id,
       r.id AS resena_id,
       r.rating,
       COALESCE(x.likes, 0)    AS likes,
       COALESCE(x.dislikes, 0) AS dislikes,
       DATEDIFF(CURRENT_DATE, r.created_at) AS edad_dias,
       GREATEST(0.25, POW(0.5, DATEDIFF(CURRENT_DATE, r.created_at) / 180))
         * (1 + LEAST(0.5, GREATEST(-0.5,
              (COALESCE(x.likes, 0) - COALESCE(x.dislikes, 0))
              / (COALESCE(x.likes, 0) + COALESCE(x.dislikes, 0) + 1)))) AS peso
FROM resenas r
JOIN contenidos c ON c.id = r.contenido_id AND c.estado = 'APROBADO'
LEFT JOIN v_reacciones_por_resena x ON x.resena_id = r.id;

CREATE VIEW v_ranking_base AS
SELECT contenido_id,
       COUNT(*) AS total_votos,
       SUM(peso * rating) / SUM(peso) AS rating_ponderado
FROM v_resenas_ranking
GROUP BY contenido_id;

CREATE VIEW v_ranking_global AS
SELECT COALESCE(AVG(rating), 5.5) AS promedio_global
FROM v_resenas_ranking;

-- =========================================================================
-- HISTORIAL DE ACTIVIDAD DE USUARIO
-- Registra acciones relevantes (reseñas: creación, edición, eliminación)
-- =========================================================================
CREATE TABLE historial (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    tipo_accion ENUM('RESENA_CREADA', 'RESENA_EDITADA', 'RESENA_ELIMINADA') NOT NULL,
    entidad_tipo VARCHAR(30) NOT NULL DEFAULT 'RESENA',
    entidad_id INT UNSIGNED NOT NULL,
    descripcion VARCHAR(255) DEFAULT NULL,
    metadata JSON DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_historial_usuario_fecha (usuario_id, created_at),
    INDEX idx_historial_usuario_tipo (usuario_id, tipo_accion),
    CONSTRAINT fk_historial_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;