import { environment } from 'environments/environment';

export class URLConstantX {
  // X
  public static CalculateAdditionalInterestX = environment.losUrl + "/v1" + "/AgrmntX/CalculateAdditionalInterest";
  public static UpdateEffectiveAndAgrmntCreatedDtX = environment.losUrl + "/v1" + "/AgrmntX/UpdateEffectiveAndAgrmntCreatedDt";
  public static GetListAgrmntParentByCustNoX = environment.losUrl + '/v1' + '/AgrmntX/GetListAgrmntParentByCustNo';
  public static CheckAgrmntParentOverdueByCustNo = environment.losUrl + '/v1' + '/AgrmntX/CheckAgrmntParentOverdueByCustNo';


  public static SubmitDeliveryOrderDataX = environment.losUrl+ "/v1" + "/DeliveryOrderX/SubmitDeliveryOrderData";
  public static AddCustCnfrmX = environment.losUrl+ "/v1" + "/CustCnfrmX/AddCustCnfrm";
  public static AddPreGoLiveX = environment.losUrl+ "/v1" + "/PreGoLiveX/AddPreGoLive";
  public static AddPreGoLiveXV2 = environment.losUrl+ "/v2" + "/PreGoLiveX/AddPreGoLive";
  public static AddPreGoLiveXV3 = environment.losUrl+ "/v3" + "/PreGoLiveX/AddPreGoLive";
  public static BackToDeliveryOrderCustConfirm = environment.losUrl+ "/v1" + "/PreGoLiveX/BackToDeliveryOrderCustConfirm";
  public static BackToDeliveryOrderCustConfirmV2 = environment.losUrl+ "/v2" + "/PreGoLiveX/BackToDeliveryOrderCustConfirm";
  public static PreGoLiveApprovalV2X = environment.losUrl + "/v2" + "/ApprovalX/PreGoLiveApproval";

  public static AddAppFromCopyCancledApp = environment.losUrl + "/v1" + "/AppX/AddAppFromCopyCancledApp";
  public static AddAppFromCopyCancledAppV2 = environment.losUrl + "/v2" + "/AppX/AddAppFromCopyCancledApp";
  public static GetOfficeBankAccAndRefBankDataByOfficeBankAccCode = environment.FoundationR3Url + "/v1" + "/OfficeBankAccX/GetOfficeBankAccAndRefBankDataByOfficeBankAccCode";

  //App CustX
  public static AddCustMainDataPersonalX = environment.losUrl + "/v1" + "/AppCustX/AddCustMainDataPersonal";
  public static EditCustMainDataPersonalX = environment.losUrl + "/v1" + "/AppCustX/EditCustMainDataPersonal";
  public static EditCustMainDataPersonalXV2 = environment.losUrl + "/v2" + "/AppCustX/EditCustMainDataPersonal";
  public static GetAppCustMainDataByAppCustIdX = environment.losUrl + "/v1" + "/AppCustX/GetAppCustMainDataByAppCustId";
  public static SyncAppCustWithCustFOU = environment.losUrl + "/v1" + "/AppCustX/SyncAppCustWithCustFOU";
  public static SyncAppCustWithCustFOUSecondary = environment.losUrl + "/v1" + "/AppCustX/SyncAppCustWithCustFOUSecondary";
  public static ShareHolderDuplicateCheck = environment.losUrl + "/v1" + "/AppCustX/ShareHolderDuplicateCheck";

  public static GetCustDataCompanyForViewXByAppId = environment.losUrl + "/v1" + "/AppCustX/GetCustDataCompanyXForViewByAppId";
  public static GetCustDataPersonalXForViewByAppId = environment.losUrl + "/v1" + "/AppCustX/GetCustDataPersonalXForViewByAppId";

