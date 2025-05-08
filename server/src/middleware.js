export function loggerMiddleware(req, res, next) {
    console.log(`[${req.ip}:${Date.now()}] - ${req.method} ${req.url}`)
    next()
}