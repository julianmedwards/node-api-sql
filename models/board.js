'use strict'

module.exports = (sequelize, DataTypes) => {
    const Board = sequelize.define(
        'board',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            boardName: {
                type: DataTypes.STRING,
                required: true,
            },
        },
        {
            paranoid: true,
            underscored: true,
        }
    )
    return Board
}
