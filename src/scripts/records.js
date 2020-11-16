const DATABASE_NAME = "runescape_tracker_pwa";
const OBJECTSTORE = "records";
/**
 *
 * @param {IDBDatabase} database
 */
function upgradeDB(database) {
    return new Promise(function (resolve, reject) {
        //Create Table
        if (!database.objectStoreNames.contains("records")) {
            let records_table = database.createObjectStore("records", {
                autoIncrement: true,
            });
            //objectStore.createIndex(indexName, keyPath, { unique: false });
            records_table.createIndex("username", "username", { unique: false });
            records_table.createIndex("type", "type", { unique: false });
            resolve("Upgrade Successful.");
        } else {
            reject("ObjectStore already exists?");
        }
    });
}

function parseDate(UTC) {
    console.log()
    let date = new Date(UTC);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}


function createRecordEntry(value) {

    console.log(value)

    let div = "";

    Object.entries(value).forEach(([key]) => {
        div += `
        <div class="entry">
            <div class="button-group">
                <button>View</button>
                <button>Delete</button>
            </div>
            <div>${parseDate(parseInt(key))}</div>
        </div>
        `
    });

    return div;
}

function createTypeEntry(value) {

    console.log(value)

    let div = "";

    Object.entries(value).forEach(([key, value]) => {
        div += `
        <div>
        <h3>${key}</h3>
        ${createRecordEntry(value)}
        </div>
    `
    })

    return div;
}

function createElement(username, value) {
    console.log(username, value)
    let div = document.createElement("div");
    div.className = "entry"
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
            list[row.username][row.type] = { ...list[row.username][row.type], [row.timestamp]: { 'stats': row.stats } };
        } else {
            list = { ...list, [row.username]: { [row.type]: { [row.timestamp]: { 'stats': row.stats } } } };
        }
    });

    return list;
}

window.onload = function () {
    openDB(DATABASE_NAME, 1, upgradeDB)
        .then((database) => {
            getRecordsOnObjectStore(database, OBJECTSTORE)
                .then((results) => {
                    let resultSet = buildResultSet(results)
                    Object.entries(resultSet).forEach(([key, value]) => {
                        let ele = createElement(key, value);
                        console.log(ele)
                        document.getElementById("container").appendChild(ele);
                    })
                })
                .catch((result) => {
                    throw result;
                });
        })
        .catch((result) => {
            throw result;
        });
};
