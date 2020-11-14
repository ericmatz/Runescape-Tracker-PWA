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

function parseDate(UTC){
    let date = new Date(UTC);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function createElement(data){
    let div = document.createElement("div");
        div.className = "entry"
        div.innerHTML = 
        `
        <div class="entry">
            <div class="button-group">
                <button>View</button>
                <button>Delete</button>
            </div>
            <div>${data.username}</div>
            <div>${data.type}</div>
            <div>${parseDate(data.timestamp)}</div>
        </div>
        `
    return div;
}

window.onload = function () {
    openDB(DATABASE_NAME, 1, upgradeDB)
        .then((database) => {
            getRecordsOnObjectStore(database, OBJECTSTORE)
                .then((results) => {
                    results.forEach(entry => {
                        document.getElementById("container").appendChild(createElement(entry))
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
