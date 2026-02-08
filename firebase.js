// 🔐 Mock Authentication Implementation
(function() {
  const mockAuth = (function() {
    const getStoredUser = () => JSON.parse(localStorage.getItem('mockUser'));
    const setStoredUser = (user) => localStorage.setItem('mockUser', JSON.stringify(user));

    const listeners = [];
    let currentUser = getStoredUser();

    const notify = (user) => {
      listeners.forEach(cb => {
        try {
          cb(user);
        } catch (e) {
          console.error("Error in onAuthStateChanged callback:", e);
        }
      });
    };

    return {
      get currentUser() {
        return currentUser;
      },
      onAuthStateChanged: function(callback) {
        listeners.push(callback);
        setTimeout(() => callback(currentUser), 0);
        return () => {
          const index = listeners.indexOf(callback);
          if (index > -1) listeners.splice(index, 1);
        };
      },
      createUserWithEmailAndPassword: async function(email, password) {
        console.log("Mock creating user:", email);
        const user = {
          uid: 'mock-uid-' + Math.random().toString(36).substr(2, 9),
          email: email,
          emailVerified: true
        };
        currentUser = user;
        setStoredUser(user);
        notify(user);
        return { user };
      },
      signInWithEmailAndPassword: async function(email, password) {
        console.log("Mock signing in:", email);
        const user = {
          uid: 'mock-uid-123',
          email: email,
          emailVerified: true
        };
        currentUser = user;
        setStoredUser(user);
        notify(user);
        return { user };
      },
      signOut: async function() {
        console.log("Mock signing out");
        currentUser = null;
        localStorage.removeItem('mockUser');
        notify(null);
        return Promise.resolve();
      }
    };
  })();

  const setupMocks = () => {
    console.log("Setting up mocks...");
    const dbMock = {
      collection: function(colName) {
        return {
          doc: (docId) => ({
            get: () => {
              console.log(`Mock DB get: ${colName}/${docId}`);
              const data = localStorage.getItem(`mockDb_${colName}_${docId}`);
              return Promise.resolve({
                exists: !!data,
                data: () => data ? JSON.parse(data) : null,
                id: docId
              });
            },
            set: (data) => {
              console.log(`Mock DB set: ${colName}/${docId}`, data);
              localStorage.setItem(`mockDb_${colName}_${docId}`, JSON.stringify(data));
              return Promise.resolve();
            },
            update: (data) => {
              console.log(`Mock DB update: ${colName}/${docId}`, data);
              const oldData = JSON.parse(localStorage.getItem(`mockDb_${colName}_${docId}`) || "{}");
              localStorage.setItem(`mockDb_${colName}_${docId}`, JSON.stringify({ ...oldData, ...data }));
              return Promise.resolve();
            },
            delete: () => {
              console.log(`Mock DB delete: ${colName}/${docId}`);
              localStorage.removeItem(`mockDb_${colName}_${docId}`);
              return Promise.resolve();
            },
            onSnapshot: (cb) => {
              const data = localStorage.getItem(`mockDb_${colName}_${docId}`);
              cb({ exists: !!data, data: () => data ? JSON.parse(data) : null, id: docId });
              return () => {};
            },
            collection: function(subCol) { return dbMock.collection(`${colName}/${docId}/${subCol}`); }
          }),
          get: () => {
            console.log(`Mock DB query get: ${colName}`);
            const results = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key.startsWith(`mockDb_${colName}_`)) {
                const docId = key.replace(`mockDb_${colName}_`, "");
                results.push({ id: docId, data: () => JSON.parse(localStorage.getItem(key)) });
              }
            }
            return Promise.resolve({
              empty: results.length === 0,
              forEach: (cb) => results.forEach(cb),
              docs: results
            });
          },
          add: (data) => {
            const docId = 'mock-id-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(`mockDb_${colName}_${docId}`, JSON.stringify(data));
            return Promise.resolve({ id: docId });
          },
          orderBy: function() { return this; },
          limit: function() { return this; },
          onSnapshot: function(cb) { this.get().then(cb); return () => {}; },
          where: function() { return this; }
        };
      }
    };

    const storageMock = {
      ref: () => ({
        put: () => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve("https://via.placeholder.com/150") } }),
        child: function() { return this; },
        getDownloadURL: () => Promise.resolve("https://via.placeholder.com/150")
      })
    };

    window.auth = mockAuth;
    window.db = dbMock;
    window.storage = storageMock;

    if (typeof firebase !== 'undefined') {
      firebase.auth = () => mockAuth;
      if (!firebase.firestore) {
        firebase.firestore = { FieldValue: { serverTimestamp: () => new Date().toISOString() } };
      } else if (!firebase.firestore.FieldValue) {
        firebase.firestore.FieldValue = { serverTimestamp: () => new Date().toISOString() };
      }
    } else {
      window.firebase = {
        auth: () => mockAuth,
        firestore: { FieldValue: { serverTimestamp: () => new Date().toISOString() } }
      };
    }
  };

  if (typeof firebase !== 'undefined') {
    const originalInitializeApp = firebase.initializeApp;
    firebase.initializeApp = function(config) {
      console.log("Firebase Mock: initializeApp called");
      try { return originalInitializeApp.call(firebase, config); } catch (e) { return {}; }
    };
  }

  setupMocks();

  // Ensure global variables are set for scripts that don't use window. prefix
  window.auth = window.auth;
  window.db = window.db;
  window.storage = window.storage;
})();

// For scripts that expect global variables (outside of this IIFE)
var auth = window.auth;
var db = window.db;
var storage = window.storage;
