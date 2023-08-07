const queryParams = window.location.search;
const userCode = queryParams.replace('?code=', '')

const titleBlockUserName = document.getElementById("titleBlockUserName");
const titleBlockUserEmail = document.getElementById("titleBlockUserEmail");
const titleBlockEvalName = document.getElementById("titleBlockEvalName");

//console.log(queryParams)
//console.log(userCode)

fetch(`/api/user_detail${queryParams}`, {
    method: "GET",
    headers: {
        "Accept": "application/json",
    }
}).then((res) => 
    res.json()
).then((resJson) => {
    //console.log(resJson.code);
    //console.log(resJson.msg);
    //console.log(resJson.user);
    if (resJson.code === 'success'){
        const userDetail = resJson.user;
        titleBlockUserName.innerText = userDetail.userName;
        titleBlockUserEmail.innerText = userDetail.userEmail;
        titleBlockEvalName.innerText = userDetail.evalName;
    } else {
        const err = resJson;
        console.log(err.code);
        alert(err.msg);
        window.location.pathname = "/list_user"
    }
}).catch((err) => {
    console.log(err.code);
    alert(err.msg);
    window.location.pathname = "/list_user"
})