  //Foundation
  public static GetVendorForSLB = environment.FoundationR3Url + "/v1" + "/VendorX/GetVendorForSLB";
  public static GetListCustCompanyFinDataXForCustViewByCustId = environment.FoundationR3Url + "/v1" + "/CustomerCompanyFinDataX/GetListCustCompanyFinDataXForCustViewByCustId";
  public static GetRefAttrListByListAttrCode = environment.FoundationR3Url + "/v1" + "/RefAttr/GetRefAttrListByListAttrCode";
  public static GetListCustPersonalFinDataXForCustViewByCustId = environment.FoundationR3Url + "/v1" + "/CustPersonalFinDataX/GetListCustPersonalFinDataXForCustViewByCustId";

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
  public static CopyCancelledAppForMainDataV2 = environment.losUrl + "/v2.1" + "/AppX/CopyCancelledAppForMainData";
  public static SubmitNapCustMainDataV2 = environment.losUrl + "/v2" + "/AppX/SubmitNAPCustMainData";
  public static AddAppFromSimpleLeadXV2 = environment.losUrl + "/v2" + "/AppX/AddAppFromSimpleLead";
  // App Invoice
  public static UpdateAppInvoiceDlfnX = environment.losUrl + '/v1' + '/AppInvoiceX/UpdateAppInvoiceDlfn';
  public static UpdateAppInvoiceDlfnV2X = environment.losUrl + '/v2' + '/AppInvoiceX/UpdateAppInvoiceDlfn';
  public static UpdateAppInvoiceDlfnV2_1X = environment.losUrl + '/v2.1' + '/AppInvoiceX/UpdateAppInvoiceDlfn';

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
  public static GetCommIncomeInfoByAppIdX = environment.losUrl + "/v1" + "/AppCommissionX/GetCommIncomeInfoByAppId";
  public static GetCommIncomeInfoByAgrIdX = environment.losUrl + "/v1" + "/AppCommissionX/GetCommIncomeInfoByAgrId";
  public static SubmitEditCommAfterApvDataReqV2 = environment.losUrl + "/v2" + "/AppCommissionX/SubmitEditCommAfterApvDataReq";
  public static GetListEditCommOldByTrxId = environment.losUrl + "/v1" + "/AppCommissionX/GetEditCommOldByTrxId";
  public static GetListEditCommNewByTrxId = environment.losUrl + "/v1" + "/AppCommissionX/GetEditCommNewByTrxId";
  public static GetEditCommOldDataDetailByTrxId = environment.losUrl + "/v1" + "/AppCommissionX/GetEditCommOldDataDetailByTrxId";
  public static GetEditCommNewDataDetailByTrxId = environment.losUrl + "/v1" + "/AppCommissionX/GetEditCommNewDataDetailByTrxId";
  public static SubmitEditCommAftApvApproval = environment.losUrl + "/v1" + "/AppCommissionX/SubmitEditCommAftApvApproval";
  public static GetAgrmntCommissionDataForEditByAgrmntId = environment.losUrl + "/v1" + "/AppCommissionX/GetAgrmntCommissionDataForEditByAgrmntId";
  public static GetEditComReqAndApvByAgrmntId = environment.losUrl + "/v1" + "/AppCommissionX/GetEditComReqAndApvByAgrmntId";
  public static GetEditAppReqAndApvByAgrmntId = environment.losUrl + "/v1" + "/AppCommissionX/GetEditAppReqAndApvByAgrmntId"

  //Pph23
  public static GetPph23BySupplierNo = environment.losUrl + "/v1" + "/AppCommissionX/GetPph23BySupplierNo";

  //App Asset
  public static GetAllAssetDataForPOByAsset = environment.losUrl + "/v1" + "/AppAssetX/GetAllAssetDataForPOByAsset";
  public static AddEditAllAssetDataX = environment.losUrl + "/v1" + "/AppAssetX/AddEditAllAssetData";
  public static GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppIdV2 = environment.losUrl + "/v2" + "/AppAssetX/GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppId";
  public static ValidateAppCollateralDocByAppId = environment.losUrl + "/v1" + "/AppCollateralDocX/ValidateAppCollateralDocByAppId"

  //Edit App Aft Apv
  public static GetEditAppAftApvTrxForChangeSummaryByEditAppAftApvTrxHId = environment.losUrl + "/v1" + "/EditAppAftApvX/GetEditAppAftApvTrxForChangeSummaryByEditAppAftApvTrxHId";
  public static EditAppAfterApproval = environment.losUrl + "/v2" + "/ApprovalX/EditAppAfterApproval";
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
  public static GetInitForDmsDataByCessieHXId = environment.losUrl + "/v1" + "/Cessie/GetInitForDmsDataByCessieHXId";
  public static GetCessieHXById = environment.losUrl + "/v1" + "/Cessie/GetCessieHXById";

  // CUSTOMER ADDRESS
  public static GetListCustAddrByCustNoX = environment.FoundationR3Url + "/v1" + "/CustAddrX/GetListCustAddrByCustNoX";

  //MOU CUST X
  public static GetMouCustByAppIdX = environment.losUrl + '/v1' + "/MouCustX/GetMouCustByAppId";
  public static AddMouCustX = environment.losUrl + '/v1' + '/MouCustX/AddMouCust';
  public static AddMouCustV2X = environment.losUrl + '/v2' + '/MouCustX/AddMouCust';
  public static MouCustExecutionHumanActivityX = environment.losUrl + '/v1' + "/MouCustX/MouCustExecutionHumanActivity";
  public static GetMouMainInfoByIdX = environment.losUrl + '/v1' + "/MouCustX/GetMouMainInfoById";

  public static CheckMouActiveR2 = environment.losUrl + '/v1' + "/MouCustX/CheckMouActiveR2";
  public static MouCustExecutionHumanActivityXV2 = environment.losUrl + "/v2" + "/MouCustX/MouCustExecutionHumanActivity";
  public static MouApproval = environment.losUrl + "/v1" + "/ApprovalX/MouApproval";

