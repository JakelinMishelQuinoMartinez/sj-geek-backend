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

INSERT INTO categorias (nombre, descripcion) VALUES
('Sci-Fi',       'Ciencia ficción y futuros distópicos'),
('Acción',       'Persecuciones, combates y alta intensidad'),
('Drama',        'Historias centradas en conflictos humanos'),
('Comedia',      'Humor y situaciones cómicas'),
('Terror',       'Miedo, suspenso y lo sobrenatural'),
('Fantasía',     'Mundos mágicos y criaturas fantásticas'),
('Superhéroes',  'Cómics y salvadores del universo'),
('Aventura',     'Viajes, exploración y misiones'),
('Misterio',     'Intriga e investigación'),
('Romance',      'Historias de amor');
