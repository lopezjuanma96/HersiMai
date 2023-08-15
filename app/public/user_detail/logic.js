const baseUrl = window.location.origin;
const queryParams = window.location.search;

const titleBlockUserName = document.getElementById("titleBlockUserName");
const titleBlockUserEmail = document.getElementById("titleBlockUserEmail");
const titleBlockEvalName = document.getElementById("titleBlockEvalName");
const titleBlockEvalState = document.getElementById("titleBlockEvalState");

const listTableBody = document.getElementById("listTableBody");

// Since there are many dependant fetches, we will write an async function fetchData.
// This will include:
// 1. Fetching the user details
// 2. Fetching the form list (just the available forms)
// 3. Fetching the form details (for each form)
// 4. Fetching the form state and in case of completed, some response data

async function fetchData(){
    var res, resJson; // This will be used to store the response from each fetch

    // Fetching the user details
    res = await fetch(`/api/user_detail${queryParams}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    })
    resJson = await res.json();
    if (resJson.code !== 'success') throw new Error("Error al obtener detalles del usuario: ", resJson.msg);
    
    const userDetail = resJson.data;

    //console.log('userDetail:');
    //console.log(userDetail);
    
    // Fetching the form list (just the available forms)
    res = await fetch('/api/form/list', {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    })
    resJson = await res.json();
    if (resJson.code !== 'success') throw new Error("Error al obtener la lista de evaluaciones: ", resJson.msg);

    const formList = resJson.data;
    const formListData = formList.map(formId => {return {id: formId, title: 'undefined', type: 'undefined', state: 'undefined'}});

    //console.log('formList:');
    //console.log(formList);

    // Fetching form details and results
    for (let i = 0; i < formList.length; i++){
        const formId = formList[i];

        // Fetching the form details (for each form)
        res = await fetch(`/api/form?fid=${formId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            }
        })
        resJson = await res.json();
        if (resJson.code !== 'success') throw new Error("Error al obtener los detalles de la evaluación ", formId, ":", resJson.msg);

        const formDetail = resJson.data;

        // Fetching the form state and in case of completed, some response data
        res = await fetch(`/api/form/answer?fid=${formId}&code=${userDetail.userCode}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            }
        })
        resJson = await res.json();
        if (resJson.code !== 'success') throw new Error("Error al obtener el estado de la evaluación ", formId, ":", resJson.msg);

        const formReports = resJson.data;
        const formLastReport = formReports.pop();

        // Updating the formListData
        formListData[i].type = formDetail.type.toLowerCase();
        formListData[i].title = formDetail.title;
        if (formLastReport) formListData[i].state = formLastReport.state.toLowerCase();
        else formListData[i].state = 'incomplete';
    }

    //console.log('formListData:');
    //console.log(formListData);

    return {userDetail, formListData};
}

// Calling the fetchData function

fetchData().then((data) => {
    const {userDetail, formListData} = data;

    // Updating the title block
    titleBlockUserName.innerText = userDetail.userName;
    titleBlockUserEmail.innerText = userDetail.userEmail;
    titleBlockEvalName.innerText = userDetail.evalName;

    // Updating the form list
    listTableBody.innerHTML = '';
    var completedForms = 0;
    for (var formData of formListData){
        if (formData.type === 'undefined') continue;
        else if (formData.type === 'form') listTableBody.innerHTML += renderFormRow(userDetail, formData);
        else if (formData.type === 'report') listTableBody.innerHTML += renderReportRow(userDetail, formData);
        else if (formData.type === 'inter') listTableBody.innerHTML += renderInterRow(userDetail, formData);
        
        if (formData.state === 'complete' || formData.state === 'completado') completedForms++;
    }

    // Updating the title block eval state
    if (completedForms === 0) titleBlockEvalState.innerText = 'Incompleto';
    else if (completedForms === formListData.length) titleBlockEvalState.innerText = 'Completado';
    else titleBlockEvalState.innerText = 'En progreso';
}).catch((err) => {
    console.log(err.code);
    alert(err.msg);
    //window.location.pathname = "/list_user"
})


// renderFormRow adds a copy link button since the form is being sent to the caregiver 
const renderFormRow = (userDetail, formData) => `
    <tr class="mb-3">
        <td class="col-3">${formData.title}</td>
        <td class="col-3">
            <p class="${getCompleteColor(formData.state)}">${getCompleteText(formData.state)}</p>
        </td>
        <td class="col-3">
            <div class="row justify-content-center align-items-center">
                <button class="w-50 btn btn-primary blueButton" type="button" onclick="copyToClipBoard(\'${userDetail.userCode}\', \'${formData.id}\', \'${formData.type}\')">Copiar link</button>
            </div>
        </td>
        <td class="col-3">
            <div class="row justify-content-center align-items-center">
                ${
                    formData.state === 'complete' || formData.state === 'completado' ?
                    `<a class="w-50 btn btn-primary orangeButton" href="/results?code=${userDetail.userCode}&fid=${formData.id}" target="_blank">Ver</a>` :
                    '<a class="w-50 btn btn-primary grayButton">No disponible</a>'
                }
            </div>
        </td>
        <td class="col-3">
            <div class="row justify-content-center align-items-center">
                ${getResetButton()}
            </div>
        </td>
    </tr>
`

// renderReportRow adds a view button since the form is being completed by the evaluator
const renderReportRow = (userDetail, formData) => `
    <tr class="mb-3">
        <td class="col-3">${formData.title}</td>
        <td class="col-3">
            <p class="${getCompleteColor(formData.state)}">${getCompleteText(formData.state)}</p>
        </td>
        <td class="col-3">
            <div class="row justify-content-center align-items-center">
                <a class="w-50 btn btn-primary orangeButton" href="/form?code=${userDetail.userCode}&fid=${formData.id}" target="_blank">Ver</a>
            </div>
        </td>
        <td class="col-3">
            <div class="row justify-content-center align-items-center">
                ${
                    formData.state === 'complete' || formData.state === 'completado' ?
                    `<a class="w-50 btn btn-primary orangeButton" href="/results?code=${userDetail.userCode}&fid=${formData.id}" target="_blank">Ver</a>` :
                    '<a class="w-50 btn btn-primary grayButton">No disponible</a>'
                }
            </div>
        </td>
        <td class="col-3">
            <div class="row justify-content-center align-items-center">
                ${getResetButton()}
            </div>
        </td>
    </tr>
`

// renderInterRow adds a copy link button since the interaction is done by the user
const renderInterRow = (userDetail, formData) => `
    <tr class="mb-3">
        <td class="col-3">${formData.title}</td>
        <td class="col-3">
            <p class="${getCompleteColor(formData.state)}">${getCompleteText(formData.state)}</p>
        </td>
        <td class="col-3">
            <div class="row justify-content-center align-items-center">
                <button class="w-50 btn btn-primary blueButton" type="button" onclick="copyToClipBoard(\'${userDetail.userCode}\', \'${formData.id}\', \'${formData.type}\')">Copiar link</button>
            </div>
        </td>
        <td class="col-3">
            <div class="row justify-content-center align-items-center">
                ${
                    formData.state === 'complete' || formData.state === 'completado' ?
                    `<a class="w-50 btn btn-primary orangeButton" href="/results?code=${userDetail.userCode}&fid=${formData.id}" target="_blank">Ver</a>` :
                    '<a class="w-50 btn btn-primary grayButton">No disponible</a>'
                }
            </div>
        </td>
        <td class="col-3">
            <div class="row justify-content-center align-items-center">
                ${getResetButton()}
            </div>
        </td>
    </tr>
`

const getCompleteColor = (state) => {
    if (state === 'complete' || state === 'completado') return 'textGreen';
    else if (state === 'progress' || state === 'en progreso') return 'textYellow';
    else if (state === 'incomplete' || state === 'incompleto') return 'textRed';
}

const getCompleteText = (state) => {
    if (state === 'complete' || state === 'completado') return 'Completado';
    else if (state === 'progress' || state === 'en progreso') return 'En progreso';
    else if (state === 'incomplete' || state === 'incompleto') return 'Incompleto';
}

const getResetButton = () => `
    <button class="w-50 btn btn-primary blueButton" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
        </svg>
    </button>
`

const copyToClipBoard = (userCode, formId, formType) => {
    const url = `${baseUrl}/${
        formType === "inter" ?
        "inter/" + formId + "?" :
        "form?fid=" + formId + "&"
    }code=${userCode}`;
    //console.log(url)
    navigator.clipboard.writeText(url);
    
}