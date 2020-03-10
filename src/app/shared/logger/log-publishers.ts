import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { LogEntry } from './log.service';
import { NgxIndexedDB } from 'ngx-indexed-db';
// ****************************************************
// Log Publisher Abstract Class
// NOTE: This class must be located BEFORE
//       all those that extend this class
// ****************************************************
export abstract class LogPublisher {
  db : NgxIndexedDB;
  abstract log(record: LogEntry): Observable<boolean>
  abstract clear(): Observable<boolean>;
}
const storeName = "log";
// ****************************************************
// Console Logging Class
// ****************************************************
export class LogConsole extends LogPublisher {
  log(entry: LogEntry): Observable<boolean> {
    // Log to console
    console.log(entry.buildLogString());

    return of(true);
  }

  clear(): Observable<boolean> {
    console.clear();

    return of(true);
  }
}

// ****************************************************
// Local Storage Logging Class
// ****************************************************
export class LogLocalStorage extends LogPublisher {
  constructor() {
    // Must call super() from derived classes
    super();

    this.db = new NgxIndexedDB("dbLog",1)
    this.db.openDatabase(1, (evt) => { 
      let objectStore = evt.currentTarget.result.createObjectStore('log',{keyPath: "id", autoIncrement: true});
      
      objectStore.createIndex("time","time",{unique : false});
      objectStore.createIndex("message", "message", {unique: false});
    });
    
  }

  // Append log entry to local storage
  log(entry: LogEntry): Observable<boolean> {
    let ret: boolean = false;
    let values: LogEntry[];

    try {
      // Retrieve previous values from local storage
      this.db.add('log', { time: entry.entryDate, message: entry.message }).then(() => {
        console.log("Added log to indexxed DB");
        this.db.getAll('log').then((logs) => {
          console.log(logs[0].message);
        }, (error) => {
          console.log(error);
        });
      }, (error) => {
          console.log(error);
        }
      )
      // Set return value
      ret = true;
    } catch (ex) {
      // Display error in console
      console.log(ex);
    }

    return of(ret);
  }

  // Clear all log entries from local storage
  clear(): Observable<boolean> {
    this.db.clear(storeName);
    return of(true);
  }
}