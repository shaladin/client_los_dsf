export class ResGeneralSettingObj {
    GeneralSettingId: number;

    GsCode: string;
    GsName: string;
    GsValue: any;
    GsDescr: string;
    RowVersion: string;

    IsUpdatable: boolean;
    ModuleCode: string;
    RoleCode: string;

    constructor() {
        this.GsCode = "";
        this.GsName = "";
        this.GsValue = "";
        this.GsDescr = "";
        this.RowVersion = "";
    }
}

export class ResListGeneralSettingObj {
    ResListGeneralSettingObj: Array<ResGeneralSettingObj>;

    constructor() {
        this.ResListGeneralSettingObj = new Array<ResGeneralSettingObj>();
    }
}