window.onload = (function () {

  const DATABASE_NAME = "runescape_tracker_pwa";
  let database;
  let request = indexedDB.open(DATABASE_NAME, 1);

  request.onerror = function () {
    console.log("failed opening DB: " + request.errorCode + "\n" + request.error)
  };

  request.onupgradeneeded = function () {
    console.log('OnUpgradeNeeded - Called')
    let database = request.result;

    if (!database.objectStoreNames.contains('users')) {
      let user_table = database.createObjectStore('users', {
        keyPath: "username",
        autoIncrement: true
      });
      user_table.createIndex('type', 'type', {
        unique: false
      });
    }

    if (!database.objectStoreNames.contains('records')) {
      let records_table = database.createObjectStore('records', {
        autoIncrement: true
      })
      records_table.createIndex('username', 'username', {
        unique: false
      });
      records_table.createIndex('date', 'date', {
        unique: false
      });
    }

  };

  request.onsuccess = function () {
    database = request.result
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
    var get_transaction = database.transaction(["records"], "readonly");

    get_transaction.onerror = function (event) {
      console.log(`Error: Get All Records - Transaction: ${{'username':username,'Error':event.target.error}}`)
    }

    get_transaction.onsuccess = function (event){
      console.log("Get All Transaction Successful")
    }

    var objectStore = get_transaction.objectStore("records");

    var get_all_request = objectStore.getAll(IDBKeyRange.only(username));

    get_all_request.onsuccess = function (event) {
      console.log("Get All Request Successful");
    }
  
    get_all_request.onerror = function(event){
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
  
    delete_request.onerror = function(event){
      console.log(`Error: Delete Record - Request: ${{'username':username,'Error:':event.target.error}}`)
    }
  }

})