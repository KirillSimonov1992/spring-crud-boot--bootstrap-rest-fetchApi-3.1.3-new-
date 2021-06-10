// URLs
const URL_GET_INFO_LOGGING_USER = "/users/current"
const URL_GET_INFO_ALL_USERS = "/users"
const URL_PUT_INFO_SELECT_USERS = "http://localhost:8080/users/"

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
    user.roles.forEach(role => {
        document.querySelector('#roleAuthUser')
            .insertAdjacentHTML('afterbegin', `<a className="font-weight-bold">${role.name} </a>`);
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
        return response.json();
    }).then(function(json) {
        callback(json)
    }).catch(function(err) {
        console.log('Error download: ' + err.message);
    });
}

/**
 * Отправка данных
 */
function sendData(url, typeMethodHttp, data = {}, callback) {
    fetch(url, {
        method: typeMethodHttp,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(
        callback()
    ).catch(function(err) {
        console.log('Ошибка загрузки: ' + err.message);
    });
}

function deleteUser(element) {
    const form = element.form
    sendData("/users/" + form.id.value, "Delete", {},() => {
        /* Обновим таблицы */
        getData(URL_GET_INFO_ALL_USERS, fillAdminTable)
    })
}

function fillRoles() {
    const select = document.querySelector(`#selectCreateUser`)
    select.innerHTML = ''
    getData(`/roles`,  (roles) => {
        roles.forEach(role => {
            select.insertAdjacentHTML('afterbegin', `<option value="${role.id}">${role.name}</option>`);
        })
    })
}

/**
 * Генерирование тела запроса для POST, PUT
 * Определяется метод по скрытому полю в форме
 * (редактирование пользователя)
 */
function requestUser(element) {
    const form = element.form
    const typeMethodHTTP = element.form.getElementsByTagName("input")[0].value
    let body = {
        "name": form.name.value,
        "surname": form.surname.value,
        "age": Number(form.age.value),
        "email": form.email.value,
        "password": form.password.value,
        "active": Boolean(form.active.value),
        "roles": []
    }
    if (typeMethodHTTP == "PUT") {
        body.id = Number(form.id.value)
    }
    const options = form.getElementsByTagName("select")[0].options
    for (var i = 0, iLen = options.length; i < iLen; i++) {
        if (options[i].selected) {
            body['roles'].push({
                "id": Number(options[i].value),
                "name": options[i].text
            });
        }
    }
    sendData("/users", typeMethodHTTP, body, () => {
        /* Обновим таблицы */
        getData(URL_GET_INFO_ALL_USERS, fillAdminTable)
        if (typeMethodHTTP == "PUT") {
            getData(URL_GET_INFO_LOGGING_USER, fillInfoAboutUser)
        }
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
    let idElement = element.id.split(" ")
    let idUser = idElement[idElement.length - 1]
    let idDivOutsideForm = element.getAttribute("data-target")
                                  .slice(1)
    let form = document.querySelector(`#${idDivOutsideForm}`)
                       .getElementsByTagName('form')[0]
    let select = form.getElementsByTagName('select')[0]
    select.innerHTML = ''
    getData(URL_PUT_INFO_SELECT_USERS + idUser, (user) => {
        form.elements.id.value = user.id
        form.elements.name.value = user.name
        form.elements.surname.value = user.surname
        form.elements.age.value = user.age
        form.elements.email.value = user.email
        form.elements.password.value = user.password
        form.active.value = user.active;
        getData(`/roles`,  (roles) => {
            roles.forEach(role => {
                if (user.roles.map(r => {return r.name;}).join(', ').includes(role.name)) {
                    select.insertAdjacentHTML('afterbegin', `<option value="${role.id}" selected>${role.name}</option>`);
                } else {
                    select.insertAdjacentHTML('afterbegin', `<option value="${role.id}">${role.name}</option>`);
                }
            })
        })
    })

}


/* Заполним компоненты зависящие от аутентифицированного пользователя */
getData(URL_GET_INFO_LOGGING_USER, fillInfoAboutUser)
getData(URL_GET_INFO_ALL_USERS, fillAdminTable)





