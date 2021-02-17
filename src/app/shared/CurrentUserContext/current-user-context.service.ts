import { Injectable } from '@angular/core';
import { NgxIndexedDB } from 'ngx-indexed-db';

const indexedDbName = "CurrentUserContext";
const ObjectStoreName = "User";
const location = "UserContext";

@Injectable({
  providedIn: 'root'
})

export class CurrentUserContextService {
  db : NgxIndexedDB;
  constructor() { 
    this.db = new NgxIndexedDB(indexedDbName,1)
    this.db.openDatabase(1, (evt) => { 
      let objectStore = evt.currentTarget.result.createObjectStore(ObjectStoreName,{keyPath: "id", autoIncrement: true});
      
      objectStore.createIndex("code","code",{unique : false});
      objectStore.createIndex("description", "description", {unique: false});
    })
  }

  // getCurrentUserContext(): Object {
  //   let values : string; 
  //   values = localStorage.getItem(location) || "";
  //   return values;
  // }

  // clear(): void {
  //   localStorage.removeItem(location);
  //   this.db.clear(ObjectStoreName);
  // }
}
