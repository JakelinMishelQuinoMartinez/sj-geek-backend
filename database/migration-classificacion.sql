ALTER TABLE contenidos
  ADD COLUMN clasificacion VARCHAR(3) NOT NULL DEFAULT '+13' AFTER duracion_minutos;