  // MOU CUST FCTR X
  public static GetMouCustFctrXByMouCustNoX = environment.losUrl + '/v1' + "/MouCustFctrX/GetMouCustFctrXByMouCustNo";
  public static GetMouFctrOsPlafondById = environment.losUrl + '/v1' + "/MouCustFctrX/GetMouFctrOsPlafondById";
  public static AddMouCustFctrX = environment.losUrl + "/v1" + "/MouCustFctrX/AddMouCustFctr";
  public static EditMouCustFctrX = environment.losUrl + "/v1" + "/MouCustFctrX/EditMouCustFctr";

  // MOU CUST DLFN X
  public static GetMouDfOsPlafondByIdX = environment.losUrl + '/v1' + "/MouCustDlrFncngX/GetMouDfOsPlafondById";
  public static GetMouDfOsPlafondByAppIdX = environment.losUrl + '/v1' + "/MouCustDlrFncngX/GetMouDfOsPlafondByAppId";

  //MOU CUST CLAUSE X
  public static GetMouCustDataByMouCustIdX = environment.losUrl + '/v1' + "/MouCustClauseX/GetMouCustDataByMouCustIdX";

  // MOU CUST COLLATERAL X
  public static GetMouCustCollateralStatXByMouCustCollateralIdX = environment.losUrl + '/v1' + '/MouCustCollateralX/GetMouCustCollateralStatXByMouCustCollateralId';
  public static GetMouCustCollateralForMouViewByMouCustIdX = environment.losUrl + "/v1" + "/MouCustCollateralX/GetMouCustCollateralForMouViewByMouCustId";
  public static AddExistingCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/AddExistingCustCollateralData';
  public static AddMouCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/AddMouCustCollateralData';
  public static EditMouCustCollateralDataX = environment.losUrl + '/v1' + '/MouCustCollateralX/EditMouCustCollateralData';
  public static DeleteMouCustCollateralX = environment.losUrl + '/v1' + '/MouCustCollateralX/DeleteMouCustCollateral';
  public static GetDealerGradingX = environment.losUrl + '/v1' + '/MouCustCollateralX/GetDealerGrading';
  public static GetMouCustCollateralDataForUpdateByMouCustCollateralIdX = environment.losUrl + "/v1" + "/MouCustCollateralX/GetMouCustCollateralDataForUpdateByMouCustCollateralId";
  public static GetMouCustCollateralForMouViewByMouCustId = environment.losUrl + "/v1" + "/MouCustCollateralX/GetMouCustCollateralForMouViewByMouCustId";


  // CHANGE MOU
  public static GetChangeMouMainInfoByIdX = environment.losUrl + '/v1' + "/ChangeMouX/GetChangeMouMainInfoById";
  public static GetListChangeMouTrxByMouCustId = environment.losUrl + "/v1" + "/ChangeMOUX/GetListChangeMouTrxByMouCustId";
  public static AddChangeMou = environment.losUrl + "/v1" + "/ChangeMOUX/AddChangeMou";
  public static GetChangeMouPreviousIdByChangeMouTrxIdX = environment.losUrl + "/v1" + "/ChangeMouX/GetChangeMouPreviousIdByChangeMouTrxIdX";

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
  public static EndDateGoLiveApprovalX = environment.losUrl + "/v1" + "/ApprovalX/EndDateGoLiveApproval";
  public static GoLiveApprovalX = environment.losUrl + "/v1" + "/ApprovalX/GoLiveApproval";
  public static GoLiveApprovalV2X = environment.losUrl + "/v2" + "/ApprovalX/GoLiveApproval";
  public static CreditApprovalX = environment.losUrl + "/v2" + "/ApprovalX/CreditApproval";
  public static NewApprovalV2X = environment.losUrl + "/v2" + "/ApprovalX/Approval";
  public static ResultExpiredDaysApprovalX = environment.losUrl + "/v1" + "/ApprovalX/ResultExpiredDaysApproval";
  //CUST MAIN DATA
  public static AddAppCustBankAccAndStmnt = environment.losUrl + '/v1' + "/AppCustBankAccX/AddAppCustBankAccAndStmntX";
  public static EditAppCustBankAccAndStmnt = environment.losUrl + '/v1' + "/AppCustBankAccX/EditAppCustBankAccAndStmntX";
  public static DeleteAppCustBankAccAndStmnt = environment.losUrl + '/v1' + "/AppCustBankAccX/DeleteAppCustBankAccAndStmntX";
  public static GetAppCustBankAccAndStatementForView = environment.losUrl + '/v1' + "/AppCustBankAccX/GetAppCustBankAccAndStatementForViewX";
  public static AddEditNapCust = environment.losUrl + "/v1" + "/Application/AddEditNapCust";
  public static GetCustBankAccByCustNoX = environment.FoundationR3Url + "/v1" + "/CustBankAccX/GetCustBankAccByCustNoX";
  public static GetCustBankAccByCustBankAccIdX = environment.FoundationR3Url + "/v1" + "/CustBankAccX/GetCustBankAccByCustBankAccIdX";

