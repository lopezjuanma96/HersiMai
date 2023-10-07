const queryParams = window.location.search;

const title = document.getElementById("title")
const questionsList = document.getElementById("questionsList");
const questionsFormSubmitButton = document.getElementById("questionsFormSubmitButton");
const questionsFormResetButton = document.getElementById("questionsFormResetButton");

fetch(`/api/form${queryParams}`, {
    method: "GET",
    headers: {
        "Accept": "application/json",
    }
}).then((res) => 
    res.json()
).then((resJson) => {
    //console.log(resJson);
    
    if (resJson.code !== "success") {
        console.log(resJson.code, resJson.msg);
        return alert(resJson.msg);
    }

    const formData = resJson.data;
    
    // Title
    if (formData.title && formData.title.length > 0) {
        title.innerText = formData.title;
        document.title = formData.title;
    } else {
        title.innerText = "Formulario sin título.";
        document.title = "Formulario sin título.";
    }
    // Questions
    questionsList.innerHTML = "";
    var q_index = 0;
    for (q of formData.questions) {
        var questionText;
        switch (q.type) {
            case "title":
                questionText = renderTitleQuestion(q, q_index);
                break;
            case "text":
                questionText = renderTextQuestion(q, q_index);
                break;
            case "yesno":
                questionText = renderYesNoQuestion(q, q_index);
                break;
            case "range":
                questionText = renderRangeQuestion(q, q_index);
                break;
            case "option":
                questionText = renderOptionQuestion(q, q_index);
                break;
            default:
                break;
        }
        questionsList.innerHTML += questionText;
        q_index ++;
        if (q_index < formData.questions.length) questionsList.innerHTML += "<hr>";
    }
}).catch((err) => {
    console.log(err);
    alert("Ha ocurrido un error al cargar el formulario.");
})

const renderTextQuestion = (question, index) => {
    return `
    <div class="row mb-3 ">
        <label for="question${index}" class="form-label" qid="${question.id}">${question.question}</label>
        <textarea class="form-control" qid="${question.id}" rows="3" name="question${index}"></textarea>
        ${question.help ? `<div class="form-text" id="question${index}Help">${question.help}</div>` : ""}
    </div>
    `;
}

const renderYesNoQuestion = (question, index) => {
    return `
    <div class="row mb-3">
        <label for="example-radio" class="form-label" id="question${index}Label">${question.question}</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="question${index}" qid="${question.id}">
            <label class="form-check-label" for="question${index}Y" qid="${question.id}">
                Sí
            </label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="question${index}" qid="${question.id}">
            <label class="form-check-label" for="question${index}N"  qid="${question.id}">
                No
            </label>
        </div>
        ${question.help ? `<div class="form-text" id="question${index}Help">${question.help}</div>` : ""}
    </div>
    `;
}

const renderOptionQuestion = (question, index) => {
    return `
    <div class="row mb-3">
        <label for="example-radio" class="form-label" id="question${index}Label">${question.question}</label>
        ${
            question.options.map(option =>
                `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="question${index}Y" qid="${question.id}">
                    <label class="form-check-label" for="question${index}Y" qid="${question.id}">
                        ${option}
                    </label>
                </div>
                `
            ).join("\n")
        }
        ${question.help ? `<div class="form-text" id="question${index}Help">${question.help}</div>` : ""}
    </div>
    `;
}

const renderRangeQuestion = (question, index) => {
    return `
    <div class="row mb-3">
        <label for="example-range" class="form-label" qid="${question.id}">${question.question}</label>
        <div class="d-flex flex-row align-items-center">
            <input type="range" class="form-range" value="${question.min}" min="${question.min}" max="${question.max}" step="${question.step}" qid="${question.id}" aria-describedby="question${index}Help" onchange="this.parentNode.getElementsByTagName('label')[0].innerText = this.value">
            <label class="ms-3 h5">${question.min}</label>
        </div>
        ${question.help ? `<div class="form-text" id="question${index}Help">${question.help}</div>` : ""}
    </div>
    `;
}

const renderTitleQuestion = (question, index) => {
    return `
    ${index !== 0 ? "<hr>" : ""}
    <div class="row mb-3">
        <p class="h3">${question.question}</p>
        ${question.help ? `<div class="form-text" id="question${index}Help">${question.help}</div>` : ""}
    </div>
    `
}

questionsFormSubmitButton.addEventListener('click', (e) => {
    const answers = [];

    const questions = {};
    const radioChecked = {};
    var valid = false;
    
    const inputs = questionsList.getElementsByTagName('input');
    for (let i=0; i < inputs.length; i++){
        const thisInput = inputs.item(i);
        const thisAnswer = {}

        if (thisInput.type === 'radio'){
            thisAnswer.id = thisInput.attributes.getNamedItem('qid').value;
            thisAnswer.question = thisInput.parentNode.parentNode.getElementsByClassName('form-label')[0].innerText;
            questions[thisAnswer.id] = thisAnswer.question;
            if (!thisInput.checked){
                const id = thisInput.attributes.getNamedItem('qid').value;
                if (!radioChecked[id]) radioChecked[id] = false;
                continue;
            };
            thisAnswer.answer = thisInput.parentNode.getElementsByClassName('form-check-label')[0].innerText;
            radioChecked[thisAnswer.id] = true;
        } else if (thisInput.type === 'range'){
            thisAnswer.id = thisInput.attributes.getNamedItem('qid').value;
            thisAnswer.question = thisInput.parentNode.parentNode.getElementsByClassName('form-label')[0].innerText;
            questions[thisAnswer.id] = thisAnswer.question;
            thisAnswer.answer = thisInput.value;
        } else {
            console.log('Invalid input type', thisInput.type, ':', thisInput)
        }
        answers.push(thisAnswer)
    }
    
    const textareas = questionsList.getElementsByTagName('textarea');
    for (let i=0; i < textareas.length; i++){
        const thisInput = textareas.item(i);
        const thisAnswer = {};
        
        thisAnswer.id = thisInput.attributes.getNamedItem('qid').value;
        thisAnswer.question = thisInput.parentNode.getElementsByClassName('form-label')[0].innerText;
        thisAnswer.answer = thisInput.value; 
        answers.push(thisAnswer)
    }

    for (let id in radioChecked){
        if (!radioChecked[id]){
            alert('La pregunta ' + questions[id] + ' no fue respondida.')
            valid = false;
            return;
        }
    }
    
    // console.log(answers);
    
    questionsFormSubmitButton.disabled = true;
    questionsFormResetButton.disabled = true;
    fetch(`/api/form/answer${queryParams}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            },
            body: JSON.stringify({answers})
    }).then((res) =>
        res.json()
    ).then((resJson) => {
        questionsFormSubmitButton.disabled = false;
        questionsFormResetButton.disabled = false;
        questionsFormResetButton.click();
        if (resJson.code !== "success") {
            console.log(resJson.code, resJson.msg);
            return alert(resJson.msg);
        }
        alert("Respuestas enviadas correctamente.");
        if (resJson.redirect){
            const params = new URLSearchParams(queryParams);
            params.set("fid", resJson.redirect);
            window.location.search = params.toString();
        }
    }).catch((err) => {
        console.log(err);
        alert("Ha ocurrido un error al enviar las respuestas. Intente nuevamente.");
        questionsFormSubmitButton.disabled = false;
        questionsFormResetButton.disabled = false;
    })
})