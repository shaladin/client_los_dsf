import {environment} from 'environments/environment';

export class URLConstantX {
  // X
  public static CalculateAdditionalInterestX = environment.losUrl+ "/v1" + "/AgrmntX/CalculateAdditionalInterest";
  public static UpdateEffectiveAndAgrmntCreatedDtX = environment.losUrl+ "/v1" + "/AgrmntX/UpdateEffectiveAndAgrmntCreatedDt";
  public static GetListAgrmntParentByCustNoX = environment.losUrl + '/v1' + '/AgrmntX/GetListAgrmntParentByCustNo';

  public static SubmitDeliveryOrderDataX = environment.losUrl+ "/v1" + "/DeliveryOrderX/SubmitDeliveryOrderData";
  public static AddCustCnfrmX = environment.losUrl+ "/v1" + "/CustCnfrmX/AddCustCnfrm";
  public static AddPreGoLiveX = environment.losUrl+ "/v1" + "/PreGoLiveX/AddPreGoLive";
  public static AddPreGoLiveXV2 = environment.losUrl+ "/v2" + "/PreGoLiveX/AddPreGoLive";

  public static AddAppFromCopyCancledApp = environment.losUrl + "/v1" + "/AppX/AddAppFromCopyCancledApp";
  public static AddAppFromCopyCancledAppV2 = environment.losUrl + "/v2" + "/AppX/AddAppFromCopyCancledApp";
  public static GetOfficeBankAccAndRefBankDataByOfficeBankAccCode = environment.FoundationR3Url + "/v1" + "/OfficeBankAccX/GetOfficeBankAccAndRefBankDataByOfficeBankAccCode";

  //App CustX
  public static AddCustMainDataPersonalX = environment.losUrl + "/v1" + "/AppCustX/AddCustMainDataPersonal";
  public static EditCustMainDataPersonalX = environment.losUrl + "/v1" + "/AppCustX/EditCustMainDataPersonal";
  public static GetAppCustMainDataByAppCustIdX = environment.losUrl + "/v1" + "/AppCustX/GetAppCustMainDataByAppCustId";


  //Foundation
  public static GetVendorForSLB = environment.FoundationR3Url + "/v1" + "/VendorX/GetVendorForSLB";

  // APP Application
  public static EditAppAddAppCrossX = environment.losUrl + '/v1' + '/AppX/EditAppAddAppCross';
  public static GetAppXByAppId = environment.losUrl + '/v1' + '/AppX/GetAppXByAppId';
  public static GetAppDetailForTabAddEditAppByIdX = environment.losUrl + "/v1" + "/AppX/GetAppDetailForTabAddEditAppById";
  public static CalculatePlafondAgrmntX = environment.losUrl + "/v1" + "/AppX/CalculatePlafondAgrmnt";
  public static GetAppXDataByAppId = environment.losUrl + '/v1' + "/AppX/GetAppXDataByAppId";
  public static GetMinDeliveryDtDeliveryOrderHByAgrmntId = environment.losUrl + "/v1" + '/DeliveryOrderX/GetMinDeliveryDtDeliveryOrderHByAgrmntId';
  public static SubmitInsuranceOrder = environment.losUrl + "/v1" + '/InsuranceOrderX/SubmitInsuranceOrder';
  public static GetSppaNoByAppAssetId = environment.losUrl + "/v1" + '/InsuranceOrderX/GetSppaNoByAppAssetId';
  public static CopyCancelledApp = environment.losUrl + "/v1" + "/AppX/CopyCancelledApp";
  public static CopyCancelledAppForMainData = environment.losUrl + "/v1" + "/AppX/CopyCancelledAppForMainData";
  public static CopyCancelledAppV2 = environment.losUrl + "/v2" + "/AppX/CopyCancelledApp";
  public static CopyCancelledAppForMainDataV2 = environment.losUrl + "/v2" + "/AppX/CopyCancelledAppForMainData";
  public static SubmitNapCustMainDataV2 = environment.losUrl + "/v2" + "/AppX/SubmitNAPCustMainData";
  public static AddAppFromSimpleLeadXV2 = environment.losUrl + "/v2" + "/AppX/AddAppFromSimpleLead";
  // App Invoice
  public static UpdateAppInvoiceDlfnX = environment.losUrl + '/v1' + '/AppInvoiceX/UpdateAppInvoiceDlfn';
  public static UpdateAppInvoiceDlfnV2X = environment.losUrl + '/v2' + '/AppInvoiceX/UpdateAppInvoiceDlfn';