  //APP X
  public static SubmitNAPX = environment.losUrl + '/v1' + "/AppX/SubmitNAP";
  public static SubmitNAPXV2 = environment.losUrl + '/v2' + "/AppX/SubmitNAP";
  public static AddNewApplication = environment.losUrl + "/v1" + "/AppX/AddNewApplication";
  public static AddNewApplicationV2 = environment.losUrl + "/v2" + "/AppX/AddNewApplication";
  public static AddNewApplicationFromCopy = environment.losUrl + "/v1" + "/AppX/AddNewApplicationFromCopy";
  public static AddNewApplicationFromCopyV2 = environment.losUrl + "/v2" + "/AppX/AddNewApplicationFromCopy";
  public static AddNewApplicationFromCopyV2_1 = environment.losUrl + "/v2.1" + "/AppX/AddNewApplicationFromCopy";
  public static AddNewApplicationFromCopyV2_2 = environment.losUrl + "/v2.2" + "/AppX/AddNewApplicationFromCopy";
  public static GetAppByCustNoAndIsAppInitDone = environment.losUrl + "/v1" + "/AppX/GetAppByCustNoAndIsAppInitDone";
  public static GetAppByCustNoAndAppStat = environment.losUrl + "/v1" + "/AppX/GetAppByCustNoAndAppStat";
  public static GetAppByCustNoAndAppStatV2 = environment.losUrl + "/v2" + "/AppX/GetAppByCustNoAndAppStatV2";
  public static GetAppByCustNoAndIsAppInitDoneV2 = environment.losUrl + "/v2" + "/AppX/GetAppByCustNoAndIsAppInitDoneV2";

  //AGRMNT ACTIVATION
  public static SubmitAgrmntActivationByHuman = environment.losUrl + '/v1' + "/AgrmntActivationX/SubmitAgrmntActivationByHuman";
  public static SubmitAgrmntActivationByHumanV2 = environment.losUrl + '/v2' + "/AgrmntActivationX/SubmitAgrmntActivationByHuman";

  //APP INSURANCE X
  public static GetListAppInsObjByAgrmntIdForViewX = environment.losUrl + '/v1' + '/AppInsX/GetListAppInsObjByAgrmntIdForView';
  public static GetAddCvgDiscRule = environment.losUrl + '/v1' + '/AppInsX/GetAddCvgDiscRule';
  public static ExecuteInsRateRuleV2ByRequestCategory = environment.losUrl + "/v2" + "/AppInsX/ExecuteInsRateRuleV2ByRequestCategory";
  public static EditInsuranceDataMultiAssetX = environment.losUrl + "/v1" + "/AppInsX/EditInsuranceDataMultiAssetX";
  public static AddInsuranceDataMultiAssetX = environment.losUrl + "/v1" + "/AppInsX/AddInsuranceDataMultiAssetX";

  //PO
  public static GetAppCustBankAccsByAppIdX = environment.losUrl + '/v1' + "/AppCustBankAccX/GetAppCustBankAccsByAppId";
  public static GetPurchaseOrderHByAgrmntIdAndSupplCodeX = environment.losUrl + '/v1' + "/PurchaseOrderHX/GetPurchaseOrderHByAgrmntIdAndSupplCode";
  public static GetPurchaseOrderListForNewPOByAppId = environment.losUrl + "/v1" + "/PurchaseOrderHX/GetPurchaseOrderListForNewPOByAppId";
  public static ResumeWorkflowNewPurchaseOrderV2 = environment.losUrl + "/v2" + "/PurchaseOrderHX/ResumeWorkflowNewPurchaseOrder";
  public static GetAppLoanPurposeForPOByLoan = environment.losUrl + "/v1" + "/AppLoanPurposeX/GetAppLoanPurposeForPOByLoan";

  //BANK PO
  public static GetBankDsfbyGeneralSettingR2 = environment.losUrl + "/v1" + "/PurchaseOrderHX/GetBankDsfbyGeneralSettingR2";

  //SURVEY VERIF X
  public static AddVerfResultHeaderAndVerfResultDetailForSurveyVerif = environment.FoundationR3Url + "/v1" + "/VerfResultHX/AddVerfResultHeaderAndVerfResultDetailForSurveyVerifX";
  public static EditVerfResultHeaderAndVerfResultDetailForSurveyVerif = environment.FoundationR3Url + "/v1" + "/VerfResultHX/EditVerfResultHeaderAndVerfResultDetailForSurveyVerifX";
  public static CompleteAppSurveyVerifXV2 = environment.losUrl + "/v2" + "/SurveyVerifX/CompleteAppSurveyVerif";
  public static DeleteVerfResultHeaderAndVerfResultDetailByVerfResultHId = environment.FoundationR3Url + "/v1" + "/VerfResultHX/DeleteVerfResultHeaderAndVerfResultDetailByVerfResultHId";

  //REF SECTOR ECONOMY SLIK X
  public static GetRefSectorEconomySlikXByCode = environment.FoundationR3Url + "/v1" + "/RefSectorEconomySlikX/GetRefSectorEconomySlikXByCode";
  public static GetActiveMappingRefSectorEconomySlikXBySectorEconomySlikCode = environment.FoundationR3Url + "/v1" + "/RefSectorEconomySlikX/GetActiveMappingRefSectorEconomySlikXBySectorEconomySlikCode";

