import { formatDate } from "@angular/common";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { CurrentUserContext } from "./model/CurrentUserContext.model";
import { environment } from "environments/environment";

export class AdInsHelper {
    //Function
    public static InsertLog(url, type, param = "") {
        let today = new Date();
        var dateNow = formatDate(today, 'yyyy-MM-dd hh:mm:ss', 'en-US');

        var listPageAccess = [];
        listPageAccess = JSON.parse(localStorage.getItem("PageAccess"));
        var userAcc = JSON.parse(localStorage.getItem("UserAccess"));
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

    public static ForceLogOut(timeLeft,toastr) {
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
        let version = localStorage.getItem("Version");
        localStorage.clear();
        localStorage.setItem("Version",version);
    }

    public static ClearPageAccessLog() {
        localStorage.removeItem("PageAccess");
    }

    public static CheckSessionTimeout() {
        let today = new Date();
        var businessDtBefore = localStorage.getItem("LastAccessTime");
        var businessDtNow = formatDate(today, 'yyyy-MM-dd HH:mm:ss', 'en-US');
        if (businessDtBefore == undefined || businessDtBefore == null) {
            localStorage.setItem("LastAccessTime", businessDtNow);
        }
        else {
            var bsDtBefore = new Date(businessDtBefore);
            var tempDate = today.getTime() - bsDtBefore.getTime();
            if (tempDate > AdInsConstant.TimeoutSession) {
                var data = { status: "001", reason: "Session Time Out" };
                AdInsHelper.ClearAllLog();
                return "1";
            }
            localStorage.setItem("LastAccessTime", businessDtNow);
        }
        return "0";

    }

    public static OpenAppViewByAppId(TrxNo)
    {
        window.open(environment.losR3Web + "/Nap/View/AppView?AppId=" + TrxNo, "_blank");
    }

    public static OpenLeadViewByLeadId(LeadId)
    {
        window.open(environment.losR3Web + '/Lead/View?LeadId=' + LeadId, "_blank");
    }

    public static CreateUserAccess(response)
    {
        // var currentUserContext = new CurrentUserContext;
        // currentUserContext.UserName = response["Identity"].UserName;
        // currentUserContext.Office = response["Identity"].OfficeCode;
        // currentUserContext.Role = response["Identity"].RoleCode;
        // currentUserContext.BusinessDate = response["Identity"].BusinessDt;
        localStorage.setItem("BusinessDateRaw",response["Identity"].BusinessDt);
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
}
