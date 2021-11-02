import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { CookieService } from "ngx-cookie";
import { AdInsHelper } from "../AdInsHelper";
import { CommonConstant } from "../constant/CommonConstant";
import { NavigationConstant } from "../constant/NavigationConstant";


@Injectable()

export class AdInsHelperService {
  constructor(private cookieService: CookieService){ }

  public OpenCustomerViewByCustId(CustId: number) {
    let token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
    window.open(environment.FoundationR3Web + NavigationConstant.VIEW_FOU_CUST_PERSONAL_DETAIL + "?CustId=" + CustId + "&Token=" + token, "_blank");
  }

  public OpenCustomerCoyViewByCustId(CustId: number){
    let token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
    window.open(environment.FoundationR3Web + NavigationConstant.VIEW_FOU_CUST_COY_DETAIL + "?CustId=" + CustId + "&Token=" + token, "_blank");
  } 
}