  //App Reserved Fund
  public static GetRsvFundSingleRule = environment.losUrl + "/v1" + "/AppReservedFundX/GetRsvFundSingleRule";
  public static GetAppRsvFundPriorityRule = environment.losUrl + "/v1" + "/AppReservedFundX/GetAppRsvFundPriorityRule";
  public static AddAppReservedFund = environment.losUrl + "/v1" + "/AppReservedFundX/AddAppReservedFund";
  public static CalculateGrossYieldRsvFundX = environment.losUrl + "/v1" + "/AppReservedFundX/CalculateGrossYieldRsvFund";

  //App Commission
  public static GetAppCommissionRule = environment.losUrl + "/v1" + "/AppCommissionX/GetAppCommissionRule";
  public static AddEditAppCommissionData = environment.losUrl + "/v1" + "/AppCommissionX/AddEditAppCommissionData";
  public static AddEditAppCommissionDataV2 = environment.losUrl + "/v2" + "/AppCommissionX/AddEditAppCommissionData";
  public static GetAppAssetByAppIdConditionNewBrandMitsubishi = environment.losUrl + "/v1" + "/AppAssetX/GetAppAssetByAppIdConditionNewBrandMitsubishi";
  public static GetAppCommissionTaxAndCalcGrossYieldX = environment.losUrl + "/v1" + "/AppCommissionX/GetAppCommissionTaxAndCalcGrossYield";

  //App Asset
  public static GetAllAssetDataForPOByAsset = environment.losUrl + "/v1" + "/AppAssetX/GetAllAssetDataForPOByAsset";
  public static AddEditAllAssetDataX = environment.losUrl + "/v1" + "/AppAssetX/AddEditAllAssetData";

  // Cessie
  public static UploadFile = environment.FoundationR3Url + "/v1" + "/UploadX/UploadFile";
  public static UploadFileV2 = environment.FoundationR3Url + "/v2" + "/UploadX/UploadFileV2";
  public static AssignProduct = environment.losUrl + "/v1" + "/Cessie/AssignProduct";
  public static GetListAppForView = environment.losUrl + "/v1" + "/Cessie/GetListAppForView";
  public static SubmitReview = environment.losUrl + "/v1" + "/Cessie/SubmitReview";
  public static SubmitReviewV2 = environment.losUrl + "/v2" + "/Cessie/SubmitReview";
  public static GetApvAmount = environment.losUrl + "/v1" + "/Cessie/GetApvAmount";
  public static GetListApp = environment.losUrl + "/v1" + "/Cessie/GetListApp";
  public static SubmitPreGoLiveCessie = environment.losUrl + "/v1" + "/Cessie/SubmitPreGoLive";
  public static SubmitPreGoLiveCessieV2 = environment.losUrl + "/v2" + "/Cessie/SubmitPreGoLive";
  public static SubmitCancel = environment.losUrl + "/v1" + "/Cessie/SubmitCancel";
  public static SubmitCancelV2 = environment.losUrl + "/v2" + "/Cessie/SubmitCancelV2";

  //MOU CUST X
  public static GetMouCustByAppIdX = environment.losUrl +'/v1' +  "/MouCustX/GetMouCustByAppId";
  public static AddMouCustX = environment.losUrl + '/v1' + '/MouCustX/AddMouCust';
  public static MouCustExecutionHumanActivityX = environment.losUrl +'/v1' + "/MouCustX/MouCustExecutionHumanActivity";
  public static GetMouMainInfoByIdX = environment.losUrl +'/v1' + "/MouCustX/GetMouMainInfoById";

