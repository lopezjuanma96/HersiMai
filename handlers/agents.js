const { readFormAnswersFile } = require("./files.js");

class Agent {
    constructor() {
        this.name = 'Agent';
        this.rules = {};
    }

    apply() {
        if (this.name === 'Agent') throw new Error('Cannot instantiate abstract class');
    }
}

class UserAgent extends Agent {
    /*
        Called before responding to the request for user detail
    */
    constructor() {
        super();
        this.name = 'UserAgent';
        this.rules = {

        }
    }

    apply() {
        super.apply();
        console.log('UserAgent applied');
    }
}

class FormAgent extends Agent {
    /*
        Called before responding to requests for forms
    */

    constructor() {
        super();
        this.name = 'FormAgent';
        this.rules = {
            "GET": {
                "em00": (user, data, response) => {
                    const motG01AnswersObject = readFormAnswersFile("motG01", user);
                    if (motG01AnswersObject.length === 0) {
                        data.disabled = true;
                        response.formData = data;
                        return response;
                    }
                    const motG01Answers = motG01AnswersObject[motG01AnswersObject.length - 1];
                    const canPointQuestionId = "sIh2a0Sw";
                    const canPointQuestion = motG01Answers.answers.find(a => a.id === canPointQuestionId);
                    if (canPointQuestion.answer === "Sí") data.disabled = false;
                    else if (canPointQuestion.answer === "No") data.disabled = true;
                    response.formData = data;
                    return response;
                },
                "em01": (user, data, response) => {
                    const motG01AnswersObject = readFormAnswersFile("motG01", user);
                    if (motG01AnswersObject.length === 0) {
                        data.disabled = true;
                        response.formData = data;
                        return response;
                    }
                    const motG01Answers = motG01AnswersObject[motG01AnswersObject.length - 1];
                    const canPressQuestionId = "4uC28XYW";
                    const canPressQuestion = motG01Answers.answers.find(a => a.id === canPressQuestionId);
                    if (canPressQuestion.answer === "Sí") data.disabled = false;
                    else if (canPressQuestion.answer === "No") data.disabled = true;
                    response.formData = data;
                    return response;
                },
                "em02": (user, data, response) => {
                    const motG01AnswersObject = readFormAnswersFile("motG01", user);
                    if (motG01AnswersObject.length === 0) {
                        data.disabled = true;
                        response.formData = data;
                        return response;
                    }
                    const motG01Answers = motG01AnswersObject[motG01AnswersObject.length - 1];
                    const headMovementQuestionId = "mUXFsHPj";
                    const headMovementQuestion = motG01Answers.answers.find(a => a.id === headMovementQuestionId);
                    if (headMovementQuestion.answer === "Sí") data.disabled = false;
                    else if (headMovementQuestion.answer === "No") data.disabled = true;
                    response.formData = data;
                    return response;
                },
                "em03": (user, data, response) => {
                    const motG01AnswersObject = readFormAnswersFile("motG01", user);
                    if (motG01AnswersObject.length === 0) {
                        data.disabled = true;
                        response.formData = data;
                        return response;
                    }
                    const motG01Answers = motG01AnswersObject[motG01AnswersObject.length - 1];
                    const nistagmoQuestionId = "geDTuWoo";
                    const nistagmoQuestion = motG01Answers.answers.find(a => a.id === nistagmoQuestionId);
                    if (nistagmoQuestion.answer === "Sí") data.disabled = true;
                    else if (nistagmoQuestion.answer === "No") data.disabled = false;
                    response.formData = data;
                    return response;
                },
            }
        }
    }

    apply(type, form, user, data, response) {
        super.apply();
        // console.log('FormAgent applied');
        if (!this.rules[type]) return response;
        if (!this.rules[type][form]) return response; 
        return this.rules[type][form](user, data, response);
    }
}

const formAgent = new FormAgent();

class AnswerAgent extends Agent {
    /*
        Called before responding to requests for form answers
    */
    constructor() {
        super();
        this.name = 'AnswerAgent';
        this.rules = {
            "GET": {
            },
            "POST": {
                "prelimF01": (user, data, response) => {
                    const usePhoneQuestionId = "JSkgkzCm";
                    const usePhoneQuestion = data.answers.find(a => a.id === usePhoneQuestionId);
                    if (usePhoneQuestion.answer === "Sí") response.redirect = "softG01"; // if user can use phone, redirect to software preliminar
                    else if (usePhoneQuestion.answer === "No") response.redirect = "motG01"; // if user can't use phone, redirect to motor preliminar
                    return response;
                },
                "motG01": (user, data, response) => {
                    const canPointQuestionId = "sIh2a0Sw";
                    const canPressQuestionId = "4uC28XYW";
                    const canPressQuestion = data.answers.find(a => a.id === canPressQuestionId);
                    const canPointQuestion = data.answers.find(a => a.id === canPointQuestionId);
                    if (canPressQuestion.answer === "Sí" || canPointQuestion.answer === "Sí") response.redirect = "softG01"; // if can't use phone but can point or press, maybe can use phone with hw
                    return response;
                }
            }
        }
    }

    apply(type, form, user, data, response) {
        super.apply();
        // console.log('AnswerAgent applied');
        if (!this.rules[type]) return response;
        if (!this.rules[type][form]) return response; 
        return this.rules[type][form](user, data, response);
    }
}

class ReportAgent extends Agent {
    /*
        Called when generating reports
    */
    constructor() {
        super();
        this.name = 'ReportAgent';
        this.rules = {

        }
    }

    apply() {
        super.apply();
        console.log('ReportAgent applied');
    }
}

const answerAgent = new AnswerAgent();

module.exports = { formAgent, answerAgent };