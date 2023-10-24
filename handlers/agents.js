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

const answerAgent = new AnswerAgent();

class ReportAgent extends Agent {
    /*
        Called when generating reports
    */
    constructor() {
        super();
        this.name = 'ReportAgent';
        this.rules = {
            formula: {
                ottaa: [
                    {question: "47neZv1P", answer: "Sí", weight: 0.25}, // A
                    {question: "wVBYaohP", answer: "Cuatro o más", weight: 0.25}, // D
                    {question: "pwJP0k3S", answer: "Armado de frases/desarrollo del lenguaje", weight: 0.25}, // E
                    {question: "gAkBS6Bb", answer: "Sí", weight: 0.25}, // M
                    {question: "wVBYaohP", answer: "Entre dos", weight: 0.15}, //C
                    {question: "gAkBS6Bb", answer: "No", weight: 0.15}, //N
                    {question: "47neZv1P", answer: "No", weight: -0.10}, // B
                    {question: "JJhQjNqq", answer: "Sí", weight: -0.10}, // G
                    {question: "SEoP70yq", answer: "No", weight: -0.10}  // L
                ],
                cboard: [
                    {question: "wVBYaohP", answer: "Cuatro o más", weight: 0.25}, // D
                    {question: "pwJP0k3S", answer: "Armado de frases/desarrollo del lenguaje", weight: 0.25}, // E
                    {question: "JJhQjNqq", answer: "Sí", weight: 0.25}, // G
                    {question: "SEoP70yq", answer: "No", weight: 0.25}, // L
                    {question: "wVBYaohP", answer: "Entre dos", weight: 0.075}, //C
                    {question: "pwJP0k3S", answer: "Iniciación en la comunicación (fase 1 o 2 de PECS)", weight: 0.075}, // F
                    {question: "JJhQjNqq", answer: "No", weight: 0.075}, // H
                    {question: "SEoP70yq", answer: "Sí", weight: 0.075},  // K
                    {question: "gAkBS6Bb", answer: "Sí", weight: -0.15} // M
                ],
                questions: [
                    {question: "wVBYaohP", answer: "Entre dos", weight: 0.075}, //C
                    {question: "pwJP0k3S", answer: "Iniciación en la comunicación (fase 1 o 2 de PECS)", weight: 0.075}, // F
                ]
            }
        }
    }

    calculateSoftware(user){
        const answersFile = readFormAnswersFile("softG01", user);
        if (answersFile.length === 0) return "insufficient";
        const answers = answersFile[answersFile.length-1].answers;
        const answersMapped = Object.fromEntries(answers.map(a => [a.id, a]))
        // run through rules->formula using adding weights to percentage if answer is correct
        const formula = this.rules.formula;
        const scores = {};
        const messages = {}; // NOT IMPLEMENTED YET: each score has a message, and those with most influence will be returned to show in the web as "justifications" for the score for each app
        let allZero = true;
        for (let app in formula) {
            scores[app] = 0;
            for (let question of formula[app]) {
                if (answersMapped[question.question].answer === question.answer) scores[app] += question.weight;
            }
            if (scores[app] > 0) allZero = false; // if at least one app has a positive score, then the user is not "insufficient"
        }
        if (allZero) return "insufficient";
        return {scores, messages};
    }

    calculateHardware(user){
        return "insufficient";
    }

    apply(type, user, data, response) {
        super.apply();
        // console.log('ReportAgent applied');
        data.software = this.calculateSoftware(user);
        data.hardware = this.calculateHardware(user);
        response.data = data;
        return response;
    }
}

const reportAgent = new ReportAgent();

module.exports = { formAgent, answerAgent, reportAgent };