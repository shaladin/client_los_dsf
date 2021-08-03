import {environment} from 'environments/environment';

export class URLConstantX {
  // X
  public static CalculateAdditionalInterestX = environment.losUrl + '/v1' + '/AgrmntX/CalculateAdditionalInterest';
  public static SubmitDeliveryOrderDataX = environment.losUrl + '/v1' + '/DeliveryOrderX/SubmitDeliveryOrderData';
  public static UpdateEffectiveAndAgrmntCreatedDtX = environment.losUrl + '/v1' + '/AgrmntX/UpdateEffectiveAndAgrmntCreatedDt';
  public static AddCustCnfrmX = environment.losUrl + '/v1' + '/CustCnfrmX/AddCustCnfrm';
  public static EditAppAddAppCrossX = environment.losUrl + '/v1' + '/AppX/EditAppAddAppCross';
  public static GetAppXByAppId = environment.losUrl + '/v1' + '/AppX/GetAppXByAppId';
  public static AddPreGoLiveX = environment.losUrl+ "/v1" + "/PreGoLiveX/AddPreGoLive";
  public static EndDateGoLiveApprovalX = environment.losUrl+ "/v1" + "/ApprovalX/EndDateGoLiveApproval";
  public static GoLiveApprovalX = environment.losUrl+ "/v1" + "/ApprovalX/GoLiveApproval";

  // Upload
  public static UploadFile = environment.FoundationR3Url + '/v1' + '/UploadX/UploadFile';

  // MOU CUST X
  public static AddMouCustX = environment.losUrl + '/v1' + '/MouCustX/AddMouCust';

  // MOU CUST FCTR X
  public static GetMouCustFctrXByMouCustNoX = environment.losUrl + '/v1' + "/MouCustFctrX/GetMouCustFctrXByMouCustNo";

  //MOU CUST X
  public static GetMouCustByAppIdX = environment.losUrl +'/v1' +  "/MouCustX/GetMouCustByAppId";

  // MOU CUST COLLATERAL X
  public static GetMouCustCollateralStatXByMouCustCollateralIdX = environment.losUrl + '/v1' + '/MouCustCollateralX/GetMouCustCollateralStatXByMouCustCollateralId';
  public static AddExistingCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/AddExistingCustCollateralData';
  public static AddMouCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/AddMouCustCollateralData';
  public static EditMouCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/EditMouCustCollateralData';
  public static DeleteMouCustCollateralX = environment.losUrl + '/v1' + '/MouCustCollateralX/DeleteMouCustCollateral';

  //CHANGE MOU CUST COLLATERAL X
  public static GetChangeMouCustCollateralStatByChangeMouCustCollateralIdX = environment.losUrl + "/v1" + "/ChangeMouCustCollateral/GetChangeMouCustCollateralStatByChangeMouCustCollateralId";
  public static AddEditChangeMouCustCollateralDataX = environment.losUrl + '/v1' + "/ChangeMouCustCollateralX/AddEditChangeMouCustCollateralData";
  public static AddExistingChangeMouCustCollateralDataX = environment.losUrl + '/v1' + "/ChangeMouCustCollateralX/AddExistingChangeMouCustCollateralData";
  public static DeleteChangeMouCustCollateralX = environment.losUrl + '/v1' + "/ChangeMouCustCollateralX/DeleteChangeMouCustCollateral";

  //APP X
  public static SubmitNAPX = environment.losUrl + '/v1' + "/AppX/SubmitNAP";
}
