export class AssetTypeObj {
    AssetTypeId: Number;
    AssetTypeCode: string;
    AssetTypeName: string;
    SerialNo1Label: string;
    SerialNo2Label: string;
    SerialNo3Label: string;
    SerialNo4Label: string;
    SerialNo5Label: string;
    IsMndtrySerialNo1: boolean;
    IsMndtrySerialNo2: boolean;
    IsMndtrySerialNo3: boolean;
    IsMndtrySerialNo4: boolean;
    IsMndtrySerialNo5: boolean;
    IsLoanObj: boolean;
    IsActive: boolean;
    MaxHierarchyLevel: number;
    HierarchyLabelLevel1: string;
    HierarchyLabelLevel2: string;
    HierarchyLabelLevel3: string;
    HierarchyLabelLevel4: string;
    HierarchyLabelLevel5: string;
    RowVersion: string;
    constructor() { this.AssetTypeId = 0, this.RowVersion = "" }
}

export class AssetMasterForFraudChecking {
    AssetTypeCode: string;
    AssetCategoryCode: string;

    RowVersion: string;
    constructor() { this.RowVersion = "" }
}