  //credit review
  public static GetCrdRvwAppByCrdRvwCustInfoId = environment.losUrl + '/v1' + "/CrdRvwAppX/GetCrdRvwAppByCrdRvwCustInfoId";
  public static GetAssetAndAccByAppId = environment.losUrl + '/v1' + "/AppCrdRvwX/GetAssetAndAccByAppId"
  public static GetAssetAndAccByAppIdV2 = environment.losUrl + '/v2' + "/AppCrdRvwX/GetAssetAndAccByAppId"

  //App Fin Data-Fee X
  public static GetInitAppFinDataByAppIdX = environment.losUrl + "/v1" + "/AppFinDataX/GetInitAppFinDataByAppId";
  public static GetInitAppFinDataByAppIdXV2 = environment.losUrl + "/v2" + "/AppFinDataX/GetInitAppFinDataByAppId";
  public static GetInitFinDataForTrialCalcX = environment.losUrl + "/v1" + "/AppFinDataX/GetInitFinDataForTrialCalc";
  public static GetInitAppFinDataFctrByAppIdX = environment.losUrl + "/v1" + "/AppFinDataX/GetInitAppFinDataFctrByAppId";
  public static GetInitAppFinDataDFByAppIdX = environment.losUrl + "/v1" + "/AppFinDataX/GetInitAppFinDataDFByAppId";

  public static GetListAppFeeByAppIdX = environment.losUrl + "/v1" + "/AppFeeX/GetListAppFeeByAppId";
  public static GetListAppFeeAndMouFeeByAppIdX = environment.losUrl + "/v1" + "/AppFeeX/GetListAppFeeAndMouFeeByAppId";
  public static GetListAppFeeForTrialCalcX = environment.losUrl + "/v1" + "/AppFeeX/GetListAppFeeForTrialCalc";

  public static GetApprovalAmountForCreditReviewByAppIdX = environment.losUrl + "/v1" + "/AppFinDataX/GetApprovalAmountForCreditReviewByAppId";

  public static CalculateInstallmentBalloonX = environment.losUrl + "/v1" + "/AppFinDataX/CalculateInstallmentBalloon";
  public static CalculateInstallmentEvenPrincipalX = environment.losUrl + "/v1" + "/AppFinDataX/CalculateInstallmentEvenPrincipal";
  public static CalculateIrregularX = environment.losUrl + "/v1" + "/AppFinDataX/CalculateIrregular";
  public static CalculateInstallmentRegularFixX = environment.losUrl + "/v1" + "/AppFinDataX/CalculateInstallmentRegularFix";
  public static CalculateInstallmentStepUpStepDownX = environment.losUrl + "/v1" + "/AppFinDataX/CalculateInstallmentStepUpStepDown";
  public static SaveAppFinDataX = environment.losUrl + "/v1" + "/AppFinDataX/SaveAppFinData";
  public static GetAppFinDataWithRuleByAppIdX = environment.losUrl + "/v1" + "/AppFinDataX/GetAppFinDataWithRuleByAppId";

  //Application Data DF
  public static EditApplicationDataDF = environment.losUrl + "/v1" + "/ApplicationDataX/EditApplicationDataDF";
  public static SaveApplicationDataDF = environment.losUrl + "/v1" + "/ApplicationDataX/SaveApplicationDataDF";

  //APP TC
  public static EditAppTcX = environment.losUrl + "/v1" + "/AppTcX/EditAppTc";
  public static GetListTCbyAppIdFromRuleX = environment.losUrl + "/v1" + "/AppTcX/GetListTCbyAppIdFromRuleX";

  // CUST MAIN DATA
  public static CheckIfCustHasOngoingAppX = environment.losUrl + "/v1" + "/AppCustX/CheckIfCustHasOngoingApp";
  public static CheckAppCustShareholderMandatoryDataX = environment.losUrl + "/v1" + "/AppCustX/CheckAppCustShareholderMandatoryData";
  //AGRMNT
  public static GetAgrmntHistByListCustNo = environment.losUrl + "/v1" + "/AgrmntX/GetAgrmntHistByListCustNo";
  public static GetAgrmntHistByListCustNoFilterExpired = environment.losUrl + "/v1" + "/AgrmntX/GetAgrmntHistByListCustNoFilterExpired";
  public static GetAgrmntFinDataNtfAmtByAgrmntId = environment.losUrl + "/v1" + "/AgrmntX/GetAgrmntFinDataNtfAmtByAgrmntId";
  public static GetAgrmntOtherInfoByAgrmntIdX = environment.losUrl + "/v1" + "/AgrmntX/GetAgrmntOtherInfoByAgrmntId";
  public static GetAgrmntOtherInfoByAgrmntIdForViewX = environment.losUrl + "/v1" + "/AgrmntX/GetAgrmntOtherInfoByAgrmntIdForView";
  public static GetLatestAgrmntXByAgrmntId = environment.losUrl + "/v1" + "/AgrmntX/GetLatestAgrmntXByAgrmntId";
  public static GetAgrmntExpiredHistForCustViewByCustNo = environment.losUrl + "/v1" + "/AgrmntX/GetAgrmntExpiredHistForCustViewByCustNo";