  public static CheckMouActiveR2 = environment.losUrl +'/v1' + "/MouCustX/CheckMouActiveR2";
  public static MouCustExecutionHumanActivityXV2 = environment.losUrl + "/v2" + "/MouCustX/MouCustExecutionHumanActivity";

  // MOU CUST FCTR X
  public static GetMouCustFctrXByMouCustNoX = environment.losUrl + '/v1' + "/MouCustFctrX/GetMouCustFctrXByMouCustNo";
  public static GetMouFctrOsPlafondById = environment.losUrl + '/v1' + "/MouCustFctrX/GetMouFctrOsPlafondById";
  public static AddMouCustFctrX = environment.losUrl + "/v1" + "/MouCustFctrX/AddMouCustFctr";
  public static EditMouCustFctrX = environment.losUrl + "/v1" + "/MouCustFctrX/EditMouCustFctr";

  // MOU CUST DLFN X
  public static GetMouDfOsPlafondByIdX = environment.losUrl + '/v1' + "/MouCustDlrFncngX/GetMouDfOsPlafondById";
  public static GetMouDfOsPlafondByAppIdX = environment.losUrl + '/v1' + "/MouCustDlrFncngX/GetMouDfOsPlafondByAppId";

  //MOU CUST CLAUSE X
  public static GetMouCustDataByMouCustIdX = environment.losUrl +'/v1' + "/MouCustClauseX/GetMouCustDataByMouCustIdX";

  // MOU CUST COLLATERAL X
  public static GetMouCustCollateralStatXByMouCustCollateralIdX = environment.losUrl + '/v1' + '/MouCustCollateralX/GetMouCustCollateralStatXByMouCustCollateralId';
  public static GetMouCustCollateralForMouViewByMouCustIdX = environment.losUrl + "/v1" + "/MouCustCollateralX/GetMouCustCollateralForMouViewByMouCustId";
  public static AddExistingCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/AddExistingCustCollateralData';
  public static AddMouCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/AddMouCustCollateralData';
  public static EditMouCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/EditMouCustCollateralData';
  public static DeleteMouCustCollateralX = environment.losUrl + '/v1' + '/MouCustCollateralX/DeleteMouCustCollateral';
  public static GetDealerGradingX = environment.losUrl + '/v1' + '/MouCustCollateralX/GetDealerGrading';
  public static GetMouCustCollateralDataForUpdateByMouCustCollateralIdX = environment.losUrl + "/v1" + "/MouCustCollateralX/GetMouCustCollateralDataForUpdateByMouCustCollateralId";

  // CHANGE MOU
  public static GetChangeMouMainInfoByIdX = environment.losUrl +'/v1' + "/ChangeMouX/GetChangeMouMainInfoById";
  public static GetListChangeMouTrxByMouCustId = environment.losUrl + "/v1" + "/ChangeMOUX/GetListChangeMouTrxByMouCustId";

