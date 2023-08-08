const { readFileSync, writeFileSync } = require("fs");
const USER_LIST_PATH = __dirname + "/../data/user_list.json"
const FORMS_DIR = __dirname + "/../data/forms"

const getUserListFilePath = () => USER_LIST_PATH;

const readUserListFile = () => {
    const fileText = readFileSync(USER_LIST_PATH, { encoding : "utf-8"}); // this only reads the text in the file
    if (fileText === "") return {}
    return JSON.parse(fileText) || {}; // now we make Node understand what that text means
}

const saveUserListFile = (userList) => {
    const fileText = JSON.stringify(userList) // de-understand the userList back into a string of text in the JSON format
    writeFileSync(USER_LIST_PATH, fileText, {encoding: "utf-8"})
}

const getFormsFileDir = () => FORMS_DIR;

const readFormFile = (formId) => {
    const fileText = readFileSync(`${FORMS_DIR}/${formId}.json`, { encoding : "utf-8"});
    if (fileText === "") return {}
    return JSON.parse(fileText) || {};
}

module.exports = { getUserListFilePath, readUserListFile, saveUserListFile, getFormsFileDir, readFormFile }