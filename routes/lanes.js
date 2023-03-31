'use strict'

const errors = require('restify-errors')

const util = require('../util')

module.exports = (server, db) => {
    // Create a new lane
    server.post('/boards/:boardId/lanes', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            )
        }

        const boardId = req.params.boardId
        const laneName = req.body.laneName
        const getSequence = db.lanes.count({
            where: {
                boardId: boardId,
            },
        })

        getSequence.then((sequence) => {
            db.lanes
                .create({
                    laneName: laneName,
                    boardId: boardId,
                    sequence: sequence,
                })
                .then((lane) => {
                    res.send(201, {laneId: lane.id})
                    next()
                })
        })
    })

    // Get all lanes in a board
    server.get('/boards/:boardId/lanes', (req, res, next) => {
        db.lanes
            .findAll({
                where: {boardId: req.params.boardId},
                order: [['sequence', ASC]],
            })
            .then((lanes) => {
                res.send(lanes)
                next()
            })
    })

    // Update lane attributes
    server.patch('/boards/:boardId/lanes/:laneId', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            )
        }

        let data = req.body

        db.lanes.update({})

        Board.findById(req.params.boardId, (err, board) => {
            if (err) {
                console.error(err)
                return next(new errors.InternalError(err.message))
            } else {
                const updatedLane = board.lanes.id(req.params.laneId)

                if (data.laneName) {
                    updatedLane.laneName = data.laneName
                }

                if (data.sequenceShift) {
                    Lane.shiftSequence(board, updatedLane, data.sequenceShift)
                }

                board.markModified('lanes')
                board.save(function (err) {
                    if (err) {
                        console.error(err)
                        return next(new errors.InternalError(err.message))
                    }

                    res.send(204)
                    next()
                })
            }
        })
    })

    // Delete a lane and move its cards to a new lane
    server.patch(
        '/boards/:boardId/lanes/:laneId/delete-and-transfer/:destinationLaneId',
        (req, res, next) => {
            Board.findById(req.params.boardId, (err, board) => {
                if (err) {
                    console.error(err)
                    return next(new errors.InternalError(err.message))
                } else {
                    const startLane = board.lanes.id(req.params.laneId)
                    const destLane = board.lanes.id(
                        req.params.destinationLaneId
                    )
                    const cards = startLane.cards
                    const nextSequence = destLane.cards.length

                    cards.forEach((card) => {
                        destLane.cards.push(card.toObject())
                    })

                    Lane.resequence(board.lanes, startLane.sequence)

                    Card.resequence(destLane.cards, nextSequence)

                    startLane.remove()

                    board.save(function (err) {
                        if (err) {
                            console.error(err)
                            return next(new errors.InternalError(err.message))
                        }

                        res.setHeader('Access-Control-Allow-Origin', '*')
                        res.send(204)
                        next()
                    })
                }
            })
        }
    )

    // Delete a lane
    server.del('/boards/:boardId/lanes/:laneId', (req, res, next) => {
        let startSequence

        const getLane = db.lanes.findOne({
            where: {id: req.params.laneId},
        })

        getLane.then((lane) => {
            const startSequence = lane.sequence

            const updateSequence = db.lanes.updateSequence(
                db.lanes,
                startSequence
            )

            updateSequence.then(() => {
                lane.destroy().then(() => {
                    res.send(204)
                    next()
                })
            })
        })
    })
}
