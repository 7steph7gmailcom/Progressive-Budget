let db;

//Connection to db
const request = indexedDB.open("budget", 1);

//create schema -- object stores and our indexes to query
request.onupgradeneeded = function (e) {
  //store a reference to our db
  const db = e.target.result;
  //an object that can be used to query on
  db.createObjectStore(["waiting_new_transaction"], { autoIncrement: true });
};

request.onsuccess = function (e) {
  db = e.target.result;

  //make sure app is online before reiterating db
  if (navigator.onLine) {
    checkingTheDatabase();
  }
};