  //CHANGE MOU CUST COLLATERAL X
  public static GetChangeMouCustCollateralStatByChangeMouCustCollateralIdX = environment.losUrl + "/v1" + "/ChangeMouCustCollateralX/GetChangeMouCustCollateralStatByChangeMouCustCollateralId";
  public static GetChangeMouCustCollateralXForChangeMouViewByMouCustId = environment.losUrl + "/v1" + "/ChangeMouCustCollateralX/GetChangeMouCustCollateralXForChangeMouViewByMouCustId"
  public static AddEditChangeMouCustCollateralDataX = environment.losUrl + '/v1' + "/ChangeMouCustCollateralX/AddEditChangeMouCustCollateralData";
  public static AddExistingChangeMouCustCollateralDataX = environment.losUrl + '/v1' + "/ChangeMouCustCollateralX/AddExistingChangeMouCustCollateralData";
  public static DeleteChangeMouCustCollateralX = environment.losUrl + '/v1' + "/ChangeMouCustCollateralX/DeleteChangeMouCustCollateral";
  public static GetChangeMouDealerGradingX = environment.losUrl + '/v1' + '/ChangeMouCustCollateralX/GetChangeMouDealerGrading';
  public static GetChangeMouTrxbyTrxNo = environment.losUrl + '/v1' + "/ChangeMou/GetChangeMouTrxbyTrxNo";
  public static GetChangeMouCustCollateralDataForUpdateByChangeMouCustCollateralIdX = environment.losUrl + "/v1" + "/ChangeMouCustCollateralX/GetChangeMouCustCollateralDataForUpdateByChangeMouCustCollateralId";
  //Approval
  public static NewApproval = environment.losUrl + "/v1" + "/ApprovalX/Approval";
  public static EndDateGoLiveApprovalX = environment.losUrl+ "/v1" + "/ApprovalX/EndDateGoLiveApproval";
  public static GoLiveApprovalX = environment.losUrl+ "/v1" + "/ApprovalX/GoLiveApproval";
  //CUST MAIN DATA
  public static AddAppCustBankAccAndStmnt = environment.losUrl + '/v1' + "/AppCustBankAccX/AddAppCustBankAccAndStmntX";
  public static EditAppCustBankAccAndStmnt = environment.losUrl + '/v1' + "/AppCustBankAccX/EditAppCustBankAccAndStmntX";
  public static DeleteAppCustBankAccAndStmnt = environment.losUrl +  '/v1' +"/AppCustBankAccX/DeleteAppCustBankAccAndStmntX";
  public static GetAppCustBankAccAndStatementForView = environment.losUrl + '/v1' + "/AppCustBankAccX/GetAppCustBankAccAndStatementForViewX";

  //APP X
  public static SubmitNAPX = environment.losUrl + '/v1' + "/AppX/SubmitNAP";
  public static SubmitNAPXV2 = environment.losUrl + '/v2' + "/AppX/SubmitNAP";
  public static AddNewApplication = environment.losUrl + "/v1" + "/AppX/AddNewApplication";
  public static AddNewApplicationV2 = environment.losUrl + "/v2" + "/AppX/AddNewApplication";
  public static AddNewApplicationFromCopy = environment.losUrl + "/v1" + "/AppX/AddNewApplicationFromCopy";
  public static AddNewApplicationFromCopyV2 = environment.losUrl + "/v2" + "/AppX/AddNewApplicationFromCopy";
  public static GetAppByCustNoAndIsAppInitDone = environment.losUrl + "/v1" +"/AppX/GetAppByCustNoAndIsAppInitDone";
  public static GetAppByCustNoAndAppStat = environment.losUrl + "/v1" + "/AppX/GetAppByCustNoAndAppStat";

  //AGRMNT ACTIVATION
  public static SubmitAgrmntActivationByHuman = environment.losUrl + '/v1' + "/AgrmntActivationX/SubmitAgrmntActivationByHuman";
  public static SubmitAgrmntActivationByHumanV2 = environment.losUrl + '/v2' + "/AgrmntActivationX/SubmitAgrmntActivationByHuman";

  //APP INSURANCE X
  public static GetListAppInsObjByAgrmntIdForViewX = environment.losUrl + '/v1' + '/AppInsX/GetListAppInsObjByAgrmntIdForView';

  //PO
  public static GetAppCustBankAccsByAppIdX = environment.losUrl  + '/v1' + "/AppCustBankAccX/GetAppCustBankAccsByAppId";
  public static GetPurchaseOrderHByAgrmntIdAndSupplCodeX = environment.losUrl  + '/v1' + "/PurchaseOrderHX/GetPurchaseOrderHByAgrmntIdAndSupplCode";
  public static GetPurchaseOrderListForNewPOByAppId = environment.losUrl + "/v1" + "/PurchaseOrderHX/GetPurchaseOrderListForNewPOByAppId";
  public static ResumeWorkflowNewPurchaseOrderV2 = environment.losUrl + "/v2" + "/PurchaseOrderHX/ResumeWorkflowNewPurchaseOrder";

