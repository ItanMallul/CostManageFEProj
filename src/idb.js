const DB_NAME = 'expensesDB';
const STORE_NAME = 'expenses';

export const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, 7);

        request.onerror = () => {
            reject('Error opening database');
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            } else {
                // If the store already exists and you need to update its schema,
                // you might need to delete and recreate it, which should be done with caution
                console.log(`${STORE_NAME} store already exists.`);
            }
        };
    });
};

export const getExpenses = async () => {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onerror = () => {
                reject('Error fetching expenses');
            };

            request.onsuccess = () => {
                resolve(request.result);
            };
        }).catch((error) => {
            reject(error);
        });
    });
};

export const setExpenses = async (expenses) => {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // Clear existing data
            store.clear();

            // Add new expenses
            expenses.forEach((expense) => {
                console.log(expense);
                store.add(expense);
            });

            transaction.oncomplete = () => {
                console.log("Transaction completed successfully.");
                resolve(`Expense added successfully with ID:`);
            };

            transaction.onerror = (event) => {
                console.error("Transaction failed:", transaction.error);
                reject('Transaction failed');
            };
        }).catch((error) => {
            reject(error);
        });
    });
};

export const addExpense = async (expense) => {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(expense);

            request.onerror = () => {
                reject('Error adding expense');
            };

            request.onsuccess = () => {
                resolve(`Expense added successfully with ID: ${request.result}`);
            };
        }).catch((error) => {
            reject(error);
        });
    });
};

export const deleteExpense = async (id) => {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onerror = () => {
                reject('Error deleting expense');
            };

            request.onsuccess = () => {
                resolve();
            };
        }).catch((error) => {
            reject(error);
        });
    });
};

export const editExpense = async (id, updatedExpense) => {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onerror = () => {
                reject('Error editing expense');
            };

            request.onsuccess = () => {
                const expense = request.result;
                Object.assign(expense, updatedExpense);
                const updateRequest = store.put(expense);

                updateRequest.onerror = () => {
                    reject('Error updating expense');
                };

                updateRequest.onsuccess = () => {
                    resolve();
                };
            };
        }).catch((error) => {
            reject(error);
        });
    });
};
