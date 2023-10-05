const { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } = require("fs");

const DATA_DIR = __dirname + "/../data"
const USER_LIST_PATH = __dirname + "/../data/user_list.json"
const FORMS_DIR = __dirname + "/../data/forms"

const getUserListFilePath = () => USER_LIST_PATH;

const readUserListFile = () => {
    try {
        const fileText = readFileSync(getUserListFilePath(), { encoding : "utf-8"}); // this only reads the text in the file
        if (fileText === "") return {}
        return JSON.parse(fileText) || {}; // now we make Node understand what that text means
    } catch (e) {
        if (e.code === "ENOENT") return {};
        else throw e;
    }
}

const saveUserListFile = (userList) => {
    const fileText = JSON.stringify(userList) // de-understand the userList back into a string of text in the JSON format
    checkMakeDirs(getUserListFilePath());
    writeFileSync(getUserListFilePath(), fileText, {encoding: "utf-8"})
}

const deleteUserListFile = () => {
    try {
        // instead of deleting the file, we just overwrite it with an empty object
        saveUserListFile({});
    } catch (e) {
        if (e.code === "ENOENT") return; // if the file doesn't exist, we don't need to delete it
        else throw e;
    }
}

const getFormFileDir = () => FORMS_DIR;

const listFormFiles = () => {
    try {
        const files = readdirSync(getFormFileDir());
        return files.map(file => file.replace(".json", ""));
    } catch (e) {
        if (e.code === "ENOENT") return [];
        else throw e;
    }
}

const getFormFilePath = (formId) => `${FORMS_DIR}/${formId}.json`;

const readFormFile = (formId) => {
    try {    
        const fileText = readFileSync(getFormFilePath(formId), { encoding : "utf-8"});
        if (fileText === "") return {}
        return JSON.parse(fileText) || {};
    } catch (e) {
        if (e.code === "ENOENT") return {};
        else throw e;
    }
}

const saveFormFile = (formId, form) => {
    const fileText = JSON.stringify(form);
    checkMakeDirs(getFormFilePath(formId));
    writeFileSync(getFormFilePath(formId), fileText, {encoding: "utf-8"});
}

const getFormAnswersFilePath = (formId, code) => `${DATA_DIR}/${code}_answers/${code}_${formId}_answers.json` 

const readFormAnswersFile = (formId, code) => {
    try {
        const fileText = readFileSync(getFormAnswersFilePath(formId, code), { encoding : "utf-8"});
        if (fileText === "") return [];
        return JSON.parse(fileText) || [];
    } catch (e) {
        if (e.code === "ENOENT") return [];
        else throw e;
    }
}

const saveFormAnswersFile = (formId, code, answers) => {
    const fileText = JSON.stringify(answers);
    checkMakeDirs(getFormAnswersFilePath(formId, code));
    writeFileSync(getFormAnswersFilePath(formId, code), fileText, {encoding: "utf-8"});
}

const deleteFormAnswersFile = (formId, code) => {
    try {
        unlinkSync(getFormAnswersFilePath(formId, code));
    } catch (e) {
        if (e.code === "ENOENT") return; // if the file doesn't exist, we don't need to delete it
        else throw e;
    }
}

const deleteAllFormAnswersFiles = (formId) => {
    /**
     * deletes all form answers fot that form id
     */
    const userList = readUserListFile();
    for (let code in userList) {
        deleteFormAnswersFile(formId, code);
    }
}

const checkMakeDirs = (path) => {
    const dirs = path.split("/");
    let dir = "";
    for (let i = 0; i < dirs.length - 1; i++) {
        dir += dirs[i] + "/";
        if (!existsSync(dir)) mkdirSync(dir);
    }
}

module.exports = {
    getUserListFilePath, readUserListFile, saveUserListFile, deleteUserListFile,
    getFormFileDir, listFormFiles,
    getFormFilePath, readFormFile, saveFormFile,
    getFormAnswersFilePath, readFormAnswersFile, saveFormAnswersFile, deleteFormAnswersFile, deleteAllFormAnswersFiles
}