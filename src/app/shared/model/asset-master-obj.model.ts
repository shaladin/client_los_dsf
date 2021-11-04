export class AssetMasterObj {
    AssetMasterId: number;
    AssetCategoryId: number;
    AssetTypeId: any;
    AssetCode: string;
    AssetName: string;
    HierarchyLvl: number;
    FullAssetCode: string;
    FullAssetName: string;
    ParentId: number;
    IsFinal: boolean;
    IsActive: boolean;
    RowVersion: string;
    constructor() { this.AssetMasterId = 0, this.RowVersion = "" }
  }
  