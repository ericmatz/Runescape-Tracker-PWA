import { openDB, deleteRecords, getRecordsOnObjectStore } from "./libraries/IndexedDB_Wrapper_Promises/database.js"
import { DATABASE_NAME, upgradeDB, parseDate } from "./utilities.js"

const OBJECTSTORE = "records";

function createRecordEntry(value) {

    let div = "";
    Object.entries(value).forEach(([key, value]) => {
        div += `
        <div class="recordEntry">
            <div class="button-group">
                <button data-id=${value.id} class="btnView">View</button>
                <button data-id=${value.id} class="btnDelete">Delete</button>
            </div>
            <div>${parseDate(parseInt(key))}</div>
        </div>
        `
    });

    return div;
}

function createTypeEntry(value) {

    let div = "";

    Object.entries(value).forEach(([key, value]) => {
        div += `
        <div class="typeEntry">
        <h3>${key}</h3>
        ${createRecordEntry(value)}
        </div>
    `
    })

    return div;
}

function createElement(username, value) {
    let div = document.createElement("div");
    div.className = "collection"
    div.innerHTML = `
            <h2>${username}</h2>
            ${createTypeEntry(value)}
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

function deleteRecord(event) {
    openDB(DATABASE_NAME, 1, upgradeDB)
        .then(database => {
            deleteRecords(database, 'records', 'id', parseInt(event.target.dataset.id))
                .then(result => { console.log(result) })
                .catch(result => { throw result });
        })
        .catch(result => { throw result })

}

function viewRecord(event) {
    window.location.assign(`view.html?id=${parseInt(event.target.dataset.id)}`)
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