  //BANK PO
  public static GetBankDsfbyGeneralSettingR2 = environment.losUrl + "/v1" + "/PurchaseOrderHX/GetBankDsfbyGeneralSettingR2";

  //SURVEY VERIF X
  public static AddVerfResultHeaderAndVerfResultDetailForSurveyVerif = environment.FoundationR3Url + "/v1" + "/VerfResultHX/AddVerfResultHeaderAndVerfResultDetailForSurveyVerifX";
  public static EditVerfResultHeaderAndVerfResultDetailForSurveyVerif = environment.FoundationR3Url + "/v1" + "/VerfResultHX/EditVerfResultHeaderAndVerfResultDetailForSurveyVerifX";
  public static CompleteAppSurveyVerifXV2 = environment.losUrl + "/v2" + "/SurveyVerifX/CompleteAppSurveyVerif";

  //REF SECTOR ECONOMY SLIK X
  public static GetRefSectorEconomySlikXByCode = environment.FoundationR3Url + "/v1" + "/RefSectorEconomySlikX/GetRefSectorEconomySlikXByCode";
  public static GetActiveMappingRefSectorEconomySlikXBySectorEconomySlikCode = environment.FoundationR3Url + "/v1" + "/RefSectorEconomySlikX/GetActiveMappingRefSectorEconomySlikXBySectorEconomySlikCode";

  //credit review
  public static GetCrdRvwAppByCrdRvwCustInfoId = environment.losUrl  + '/v1' + "/CrdRvwAppX/GetCrdRvwAppByCrdRvwCustInfoId";
  //App Fin Data-Fee X
  public static GetInitAppFinDataByAppIdX = environment.losUrl +"/v1"+ "/AppFinDataX/GetInitAppFinDataByAppId";
  public static GetInitFinDataForTrialCalcX = environment.losUrl +"/v1"+ "/AppFinDataX/GetInitFinDataForTrialCalc";
  public static GetInitAppFinDataFctrByAppIdX = environment.losUrl +"/v1"+ "/AppFinDataX/GetInitAppFinDataFctrByAppId";
  public static GetInitAppFinDataDFByAppIdX = environment.losUrl +"/v1"+ "/AppFinDataX/GetInitAppFinDataDFByAppId";

  public static GetListAppFeeByAppIdX = environment.losUrl +"/v1"+ "/AppFeeX/GetListAppFeeByAppId";
  public static GetListAppFeeAndMouFeeByAppIdX = environment.losUrl +"/v1"+ "/AppFeeX/GetListAppFeeAndMouFeeByAppId";
  public static GetListAppFeeForTrialCalcX = environment.losUrl +"/v1"+ "/AppFeeX/GetListAppFeeForTrialCalc";

  public static GetApprovalAmountForCreditReviewByAppIdX = environment.losUrl + "/v1" + "/AppFinDataX/GetApprovalAmountForCreditReviewByAppId";

  public static CalculateInstallmentBalloonX = environment.losUrl +"/v1"+ "/AppFinDataX/CalculateInstallmentBalloon";
  public static CalculateInstallmentEvenPrincipalX = environment.losUrl +"/v1"+ "/AppFinDataX/CalculateInstallmentEvenPrincipal";
  public static CalculateIrregularX = environment.losUrl +"/v1"+ "/AppFinDataX/CalculateIrregular";
  public static CalculateInstallmentRegularFixX = environment.losUrl +"/v1"+ "/AppFinDataX/CalculateInstallmentRegularFix";
  public static CalculateInstallmentStepUpStepDownX = environment.losUrl +"/v1"+ "/AppFinDataX/CalculateInstallmentStepUpStepDown";
  public static SaveAppFinDataX = environment.losUrl + "/v1" + "/AppFinDataX/SaveAppFinData";

