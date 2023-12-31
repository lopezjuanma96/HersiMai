const { getUserListFilePath, readUserListFile, deleteUserListFile, listFormFiles, deleteAllFormAnswersFiles } = require('./files.js')

const listUserHandler = (req, res) => {
    res.status(200).send({
        data: getUserListArr(),
        code: 'success',
        msg: "Se devuelve la lista de usuarios correctamente."
    })
}

const exportUserListHandler = (req, res) => {
    // HERE TRANSFORM DATA TO OTHER FILE TYPE AND EXPORT
    res.status(200).download(getUserListFilePath())
}

const removeUserListHandler = (req, res) => {
    listFormFiles().forEach(formId => {
        deleteAllFormAnswersFiles(formId);
    });
    deleteUserListFile();
    res.status(200).send({
        code: 'success',
        msg: "Se ha eliminado la lista de usuarios correctamente."
    })
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

module.exports = { listUserHandler, exportUserListHandler, removeUserListHandler }