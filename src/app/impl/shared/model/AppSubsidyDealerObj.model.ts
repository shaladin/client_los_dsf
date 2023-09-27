export class AppSubsidyDealerObj {
    ProdOfferingCode: string;
    SupplCode: string;
    OfficeCode: string;
    AssetHierarchyLv1Code: string;
    AssetHierarchyLv2Code: string;
    AssetHierarchyLv3Code: string;
    SubsidyAmount: number;
    IsLock: boolean;
  
    constructor() {
      this.ProdOfferingCode = "";
      this.SupplCode = "";
      this.OfficeCode = "";
      this.AssetHierarchyLv1Code = "";
      this.AssetHierarchyLv2Code = "";
      this.AssetHierarchyLv3Code = "";
      this.SubsidyAmount = 0;
      this.IsLock = false;
    }
  }