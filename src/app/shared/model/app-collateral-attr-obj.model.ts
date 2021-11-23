export class AppCollateralAttrObj{
    AppCollateralAttrId: number;
    AppCollateralId: number;
    CollateralAttrCode: string;
    CollateralAttrName: string;
    AttrValue: string;
    RowVersion: string;
    constructor() { this.AppCollateralAttrId = 0, this.RowVersion = "" }
}

export class ReqAppCollateralAttrObj{
    AppCollateralAttrId: number;
    AppCollateralId: number;
    CollateralAttrCode: string;
    CollateralAttrName: string;
    AttrValue: string;
    RowVersion: string;
    constructor() { 
        this.AppCollateralId = 0;
        this.AppCollateralAttrId = 0;
        this.CollateralAttrCode = "";
        this.CollateralAttrName = "";
        this.AttrValue = "";
        this.RowVersion = "";
    }
}