const formNameInput = document.getElementById("formNameInput");
const formEmailInput = document.getElementById("formEmailInput");

const formSubmitButton = document.getElementById("formSubmitButton");
const formResetButton = document.getElementById("formResetButton");

const codeBlock = document.getElementById("codeBlock");
const codeText = document.getElementById("codeText");
const codeLink = document.getElementById("codeLink");
const codeCopyButton = document.getElementById("codeCopyButton");

formNameInput.addEventListener('keypress', (e) => {
    if (parseInt(e.key)){ //TODO: Regex for special Symbols
        e.preventDefault();
        alert("No se pueden ingresar números en el nombre")
    }
})


formSubmitButton.addEventListener('click', (e) => {
    // se podría obtener la referencia al form desde el elemento del evento:
    // e.target obtendríamos la referncia al botón, y desde el mismo obtener el form padre
    // luego con ese padre obtener los input

    // Nosotros referenciaremos los input directamente con sus ids
    // console.log("Estoy por enviar este nombre:", formNameInput.value);
    // console.log("Estoy por enviar este email:", formEmailInput.value);
    
    const sendName = formNameInput.value;
    const sendEmail = formEmailInput.value;

    if (sendName === "") return alert("El campo nombre está vacío."); //TODO: regex for all spaces.
    if (sendEmail === "") return alert("El campo email está vacío.");

    const sendObject = {
        userName: sendName,
        userEmail: sendEmail,
    }

    codeBlock.hidden = true;
    codeText.innerText = "";
    codeLink.href = ".";
    //Enviamos la info
    fetch("/api/new_user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(sendObject)
    }).then((res) => {
        return res.json()
    }).then((resJson) => {
        //console.log(resJson);
        if (resJson.code === "created-user") {
            if (!resJson.data.code) throw new Error("No se retornó código de usuario, reintenter por favor!")
            codeText.innerText = resJson.data.code;
            codeLink.href = `/user_detail?code=${resJson.data.code}`
            codeBlock.hidden = false;
        }
        else if (resJson.code === "user-exists") alert(resJson.msg);
        formResetButton.click();
    }).catch((err) => console.log(err))
})