module.exports = (server, db) => {
    require('./lanes')(server, db)
    require('./boards')(server, db)
    require('./cards')(server, db)
}
