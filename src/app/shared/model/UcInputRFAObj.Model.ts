import { environment } from "environments/environment";
import { CookieService } from "ngx-cookie";
import { AdInsHelper } from "../AdInsHelper";
import { CommonConstant } from "../constant/CommonConstant";
import { URLConstant } from "../constant/URLConstant";

export class UcInputRFAObj {
    ApvTypecodes: any;
    EnvUrl: string;
    PathUrlGetSchemeBySchemeCode: string;
    PathUrlGetCategoryByCategoryCode: string;
    PathUrlGetAdtQuestion: string;
    PathUrlGetPossibleMemberAndAttributeExType: string;
    PathUrlGetApprovalReturnHistory: string;
    PathUrlCreateNewRFA: string;
    PathUrlCreateJumpRFA: string;
    CategoryCode: string;
    SchemeCode: string;
    TrxNo: string;
    Reason: any;
    OfficeCode: string;
    RequestedBy: string;

    constructor(private cookieService: CookieService) {
        let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        this.RequestedBy = context[CommonConstant.USER_NAME];
        this.OfficeCode = context[CommonConstant.OFFICE_CODE];
        this.ApvTypecodes = [];
        this.EnvUrl = environment.FoundationR3Url;
        this.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
        this.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
        this.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
        this.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
        this.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
        this.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
        this.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
        this.CategoryCode = "";
        this.SchemeCode = "";
        this.TrxNo = "";
        this.Reason = [];
    }
}