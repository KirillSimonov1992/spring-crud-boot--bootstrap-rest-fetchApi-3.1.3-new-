// URLs
const URL_GET_INFO_LOGGING_USER = "/api/users/current"
const URL_GET_INFO_ALL_USERS = "/api/users"
const URL_PUT_INFO_SELECT_USERS = "/api/users/"
const URL_ALL_ROLES =  "/api/roles"

/**
 * Заполнение компонентов зависимых от входящего юзера:
 *  шапка страницы, левого меню(зависит от роли), таблица юзера
 * @param user - данные о юзере
 */
function fillInfoAboutUser(user) {
    let div = document.querySelector('#leftMenuDiv');
    div.innerHTML=''
    let roles = user.roles.map(r => {return r.name;}).join(', ')
    // Заполнение левого меню в зависимости от роли
    if (roles.includes('ADMIN')) {
        div.insertAdjacentHTML('afterbegin',
            `<a class="nav-link active" id="pillAdmin" data-toggle="pill" href="#adminTab" role="tab" aria-controls="adminTab" aria-selected="true">Admin</a>
              <a class="nav-link" id="pillUser" data-toggle="pill" href="#userTab" role="tab" aria-controls="userTab" aria-selected="false">User</a>`
        );
    } else {
        div.insertAdjacentHTML('afterbegin',
            `<a class="nav-link active" id="pillUser" data-toggle="pill" href="#userTab" role="tab" aria-controls="userTab" aria-selected="true">User</a>`
        );
        document.querySelector('#adminTab').style.display = 'none'
        document.querySelector('#userTab').style.display = 'inline'
    }
    // Заполнение шапки страницы, информацией о пользователе
    document.querySelector('#emailAuthUser').innerText = user.email;
    let element = document.querySelector('#roleAuthUser');
    element.innerHTML = ''
    user.roles.forEach(role => {
        element.insertAdjacentHTML('afterbegin', `<a className="font-weight-bold">${role.name} </a>`);
    });
    // Заполнение страницы пользователя
    let tableInfoUser = document.querySelector('#bodyInfoAboutUser');
    // Очистка таблицы
    tableInfoUser.innerHTML ='';
    tableInfoUser.insertAdjacentHTML('afterbegin',
        `<tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.surname}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${roles}</td>
               </tr>`
    );
}

/**
 * Запрос на данные
 */
function getData(url, callback = {}) {
    fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    }).then(function(response) {
        if (!response.ok) {
            return new Error("status")
        }
        return response.json();
    }).then(function(json) {
        callback(json)
    }).catch(function(err) {
        console.log('Error download: ' + err.message);
    });
}

function fillRoles() {
    const form = document.getElementById("formCreate")
    const collInputs = form.getElementsByTagName("input")
    /**
     * Первый и последний инпат служебные
     */
    for(var i = 1, iLength = collInputs - 1; i < iLength; i++){
        collInputs[i].value = ""
    }
    const select = document.querySelector(`#selectCreateUser`)
    select.innerHTML = ''
    getData(URL_ALL_ROLES,  (roles) => {
        roles.forEach(role => {
            select.insertAdjacentHTML('afterbegin', `<option value="${role.name}">${role.name}</option>`);
        })
    })
}

function fillAdminTable(users) {
    const table = document.querySelector(`#bodyAboutAllUsers`);
    table.innerHTML ='';
    users.forEach(user => {
        table.insertAdjacentHTML('afterbegin',
            `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.surname}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${user.roles.map(r => {return r.name;}).join(', ')}</td>
                        <td>
                            <button id="editButton ${user.id}" class="btn-info" data-toggle="modal" data-target='#editModal' onclick="fillModal(this)">Edit</button>
                        </td>
                        <td>
                            <button id="deleteButton ${user.id}" class="btn-danger" data-toggle="modal" data-target='#deleteModal' onclick="fillModal(this)">Delete</button>
                        </td>
                </tr>`
        );
    });
}

/**
 * Заполнение модального окна, в зависимости от кнопки
 * @param element - Элемент модального окна из DOM
 */
function fillModal(element) {
    const idElement = element.id.split(" ")
    const idUser = idElement[idElement.length - 1]
    const idDivOutsideForm = element.getAttribute("data-target")
                                  .slice(1)
    const form = document.querySelector(`#${idDivOutsideForm}`)
                       .getElementsByTagName('form')[0]
    if (form.getAttribute("id") == "formDelete") {
        form.action = "/admin/user-delete/" + idUser
    }
    const select = form.getElementsByTagName('select')[0]
    select.innerHTML = ''
    getData(URL_PUT_INFO_SELECT_USERS + idUser, (user) => {
        form.elements.id.value = user.id
        form.elements.name.value = user.name
        form.elements.surname.value = user.surname
        form.elements.age.value = user.age
        form.elements.email.value = user.email
        form.elements.password.value = user.password
        form.active.value = user.active;
        getData(URL_ALL_ROLES,  (roles) => {
            roles.forEach(role => {
                if (user.roles.map(r => {return r.name;}).join(', ').includes(role.name)) {
                    select.insertAdjacentHTML('afterbegin', `<option value="${role.name}" selected>${role.name}</option>`);
                } else {
                    select.insertAdjacentHTML('afterbegin', `<option value="${role.name}">${role.name}</option>`);
                }
            })
        })
    })

}

/* Заполним компоненты зависящие от аутентифицированного пользователя */
getData(URL_GET_INFO_LOGGING_USER, fillInfoAboutUser)
getData(URL_GET_INFO_ALL_USERS, fillAdminTable)

/**
 * Отправка данных
 */
// async function sendData(url, typeMethodHttp, data = {}) {
//     return fetch(url, {
//         method: typeMethodHttp,
//         body: JSON.stringify(data),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).catch(function(err) {
//         console.log('Ошибка загрузки: ' + err.message);
//     });
// }

// async function deleteUser(element) {
//     const form = element.form
//     await sendData("/users/" + form.id.value, "Delete", {})
//     getData(URL_GET_INFO_ALL_USERS, fillAdminTable)
// }

/**
 * Генерирование тела запроса для POST, PUT
 * Определяется метод по скрытому полю в форме
 * (редактирование пользователя)
 */
// async function requestUser(element) {
//     const form = element.form
//     const typeMethodHTTP = element.form.getElementsByTagName("input")[0].value
//     let body = {
//         "name": form.name.value,
//         "surname": form.surname.value,
//         "age": Number(form.age.value),
//         "email": form.email.value,
//         "password": form.password.value,
//         "active": Boolean(form.active.value),
//         "roles": []
//     }
//     if (typeMethodHTTP == "PUT") {
//         body.id = Number(form.id.value)
//
//     }
//     const options = form.getElementsByTagName("select")[0].options
//     for (var i = 0, iLen = options.length; i < iLen; i++) {
//         if (options[i].selected) {
//             body['roles'].push({
//                 "id": Number(options[i].value),
//                 "name": options[i].text
//             });
//         }
//     }
//     await sendData("/users", typeMethodHTTP, body)
//     /* Обновим таблицы */
//     getData(URL_GET_INFO_ALL_USERS, fillAdminTable)
//     if (typeMethodHTTP == "PUT") {
//         getData(URL_GET_INFO_LOGGING_USER, fillInfoAboutUser)
//     }
// }





