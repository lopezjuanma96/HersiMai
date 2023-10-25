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

        reference:

        OTTAA:
            Ya que seleccionó:
                A: Predectibilidad, otorga una interfaz dinámica recomendando pictogramas relacionados al pictograma seleccionado. 
                D: Cuatro o más estímulos, la interfaz principal de OTTAA muestra siempre 4 pictogramas. Esta cantidad no puede modificarse.
                E: Armado de frases / desarrollo del lenguaje, OTTAA permite armar frases de manera fácil y rápida, utilizando conceptos como “quiero ir a”, “quiero comer”.
                M: Evitar clics consecutivos, se puede establecer un tiempo de espera entre cada click consecutivo para evitar toques involuntarios.
                C: Dos estímulos, OTTAA siempre mostrará 4 pictogramas, se puede utilizar la sección de “Juegos” para trabajar con 2 estímulos dentro de OTTAA.
            NOTA: Permite crear y borrar pictogramas, así como personalizar imagen y texto de los pictogramas.
                El tamaño de los pictogramas y la cantidad que se muestran es fijo.
                Presenta la opción de generar un informe, indicando frecuencia de uso y pictogramas más utilizados.
        
        CBOARD:
            Ya que seleccionó:
                D: Cuatro o más estímulos, CBOARD permite modificar la cantidad y tamaño de pictogramas que se muestran. 
                E: Armado de frases / desarrollo del lenguaje, CBOARD permite armar frases utilizando tableros basados en vocabulario núcleo. 
                G: Teclado, existe una opción para activar un teclado virtual de texto a voz. 
                L: Mayor tamaño, CBOARD permite modificar el tamaño y cantidad de los pictogramas que se muestran.
                F: Iniciación en comunicación, CBOARD permite personalizar sus tableros, creando tableros sencillos de pocos pictogramas.
            NOTA: No recomendado para usar con barrido de pantalla táctil.
                Permite crear y borrar pictogramas, así como personalizar imagen, texto, cantidad y tamaño de los pictogramas.
        
        QUESTIONS:
            Ya que seleccionó:
                C: Entre dos, QUESTIONS siempre mostrará dos pictogramas SI/NO. 
                F: Iniciación en comunicación, permite trabajar con preguntas sencillas del tipo SI/NO, buscando además disntiguir entre ambos pictogramas.
            NOTA: Recomendado para usar con PRESS&PRESS.
                Los pictogramas no son personalizables, ni se pueden crear nuevos. Siempre muestra SI/NO y tamaño fijo.
    */
    constructor() {
        super();
        this.name = 'ReportAgent';
        this.rules = {
            formula: {
                ottaa: [
                    {question: "47neZv1P", answer: "Sí", weight: 0.25, message: "Predectibilidad, otorga una interfaz dinámica recomendando pictogramas relacionados al pictograma seleccionado."}, // A
                    {question: "wVBYaohP", answer: "Cuatro o más", weight: 0.25, message: "Cuatro o más estímulos, la interfaz principal de OTTAA muestra siempre 4 pictogramas. Esta cantidad no puede modificarse."}, // D
                    {question: "pwJP0k3S", answer: "Armado de frases/desarrollo del lenguaje", weight: 0.25, message: "Armado de frases / desarrollo del lenguaje, OTTAA permite armar frases de manera fácil y rápida, utilizando conceptos como “quiero ir a”, “quiero comer”."}, // E
                    {question: "gAkBS6Bb", answer: "Sí", weight: 0.25, message: "Evitar clics consecutivos, se puede establecer un tiempo de espera entre cada click consecutivo para evitar toques involuntarios."}, // M
                    {question: "wVBYaohP", answer: "Entre dos", weight: 0.15, message: "Dos estímulos, OTTAA siempre mostrará 4 pictogramas, se puede utilizar la sección de “Juegos” para trabajar con 2 estímulos dentro de OTTAA."}, //C
                    {question: "gAkBS6Bb", answer: "No", weight: 0.15}, //N
                    {question: "47neZv1P", answer: "No", weight: -0.10}, // B
                    {question: "JJhQjNqq", answer: "Sí", weight: -0.10}, // G
                    {question: "SEoP70yq", answer: "No", weight: -0.10}  // L
                ],
                cboard: [
                    {question: "wVBYaohP", answer: "Cuatro o más", weight: 0.25, message: "Cuatro o más estímulos, CBOARD permite modificar la cantidad y tamaño de pictogramas que se muestran."}, // D
                    {question: "pwJP0k3S", answer: "Armado de frases/desarrollo del lenguaje", weight: 0.25, message: "Armado de frases / desarrollo del lenguaje, CBOARD permite armar frases utilizando tableros basados en vocabulario núcleo."}, // E
                    {question: "JJhQjNqq", answer: "Sí", weight: 0.25, message: "Teclado, existe una opción para activar un teclado virtual de texto a voz."}, // G
                    {question: "SEoP70yq", answer: "No", weight: 0.25, message: "Mayor tamaño, CBOARD permite modificar el tamaño y cantidad de los pictogramas que se muestran."}, // L
                    {question: "wVBYaohP", answer: "Entre dos", weight: 0.075}, //C
                    {question: "pwJP0k3S", answer: "Iniciación en la comunicación (fase 1 o 2 de PECS)", weight: 0.075, message: "Iniciación en comunicación, CBOARD permite personalizar sus tableros, creando tableros sencillos de pocos pictogramas."}, // F
                    {question: "JJhQjNqq", answer: "No", weight: 0.075}, // H
                    {question: "SEoP70yq", answer: "Sí", weight: 0.075},  // K
                    {question: "gAkBS6Bb", answer: "Sí", weight: -0.15} // M
                ],
                questions: [
                    {question: "wVBYaohP", answer: "Entre dos", weight: 0.075, message: "Entre dos, QUESTIONS siempre mostrará dos pictogramas SI/NO."}, //C
                    {question: "pwJP0k3S", answer: "Iniciación en la comunicación (fase 1 o 2 de PECS)", weight: 0.075, message: "Iniciación en comunicación, permite trabajar con preguntas sencillas del tipo SI/NO, buscando además disntiguir entre ambos pictogramas."}, // F
                ]
            },
            extra_messages: {
                ottaa: [
                    "Permite crear y borrar pictogramas, así como personalizar imagen y texto de los pictogramas.",
                    "El tamaño de los pictogramas y la cantidad que se muestran es fijo.",
                    "Presenta la opción de generar un informe, indicando frecuencia de uso y pictogramas más utilizados."
                ],
                cboard: [
                    "No recomendado para usar con barrido de pantalla táctil.",
                    "Permite crear y borrar pictogramas, así como personalizar imagen, texto, cantidad y tamaño de los pictogramas."
                ],
                questions: [
                    "Recomendado para usar con PRESS&PRESS.",
                    "Los pictogramas no son personalizables, ni se pueden crear nuevos. Siempre muestra SI/NO y tamaño fijo."
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
        for (let app in formula) {
            scores[app] = 0;
            messages[app] = [];
            for (let question of formula[app]) {
                if (answersMapped[question.question].answer === question.answer) {
                    scores[app] += question.weight;
                    if (question.message) {
                        messages[app].push([question.message, question.weight]);
                    }
                }
            }
            // sort and filter question messages
            if (messages[app].length !== 0) messages[app] = messages[app].sort((a, b) => b[1] - a[1]).map(m => m[0]).slice(0, 3);
            // add extra messages (NOTES)
            for (var extra_message of this.rules.extra_messages[app] || []){
                messages[app].push("NOTA: " + extra_message);
            }
        }
        // filter out zero scores
        const scores_filtered = Object.fromEntries(Object.entries(scores).filter(([k,v]) => v !== 0));
        if (Object.keys(scores_filtered).length === 0) return "insufficient";
        return {scores, messages};
    }

    calculateHardwareEM00(user){
        const answersFile = readFormAnswersFile("em00", user);
        if (answersFile.length === 0) return 0;
        const answers = answersFile[answersFile.length-1].answers;
        const answersMapped = Object.fromEntries(answers.map(a => [a.id, a]))
        const messages = [];
        if (answersMapped['Wqwzz6bj']){
            // this should not be the way to do it, this question should come as number and not a percentage string, but it's a quick fix
            const percentage = parseInt(answersMapped['Wqwzz6bj'].answer.replace("%", ""));
            if (percentage >= 60) messages.push("Utilizar acceso táctil de manera directa.");
            else messages.push("Utilizar acceso táctil con barrido de pantalla.")
        }
        if (answersMapped['g7SlQAZP']?.answer >= 5) return [1.0, messages];
        else return [0.0, []];
    }

    calculateHardwareEM01(user){
        const answersFile = readFormAnswersFile("em01", user);
        if (answersFile.length === 0) return 0;
        const answers = answersFile[answersFile.length-1].answers;
        const answersMapped = Object.fromEntries(answers.map(a => [a.id, a]))
        if (answersMapped['KU3N33I4']?.answer >= 2 && answersMapped['ikM8GCC7']?.answer >= 2) return [
            1.0, 
            ['Utilizar el Press&Press de manera convencional']
        ];
        else if (answersMapped['KU3N33I4']?.answer >= 2) return [
            0.8,
            ['Utilizar un sólo Press en la mano derecha y el barrido automático']
        ]
        else if (answersMapped['ikM8GCC7']?.answer >= 2) return [
            0.8,
            ['Utilizar un sólo Press en la mano izquierda y el barrido automático']
        ]
        else return [0.0, []];
    }

    calculateHardwareEM02(user){
        // evaluation for bocho is not implemented yet
        return [0.0, []];
    }

    calculateHardwareEM03(user){
        // evaluation for ocus is not implemented yet
        return [0.0, []];
    }

    calculateHardware(user){
        const answersFile = readFormAnswersFile("motG01", user);
        if (answersFile.length === 0) return "insufficient";
        const answers = answersFile[answersFile.length-1].answers;
        const answersMapped = Object.fromEntries(answers.map(a => [a.id, a]))
        // run through motG01 answers and depending on the answer calculate the score for each device
        // each score will apply if the previous doesn't
        const scores = {};
        const messages = {};
        if (answersMapped['sIh2a0Sw']?.answer === "Sí"){
            const [score, message] = this.calculateHardwareEM00(user);
            if (score !== 0) {
                scores.tactil = score;
                messages.tactil = message;
            }
        }
        if (answersMapped['4uC28XYW']?.answer === "Sí" && !scores.tactil){
            const [score, message] = this.calculateHardwareEM01(user);
            if (score !== 0) {
                scores['press&press'] = score;
                messages['press&press'] = message;
            }
        }
        if (answersMapped['mUXFsHPj']?.answer === "Sí" && !scores.tactil && !scores['press&press']){
            const [score, message] = this.calculateHardwareEM02(user);
            if (score !== 0) {
                scores.bocho = score;
                messages.bocho = message;
            }
        }
        if (answersMapped['geDTuWoo']?.answer === "No" && !scores.tactil && !scores['press&press'] && !scores.bocho){
            const [score, message] = this.calculateHardwareEM03(user);
            if (score !== 0) {
                scores.ocus = score;
                messages.ocus = message;
            }
        }
        // filter out zero scores
        const scores_filtered = Object.fromEntries(Object.entries(scores).filter(([k,v]) => v !== 0));
        if (Object.keys(scores_filtered).length === 0){
            // try recommending TICA
            if (answersMapped['geDTuWoo']?.answer === "Sí") {
                scores_filtered.tica = 1;
                messages.tica = "Recomendado por nistagmo";
            }
            else return "insufficient";
        }
        return {scores: scores_filtered, messages};
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