const DATABASE_NAME = "runescape_tracker_pwa";
let database;

async function openDB(database_name, database_version, upgrade_function) {
  return new Promise(function (resolve, reject) {
    let request = indexedDB.open(database_name, database_version);

    request.onsuccess = function () {
      console.log("Database opened successfully")
      resolve(request.result);
    }

    request.onerror = function (event) {
      console.log(`Failed to open database - Supplied Data {${database_name},${database_version},${upgrade_function}} Code: ${event.target.errorCode} Error: ${request.error}`)
      reject(`Failed to open database - Supplied Data {${database_name},${database_version},${upgrade_function}} Code: ${event.target.errorCode} Error: ${request.error}`)
    };

    request.onupgradeneeded = function (event) {
      console.log('OnUpgradeNeeded - Called')
      upgrade_function(event.target.result)
        .then(console.log("Database Upgrade Successful"))
        .catch((reason)=>{console.log(`Database Upgrade Failed, Reason: ${reason}`)})
    };

  });
}

async function upgrade_rs_table(database) {
  return new Promise(function (resolve, reject) {
    try {
      if (!database.objectStoreNames.contains('records')) {
        let records_table = database.createObjectStore('records', {
          autoIncrement: true
        })
        records_table.createIndex('username', 'username', {
          unique: false
        });
      }
      resolve("Upgrade Successful")
    } catch (error) {
      reject(error)
    }
  });
}

function addRecord(data) {

  let transaction = database.transaction("records", "readwrite");

  transaction.oncomplete = function () {
    console.log("Add Transaction Successful.");
  };

  transaction.onerror = function (event) {
    console.log(`Error: Add Record - Transaction: ${{'Data': data,'Error': event.target.error}}`)
  };

  var objectStore = transaction.objectStore("records");

  var record_request = objectStore.add(data);

  record_request.onsuccess = function (event) {
    console.log("Add Request Successful.")
  };

  record_request.onerror = function (event) {
    console.log("Error: Add Record - Request:")
    console.log({
      'Data': data,
      'Error': event.target.error
    })
  };

}

function getRecords(username) {
  var get_transaction = database.transaction("records", "readonly");

  get_transaction.onerror = function (event) {
    console.log(`Error: Get All Records - Transaction: ${{'username':username,'Error':event.target.error}}`)
  }

  get_transaction.onsuccess = function () {
    console.log("Get All Transaction Successful")
  }

  var objectStore = get_transaction.objectStore("records");

  var get_all_request = objectStore.getAll();

  get_all_request.onsuccess = function (event) {
    console.log("Get All Request Successful");
    console.log(event.target.result);
  }

  get_all_request.onerror = function (event) {
    console.log(`Error: Get All Records - Request: ${{'username':username,'Error':event.target.error}}`);
  }
}

function deleteRecord(username) {
  var delete_transaction = database.transaction("records", "readwrite");

  delete_transaction.onerror = function (event) {
    console.log(`Error: Delete Record - Transaction: ${{'username':username,'Error:':event.target.error}}`)
  }

  delete_transaction.onsuccess = function (event) {
    console.log("Delete Transaction Successful")
  }

  var objectStore = delete_transaction.objectStore("records");

  var delete_request = objectStore.delete(username)

  delete_request.onsuccess = function () {
    console.log("Delete Record Request Successful")
  }

  delete_request.onerror = function (event) {
    console.log(`Error: Delete Record - Request: ${{'username':username,'Error:':event.target.error}}`)
  }
}