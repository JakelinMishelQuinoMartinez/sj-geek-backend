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