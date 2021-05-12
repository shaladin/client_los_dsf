export class ResSysConfigResultObj {
    SysConfigResultId : number;
    ConfigCode : string;
    ConfigDesc : string;
    ConfigValue : string;
    RowVersion: string;
    constructor(){
        this.SysConfigResultId = 0;
        this.ConfigCode = "";
        this.ConfigDesc = "";
        this.ConfigValue = "";
        this.RowVersion = "";
    }
}  