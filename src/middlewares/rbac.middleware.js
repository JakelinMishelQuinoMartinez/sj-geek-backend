export function requireAdmin(req, res, next) {
  if (req.user?.rol !== 'ADMIN') {
    return res.status(403).json({ status: 'error', message: 'Se requieren permisos de administrador' });
  }
  return next();
}