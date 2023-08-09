const { readFormFile, readFormAnswersFile, saveFormAnswersFile } = require("./files.js")

// FORMS

const getFormHandler = (req, res) => {
    const formId = req.query.fid;
    const formData = readFormFile(formId);
    
    if (formData === {}) return res.status(404).send({code: 'form-not-found', msg: `El formulario ${formId} no se encontró`})
    
    return res.status(200).send({
        code: 'success',
        data: formData,
        msg: "Se devuelve el detalle del formulario " + formId + " correctamente." 
    })
}

const newFormHandler = (req, res) => {
    // not implemented yet
    res.status(501).send({code: 'not-implemented', msg: "Esta funcionalidad no está implementada aún."})
}

// FORMS ANSWERS

const getAnswerFormHandler = (req, res) => {
    const formId = req.query.fid;
    const code = req.query.code;

    const formData = readFormAnswersFile(formId, code);
    const answers = formData || [];

    if (answers.length === 0) return res.status(404).send({code: 'form-not-found', msg: `El formulario ${formId} no se encontró`})

    return res.status(200).send({
        code: 'success',
        data: answers,
        msg: "Se devuelven las respuestas del formulario " + formId + " para el usuario " + code + " correctamente."
    })
}

const newAnswerFormHandler = (req, res) => {
    const formId = req.query.fid;
    const code = req.query.code;
    const data = req.body;

    const formData = readFormAnswersFile(formId, code);
    const answers = formData || [];

    answers.push({answers: data, date: new Date(), state:'complete'});

    saveFormAnswersFile(formId, code, answers);

    return res.status(200).send({
        code: 'success',
        answer_count: answers.length,
        msg: "Se ha respondido el formulario " + formId + " correctamente."
    })
}

module.exports = { getFormHandler, newFormHandler, getAnswerFormHandler, newAnswerFormHandler }