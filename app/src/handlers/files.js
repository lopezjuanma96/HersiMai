const { readFileSync, writeFileSync } = require("fs");

const DATA_DIR = __dirname + "/../data"
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

const getFormFilePath = (formId) => `${FORMS_DIR}/${formId}.json`;

const readFormFile = (formId) => {
    const fileText = readFileSync(getFormFilePath(formId), { encoding : "utf-8"});
    if (fileText === "") return {}
    return JSON.parse(fileText) || {};
}

const saveFormFile = (formId, form) => {
    const fileText = JSON.stringify(form)
    writeFileSync(getFormFilePath(formId), fileText, {encoding: "utf-8"});
}

const getFormAnswersFilePath = (formId, code) => `${DATA_DIR}/${code}_answers/${code}_${formId}_answers.json` 

const readFormAnswersFile = (formId, code) => {
    const fileText = readFileSync(getFormAnswersFilePath(formId, code), { encoding : "utf-8"});
    if (fileText === "") return [];
    return JSON.parse(fileText) || [];
}

const saveFormAnswersFile = (formId, code, answers) => {
    const fileText = JSON.stringify(answers)
    writeFileSync(getFormAnswersFilePath(formId, code), fileText, {encoding: "utf-8"})
}

module.exports = {
    getUserListFilePath, readUserListFile, saveUserListFile, 
    getFormFilePath, readFormFile, saveFormFile,
    getFormAnswersFilePath, readFormAnswersFile, saveFormAnswersFile
}