import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { environment } from "environments/environment";
import { CommonConstant } from "./constant/CommonConstant";
import { NavigationConstant } from "./constant/NavigationConstant";
import { CookieService } from "ngx-cookie";
import * as CryptoJS from 'crypto-js';
import { HttpClient } from "@angular/common/http";
import { URLConstant } from "./constant/URLConstant";

export class AdInsHelper {
  //Function
  public static InsertLog(cookieService: CookieService, url, type, param = "") {
    let today = new Date();
    var dateNow = formatDate(today, 'yyyy-MM-dd hh:mm:ss', 'en-US');

    var listPageAccess = [];
    listPageAccess = JSON.parse(localStorage.getItem(CommonConstant.PAGE_ACCESS));
    var userAccess = this.GetCookie(cookieService, CommonConstant.USER_ACCESS);
    var userAcc = userAccess ? JSON.parse(userAccess) : null;
    var pageAccess = listPageAccess;
    if (listPageAccess == null) {
      pageAccess = [];
    }
    else {
      pageAccess = listPageAccess;
    }
    if (userAcc != null) {
      var pageAccessNow = {
        CurrentUrl: url,
        UrlAccessTime: dateNow,
        Type: type,
        UserSessionLogId: userAcc.userSessionLogId
      }
    } else {
      var pageAccessNow = {
        CurrentUrl: url,
        UrlAccessTime: dateNow,
        Type: type,
        UserSessionLogId: null
      }
    }
    pageAccess.push(pageAccessNow);
    localStorage.setItem('PageAccess', JSON.stringify(pageAccess));
  }

  public static ForceLogOut(cookieService: CookieService, timeLeft, toastr, http: HttpClient) {
    let interval = setInterval(() => {
        if (timeLeft > 0) {
            console.log("Time Left : " + timeLeft)
            toastr.warningMessage("Automatic Log out at : " + timeLeft);
            timeLeft--;
        } else {
            this.ClearAllLogAndRemoveToken(cookieService, http);
            window.location.reload();
        }
    }, 1000)
}

public static ClearAllLog(cookieService: CookieService) {
    let version = localStorage.getItem(CommonConstant.VERSION);
    localStorage.clear();
    localStorage.setItem("Version", version);
    cookieService.removeAll();
}
public static OpenPefindoMultiResultView(TrxNo: string, MrCustTypeCode: string) {
  var url = environment.FoundationR3Web + "/View/Pefindo?GroupTrxNo=" + TrxNo + "&MrCustTypeCode=" + MrCustTypeCode;
  window.open(url, "_blank");
}
public static ClearAllLogAndRemoveToken(cookieService: CookieService, http: HttpClient) {
    var url = environment.FoundationR3Url + URLConstant.LogoutAuth;
    http.post(url, {}).subscribe();
    let version = localStorage.getItem(CommonConstant.VERSION);
    localStorage.clear();
    localStorage.setItem("Version", version);
    cookieService.removeAll();
}

  public static ClearPageAccessLog(cookieService: CookieService) {
    localStorage.removeItem("PageAccess");
    cookieService.remove("PageAccess");
  }

  public static CheckSessionTimeout(cookieService: CookieService) {
    let today = new Date();
    var businessDtBefore = this.GetCookie(cookieService, CommonConstant.LAST_ACCESS_TIME);
    var businessDtNow = formatDate(today, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    if (businessDtBefore == undefined || businessDtBefore == null) {
      this.SetCookie(cookieService, CommonConstant.LAST_ACCESS_TIME, businessDtNow);
    }
    else {
      var bsDtBefore = new Date(businessDtBefore);
      var tempDate = today.getTime() - bsDtBefore.getTime();
      if (tempDate > AdInsConstant.TimeoutSession) {
        var data = { status: "001", reason: "Session Time Out" };
        AdInsHelper.ClearAllLog(cookieService);
        return "1";
      }
      this.SetCookie(cookieService, CommonConstant.LAST_ACCESS_TIME, businessDtNow);
    }
    return "0";
  }

  public static OpenLtkmViewByLtkmCustId(LtkmCustId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + NavigationConstant.LTKM_VIEW + "?LtkmCustId=" + LtkmCustId + "&Token=" + token, "_blank");
  }

