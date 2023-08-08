const queryParams = window.location.search;

const title = document.getElementById("title")

fetch(`/api/form${queryParams}`, {
    method: "GET",
    headers: {
        "Accept": "application/json",
    }
}).then((res) => 
    res.json()
).then((resJson) => {
    console.log(resJson);
    // HERE: resJson.code checking
    const formData = resJson.data;
    if (formData.title && formData.title.length > 0) title.innerText = formData.title;
    else title.innerText = "Formulario sin título."
})