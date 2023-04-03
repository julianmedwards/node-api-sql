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

        const createBoard = db.boards.create(data)

        createBoard.then((board) => {
            res.send({boardId: board.id})
            next()
        })
    })

    // Get all boards
    server.get('/boards', (req, res, next) => {
        const getBoards = db.boards.findAll({
            include: [
                {
                    model: db.lanes,
                    include: [db.cards],
                },
            ],
            order: [
                [db.lanes, 'sequence', 'ASC'],
                [db.lanes, db.cards, 'sequence', 'ASC'],
            ],
        })

        getBoards.then((boards) => {
            res.send(boards)
            next()
        })
    })

    // Get one board by id
    server.get('/boards/:id', (req, res, next) => {
        const getBoard = db.boards.findOne({
            where: {id: req.params.id},
            include: [
                {
                    model: db.lanes,
                    include: [db.cards],
                },
            ],
            order: [
                [db.lanes, 'sequence', 'ASC'],
                [db.lanes, db.cards, 'sequence', 'ASC'],
            ],
        })

        getBoard.then((boards) => {
            if (boards) {
                res.send(201, boards)
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

        const boardName = req.body.boardName

        const updateLane = db.boards.update(
            {boardName: boardName},
            {
                where: {id: req.params.id},
            }
        )

        updateLane.then(() => {
            res.send(204)
            next()
        })
    })
}