  public static OpenCustomerViewByCustId(CustId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.FoundationR3Web + NavigationConstant.VIEW_FOU_CUST_PERSONAL_DETAIL + "?CustId=" + CustId + "&Token=" + token, "_blank");
  }

  public static OpenCustomerCoyViewByCustId(CustId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.FoundationR3Web + NavigationConstant.VIEW_FOU_CUST_COY_DETAIL + "?CustId=" + CustId + "&Token=" + token, "_blank");
  }

  public static OpenAppViewByAppId(AppId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + NavigationConstant.VIEW_APP + "?AppId=" + AppId + "&Token=" + token, "_blank");
  }
  public static OpenPhoneVerifViewByAppId(AppId: number, VerfResultHId: number, Name: string) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + NavigationConstant.VIEW_PHN_VERIF + "?AppId=" + AppId + "&VerfResultHId=" + VerfResultHId + "&Name=" + Name + "&Token=" + token, "_blank");
  }

  public static OpenProdOfferingViewByCodeAndVersion(Code: string, Version: string) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + NavigationConstant.VIEW_OFFERING + "?prodOfferingHId=0&prodOfferingCode=" + Code + "&prodOfferingVersion=" + Version + "&Token=" + token, "_blank");
  }

  public static OpenLeadViewByLeadId(LeadId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + NavigationConstant.VIEW_LEAD + '?LeadId=' + LeadId + "&Token=" + token, "_blank");
  }

  public static OpenAgrmntViewByAgrmntId(AgrmntId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + NavigationConstant.VIEW_AGRMNT + "?AgrmntId=" + AgrmntId + "&Token=" + token, "_blank");
  }

  public static OpenMOUCustViewByMouCustId(MouCustId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + NavigationConstant.VIEW_MOU_CUST + "?MouCustId=" + MouCustId + "&Token=" + token, "_blank");
  }

  public static OpenProdOfferingViewByProdOfferingHId(ProdOfferingHId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + NavigationConstant.VIEW_OFFERING + "?prodOfferingHId=" + ProdOfferingHId + "&Token=" + token, '_blank');
  }

  public static OpenVendorBranchViewByVendorId(VendorId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.FoundationR3Web + NavigationConstant.VIEW_FOU_VENDOR_BRANCH + "?VendorId=" + VendorId + "&Token=" + token, '_blank');
  }

  public static OpenSrvyTaskViewBySrvyTaskId(SrvyTaskId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.FoundationR3Web + NavigationConstant.VIEW_FOU_SRVY_TASK + "?SrvyTaskId=" + SrvyTaskId + "&Token=" + token, '_blank');
  }

  public static OpenSrvyOrderViewBySrvyOrderId(SrvyOrderId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.FoundationR3Web + NavigationConstant.VIEW_FOU_SRVY_ORDER + "?SrvyOrderId=" + SrvyOrderId + "&Token=" + token, '_blank');
  }

  public static OpenCustExposureViewByCrdRvwExposureHId(CrdRvwExposureHId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + NavigationConstant.VIEW_CUST_EXPSR + "?CrdRvwExposureHId=" + CrdRvwExposureHId + "&Token=" + token, '_blank');
  }

  public static OpenPefindoView(CustNo: string, IsLos: boolean, Token: string = "") {
    if (Token != "")
    {
      window.open(environment.FoundationR3Web + "/View/Pefindo?CustNo=" + CustNo + "&IsLos=" + IsLos + "&Token=" + Token, '_blank');
      return;
    }

    window.open(environment.FoundationR3Web + "/View/Pefindo?CustNo=" + CustNo + "&IsLos=" + IsLos);
  }
  public static OpenPefindoViewX(TrxNo: string, MrCustTypeCode: string) {
    var url = environment.FoundationR3Web + "/View/Pefindo?TrxNo=" + TrxNo + "&MrCustTypeCode=" + MrCustTypeCode;
    window.open(url, "_blank");
}
  public static OpenPefindoViewV2(CustNo: string, IsLos: boolean, Token: string = "", IsCtpg: boolean, TrxNo: string, MrCustTypeCode: string) {
    if (Token != "")
    {
      if(IsCtpg)
      {
        window.open(environment.FoundationR3Web + "/View/Pefindo?GroupTrxNo=" + TrxNo + "&MrCustTypeCode=" + MrCustTypeCode + "&IsLos=" + IsLos + "&Token=" + Token, '_blank');
      }
      else
      {
        window.open(environment.FoundationR3Web + "/View/Pefindo?TrxNo=" + TrxNo + "&MrCustTypeCode=" + MrCustTypeCode + "&IsLos=" + IsLos + "&Token=" + Token, '_blank');
      }
      return;
    }

    if(IsCtpg)
    {
      window.open(environment.FoundationR3Web + "/View/Pefindo?GroupTrxNo=" + TrxNo + "&MrCustTypeCode=" + MrCustTypeCode + "&IsLos=" + IsLos);
    }
    else
    {
      window.open(environment.FoundationR3Web + "/View/Pefindo?TrxNo=" + TrxNo + "&MrCustTypeCode=" + MrCustTypeCode + "&IsLos=" + IsLos);
    }
  }

  public static CreateUserAccess(response) {
    // unused
  }

  public static OpenEditAppAfterApv(TrxHId, AgrmntId) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + NavigationConstant.NAP_ADD_PRCS_EDIT_APP_AFT_APV_VIEW + "?EditAppAftApvTrxHId=" + TrxHId + "&AgrmntId=" + AgrmntId + "&Token=" + token, "_blank");
  }

  public static IsGrantAccess(formPath) {
    var temp = localStorage.getItem("Menu");
    var objectMenu = [];
    objectMenu = JSON.parse(temp);
    if (objectMenu != null) {
      var exsisting = objectMenu['find'](x => x.path == formPath);
      if (exsisting == undefined) {
        return false;
      } else {
        return true;
      }
    }
  }

  public static transformAmount(element: any) {
    var formattedAmount = "";
    if (element.target.value != "") {

      if (parseFloat(element.target.value).toLocaleString('en') != "NaN") {
        formattedAmount = parseFloat(element.target.value).toLocaleString('en');
      }
      else {
        formattedAmount = "";
      }
    }
    return formattedAmount;
  }

  public static transformToDecimal(element: any) {
    var parsedValue = 0;
    if (element.target.value != "") {
      if (parseFloat(element.target.value.toString().replace(/,/g, '')).toString() != "NaN") {
        parsedValue = parseFloat(element.target.value.toString().replace(/,/g, ''));
      } else {
        return "";
      }
    }
    return parsedValue;
  }

  public static Encrypt128CBC(plain: string, k: string, i: string) {
    var key = CryptoJS.enc.Utf8.parse(k);
    var iv = CryptoJS.enc.Utf8.parse(i);

    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plain), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted
  }

  public static RedirectUrl(router: Router, url: Array<string>, queryParams: {} = {}, isSkipLocation: boolean = false) {
    // Ngebuat bisa jalanin Constructor dan NgOnInit lagi
    const prev = router.routeReuseStrategy.shouldReuseRoute;
    if (Object.keys(queryParams).length === 0 
        && queryParams.constructor === Object) {
        router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
        }
    }
    // router.navigateByUrl(
    //   router.createUrlTree(
    //     [url.toString()], { queryParams: queryParams }
    //   ), { skipLocationChange: isSkipLocation }
    // );
    router.navigate(url, { queryParams: queryParams, skipLocationChange: isSkipLocation });
    setTimeout(() => {
        router.routeReuseStrategy.shouldReuseRoute = prev;
    }, 1);
}

  public static SetLocalStorage(key: string, value: string) {
    return localStorage.setItem(key, this.EncryptString(value, environment.ChipperKeyLocalStorage));
  }

  public static GetLocalStorage(key: string) {
    return this.DecryptString(localStorage.getItem(key), environment.ChipperKeyLocalStorage);
  }

  public static SetCookie(cookieService: CookieService, key: string, value: string) {
    cookieService.put(key, this.EncryptString(value, environment.ChipperKeyCookie));
  }

  public static GetCookie(cookieService: CookieService, key: string) {
    var value = cookieService.get(key);
    if (value == undefined || value.trim() == '') return null;
    return this.DecryptString(value, environment.ChipperKeyCookie);
  }

  private static EncryptString(plaintext: string, chipperKey: string = "") {
    if (chipperKey == undefined || chipperKey.trim() == '') return plaintext;
    var chipperKeyArr = CryptoJS.enc.Utf8.parse(chipperKey);
    var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
    var encrypted = CryptoJS.AES.encrypt(plaintext, chipperKeyArr, { iv: iv });
    var result = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    return result;
  }

  private static DecryptString(chipperText: string, chipperKey: string) {
    if (
      chipperKey == undefined || chipperKey.trim() == '' ||
      chipperText == undefined || chipperText.trim() == ''
    ) return chipperText;
    var chipperKeyArr = CryptoJS.enc.Utf8.parse(chipperKey);
    var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
    var decrypted = CryptoJS.AES.decrypt(chipperText, chipperKeyArr, { iv: iv });
    var plainText = decrypted.toString(CryptoJS.enc.Utf8);
    return plainText;
  }

  public static RedirectUnauthorized(router: Router) {
    this.RedirectUrl(router, [NavigationConstant.UNAUTHORIZE_PAGE], {});
  }
}
