import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { environment } from "environments/environment";
import { CommonConstant } from "./constant/CommonConstant";
declare const CryptoJS: any;

export class AdInsHelper {
  //Function
  public static InsertLog(url, type, param = "") {
    let today = new Date();
    var dateNow = formatDate(today, 'yyyy-MM-dd hh:mm:ss', 'en-US');

    var listPageAccess = [];
    listPageAccess = JSON.parse(localStorage.getItem(CommonConstant.PAGE_ACCESS));
    var userAcc = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
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

  public static ForceLogOut(timeLeft, toastr) {
    let interval = setInterval(() => {
      if (timeLeft > 0) {
        console.log("Time Left : " + timeLeft)
        toastr.errorMessage("Automatic Log out at : " + timeLeft);
        toastr.clearToast();
        timeLeft--;
      } else {
        this.ClearAllLog();
        window.location.reload();
      }
    }, 1000)
  }

  public static ClearAllLog() {
    // localStorage.removeItem("UserContext");
    // localStorage.removeItem("PageAccess");
    // localStorage.removeItem("RoleId");
    // localStorage.removeItem("Username");
    // localStorage.removeItem("BusinessDate");
    // localStorage.removeItem("UserAccess");
    // localStorage.removeItem("Token");
    // localStorage.removeItem("Menu");
    let version = localStorage.getItem(CommonConstant.VERSION);
    localStorage.clear();
    localStorage.setItem("Version", version);
  }

  public static ClearPageAccessLog() {
    localStorage.removeItem("PageAccess");
  }

  public static CheckSessionTimeout() {
    let today = new Date();
    var businessDtBefore = localStorage.getItem(CommonConstant.LAST_ACCESS_TIME);
    var businessDtNow = formatDate(today, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    if (businessDtBefore == undefined || businessDtBefore == null) {
      localStorage.setItem(CommonConstant.LAST_ACCESS_TIME, businessDtNow);
    }
    else {
      var bsDtBefore = new Date(businessDtBefore);
      var tempDate = today.getTime() - bsDtBefore.getTime();
      if (tempDate > AdInsConstant.TimeoutSession) {
        var data = { status: "001", reason: "Session Time Out" };
        AdInsHelper.ClearAllLog();
        return "1";
      }
      localStorage.setItem(CommonConstant.LAST_ACCESS_TIME, businessDtNow);
    }
    return "0";
  }

  public static OpenCustomerViewByCustId(CustId) {
    var token = localStorage.getItem("Token");
    window.open(environment.FoundationR3Web + "/View/Customer/PersonalDetail?CustId=" + CustId + "&Token=" + token, "_blank");
  }

  public static OpenAppViewByAppId(AppId) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + "/View/AppView?AppId=" + AppId + "&Token=" + token, "_blank");
  }
  public static OpenPhoneVerifViewByAppId(AppId, VerfResultHId, Name) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + "/Nap/CreditProcess/PhoneVerification/Subject/View?AppId=" + AppId + "&VerfResultHId=" + VerfResultHId + "&Name=" + Name + "&Token=" + token, "_blank");
  }

  public static OpenProdOfferingViewByCodeAndVersion(Code, Version) {
    var token = localStorage.getItem("Token");
    window.open(environment.FoundationR3Web + "/View/Offering?prodOfferingHId=0&prodOfferingCode=" + Code + "&prodOfferingVersion=" + Version + "&Token=" + token, "_blank");
  }

  public static OpenLeadViewByLeadId(LeadId) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + '/View/Lead?LeadId=' + LeadId + "&Token=" + token, "_blank");
  }

  public static OpenAgrmntViewByAgrmntId(AgrmntId) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + "/View/AgrmntView?AgrmntId=" + AgrmntId + "&Token=" + token, "_blank");
  }

  public static OpenMOUCustViewByMouCustId(MouCustId) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + "/View/Mou/CustView?MouCustId=" + MouCustId + "&Token=" + token, "_blank");
  }

  public static OpenProdOfferingViewByProdOfferingHId(ProdOfferingHId) {
    var token = localStorage.getItem("Token");
    window.open(environment.FoundationR3Web + "/View/Offering?prodOfferingHId=" + ProdOfferingHId + "&Token=" + token, '_blank');
  }

  public static OpenVendorBranchViewByVendorId(VendorId) {
    var token = localStorage.getItem("Token");
    window.open(environment.FoundationR3Web + "/View/Vendor/VendorBranch?VendorId=" + VendorId + "&Token=" + token, '_blank');
  }

  public static OpenSrvyTaskViewBySrvyTaskId(SrvyTaskId) {
    var token = localStorage.getItem("Token");
    window.open(environment.FoundationR3Web + "/View/Survey/SurveyTask?SrvyTaskId=" + SrvyTaskId + "&Token=" + token, '_blank');
  }

  public static OpenSrvyOrderViewBySrvyOrderId(SrvyOrderId) {
    var token = localStorage.getItem("Token");
    window.open(environment.FoundationR3Web + "/View/Survey/SurveyOrder?SrvyOrderId=" + SrvyOrderId + "&Token=" + token, '_blank');
  }

  public static OpenCustExposureViewByCrdRvwExposureHId(CrdRvwExposureHId: number) {
    var token = localStorage.getItem("Token");
    window.open(environment.losR3Web + "/View/CustExposureView?CrdRvwExposureHId=" + CrdRvwExposureHId + "&Token=" + token, '_blank');
  }

  public static CreateUserAccess(response) {
    // var currentUserContext = new CurrentUserContext;
    // currentUserContext.UserName = response["Identity"].UserName;
    // currentUserContext.Office = response["Identity"].OfficeCode;
    // currentUserContext.Role = response["Identity"].RoleCode;
    // currentUserContext.BusinessDate = response["Identity"].BusinessDt;
    localStorage.setItem("BusinessDateRaw", response["Identity"].BusinessDt);
    var DateParse = formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US');
    localStorage.setItem("BusinessDate", DateParse);
    localStorage.setItem("UserAccess", JSON.stringify(response["Identity"]));
    //localStorage.setItem("UserContext",JSON.stringify(currentUserContext));
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

  public static RedirectUrl(router: Router, url: Array<string>, queryParams: {}) {
    router.navigate(url, { queryParams: queryParams, skipLocationChange: false });
  }
}
