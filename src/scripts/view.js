import {openDB, getRecordsOnIndex} from "./libraries/IndexedDB_Wrapper_Promises/database.js"
import {DATABASE_NAME,upgradeDB} from "./utilities.js"

function parseDate(UTC) {
    console.log()
    let date = new Date(UTC);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}


window.onload = function () {
    let skillsTable = document.getElementById("skillTable"), otherTable = document.getElementById("otherTable"), usernameHeader = document.getElementById("usernameHeader"), recordTimestamp = document.getElementById("recordTimestamp"), recordID = document.getElementById("recordID");

    const params = new URLSearchParams(window.location.search)
    console.log(params.get('id'))

    openDB(DATABASE_NAME, 1, upgradeDB)
        .then((database) => {
            getRecordsOnIndex(database, 'records', 'id', parseInt(params.get('id')))
                .then((results) => {
                    console.log(results)
                    if(results.length == 1){
                        usernameHeader.innerHTML = results[0].username
                        recordTimestamp.innerHTML = `Date: ${parseDate(results[0].timestamp)}`
                        recordID.innerHTML = `ID: ${results[0].id}`
                        buildTable(results[0].stats)
                    }else{
                        console.error("No results returned for the provided ID")
                    }
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