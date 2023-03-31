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
// BoardSchema.statics.sequenceLanes = function (board) {
//     board.lanes.sort((a, b) => {
//         if (a.sequence < b.sequence) {
//             return -1
//         }
//         if (a.sequence > b.sequence) {
//             return 1
//         }
//     })

//     board.lanes.forEach((lane) => {
//         lane.cards.sort((a, b) => {
//             if (a.sequence < b.sequence) {
//                 return -1
//             }
//             if (a.sequence > b.sequence) {
//                 return 1
//             }
//         })
//     })
// }
