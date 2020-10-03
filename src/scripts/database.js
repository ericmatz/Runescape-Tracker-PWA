if (!window.indexedDB) {
  alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

// Let us open our database
var request = window.indexedDB.open("username", 3);
var db;

request.onerror = function(event) {
  // Do something with request.errorCode!
  console.error("Database error: " + event.target.errorCode);
};

request.onsuccess = function(event) {
  // Do something with request.result!
  db = event.target.result;
};

request.onupgradeneeded = function(event) {
  var db = event.target.result;

  // Create an objectStore to hold information about our customers. We're
  // going to use "ssn" as our key path because it's guaranteed to be
  // unique - or at least that's what I was told during the kickoff meeting.
  var objectStore = db.createObjectStore("users", {
    keyPath: "username"
  });

  // Create an index to search customers by name. We may have duplicates
  // so we can't use a unique index.
  objectStore.createIndex("username", "username", {
    unique: true
  });

  // Use transaction oncomplete to make sure the objectStore creation is
  // finished before adding data into it.
  objectStore.transaction.oncomplete = function(event) {
    // Store values in the newly created objectStore.
    // var usersObjectStore = db.transaction("users", "readwrite").objectStore("users");
    // userData.forEach(function(customer) {
    //   customerObjectStore.add(customer);
    // });
  };
};

function addRecord(user){
  db.transaction("users", "readwrite").objectStore("users").add(user);
}
