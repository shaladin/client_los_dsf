import { HttpHeaders } from "@angular/common/http";
import { environment } from "environments/environment";

export class AdInsConstant {

  public static RestrictionLike = "Like";
  public static RestrictionEq = "Eq";
  public static RestrictionNeq = "Neq";
  public static RestrictionIn = "IN";
  public static RestrictionNotIn = "NotIn";
  public static RestrictionIsNull = "isnull";
  public static RestrictionIsNotNull = "isnotnull";
  public static RestrictionOr = "Or"; //pastikan ada 1 criteria sebelumnya
  public static RestrictionOrNeq = "OrNeq"; //pastikan ada 1 criteria sebelumnya
  public static JoinTypeInner = "INNER";
  public static JoinTypeLeft = "LEFT";

  public static showData = "10,50,100";
  public static TimeoutSession = 6000000;
  public static Login = environment.FoundationR3Url + '/v1' + "/Authenticate/Login";
  public static LoginV2 = environment.FoundationR3Url + '/v2' + "/Authenticate/Login";
  public static LoginWithToken = environment.FoundationR3Url + '/v1' + "/Authenticate/LoginWithToken";
  public static Logout = environment.FoundationR3Url + "/v1" + "/UserManagement/LogOut"
  public static FormDefault = "dashboard/dash-board";
  public static LoginByRole = environment.FoundationR3Url + "/v1" + "/Authenticate/LoginByRole";
  public static LoginByRoleV2 = environment.FoundationR3Url + "/v2" + "/Authenticate/LoginByRole";
  public static LoginByToken = environment.FoundationR3Url + "/v1" + "/Authenticate/LoginByToken";
  public static LoginByTokenV2 = environment.FoundationR3Url + "/v2" + "/Authenticate/LoginByToken";
  public static UpdateToken = environment.FoundationR3Url + "/v1" + "/Authenticate/UpdateRole";
  public static UpdateTokenV2 = environment.FoundationR3Url + "/v2" + "/Authenticate/UpdateRole";
  public static UpdateTokenV2_1 = environment.FoundationR3Url + "/v2.1" + "/Authenticate/UpdateRole";
  public static GetAllActiveRefFormByRoleCodeAndModuleCode = environment.FoundationR3Url + "/v1" + "/RefForm/GetAllActiveRefFormByRoleCodeAndModuleCode";
  public static GetThingsToDoByRole = environment.FoundationR3Url + "/v1" + "/ThingsToDo/GetThingsToDoByRole";
  public static GetThingsToDoByRoleV2 = environment.FoundationR3Url + "/v2" + "/ThingsToDo/GetThingsToDoByRole";
  public static GetThingsToDoCamunda = environment.FoundationR3Url + "/v2" + "/ThingsToDo/GetThingsToDoCamunda";
  public static GetListApvTaskListByUsernameAndRoleCodeForThingsToDo = environment.ApprovalR3Url + "/Generic/GetListApvTaskListByUsernameAndRoleCodeForThingsToDo";
  public static GetListJobTitleByUsernameAndModule = environment.FoundationR3Url + "/v1" + "/Authenticate/GetListJobTitleByUsernameAndModule";
  public static GetListJobTitleByUsernameAndModuleV2 = environment.FoundationR3Url + "/v2" + "/Authenticate/GetListJobTitleByUsernameAndModule";
  public static CheckUserSessionLog = environment.FoundationR3Url + "/v1" + "/Authenticate/CheckUserSessionLog";

  // List Approver
  public static GetRecommendations = environment.ApprovalR3Url + "/api/RFAWeb/GetRecommendations/";

  public static ApvHoldTaskUrl = environment.FoundationR3Url + "/v1" + "/Approval/Hold";
  public static ApvTakeBackTaskUrl = environment.FoundationR3Url + "/v1" + "/Approval/TakeBack";
  public static CheckListAppInsMainCvgByAppId = environment.losUrl + "/v2" + "/AppIns/CheckListAppInsMainCvgByAppId";
  public static ApvClaimTask = environment.FoundationR3Url + "/v1" + "/Approval/ClaimTask";
  public static ApvUnclaimTaskUrl = environment.FoundationR3Url + "/v1" + "/Approval/UnClaim";
  
  public static UserCustomer = "Customer";
  public static TextTrue = "True";
  public static TextFalse = "False";

  // Storage Watch Key
  public static WatchRoleState = "RoleState";
  public static WatchRoleLang = "lang";
  
  private static SpinnerHeaders = new HttpHeaders({
    'IsLoading': "true"});
  public static SpinnerOptions = {headers: AdInsConstant.SpinnerHeaders};
}
