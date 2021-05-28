export class AssetTypeObj {
    AssetTypeId: any;
    AssetTypeCode: any;
    AssetTypeName: any;
    SerialNo1Label: any;
    SerialNo2Label: any;
    SerialNo3Label: any;
    SerialNo4Label: any;
    SerialNo5Label: any;
    IsMndtrySerialNo1: any;
    IsMndtrySerialNo2: any;
    IsMndtrySerialNo3: any;
    IsMndtrySerialNo4: any;
    IsMndtrySerialNo5: any;
    IsLoanObj: any;
    IsActive: any;
    MaxHierarchyLevel: any;
    HierarchyLabelLevel1: any;
    HierarchyLabelLevel2: any;
    HierarchyLabelLevel3: any;
    HierarchyLabelLevel4: any;
    HierarchyLabelLevel5: any;
    RowVersion: any;
    constructor() { this.AssetTypeId = 0, this.RowVersion = "" }
}

export class AssetMasterForFraudChecking {
    AssetTypeCode: string;
    AssetCategoryCode: string;

    RowVersion: any;
    constructor() { this.RowVersion = "" }
}