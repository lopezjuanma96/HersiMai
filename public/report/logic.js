const baseUrl = window.location.origin;
const queryParams = window.location.search;

const titleBlockUserName = document.getElementById("titleBlockUserName");

const softwareBlock = document.getElementById("softwareBlock");
const hardwareBlock = document.getElementById("hardwareBlock");

const exportButton = document.getElementById("exportButton");

exportButton.addEventListener("click", () => alert("No implementado aún."))

async function fetchData() {
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

    // Fetching report details
    res = await fetch(`/api/report${queryParams}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    })
    resJson = await res.json();
    if (resJson.code !== 'success') throw new Error("Error al obtener detalles del reporte: ", resJson.msg);

    const reportDetail = resJson.data;

    console.log(reportDetail)

    return { userDetail, reportDetail }
}

const renderSoftwareLine = (appName, appScores, appMessages) => {
    // THIS SHOULD BE TAKEN TO THE COMPONENT LATER
    if (appMessages) {
        ;
    } else {
        console.log(appName, 'does not have a message')
    }
    ///////////////////////////////////////////////

    appScores = typeof appScores === 'string' ? parseFloat(appScores) : appScores;
    const percentage = Math.round(appScores * 100);

    return `
    <div class="container softwareLine">
        <div class="row">
            <div class="col-3 h3 fw-bold">${appName.toUpperCase()}</div>
            <div class="col-7"></div>
            <div class="col-2 h3 fw-bold text-end">${percentage}%</div>
        </div>
        <div class="row">
            <div class="col-1"></div>
            <div class="col-10">
                <ul>
                    <li class="lead">Justificación 1</li>
                    <li class="lead">Justificación 2</li>
                    <li class="lead">Justificación 3</li>
                </ul>
            </div>
            <div class="col-1"></div>
        </div>
    </div>
    `
}

const renderHardwareLine = (deviceName, deviceScores, deviceMessages) => {
    
    deviceScores = typeof deviceScores === 'string' ? parseFloat(deviceScores) : deviceScores;
    const percentage = Math.round(deviceScores * 100);

    return `
    <div class="container softwareLine">
        <div class="row">
            <div class="col-3 h3 fw-bold">${deviceName.toUpperCase()}</div>
            <div class="col-7"></div>
            <div class="col-2 h3 fw-bold text-end">${percentage}%</div>
        </div>
        <div class="row">
            <div class="col-1"></div>
            <div class="col-10">
                <ul>
                    ${
                        deviceMessages.map(message => `<li class="lead">${message}</li>`).join('\n')
                    }
                </ul>
            </div>
            <div class="col-1"></div>
        </div>
    </div>
    `
}

fetchData().then(({ userDetail, reportDetail }) => {
    titleBlockUserName.innerText = userDetail.userName;

    if (reportDetail.software === 'insufficient'){
        softwareBlock.innerHTML = `
        <div class="text-center">Datos insuficientes</div>
        `
        console.log('Insufficient software data');
    } else {
        for (let appName in reportDetail.software.scores) {
            const thisAppScores = reportDetail.software.scores[appName];
            if (thisAppScores == 0) continue;
            const thisAppMessages = reportDetail.software.messages[appName];
            softwareBlock.innerHTML += renderSoftwareLine(appName, thisAppScores, thisAppMessages);
        }
    }

    if (reportDetail.hardware === 'insufficient'){
        hardwareBlock.innerHTML += `
        <div class="text-center h4">Datos insuficientes</div>
        `
        console.log('Insufficient hardware data');
    } else {
        for (let deviceName in reportDetail.hardware.scores) {
            const thisDeviceScores = reportDetail.hardware.scores[deviceName];
            if (thisDeviceScores == 0) continue;
            const thisDeviceMessages = reportDetail.hardware.messages[deviceName];
            hardwareBlock.innerHTML += renderHardwareLine(deviceName, thisDeviceScores, thisDeviceMessages);
        }
    }
})