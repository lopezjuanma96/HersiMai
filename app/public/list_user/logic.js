const listTableBody = document.getElementById('listTableBody')
const noDataTableBody = document.getElementById('noDataTableBody')

listTableBody.innerHTML = "";
fetch('/api/list_user', {
    method: "GET",
    headers: {
        "Accept": "application/json",
    }
}).then((respText) => 
    respText.json()
).then((respJson) => {
    if (respJson.code == 'success'){
        const users = respJson.users;
        if (respJson.users.length == 0) return noDataTableBody.hidden = false;
        for (let user of users) {
            listTableBody.innerHTML += formatUserJson(user)
        }
        noDataTableBody.hidden = true;
    } else if (respJson.code == 'no-data'){
        return noDataTableBody.hidden = false;
    }
}).catch((err) => {
    console.log(err.msg);
    return noDataTableBody.hidden = false;
})

const formatUserJson = (user) => {
    return `
        <tr>
            <td>${user.userName}</td>
            <td>${user.userEmail}</td>
            <td class="text-center"><a href="/user_detail?code=${user.userCode}" target="_blank">${user.userCode}<a></td>
            <td class="text-center">${formatUserCreationDate(user.creationDate)}</td>
        </tr>
    `
}

const formatUserCreationDate = (milis) => {
    if (!milis) return "Sin dato";
    if (!parseInt(milis)) return "Inválido"

    const dateObj = new Date(milis);
    return `${dateObj.getDate()}/${dateObj.getMonth()+1}/${dateObj.getFullYear()}`
}