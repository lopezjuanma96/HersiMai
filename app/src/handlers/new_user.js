const { readFileSync, writeFileSync } = require("fs");

const USER_LIST_PATH = __dirname + "/../data/user_list.json"

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

const readUserListFile = () => {
    const fileText = readFileSync(USER_LIST_PATH, { encoding : "utf-8"}); // this only reads the text in the file
    if (fileText === "") return {}
    return JSON.parse(fileText) || {}; // now we make Node understand what that text means
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

const saveUserListFile = (userList) => {
    const fileText = JSON.stringify(userList) // de-understand the userList back into a string of text in the JSON format
    writeFileSync(USER_LIST_PATH, fileText, {encoding: "utf-8"})
}

module.exports = { newUserHandler }