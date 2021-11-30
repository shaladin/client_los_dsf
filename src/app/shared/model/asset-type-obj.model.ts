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
    TotalSerialNoLabel: number;
    RowVersion: string;
    constructor() { 
        this.AssetTypeId = 0;
        this.AssetTypeCode = "";
        this.AssetTypeName = "";
        this.SerialNo1Label = "";
        this.SerialNo2Label = "";
        this.SerialNo3Label = "";
        this.SerialNo4Label = "";
        this.SerialNo5Label = "";
        this.IsMndtrySerialNo1 = false;
        this.IsMndtrySerialNo2 = false;
        this.IsMndtrySerialNo3 = false;
        this.IsMndtrySerialNo4 = false;
        this.IsMndtrySerialNo5 = false;
        this.IsLoanObj = false;
        this.IsActive = false;
        this.MaxHierarchyLevel = 0;
        this.HierarchyLabelLevel1 = "";
        this.HierarchyLabelLevel2 = "";
        this.HierarchyLabelLevel3 = "";
        this.HierarchyLabelLevel4 = "";
        this.HierarchyLabelLevel5 = "";
        this.TotalSerialNoLabel = 0;
        this.RowVersion = "";
    }
}

export class AssetMasterForFraudChecking {
    AssetTypeCode: string;
    AssetCategoryCode: string;

    RowVersion: string;
    constructor() { this.RowVersion = "" }
}