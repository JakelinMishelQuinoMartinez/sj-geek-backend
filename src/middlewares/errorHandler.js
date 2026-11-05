export class ErrorHandlerMiddleware {
  notFound(req, res) {
    res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
  }

  handle(error, req, res, next) {
    if (res.headersSent) return next(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ status: 'error', message: 'El registro ya existe' });
    }
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ status: 'error', message: status === 500 ? 'Error interno del servidor' : error.message });
  }
}

const errorHandlerMiddleware = new ErrorHandlerMiddleware();
export const notFoundHandler = errorHandlerMiddleware.notFound.bind(errorHandlerMiddleware);
export const errorHandler = errorHandlerMiddleware.handle.bind(errorHandlerMiddleware);