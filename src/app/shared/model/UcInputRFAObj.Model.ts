export class UcInputRFAObj {
    ApvTypecodes: any;
    EnvUrl: string;
    PathUrlGetSchemeBySchemeCode: string;
    PathUrlGetCategoryByCategoryCode : string;
    PathUrlGetAdtQuestion: string;
    PathUrlGetPossibleMemberAndAttributeExType : string;
    PathUrlGetApprovalReturnHistory : string;
    PathUrlCreateNewRFA : string;
    PathUrlCreateJumpRFA : string;
    CategoryCode : string;
    SchemeCode : string;
    TrxNo : string;
    Reason : any;
    constructor() { 
        this.ApvTypecodes = [];
        this.EnvUrl = "";
        this.PathUrlGetSchemeBySchemeCode = "";
        this.PathUrlGetCategoryByCategoryCode = "";
        this.PathUrlGetAdtQuestion = "";
        this.PathUrlGetPossibleMemberAndAttributeExType = "";
        this.PathUrlGetApprovalReturnHistory = "";
        this.PathUrlCreateNewRFA = "";
        this.PathUrlCreateJumpRFA = "";
        this.CategoryCode = "";
        this.SchemeCode = "";
        this.TrxNo = "";
        this.Reason =[];
    }
}  