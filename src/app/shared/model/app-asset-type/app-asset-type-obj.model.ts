export class ResAssetTypeObj {
    resAssetTypeObjs: Array<AssetTypeObj>;

    constructor() {
        this.resAssetTypeObjs = new Array<AssetTypeObj>();
    }
}

export class AssetTypeObj{
    AssetTypeId: number;
    AssetTypeCode: string;
    AssetTypeName: string;
    MaxHierarchyLevel: number;
    HierarchyLabelLevel1: string;
    HierarchyLabelLevel2: string;
    HierarchyLabelLevel3: string;
    HierarchyLabelLevel4: string;
    HierarchyLabelLevel5: string;
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
    TotalSerialNoLabel: number;
    RowVersion: string;
}