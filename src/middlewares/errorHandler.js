export function notFoundHandler(req, res) {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ status: 'error', message: 'El registro ya existe' });
  }
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({ status: 'error', message: status === 500 ? 'Error interno del servidor' : error.message });
}