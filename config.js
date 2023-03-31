module.exports = {
    name: 'API',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    base_url: process.env.BASE_URL || 'http://localhost:5000',
    db: {
        url: process.env.DATABASE_URL || 'Mysql@localhost:3306',
        name: process.env.DATABASE_NAME || 'trello-boards',
        host: process.env.DATABASE_HOST || 'localhost',
        username: process.env.DATABASE_USERNAME || 'root',
        password: process.env.DATABASE_PASSWORD || 'password',
        port: process.env.DATABASE_PORT || 3306,
        dialect: process.env.DATABASE_DIALECT || 'mysql',
    },
}
