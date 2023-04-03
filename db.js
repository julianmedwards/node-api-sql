'use strict'

const Sequelize = require('sequelize')
const config = require('./config')
const sequelize = new Sequelize(
    config.db.name,
    config.db.username,
    config.db.password,
    {
        host: config.db.host,
        port: config.db.port,
        dialect: config.db.dialect,
        define: {
            underscored: true,
        },
    }
)

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection successful.')
    })
    .catch(() => {
        console.error('Error connecting to database.')
    })

// Connect all the models/tables in the database to a db object,
// so everything is accessible via one object
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// Models/tables
db.boards = require('./models/board.js')(sequelize, Sequelize)
db.lanes = require('./models/lane.js')(sequelize, Sequelize)
db.cards = require('./models/card.js')(sequelize, Sequelize)

// Relations
db.lanes.belongsTo(db.boards)
db.boards.hasMany(db.lanes, {
    foreignKey: 'boardId',
})

db.cards.belongsTo(db.lanes)
db.lanes.hasMany(db.cards, {
    foreignKey: 'laneId',
})

module.exports = db
