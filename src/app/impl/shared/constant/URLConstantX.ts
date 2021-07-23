import { environment } from "environments/environment";

export class URLConstantX {
  // X
  public static CalculateAdditionalInterestX = environment.losUrl+ "/v1" + "/AgrmntX/CalculateAdditionalInterest";
  public static SubmitDeliveryOrderDataX = environment.losUrl+ "/v1" + "/DeliveryOrderX/SubmitDeliveryOrderData";
  public static UpdateEffectiveAndAgrmntCreatedDtX = environment.losUrl+ "/v1" + "/AgrmntX/UpdateEffectiveAndAgrmntCreatedDt";
  public static AddCustCnfrmX = environment.losUrl+ "/v1" + "/CustCnfrmX/AddCustCnfrm";
}