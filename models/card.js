'use strict'

module.exports = (sequelize, DataTypes) => {
    const Card = sequelize.define(
        'card',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            cardName: {
                type: DataTypes.STRING,
                required: true,
            },
            cardDescr: {
                type: DataTypes.STRING,
                required: false,
                defaultValue: '',
            },
            sequence: {
                type: DataTypes.INTEGER,
            },
        },
        {
            paranoid: true,
            underscored: true,
        }
    )
    return Card
}

// CardSchema.statics.shiftSequence = async function (
//     lane,
//     movedCard,
//     sequenceShift
// ) {
//     const cards = lane.cards
//     const newSequence = movedCard.sequence + sequenceShift

//     if (cards.length < 2) {
//         throw new errors.InternalError(
//             'Called Card.shiftSequence without multiple cards.'
//         )
//     }

//     const otherCard = lane.cards.find((card) => {
//         return card.sequence === newSequence
//     })

//     otherCard.sequence = movedCard.sequence
//     movedCard.sequence = newSequence
// }

// CardSchema.statics.resequence = function (cards, startSequence) {
//     for (let i = startSequence; i < cards.length; i++) {
//         cards[i].sequence = i
//     }
// }
