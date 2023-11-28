function cancelclick() {
    window.location.href = "StudentRecord";
}

function AddRecord() {
    window.location.href = "AddRecord";
}

function EditRecord(id) {
    var url = "AddRecord?id=" + id;
    window.location.href = url;
}

function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var requestData = {
        username: username,
        password: password
    };
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://localhost:44328/Authenticate/Login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
      
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                var logindetails = JSON.parse(xhr.responseText);

                var token = logindetails.value;

                var jwtData = token.split('.')[1];
                var decodedJwtJsonData = window.atob(jwtData);
                var decodedJwtData = JSON.parse(decodedJwtJsonData);
                var role = decodedJwtData.role;

                sessionStorage.setItem('Role', role);
                sessionStorage.setItem('Token', token);
                window.location.href = "/Home/StudentRecord";

            } else {
                console.error('Error: ' + xhr.status);
            }
        }
    };

    xhr.send(JSON.stringify(requestData));
}

function DeleteRecord(id) {

    var token = sessionStorage.getItem('Token');
    var authHeaders = {
        'Authorization': 'Bearer ' + token
    };
    var xhr = new XMLHttpRequest();

    if (confirm("Are you sure you want to Delete.???")) {

        xhr.open('DELETE', 'https://localhost:44328/api/student/DeleteStudent?id=' + id, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', authHeaders.Authorization);

        xhr.onload = function () {
            if (xhr.status == 200) {
                document.getElementById('setuser').innerHTML = '';
                DataBind();
            } else {
                console.error(xhr.responseText);
            }
        };

        xhr.onerror = function () {
            console.error('Request failed');
        };

        xhr.send();
    }    
}

function DataBind() {
    var token = sessionStorage.getItem('Token');
    var role = sessionStorage.getItem('Role');
   
    var authHeaders = {
        'Authorization': 'Bearer ' + token
    };

    if (token == null) {
        window.location.href = "Index";
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://localhost:44328/api/student/GetStudents', true);
        xhr.setRequestHeader('Authorization', authHeaders.Authorization);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    var emplist = JSON.parse(xhr.responseText);
                    var setdata = document.getElementById('setuser');

                    for (var i = 0; i < emplist.length; i++) {
                        var data = "<tr>" +
                            "<td>" + emplist[i].fname + "</td>" +
                            "<td>" + emplist[i].lname + "</td>" +
                            "<td>" + emplist[i].dob + "</td>" +
                            "<td>" + emplist[i].gender + "</td>" +
                            "<td>" + emplist[i].email + "</td>" +
                            "<td>" + emplist[i].username + "</td>" +
                            "<td>" + emplist[i].password + "</td>" +
                            "<td>" + emplist[i].role + "</td>" +
                            "<td class='td'>" + "<input type='button' id='updaterecord' class='btn btn-default btn-info' value='EDIT' onclick='EditRecord(" + emplist[i].id + ")'>" + "</td>" +
                            "<td class='td'>" + "<input type='button' id='deleterecord' value='DELETE' class='btn btn-default btn-danger' onclick='DeleteRecord(" + emplist[i].id + ")'>" + "</td>" +
                            "</tr>";

                        setdata.insertAdjacentHTML('beforeend', data);                      
                    }

                    if (role == 'Student') {
                        debugger;
                        document.getElementById('hr').style.display = 'none';
                        document.getElementById('addrecord').style.display = 'none';

                        var th = document.getElementsByClassName('th');
                        for (var i = 0; i < th.length; i++) {
                            th[i].style.display = 'none';
                        }

                        var td = document.getElementsByClassName('td');
                        for (var j = 0; j < td.length; j++) {
                            td[j].style.display = 'none';
                        }
                    }

                } else {
                    console.error('Error: ' + xhr.status);
                }
            }
        };
        xhr.send();
    }
}

function SubmitRecord() {
    var gender = "";
    var genderInputs = document.querySelectorAll('input[type=radio]:checked');
    debugger;
    if (genderInputs.length > 0) {
        gender = genderInputs[0].value;
    }
    document.getElementById('gender').value = gender;

    var id = document.getElementById('id').value;

    var requestData = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value
    };
    var token = sessionStorage.getItem('Token');
    var authHeaders = {
        'Authorization': 'Bearer ' + token
    };
    if (id == 0) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://localhost:44328/api/student/AddStudent', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', authHeaders.Authorization);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    window.location.href = "StudentRecord";
                } else {
                    console.log(xhr.responseText);
                }
            }
        };
        xhr.send(JSON.stringify(requestData));
    } else {
        var updateXhr = new XMLHttpRequest();
        updateXhr.open('PUT', 'https://localhost:44328/api/student/UpdateStudent/' + id, true);
        updateXhr.setRequestHeader('Content-Type', 'application/json-patch+json');
        updateXhr.setRequestHeader('Authorization', authHeaders.Authorization);
        updateXhr.onreadystatechange = function () {
            if (updateXhr.readyState == XMLHttpRequest.DONE) {
                if (updateXhr.status == 200) {
                    window.location.href = "StudentRecord";
                } else {
                    console.log(updateXhr.responseText);
                }
            }
        };
        updateXhr.send(JSON.stringify(requestData));
    }
}
function getData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    document.getElementById('id').value = id;
    var token = sessionStorage.getItem('Token');
    var authHeaders = {
        'Authorization': 'Bearer ' + token
    };

    if (id != 0) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://localhost:44328/api/student/GetStudentbyid/' + id, true);
        xhr.setRequestHeader('Authorization', authHeaders.Authorization);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    var response = JSON.parse(xhr.responseText);

                    document.getElementById('fname').value = response.fname;
                    document.getElementById('lname').value = response.lname;
                    document.getElementById('dob').value = response.dob;
                    if (response.gender === 'Male') {
                        document.getElementById('Male').checked = true;
                    } else {
                        document.getElementById('Female').checked = true;
                    }
                    document.getElementById('email').value = response.email;
                    document.getElementById('username').value = response.username;
                    document.getElementById('password').value = response.password;
                    document.getElementById('role').value = response.role;
                } else {
                    console.error('Error: ' + xhr.status);
                }
            }
        };
        xhr.send();
    }
}