  //Application Data DF
  public static EditApplicationDataDF = environment.losUrl + "/v1" + "/ApplicationDataX/EditApplicationDataDF";
  public static SaveApplicationDataDF = environment.losUrl + "/v1" + "/ApplicationDataX/SaveApplicationDataDF";
  
  //APP TC
  public static EditAppTcX = environment.losUrl + "/v1" + "/AppTcX/EditAppTc";

  // CUST MAIN DATA
  public static CheckIfCustHasOngoingAppX = environment.losUrl + "/v1" + "/AppCustX/CheckIfCustHasOngoingApp";
  public static CheckAppCustShareholderMandatoryDataX = environment.losUrl + "/v1" + "/AppCustX/CheckAppCustShareholderMandatoryData";
  //AGRMNT
  public static GetAgrmntHistByListCustNo = environment.losUrl + "/v1" +"/AgrmntX/GetAgrmntHistByListCustNo";
  public static GetAgrmntFinDataNtfAmtByAgrmntId = environment.losUrl + "/v1" + "/AgrmntX/GetAgrmntFinDataNtfAmtByAgrmntId";

  //ASSET
  public static GetRefAssetDocList = environment.FoundationR3Url + "/v1" + "/AssetDocListX/GetListAssetDocListByAssetTypeCode";

  //GENERIC
  public static GetPagingObjectR2BySQL = "/GenericX/GetPagingObjectR2BySQL";

  //SURVEY VERIF X
  public static SubmitReturnHandlingSurveyVerif = environment.losUrl + "/v2" + "/SurveyVerifX/SubmitReturnHandlingSurveyVerif";

  // App Credit Review
  public static CrdRvwMakeNewApprovalV2 = environment.losUrl + "/v2" + "/AppCrdRvwX/CrdRvwMakeNewApproval";

  //APP CUST X
  // tslint:disable-next-line:max-line-length
  public static GetAppCustAndAppCustCompanyDataByAppCustId = environment.losUrl + "/v1" + "/AppCustX/GetAppCustAndAppCustCompanyDataByAppCustId";
  public static UpdateAppCustCompletionCompany = environment.losUrl + "/v1" + "/AppCustX/UpdateAppCustCompletionCompany";
  public static SaveAppCustCompletion = environment.losUrl + "/v1" + "/AppCustX/SaveAppCustCompletion";

  //APP CUST PERSONAL JOB DATA X
  public static AddAppCustPersonalJobData = environment.losUrl + "/v1" + "/AppCustPersonalJobDataX/AddAppCustPersonalJobData";
  public static EditAppCustPersonalJobData = environment.losUrl + "/v1" + "/AppCustPersonalJobDataX/EditAppCustPersonalJobData";
  public static GetAppCustPersonalJobData = environment.losUrl + "/v1" + "/AppCustPersonalJobDataX/GetAppCustPersonalJobData";
  
  //R2 API
  public static R2ApiAgrmntGetListCustNoHaveAgrmntMaster = environment.R2Url + "/api/Agrmnt/GetListCustNoHaveAgrmntMaster";

  //Dealer Financing
  public static CalcGrossYieldSingleInstDF = environment.losUrl + "/v1" + "/AppFinDataX/CalcGrossYieldSingleInstDF";

  //LTKM Customer Data
  public static GetListLtkmAppPrcsByCustNoAndIsAppInitDone = environment.losUrl + "/v1" + "/LtkmCustomerDataX/GetListLtkmAppPrcsByCustNoAndIsAppInitDone";
  public static GetLtkmAppRjcByCustNoAndAppStat = environment.losUrl + "/v1" + "/LtkmCustomerDataX/GetLtkmAppRjcByCustNoAndAppStat";
  public static GetLtkmExistAgrmntByCustNoAndIsAppInitDone = environment.losUrl + "/v1" + "/LtkmCustomerDataX/GetLtkmExistAgrmntByCustNoAndIsAppInitDone";

  //Delivery Order
  public static EditAppAssetDOMultiAsset = environment.losUrl + "/v1" + "/AppAssetX/EditAppAssetDOMultiAsset";

}
