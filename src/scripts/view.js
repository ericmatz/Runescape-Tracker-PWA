const DATABASE_NAME = "runescape_tracker_pwa";
const OBJECTSTORE = "records";
/**
 * 
 * @param {IDBDatabase} database 
 */
function upgradeDB(database) {
    return new Promise(function (resolve, reject) {
        //Create Table
        if (!database.objectStoreNames.contains('records')) {
            let records_table = database.createObjectStore('records', { keyPath: "id", autoIncrement: true })
            records_table.createIndex('username', 'username', { unique: false });
            records_table.createIndex('type', 'type', { unique: false });
            records_table.createIndex('id', 'id', { unique: true });
            resolve("Upgrade Successful.");
        } else {
            reject("ObjectStore already exists?")
        }
    });
}

window.onload = function () {
    let skillsTable = document.getElementById("skillTable"), otherTable = document.getElementById("otherTable"), usernameHeader = document.getElementById("usernameHeader");

    const params = new URLSearchParams(window.location.search)
    console.log(params.get('id'))

    openDB(DATABASE_NAME, 1, upgradeDB)
        .then((database) => {
            getRecordsOnIndex(database, OBJECTSTORE, 'id', parseInt(params.get('id')))
                .then((results) => {
                    console.log(results)
                    usernameHeader.innerHTML = results[0].username
                    buildTable(results[0].stats)
                })
                .catch((result) => {
                    throw result;
                });
        })
        .catch((result) => {
            throw result;
        });

    function buildTable(data) {
        //skill,boss,game
        Object.entries(data).forEach(([key, values]) => {
            //skill/activity
            Object.entries(values).forEach(([entry, values2]) => {
                //determine which table it falls under
                Object.keys(values2).length == 3
                    ? (newRow = skillsTable.insertRow(-1))
                    : Object.keys(values2).length == 2
                        ? (newRow = otherTable.insertRow(-1))
                        : _throw(
                            `Error: Unknown Data Structure In buildTable: \n Key: ${key} \n Value: ${values2}`
                        );
                newRow.className = entry;
                newRow.insertCell(-1).outerHTML = `<th scope="row">${entry}</th>`;

                //newRow.insertCell(-1).appendChild(document.createTextNode(entry));
                //rank:x,level/participation/experience
                Object.entries(values2).forEach(([col, value]) => {
                    newRow.insertCell(-1).appendChild(document.createTextNode(value));
                });
            });
        });
    }
};