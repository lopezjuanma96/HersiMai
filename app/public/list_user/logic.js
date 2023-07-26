const listTableBody = document.getElementById('listTableBody')

fetch('/api/list_user', {
    method: "GET",
    headers: {
        "Accept": "application/json",
    }
}).then((respText) => 
    respText.json()
).then((respJson) => {
    if (respJson.code == 'success'){
        listTableBody.innerHTML = "";
        const users = respJson.users;
        for (let user of users) {
            listTableBody.innerHTML += formatUserJson(user)
        }
    }
})

const formatUserJson = (user) => {
    return `
        <tr>
            <td>${user.userName}</td>
            <td>${user.userEmail}</td>
            <td><a href="/user_detail?code=${user.userCode}" target="_blank">${user.userCode}<a></td>
            <td>${formatUserCreationDate(user.creationDate)}</td>
        </tr>
    `
}

const formatUserCreationDate = (milis) => {
    if (!milis) return "Sin dato";
    if (!parseInt(milis)) return "Inválido"

    const dateObj = new Date(milis);
    return `${dateObj.getDate()}/${dateObj.getMonth()+1}/${dateObj.getFullYear()}`
}