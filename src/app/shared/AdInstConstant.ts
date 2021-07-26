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
  public static LoginWithToken = environment.FoundationR3Url + '/v1' + "/Authenticate/LoginWithToken";
  public static Logout = environment.FoundationR3Url + "/v1" + "/UserManagement/LogOut"
  public static FormDefault = "dashboard/dash-board";
  public static LoginByRole = environment.FoundationR3Url + "/v1" + "/Authenticate/LoginByRole";
  public static LoginByToken = environment.FoundationR3Url + "/v1" + "/Authenticate/LoginByToken";
  public static UpdateToken = environment.FoundationR3Url + "/v1" + "/Authenticate/UpdateRole";
  public static GetThingsToDoByRole = environment.FoundationR3Url + "/v1" + "/ThingsToDo/GetThingsToDoByRole";

  // List Approver
  public static GetRecommendations = environment.ApprovalR3Url + "/api/RFAWeb/GetRecommendations/";

  public static ApvHoldTaskUrl = environment.FoundationR3Url + "/Approval/Hold";
  public static ApvTakeBackTaskUrl = environment.FoundationR3Url + "/Approval/TakeBack";
  
  public static UserCustomer = "Customer";
}