  //ASSET
  public static GetRefAssetDocList = environment.FoundationR3Url + "/v1" + "/AssetDocListX/GetListAssetDocListByAssetTypeCode";

  // App Collateral Doc
  public static GetListAppCollateralDocsByAppCollateralId = environment.losUrl + "/v1" + "/AppCollateralDocX/GetListAppCollateralDocsByAppCollateralId";

  //GENERIC
  public static GetPagingObjectR2BySQL = "/GenericX/GetPagingObjectR2BySQL";
  public static RunSpBySpNameWithParam = environment.FoundationR3Url + "/v1" + "/GenSpX/RunSpBySpNameWithParam";

  //SURVEY VERIF X
  public static SubmitReturnHandlingSurveyVerif = environment.losUrl + "/v2" + "/SurveyVerifX/SubmitReturnHandlingSurveyVerif";

  // App Credit Review
  public static CrdRvwMakeNewApprovalV2 = environment.losUrl + "/v2" + "/AppCrdRvwX/CrdRvwMakeNewApproval";

  //APP CUST X
  // tslint:disable-next-line:max-line-length
  public static GetAppCustAndAppCustCompanyDataByAppCustId = environment.losUrl + "/v1" + "/AppCustX/GetAppCustAndAppCustCompanyDataByAppCustId";
  public static UpdateAppCustCompletionCompany = environment.losUrl + "/v1" + "/AppCustX/UpdateAppCustCompletionCompany";
  public static SaveAppCustCompletion = environment.losUrl + "/v1" + "/AppCustX/SaveAppCustCompletion";
  public static AddCustMainDataCompanyData = environment.losUrl + "/v1" + "/AppCustX/AddCustMainDataCompanyDataX";

  //APP CUST PERSONAL JOB DATA X
  public static AddAppCustPersonalJobData = environment.losUrl + "/v1" + "/AppCustPersonalJobDataX/AddAppCustPersonalJobData";
  public static EditAppCustPersonalJobData = environment.losUrl + "/v1" + "/AppCustPersonalJobDataX/EditAppCustPersonalJobData";
  public static GetAppCustPersonalJobData = environment.losUrl + "/v1" + "/AppCustPersonalJobDataX/GetAppCustPersonalJobData";

  // AppCustCompanyMgmntShrholder
  public static GetListManagementShareholderForListPagingByParentAppCustCompanyId = environment.losUrl + "/v1" + "/AppCustCompanyMgmntShrholderX/GetListManagementShareholderForListPagingByParentAppCustCompanyId"

  //R2 API
  public static R2ApiAgrmntGetListCustNoHaveAgrmntMaster = environment.r2Url + "/api/Agrmnt/GetListCustNoHaveAgrmntMaster";
  public static GetListAssetMasterByCustNoAndAssetSchemeCodeFromR2 = environment.FoundationR3Url + "/v1" + "/AssetMasterX/GetListAssetMasterByCustNoAndAssetSchemeCodeFromR2";
  public static GetAssetMasterDetailFromR2 = environment.FoundationR3Url + "/v1" + "/AssetMasterX/GetAssetMasterDetailFromR2";

  //Dealer Financing
  public static CalcGrossYieldSingleInstDF = environment.losUrl + "/v1" + "/AppFinDataX/CalcGrossYieldSingleInstDF";

  //LTKM Customer Data
  public static GetListLtkmAppPrcsByCustNoAndIsAppInitDone = environment.losUrl + "/v1" + "/LtkmCustomerDataX/GetListLtkmAppPrcsByCustNoAndIsAppInitDone";
  public static GetLtkmAppRjcByCustNoAndAppStat = environment.losUrl + "/v1" + "/LtkmCustomerDataX/GetLtkmAppRjcByCustNoAndAppStat";
  public static GetLtkmExistAgrmntByCustNoAndIsAppInitDone = environment.losUrl + "/v1" + "/LtkmCustomerDataX/GetLtkmExistAgrmntByCustNoAndIsAppInitDone";
  public static GetLtkmCustBankAccAndStatementForViewWithOrderedMonthAndYear = environment.losUrl + "/v1" + "/LtkmCustomerDataX/GetLtkmCustBankAccAndStatementForViewWithOrderedMonthAndYear";
  public static GetCustDataByLtkmCustId = environment.losUrl + "/v1" + "/LtkmCustomerDataX/GetCustDataByLtkmCustId";
  public static LtkmApproval = environment.losUrl + "/v1" + "/ApprovalX/LtkmApproval";
  
  //ltkm cust personal main data
  public static GetCustPersonalForLtkmCopyByCustIdX = environment.FoundationR3Url + "/v1" + "/CustX/GetCustPersonalForLtkmCopyByCustId";

