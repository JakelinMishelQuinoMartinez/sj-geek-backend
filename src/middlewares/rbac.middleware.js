export class RbacMiddleware {
  requireAdmin(req, res, next) {
    if (req.user?.rol !== 'ADMIN') {
      return res.status(403).json({ status: 'error', message: 'Se requieren permisos de administrador' });
    }
    return next();
  }
}

const rbacMiddleware = new RbacMiddleware();
export const requireAdmin = rbacMiddleware.requireAdmin.bind(rbacMiddleware);