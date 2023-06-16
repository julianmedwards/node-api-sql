/**
 * Module Dependencies
 */
const fs = require('fs')
const config = require('./config')
const restify = require('restify')
require('restify').plugins

/**
 * Initialize Server
 */

const options = {
    name: config.name,
    version: config.version,
}

if (process.env.NODE_ENV === 'production') {
    if (Number(config.port) === 443) {
        // Get Let's Encrypt SSL cert on Linux
        options.key = fs.readFileSync(
            `/etc/letsencrypt/live/${config.domain}/privkey.pem`
        )
        options.certificate = fs.readFileSync(
            `/etc/letsencrypt/live/${config.domain}/fullchain.pem`
        )
        options.ca = fs.readFileSync(
            `/etc/letsencrypt/live/${config.domain}/chain.pem`
        )
    } else {
        throw new Error(
            'Attempting to start production server on non-HTTPS port!'
        )
    }
}

const server = restify.createServer(options)

/**
 * Middleware
 */
server.pre(function crossOrigin(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods'
    )
    return next()
})
server.opts('*', (req, res, next) => {
    res.header('Access-Control-Allow-Methods', '*')
    res.send(204)
    return next()
})
server.use(restify.plugins.jsonBodyParser({ mapParams: true }))
server.use(restify.plugins.queryParser({ mapParams: true }))

/**
 * Sync DB, Require Routes, Start Server
 */
const db = require('./db.js')
require('./routes/index')(server, db)

// drop and resync with { force: true },
db.sequelize.sync().then(() => {
    server.listen(config.port, () => {
        console.log(`Server is listening on port ${config.port}`)
    })
})
