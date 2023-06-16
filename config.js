module.exports = {
    name: 'API',
    env: process.env.NODE_ENV,
    port: process.env.API_PORT,
    db: {
        name: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT,
        dialect: process.env.DATABASE_DIALECT || 'mysql',
    },
}
