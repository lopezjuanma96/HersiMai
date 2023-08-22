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
            case "text":
                questionText = renderTextQuestion(q, q_index);
                break;
            case "yesno":
                questionText = renderYesNoQuestion(q, q_index);
                break;
            case "range":
                questionText = renderRangeQuestion(q, q_index);
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
    <div class="row mb-3">
        <label for="example-text" class="form-label" id="question${index}Label">${question.question}</label>
        <textarea class="form-control" id="question${index}Input" rows="3"></textarea>
    </div>
    `;
}

const renderYesNoQuestion = (question, index) => {
    return `
    <div class="row mb-3">
        <label for="example-radio" class="form-label" id="question${index}Label">${question.question}</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="example-radio" id="question${index}InputYes">
            <label class="form-check-label" for="example-radio-yes" id="question${index}LabelYes">
                Sí
            </label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="example-radio" id="question${index}InputNo">
            <label class="form-check-label" for="example-radio-no"  id="question${index}LabelNo">
                No
            </label>
        </div>
    </div>
    `;
}

const renderRangeQuestion = (question, index) => {
    return `
    <div class="row mb-3">
        <label for="example-range" class="form-label" id="question${index}Label">${question.question}</label>
        <div class="d-flex flex-row align-items-center">
            <input type="range" class="form-range" value="${question.min}" min="${question.min}" max="${question.max}" step="${question.step}" id="question${index}Input" aria-describedby="question${index}Help" onchange="document.getElementById('question${index}InputValue').innerText = this.value">
            <label class="ms-3 h5" id="question${index}InputValue">${question.min}</label>
        </div>
        <div class="form-text" id="question${index}Help">${question.help}</div>
    </div>
    `;
}

questionsFormSubmitButton.addEventListener('click', (e) => {
    var q_index = 0, q_label, q_quest, q_input, q_input_y, q_input_n;
    const answers = [];
    var valid = true;
    do {
        q_label = document.getElementById(`question${q_index}Label`);
        if (!q_label) break;
        q_quest = q_label.innerText;
        q_input = document.getElementById(`question${q_index}Input`);
        q_input_y = document.getElementById(`question${q_index}InputYes`);
        q_input_n = document.getElementById(`question${q_index}InputNo`);
        if (q_input) {
            answers.push({question: q_quest, answer: q_input.value});
        } else if (q_input_y && q_input_n) {
            if (q_input_y.checked) answers.push({question: q_quest, answer: "Sí"});
            else if (q_input_n.checked) answers.push({question: q_quest, answer: "No"});
            else {
                alert(`La pregunta ${q_quest} no ha sido respondida.`);
                valid = false;
                break;
            }
        }
        q_index ++;
    } while (q_input || (q_input_y && q_input_n))
    if (!valid) return;
    
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
    }).catch((err) => {
        console.log(err);
        alert("Ha ocurrido un error al enviar las respuestas. Intente nuevamente.");
        questionsFormSubmitButton.disabled = false;
        questionsFormResetButton.disabled = false;
    })
})