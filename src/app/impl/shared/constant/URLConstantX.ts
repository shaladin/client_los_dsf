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

  //App Reserved Fund
  public static GetRsvFundSingleRule = environment.losUrl + "/v1" + "/AppReservedFundX/GetRsvFundSingleRule";
  public static GetAppRsvFundPriorityRule = environment.losUrl + "/v1" + "/AppReservedFundX/GetAppRsvFundPriorityRule";
  public static AddAppReservedFund = environment.losUrl + "/v1" + "/AppReservedFundX/AddAppReservedFund";

  //App Commission
  public static GetAppCommissionRule = environment.losUrl + "/v1" + "/AppCommissionX/GetAppCommissionRule";
  public static AddEditAppCommissionData = environment.losUrl + "/v1" + "/AppCommissionX/AddEditAppCommissionData";
  public static GetAppAssetByAppIdConditionNewBrandMitsubishi = environment.losUrl + "/v1" + "/AppAssetX/GetAppAssetByAppIdConditionNewBrandMitsubishi";

  // Upload
  public static UploadFile = environment.FoundationR3Url + '/v1' + '/UploadX/UploadFile';

  //MOU CUST X
  public static GetMouCustByAppIdX = environment.losUrl +'/v1' +  "/MouCustX/GetMouCustByAppId";
  public static AddMouCustX = environment.losUrl + '/v1' + '/MouCustX/AddMouCust';
  public static MouCustExecutionHumanActivityX = environment.losUrl +'/v1' + "/MouCustX/MouCustExecutionHumanActivity";
  public static GetMouMainInfoByIdX = environment.losUrl +'/v1' + "/MouCustX/GetMouMainInfoById";
  public static GetMouCustByAppIdForInvoiceVerifX = environment.losUrl +'/v1' +  "/MouCustX/GetMouCustByAppIdForInvoiceVerif";
  
  public static CheckMouActiveR2 = environment.losUrl +'/v1' + "/MouCustX/CheckMouActiveR2";

  // MOU CUST FCTR X
  public static GetMouCustFctrXByMouCustNoX = environment.losUrl + '/v1' + "/MouCustFctrX/GetMouCustFctrXByMouCustNo";

  // MOU CUST DLFN X
  public static GetMouDfOsPlafondByIdX = environment.losUrl + '/v1' + "/MouCustDlrFncngX/GetMouDfOsPlafondById";
  public static GetMouDfOsPlafondByAppIdX = environment.losUrl + '/v1' + "/MouCustDlrFncngX/GetMouDfOsPlafondByAppId";

  // MOU CUST COLLATERAL X
  public static GetMouCustCollateralStatXByMouCustCollateralIdX = environment.losUrl + '/v1' + '/MouCustCollateralX/GetMouCustCollateralStatXByMouCustCollateralId';
  public static GetMouCustCollateralForMouViewByMouCustIdX = environment.losUrl + "/v1" + "/MouCustCollateralX/GetMouCustCollateralForMouViewByMouCustId";
  public static AddExistingCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/AddExistingCustCollateralData';
  public static AddMouCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/AddMouCustCollateralData';
  public static EditMouCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/EditMouCustCollateralData';
  public static DeleteMouCustCollateralX = environment.losUrl + '/v1' + '/MouCustCollateralX/DeleteMouCustCollateral';

  //CHANGE MOU CUST COLLATERAL X
  public static GetChangeMouCustCollateralStatByChangeMouCustCollateralIdX = environment.losUrl + "/v1" + "/ChangeMouCustCollateralX/GetChangeMouCustCollateralStatByChangeMouCustCollateralId";
  public static GetChangeMouCustCollateralXForChangeMouViewByMouCustId = environment.losUrl + "/v1" + "/ChangeMouCustCollateralX/GetChangeMouCustCollateralForChangeMouViewByMouCustId"
  public static AddEditChangeMouCustCollateralDataX = environment.losUrl + '/v1' + "/ChangeMouCustCollateralX/AddEditChangeMouCustCollateralData";
  public static AddExistingChangeMouCustCollateralDataX = environment.losUrl + '/v1' + "/ChangeMouCustCollateralX/AddExistingChangeMouCustCollateralData";
  public static DeleteChangeMouCustCollateralX = environment.losUrl + '/v1' + "/ChangeMouCustCollateralX/DeleteChangeMouCustCollateral";

  //APP X
  public static SubmitNAPX = environment.losUrl + '/v1' + "/AppX/SubmitNAP";

  //APP INVOICE X
  public static SubmitInvoiceVerifDlfn = environment.losUrl  + '/v1' + "/AppInvoiceX/SubmitInvoiceVerifDlfn";
}
