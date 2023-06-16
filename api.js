/**
 * Module Dependencies
 */
const https = require('https')
const fs = require('fs')
const config = require('./config')
const restify = require('restify')
require('restify').plugins

/**
 * Initialize Server
 */
const server = restify.createServer({
    name: config.name,
    version: config.version,
})

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
    if (process.env.NODE_ENV === 'development') {
        startUnencryptedServer()
    } else {
        startEncryptedServer()
    }
})

function startUnencryptedServer() {
    server.listen(config.port, () => {
        console.log(`Server is listening on port ${config.port}`)
    })
}

function startEncryptedServer() {
    if (Number(config.port) !== 443) {
        throw new Error(
            'Attempting to start encrypted server on port other than 443!'
        )
    }

    // Get Let's Encrypt SSL cert on Linux
    const options = {
        key: fs.readFileSync(`/etc/certs/ssl/privkey.pem`),
        cert: fs.readFileSync(`/etc/certs/ssl/fullchain.pem`),
        ca: fs.readFileSync('/etc/certs/ssl/chain.pem'),
    }

    const httpsServer = https.createServer(options, server)

    httpsServer.listen(config.port, () => {
        console.log('HTTPS Server running on port 443')
    })
}
