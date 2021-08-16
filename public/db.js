let db;
// create a new db request for a "BudgetDB" database.
const request = window.indexedDB.open("BudgetDB", 1);
request.onupgradeneeded = function (event) {
  // create object store called "BudgetStore" and set autoIncrement to true
  const db = event.target.result;
        // Creates an object store with a listID keypath that can be used to query on.
        const BudgetStore = db.createObjectStore("BudgetStore", {
          autoIncrement: true,
        });
        // Creates a statusIndex that we can query on.
        // BudgetStore.createIndex("statusIndex", "status");
};
request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};
request.onerror = function (event) {
  // log error here
  console.log("There has been an error with retrieving your data: ");
};
function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  // access your pending object store
  // add record to your store with add method.
  const db = request.result;
  const transaction = db.transaction(["BudgetStore"], "readwrite");
  const BudgetStore = transaction.objectStore("BudgetStore");
  BudgetStore.add(record);
}
function checkDatabase() {
  // open a transaction on your pending db
  // access your pending object store
  // get all records from store and set to a variable
  let transaction = db.transaction(["BudgetStore"], "readwrite");
  let BudgetStore = transaction.objectStore("BudgetStore");
  const getAll = BudgetStore.getAll();
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) =>
        console.log(response.json())
      )
        .then(() => {
          // if successful, open a transaction on your pending db
          // access your pending object store
          // clear all items in your store
        transaction = db.transaction(["BudgetStore"], "readwrite");
        BudgetStore = transaction.objectStore("BudgetStore");
        BudgetStore.clear();
        });
    }
  };
}
// listen for app coming back online
window.addEventListener('online', checkDatabase);