  //ltkm summary
  public static GetSummaryByLtkmCustId = environment.losUrl + "/v1" + "/LtkmX/GetSummaryByLtkmCustId";
  //ltkm return handling
  public static SaveLtkmReturnHandlingPersonalV2 = environment.losUrl + "/v2" + "/LtkmCustomerDataX/SaveLtkmReturnHandlingPersonal";
  public static SaveLtkmReturnHandlingCompanyV2 = environment.losUrl + "/v2" + "/LtkmCustomerDataX/SaveLtkmReturnHandlingCompany";


  //Delivery Order
  public static EditAppAssetDOMultiAsset = environment.losUrl + "/v1" + "/AppAssetX/EditAppAssetDOMultiAsset";
  public static ValidateDeliveryOrderMultiAsset = environment.losUrl + "/v1" + "/DeliveryOrderX/ValidateDeliveryOrderMultiAsset";

  //AppSubsidyProfitabilityX
  public static GetAppSubsidyProfitabilityXByAppId = environment.losUrl + "/v1" + "/AppSubsidyProfitabilityX/GetAppSubsidyProfitabilityXByAppId";

  //Potential RO
  public static GetTelemkOfferingSubjectByRoPotentialNo = environment.losUrl + "/v1" + "/RoPotentialX/GetTelemkOfferingSubjectByRoPotentialNo";
  public static GenerateRoPotentialDataFromSpX = environment.losUrl + "/v1" + "/RoPotentialX/GenerateRoPotentialDataFromSpX";
  //CUST EXPOSURE
  public static GetR2CustExposureByCustNo = environment.FoundationR3Url + "/v1" + "/CustX/GetR2CustExposureByCustNo";
  public static GetR2CustGroupExposureByCustNo = environment.FoundationR3Url + "/v1" + "/CustX/GetR2CustGroupExposureByCustNo";

  //App Agrmnt Cancellation
  public static AddAppAgrmntCancelV2_1X = environment.losUrl + "/v2.1" + "/AppAgrmntCancelX/AddAppAgrmntCancel";
  public static AddAppAgrmntCancelV3X = environment.losUrl + "/v3" + "/AppAgrmntCancelX/AddAppAgrmntCancel";
  public static AddAppAgrmntCancelV4X = environment.losUrl + "/v4" + "/AppAgrmntCancelX/AddAppAgrmntCancel";

  // Invoice
  public static AddInvoiceX = environment.losUrl + "/v1" + "/InvoiceX/AddInvoiceX";
  public static EditInvoiceX = environment.losUrl + "/v1" + "/InvoiceX/EditInvoiceX";
  public static GetInvoiceXByVendorCodeAndPurchaseOrderHId = environment.losUrl + "/v1" + "/InvoiceX/GetInvoiceXByVendorCodeAndPurchaseOrderHId";
  public static GetAppAssetListAndInvoiceXForView = environment.losUrl + '/v1' + "/InvoiceX/GetAppAssetListAndInvoiceXForView";

  //subsidyProfitability
  public static GetListAppSubsidyProfitabilityXForViewByAppId = environment.losUrl + "/v1" + "/AppSubsidyProfitabilityX/GetAppSubsidyProfitabilityXByAppId";
  public static GetAppCollateralListAndInvoiceXForView = environment.losUrl + '/v1' + "/InvoiceX/GetAppCollateralListAndInvoiceXForView";

  //app fin data
  public static SaveAppFinDataDF = environment.losUrl + "/v1" + "/AppFinDataX/SaveAppFinDataDF";

  //#region Auto Debit Registration
  public static GetAutoDebitRegistrationById = environment.losUrl + "/v1" + "/AutoDebitRegistration/GetAutoDebitRegistrationById";
  public static GetAutoDebitRegistrationByNo = environment.losUrl + "/v1" + "/AutoDebitRegistration/GetAutoDebitRegistrationByNo";
  public static ProcessAutoDebitAccInquiry =environment.losUrl + "/v1" + "/AutoDebitRegistration/ProcessAutoDebitAccInquiry";
  public static InsertIntoAutoDebitRegistration = environment.losUrl + "/v1" + "/AutoDebitRegistration/InsertIntoAutoDebitRegistration";
  public static AutoDebitRegistrationCancellation = environment.losUrl + "/v1" + "/AutoDebitRegistration/AutoDebitRegistrationCancellation";
  public static ProcessAutoDebitRegistration = environment.losUrl + "/v1" + "/AutoDebitRegistration/ProcessAutoDebitRegistration";
  public static GetListStgAutoDebitRegisLog = environment.losUrl + "/v1" + "/AutoDebitRegistration/GetListStgAutoDebitRegisLog";
  public static ChangeAutoDebitRegisStat = environment.losUrl + "/v1" + "/AutoDebitRegistration/ChangeAutoDebitRegisStat";
  public static GetListStgAutoDebitRegisLogForView = environment.losUrl + "/v1" + "/AutoDebitRegistration/GetListStgAutoDebitRegisLogForView";
  //#endregion

