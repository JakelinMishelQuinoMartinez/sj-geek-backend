-- =========================================================================
-- SEEDS DE CATÁLOGOS
-- =========================================================================
INSERT INTO roles (id, nombre, descripcion) VALUES
(1, 'ADMIN', 'Administra categorías y aprueba o rechaza contenido'),
(2, 'USER',  'Propone contenido, reseña y reacciona');

INSERT INTO tipos_contenido (id, nombre) VALUES
(1, 'Pelicula'),
(2, 'Serie'),
(3, 'Anime');
