export function ok(res, data, message, status = 200) {
  return res.status(status).json({ status: 'success', data, ...(message ? { message } : {}) });
}

export function fail(res, message, status = 400) {
  return res.status(status).json({ status: 'error', message });
}