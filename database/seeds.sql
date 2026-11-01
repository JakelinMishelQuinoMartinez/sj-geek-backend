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

INSERT INTO paises (nombre, codigo_iso) VALUES
('Estados Unidos', 'US'),
('Japón',          'JP'),
('Canadá',         'CA'),
('Reino Unido',    'GB'),
('México',         'MX'),
('España',         'ES'),
('Corea del Sur',  'KR'),
('Guatemala',      'GT');

INSERT INTO usuarios (id, nombre, email, password_hash, rol_id)
VALUES
(1, 'Admin S&J-GEEK', 'admin@sjgeek.com', '$2b$10$5WUj6dds4s6WQJ38WYFZyeUI36R91qZr5ySa.G960kN3RWJyK7fDO', 1),
(2, 'Geek Fan', 'usuario@sjgeek.com', '$2b$10$5WUj6dds4s6WQJ38WYFZyeUI36R91qZr5ySa.G960kN3RWJyK7fDO', 2);

INSERT INTO contenidos
(id, titulo, sinopsis, categoria_id, tipo_id, anio, duracion_minutos, clasificacion, imagen_url, estado, usuario_id)
VALUES
(1, 'The Matrix', 'Un programador descubre que la realidad es una simulacion creada por maquinas inteligentes.', 1, 1, 1999, 136, '+16', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 'APROBADO', 1),
(2, 'Interstellar', 'Un equipo de exploradores viaja por un agujero de gusano para asegurar la supervivencia de la humanidad.', 1, 1, 2014, 169, '+13', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'APROBADO', 1),
(3, 'Deadpool', 'Un mercenario adquiere poderes de curacion acelerada tras un experimento y busca venganza.', 2, 1, 2016, 108, '+18', 'https://image.tmdb.org/t/p/w500/fSRb7vyIP8rQpL0I47P3qUsRIne.jpg', 'APROBADO', 1),
(4, 'Rick and Morty', 'Un cientifico arrastra a su nieto a aventuras peligrosas por dimensiones paralelas.', 2, 2, 2013, 22, '+18', 'https://image.tmdb.org/t/p/w500/8kOWDBK6XlPUzckuHDo3wwVRFwt.jpg', 'APROBADO', 2),
(5, 'The Dark Knight', 'Batman enfrenta al Joker, un criminal anarquista que busca sumergir a Gotham en el caos.', 7, 1, 2008, 152, '+13', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'APROBADO', 1),
(6, 'Stranger Things', 'La desaparicion de un niño lleva a descubrir experimentos secretos y fuerzas sobrenaturales.', 9, 2, 2016, 50, '+16', 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', 'APROBADO', 2),
(7, 'Spider-Man: Into the Spider-Verse', 'Miles Morales se convierte en Spider-Man y conoce heroes de otras dimensiones.', 7, 1, 2018, 117, 'TP', 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg', 'APROBADO', 1),
(8, 'The Lord of the Rings', 'Un hobbit emprende un viaje para destruir el poderoso Anillo Unico.', 6, 1, 2001, 178, '+13', 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', 'APROBADO', 1),
(9, 'Arcane', 'Dos hermanas luchan en bandos opuestos mientras Piltóver y Zaun entran en conflicto.', 8, 2, 2021, 41, '+16', 'https://image.tmdb.org/t/p/w500/abf8tHznhSvl9BAElD2cQeRr7do.jpg', 'APROBADO', 2),
(10, 'Cyberpunk: Edgerunners', 'Un joven de las calles se convierte en mercenario cibernético para sobrevivir en Night City.', 2, 3, 2022, 24, '+18', 'https://cdn.myanimelist.net/images/anime/1818/126435l.jpg', 'APROBADO', 2),
(11, 'Neon Genesis Evangelion', 'Jóvenes pilotos controlan mechas biomecánicos para defender a la humanidad.', 6, 3, 1995, 25, '+16', 'https://cdn.myanimelist.net/images/anime/1314/108941l.jpg', 'APROBADO', 1),
(12, 'One Punch Man', 'Saitama derrota cualquier enemigo de un golpe y sufre por la falta de retos.', 2, 3, 2015, 24, '+13', 'https://cdn.myanimelist.net/images/anime/12/76049l.jpg', 'APROBADO', 2);

INSERT INTO resenas (contenido_id, usuario_id, titulo_resena, comentario, rating) VALUES
(1, 1, 'Obra imprescindible', 'Una película visionaria que revolucionó la ciencia ficción.', 10),
(1, 2, 'Clásico de ciencia ficción', 'Su propuesta visual y filosófica sigue vigente.', 9),
(2, 1, 'Imponente y emotiva', 'Una experiencia memorable con una banda sonora extraordinaria.', 9),
(4, 2, 'Comedia interdimensional', 'Muy creativa, irreverente y divertida.', 10),
(5, 1, 'Batman en su mejor historia', 'El Joker ofrece una antagonista memorable.', 10),
(7, 2, 'Animación extraordinaria', 'El estilo visual logra una identidad única.', 10),
(9, 2, 'Serie imperdible', 'Una producción cuidada con personajes complejos.', 9);

UPDATE contenido_estadisticas ce
JOIN (
  SELECT contenido_id, COUNT(*) AS votos, SUM(rating) AS suma, SUM(rating >= 6) AS recomendadas
  FROM resenas GROUP BY contenido_id
) r ON r.contenido_id = ce.contenido_id
SET ce.total_votos = r.votos, ce.suma_ratings = r.suma, ce.total_recomendadas = r.recomendadas;