'use strict'

const util = require('../util')

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

    Card.updateSequence = util.updateSequence

    Card.shiftSequence = util.shiftSequence

    return Card
}
