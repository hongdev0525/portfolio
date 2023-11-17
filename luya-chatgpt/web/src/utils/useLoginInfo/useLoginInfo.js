"use client";
import { useState, useEffect } from 'react';

function useLoginInfo() {

  const openDatabase = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MyDatabase", 1);

      request.onerror = () => reject("Error opening database");
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("login", { keyPath: "key" });
      };
    });
  };

  const saveLoginInfo = async (value, expireTime) => {
    const db = await openDatabase();
    const expirationDate = new Date().getTime() + expireTime;
    const transaction = db.transaction(["login"], "readwrite");
    const store = transaction.objectStore("login");
    store.put({ key: "loggedIn", value, expirationDate });
  };

  const fetchLoginInfo = async () => {
    const db = await openDatabase();
    const transaction = db.transaction(["login"], "readonly");
    const store = transaction.objectStore("login");
    return new Promise((resolve, reject) => {
      const request = store.get("loggedIn");
      request.onsuccess = () => {
        const result = request.result;
        if (result && new Date().getTime() < result.expirationDate) {
          resolve(result.value);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject("Error getting login info");
    }).then((info) => {
      return info
    });
  };


  return {
    saveLoginInfo,
    fetchLoginInfo
  }
}


export default useLoginInfo;