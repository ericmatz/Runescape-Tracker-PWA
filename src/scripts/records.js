import { openDB, deleteRecordsOnKeyPath, getRecordsOnObjectStore } from "./libraries/IndexedDB_Wrapper_Promises/database.js"
import { DATABASE_NAME, upgradeDB, parseDate } from "./utilities.js"

const OBJECTSTORE = "records";

//builds records
function createRecordEntry(value) {

    let div = "";


    Object.entries(value).forEach(([key, value]) => {
        div += `
            <div class="dropdown">
                <div class="dropdown-header">${key}</div>
                <div class="dropdown-body">
                    <div class="button-group">
                        <button data-id=${value.id} class="btnView">View</button>
                        <button data-id=${value.id} class="btnDelete">Delete</button>
                    </div>
                    ${parseDate(parseInt(key))}
                </div>
            </div>
        `
    });

    return div;
}

//builds type
function createTypeEntry(value) {

    let div = "";

    Object.entries(value).forEach(([key, value]) => {
        div += `
            <div class="dropdown">
                <div class="dropdown-header">${key}</div>
                <div class="dropdown-body">${createRecordEntry(value)}</div>
            </div>
    `
    console.log(key,value,div)
    })

    return div;
}

//builds username
function createElement(username, value) {
    let div = document.createElement("div");
    div.className = "dropdown"
    div.innerHTML = `
            <div class="dropdown-header">${username}</div>
            <div class="dropdown-body">${createTypeEntry(value)}</div>
`
    return div;
}

function buildResultSet(data) {

    let list = {};

    data.forEach(row => {
        if (list.hasOwnProperty(row.username)) {
            list[row.username][row.type] = { ...list[row.username][row.type], [row.timestamp]: { 'stats': row.stats, 'id': row.id } };
        } else {
            list = { ...list, [row.username]: { [row.type]: { [row.timestamp]: { 'stats': row.stats, 'id': row.id } } } };
        }
    });

    return list;
}

function deleteRecord() {
    openDB(DATABASE_NAME, 1, upgradeDB)
        .then(database => {
            console.log(database)
            deleteRecordsOnKeyPath(database, 'records', parseInt(this.dataset.id))
                .then(result => { console.log(result) })
                .catch(result => { throw result });
        })
        .catch(result => { throw result })

}

function viewRecord() {
    window.location.assign(`view.html?id=${parseInt(this.dataset.id)}`)
}

function collapse() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    (content.style.display === "block") ? content.style.display = "none" : content.style.display = "block";

}

window.onload = function () {

    openDB(DATABASE_NAME, 1, upgradeDB)
        .then((database) => {
            getRecordsOnObjectStore(database, OBJECTSTORE)
                .then((results) => {
                    let resultSet = buildResultSet(results)

                    Object.entries(resultSet).forEach(([key, value]) => {
                        document.getElementById("container").appendChild(createElement(key, value));
                    });

                    let dropdowns = document.getElementsByClassName("dropdown-header");

                    Array.from(dropdowns).forEach(button => {
                        button.addEventListener("click", collapse);
                    });

                    let deleteButtons = document.getElementsByClassName("btnDelete");

                    Array.from(deleteButtons).forEach(button => {
                        button.addEventListener("click", deleteRecord)
                    });

                    let viewButtons = document.getElementsByClassName("btnView");

                    Array.from(viewButtons).forEach(button => {
                        button.addEventListener("click", viewRecord)
                    });

                })
                .catch((result) => {
                    throw result;
                });
        })
        .catch((result) => {
            throw result;
        });
};
