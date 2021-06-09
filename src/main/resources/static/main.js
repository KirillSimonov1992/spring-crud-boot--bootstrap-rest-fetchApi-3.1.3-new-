/**
 * Взятие данных с сервера
 * @param url - адрес
 * @returns {Promise<any>}
 */
function getData(url) {
    const response = fetch(url, {
        headers: {
            'Accept': 'application/json'
            }
    });
    return response.then(r => {return r.json()}); // parses JSON response into native JavaScript objects
}



/*
    ================================= Проблема ============================== spring-crud-boot--bootstrap-rest-fetchApi-3.1.3
 */
/**
 * Отправка данных на сервер
 * @param url - адрес
 * @param typeMethodHttp - тип HTTP запроса
 * @param data - тело HTTP метода
 */
function sendData(url, typeMethodHttp, data) {
    console.log(data);
    fetch(url, {
        method: typeMethodHttp,
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

/*
    ================================= Проблема: генерация тела метода для PUT ==============================
 */
/**
 * Генерирование тела запроса для PUT
 * (редактирование пользователя)
 */
function postEditUser() {
    var formData = document.querySelector(`#formEdit`);
    let body = {
        "id": Number(formData.id.value),
        "name": formData.name.value,
        "surname": formData.surname.value,
        "age": Number(formData.age.value),
        "email": formData.email.value,
        "password": formData.password.value,
        "isActive" : true,
        "roles": []
    }
    let options = formData.editSelectionList.options;
    for (var i = 0, iLen = options.length; i < iLen; i++) {
        if (options[i].selected) {
            body['roles'].push({
                "id": Number(options[i].value),
                "name": options[i].text
            });
        }
    }
    sendData("/users", "PUT", body);
}

// URLs
const URL_GET_INFO_LOGGING_USER = "/users/current";
const URL_GET_INFO_ALL_USERS = "/users";
// Info for generation html tags. This ready Promises
const infoAuthUser = getData(URL_GET_INFO_LOGGING_USER);
const infoAboutAllUsers = getData(URL_GET_INFO_ALL_USERS);

// Заполнение шапки информацией о пользователе: мыло + роли
infoAuthUser.then(data => {
    document.querySelector('#emailAuthUser').innerText = data.email;
    data.roles.forEach(role => {
        document.querySelector('#roleAuthUser')
                .insertAdjacentHTML('afterbegin', `<a className="font-weight-bold">${role.name} </a>`);
    });
});

/**
 * Заполнение модального окна "Редактирование пользователя"
 * @param element - Элемент модального кона из DOM
 */
function fillModalEdit(element) {
    let idElement = element.id.split(" ");
    let idUser = idElement[idElement.length - 1];
    let form = document.querySelector("#formEdit");
    let infoUser = getData(`http://localhost:8080/users/${idUser}`, "GET");
    infoUser.then(user => {
        form.elements.id.value = user.id;
        form.elements.name.value = user.name;
        form.elements.surname.value = user.surname;
        form.elements.age.value = user.age;
        form.elements.email.value = user.email;
        form.elements.password.value = user.password;
        let rolesPromise = getData(`/roles`, "GET");
        rolesPromise.then(data => {
            let select = form.elements.selectRoles;
            select.innerHTML = '';
            data.forEach(role => {
                if (user.roles.map(r => {return r.name;}).join(', ').includes(role.name)) {
                    select.insertAdjacentHTML('afterbegin', `<option value="${role.id}" selected>${role.name}</option>`);
                } else {
                    select.insertAdjacentHTML('afterbegin', `<option value="${role.id}">${role.name}</option>`);
                }
            });
        });
    });
}


/**
 * Заполнение таблиц
 * @param idTable - fill table with id
 * @param promise - info for fill
 * @param flag :
 *   true - add buttons "Edit" and "Delete
 *      false - without this buttons
 */
function fillTable(idTable, promise, flag) {
    promise.then(data => {
        if (!flag) {
            console.log(data);
            document.querySelector(`#${idTable}`)
                .insertAdjacentHTML('afterbegin',
                `<tr>
                            <td>${data.id}</td>
                            <td>${data.name}</td>
                            <td>${data.surname}</td>
                            <td>${data.age}</td>
                            <td>${data.email}</td>
                            <td>${data.roles.map(r => {return r.name;}).join(', ')}</td>
                    </tr>`
                );
        } else {
            data.forEach(user => {
                document.querySelector(`#${idTable}`)
                    .insertAdjacentHTML('afterbegin',
                    `<tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.surname}</td>
                                <td>${user.age}</td>
                                <td>${user.email}</td>
                                <td>${user.roles.map(r => {return r.name;}).join(', ')}</td>
                                <td>
                                    <button id="editButton ${user.id}" class="btn-info" data-toggle="modal" data-target='#editModal' onclick="fillModalEdit(this)">Edit</button>
                                </td>
                                <td>
                                    <button id="deleteButton ${user.id}" class="btn-danger" data-toggle="modal" data-target='#deleteModal'>Delete</button>
                                </td>
                        </tr>`
                    );
            });
        }

    });
}

if (infoAuthUser.then(user => {user.roles.map(r => {return r.name;}).join(', ').includes('ADMIN')})) {
    // fill info from authentication user in main table (for one)
    fillTable("bodyInfoAboutUser", infoAuthUser, false);
    // fill info about all user bodyAboutAllUsers
    fillTable("bodyAboutAllUsers", infoAboutAllUsers, true);
} else {
    // fill info about all user bodyAboutAllUsers
    fillTable("bodyAboutAllUsers", infoAboutAllUsers, true);
}

// Заполнение левого меню с кнопками по ролям
infoAuthUser.then(user => {
    let div = document.querySelector('#leftMenuDiv');
    if (user.roles.map(r => {return r.name;}).join(', ').includes('ADMIN')) {
        div.insertAdjacentHTML('afterbegin',
            `<a class="nav-link active" id="pillAdmin" data-toggle="pill" href="#adminTab" role="tab" aria-controls="adminTab" aria-selected="true">Admin</a>
                  <a class="nav-link" id="pillUser" data-toggle="pill" href="#userTab" role="tab" aria-controls="userTab" aria-selected="false">User</a>`
            );
    } else {
        div.insertAdjacentHTML('afterbegin',
            `<a class="nav-link active" id="pillUser" data-toggle="pill" href="#userTab" role="tab" aria-controls="userTab" aria-selected="true">User</a>`
            );
        document.querySelector('#adminTab').style.display = 'none'; ;
        document.querySelector('#userTab').style.display = 'inline'; ;
    }
});