  public static GetInsuranceDataByAppAssetIdXForView = environment.losUrl + "/v1" + "/AppInsX/GetInsDataByAppAssetIdForView";
  public static GetAssetCategoryNameByAssetCategoryCode = environment.losUrl + "/v1" + "/AppInsX/GetAssetCategoryNameByAssetCategoryCode";

  //TaskReassignment
  public static TaskReassignmentApproval = environment.losUrl + "/v1" + "/ApprovalX/TaskReassignmentApproval";
  //PROD HO 
  public static ProdHOApproval = environment.losUrl + "/v1" + "/ApprovalX/ProdHOApproval";

  //prod offering
  public static ProdOfferingApproval = environment.losUrl + "/v1" + "/ApprovalX/ProdOfferingApproval";
  // DigitalizationX
  public static GetLatestThirdPartyRsltHByTrxNoAndSvcTypeCodeX = environment.FoundationR3Url + "/v1" + "/DigitalizationX/GetLatestThirdPartyRsltHByTrxNoAndSvcTypeCodeX";


  //CHANGES
  public static GetListCustDocFileByCustId = environment.FoundationR3Url + "/v1" + "/CustDocFile/GetListCustDocFileByCustId";
  public static SaveCustDocFile = environment.FoundationR3Url + "/v2" + "/Cust/SaveCustDocFile";
  public static PefindoSmartSearchV2 = environment.FoundationR3Url + "/v2" + "/Pefindo/PefindoSmartSearch";
  //public static PefindoSmartSearchV2XY = environment.FoundationR3UrlXY + "/v2" + "/Pefindo/PefindoSmartSearch";
  public static AddTrxSrcDataForPefindoMultiResultV2 = environment.FoundationR3Url + "/v2" + "/Digitalization/AddTrxSrcDataForPefindoMultiResult";
  //public static AddTrxSrcDataForPefindoMultiResultV2XY = environment.FoundationR3UrlXY + "/v2" + "/Digitalization/AddTrxSrcDataForPefindoMultiResult";
  public static AddTrxSrcDataForPefindo = environment.FoundationR3Url + "/v1" + "/Digitalization/AddTrxSrcDataForPefindo";
  public static AddTrxSrcDataForPefindoV2 = environment.FoundationR3Url + "/v2" + "/Digitalization/AddTrxSrcDataForPefindo";
  public static SaveCustThirdPartyTrxNo = environment.FoundationR3Url + "/v2" + "/Cust/SaveCustThirdPartyTrxNo";
  public static GenerateTransactionNoFromRedis = environment.FoundationR3Url + "/v1" + "/MasterSequence/GenerateTransactionNoFromRedis";
  public static AddTrxScrDataForAsliRi = environment.FoundationR3Url + "/v1" + "/IntegratorAsliRi/AddTrxSrcDataForAsliRi";
  public static UploadConsentTrustingSocialV21 = environment.FoundationR3Url + "/v2.1" + "/ThirdPartyRslt/UploadConsentTrustingSocial";
  public static GetFirstRequestedThirdPartyRsltHByTrxNoAndSvcTypeCode = environment.FoundationR3Url + "/v1" + "/ThirdPartyRslt/GetFirstRequestedThirdPartyRsltHByTrxNoAndSvcTypeCode";
  public static AddTrxSrcDataForTrustingSocial = environment.FoundationR3Url + "/v1" + "/Digitalization/AddTrxSrcDataForTrustingSocial";
  public static AddTrxSrcDataForTrustingSocialV2 = environment.FoundationR3Url + "/v2" + "/Digitalization/AddTrxSrcDataForTrustingSocial";
  public static GetIncomeGradeRange = environment.FoundationR3Url + "/v1" + "/IncomeGradingVerification/GetIncomeGradeRange";
  public static GetTrxSrcDataForAsliRi = environment.FoundationR3Url + "/v1" + "/IntegratorAsliRi/GetTrxResultDataForAsliRi";
  public static GetListThirdPartyTrustingSocialByTrxNo = environment.FoundationR3Url + "/v1" + "/ThirdPartyRslt/GetListThirdPartyTrustingSocialByTrxNo";
  public static EditSimpleLeadCustTypeUpdate = environment.losUrl + "/v1" + "/LeadCustX/EditSimpleLeadCustTypeUpdate";
  //public static EditSimpleLeadCustTypeUpdate = environment.losUrl + "/v1" + "/LeadCust/EditSimpleLeadCustTypeUpdate";
  public static GetListReqVerificationTypeForAsliRi = environment.FoundationR3Url + "/v1" + "/IntegratorAsliRi/GetListReqVerificationType";
  //public static GetListReqVerificationTypeForAsliRiX = environment.FoundationR3UrlX + "/v1" + "/IntegratorAsliRi/GetListReqVerificationType";
  public static GetListCustGrpForCustViewById = environment.losUrl +"/v1" + "/CustGrp/GetListCustGrpForCustViewById";
}
