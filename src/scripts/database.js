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
    database = request.result
    addRecord({'username':'Limerain2','type':'ironman'})
  }

  function addRecord(data) {

    var transaction = database.transaction("users", "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
      console.log("Record Inserted");
    };

    transaction.onerror = function (event) {
      // Don't forget to handle errors!
      console.log("An error occurred in addRecord:")
      console.log({
        'Data': data,
        'Error': event
      })
    };

    var objectStore = transaction.objectStore("users");

    var request = objectStore.add(data);

    request.onsuccess = function (event) {
      console.log(event.target.result)
      // event.target.result === customer.ssn;
    };

  }

})