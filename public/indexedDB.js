let db;

//Connection to db
const request = indexedDB.open("Pro-budget", 1);

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
request.onerror = function (e) {
    console.log("Something went wrong", +e.target.errorCode);
  };
  
  function saveRecord(record) {
    const transaction = db.transaction(["waiting_new_transaction"], "readwrite");
    const store = transaction.objectStore("waiting_new_transaction");
    store.add(record);
  }
  
  function checkingTheDatabase() {
    const transaction = db.transaction(["waiting_new_transaction"], "readwrite");
    const store = transaction.objectStore("waiting_new_transaction");
    const getAll = store.getAll();
  
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then(() => {
            const transaction = db.transaction(
              ["waiting_new_transaction"],
              "readwrite"
            );
            const store = transaction.objectStore("waiting_new_transaction");
            store.clear();
          });
      }
    };
  }

  