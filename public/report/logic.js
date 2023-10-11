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

fetchData().then(({ userDetail, reportDetail }) => {
    titleBlockUserName.innerText = userDetail.name;

    console.log(reportDetail);
})