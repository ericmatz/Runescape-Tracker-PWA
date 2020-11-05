const DATABASE_NAME = "runescape_tracker_pwa";
let database;

  const DATABASE_NAME = "runescape_tracker_pwa";
  let database;
  let request = indexedDB.open(DATABASE_NAME, 2.1);

  request.onerror = function () {
    console.log("failed opening DB: " + request.errorCode + "\n" + request.error)
  };

  request.onupgradeneeded = function () {
    console.log('OnUpgradeNeeded - Called')
    let database = request.result;

    //Create Table
    if (!database.objectStoreNames.contains('records')) {
      let records_table = database.createObjectStore('records', {
        autoIncrement: true
      })
      //objectStore.createIndex(indexName, keyPath, { unique: false });
      records_table.createIndex('username', 'username', {unique: false});
      records_table.createIndex('type', 'type', {unique: false});
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

<<<<<<< HEAD
    record_request.onsuccess = function () {
      console.log("Add Request Successful.")
    };
=======
}
>>>>>>> 0682d873bf834bd3d8c928393b8fd898576a98eb

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

<<<<<<< HEAD
    var get_all_request = objectStore.index('username').getAll(username);
=======
  get_all_request.onerror = function (event) {
    console.log(`Error: Get All Records - Request: ${{'username':username,'Error':event.target.error}}`);
  }
}
>>>>>>> 0682d873bf834bd3d8c928393b8fd898576a98eb

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
<<<<<<< HEAD

  function getUsers(){
    var get_transaction = database.transaction("records", "readonly");

    get_transaction.onerror = function (event) {
      console.log(`Error: Get Users - Transaction: ${{'Error:':event.target.error}}`)
    }

    get_transaction.onsuccess = function (event) {
      console.log("Get Transaction Successful")
    }

    var objectStore = get_transaction.objectStore("records");

    var get_request = objectStore.index('username').getAllKeys()

    get_request.onsuccess = function () {
      console.log("Get Users Request Successful")
      console.log(get_request.result)
    }
  
    get_request.onerror = function(event){
      console.log(`Error: Get Users - Request: ${{'Error:':event.target.error}}`)
    }
  }
=======
}
>>>>>>> 0682d873bf834bd3d8c928393b8fd898576a98eb
