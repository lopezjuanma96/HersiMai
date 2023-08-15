const queryParams = window.location.search;

const lastReportAnswers = document.getElementById("lastReportAnswers");
const lastReportDate = document.getElementById("lastReportDate");
const lastReportNotFound = document.getElementById("lastReportNotFound");

const titleBlockEvalState = document.getElementById("titleBlockEvalState");

const previousReportsAnswers = document.getElementById("previousReportsAnswers");
const previousReportsNotFound = document.getElementById("previousReportsNotFound");

const MULTILINE_ANSWER_CHAR_THRESH = 20;

fetch(`/api/form/answer/${queryParams}`, {
    method: "GET",
    headers: {
        "Accept": "application/json",
    }
}).then((res) =>
    res.json()
).then((resJson) => {
    if (resJson.code !== "success") {
        console.log(resJson.code, resJson.msg);
        return alert(resJson.msg);
    }

    lastReportAnswers.innerHTML = "";
    previousReportsAnswers.innerHTML = "";

    const reports = resJson.data;
    const lastReport = reports.pop();

    if(!lastReport) lastReportNotFound.hidden = false;
    else {
        lastReportNotFound.hidden = true;

        // fill eval state
        if (lastReport.state) titleBlockEvalState.innerText = lastReport.state;

        // fill last report date
        if (lastReport.date) {
            const thisDate = new Date(lastReport.date);
            lastReportDate.innerHTML = `${thisDate.getDate()}-${thisDate.getMonth() + 1}-${thisDate.getFullYear()}`;
        } else lastReportDate.innerHTML = "Sin fecha";

        // fill last report answers
        const thisAnswers = lastReport.answers;
        for (var answer of thisAnswers) {
            lastReportAnswers.innerHTML += renderReportAnswer(answer);
        }
    }

    if(reports.length === 0) previousReportsNotFound.hidden = false;
    else {
        previousReportsNotFound.hidden = true;
        
        for (var report of reports) {
            // create previous report div
            var thisReportDivText = `<div class="row text-center">`;

            // fill previous report date
            if (report.date) {
                const thisDate = new Date(report.date);
                thisReportDivText += `<i class="h4">${thisDate.getDate()}-${thisDate.getMonth() + 1}-${thisDate.getFullYear()}</i>`;
            } else thisReportDivText += `<i class="h4">Sin fecha</i>`;
            
            // add previous report separating line
            thisReportDivText += `<hr>`
            
            // fill previous report answers
            const thisAnswers = report.answers;
            for (answer of thisAnswers) {
                thisReportDivText += renderReportAnswer(answer);
            }

            thisReportDivText += `</div>`;
            previousReportsAnswers.innerHTML += thisReportDivText;
        }
    }
})

const renderReportAnswer = (answer) => {
    const thisAnswer = answer.answer;
    const thisQuestion = answer.question;
    if (!thisQuestion || thisQuestion === "") return "";
    else if (!thisAnswer || thisAnswer === "") return `
        <div class="row justify-content-between mb-3">
            <div class="col-9">
                <p class="lead fw-bold">${thisQuestion}</p>
            </div>
            <div class="col-2">
                <p class="lead text-end">Sin Respuesta</p>
            </div>
        </div>
    `;
    else if (thisAnswer.length > MULTILINE_ANSWER_CHAR_THRESH) return `
        <div class="row">
            <div class="col-12">
                <p class="lead fw-bold">${thisQuestion}</p>
            </div>
            <div class="col-12">
                <p class="lead">${thisAnswer}</p>
            </div>
        </div>
    `;
    else return `
        <div class="row justify-content-between mb-3">
            <div class="col-9">
                <p class="lead fw-bold">${thisQuestion}</p>
            </div>
            <div class="col-2">
                <p class="lead text-end">${thisAnswer}</p>
            </div>
        </div>
    `
}