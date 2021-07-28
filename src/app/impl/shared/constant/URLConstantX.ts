import { environment } from "environments/environment";

export class URLConstantX {
  // X
  public static CalculateAdditionalInterestX = environment.losUrl+ "/v1" + "/AgrmntX/CalculateAdditionalInterest";
  public static SubmitDeliveryOrderDataX = environment.losUrl+ "/v1" + "/DeliveryOrderX/SubmitDeliveryOrderData";
  public static UpdateEffectiveAndAgrmntCreatedDtX = environment.losUrl+ "/v1" + "/AgrmntX/UpdateEffectiveAndAgrmntCreatedDt";
  public static AddCustCnfrmX = environment.losUrl+ "/v1" + "/CustCnfrmX/AddCustCnfrm";
  public static EditAppAddAppCrossX = environment.losUrl+ "/v1" + "/AppX/EditAppAddAppCross";
  public static GetAppXByAppId = environment.losUrl+ "/v1" + "/AppX/GetAppXByAppId";

  // Upload
  public static UploadFile = environment.FoundationR3Url + "/v1" + "/UploadX/UploadFile";
}