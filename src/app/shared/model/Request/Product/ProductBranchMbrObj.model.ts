export class ProductBrancMbrObj {
    ProdBranchMbrId: number;
    RefOfficeId: number;
    OfficeCode: string;
    OfficeName: string;
    AreaName: string;
    IsAllowedCrt: boolean; 
    RowVersion: string[];
  
  constructor() { this.RowVersion = [] }
  }  
  