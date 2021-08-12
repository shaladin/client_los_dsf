import { Observable, ReplaySubject } from "rxjs";

/**
 * Storage service
 * used for persist application data in observable key value pair
 */
export class StorageService {
    private subjects: Map<string, ReplaySubject<any>>;
    private watched = {};

    /**
     * Constructor with service injection
     */
    constructor() {
        this.subjects = new Map<string, ReplaySubject<any>>();
    }

    /**
     * watch data of given key
     * @param key
     * @param defaultValue
     */
    watch(key: string): Observable<any> {
        if (!this.subjects.has(key)) {
            this.subjects.set(key, new ReplaySubject<any>(1));
        }
        let item = localStorage.getItem(key);
        if (item === undefined) {
            item = undefined;
        } else if (item === null) {
            item = null;
        } else {
            if (!this.watched[key]) {
                // item = JSON.parse(item);
                this.subjects.get(key).next(item);
                this.watched[key] = true;
            }
        }
        return this.subjects.get(key).asObservable();
    }

    /**
     * get data of given key
     * @param key
     */
    get(key: string): any {
        let item = localStorage.getItem(key);
        if (item === undefined) {
            item = undefined;
        } else if (item === null) {
            item = null;
        } else {
            // item = JSON.parse(item);
        }
        return item;
    }

    /**
     * set value on given key
     * @param key
     * @param value
     */
    set(key: string, value: any) {
        localStorage.setItem(key, value);
        if (!this.subjects.has(key)) {
            this.subjects.set(key, new ReplaySubject<any>(1));
        }
        if (!this.watched[key]) {
            this.watched[key] = true;
        }
        this.subjects.get(key).next(value);
    }

    /**
     * remove given key
     * @param key
     */
    remove(key: string) {
        if (this.subjects.has(key)) {
            this.subjects.get(key).next(null);
            // this.subjects.get(key).complete();
            // this.subjects.delete(key);
        }
        localStorage.removeItem(key);
    }

    /**
     * clear all available keys
     */
    clear() {
        this.subjects.forEach(subj => {
            subj.next(null);
        });
        localStorage.clear();
    }
}