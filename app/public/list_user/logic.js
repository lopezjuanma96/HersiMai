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
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><a href="/user_detail?code=${user.code}" target="_blank">${user.code}<a></td>
        </tr>
    `
}