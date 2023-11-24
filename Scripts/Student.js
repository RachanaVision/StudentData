
function login() {
    var requestData = {
        username: $('#username').val(),
        password: $('#password').val()
    };

    $.ajax({
        url: 'https://localhost:44328/Authenticate/Login',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function (logindetails) {

            var token = logindetails.value;

            let jwtData = token.split('.')[1];
            let decodedJwtJsonData = window.atob(jwtData);
            let decodedJwtData = JSON.parse(decodedJwtJsonData);
            let role = decodedJwtData.role;

            sessionStorage.setItem('Role', role);
            sessionStorage.setItem('Token', token);
            window.location.href = "/Home/StudentRecord";
        },
        error: function (msg) {
            alert(msg);
        }
    });
}

function AddRecord() {
    window.location.href = "AddRecord";
}

function EditRecord(id) {
    var url = "AddRecord?id=" + id;
    window.location.href = url;
}

function DeleteRecord(id) {

    var token = sessionStorage.getItem('Token');

    var authHeaders = {
        'Authorization': 'Bearer ' + token
    };
    if (confirm("Are you sure you want to Delete.???")) {
        $.ajax({
            url: 'https://localhost:44328/api/student/DeleteStudent?id=' + id,
            type: 'DELETE',
            headers: authHeaders,
            success: function (response) {
                $('#setuser').empty();
                DataBind();
            },
            error: function (msg) {
                alert(msg.responseText);
            }
        })
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
    }
    else {
        $.ajax({
            url: 'https://localhost:44328/api/student/GetStudents',
            type: 'GET',
            headers: authHeaders,
            success: function (emplist) {
                var setdata = $('#setuser');

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
                        "<td class='td'>" + "<input type='button' id='updaterecord' class='btn btn-default btn-info' value='EDIT' onclick=EditRecord(" + emplist[i].id + ")>" + "</td>" +
                        "<td class='td'>" + "<input type='button' id='deleterecord' value='DELETE' class='btn btn-default btn-danger' onclick=DeleteRecord(" + emplist[i].id + ")>" + "</td>" +
                        "</tr>";

                    setdata.append(data);
                    $('#status').html("");

                }
                if (role == 'Student') {
                    $('#hr').hide();
                    $('.th').hide();
                    $('.td').hide();
                    $('#addrecord').hide();
                }
            },
            error: function (error) {
                aletr(error);
            }
        });
    }
}

function SubmitRecord() {

    var gender = "";
    gender = $('input[type=radio]:checked').val()
    $('#gender').val(gender);

    var id = $('#id').val();

    var requestData = {
        fname: $('#fname').val(),
        lname: $('#lname').val(),
        dob: $('#dob').val(),
        gender: $('#gender').val(),
        email: $('#email').val(),
        username: $('#username').val(),
        password: $('#password').val(),
        role: $('#role').val()
    };
    var token = sessionStorage.getItem('Token');
    var authHeaders = {
        'Authorization': 'Bearer ' + token
    };
    if (id == 0) {
        $.ajax({
            url: 'https://localhost:44328/api/student/AddStudent',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            headers: authHeaders,
            success: function (response) {
                window.location.href = "StudentRecord";
            },
            error: function (msg) {
                alert(msg);
            }
        });
    }
    else {
        $.ajax({
            url: 'https://localhost:44328/api/student/UpdateStudent/' + id,
            type: 'PUT',            
            contentType: 'application/json-patch+json',
            data: JSON.stringify(requestData),
            headers: authHeaders,
            success: function (response) {               
                window.location.href = "StudentRecord";
            },
            error: function (msg) {
               console.log(msg)
            }
        });
    }
   
}

function cancelclick() {
    window.location.href = "StudentRecord";
}

function getData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    $('#id').val(id);
    var token = sessionStorage.getItem('Token');
    var authHeaders = {
        'Authorization': 'Bearer ' + token
    };

    if (id != 0) {
        $.ajax({
            url: 'https://localhost:44328/api/student/GetStudentbyid/' + id,
            type: 'GET',
            headers: authHeaders,

            success: function (response) {

                $('#fname').val(response.fname);
                $('#lname').val(response.lname);
                $('#dob').val(response.dob);
                if (response.gender == "Male") {
                    $('#Male').prop("checked", true);
                }
                else {
                    $('#Female').prop("checked", true);
                }
                $('#email').val(response.email);
                $('#username').val(response.username);
                $('#password').val(response.password);
                $('#role').val(response.role);
            },
            error: function (msg) {
                console.log(msg);
            }
        })
    }
}