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
