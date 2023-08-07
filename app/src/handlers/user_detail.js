const { readUserListFile } = require("./files.js")

const userDetailHandler = (req, res) => {
    const userCode = req.query.code;
    const userDetail = getUserDetail(userCode);
    if (userDetail) return res.status(200).send({
            user: userDetail,
            code: 'success',
            msg: "Se devuelve el detalle del usuario " + userCode + " correctamente." 
        })
    else return res.status(404).send({
        code: 'user-not-found',
        msg: 'El usuario no se encuentra'
    })
}

const getUserDetail = (userCode) => {
    const userList = readUserListFile();
    return userList[userCode];
}

module.exports = { userDetailHandler }