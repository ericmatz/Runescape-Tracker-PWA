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

  request.onsuccess = function (event) {
    const username = 'Limerain6'
    database = request.result
    addRecord({
      'username': username,
      'type': 'normie'
    })
    deleteRecord(username)
  }

  function addRecord(data) {

    let transaction = database.transaction("users", "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
      console.log("Record Inserted");
    };

    transaction.onerror = function (event) {
      // Don't forget to handle errors!
      console.log("An error occurred in addRecord:")
      console.log({
        'Data': data,
        'Error': event.target.error
      })
    };

    var objectStore = transaction.objectStore("users");

    var request = objectStore.add(data);

    request.onsuccess = function (event) {
      console.log(event.target.result)
      // event.target.result === customer.ssn;
    };

  }

  function getRecords() {

  }

  function deleteRecord(username) {
    var delete_transaction = database.transaction("users", "readwrite");

    delete_transaction.onerror = function (event) {
      console.log("An error occurred in removeRecord:")
      console.log({
        'username': username,
        'Error': event.target.error
      })
    }

    delete_transaction.onsuccess = function (event) {
      console.log(event.target.result)
    }

    var objectStore = delete_transaction.objectStore("users");

    var delete_request = objectStore.delete(username)
  
    delete_request.onsuccess = function (event) {
      console.log(event.target.result)
    }
  
    delete_request.onerror = function(event){
      console.log("Error in RemoveRecord request:")
      console.log(event.target.error)
    }
  }

})