import { AppTCObj } from "./AppTCObj.Model";

export class ListAppTCObj{
    AppTcObj : AppTCObj;
    RowVersion: any;

    constructor() { 
        this.AppTcObj = new AppTCObj(); 
        this.RowVersion = ""; 
    }
}