'use strict'

const errors = require('restify-errors')

module.exports = (server, db) => {
    // Create a new card
    server.post('/boards/:boardId/lanes/:laneId/cards', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            )
        }

        const laneId = req.params.laneId
        const attributes = {cardName: req.body.cardName, laneId: laneId}
        if (req.body.cardDescr) {
            attributes.cardDescr = req.body.cardDescr
        }

        const getSequence = db.cards.count({
            where: {
                laneId: laneId,
            },
        })

        getSequence.then((sequence) => {
            attributes.sequence = sequence
            const createCard = db.cards.create(attributes)

            createCard.then((card) => {
                res.send(201, {cardId: card.id})
                next()
            })
        })
    })

    // Get all cards in a lane
    server.get('/boards/:boardId/lanes/:laneId/cards', (req, res, next) => {
        const getCards = db.cards.findAll({
            where: {laneId: req.params.laneId},
            order: [['sequence', ASC]],
        })

        getCards.then((cards) => {
            res.send(cards)
            next()
        })
    })

    // Update card attributes or sequence
    server.patch(
        '/boards/:boardId/lanes/:laneId/cards/:cardId',
        (req, res, next) => {
            if (!req.is('application/json')) {
                return next(
                    new errors.InvalidContentError("Expects 'application/json'")
                )
            }

            const data = req.body
            const cardId = req.params.cardId
            let updates = {}

            if (data.cardName) {
                updates.cardName = data.cardName
            }
            if (data.cardDescr) {
                updates.cardDescr = data.cardDescr
            }

            const updateCard = db.cards.update(updates, {
                where: {
                    id: cardId,
                },
            })

            updateCard.then(() => {
                const sequenceUpdate = new Promise((resolve, reject) => {
                    if (data.sequenceShift) {
                        const finished = db.cards.shiftSequence(
                            db.cards,
                            'laneId',
                            req.params.laneId,
                            cardId,
                            data.sequenceShift
                        )
                        finished.then(() => {
                            resolve()
                        })
                    } else {
                        resolve()
                    }
                })

                sequenceUpdate.then(() => {
                    res.send(204)
                    next()
                })
            })
        }
    )

    // Move card to a new lane
    server.patch(
        '/boards/:boardId/lanes/:laneId/cards/:cardId/move-to-lane/:destinationLaneId',
        (req, res, next) => {
            const getCard = db.cards.findOne({
                where: {id: req.params.cardId},
            })

            getCard.then((card) => {
                const startSequence = card.sequence

                const updateSequence = db.cards.updateSequence(
                    db.cards,
                    'laneId',
                    req.params.laneId,
                    startSequence
                )

                const getNewSequence = db.cards.count({
                    where: {laneId: req.params.destinationLaneId},
                })

                Promise.all([updateSequence, getNewSequence]).then((vals) => {
                    const updateAssoc = card.update({
                        laneId: req.params.destinationLaneId,
                        sequence: vals[1],
                    })

                    updateAssoc.then(() => {
                        res.send(204)
                        next()
                    })
                })
            })
        }
    )

    // Delete a card
    server.del(
        '/boards/:boardId/lanes/:laneId/cards/:cardId',
        (req, res, next) => {
            const getCard = db.cards.findOne({
                where: {id: req.params.cardId},
            })

            getCard.then((card) => {
                const startSequence = card.sequence

                const updateSequence = db.cards.updateSequence(
                    db.cards,
                    'laneId',
                    req.params.laneId,
                    startSequence
                )

                updateSequence.then(() => {
                    const destroy = card.destroy()

                    destroy.then(() => {
                        res.send(204)
                        next()
                    })
                })
            })
        }
    )
}
