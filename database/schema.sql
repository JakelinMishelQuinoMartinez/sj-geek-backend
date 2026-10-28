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
    imagen_url VARCHAR(255) DEFAULT NULL,
    estado ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
    usuario_id INT UNSIGNED NOT NULL,             -- quien lo propuso
    revisado_por INT UNSIGNED DEFAULT NULL,       -- ADMIN que aprobó o rechazó
    revisado_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_contenidos_titulo UNIQUE (titulo),
    CONSTRAINT chk_contenidos_anio CHECK (anio BETWEEN 1888 AND 2100),
    CONSTRAINT chk_contenidos_duracion CHECK (duracion_minutos IS NULL OR duracion_minutos > 0),
    INDEX idx_contenidos_cat_estado (categoria_id, estado),
    INDEX idx_contenidos_tipo (tipo_id),
    INDEX idx_contenidos_estado_fecha (estado, created_at),
    CONSTRAINT fk_contenidos_categoria FOREIGN KEY (categoria_id)
        REFERENCES categorias(id) ON DELETE RESTRICT,
    CONSTRAINT fk_contenidos_tipo FOREIGN KEY (tipo_id)
        REFERENCES tipos_contenido(id) ON DELETE RESTRICT,
    CONSTRAINT fk_contenidos_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE RESTRICT,
    CONSTRAINT fk_contenidos_revisor FOREIGN KEY (revisado_por)
        REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;
