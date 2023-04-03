'use strict'

const errors = require('restify-errors')

module.exports = (server, db) => {
    // Create a new board
    server.post('/boards', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            )
        }

        let data = req.body

        db.boards.create(data).then((board) => {
            res.send({boardId: board.id})
            next()
        })
    })

    // Get all boards
    server.get('/boards', (req, res, next) => {
        db.boards
            .findAll({
                include: [
                    {
                        model: db.lanes,
                        include: db.cards,
                        order: [[db.cards, 'sequence', 'ASC']],
                    },
                ],
                // This reorders lanes and boards?
                order: [[db.lanes, 'sequence', 'ASC']],
            })
            .then((boards) => {
                res.send(boards)
                next()
            })
    })

    // Get one board by id
    server.get('/boards/:id', (req, res, next) => {
        db.boards
            .findOne({
                where: {id: req.params.id},
                include: [{model: db.lanes, include: db.cards}],
                order: [[db.lanes, 'sequence', 'ASC']],
            })
            .then((boards) => {
                if (boards) {
                    res.send(boards)
                } else {
                    res.send(404)
                }
                next()
            })
    })

    // Update board attributes (name)
    server.patch('/boards/:id', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            )
        }

        let data = req.body

        db.boards
            .update(
                {boardName: data.boardName},
                {
                    where: {id: req.params.id},
                }
            )
            .then(() => {
                res.send(204)
                next()
            })
    })
}
