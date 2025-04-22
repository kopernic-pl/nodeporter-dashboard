import logger from './logger';

/**
 * Logs HTTP access information, similar to Apache access logs, but as structured JSON.
 * Call at the top of each API handler: accessLog(req, res)
 */
export default function accessLog(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const { method, url, headers, socket } = req;
    const statusCode = res.statusCode;
    // Content-Length may not always be set
    const contentLength = (res.getHeader && res.getHeader('content-length')) || 0;

    logger.info(
      {
        type: 'access',
        remote_addr: socket?.remoteAddress,
        method,
        url,
        status: statusCode,
        bytes: contentLength,
        referrer: headers['referer'] || headers['referrer'],
        user_agent: headers['user-agent'],
        duration_ms: durationMs.toFixed(2),
      },
      `${method} ${url} ${statusCode} ${contentLength}B`
    );
  });

  if (next) next();
}
