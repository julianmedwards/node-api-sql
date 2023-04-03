'use strict'

const {Op} = require('sequelize')

module.exports = {
    // Updates all sequences elements after a certain point.
    updateSequence: function (model, startSequence) {
        return new Promise(async (resolve, reject) => {
            const higherSequenced = await model.findAll({
                where: {
                    sequence: {[Op.gt]: startSequence},
                },
                order: [['sequence', 'ASC']],
            })

            if (higherSequenced.length > 0) {
                const sequenced = higherSequenced.map(async (instance, i) => {
                    const updatedInst = await instance.update({
                        sequence: startSequence + i,
                    })
                    return updatedInst
                })

                Promise.all(sequenced).then(() => {
                    resolve()
                })
            } else resolve()
        })
    },

    // Swaps sequence of two adjacent elements.
    shiftSequence: function (model, currentId, sequenceShift) {
        return new Promise(async (resolve, reject) => {
            const currentInstance = await model.findOne({
                where: {id: currentId},
            })

            const nextInstance = await model.findOne({
                where: {sequence: currentInstance.sequence + sequenceShift},
            })

            if (sequenceShift === 1) {
                await currentInstance.increment('sequence')
                await nextInstance.decrement('sequence')
                resolve()
            } else {
                await currentInstance.decrement('sequence')
                await nextInstance.increment('sequence')
                resolve()
            }
        })
    },
}
