const { readUserListFile, saveUserListFile } = require('./files.js')

const newUserHandler = (req, res) => {
    const newUser = req.body;
    // DATA VALILDATION
    const userList = readUserListFile();
    if (userAlreadyExists(newUser, userList)) return res.status(409).send({code:"user-exists", msg:"El usuario ya existe en la base de datos."})

    // CODE GENERATION
    const newUserCode = generateUserCode(userList);

    // DATA STORING
    userList[newUserCode] = {...newUser, userCode: newUserCode}
    saveUserListFile(userList)

    // SEND RESPONSE
    res.status(201).send({code:"created-user", msg:"Se creó un nuevo usuario", data:{code: newUserCode}});
}

const userAlreadyExists = (newUser, userList) => {
    for (let code in userList) {
        if (newUser.userEmail === userList[code].userEmail) return true;
    }
    return false;
}

const generateUserCode = (userList) => {
    let userCode = "";
    do {
        const firstDigit = Math.floor(Math.random() * 9);
        const secondDigit = Math.floor(Math.random() * 9);
        const thirdDigit = Math.floor(Math.random() * 9);
        const fourthDigit = Math.floor(Math.random() * 9);
        userCode = `${firstDigit}${secondDigit}${thirdDigit}${fourthDigit}`;
    } while (userList[userCode]) // The above process is done until userList[userCode] returns undefined, i.e. the userCode does not appear in userList
    return userCode;
}

module.exports = { newUserHandler }