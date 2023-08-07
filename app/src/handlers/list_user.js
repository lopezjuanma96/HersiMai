const { getUserListFilePath, readUserListFile } = require('./files.js')

const listUserHandler = (req, res) => {
    res.status(200).send({
        users: getUserListArr(),
        code: 'success',
        msg: "Se devuelve la lista de usuarios correctamente."
    })
}

const exportUserListHandler = (req, res) => {
    // HERE TRANSFORM DATA TO OTHER FILE TYPE AND EXPORT
    res.status(200).download(getUserListFilePath())
}

const getUserListArr = () => {
    const userList = readUserListFile();
    const userListArr = [];
    for (let code in userList) {
        // HERE ADD VALIDATION
        userListArr.push(userList[code]);
    }
    return userListArr
}

module.exports = { listUserHandler, exportUserListHandler }