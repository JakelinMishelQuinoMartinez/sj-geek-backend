export class ResponseHandler {
  ok(res, data, message, status = 200) {
    return res.status(status).json({ status: 'success', data, ...(message ? { message } : {}) });
  }

  fail(res, message, status = 400) {
    return res.status(status).json({ status: 'error', message });
  }
}

const responseHandler = new ResponseHandler();
export const ok = (...args) => responseHandler.ok(...args);
export const fail = (...args) => responseHandler.fail(...args);