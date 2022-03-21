import { environment } from "environments/environment";

// URL" API di concat dengan environment url + version + api path
// kecuali: API" yang di pakai di UC". contoh: GetPagingObjectBySQL, DeleteFromPaging, Approval CreateNewRFA

export class URLConstant {
  // NOTIFICATION HUB
  public static WebSocketUrl = environment.FoundationR3Url + "/Notificationhub";
  public static GetListNotificationHByRefUserId = environment.FoundationR3Url + "/v1" + "/NotificationH/GetListNotificationHByRefUserId";

  //WORKFLOW (LEWAT FOUNDATION)
  public static ResumeWorkflow = environment.FoundationR3Url + "/v1" + "/Workflow/ResumeWorkflow"

  // ASSET
  public static GetListKeyValueByCode = environment.FoundationR3Url + "/v1" + "/AssetType/GetListKeyValueByCode";
  public static GetAssetTypeListKeyValueActiveByCode = environment.FoundationR3Url + "/v1" + "/AssetType/GetListKeyValueActiveByCode";
  public static GetAssetTypeByCode = environment.FoundationR3Url + "/v1" + "/AssetType/GetAssetTypeByCode";
  public static GetMostSerialNoAssetTypeByListAssetTypeCode = environment.FoundationR3Url + "/v1" + "/AssetType/GetMostSerialNoAssetTypeByListAssetTypeCode";
  public static GetListAssetTypeByListAssetTypeCodes = environment.FoundationR3Url + "/v1" + "/AssetType/GetListAssetTypeByListAssetTypeCodes";

  // APPROVAL
  public static GetApprovalScreenViewInfo = environment.FoundationR3Url + "/v1" + "/Approval/GetApprovalScreenViewInfo";

  // THINGS TO DO
  public static GetListWfTaskListByUsernameAndRoleCodeAndOfficeCodeForThingsToDo = "ServiceTask/GetListWfTaskListByUsernameAndRoleCodeAndOfficeCodeForThingsToDo";
  public static GetThingsToDoByRole = environment.FoundationR3Url + "/v1" + "/ThingsToDo/GetThingsToDoByRole";

  // New Application
  public static AddNewApplication = environment.losUrl + "/v1" + "/Application/AddNewApplication";
  public static AddNewApplicationV2 = environment.losUrl + "/v2" + "/Application/AddNewApplication";
  public static AddNewApplicationFromCopy = environment.losUrl + "/v1" + "/Application/AddNewApplicationFromCopy";
  public static AddNewApplicationFromCopyV2 = environment.losUrl + "/v2.2" + "/Application/AddNewApplicationFromCopy";
  public static AddNewApplicationOplFromCopy = environment.losUrl + "/v1" + "/Application/AddNewApplicationOplFromCopy";

  // APP Application
  public static AddAppFromCopyCancledApp = environment.losUrl + "/v1" + "/Application/AddAppFromCopyCancledApp";
  public static AddAppFromCopyCancledAppV2 = environment.losUrl + "/v2" + "/Application/AddAppFromCopyCancledApp";
  public static AddAppMaindata = environment.losUrl + "/v1" + "/Application/AddAppMainData";
  public static GetPurchaseOrderExpDt = environment.losUrl + "/v1" + "/Application/GetPurchaseOrderExpDt";
  public static GetAppById = environment.losUrl + "/v1" + "/Application/GetAppById";
  public static GetAppByAppNo = environment.losUrl + "/v1" + "/Application/GetAppByAppNo";
  public static GetAppDetailForTabAddEditAppById = environment.losUrl + "/v1" + "/Application/GetAppDetailForTabAddEditAppById";
  public static GetAppDetailForAppTabById = environment.losUrl + "/v1" + "/Application/GetAppDetailForAppTabById";
  public static AddAppFromLead = environment.losUrl + "/v1" + "/Application/AddAppFromLead";
  public static AddAppFromSimpleLead = environment.losUrl + "/v1" + "/Application/AddAppFromSimpleLead";
  public static AddAppFromSimpleLeadV2 = environment.losUrl + "/v2" + "/Application/AddAppFromSimpleLead";
  public static DataTableNAP = environment.losUrl + "/v1" + "/Application/DataTableNAP";
  public static GetRuleFeeAndInsFixedNAP = environment.losUrl + "/v1" + "/Application/GetRuleFeeAndInsFixedNAP";
  public static GetAppAndAppCustDetailByAgrmntId = environment.losUrl + "/v1" + "/Application/GetAppAndAppCustDetailByAgrmntId";
  public static SubmitNAP = environment.losUrl + "/v1" + "/Application/SubmitNAP";
  public static SubmitNAPV2 = environment.losUrl + "/v2" + "/Application/SubmitNAP";
  public static SubmitNapCustMainData = environment.losUrl + "/v1" + "/Application/SubmitNAPCustMainData";
  public static SubmitNapCustMainDataV2 = environment.losUrl + "/v2.1" + "/Application/SubmitNAPCustMainData";
  public static CreateWorkflowDuplicateCheck = environment.losUrl + "/v1" + "/Application/CreateWorkflowDuplicateCheck";
  public static AddEditAppCF2W = environment.losUrl + "/v1" + "/Application/AddEditAppCF2W";
  public static DataTableFeeAndInsNAP = environment.losUrl + "/v1" + "/Application/DataTableFeeAndInsNAP";
  public static UpdateAppStepByAppId = environment.losUrl + "/v1" + "/Application/UpdateAppStepByAppId";
  public static CopyCancelledApp = environment.losUrl + "/v1" + "/Application/CopyCancelledApp";
  public static CopyCancelledAppV2 = environment.losUrl + "/v2" + "/Application/CopyCancelledApp";
  public static CopyCancelledAppForMainData = environment.losUrl + "/v1" + "/Application/CopyCancelledAppForMainData";
  public static CopyCancelledAppForMainDataV2 = environment.losUrl + "/v2.1" + "/Application/CopyCancelledAppForMainData";
  public static CopyCancelledAppForMainDataMultiBL = environment.losUrl + "/v1" + "/Application/CopyCancelledAppForMainDataMultiBL";
  public static CopyCancelledAppForMainDataMultiBLV2 = environment.losUrl + "/v2.1" + "/Application/CopyCancelledAppForMainDataMultiBL";
  public static GetSummaryAppByAppId = environment.losUrl + "/v1" + "/Application/GetSummaryAppByAppId";
  public static GetAppSummaryByAppId = environment.losUrl + "/v1" + "/Application/GetAppSummaryByAppId";
  public static AddAppFromMou = environment.losUrl + "/v1" + "/Application/AddAppFromMou";
  public static CheckMouCustIntegrator = environment.losUrl + "/v1" + "/MouCust/CheckMouCustIntegrator";
  public static AddNap1FromLead = environment.losUrl + "/v1" + "/Application/AddNap1FromLead";
  public static AddNap1FromLeadV2 = environment.losUrl + "/v2" + "/Application/AddNap1FromLead";
  public static UpdateAppNumOfAsset = environment.losUrl + "/v2" + "/Application/UpdateAppNumOfAsset";

  public static CalculatePlafondAgrmnt = environment.losUrl + "/v1" + "/ApplicationX/CalculatePlafondAgrmnt";
  public static CheckIsMouFreeze = environment.losUrl + "/v1" + "/MouCust/CheckIsMouFreeze";
  //App Loan Purpose
  public static AddAppLoanPurpose = environment.losUrl + "/v1" + "/AppLoanPurpose/AddAppLoanPurpose";
  public static EditAppLoanPurpose = environment.losUrl + "/v1" + "/AppLoanPurpose/EditAppLoanPurpose";
  public static GetListAppLoanPurposeByAppId = environment.losUrl + "/v1" + "/AppLoanPurpose/GetListAppLoanPurposeByAppId";
  public static GetAppLoanPurposeByAppLoanPurposeId = environment.losUrl + "/v1" + "/AppLoanPurpose/GetAppLoanPurposeByAppLoanPurposeId";
  public static DeleteAppLoanPurpose = environment.losUrl + "/v1" + "/AppLoanPurpose/DeleteAppLoanPurpose";
  public static CheckFinAmtAppLoanPurpose = environment.losUrl + "/v1" + "/AppLoanPurpose/CheckFinAmtAppLoanPurpose";
  public static CheckFinAmtAppLoanPurposeX = environment.losUrl + "/v1" + "/AppLoanPurposeX/CheckFinAmtAppLoanPurpose";
  public static GetAppLoanPurposeByAppIdSupplCode = environment.losUrl + "/v1" + "/AppLoanPurpose/GetAppLoanPurposeByAppIdSupplCode";
  public static GetAppLoanPurposeVendorAndVendorEmpByAppId = environment.losUrl + "/v1" + "/AppLoanPurpose/GetAppLoanPurposeVendorAndVendorEmpByAppId";

  // App Collateral
  public static GetAppCollateralRegistrationByAppId = environment.losUrl + "/v1" + "/AppCollateralRegistration/GetAppCollateralRegistrationByAppId";
  public static GetAppCollateralRegistrationByAppAssetId = environment.losUrl + "/v1" + "/AppCollateralRegistration/GetAppCollateralRegistrationByAppAssetId";
  public static GetAppCollateralRegistrationByAgrmntId = environment.losUrl + "/v1" + "/AppCollateralRegistration/GetAppCollateralRegistrationByAgrmntId";
  public static GetCollateralByFullAssetCodeAssetTypeSerialNoForAppCollateral = environment.FoundationR3Url + "/v1" + "/Collateral/GetCollateralByFullAssetCodeAssetTypeSerialNoForAppCollateral";

  // App Asset
  public static GetAppAssetListByAppIdForCommision = "/AppAsset/GetAppAssetListByAppIdForCommision";
  public static GetListAppAssetForCopyByAppId = environment.losUrl + "/v1" + "/AppAsset/GetListAppAssetForCopyByAppId";
  public static GetListOfAsset = environment.losUrl + "/v1" + "/AppAsset/GetListOfAsset";
  public static GetAppAssetByAppAssetIdWithSerialNoDefinition = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetByAppAssetIdWithSerialNoDefinition";
  public static GetAppAssetByAppAssetId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetByAppAssetId";
  public static CopyAppAsset = environment.losUrl + "/v1" + "/AppAsset/CopyAppAsset";
  public static CalculateTotalAssetPriceAndDownPayment = environment.losUrl + "/v1" + "/AppAsset/CalculateTotalAssetPriceAndDownPayment";
  public static GetListAppAssetByListAppAssetId = environment.losUrl + "/v1" + "/AppAsset/GetListAppAssetByListAppAssetId";

  // App Asset Suppl Emp
  public static GetListAppAssetSupplEmpByListAppAssetId = environment.losUrl + "/v1" + "/AppAssetSupplEmp/GetListAppAssetSupplEmpByListAppAssetId";
  public static GetAppAssetSupplEmpByAppAssetIdAndMrSupplEmpPositionCode = environment.losUrl + "/v1" + "/AppAssetSupplEmp/GetAppAssetSupplEmpByAppAssetIdAndMrSupplEmpPositionCode";
  public static GetAppAssetSupplEmpByAppAssetIdAndCode = environment.losUrl + "/v1" + "/AppAssetSupplEmp/GetAppAssetSupplEmpByAppAssetIdAndCode";

  // App Referantor
  public static AddAppReferantor = environment.losUrl + "/v1" + "/AppReferantor/AddAppReferantor";
  public static AddListAppReferantor = environment.losUrl + "/v1" + "/AppReferantor/AddListAppReferantor";
  public static EditAppReferantor = environment.losUrl + "/v1" + "/AppReferantor/EditAppReferantor";
  public static EditListAppReferantor = environment.losUrl + "/v1" + "/AppReferantor/EditListAppReferantor";
  public static DeleteAppReferantor = environment.losUrl + "/v1" + "/AppReferantor/DeleteAppReferantor";
  public static DeleteListAppReferantor = environment.losUrl + "/v1" + "/AppReferantor/DeleteListAppReferantor";
  public static GetAppReferantorByAppReferantorId = environment.losUrl + "/v1" + "/AppReferantor/GetAppReferantorByAppReferantorId";
  public static GetAppReferantorByAppId = environment.losUrl + "/v1" + "/AppReferantor/GetAppReferantorByAppId";
  public static GetListAppReferantorWithDetailByAppId = environment.losUrl + "/v1" + "/AppReferantor/GetListAppReferantorWithDetailByAppId";
  public static VendorCategoryAgencyCompany = "AGENCY_COMPANY";
  public static VendorCategoryAgencyPersonal = "AGENCY_PERSONAL";

  // App Cross
  public static EditAppAddAppCross = environment.losUrl + "/v1" + "/Application/EditAppAddAppCross";
  public static EditAppAddAppCrossX = environment.losUrl + "/v1" + "/ApplicationX/EditAppAddAppCross";
  public static GetAppCrossByCrossAgrmntNo = "/AppCross/GetAppCrossByCrossAgrmntNo";
  public static DeleteAppCross = environment.losUrl + "/v1" + "/AppCross/DeleteAppCross";
  public static GetListAppCross = environment.losUrl + "/v1" + "/AppCross/GetListAppCross";
  public static GetListAppCrossForView = environment.losUrl + "/v1" + "/AppCross/GetListAppCrossForView";

  public static AddListAppCross = "/AppCross/AddListAppCross";

  // App Fctr
  public static GetAppFctrByAppId = environment.losUrl + "/v1" + "/AppFctr/GetAppFctrByAppId";

  // Ref App Src
  public static GetListKvpActiveRefAppSrc = environment.losUrl + "/v1" + "/RefAppSrc/GetListKvpActiveRefAppSrc";
  public static GetListKvpRefAppSrcForAppOrLead = environment.losUrl + "/v1" + "/RefAppSrc/GetListKvpRefAppSrcForAppOrLead";
  public static GetListKvpRefAppSrc = environment.losUrl + "/v1" + "/RefAppSrc/GetListKvpRefAppSrc";

  //Asset Master
  public static GetAssetMasterTypeByFullAssetCode = environment.FoundationR3Url + "/v1" + "/AssetMaster/GetAssetMasterTypeByFullAssetCode";

  // App Commission
  public static AddOrEditAppCommissionData = environment.losUrl + "/v1" + "/AppCommission/AddOrEditAppCommissionData";
  public static SubmitAppCommissionData = environment.losUrl + "/v1" + "/AppCommission/SubmitAppCommissionData";
  public static SubmitAppCommissionDataV2_1 = environment.losUrl + "/v2.1" + "/AppCommission/SubmitAppCommissionData";
  public static SubmitReturnHandlingCommRsvFund = environment.losUrl + "/v1" + "/AppCommission/SubmitReturnHandlingCommRsvFund";
  public static SubmitReturnHandlingCommRsvFundV2 = environment.losUrl + "/v2" + "/AppCommission/SubmitReturnHandlingCommRsvFund";
  public static GetAppCommissionDataForEditByAppId = environment.losUrl + "/v1" + "/AppCommission/GetAppCommissionDataForEditByAppId";
  public static DeleteAppCommissionData = environment.losUrl + "/v1" + "/AppCommission/DeleteAppCommissionData";
  public static GetAppCommissionRule = environment.losUrl + "/v1" + "/AppCommission/GetAppCommissionRule";
  public static GetAppCommissionRuleV2 = environment.losUrl + "/v2" + "/AppCommission/GetAppCommissionRule";
  public static GetAppCommissionTaxAndCalcGrossYield = environment.losUrl + "/v1" + "/AppCommission/GetAppCommissionTaxAndCalcGrossYield";
  public static GetAppCommissionTaxAndCalcGrossYieldV2 = environment.losUrl + "/v2" + "/AppCommission/GetAppCommissionTaxAndCalcGrossYield";
  public static GetAppCommissionTaxAndCalcGrossYieldV2_1 = environment.losUrl + "/v2.1" + "/AppCommission/GetAppCommissionTaxAndCalcGrossYield";
  public static CalCulateGrossYield = environment.losUrl + "/v1" + "/AppCommission/CalCulateGrossYield";

  public static GetRefOfficeByOfficeCode = environment.FoundationR3Url + "/v1" + "/RefOffice/GetRefOfficeByOfficeCode";
  public static GetListCenterGrpMemberByCenterGrpCode = environment.FoundationR3Url + "/v1" + "/CenterGrpOfficeMbr/GetListCenterGrpMemberByCenterGrpCode";

  // public static GetAppDetailForAppTabById = environment.losUrl + "/v1" + "/Application/GetAppDetailForAppTabById";
  // public static AddAppFromLead = environment.losUrl + "/v1" + "/Application/AddAppFromLead";

  // App Asset
  public static GetAppAssetForDealerDataByAppId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetForDealerDataByAppId";
  public static GetAppAssetForDealerDataByAppAssetId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetForDealerDataByAppAssetId";
  public static GetCurrentProdOfferingDByProdOfferingCodeAndRefProdCompntCode = environment.losUrl + "/v1" + "/ProductOffering/GetCurrentProdOfferingDByProdOfferingCodeAndRefProdCompntCode"
  public static GetProdOfferingDByProdOfferingHIdAndCompCode = environment.losUrl + "/v1" + "/ProductOffering/GetProdOfferingDByProdOfferingHIdAndCompCode";
  // App Commission
  public static GetAppCommissionDataDetailByAppId = environment.losUrl + "/v1" + "/AppCommission/GetAppCommissionDataDetailByAppId";

  // App Referantor
  public static GetAppReferantorForAppsData = environment.losUrl + "/v1" + "/AppReferantor/GetAppReferantorForAppsData";

  //Asset Accessory
  public static GetAssetAccessoryByCode = environment.FoundationR3Url + "/v1" + "/AssetAccessory/GetAssetAccessoryByCode";

  //Asset Master
  public static GetAssetMasterForLookup = environment.FoundationR3Url + "/v1" + "/AssetMaster/GetAssetMasterForLookup";

  //GENERAL SETTING
  public static GetBusinessDt = "/v1/GeneralSetting/GetBusinessDate";
  public static AddGeneralSetting = "/v1/GeneralSetting/AddGeneralSetting";
  public static EditGeneralSetting = "/v1/GeneralSetting/EditGeneralSetting";
  public static GetGeneralSettingPaging = "/v1/GeneralSetting/GetGeneralSettingPaging";
  public static GetGeneralSettingById = "/v1/GeneralSetting/GetGeneralSettingById";
  public static GetGeneralSettingValue = "/v1/GeneralSetting/GetGeneralSettingValue";
  public static GetGeneralSettingByCode = environment.FoundationR3Url + "/v1" + "/GeneralSetting/GetGeneralSettingByCode";
  public static GetGeneralSettingValueByCode = environment.FoundationR3Url + "/v1" + "/GeneralSetting/GetGeneralSettingValueByCode";
  public static GetListGeneralSettingByListGsCode = environment.FoundationR3Url + "/v1" + "/GeneralSetting/GetListGeneralSettingByListGsCode";

  //REF OFFICE
  public static GetRefOfficeObj = "/RefOffice/GetRefOfficeObj";
  public static GetRefOfficeActiveAndNonVirtualKeyValue = "/RefOffice/GetRefOfficeActiveAndNonVirtualKeyValue";
  public static GetAllRefOffice = "/RefOffice/GetAllRefOffice";
  public static GetHeadOffice = environment.FoundationR3Url + "/v1" + "/RefOffice/GetHeadOffice";
  public static GetListUpperHierarchyRefOfficeByRefOrgId = "/RefOffice/GetListUpperHierarchyRefOfficeByRefOrgId";
  public static AddRefOffice = "/RefOffice/AddRefOffice";
  public static EditRefOffice = "/RefOffice/EditRefOffice";
  public static DeleteRefOffice = "/RefOffice/DeleteRefOffice";
  public static GetCenterGrpByCenterGrpTypeCode = "/RefOffice/GetCenterGrpByCenterGrpCode";
  public static GetListOfficeCenterGrp = "/RefOffice/GetListOfficeCenterGrp";
  public static AddCenterGroupOfficeMember = "RefOffice/AddCenterGroupOfficeMember";
  public static DeleteCenterGroupOfficeMember = "/RefOffice/DeleteCenterGroupOfficeMember";
  public static GetListKvpActiveRefOffice = environment.FoundationR3Url + "/v1" + "/RefOffice/GetListKvpActiveRefOffice";
  public static GetListRefOffice = "/RefOffice/GetListRefOffice";
  public static GetListActiveRefOffice = environment.FoundationR3Url + "/v1" + "/RefOffice/GetListKeyValueActiveByCode";
  public static GetListKvpActiveRefOfficeForPaging = environment.FoundationR3Url + "/v1" + "/RefOffice/GetListKvpActiveRefOfficeForPaging";
  public static GetListKvpActiveRefOfficeIdForPaging = environment.FoundationR3Url + "/v1" + "/RefOffice/GetListKvpActiveRefOfficeIdForPaging";

  //REF OFFICE AREA
  public static GetAllListArea = "/RefOfficeArea/GetAllListArea";
  public static GetRefOfficeAreaPaging = "/RefOfficeArea/GetRefOfficeAreaPaging";
  public static GetRefArea = "/RefOfficeArea/GetRefArea";
  public static AddRefOfficeArea = "/RefOfficeArea/AddRefOfficeArea";
  public static EditRefOfficeArea = "/RefOfficeArea/EditRefOfficeArea";
  public static DeleteRefOfficeArea = "/RefOfficeArea/DeleteRefOfficeArea";
  public static CheckDuplAreaCode = "/RefOfficeArea/CheckDuplAreaCode";
  // public static GetListKvpActiveRefOfficeArea = "/RefOfficeArea/GetListKvpActiveRefOfficeArea";

  //REF REASON
  public static GetListActiveRefReason = environment.FoundationR3Url + "/v1" + "/RefReason/GetListActiveRefReason";
  public static GetListActiveRefReasonByRefReasonTypeCode = environment.FoundationR3Url + "/v1" + "/RefReason/GetListKeyValueByCode";

  // AppAgrmntCancel
  public static AddAppAgrmntCancel = environment.losUrl + "/v1" + "/AppAgrmntCancel/AddAppAgrmntCancel";
  public static AddAppAgrmntCancelV2 = environment.losUrl + "/v2" + "/AppAgrmntCancel/AddAppAgrmntCancel";
  public static AddAppAgrmntCancelV2_1 = environment.losUrl + "/v2.1" + "/AppAgrmntCancel/AddAppAgrmntCancel";
  public static AddAppAssetCancel = environment.losUrl + "/v1" + "/AppAgrmntCancel/AddAppAssetCancel";

  //ORGANIZATION
  public static GetRefOrg = "/OrganizationDefinition/GetRefOrg";
  public static EditRefOrgWithOldParentId = "/OrganizationDefinition/EditRefOrgWithOldParentId";
  public static EditRefOrg = "/OrganizationDefinition/EditRefOrg";
  public static DeleteRefOrg = "/OrganizationDefinition/DeleteRefOrg";
  public static GetListAllRefOrg = "/OrganizationDefinition/GetListAllRefOrg";
  public static AddRefOrg = "/OrganizationDefinition/AddRefOrg";
  public static GetRefOrgPaging = "/OrganizationDefinition/GetRefOrgPaging";
  public static GetAllRefBizUnit = "/OrganizationDefinition/GetAllRefBizUnit";
  public static GetOrgJobTitleByMdlStruc = "/OrganizationDefinition/GetOrgJobTitleByMdlStruc";
  public static GetRefBizUnitByOffice = "/OrganizationDefinition/GetRefBizUnitByOffice";
  public static GetAllOrgMdl = "/OrganizationDefinition/GetAllOrgMdl";
  public static GetAllActiveOrgMdlByRefOrgId = "/OrganizationDefinition/GetAllActiveOrgMdlByRefOrgId";
  public static GetOrgMdlPaging = "/OrganizationDefinition/GetOrgMdlPaging";
  public static DeleteOrgMdl = "/OrganizationDefinition/DeleteOrgMdl";
  public static EditOrgMdl = "/OrganizationDefinition/EditOrgMdl";
  public static AddOrgMdl = "/OrganizationDefinition/AddOrgMdl";
  public static GetOrgMdl = "/OrganizationDefinition/GetOrgMdl";
  public static GetOrgMdlByOrgMdlId = "/OrganizationDefinition/GetOrgMdlByOrgMdlId";
  public static GetAllRefBizUnitKeyValuePair = "/OrganizationDefinition/GetAllRefBizUnitKeyValuePair";
  public static DeleteOrgMdlStruc = "/OrganizationDefinition/DeleteOrgMdlStruc";
  public static AddOrgMdlStruc = "/OrganizationDefinition/AddOrgMdlStruc";
  public static EditOrgMdlStruc = "/OrganizationDefinition/EditOrgMdlStruc";
  public static GetOrgMdlStruc = "/OrganizationDefinition/GetOrgMdlStruc";
  public static GetOrgMdlStrucPaging = "/OrganizationDefinition/GetOrgMdlStrucPaging";
  public static GetOrgMdlStrucById = "/OrganizationDefinition/GetOrgMdlStrucById";

  //REF-JOB-TITLE
  public static GetRefJobTitle = "/OrganizationDefinition/GetRefJobTitlePaging";
  public static AddRefJobTitle = "/OrganizationDefinition/AddRefJobTitle";
  public static EditRefJobTitle = "/OrganizationDefinition/EditRefJobTitle";
  public static DeleteRefJobTitle = "/OrganizationDefinition/DeleteRefJobTitle";
  public static GetJobPositionLvl = "/OrganizationDefinition/GetJobPositionLvl";
  public static GetRefJobTitleById = "/OrganizationDefinition/GetRefJobTitleByRefJobTitleId";

  //ORG JOB TITLE
  public static GetOrgJobTitlePaging = "/OrganizationDefinition/GetOrgJobTitlePaging";
  public static AddOrgJobTitle = "/OrganizationDefinition/AddOrgJobTitle";
  public static EditOrgJobTitle = "/OrganizationDefinition/EditOrgJobTitle";
  public static DeleteOrgJobTitle = "/OrganizationDefinition/DeleteOrgJobTitle";
  public static GetOrgJobTitleByOrgJobTitleId = "/OrganizationDefinition/GetOrgJobTitleByOrgJobTitleId";

  //REF-BANK
  public static GetBankPaging = "/RefBank/GetRefBankPaging";
  public static GetBank = "/RefBank/GetBank";
  public static EditRefBank = "/RefBank/EditRefBank";
  public static AddRefBank = "/RefBank/AddRefBank";
  public static DeleteRefBank = "/RefBank/DeleteRefBank";
  public static GetBankByBankCode = "/RefBank/GetBankByBankCode";
  public static GetRefBankByBankCodeAsync = environment.FoundationR3Url + "/v1" + "/RefBank/GetRefBankByBankCodeAsync";
  public static GetRefBankByRefBankIdAsync = environment.FoundationR3Url + "/v1" + "/RefBank/GetRefBankByRefBankIdAsync";

  //REF-EMP
  public static GetListEmployee = "/RefEmp/GetRefEmpPaging";
  public static GetRefEmployeeById = "/RefEmp/GetEmp"
  public static AddRefEmp = "/RefEmp/AddRefEmp";
  public static EditRefEmp = "/RefEmp/EditRefEmp";
  public static DeleteRefEmployee = "/RefEmp/DeleteRefEmp";
  public static AddEmpBankAcc = "/EmpBankAcc/AddEmpBankAcc";
  public static GetEmpBankAccByRefEmpId = "/EmpBankAcc/GetEmpBankAccByRefEmpId";
  public static AddRefEmpAndEmpBankAcc = "/RefEmp/AddRefEmpAndEmpBankAcc";
  public static EditRefEmpAndEmpBankAcc = "/RefEmp/EditRefEmpAndEmpBankAcc";
  public static DeleteRefEmpAndEmpBankAcc = "/RefEmp/DeleteRefEmpAndEmpBankAcc";
  public static GetListEmployeebyRefEmpId = "/EmpPosition/GetListEmployeebyRefEmpId";
  public static GetEmpListByOfficeIdAndIsActive = "/RefEmp/GetEmpListByOfficeIdAndIsActive";
  public static GetListRefEmpByGsValueandOfficeCode = environment.FoundationR3Url + "/v1" + "/RefEmp/GetListRefEmpByGsValueandOfficeCode";
  public static GetRefEmpByEmpNo = "/RefEmp/GetRefEmpByEmpNo";
  public static GetRefEmpSpvByEmpNo = environment.FoundationR3Url + "/v1" + "/RefEmp/GetRefEmpSpvByEmpNo";
  public static GetListRefEmpByGsValueandOfficeId = environment.FoundationR3Url + "/v1" + "/RefEmp/GetListRefEmpByGsValueandOfficeId";
  public static GetRefEmpForLookupEmployee = environment.FoundationR3Url + "/v1" + "/RefEmp/GetRefEmpForLookupEmployee";
  public static GetRefEmpForLookupByUsername = environment.FoundationR3Url + "/v1" + "/RefEmp/GetRefEmpForLookupByUsername";

  //EMP_POSITION
  public static GetEmpPositionPaging = "/EmpPosition/GetEmpPositionPaging";
  public static GetEmpByEmpPositionId = "/EmpPosition/GetEmpByEmpPositionId";
  public static AddEmpPosition = "/EmpPosition/AddEmpPosition";
  public static EditEmpPosition = "/EmpPosition/EditEmpPosition";
  public static DeleteEmpPosition = "/EmpPosition/DeleteEmpPosition";
  public static GetListUserEmployee = "/EmpPosition/GetListUserEmployee";

  //REF-USER
  public static GetRefUserPaging = "/UserManagement/GetRefUserPaging";
  public static AddRefUser = "/UserManagement/AddRefUser";
  public static EditRefUser = "/UserManagement/EditRefUser";
  public static ChangePassword = "/UserManagement/ChangePassword";
  public static GetRefUser = "/UserManagement/GetRefUser";
  public static GetUserByUsername = "/UserManagement/GetUserByUsername";
  public static ValidatePwd = "/UserManagement/ValidatePwd";
  public static GetCountRefUserByRefEmpId = "/UserManagement/GetCountRefUserByRefEmpId";
  public static ResetPassword = "/UserManagement/ResetPassword";
  public static GetRefUserByUsername = environment.FoundationR3Url + "/v1" + "/RefUser/GetRefUserByUsername";
  public static GetUserEmpByUsername = environment.FoundationR3Url + "/v1" + "/RefUser/GetUserEmpByUsername";
  public static GetRefUserByResetCode = environment.FoundationR3Url + "/v1" + "/RefUser/GetRefUserByResetCode";
  public static ResetPasswordByUsername = environment.FoundationR3Url + "/v1" + "/RefUser/ResetPasswordByUsername";
  public static ChangePasswordRefUserByUsername = environment.FoundationR3Url + "/v1" + "/RefUser/ChangePasswordRefUserByUsername";

  //REF-ROLE
  public static GetRefRolePaging = "/UserManagement/GetRefRolePaging";
  public static AddRefRole = "/UserManagement/AddRefRole";
  public static EditRefRole = "/UserManagement/EditRefRole";
  public static DeleteRefRole = "/UserManagement/DeleteRefRole";
  public static GetRefRoleByRefRoleId = "/RefRole/GetRefRoleByRefRoleId";
  public static GetActiveRefRoleByRefRoleId = "/RefRole/GetActiveRefRoleByRefRoleId";
  public static GetRefRole = "/RefRole/GetRefRole";
  public static GetListDataCurrentUser = "/UserManagement/GetListDataCurrentUser";
  public static GetRefRoleByEmpPositionId = "/RefRole/GetRefRoleByEmpPositionId";
  public static EditUserTitleRole = "/UserManagement/EditUserTitleRole";
  public static AddUserTitleRole = "/UserManagement/AddUserTitleRole";
  public static AssignRoleToUsers = "/UserManagement/AssignRoleToUsers";
  public static GetUserTitleRoleByEmpPositionIdAndRefRoleId = "/UserManagement/GetUserTitleRoleByEmpPositionIdAndRefRoleId";

  //REF-PAY
  public static GetListLKvpActiveRefPayFreq = "/RefPayFreq/GetListLKvpActiveRefPayFreq";
  public static GetListActiveRefPayFreq = environment.FoundationR3Url + "/v1" + "/RefPayFreq/GetListActiveRefPayFreq";
  public static GetListRefPayFreqForMou = environment.FoundationR3Url + "/v1" + "/RefPayFreq/GetListRefPayFreqForMou";


  //ZIPCODE
  public static GetRefZipcodePaging = "/RefZipcode/GetRefZipcodePaging";
  public static GetRefZipCode = "/RefZipcode/GetRefZipcode";
  public static GetRefProvDistrictObj = "/RefProvDistrict/GetRefProvDistrict";
  public static EditRefZipcode = "/RefZipcode/EditRefZipcode";
  public static AddRefZipcode = "/RefZipcode/AddRefZipcode";
  public static DeleteRefZipcode = "/RefZipcode/DeleteRefZipCode";
  public static GetOfficeZipcodeMemberAddPaging = "/RefZipcode/GetOfficeZipcodeMemberAddPaging";

  //OFFICE ZIPCODE MEMBER
  public static GetOfficeZipCodeMemberPaging = "/OfficeZipcodeMember/GetOfficeZipCodeMemberPaging";
  public static GetRefOfficeZipcodePaging = "/OfficeZipcodeMember/GetRefOfficeZipcodePaging";
  public static AddOfficeZipcodeMember = "/OfficeZipcodeMember/AddOfficeZipCodeMember";
  public static DeleteOfficeZipcodeMember = "/OfficeZipcodeMember/DeleteOfficeZipcodeMember";

  //BUSINESS UNIT
  public static GetBusinessUnitPaging = "/OrganizationDefinition/GetRefBizUnitPaging";
  public static GetRefBizUnit = "/OrganizationDefinition/GetRefBizUnit";
  public static AddRefBizUnit = "/OrganizationDefinition/AddRefBizUnit";
  public static EditRefBizUnit = "/OrganizationDefinition/EditRefBizUnit";

  //REF COY
  public static GetRefCoyPaging = "/RefCoy/GetRefCoyPaging";
  public static GetRefCoy = environment.FoundationR3Url + "/v1" + "/RefCoy/GetRefCoy";
  public static EditRefCoy = "/RefCoy/EditRefCoy";
  public static GetCoyBodPaging = "/CoyBod/GetCoyBodPaging";
  public static AddCoyBod = "/CoyBod/AddCoyBOD";
  public static EditCoyBod = "/CoyBod/EditCoyBOD";
  public static DeleteCoyBod = "/CoyBod/DeleteCoyBOD";
  public static GetCoyBod = "/CoyBod/GetCoyBod";
  public static GetCommissionerPaging = "/CoyCommissioner/GetCoyCommissionerPaging";
  public static AddCoyCommissioner = "/CoyCommissioner/AddCoyCommissioner";
  public static EditCoyCommissioner = "/CoyCommissioner/EditCoyCommissioner";
  public static DeleteCoyCommissioner = "/CoyCommissioner/DeleteCoyCommissioner";
  public static GetCoyCommissioner = "/CoyCommissioner/GetCoyCommissioner";

  //REF TAX OFFICE
  public static GetAllActiveRefTaxOffice = "/RefTaxOffice/GetAllActiveRefTaxOffice";

  //REF MASTER
  public static GetRefMasterList = "/RefMaster/GetRefMasterList";
  public static GetRefMastersByCriteria = "/RefMaster/GetRefMastersByCriteria";
  public static GetRefMaster = "/RefMaster/GetRefMaster";
  public static GetRefMasterListByTypeCode = "/RefMaster/GetRefMasterListByTypeCode";
  public static GetRefMasterListKeyValuePair = "/RefMaster/GetRefMasterListKeyValuePair";
  public static AddRefMaster = "/RefMaster/AddRefMaster";
  public static EditRefMaster = "/RefMaster/EditRefMaster";
  public static GetRefMasterType = "/RefMaster/GetRefMasterType";
  public static GetRefMasterTypeKeyValueUserSetting = "/RefMaster/GetRefMasterTypeKeyValueUserSetting";
  public static DeleteRefMaster = "/RefMaster/DeleteRefMaster";
  public static GetRefMasterPaging = "/RefMaster/GetRefMasterPaging";
  public static GetRefMasterListDesc = "/RefMaster/GetRefMasterListDesc";
  public static GetRefMasterByMasterCode = environment.FoundationR3Url + "/v1" + "/RefMaster/GetRefMasterByMasterCode";
  public static GetRefMasterListKeyValueActiveByCode = environment.FoundationR3Url + "/v1" + "/RefMaster/GetListKeyValueActiveByCode"
  public static GetListActiveRefMaster = environment.FoundationR3Url + "/v1" + "/RefMaster/GetListActiveRefMaster"
  public static GetRefMasterByRefMasterTypeCode = environment.FoundationR3Url + "/v1" + "/RefMaster/GetRefMasterByRefMasterTypeCode"
  public static GetListKeyValueActiveByCodeOrderBySeqNo = environment.FoundationR3Url + "/v1" + "/RefMaster/GetListKeyValueActiveByCodeOrderBySeqNo";
  public static GetListActiveRefMasterWithMappingCodeAll = environment.FoundationR3Url + "/v1" + "/RefMaster/GetListActiveRefMasterWithMappingCodeAll";
  public static GetListRefMasterByRefMasterTypeCodes = environment.FoundationR3Url + "/v1" + "/RefMaster/GetListRefMasterByRefMasterTypeCodes";
  public static GetRefMasterByRefMasterTypeCodeAndMasterCode = environment.FoundationR3Url + "/v1" + "/RefMaster/GetRefMasterByRefMasterTypeCodeAndMasterCode";
  public static GetKvpRefMasterByRefMasterTypeCodeAndMasterCode = environment.FoundationR3Url + "/v1" + "/RefMaster/GetKvpRefMasterByRefMasterTypeCodeAndMasterCode";
  public static GetListActiveRefMasterByRefMasterTypeCode = environment.FoundationR3Url + "/v1" + "/RefMaster/GetListActiveRefMasterByRefMasterTypeCode";
  public static GetListActiveRefMasterByRefMasterTypeCodeOrderedBySeqNo = environment.FoundationR3Url + "/v1" + "/RefMaster/GetListActiveRefMasterByRefMasterTypeCodeOrderedBySeqNo";
  public static GetListActiveRefMasterByRefMasterCodeAndMappingCodes = environment.FoundationR3Url + "/v1" + "/RefMaster/GetListActiveRefMasterByRefMasterCodeAndMappingCodes";

  //REF CUST MODEL
  public static GetListKeyValueByMrCustTypeCode = environment.FoundationR3Url + "/v1" + "/RefCustModel/GetListKeyValueByMrCustTypeCode";

  //REF ATTR
  public static GetListActiveRefAttrByAttrGroup = environment.FoundationR3Url + "/v1" + "/RefAttr/GetListActiveRefAttrByAttrGroup"
  public static GetListActiveRefAttrByListAttrGroup = environment.FoundationR3Url + "/v1" + "/RefAttr/GetListActiveRefAttrByListAttrGroup"

  //REF PROV DISTRICT
  public static GetRefProvDistrictPaging = "/RefProvDistrict/GetRefProvDistrictPaging";
  public static GetRefProvDistrictByProvDistrictCode = environment.FoundationR3Url + "/v1" + "/RefProvDistrict/GetRefProvDistrictByProvDistrictCode";

  //MENU
  public static GetRefFormPaging = "/MenuManagement/GetRefFormPaging";
  public static GetAllActiveRefFormByRefRoleId = "/MenuManagement/GetAllActiveRefFormByRefRoleId";
  public static GetRefFormByRefFormId = "/MenuManagement/GetRefFormByRefFormId";
  public static EditRefForm = "/MenuManagement/EditRefForm";
  public static AddRefForm = "/MenuManagement/AddRefForm";
  public static DeleteRefForm = "/MenuManagement/DeleteRefForm";
  public static AssignRoleToForms = "/MenuManagement/AssignRoleToForms";
  public static GetAllAuthFormsByRefRoleId = "/MenuManagement/GetAllAuthFormsByRefRoleId";
  public static GetAuthByRefFormIdAndRefRoleId = "/MenuManagement/GetAuthByRefFormIdAndRefRoleId";
  public static UpdateFormFeatureAuthForm = "/MenuManagement/UpdateFormFeatureAuthForm";
  public static GetAllActiveRefFormAndPathExist = "/MenuManagement/GetAllActiveRefFormAndPathExist";
  public static GetAllActiveRefForm = "/MenuManagement/GetAllActiveRefForm";
  public static LogoutAuth = "/v1" + "/Authenticate/Logout";

  //FORM FEATURE
  public static GetListRefFeature = "/RefFeature/GetListRefFeature";
  public static GetRefFeatureByComponent = "/RefFeature/GetRefFeatureByComponent";

  //HOLIDAY
  public static GetAllActiveHolidaySchmH = "/Holiday/GetAllActiveHolidaySchmH";
  public static GetHolidayPaging = "/Holiday/GetHolidayPaging";
  public static AddHolidaySchmH = "/Holiday/AddHolidaySchmH";
  public static AddHolidaySchmD = "/Holiday/AddHolidaySchmD";
  public static AddHolidaySchmDUntilYear = "/Holiday/AddHolidaySchmDUntilYear";
  public static GetHolidaySchmH = "/Holiday/GetHolidaySchmH";
  public static EditHolidaySchmHOnly = "/Holiday/EditHolidaySchmHOnly";
  public static DeleteHolidaySchmH = "/Holiday/DeleteHolidaySchmH";
  public static DeleteHolidaySchmD = "/Holiday/DeleteHolidaySchmD";
  public static GetHolidayDetailPaging = "/Holiday/GetHolidayDetailPaging";
  public static CopyHolidaySchm = "/Holiday/CopyHolidaySchm";

  //USER SESSION LOG
  public static SelectRole = "/UserSessionLog/SelectRole";

  //NOTIFICATION
  public static NotificationPost = environment.FoundationR3Url + "/v1" + "/Message/Post";
  public static UpdateReadNotification = environment.FoundationR3Url + "/v1" + "/NotificationD/UpdateReadNotificationD";

  //REF CURR
  public static GetRefCurrPaging = "/RefCurr/GetRefCurrPaging";
  public static AddRefCurr = "/RefCurr/AddRefCurr";
  public static EditRefCurr = "/RefCurr/EditRefCurr";
  public static GetRefCurr = "/RefCurr/GetRefCurr";
  public static AddExchangeRate = "/RefCurr/AddExchangeRate";
  public static EditExchangeRate = "/RefCurr/EditExchangeRate";
  public static GetExchangeRate = "/RefCurr/GetExchangeRate";
  public static GetListKvpActiveRefCurr = environment.FoundationR3Url + "/v1" + "/RefCurr/GetListKvpActiveRefCurr"

  //GENERIC
  public static GetObjectBySQL = "/Generic/GetObjectBySQL";
  public static AddObjectBySQL = "/Generic/AddObjectBySQL";
  public static UpdateObjectBySQL = "/Generic/UpdateObjectBySQL";
  public static DeleteObjectBySQL = "/Generic/DeleteObjectBySQL";

  //WORKHOUR
  public static GetListOfWorkingHourSchm = "/WorkHour/GetListOfWorkingHourSchm";
  public static GetWorkHourSchmHPaging = "/WorkHour/GetWorkHourSchmHPaging";
  public static AddWorkingHourSchmH = "/WorkHour/AddWorkingHourSchmH";
  public static EditWorkingHourSchmH = "/WorkHour/EditWorkingHourSchmH";
  public static GetWorkingHourSchmH = "/WorkHour/GetWorkingHourSchmH";
  public static GetWorkingHourSchmD = "/WorkHour/GetWorkingHourSchmD";
  public static DeleteWorkingHourSchmH = "/WorkHour/DeleteWorkingHourSchmH";

  //QUEUE
  public static AddQueue = environment.FoundationR3Url + "/v1" + "/FOUNDATION/RabbitMq/AddQueue";

  //REF MODULE
  public static GetListRefModuleKeyValue = "/RefModule/GetListRefModuleKeyValue";

  //REF EMP LEAVE MANAGEMENT
  public static GetRefEmpLeaveMngmntPaging = "/RefEmpLeaveManagement/GetRefEmpLeaveMngmntPaging";
  public static DeleteRefEmpLeaveMngmnt = "/RefEmpLeaveManagement/DeleteRefEmpLeaveMngmnt";
  public static GetRefEmpLeaveMngmntById = "/RefEmpLeaveManagement/GetRefEmpLeaveMngmntById";
  public static EditRefEmpLeaveMngmnt = "/RefEmpLeaveManagement/EditRefEmpLeaveMngmnt";
  public static AddRefEmpLeaveMngmnt = "/RefEmpLeaveManagement/AddRefEmpLeaveMngmnt";

  //UPLOAD MONITORING FOUNDATION
  public static GetUploadMonitoringPaging = "/UploadMonitoring/GetUploadMonitoringPaging"

  //UPLOAD TYPE
  public static GetUploadTypeByUploadTypeId = "/UploadType/GetUploadTypeByUploadTypeId"
  public static GetUploadTypePaging = "/UploadType/GetUploadTypePaging"

  //UPLOAD SETTING
  public static GetUploadSettingHIdByUploadTypeId = environment.FoundationR3Url + "/v1" + "/UploadSetting/GetUploadSettingHIdByUploadTypeId"
  public static GetListUploadSettingDIdByUploadSettingHId = environment.FoundationR3Url + "/v1" + "/UploadSetting/GetListUploadSettingDIdByUploadSettingHId"
  public static GetListUploadSettingDIdByUploadTypeId = environment.FoundationR3Url + "/v1" + "/UploadSetting/GetListUploadSettingDIdByUploadTypeId"
  public static AssignRoleToUploadSetting = environment.FoundationR3Url + "/v1" + "/UploadSetting/AssignRoleToUploadSetting"
  public static GetListRefRoleByUploadTypeId = environment.FoundationR3Url + "/v1" + "/UploadSetting/GetListRefRoleByUploadTypeId"
  public static GetListUploadSettingDByUploadSettingHId = environment.FoundationR3Url + "/v1" + '/UploadSetting/GetListUploadSettingDByUploadSettingHId'
  public static CancelUpload = environment.FoundationR3Url + "/v1" + "/Upload/CancelUpload";
  public static UploadReview = environment.FoundationR3Url + "/v1" + "/Upload/UploadReview";
  public static CancelUploadV2 = environment.FoundationR3Url + "/v2" + "/Upload/CancelUpload";
  public static UploadReviewV2 = environment.FoundationR3Url + "/v2" + "/Upload/UploadReview";

  
  // GENERIC
  public static GetPagingObjectBySQL = "/Generic/GetPagingObjectBySQL";
  public static GetPagingObjectForTaskReassignment = "/Generic/GetPagingObjectForTaskReassignment";
  public static GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCode = environment.ApprovalR3Url + "/Generic/GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCode";
  public static GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCodeDistinctByTransaction = environment.ApprovalR3Url + "/Generic/GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCodeDistinctByTransaction";

  // SERVICE TASK
  public static GetListOSWfTaskListByActCode = "ServiceTask/GetListOSWfTaskListByActCode/";

  // LEAD
  public static AddLead = environment.losUrl + "/v1" + "/Lead/AddLead";
  public static EditLead = environment.losUrl + "/v1" + "/Lead/EditLead";
  public static DeleteLead = environment.losUrl + "/v1" + "/Lead/DeleteLead";
  public static GetLeadByLeadId = environment.losUrl + "/v1" + "/Lead/GetLeadByLeadId";
  public static GetLeadNoByLeadId = environment.losUrl + "/v1" + "/Lead/GetLeadNoByLeadId";
  public static GetLeadByLeadNo = environment.losUrl + "/v1" + "/Lead/GetLeadByLeadNo";
  public static GetLeadForUpdateByLeadId = environment.losUrl + "/v1" + "/Lead/GetLeadForUpdateByLeadId";
  public static GetLeadForUpdateByLeadNo = environment.losUrl + "/v1" + "/Lead/GetLeadForUpdateByLeadNo";
  public static UpdateLeadStatAndStepByHuman = environment.losUrl + "/v1" + "/Lead/UpdateLeadStatAndStepByHuman";
  public static UpdateLeadStepByHuman = environment.losUrl + "/v1" + "/Lead/UpdateLeadStepByHuman";;
  public static SubmitWorkflowLeadInput = environment.losUrl + "/v1" + "/Lead/SubmitWorkflowLeadInput";
  public static SubmitWorkflowLeadInputV2 = environment.losUrl + "/v2" + "/Lead/SubmitWorkflowLeadInput";
  public static SubmitWorkflowSimpleLeadInput = environment.losUrl + "/v1" + "/Lead/SubmitWorkflowSimpleLeadInput";
  public static SubmitWorkflowSimpleLeadInputV2 = environment.losUrl + "/v2" + "/Lead/SubmitWorkflowSimpleLeadInput";
  public static GetLeadPersonalForLookupCopy = environment.losUrl + "/v1" + "/Lead/GetLeadPersonalForLookupCopy";
  public static SubmitWorkflowLeadInputKta = environment.losUrl + "/v1" + "/Lead/SubmitWorkflowLeadInputKta";
  public static SubmitWorkflowLeadInputKtaV2 = environment.losUrl + "/v2" + "/Lead/SubmitWorkflowLeadInputKta";
  public static RejectLead = environment.losUrl + "/v1" + "/Lead/RejectLead";
  public static RejectLeadV2 = environment.losUrl + "/v2" + "/Lead/RejectLead";
  public static CheckRapindo = environment.losUrl + "/v1" + "/Lead/CheckRapindo";
  public static CheckIntegrator = environment.losUrl + "/v1" + "/Lead/CheckIntegrator";

  // LEAD ASSET
  public static GetLeadAssetByLeadId = environment.losUrl + "/v1" + "/LeadAsset/GetLeadAssetByLeadId";
  public static GetLeadAssetForCheck = environment.losUrl + "/v1" + "/LeadAsset/GetLeadAssetForCheck"

  //GUARANTOR
  public static GetListAppGuarantor = environment.losUrl + "/v1" + "/AppGuarantor/GetListAppGuarantor"
  public static GetAppGuarantorList = environment.losUrl + "/v1" + "/AppGuarantor/GetAppGuarantorList"
  public static GetListAppGuarantorDetail = environment.losUrl + "/v1" + "/AppGuarantor/GetListAppGuarantorDetail"
  public static AddAppGuarantorPersonal = environment.losUrl + "/v1" + "/AppGuarantor/AddAppGuarantorPersonal"
  public static AddAppGuarantorCompany = environment.losUrl + "/v1" + "/AppGuarantor/AddAppGuarantorCompany"
  public static GetAppGuarantorPersonalByAppGuarantorId = environment.losUrl + "/v1" + "/AppGuarantor/GetAppGuarantorPersonalByAppGuarantorId"
  public static GetAppGuarantorCompanyByAppGuarantorId = environment.losUrl + "/v1" + "/AppGuarantor/GetAppGuarantorCompanyByAppGuarantorId"
  public static EditAppGuarantorPersonal = environment.losUrl + "/v1" + "/AppGuarantor/EditAppGuarantorPersonal"
  public static EditAppGuarantorCompany = environment.losUrl + "/v1" + "/AppGuarantor/EditAppGuarantorCompany"
  public static DeleteAppGuarantor = environment.losUrl + "/v1" + "/AppGuarantor/DeleteAppGuarantor"
  public static GetListAppGuarantorCompanyByAppId = environment.losUrl + "/v1" + "/AppGuarantor/GetListAppGuarantorCompanyByAppId"
  public static GetListAppGuarantorPersonalByAppId = environment.losUrl + "/v1" + "/AppGuarantor/GetListAppGuarantorPersonalByAppId"
  public static GetListAppGuarantorPersonalForView = environment.losUrl + "/v1" + "/AppCust/GetListAppGuarantorPersonalForView"
  public static GetListAppGuarantorCompanyForView = environment.losUrl + "/v1" + "/AppCust/GetListAppGuarantorCompanyForView"
  public static GetAppCustCompanyMainDataByAppId = environment.losUrl + "/v1" + "/AppCust/GetAppCustCompanyMainDataByAppId"
  
  // AppCustCompanyMgmntShrholder
  public static GetAppCustCompanyMgmntShrholdersByAppCustCompanyMgmntShrholderId = environment.losUrl + "/v1" + "/AppCustCompanyMgmntShrholder/GetAppCustCompanyMgmntShrholdersByAppCustCompanyMgmntShrholderId"
  public static GetListManagementShareholderForListPagingByParentAppCustCompanyId = environment.losUrl + "/v1" + "/AppCustCompanyMgmntShrholder/GetListManagementShareholderForListPagingByParentAppCustCompanyId"
  public static AddAppCustCompanyMgmntShrholderPublic = environment.losUrl + '/v1' + "/AppCustCompanyMgmntShrholder/AddAppCustCompanyMgmntShrholderPublic";
  public static EditAppCustCompanyMgmntShrholderPublic = environment.losUrl + '/v1' + "/AppCustCompanyMgmntShrholder/EditAppCustCompanyMgmntShrholderPublic";
  public static DeleteAppCustCompanyMgmntShrholderPublic = environment.losUrl + '/v1' + "/AppCustCompanyMgmntShrholder/DeleteAppCustCompanyMgmntShrholderPublic";

  // Vendor
  public static GetListVendorBankAccByVendorId = environment.FoundationR3Url + "/v1" + "/VendorBankAcc/GetListVendorBankAccByVendorId";
  public static GetListVendorBankAccByVendorCode = environment.FoundationR3Url + "/v1" + "/VendorBankAcc/GetListVendorBankAccByVendorCode";
  public static GetListActiveVendorBankAccByVendorCode = environment.FoundationR3Url + "/v1" + "/VendorBankAcc/GetListActiveVendorBankAccByVendorCode";
  public static GetListKeyValueVendorByCategoryCodeAndOfficeCode = environment.FoundationR3Url + "/v1" + "/Vendor/GetListKeyValueByCategoryCodeAndOfficeCode";
  public static GetListKeyValueActiveVendorByCategoryCodeAndOfficeCode = environment.FoundationR3Url + "/v1" + "/Vendor/GetListKeyValueActiveByCategoryCodeAndOfficeCode";
  public static GetVendorByVendorCode = environment.FoundationR3Url + "/v1" + "/Vendor/GetVendorByVendorCode";
  public static GetListVendorEmpByVendorId = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetListVendorEmpByVendorId";
  public static GetListVendorEmpByVendorIdAndPositionCodes = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetListVendorEmpByVendorIdAndPositionCodes";
  public static GetListActiveVendorEmpByVendorIdAndPositionCodes = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetListActiveVendorEmpByVendorIdAndPositionCodes";
  public static GetVendorEmpSupervisorByVendorEmpNo = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetVendorEmpSupervisorByVendorEmpNo";
  public static GetVendorEmpByVendorIdVendorEmpNo = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetVendorEmpByVendorIdVendorEmpNo";
  public static GetListVendorByCategoryCodeAndOfficeCode = environment.FoundationR3Url + "/v1" + "/Vendor/GetListVendorByCategoryCodeAndOfficeCode";
  public static GetListActiveVendorByCategoryCodeAndOfficeCode = environment.FoundationR3Url + "/v1" + "/Vendor/GetListActiveVendorByCategoryCodeAndOfficeCode";
  public static GetVendorForLookup = environment.FoundationR3Url + "/v1" + "/Vendor/GetVendorForLookup";
  public static GetVendorParentByVendorCode = environment.FoundationR3Url + "/v1" + "/Vendor/GetParentVendorByChildVendorCode"

  // VendorEmp
  public static GetListVendorBankByVendorEmpNo = "/VendorEmp/GetListVendorBankByVendorEmpNo";
  public static GetListBankByVendorEmpNoAndVendorCode = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetListBankByVendorEmpNoAndVendorCode";
  public static GetVendorEmpByVendorEmpNo = "/VendorEmp/GetVendorEmpByVendorEmpNo";
  public static GetListVendorEmpByVendorIdAndPosition = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetListVendorEmpByVendorIdAndPosition";
  public static GetListKeyValueVendorEmpByVendorIdAndPosition = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetListKeyValueVendorEmpByVendorIdAndPosition";
  public static GetVendorEmpByVendorEmpId = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetVendorEmpByVendorEmpId";
  public static GetAllSupervisorFromSalesPersonBySupervisorId = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetAllSupervisorFromSalesPersonBySupervisorId";
  public static GetVendorEmpByVendorEmpNoAndVendorCode = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetVendorEmpByVendorEmpNoAndVendorCode";
  public static GetListVendorBankAccObjByVendorEmpNo = environment.FoundationR3Url + "/v1" + "/VendorBankAcc/GetListVendorBankAccObjByVendorEmpNo";
  public static GetListActiveVendorBankAccObjByVendorEmpNo = environment.FoundationR3Url + "/v1" + "/VendorBankAcc/GetListActiveVendorBankAccObjByVendorEmpNo";
  public static GetListActiveVendorBankAccByVendorEmpId = environment.FoundationR3Url + "/v1" + "/VendorBankAcc/GetListActiveVendorBankAccByVendorEmpId";
  public static GetListActiveVendorBankAccByVendorEmpNo = environment.FoundationR3Url + "/v1" + "/VendorBankAcc/GetListActiveVendorBankAccByVendorEmpNo";
  public static GetListActiveBankByVendorEmpNoAndVendorCode = environment.FoundationR3Url + "/v1" + "/VendorEmp/GetListActiveBankByVendorEmpNoAndVendorCode";

  //Life Ins
  public static AddAppLifeInsH = environment.losUrl + "/v1" + "/AppLifeIns/AddAppLifeInsH";
  public static EditAppLifeInsH = environment.losUrl + "/v1" + "/AppLifeIns/EditAppLifeInsH";
  public static InitAppLifeInsH = environment.losUrl + "/v1" + "/AppLifeIns/InitAppLifeInsH";
  public static GetRuleAdmFee = environment.losUrl + "/v1" + "/AppLifeIns/GetRuleAdmFee";
  public static GetRuleRate = environment.losUrl + "/v1" + "/AppLifeIns/GetRuleRate";
  public static GetRuleRateV2 = environment.losUrl + "/v1" + "/AppLifeIns/GetRuleRateV2";
  public static DeleteAppLifeIns = environment.losUrl + "/v1" + "/AppLifeIns/DeleteAppLifeIns";
  public static AddEditAppLifeInsH = environment.losUrl + "/v1" + "/AppLifeIns/AddEditAppLifeInsH";

  // MOU CUST COLLATERAL DOC
  public static GetListMouCustCollateralDocsByMouCustCollateralId = environment.losUrl + "/v1" + "/MouCustCollateral/GetListMouCustCollateralDocsByMouCustCollateralId";
  public static GetMouCustCollateralForUpdateByMouCustCollateralId = environment.losUrl + "/v1" + "/MouCustCollateral/GetMouCustCollateralForUpdateByMouCustCollateralId";
  public static GetMouCustCollateralRegistrationByMouCustCollateralId = environment.losUrl + "/v1" + "/MouCustCollateral/GetMouCustCollateralRegistrationByMouCustCollateralId";
  public static GenerateMouCollateralAttr = environment.losUrl + "/v1" + "/MouCustCollateral/GenerateMouCollateralAttr";

  // MOU CUST SCORING
  public static GetMouCustScoreByMouCustId = environment.losUrl + "/v1" + "/MouCustScoring/GetMouCustScoreByMouCustId";

  // MOU CUST ASSET
  public static GetMouCustAssetByMouCustId = environment.losUrl + "/v1" + "/MouCustAsset/GetMouCustAssetByMouCustId";

  // MOU CUST ASSET
  public static GetAppLifeInsHByAppId = environment.losUrl + "/v1" + "/AppLifeIns/GetAppLifeInsHByAppId";

  //ChangeMOu
  public static AddChangeMou = environment.losUrl + "/v1" + "/ChangeMou/AddChangeMou";
  public static AddChangeMouV2 = environment.losUrl + "/v2" + "/ChangeMou/AddChangeMou";
  public static EditChangeMou = environment.losUrl + "/v1" + "/ChangeMou/EditChangeMou";
  public static AddChangeMouCustAssets = environment.losUrl + "/v1" + "/ChangeMou/AddChangeMouCustAsset";
  public static AddEditChangeMouCustClause = environment.losUrl + "/v1" + "/ChangeMou/AddEditChangeMouCustClause";
  public static AddChangeMouCustCollateral = environment.losUrl + "/v1" + "/ChangeMou/AddChangeMouCustCollateralData";
  public static AddEditChangeMouCustFctr = environment.losUrl + "/v1" + "/ChangeMou/AddEditChangeMouCustFctr";
  public static GetLatestChangeMouCustVersionById = environment.losUrl + "/v1" + "/ChangeMou/GetLatestChangeMouCustVersionById";
  public static GetChangeMouByMouCustIdStatusNew = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouByMouCustIdStatusNew";
  public static GetChangeMouCustClauseByMouCustId = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouCustClauseByMouCustId";
  public static GetChangeMouCustClauseDetailByChangeMouTrxId = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouCustClauseDetailByChangeMouTrxId";
  public static GetChangeMouCustAssetByMouCustId = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouCustAssetByMouCustId";
  public static GetChangeMouCustCollateralByChangeMouCustId = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouCustCollateralByChangeMouCustId";
  public static GetChangeMouCustFctrByMouCustId = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouCustFctrByMouCustId";
  public static GetChangeMouCustFctrDetailByChangeMouTrxId = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouCustFctrDetailByChangeMouTrxId";
  public static GetForViewChangeMouCustFctrDetailByChangeMouTrxId = environment.losUrl + "/v2" + "/ChangeMou/GetForViewChangeMouCustFctrDetailByChangeMouTrxId";
  public static GetChangeMouCustDlrFncgByMouCustId = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouCustDlrFindById";
  public static GetForViewChangeMouCustDlrFncgByMouCustId = environment.losUrl + "/v2" + "/ChangeMou/GetForViewChangeMouCustDlrFncgByMouCustId";
  public static GetChangeMouCustDlrFncgDetailByChangeMouTrxId = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouCustDlrFncgDetailByChangeMouTrxId";
  public static AddEditChangeMouCustDlrFin = environment.losUrl + "/v1" + "/ChangeMou/AddEditChangeMouCustDlrFin";
  public static SubmitChangeMouReview = environment.losUrl + "/v1" + "/ChangeMou/SubmitChangeMouReview";
  public static SubmitChangeMouReviewV2 = environment.losUrl + "/v2" + "/ChangeMou/SubmitChangeMouReview";
  public static SubmitWorkflowChangeMouRequest = environment.losUrl + "/v1" + "/ChangeMou/SubmitWorkflowChangeMouRequest";
  public static SubmitWorkflowChangeMouRequestV2 = environment.losUrl + "/v2" + "/ChangeMou/SubmitWorkflowChangeMouRequest";
  public static CheckMouCustInChangeMouProcess = environment.losUrl + "/v1" + "/ChangeMou/CheckMouCustInChangeMouProcess";
  public static GetChangeMouTrxbyTrxId = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouTrxbyTrxId";
  public static EditChangeMouForCancelByChangeMouTrxId = environment.losUrl + "/v1" + "/ChangeMou/EditChangeMouForCancelByChangeMouTrxId";
  public static EditChangeMouForCancelByChangeMouTrxIdV2 = environment.losUrl + "/v2" + "/ChangeMou/EditChangeMouForCancelByChangeMouTrxId";
  public static GetListChangeMouTrxByMouCustId = environment.losUrl + "/v1" + "/ChangeMOU/GetListChangeMouTrxByMouCustId";
  public static ReturnChangeMouReview = environment.losUrl + "/v1" + "/ChangeMOU/ReturnChangeMouReview";
  public static ReturnChangeMouReviewV2 = environment.losUrl + "/v2" + "/ChangeMOU/ReturnChangeMouReview";
  public static ChangeMouExecutionHumanActivity = environment.losUrl + "/v1" + "/ChangeMou/ChangeMouExecutionHumanActivity";
  public static SubmitChangeMouReturn = environment.losUrl + "/v1" + "/ChangeMou/SubmitChangeMouReturn";
  public static SubmitChangeMouReturnV2 = environment.losUrl + "/v2" + "/ChangeMou/SubmitChangeMouReturn";
  public static GetChangeMouCustbyChangeMouTrxId = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouCustbyChangeMouTrxId";
  public static GetChangeMouCustbyChangeMouTrxNo = environment.losUrl + "/v1" + "/ChangeMou/GetChangeMouCustbyChangeMouTrxNo";

  //CHANGE MOU CUST COLLATERAL
  public static GetChangeMouCustCollateralDocByChangeMouCustCollateralId = environment.losUrl + "/v1" + "/ChangeMouCustCollateral/GetChangeMouCustCollateralDocByChangeMouCustCollateralId";
  public static GetChangeMouCustCollateralForChangeMouViewByMouCustId = environment.losUrl + "/v1" + "/ChangeMouCustCollateral/GetChangeMouCustCollateralForChangeMouViewByMouCustId"
  public static AddEditChangeMouCustCollateralData = environment.losUrl + "/v1" + "/ChangeMouCustCollateral/AddEditChangeMouCustCollateralData";
  public static GetChangeMouCustCollateralDataForUpdateByChangeMouCustCollateralId = environment.losUrl + "/v1" + "/ChangeMouCustCollateral/GetChangeMouCustCollateralDataForUpdateByChangeMouCustCollateralId";
  public static DeleteChangeMouCustCollateral = environment.losUrl + "/v1" + "/ChangeMouCustCollateral/DeleteChangeMouCustCollateral";
  public static AddExistingChangeMouCustCollateralData = environment.losUrl + "/v1" + "/ChangeMouCustCollateral/AddExistingChangeMouCustCollateralData";
  public static GenerateChangeMouCollateralAttr = environment.losUrl + "/v1" + "/ChangeMouCustCollateral/GenerateChangeMouCollateralAttr";

  // MOU CUST
  public static GetMouCustById = environment.losUrl + "/v1" + "/MouCust/GetMouCustById";
  public static AddMouCust = environment.losUrl + "/v1" + "/MouCust/AddMouCust";
  public static AddMouCustV2 = environment.losUrl + "/v2" + "/MouCust/AddMouCust";
  public static EditMouCust = environment.losUrl + "/v1" + "/MouCust/EditMouCust";
  public static GetMouCustClauseByMouCustId = environment.losUrl + "/v1" + "/MouCustClause/GetMouCustClauseByMouCustId";
  public static AddMouCustClause = environment.losUrl + "/v1" + "/MouCustClause/AddMouCustClause";
  public static EditMouCustClause = environment.losUrl + "/v1" + "/MouCustClause/EditMouCustClause";
  public static GetMouCustTcFromRule = environment.losUrl + "/v1" + "/MouCustTc/GetMouCustTcFromRule";
  public static EditListMouCustTc = environment.losUrl + "/v1" + "/MouCustTc/EditListMouCustTc";
  public static GetListMouCustListedCustFctrByMouCustId = environment.losUrl + "/v1" + "/MouCustListedCustFctr/GetListMouCustListedCustFctrByMouCustId";
  public static DeleteMouCustListedCustFctr = environment.losUrl + "/v1" + "/MouCustListedCustFctr/DeleteMouCustListedCustFctr";
  public static AddMouCustListedCustFctr = environment.losUrl + "/v1" + "/MouCustListedCustFctr/AddMouCustListedCustFctr";
  public static SubmitWorkflowMouRequest = environment.losUrl + "/v1" + "/MouCust/SubmitWorkflowMouRequest";
  public static SubmitWorkflowMouRequestV2 = environment.losUrl + "/v2" + "/MouCust/SubmitWorkflowMouRequest";
  public static SubmitMouReview = environment.losUrl + "/v1" + "/MouCust/SubmitMouReview";
  public static SubmitMouReviewNew = environment.losUrl + "/v1" + "/MouCust/SubmitMouReviewNew";
  public static SubmitMouReviewNewV2 = environment.losUrl + "/v2" + "/MouCust/SubmitMouReviewNew";
  public static ReturnMouReview = environment.losUrl + "/v1" + "/MouCust/ReturnMouReview";
  public static ReturnMouReviewV2 = environment.losUrl + "/v2" + "/MouCust/ReturnMouReview";
  public static EditMouForCancelByMouId = environment.losUrl + "/v1" + "/MouCust/EditMouForCancelByMouId";
  public static EditMouForCancelByMouIdV2 = environment.losUrl + "/v2" + "/MouCust/EditMouForCancelByMouId";
  public static EditMouForCancelByMouIdV2_1 = environment.losUrl + "/v2.1" + "/MouCust/EditMouForCancelByMouId";
  public static GetListMouByAppIdAndMouType = environment.losUrl + "/v1" + "/MouCust/GetListMouByAppIdAndMouType";
  public static GetListMouByAppIdAndMouTypeDF = environment.losUrl + "/v1" + "/MouCust/GetListMouByAppIdAndMouTypeDF";
  public static GetListMouCustByCustNo = environment.losUrl + "/v1" + "/MouCust/GetListMouCustByCustNo";
  public static GetMouCustByAppId = environment.losUrl + "/v1" + "/MouCust/GetMouCustByAppId";
  public static MouCustExecutionHumanActivity = environment.losUrl + "/v1" + "/MouCust/MouCustExecutionHumanActivity";
  public static MouCustExecutionHumanActivityV2 = environment.losUrl + "/v2" + "/MouCust/MouCustExecutionHumanActivity";
  public static CheckMouActiveR2 = environment.losUrl + "/v1" + "/MouCustX/CheckMouActiveR2";
  public static IsMouUsedByAppOnProgress = environment.losUrl + "/v1" + "/MouCust/IsMouUsedByAppOnProgress";

  public static AddEditMouCustPersonalData = environment.losUrl + "/v1" + "/MouCust/AddEditMouCustPersonalData";
  public static AddMouCustPersonalData = environment.losUrl + "/v1" + "/MouCust/AddMouCustPersonalData";
  public static EditMouCustPersonalData = environment.losUrl + "/v1" + "/MouCust/EditMouCustPersonalData";
  public static AddEditMouCustCompanyData = environment.losUrl + "/v1" + "/MouCust/AddEditMouCustCompanyData";
  public static AddMouCustCompanyData = environment.losUrl + "/v1" + "/MouCust/AddMouCustCompanyData";
  public static EditMouCustCompanyData = environment.losUrl + "/v1" + "/MouCust/EditMouCustCompanyData";
  public static GetMouCustByMouCustId = environment.losUrl + "/v1" + "/MouCust/GetMouCustByMouCustId";
  public static AddEditMouCustDlrFin = environment.losUrl + "/v1" + "/MouCust/AddMouCustDlrFind";
  public static GetMouCustDlrFindById = environment.losUrl + "/v1" + "/MouCust/GetMouCustDlrFindById";
  public static GetMouCustDlrWithCustVendorNameFindById = environment.losUrl + "/v1" + "/MouCust/GetMouCustDlrWithCustVendorNameFindById";
  public static UpdatePlafondCollateralAmtMouCust = environment.losUrl + "/v1" + "/MouCust/UpdatePlafondCollateralAmtMouCust";

  public static GetMouCustListAddrByMouCustId = environment.losUrl + "/v1" + "/MouCustAddr/GetMouCustListAddrByMouCustId";

  // MOU CUST DUPCHECK
  public static GetMouCustDuplicateCheck = environment.losUrl + "/v1" + "/MouCustDupCheck/GetMouCustDuplicateCheck";
  public static GetMouSpouseDuplicateCheck = environment.losUrl + "/v1" + "/MouCustDupCheck/GetMouSpouseDuplicateCheck";
  public static GetMouGuarantorDuplicateCheck = environment.losUrl + "/v1" + "/MouCustDupCheck/GetMouGuarantorDuplicateCheck";
  public static GetMouShareholderDuplicateCheck = environment.losUrl + "/v1" + "/MouCustDupCheck/GetMouShareholderDuplicateCheck";
  public static EditCustNoMouCust = environment.losUrl + "/v1" + "/MouCustDupCheck/EditCustNoMouCust";
  public static SubmitMouDupCheck = environment.losUrl + "/v1" + "/MouCustDupCheck/SubmitMouDupCheck";
 
  // MOU Freeze Unfreeze
  public static SubmitMouFreezeUnfreeze = environment.losUrl + "/v1" + "/MouFreezeUnfreeze/SubmitMouFreezeUnfreeze";
  public static SubmitMouFreezeUnfreezeV2 = environment.losUrl + "/v2" + "/MouFreezeUnfreeze/SubmitMouFreezeUnfreeze";
  public static GetListMouFreezeUnfreezeByMouCustId = environment.losUrl + "/v1" + "/MouFreezeUnfreeze/GetListMouFreezeUnfreezeByMouCustId";

  // MOU CUST FCTR
  public static AddMouCustFctr = environment.losUrl + "/v1" + "/MouCustFctr/AddMouCustFctr";
  public static EditMouCustFctr = environment.losUrl + "/v1" + "/MouCustFctr/EditMouCustFctr";
  public static AddorEditListMouCustListedCustFctr = environment.losUrl + "/v1" + "/MouCustListedCustFctr/AddorEditListMouCustListedCustFctr";
  public static GetMouCustFctrByMouCustId = environment.losUrl + "/v1" + "/MouCustFctr/GetMouCustFctrByMouCustId";
  public static GetMouCustFctrForMouViewByMouCustId = environment.losUrl + "/v1" + "/MouCustFctr/GetMouCustFctrForMouViewByMouCustId";

  // MOU CUST ASSET
  public static AddMouCustAsset = environment.losUrl + "/v1" + "/MouCustAsset/AddMouCustAsset";
  public static DeleteMouCustAsset = environment.losUrl + "/v1" + "/MouCustAsset/DeleteMouCustAsset";
  public static GetAssetTypeKeyValueCode = environment.FoundationR3Url + "/v1" + "/AssetType/GetListKeyValueByCode";

  // MOU CUST ASSET
  public static GetMouCustFeeByMouCustId = environment.losUrl + "/v1" + "/MouCustFee/GetMouCustFeeByMouCustId";
  public static GetListMouCustFeeByMouCustId = environment.losUrl + "/v1" + "/MouCustFee/GetListMouCustFeeByMouCustId";
  public static GetMouCustFeeForMouRequestByMouCustId = environment.losUrl + "/v1" + "/MouCustFee/GetMouCustFeeForMouRequestByMouCustId";
  public static GetRefFeeList = environment.losUrl + "/v1" + "/RefFee/GetRefFeeList";
  public static AddMouCustFee = environment.losUrl + "/v1" + "/MouCustFee/AddMouCustFee";
  public static DeleteMouCustFee = environment.losUrl + "/v1" + "/MouCustFee/DeleteMouCustFee";

  // MOU CUST CLAUSE
  public static GetMouCustDataByMouCustId = environment.losUrl + "/v1" + "/MouCustClause/GetMouCustDataByMouCustId";

  // MOU CUST COLLATERAL
  public static AddMouCustCollateralData = environment.losUrl + "/v1" + "/MouCustCollateral/AddMouCustCollateralData";
  public static AddExistingCustCollateralData = environment.losUrl + "/v1" + "/MouCustCollateral/AddExistingCustCollateralData";
  public static EditMouCustCollateralData = environment.losUrl + "/v1" + "/MouCustCollateral/EditMouCustCollateralData";
  public static DeleteMouCustCollateral = environment.losUrl + "/v1" + "/MouCustCollateral/DeleteMouCustCollateral";
  public static GetMouCustCollateralByMouCustId = environment.losUrl + "/v1" + "/MouCustCollateral/GetMouCustCollateralByMouCustId";
  public static GetMouCustCollateralForMouViewByMouCustId = environment.losUrl + "/v1" + "/MouCustCollateral/GetMouCustCollateralForMouViewByMouCustId";

  public static GetMouCustCollateralDataForUpdateByMouCustCollateralId = environment.losUrl + "/v1" + "/MouCustCollateral/GetMouCustCollateralDataForUpdateByMouCustCollateralId";
  public static GetListCollateralByCustNo = environment.FoundationR3Url + "/v1" + "/Collateral/GetListCollateralByCustNo";
  public static GetListCollateralByListCollateralNo = environment.FoundationR3Url + "/v1" + "/Collateral/GetListCollateralByListCollateralNo";
  public static GetMouCustCollateralDataExistingByCollateralNo = environment.losUrl + "/v1" + "/MouCustCollateral/GetMouCustCollateralDataExistingByCollateralNo";

  public static CheckMouCustCollateralIntegrator = environment.losUrl + "/v1" + "/MouCustCollateral/CheckMouCustCollateralIntegrator";
  public static ValidateAddExistingByMouCustId = environment.losUrl + "/v1" + "/MouCustCollateral/ValidateAddExistingByMouCustId"
  public static GetListMouCustCollateralActiveByCustNo = environment.losUrl + "/v1" + "/MouCustCollateral/GetListMouCustCollateralActiveByCustNo";
  // MOU CUST COLLATERAL DOC

  // MOU CUST RVW H
  public static GetMouCustRvwHByMouCustId = environment.losUrl + "/v1" + "/MouCustRvwH/GetMouCustRvwHByMouCustId"
  public static GetListMouCustRvwD = environment.losUrl + "/v1" + "/MouCustRvwD/GetListMouCustRvwD"

  // MOU CUST LEGAL REVIEW
  public static GetMouCustLglReviewByMouCustId = environment.losUrl + "/v1" + "/MouCustLglReview/GetMouCustLglReviewByMouCustId";
  public static AddRangeMouCustLglReview = environment.losUrl + "/v1" + "/MouCustLglReview/AddRangeMouCustLglReview";
  public static AddRangeMouCustLglReviewV2 = environment.losUrl + "/v2" + "/MouCustLglReview/AddRangeMouCustLglReview";
  public static EditRangeMouCustLglReview = environment.losUrl + "/v1" + "/MouCustLglReview/EditRangeMouCustLglReview";

  // MOU CUST TC
  public static GetCustMouTcByCustMouId = environment.losUrl + "/v1" + "/MouCustTc/GetCustMouTcByCustMouId";
  public static GetMouCustTcForMouLglByCustMouId = environment.losUrl + "/v1" + "/MouCustTc/GetMouCustTcForMouLglByCustMouId";
  // public static EditListMouCustTc = environment.losUrl + "/v1" + "/MouCustTc/EditListMouCustTc";

  // MOU DOC SIGNER
  public static AddMouCustSigner = environment.losUrl + "/v1" + "/MouCustSigner/AddMouCustSigner";
  public static AddMouCustSignerV2 = environment.losUrl + "/v2" + "/MouCustSigner/AddMouCustSigner";
  public static GetMouCustSignerByMouCustId = environment.losUrl + "/v1" + "/MouCustSigner/GetMouCustSignerByMouCustId";

  // MOU CUST DOC
  public static GetListMouCustDocByMouCustId = environment.losUrl + "/v1" + "/MouCustDoc/GetListMouCustDocByMouCustId";

  // MOU CUST DOC PRINT
  public static AddMouCustDocPrint = environment.losUrl + "/v1" + "/MouCustDocPrint/AddMouCustDocPrint";
  public static GetListMouCustDocPrintForViewByMouCustId = environment.losUrl + "/v1" + "/MouCustDocPrint/GetListMouCustDocPrintForViewByMouCustId";
  public static EditMouCustDocPrintSequenceNo = environment.losUrl + "/v1" + "/MouCustDocPrint/EditMouCustDocPrintSequenceNo";

  //MOU CUST FIN DATA ATTR
  public static GetListMouCustFinDataAttrContentByMouCustIdAndListAttrGroup = environment.losUrl + "/v1" + "/MouCustFinDataAttrContent/GetListMouCustFinDataAttrContentByMouCustIdAndListAttrGroup";

  // REF COUNTRY
  public static GetRefCountryByCountryCode = environment.FoundationR3Url + "/v1" + "/RefCountry/GetRefCountryByCountryCode";

  // REF PROFESSION
  public static GetRefProfessionByCode = environment.FoundationR3Url + "/v1" + "/RefProfession/GetRefProfessionByProfessionCode";

  //REF INDUSTRY TYPE
  public static GetRefIndustryTypeByCode = environment.FoundationR3Url + "/v1" + "/RefIndustryType/GetRefIndustryTypeByIndustryTypeCode";
  public static GetRefIndustryTypeByRefIndustryTypeId = environment.FoundationR3Url + "/v1" + "/RefIndustryType/GetRefIndustryTypeByRefIndustryTypeId";

  // REF LOB
  public static GetListActiveLob = environment.FoundationR3Url + "/v1" + "/RefLob/GetListKeyValueActiveByCode";

  //CUST
  public static GetCustByCustNo = environment.FoundationR3Url + "/v1" + "/Cust/GetCustByCustNo";
  public static GetCustByCustId = environment.FoundationR3Url + "/v1" + "/Cust/GetCustByCustId";
  public static GetCustPersonalByCustId = environment.FoundationR3Url + "/v1" + "/CustPersonal/GetCustPersonalByCustId";
  public static GetCustCompanyByCustId = environment.FoundationR3Url + "/v1" + "/CustCompany/GetCustCompanyByCustId";
  public static GetCustAddrByMrCustAddrType = environment.FoundationR3Url + "/v1" + "/CustAddr/GetCustAddrByMrCustAddrType";
  public static GetCustCompanyContactPersonByCustCompanyId = environment.FoundationR3Url + "/v1" + "/CustCompanyContactPerson/GetCustCompanyContactPersonByCustCompanyId";
  public static GetCustPersonalForCopyByCustId = environment.FoundationR3Url + "/v1" + "/Cust/GetCustPersonalForCopyByCustId";
  public static GetCustPersonalMainDataForCopyByCustId = environment.FoundationR3Url + "/v1" + "/Cust/GetCustPersonalMainDataForCopyByCustId";
  public static GetCustCompanyForCopyByCustId = environment.FoundationR3Url + "/v1" + "/Cust/GetCustCompanyForCopyByCustId";
  public static GetCustCompanyMainDataForCopyByCustId = environment.FoundationR3Url + "/v1" + "/Cust/GetCustCompanyMainDataForCopyByCustId";
  public static GetCustPersonalForCopyMgmntShrholderByCustId = environment.FoundationR3Url + "/v1" + "/Cust/GetCustPersonalForCopyMgmntShrholderByCustId";
  public static GetCustCompanyForCopyMgmntShrholderByCustId = environment.FoundationR3Url + "/v1" + "/Cust/GetCustCompanyForCopyMgmntShrholderByCustId";
  public static GetListKeyValueMobilePhnByAppId = environment.losUrl + "/v1" + "/AppCust/GetListKeyValueMobilePhnByAppId";
  public static GetListActiveCustBankAccByCustId = environment.FoundationR3Url + "/v1" + "/CustBankAcc/GetListActiveCustBankAccByCustId";
  public static GetListActiveCustBankAccByCustNo = environment.FoundationR3Url + "/v1" + "/CustBankAcc/GetListActiveCustBankAccByCustNo";

  public static AddAppCustHighlightComment = environment.losUrl + "/v1" + "/AppCust/AddAppCustHighlightComment";
  public static GetAppCustHighlightCommentByCustNo = environment.losUrl + "/v1" + "/AppCust/GetAppCustHighlightCommentByCustNo";
  public static GetAppCustHighlightCommentByAppNo = environment.losUrl + "/v1" + "/AppCust/GetAppCustHighlightCommentByAppNo";
  public static GetAppCustHighlightCommentByAppId = environment.losUrl + "/v1" + "/AppCust/GetAppCustHighlightCommentByAppId";


  //CUST DATA COMPANY
  public static AddEditCustDataCompany = environment.losUrl + "/v1" + "/AppCust/AddEditCustDataCompany";
  public static GetListAppCustCompanyFinDataByAppCustId = environment.losUrl + "/v1" + "/AppCustCompanyFinData/GetListAppCustCompanyFinDataByAppCustId";
  public static AddEditAppCustCompanyFinData = environment.losUrl + "/v1" + "/AppCustCompanyFinData/AddEditAppCustCompanyFinData";

  //DELIVERY ORDER
  public static SubmitDeliveryOrderData = environment.losUrl + "/v1" + "/DeliveryOrder/SubmitDeliveryOrderData";
  public static SubmitDeliveryOrderDataV2 = environment.losUrl + "/v2" + "/DeliveryOrder/SubmitDeliveryOrderData";
  public static SubmitDeliveryOrderDataV2_1 = environment.losUrl + "/v2.1" + "/DeliveryOrder/SubmitDeliveryOrderData";
  public static GetRefAssetDocList = environment.FoundationR3Url + "/v1" + "/AssetDocList/GetListActiveAssetDocListByAssetTypeCode";
  public static GetDeliveryOrderHByAgrmntId = environment.losUrl + "/v1" + "/DeliveryOrder/GetDeliveryOrderHByAgrmntId";
  public static GetAssetListForDOMultiAsset = environment.losUrl + "/v1" + "/DeliveryOrder/GetAssetListForDOMultiAsset";
  public static GetListDeliveryOrderHByAppIdAgrmntId = environment.losUrl + "/v1" + "/DeliveryOrder/GetListDeliveryOrderHByAppIdAgrmntId";
  public static AddDeliveryOrderMultiAsset = environment.losUrl + "/v1" + "/DeliveryOrder/AddDeliveryOrderMultiAsset";
  public static DeleteDeliveryOrderMultiAsset = environment.losUrl + "/v1" + "/DeliveryOrder/DeleteDeliveryOrderMultiAsset";
  public static GetAppAssetForDOMultiAsset = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetForDOMultiAsset";
  public static EditAppAssetDOMultiAsset = environment.losUrl + "/v1" + "/AppAsset/EditAppAssetDOMultiAsset";
  public static EditAppAssetDOMultiAssetV2 = environment.losUrl + "/v2" + "/AppAsset/EditAppAssetDOMultiAsset";
  public static EditDeliveryOrderMultiAsset = environment.losUrl + "/v1" + "/DeliveryOrder/EditDeliveryOrderMultiAsset";
  public static GetDeliveryOrderHByDeliveryOrderHId = environment.losUrl + "/v1" + "/DeliveryOrder/GetDeliveryOrderHByDeliveryOrderHId";
  public static GetDeliveryOrderDataForOneAssetByAgrmntId = environment.losUrl + "/v1" + "/DeliveryOrder/GetDeliveryOrderDataForOneAssetByAgrmntId";
  public static SubmitDeliveryOrderMultiAsset = environment.losUrl + "/v1" + "/DeliveryOrder/SubmitDeliveryOrderMultiAsset";
  public static SubmitDeliveryOrderMultiAssetV2 = environment.losUrl + "/v2" + "/DeliveryOrder/SubmitDeliveryOrderMultiAsset";
  public static CheckAllDeliveryOrderData = environment.losUrl + "/v1" + "/DeliveryOrder/CheckAllDeliveryOrderData";
  public static GetAssetListForDOMultiAssetView = environment.losUrl + "/v1" + "/DeliveryOrder/GetAssetListForDOMultiAssetView";

  //PURCHASE ORDER
  public static SubmitPurchaseOrder = environment.losUrl + "/v1" + "/PurchaseOrderH/SubmitPurchaseOrder";
  public static AddPurchaseOrder = environment.losUrl + "/v1" + "/PurchaseOrderH/AddPurchaseOrder";
  public static EditPurchaseOrder = environment.losUrl + "/v1" + "/PurchaseOrderH/EditPurchaseOrder";
  public static SubmitNewPurchaseOrder = environment.losUrl + "/v1" + "/PurchaseOrderH/SubmitNewPurchaseOrder";
  public static ResumeWorkflowPurchaseOrder = environment.losUrl + "/v1" + "/PurchaseOrderH/ResumeWorkflowPurchaseOrder";
  public static ResumeWorkflowPurchaseOrderV2 = environment.losUrl + "/v2" + "/PurchaseOrderH/ResumeWorkflowPurchaseOrder";
  public static GetPurchaseOrderHDetailViewByAgrmntId = environment.losUrl + "/v1" + "/PurchaseOrderH/GetPurchaseOrderHDetailViewByAgrmntId";
  public static GetPurchaseOrderHByAgrmntId = environment.losUrl + "/v1" + "/PurchaseOrderH/GetPurchaseOrderHByAgrmntId";
  public static GetListPurchaseOrderHByAgrmntId = environment.losUrl + "/v1" + "/PurchaseOrderH/GetListPurchaseOrderHByAgrmntId"
  public static GetPurchaseOrderHDetailViewMultiAssetByAgrmntId = environment.losUrl + "/v1" + "/PurchaseOrderH/GetPurchaseOrderHDetailViewMultiAssetByAgrmntId"
  public static GetPurchaseOrderListForNewPOByAppId = environment.losUrl + "/v1" + "/PurchaseOrderH/GetPurchaseOrderListForNewPOByAppId";
  public static GetPurchaseOrderHByPurchaseOrderHId = environment.losUrl + "/v1" + "/PurchaseOrderH/GetPurchaseOrderHByPurchaseOrderHId";
  public static GetPurchaseOrderByPurchaseOrderHIdForNewPO = environment.losUrl + "/v1" + "/PurchaseOrderH/GetPurchaseOrderByPurchaseOrderHIdForNewPO";
  public static GetPurchaseOrderDPoItemCodeFromRuleByType = environment.losUrl + "/v1" + "/PurchaseOrderH/GetPurchaseOrderDPoItemCodeFromRuleByType";
  public static ResumeWorkflowNewPurchaseOrder = environment.losUrl + "/v1" + "/PurchaseOrderH/ResumeWorkflowNewPurchaseOrder";
  public static ResumeWorkflowNewPurchaseOrderV2 = environment.losUrl + "/v2" + "/PurchaseOrderH/ResumeWorkflowNewPurchaseOrder";
  public static GetBankDsfbyGeneralSettingR2 = environment.losUrl + "/v1" + "/PurchaseOrderH/GetBankDsfbyGeneralSettingR2";

  // LEAD
  public static AddLeadCust = environment.losUrl + "/v1" + "/LeadCust/AddLeadCust";
  public static AddSimpleLeadCust = environment.losUrl + "/v1" + "/LeadCust/AddSimpleLeadCust";
  public static EditLeadCust = environment.losUrl + "/v1" + "/LeadCust/EditLeadCust";
  public static EditSimpleLeadCust = environment.losUrl + "/v1" + "/LeadCust/EditSimpleLeadCust";
  public static EditSimpleLeadCustTypeUpdate = environment.losUrl + "/v1" + "/LeadCust/EditSimpleLeadCustTypeUpdate";
  public static AddLeadData = environment.losUrl + "/v1" + "/Lead/AddLeadData";
  public static EditLeadData = environment.losUrl + "/v1" + "/Lead/EditLeadData";
  public static GetLeadMonitoringByUploadMonitoringNoAndTrxType = environment.losUrl + "/v2" + "/Lead/GetLeadMonitoringByUploadMonitoringNoAndTrxType";
  public static AddLeadDataKta = environment.losUrl + "/v1" + "/Lead/AddLeadDataKta";
  public static EditLeadDataKta = environment.losUrl + "/v1" + "/Lead/EditLeadDataKta";

  //LEAD CANCEL
  public static GetListLeadForLeadCancelByListLeadId = environment.losUrl + "/v1" + "/Lead/GetListLeadForLeadCancelByListLeadId";
  public static EditListLeadForCancelByListLeadId = environment.losUrl + "/v1" + "/Lead/EditListLeadForCancelByListLeadId";
  public static EditListLeadForCancelByListLeadIdV2 = environment.losUrl + "/v2" + "/Lead/EditListLeadForCancelByListLeadId";

  // LEAD APP
  public static GetLeadAppByLeadId = environment.losUrl + "/v1" + "/LeadApp/GetLeadAppByLeadId";

  // LEAD CUST
  public static GetLeadCustByLeadId = environment.losUrl + "/v1" + "/LeadCust/GetLeadCustByLeadId";

  // LEAD CUST SOCMED
  public static GetListLeadCustSocmedByLeadCustId = environment.losUrl + "/v1" + "/LeadCustSocmed/GetListLeadCustSocmedByLeadCustId";

  // LEAD CUST ADDR
  public static GetLeadCustAddrByLeadCustIdAndAddrTypeCode = environment.losUrl + "/v1" + "/LeadCustAddr/GetLeadCustAddrByLeadCustIdAndAddrTypeCode";

  // LEAD CUST PERSONAL
  public static GetLeadCustPersonalByLeadCustId = environment.losUrl + "/v1" + "/LeadCustPersonal/GetLeadCustPersonalByLeadCustId";

  // LEAD CUST PERSONAL FIN DATA
  public static GetLeadCustPersonalFinDataByLeadCustPersonalId = environment.losUrl + "/v1" + "/LeadCustPersonalFinData/GetLeadCustPersonalFinDataByLeadCustPersonalId";
  public static GetListAppCustPersonalFinDataByAppCustPersonalId = environment.losUrl + "/v1" + "/AppCustPersonalFinData/GetListAppCustPersonalFinDataByAppCustPersonalId";
  public static AddEditAppCustPersonalFinData = environment.losUrl + "/v1" + "/AppCustPersonalFinData/AddEditAppCustPersonalFinData";

  // LEAD CUST PERSONAL JOB DATA
  public static GetLeadCustPersonalJobDataByLeadCustPersonalId = environment.losUrl + "/v1" + "/LeadCustPersonalJobData/GetLeadCustPersonalJobDataByLeadCustPersonalId";

  // CUST DATA PERSONAL
  public static AddEditCustDataPersonal = environment.losUrl + "/v1" + "/AppCust/AddEditCustDataPersonal";
  public static GetCustDataByAppId = environment.losUrl + "/v1" + "/AppCust/GetCustDataByAppId";
  public static GetAppCustPersonalContactPersonsByAppCustPersonalId = environment.losUrl + "/v1" + "/AppCustPersonalContactPerson/GetAppCustPersonalContactPersonsByAppCustPersonalId";
  public static DeleteAppCustPersonalContactPerson = environment.losUrl + "/v1" + "/AppCustPersonalContactPerson/DeleteAppCustPersonalContactPerson";
  public static GetAppCustPersonalDataAndSpouseByAppId = environment.losUrl + "/v1" + "/AppCust/GetAppCustPersonalDataAndSpouseByAppCustId";
  public static GetAppCustPersonalByAppCustId = environment.losUrl + "/v1" + "/AppCust/GetAppCustPersonalByAppCustId";

  //CUST DATA COMPANY
  public static GetCustDataForViewByAppId = environment.losUrl + "/v1" + "/AppCust/GetCustDataForViewByAppId";
  public static GetCustDataPersonalForViewByAppId = environment.losUrl + "/v1" + "/AppCust/GetCustDataPersonalForViewByAppId";
  public static GetCustSpouseDataPersonalForViewByAppId = environment.losUrl + "/v1" + "/AppCust/GetCustSpouseDataPersonalForViewByAppId";
  public static GetCustDataPersonalForViewByAppCustId = environment.losUrl + "/v1" + "/AppCust/GetCustDataPersonalForViewByAppCustId";
  public static GetCustDataCompanyForViewByAppId = environment.losUrl + "/v1" + "/AppCust/GetCustDataCompanyForViewByAppId";
  public static GetCustDataCompanyForViewByAppCustId = environment.losUrl + "/v1" + "/AppCust/GetCustDataCompanyForViewByAppCustId";
  public static GetAppCustCompanyByAppCustId = environment.losUrl + "/v1" + "/AppCust/GetAppCustCompanyByAppCustId";
  public static GetAppCustCompanyContactPersonByAppCustId = environment.losUrl + "/v1" + "/AppCust/GetAppCustCompanyContactPersonByAppCustId";
  public static AddAppCustCompanyContactPerson = environment.losUrl + "/v1" + "/AppCust/AddAppCustCompanyContactPerson";
  public static EditAppCustCompanyContactPerson = environment.losUrl + "/v1" + "/AppCust/EditAppCustCompanyContactPerson";
  public static GetAppCustCompanyLegalDocsByAppCustCompanyId = environment.losUrl + "/v1" + "/AppCustCompanyLegalDoc/GetAppCustCompanyLegalDocsByAppCustCompanyId";
  public static AddAppCustCompanyLegalDoc = environment.losUrl + "/v1" + "/AppCustCompanyLegalDoc/AddAppCustCompanyLegalDoc";
  public static EditAppCustCompanyLegalDoc = environment.losUrl + "/v1" + "/AppCustCompanyLegalDoc/EditAppCustCompanyLegalDoc";
  public static DeleteAppCustCompanyLegalDoc = environment.losUrl + "/v1" + "/AppCustCompanyLegalDoc/DeleteAppCustCompanyLegalDoc";
  public static GetAppCustCompanyFinDataByAppCustId = environment.losUrl + "/v1" + "/AppCustCompanyFinData/GetAppCustCompanyFinDataByAppCustId";
  public static AddAppCustCompanyFinData = environment.losUrl + "/v1" + "/AppCustCompanyFinData/AddAppCustCompanyFinData";
  public static EditAppCustCompanyFinData = environment.losUrl + "/v1" + "/AppCustCompanyFinData/EditAppCustCompanyFinData";

  //CUST MAIN DATA
  public static GetAppCustMainDataByAppId = environment.losUrl + "/v1" + "/AppCust/GetAppCustMainDataByAppId";
  public static GetAppCustMainDataByAppCustId = environment.losUrl + "/v1" + "/AppCust/GetAppCustMainDataByAppCustId";
  public static GetListAppCustMainDataByAppId = environment.losUrl + "/v1" + "/AppCust/GetListAppCustMainDataByAppId";
  public static AddCustMainDataPersonal = environment.losUrl + "/v1" + "/AppCust/AddCustMainDataPersonal";
  public static EditCustMainDataPersonal = environment.losUrl + "/v1" + "/AppCust/EditCustMainDataPersonal";
  public static EditCustMainDataPersonalV2 = environment.losUrl + "/v2" + "/AppCust/EditCustMainDataPersonal";
  public static AddCustMainDataCompanyData = environment.losUrl + "/v1" + "/AppCust/AddCustMainDataCompanyData";
  public static EditCustMainDataCompanyData = environment.losUrl + "/v1" + "/AppCust/EditCustMainDataCompanyData";
  public static EditCustMainDataCompanyDataV2 = environment.losUrl + "/v2" + "/AppCust/EditCustMainDataCompanyData";
  public static DeleteAppCustMainData = environment.losUrl + "/v1" + "/AppCust/DeleteAppCustMainData";
  public static CheckAppCustShareholderMandatoryData = environment.losUrl + "/v1" + "/AppCust/CheckAppCustShareholderMandatoryData";
  public static DeleteAllAppCust = environment.losUrl + "/v1" + "/AppCust/DeleteAllAppCust";
  public static CopyAllExistingCustByAppId = environment.losUrl + "/v1" + "/AppCust/CopyAllExistingCustByAppId";
  public static GetListAppCustCompletion = environment.losUrl + "/v1" + "/AppCust/GetListAppCustCompletion";
  public static GetAppCustAndListFamilyByAppId = environment.losUrl + "/v1" + "/AppCust/GetAppCustAndListFamilyByAppId";
  public static GetAppCustAndListShareholderByAppId = environment.losUrl + "/v1" + "/AppCust/GetAppCustAndListShareholderByAppId";
  public static GetAppCustBankAccAndStatementForView = environment.losUrl + "/v1" + "/AppCustBankAcc/GetAppCustBankAccAndStatementForView";
  public static AddAppCustBankAccAndStmnt = environment.losUrl + "/v1" + "/AppCustBankAcc/AddAppCustBankAccAndStmnt";
  public static EditAppCustBankAccAndStmnt = environment.losUrl + "/v1" + "/AppCustBankAcc/EditAppCustBankAccAndStmnt";
  public static DeleteAppCustBankAccAndStmnt = environment.losUrl + "/v1" + "/AppCustBankAcc/DeleteAppCustBankAccAndStmnt";
  public static GetAppCustBankAccByBankAccNoAndBankCodeAndAppCustId = environment.losUrl + "/v1" + "/AppCustBankAcc/GetAppCustBankAccByBankAccNoAndBankCodeAndAppCustId";
  public static DeleteAppCustBankStmnt = environment.losUrl + "/v1" + "/AppCustBankStmnt/DeleteAppCustBankStmnt";
  public static GetAppCustBankAccByBankAccNoAndAppCustId = environment.losUrl + "/v1" + "/AppCustBankAcc/GetAppCustBankAccByBankAccNoAndAppCustId";
  public static GetCustBankAccByCustIdAndBankAccNo = environment.FoundationR3Url + "/v1" + "/CustBankAcc/GetCustBankAccByCustIdAndBankAccNo";
  public static AddEditNapCust = environment.losUrl + "/v1" + "/Application/AddEditNapCust";

  // APP CUST ATTR CONTENT
  public static GetListAppCustAttrContentByAppCustIdAndAttrGroup = environment.losUrl + "/v1" + "/AppCustAttrContent/GetListAppCustAttrContentByAppCustIdAndAttrGroup"
  public static GetListAppCustAttrContentsByAppCustIdAndAttrGroupAndListAttrCodes = environment.losUrl + "/v1" + "/AppCustAttrContent/GetListAppCustAttrContentsByAppCustIdAndAttrGroupAndListAttrCodes"
  public static GetListAppCustAttrContentsByAppCustIdAndListAttrGroups = environment.losUrl + "/v1" + "/AppCustAttrContent/GetListAppCustAttrContentsByAppCustIdAndListAttrGroups"
  public static GetListAppCustAttrContentForNewNap = environment.losUrl + "/v1" + "/AppCustAttrContent/GetListAppCustAttrContentForNewNap";
  public static GetRuleForAttrContent = environment.FoundationR3Url + '/v1' + "/CustAttrContent/GetRuleForAttrContent";

  // APP CUST ATTR CONTENT
  public static GetListAppCustFinDataAttrContentByAppCustIdAndListAttrGroup = environment.losUrl + "/v1" + "/AppCustFinDataAttrContent/GetListAppCustFinDataAttrContentByAppCustIdAndListAttrGroup";

  // APP CUST OTHER INFO
  public static AddCustCompletionOtherInfo = environment.losUrl + "/v1" + "/AppCustOtherInfo/AddCustCompletionOtherInfo";
  public static EditCustCompletionOtherInfo = environment.losUrl + "/v1" + "/AppCustOtherInfo/EditCustCompletionOtherInfo";
  public static GetAppCustOtherInfoByAppCustId = environment.losUrl + "/v1" + "/AppCustOtherInfo/GetAppCustOtherInfoByAppCustId"

  // APP TC
  public static GetListTCbyAppId = environment.losUrl + "/v1" + "/AppTc/GetListTCbyAppId";
  public static GetListExistingTCbyAppId = environment.losUrl + "/v1" + "/AppTc/GetListExistingTCbyAppId";
  public static GetListNewTCbyAppId = environment.losUrl + "/v1" + "/AppTc/GetListNewTCbyAppId";
  public static DeleteAppTc = environment.losUrl + "/v1" + "/AppTc/DeleteAppTc";
  public static DeleteRangeAppTc = environment.losUrl + "/v1" + "/AppTc/DeleteRangeAppTc";
  public static EditAdditionalTcNew = environment.losUrl + "/v1" + "/AppTc/EditAdditionalTcNew";
  public static AddEditAdditionalTc = environment.losUrl + "/v1" + "/AppTc/AddEditAdditionalTc";

  // App Asset
  public static GetAppAssetListByAgrmntId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetListByAgrmntId";
  public static GetAppAssetByAppId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetDataByAppId";
  public static GetAppAssetListByAppId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetListByAppId";
  public static GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppId";
  public static GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppIdV2 = environment.losUrl + "/v2" + "/AppAsset/GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppId";
  public static GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAgrmntId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAgrmntId";
  public static GetAppAssetListByAgrmntIdForViewAgrmnt = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetListByAgrmntIdForViewAgrmnt";
  public static GetAppAssetListForInsuranceByAppId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetListForInsuranceByAppId"
  public static GetAppAssetListForInsuranceByAgrmntId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetListForInsuranceByAgrmntId"
  public static GetAllAssetDataForPOByAsset = environment.losUrl + "/v1" + "/AppAsset/GetAllAssetDataForPOByAsset";
  public static GetAllAssetDataForPOByAssetV2 = environment.losUrl + "/v2" + "/AppAsset/GetAllAssetDataForPOByAsset";
  public static GetAllAssetDataForPOViewByAsset = environment.losUrl + "/v1" + "/AppAsset/GetAllAssetDataForPOViewByAsset";
  public static GetAllAssetDataForPOMultiAsset = environment.losUrl + "/v1" + "/AppAsset/GetAllAssetDataForPOMultiAsset";
  public static GetAppAssetByAgrmntId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetByAgrmntId";
  public static GetAllAssetDataByAppId = environment.losUrl + "/v1" + "/AppAsset/GetAllAssetDataByAppId";
  public static GetListAllAssetDataByAppId = environment.losUrl + "/v1" + "/AppAsset/GetListAllAssetDataByAppId";
  public static GetAllAssetDataByAppAssetId = environment.losUrl + "/v1" + "/AppAsset/GetAllAssetDataByAppAssetId";
  public static GetListAppAssetByDOHId = environment.losUrl + "/v1" + "/AppAsset/GetListAppAssetByDOHId";
  public static AddEditAllAssetData = environment.losUrl + "/v1" + "/AppAsset/AddEditAllAssetData";
  public static CheckAssetValidationRule = environment.losUrl + "/v1" + "/AppAsset/CheckAssetValidationRule";
  public static DeleteAppAsset = environment.losUrl + "/v1" + "/AppAsset/DeleteAppAsset";
  public static DeleteListAppAsset = environment.losUrl + "/v1" + "/AppAsset/DeleteListAppAsset";
  public static GenerateAppAssetAttr = environment.losUrl + "/v1" + "/AppAsset/GenerateAppAssetAttr";
  public static GenerateAppAssetAttrForEditAppAftApv = environment.losUrl + "/v1" + "/AppAsset/GenerateAppAssetAttrForEditAppAftApv";
  public static GetListAppAssetAccessoryByAppId = environment.losUrl + "/v1" + "/AppAsset/GetListAppAssetAccessoryByAppId";

  //Asset Doc List
  public static GetAppAssetDataByAppId = environment.losUrl + "/v1" + "/AppAsset/GetAppAssetDataByAppId";
  public static GetListAppCollateralForDOView = environment.losUrl + "/v1" + "/AppCollateralDoc/GetListAppCollateralForDOView";

  //Asset Doc List
  public static GetListAssetDocListByAssetTypeCode = environment.FoundationR3Url + "/v1" + "/AssetDocList/GetListAssetDocListByAssetTypeCode";
  public static GetListAppAssetData = environment.losUrl + "/v1" + "/AppAsset/GetListAppAssetData";

  // App Collateral
  public static GetListAppCollateral = environment.losUrl + "/v1" + "/AppCollateral/GetListAppCollateral";
  public static GetListAppCollateralByAppId = environment.losUrl + "/v1" + "/AppCollateral/GetListAppCollateralByAppId";
  public static GetListAdditionalCollateralByAppId = environment.losUrl + "/v1" + "/AppCollateral/GetListAdditionalCollateralByAppId";
  public static DeleteAppCollateral = environment.losUrl + "/v1" + "/AppCollateral/DeleteAppCollateral";
  public static GetRefAttrList = environment.losUrl + "/v1" + "/AppCollateral/GetRefAttrList"
  public static AddEditAllCollateralData = environment.losUrl + "/v1" + "/AppCollateral/AddEditAllCollateralData"
  public static AddExistingAppCollateralData = environment.losUrl + "/v1" + "/AppCollateral/AddExistingAppCollateralData"
  public static GetViewAppCollateralObjByAppId = environment.losUrl + "/v1" + "/AppCollateral/GetViewAppCollateralObjByAppId";
  public static GetViewAppCollateralObjByAgrmntId = environment.losUrl + "/v1" + "/AppCollateral/GetViewAppCollateralObjByAgrmntId";
  public static GetAppCollateralByAppCollateralId = environment.losUrl + "/v1" + "/AppCollateral/GetAppCollateralByAppCollateralId";
  public static GetAppCollateralByAppId = environment.losUrl + "/v1" + "/AppCollateral/GetAppCollateralByAppId";
  public static GetAppCollateralAndRegistrationByAppCollateralId = environment.losUrl + "/v1" + "/AppCollateral/GetAppCollateralAndRegistrationByAppCollateralId";
  public static AddEditAllCollateralDataFactoring = environment.losUrl + "/v1" + "/AppCollateral/AddEditAllCollateralDataFactoring"
  public static GetAppCollateralAttrByAppCollateralId = environment.losUrl + "/v1" + "/AppCollateral/GetAppCollateralAttrByAppCollateralId";
  public static GetAppCollateralListForInsuranceByAppId = environment.losUrl + "/v1" + "/AppCollateral/GetAppCollateralListForInsuranceByAppId";
  public static GetAppCollateralAttrByAppAssetId = environment.losUrl + "/v1" + "/AppCollateral/GetAppCollateralAttrByAppAssetId";
  public static GetListAppCollateralByAgrmntId = environment.losUrl + "/v1" + "/AppCollateral/GetListAppCollateralByAgrmntId";
  public static GetAppCollateralByAgrmntId = environment.losUrl + "/v1" + "/AppCollateral/GetAppCollateralByAgrmntId";
  public static GetListNegativeCollateralByAppId = environment.losUrl + "/v1" + "/AppCollateral/GetListNegativeCollateralByAppId";
  public static GetListExistingAppCollateralWithInsurance = environment.losUrl + "/v1" + "/AppCollateral/GetListExistingAppCollateralWithInsurance";
  public static GetAppCollateralByAppAssetId = environment.losUrl + "/v1" + "/AppCollateral/GetAppCollateralByAppAssetId";
  public static GenerateAppCollateralAttr = environment.losUrl + "/v1" + "/AppCollateral/GenerateAppCollateralAttr";
  public static GenerateAppCollateralAttrV2 = environment.losUrl + "/v2" + "/AppCollateral/GenerateAppCollateralAttr";
  public static GetAppCollateralAccessoriesListByAppCollateralId = environment.losUrl + "/v1" + "/AppCollateral/GetAppCollateralAccessoriesListByAppCollateralId";

  // App Collateral Suppl Emp
  public static GetListAppAssetSupplEmpByAppAssetId = environment.losUrl + "/v1" + "/AppAssetSupplEmp/GetListAppAssetSupplEmpByAppAssetId";
  public static AddEditAllCollateralDataByAppCollateraId = environment.losUrl + "/v1" + "/AppCollateral/AddEditAllCollateralDataByAppCollateraId";

  // App Collateral Registration
  public static GetAppCollateralRegistrationByAppCollateralId = environment.losUrl + "/v1" + "/AppCollateralRegistration/GetAppCollateralRegistrationByAppCollateralId";

  // App Collateral Doc
  public static GetListAppCollateralDocsByAppCollateralId = environment.losUrl + "/v1" + "/AppCollateralDoc/GetListAppCollateralDocsByAppCollateralId";
  public static CheckAppCollateralDocValidityByListAppAssetId = environment.losUrl + "/v1" + "/AppCollateralDoc/CheckAppCollateralDocValidityByListAppAssetId";

  //AGRMNT SIGNER
  public static SubmitAgrmntSignerData = environment.losUrl + "/v1" + "/AgrmntSigner/SubmitAgrmntSignerData";
  public static SubmitAgrmntSignerDataV2 = environment.losUrl + "/v2" + "/AgrmntSigner/SubmitAgrmntSignerData";
  public static EditAgrmntSignerData = environment.losUrl + "/v1" + "/AgrmntSigner/EditAgrmntSignerData";
  public static EditAgrmntSignerDataV2 = environment.losUrl + "/v2" + "/AgrmntSigner/EditAgrmntSignerData";
  public static GetAgrmntSignerByAgrmntId = environment.losUrl + "/v1" + "/AgrmntSigner/GetAgrmntSignerByAgrmntId";

  //AGRMNT FIN DATA
  public static GetAgrmntFinDataByAgrmntId = environment.losUrl + "/v1" + "/AgrmntFinData/GetAgrmntFinDataByAgrmntId";
  public static GetFinancialDataByAgrmntIdForView = environment.losUrl + "/v1" + "/AgrmntFinData/GetFinancialDataByAgrmntIdForView";

  // LEAD FRAUD VERF
  public static AddLeadFraudVerf = environment.losUrl + "/v1" + "/LeadFraudVerf/AddLeadFraudVerf";
  public static AddNewLeadFraudVerf = environment.losUrl + "/v1" + "/LeadFraudVerf/AddNewLeadFraudVerf";
  public static AddNewLeadFraudVerfV2 = environment.losUrl + "/v2" + "/LeadFraudVerf/AddNewLeadFraudVerf";
  public static GetListLeadForLeadVerfObj = environment.losUrl + "/v1" + "/LeadVerf/GetListLeadForLeadVerfObj";
  public static GetDoubleFinancingCheckAppAsset = environment.losUrl + "/v1" + "/FraudDetection/GetDoubleFinancingCheckAppAsset";
  public static GetDoubleFinancingCheckAppAssetV2 = environment.losUrl + "/v2" + "/FraudDetection/GetDoubleFinancingCheckAppAsset";
  public static GetDoubleFinancingCheckAppAssetV2_1 = environment.losUrl + "/v2.1" + "/FraudDetection/GetDoubleFinancingCheckAppAsset";

  //LEAD VERF
  public static AddRangeLeadVerf = environment.losUrl + "/v1" + "/LeadVerf/AddRangeLeadVerf";
  public static AddRangeLeadVerfV2 = environment.losUrl + "/v2" + "/LeadVerf/AddRangeLeadVerf";
  public static GetListLeadVerf = environment.losUrl + "/v1" + "/LeadVerf/GetListLeadVerf";

  //APP TC
  public static GetListTCbyAppIdFromRule = environment.losUrl + "/v1" + "/AppTc/GetListTCbyAppIdFromRule";
  public static AddAppTc = environment.losUrl + "/v1" + "/AppTc/AddAppTc";
  public static EditAppTc = environment.losUrl + "/v1" + "/AppTc/EditAppTc";
  public static SubmitOutstandingTc = environment.losUrl + "/v1" + "/AppTc/SubmitOutstandingTc";

  //AGRMNT
  public static GetAgrmntByAgrmntId = environment.losUrl + "/v1" + "/Agrmnt/GetAgrmntByAgrmntId";
  public static GetAgrmntByAppId = environment.losUrl + "/v1" + "/Agrmnt/GetAgrmntByAppId";
  public static GetAgrmntByAgrmntNo = environment.losUrl + "/v1" + "/Agrmnt/GetAgrmntByAgrmntNo";
  public static GetAgrmtSummaryByAgrmntId = environment.losUrl + "/v1" + "/Agrmnt/GetAgrmtSummaryByAgrmntId";
  public static GetListAgrmntByAppId = environment.losUrl + "/v1" + "/Agrmnt/GetListAgrmntByAppId";

  //AGRMNT Commission
  public static GetListAgrmntCommissionWithDetailByAgrmntId = environment.losUrl + "/v1" + "/AgrmntCommission/GetListAgrmntCommissionWithDetailByAgrmntId";

  //REF TC
  public static GetRefTcByCode = environment.FoundationR3Url + "/v1" + "/RefTc/GetRefTcByCode";
  public static GetListRefTcByTcCode = environment.FoundationR3Url + "/v1" + "/RefTc/GetListRefTcByTcCode";
  public static GetListActiveRefTc = environment.FoundationR3Url + "/v1" + "/RefTc/GetListActiveRefTc";
  public static GetListRefTcCompany = environment.FoundationR3Url + "/v1" + "/RefTc/GetListRefTcCompany";
  public static GetListRefTcPersonal = environment.FoundationR3Url + "/v1" + "/RefTc/GetListRefTcPersonal";

  //APP INSURANCE
  public static GetInsuranceDataByAppId = environment.losUrl + "/v1" + "/AppIns/GetInsDataByAppId";
  public static GetInsuranceDataByAppIdForView = environment.losUrl + "/v1" + "/AppIns/GetInsDataByAppIdForView";
  public static GetInsuranceDataByAppAssetIdForView = environment.losUrl + "/v1" + "/AppIns/GetInsDataByAppAssetIdForView";
  public static GetInsDataByAppIdAndAssetId = environment.losUrl + "/v1" + "/AppIns/GetInsDataByAppIdAndAssetId";
  public static GetInsDataByAppAssetId = environment.losUrl + "/v1" + "/AppIns/GetInsDataByAppAssetId";
  public static AddEditInsuranceData = environment.losUrl + "/v1" + "/AppIns/AddEditInsuranceData";
  public static AddInsuranceData = environment.losUrl + "/v1" + "/AppIns/AddInsuranceData";
  public static EditInsuranceData = environment.losUrl + "/v1" + "/AppIns/EditInsuranceData";
  public static AddInsuranceDataMultiAsset = environment.losUrl + "/v1" + "/AppIns/AddInsuranceDataMultiAsset";
  public static EditInsuranceDataMultiAsset = environment.losUrl + "/v1" + "/AppIns/EditInsuranceDataMultiAsset";
  public static GetListAppInsObjByAppIdForView = environment.losUrl + "/v1" + "/AppIns/GetListAppInsObjByAppIdForView";
  public static GetListAppInsObjByAgrmntIdForView = environment.losUrl + "/v1" + "/AppIns/GetListAppInsObjByAgrmntIdForView";
  public static GetAppInsObjViewDetail = environment.losUrl + "/v1" + "/AppIns/GetAppInsObjViewDetail";
  public static GetListCollateralAppInsObjForViewByAppId = environment.losUrl + "/v1" + "/AppIns/GetListCollateralAppInsObjForViewByAppId";
  public static GetListAppCollateralForCopyInsuranceByAppId = environment.losUrl + "/v1" + "/AppIns/GetListAppCollateralForCopyInsuranceByAppId";
  public static GetListInsuranceDataForCopyInsuranceByAppId = environment.losUrl + "/v1" + "/AppIns/GetListInsuranceDataForCopyInsuranceByAppId";
  public static CopyInsuranceData = environment.losUrl + "/v1" + "/AppIns/CopyInsuranceData";
  public static DeleteListInsuranceData = environment.losUrl + "/v1" + "/AppIns/DeleteListInsuranceData";

  //APP INSURANCE
  public static ExecuteInsRateRule = environment.losUrl + "/v1" + "/AppIns/ExecuteInsRateRule";
  public static ExecuteInsRateRuleV2 = environment.losUrl + "/v2" + "/AppIns/ExecuteInsRateRule";
  public static CalculateInsurance = environment.losUrl + "/v1" + "/AppIns/CalculateInsurance";
  public static GetCuCoInsLength = environment.losUrl + "/v1" + "/AppIns/GetCuCoInsLength";
  public static ExecuteInsRateCvgRule = environment.losUrl + "/v1" + "/AppIns/ExecuteInsRateCvgRule";
  public static ExecuteInsRateCvgRuleV2_1 = environment.losUrl + "/v2.1" + "/AppIns/ExecuteInsRateCvgRule";
  

  //AGREEMENT DOC
  public static GetListAgrmntDocByAgrmntId = environment.losUrl + "/v1" + "/AgrmntDoc/GetListAgrmntDocByAgrmntId"
  public static GetAgrmntDocDataByAgrmntDocId = environment.losUrl + "/v1" + "/AgrmntDoc/GetAgrmntDocDataByAgrmntDocId"
  public static EditAgrmntDoc = environment.losUrl + "/v1" + "/AgrmntDoc/EditAgrmntDoc"

  //AGREEMENT DOC PRINT
  public static AddAgrmntDocPrint = environment.losUrl + "/v1" + "/AgrmntDocPrint/AddAgrmntDocPrint"
  public static GetListAgrmntDocPrintByAgrmntId = environment.losUrl + "/v1" + "/AgrmntDocPrint/GetListAgrmntDocPrintByAgrmntId"

  //CREDIT APV RESULT EXTENSION
  public static SubmitNewExpDate = environment.losUrl + "/v1" + "/PurchaseOrderH/SubmitNewExpDate";
  public static SubmitReqNewExpDateApv = environment.losUrl + "/v1" + "/PurchaseOrderH/SubmitReqNewExpDateApv";
  public static SubmitReqNewExpDateApvV2 = environment.losUrl + "/v2" + "/PurchaseOrderH/SubmitReqNewExpDateApv";
  public static GetCreditApvResultExtMainData = environment.losUrl + "/v1" + "/PurchaseOrderH/GetCreditApvResultExtMainData";

  //VERF
  public static GetVerfQuestionAnswerListBySchemeCode = environment.FoundationR3Url + "/v1" + "/VerfQuestionAnswer/GetVerfQuestionAnswerListByVerfSchemeCode"

  // VERF RESULT
  public static GetVerfResultById = environment.FoundationR3Url + "/v1" + "/VerfResult/GetVerfResultById";
  public static AddVerfResultAndVerfResultH = environment.FoundationR3Url + "/v1" + "/VerfResult/AddVerfResultAndVerfResultH";
  public static GetVerfResultHById = environment.FoundationR3Url + "/v1" + "/VerfResultH/GetVerfResultHById";
  public static GetVerfResultHsByTrxRefNoAndMrVerfTrxTypeCodeAndMrVerfObjCode = environment.FoundationR3Url + "/v1" + "/VerfResultH/GetVerfResultHsByTrxRefNoAndMrVerfTrxTypeCodeAndMrVerfObjCode";
  public static GetVerfResultHsByTrxRefNo = environment.FoundationR3Url + "/v1" + "/VerfResultH/GetVerfResultHsByTrxRefNo";
  public static GetVerfResultHsByVerfResultIdAndSubjRelationCode = environment.FoundationR3Url + "/v1" + "/VerfResultH/GetVerfResultHsByVerfResultIdAndSubjRelationCode";
  public static GetListVerfResultDInQuestionGrp = environment.FoundationR3Url + "/v1" + "/VerfResultD/GetListVerfResultDInQuestionGrp";
  public static AddVerfResultHeaderAndVerfResultDetail = environment.FoundationR3Url + "/v1" + "/VerfResultH/AddVerfResultHeaderAndVerfResultDetail";
  public static GetVerfResultByTrxRefNoAndVerfTrxTypeCode = environment.FoundationR3Url + "/v1" + "/VerfResult/GetVerfResultByTrxRefNoAndVerfTrxTypeCode";
  public static AddVerfResult = environment.FoundationR3Url + "/v1" + "/VerfResult/AddVerfResult";
  public static GetVerfResultHsByVerfResultIdAndObjectCode = environment.FoundationR3Url + "/v1" + "/VerfResultH/GetVerfResultHsByVerfResultIdAndObjectCode";

  //CUST CONFIRM
  public static GetVerfQuestionAnswerListByAppIdAndSubject = environment.losUrl + "/v1" + "/CustCnfrm/GetVerfQuestionAnswerListByAppIdAndSubject";
  public static AddCustCnfrm = environment.losUrl + "/v1" + "/CustCnfrm/AddCustCnfrm";
  public static AddCustCnfrmV2 = environment.losUrl + "/v2" + "/CustCnfrm/AddCustCnfrm";

  //REF STATUS
  public static GetListActiveRefStatusByStatusGrpCode = environment.FoundationR3Url + "/v1" + "/RefStatus/GetListKeyValueActiveGrpCodeByCode";

  //AGRMNT ACTIVATION
  public static GetAppAssetByAppIdAndCriteria = environment.losUrl + "/v1" + "/AgrmntActivation/GetAppAssetByAppIdAndCriteria";
  public static GetAppFinDataAndFeeByAppIdAndListAppAssetId = environment.losUrl + "/v1" + "/AgrmntActivation/GetAppFinDataAndFeeByAppIdAndListAppAssetId";
  public static SubmitAgrmntActivationByHuman = environment.losUrl + "/v1" + "/AgrmntActivation/SubmitAgrmntActivationByHuman";
  public static SubmitAgrmntActivationByHumanV2 = environment.losUrl + "/v2" + "/AgrmntActivation/SubmitAgrmntActivationByHuman";
  public static SubmitAgrmntActivationByHumanV2_1 = environment.losUrl + "/v2.1" + "/AgrmntActivation/SubmitAgrmntActivationByHuman";
  public static SubmitAgrmntActivationByHumanV2_2 = environment.losUrl + "/v2.2" + "/AgrmntActivation/SubmitAgrmntActivationByHuman";

  //Asset Accessory
  // public static GetAssetAccessoryByCode = "http://localhost:5000/AssetAccessory/GetAssetAccessoryByCode";

  //App Fee
  // public static GetListAppFeeByAppId = "http://localhost:5001/AppFee/GetListAppFeeByAppId";

  //App Reserved Fund
  // public static AddEditAppReservedFund = "http://localhost:5001/AppReservedFund/AddEditAppReservedFund";
  // public static GetListAppReservedFundByAppId = "http://localhost:5001/AppReservedFund/GetListAppReservedFundByAppId";
  // public static CreateRsvFundRule = "http://localhost:5001/AppReservedFund/CreateRsvFundRule";

  //App Fin Data
  // public static GetAppFinDataByAppId = "http://localhost:5001/AppFinData/GetAppFinDataByAppId";
  // public static CreateMaxAllocAmtRsvFund = "http://localhost:5001/AppFinData/CreateMaxAllocAmtRsvFund";

  //App Invoice Fctr
  public static AddAppInvoiceFctr = environment.losUrl + "/v1" + "/AppInvoiceFctr/AddAppInvoiceFctr";
  public static EditAppInvoiceFctr = environment.losUrl + "/v1" + "/AppInvoiceFctr/EditAppInvoiceFctr";
  public static DeleteAppInvoiceFctr = environment.losUrl + "/v1" + "/AppInvoiceFctr/DeleteAppInvoiceFctr";
  public static GetAppInvoiceFctrByAppInvoiceFctrId = environment.losUrl + "/v1" + "/AppInvoiceFctr/GetAppInvoiceFctrByAppFctrId";
  public static GetListAppInvoiceFctrByAppFctrId = environment.losUrl + "/v1" + "/AppInvoiceFctr/GetListAppInvoiceFctrByAppFctrId";
  public static GetListAppInvoiceFctrByAgrmntId = environment.losUrl + "/v1" + "/AppInvoiceFctr/GetListAppInvoiceFctrByAgrmntId";

  public static GetAppFinDataWithRuleByAppId = environment.losUrl + "/v1" + "/AppFinData/GetAppFinDataWithRuleByAppId";

  // App Invoice
  public static AddAppInvoiceDlrFncngH = environment.losUrl + "/v1" + "/AppInvoice/AddAppInvoiceDlrFncngH";
  public static EditAppInvoiceDlrFncngH = environment.losUrl + "/v1" + "/AppInvoice/EditAppInvoiceDlrFncngH";
  public static DeleteAppInvoiceDlrFncngHById = environment.losUrl + "/v1" + "/AppInvoice/DeleteAppInvoiceDlrFncngHById";
  public static GetAppInvoiceDlrFncngHByAppInvoiceDlrFncngHId = environment.losUrl + "/v1" + "/AppInvoice/GetAppInvoiceDlrFncngHByAppInvoiceDlrFncngHId";
  public static AddAppInvoiceDlrFncngD = environment.losUrl + "/v1" + "/AppInvoice/AddAppInvoiceDlrFncngD";
  public static EditAppInvoiceDlrFncngD = environment.losUrl + "/v1" + "/AppInvoice/EditAppInvoiceDlrFncngD";
  public static DeleteAppInvoiceDlrFncngDById = environment.losUrl + "/v1" + "/AppInvoice/DeleteAppInvoiceDlrFncngDById";
  public static AppInvoiceDlrFncngHByAppDlrFncngId = environment.losUrl + "/v1" + "/AppInvoice/AppInvoiceDlrFncngHByAppDlrFncngId";
  public static GetListAppInvoiceDlrFncngHByAppInvoiceDlrFncngHId = environment.losUrl + "/v1" + "/AppInvoice/GetListAppInvoiceDlrFncngHByAppInvoiceDlrFncngHId";
  public static AddEditDisbInfo = environment.losUrl + "/v1" + "/AppInvoice/AddEditDisbInfo";
  public static GetListAppInvoiceAppInvoiceDlrFncngHByAppId = environment.losUrl + "/v1" + "/AppInvoice/GetListAppInvoiceAppInvoiceDlrFncngHByAppId";
  public static UpdateAppInvoiceDlfn = environment.losUrl + "/v1" + "/AppInvoice/UpdateAppInvoiceDlfn";
  public static UpdateAppInvoiceDlfnV2 = environment.losUrl + "/v2" + "/AppInvoice/UpdateAppInvoiceDlfn";
  public static UpdateAppInvoiceDlfnV2_1 = environment.losUrl + "/v2.1" + "/AppInvoice/UpdateAppInvoiceDlfn";
  public static GetDisbInfoByAppId = environment.losUrl + "/v1" + "/AppInvoice/GetDisbInfoByAppId";
  public static CekDifInvoiceAmountByAppId = environment.losUrl + "/v1" + "/AppInvoice/CekDifInvoiceAmountByAppId";
  public static GetAllNtfAppAmtByMouCustId = environment.losUrl + "/v1" + "/AppInvoice/GetAllNtfAppAmtByMouCustId";

  //app invoice x
  public static GetListAppInvoiceXAppInvoiceDlrFncngHByAppId = environment.losUrl + "/v1" + "/AppInvoiceX/GetListAppInvoiceAppInvoiceDlrFncngHByAppId";

  //App Cust Addr
  public static AddAppCustAddr = environment.losUrl + "/v1" + "/AppCustAddr/AddAppCustAddr";
  public static EditAppCustAddr = environment.losUrl + "/v1" + "/AppCustAddr/EditAppCustAddr";
  public static GetListAppCustAddrByAppId = environment.losUrl + "/v1" + "/AppCustAddr/GetListAppCustAddrByAppId";
  public static GetAppCustAddrByAppCustAddrId = environment.losUrl + "/v1" + "/AppCustAddr/GetAppCustAddrByAppCustAddrId"
  public static GetListAppCustAddrByAppCustId = environment.losUrl + "/v1" + "/AppCustAddr/GetListAppCustAddrByAppCustId";
  public static GetListAppCustAddrDataForCopyByAppCustId = environment.losUrl + "/v1" + "/AppCustAddr/GetListAppCustAddrDataForCopyByAppCustId";
  public static GetListAppCustAddrDataForCopyByAppId = environment.losUrl + "/v1" + "/AppCustAddr/GetListAppCustAddrDataForCopyByAppId";
  public static GetAppCustAddrCustomerByAppIdAndMrAddrTypeCode = environment.losUrl + "/v1" + "/AppCustAddr/GetAppCustAddrCustomerByAppIdAndMrAddrTypeCode";
  public static GetListAppCustAddrByAppCustIdForDocPickupRequest = environment.losUrl + "/v1" + "/AppCustAddr/GetListAppCustAddrByAppCustIdForDocPickupRequest";

  //App Fee
  public static GetListAppFeeByAppId = environment.losUrl + "/v1" + "/AppFee/GetListAppFeeByAppId";
  public static GetListAppFeeForTrialCalc = environment.losUrl + "/v1" + "/AppFee/GetListAppFeeForTrialCalc";
  public static GetListAppFeeAndMouFeeByAppId = environment.losUrl + "/v1" + "/AppFee/GetListAppFeeAndMouFeeByAppId";

  //App Reserved Fund
  public static AddEditAppReservedFund = environment.losUrl + "/v1" + "/AppReservedFund/AddEditAppReservedFund";
  public static AddEditAppReservedFundV2 = environment.losUrl + "/v2" + "/AppReservedFund/AddEditAppReservedFund";
  public static GetListAppReservedFundByAppId = environment.losUrl + "/v1" + "/AppReservedFund/GetListAppReservedFundByAppId";
  public static CreateRsvFundRule = environment.losUrl + "/v1" + "/AppReservedFund/CreateRsvFundRule";
  public static CalculateGrossYieldRsvFund = environment.losUrl + "/v1" + "/AppReservedFund/CalculateGrossYieldRsvFund";
  public static GetIncomeInfoRsvFund = environment.losUrl + "/v1" + "/AppReservedFund/GetIncomeInfoRsvFund";

  //App Fin Data
  public static GetAppFinDataByAppId = environment.losUrl + "/v1" + "/AppFinData/GetAppFinDataByAppId";
  public static CreateMaxAllocAmtRsvFund = environment.losUrl + "/v1" + "/AppFinData/CreateMaxAllocAmtRsvFund";
  public static CalculateInstallmentStepUpStepDown = environment.losUrl + "/v1" + "/AppFinData/CalculateInstallmentStepUpStepDown";
  public static CalculateInstallmentEvenPrincipal = environment.losUrl + "/v1" + "/AppFinData/CalculateInstallmentEvenPrincipal";
  public static CalculateInstallmentBalloon = environment.losUrl + "/v1" + "/AppFinData/CalculateInstallmentBalloon";
  public static CalculateIrregular = environment.losUrl + "/v1" + "/AppFinData/CalculateIrregular";
  public static CalculateInstallmentRegularFix = environment.losUrl + "/v1" + "/AppFinData/CalculateInstallmentRegularFix";
  public static CalculateInstallmentStepUpStepDownForTrialCalc = environment.losUrl + "/v1" + "/AppFinData/CalculateInstallmentStepUpStepDownForTrialCalc";
  public static CalculateInstallmentEvenPrincipalForTrialCalc = environment.losUrl + "/v1" + "/AppFinData/CalculateInstallmentEvenPrincipalForTrialCalc";
  public static CalculateInstallmentBalloonForTrialCalc = environment.losUrl + "/v1" + "/AppFinData/CalculateInstallmentBalloonForTrialCalc";
  public static CalculateIrregularForTrialCalc = environment.losUrl + "/v1" + "/AppFinData/CalculateIrregularForTrialCalc";
  public static CalculateInstallmentRegularFixForTrialCalc = environment.losUrl + "/v1" + "/AppFinData/CalculateInstallmentRegularFixForTrialCalc";
  public static GetFinancialDataByAppIdForView = environment.losUrl + "/v1" + "/AppFinData/GetFinancialDataByAppIdForView";
  public static GetInitAppFinDataFctrByAppId = environment.losUrl + "/v1" + "/AppFinData/GetInitAppFinDataFctrByAppId";
  public static GetInitAppFinDataFctrByAppIdV2 = environment.losUrl + "/v2" + "/AppFinData/GetInitAppFinDataFctrByAppId";
  public static CalculateInstallmentRegularFixFctr = environment.losUrl + "/v1" + "/AppFinData/CalculateInstallmentRegularFixFctr";
  public static SaveAppFinDataFctr = environment.losUrl + "/v1" + "/AppFinData/SaveAppFinDataFctr";
  public static SaveAppFinData = environment.losUrl + "/v1" + "/AppFinData/SaveAppFinData";
  public static CalculateInstallmentEvenPrincipalFctr = environment.losUrl + "/v1" + "/AppFinData/CalculateInstallmentEvenPrincipalFctr";
  public static CalculateInstallmentEvenPrincipalDlfn = environment.losUrl + "/v1" + "/AppFinData/CalculateInstallmentEvenPrincipalDlfn";
  public static CalculateSingleInst = environment.losUrl + "/v1" + "/AppFinData/CalculateSingleInst";
  public static CalculateSingleInstDlfn = environment.losUrl + "/v1" + "/AppFinData/CalculateSingleInstDlfn";
  public static CalculateProvisionFee = environment.losUrl + "/v1" + "/AppFee/CalculateProvisionFee";
  public static GetOrInitAppSubsidyByAppId = environment.losUrl + "/v1" + "/AppSubsidy/GetOrInitAppSubsidyByAppId";
  public static GetOrInitAppSubsidyByAppIdV2 = environment.losUrl + "/v2" + "/AppSubsidy/GetOrInitAppSubsidyByAppId";
  public static GetRuleSubsidyMax = environment.losUrl + "/v1" + "/AppSubsidy/GetRuleSubsidyMax";
  public static GetRuleSubsidyMaxV2 = environment.losUrl + "/v2" + "/AppSubsidy/GetRuleSubsidyMax";
  public static GetInitAppFinDataByAppId = environment.losUrl + "/v1" + "/AppFinData/GetInitAppFinDataByAppId";
  public static GetInitAppFinDataByAppIdV2 = environment.losUrl + "/v2" + "/AppFinData/GetInitAppFinDataByAppId";
  public static GetInitFinDataForTrialCalc = environment.losUrl + "/v1" + "/AppFinData/GetInitFinDataForTrialCalc";
  public static GetAppSubsidyByAppSubsidyId = environment.losUrl + "/v1" + "/AppSubsidy/GetAppSubsidyByAppSubsidyId";
  public static AddAppSubsidy = environment.losUrl + "/v1" + "/AppSubsidy/AddSubsidy";
  public static AddAppSubsidyV2 = environment.losUrl + "/v2" + "/AppSubsidy/AddSubsidy";
  public static EditAppSubsidy = environment.losUrl + "/v1" + "/AppSubsidy/EditAppSubsidy";
  public static EditAppSubsidyV2 = environment.losUrl + "/v2" + "/AppSubsidy/EditAppSubsidy";

  public static GetInitAppFinDataDFByAppId = environment.losUrl + "/v1" + "/AppFinData/GetInitAppFinDataDFByAppId";
  public static GetInitAppFinDataDFByAppIdV2 = environment.losUrl + "/v2" + "/AppFinData/GetInitAppFinDataDFByAppId";
  public static SaveAppFinDataDF = environment.losUrl + "/v1" + "/AppFinData/SaveAppFinDataDF";
  //Fraud Detection
  public static GetAppDupCheckCustByAppId = environment.losUrl + "/v1" + "/FraudDetection/GetAppDupCheckCustByAppId";
  public static GetFraudDukcapilByIdNo = environment.losUrl + "/v1" + "/FraudDetection/GetFraudDukcapilByIdNo";
  public static AddAppFraudVerf = environment.losUrl + "/v1" + "/FraudDetection/AddAppFraudVerf";
  public static GetListAppNegativeCheckCustByAppId = environment.losUrl + "/v1" + "/AppDupCheck/GetListAppNegativeCheckCustByAppId";
  public static GetAppFraudVerificationByAppId = environment.losUrl + "/v1" + "/FraudDetection/GetAppFraudVerificationByAppId";
  public static GetDoubleFinancingCheckInvoiceDlrFncngD = environment.losUrl + "/v1" + "/FraudDetection/GetDoubleFinancingCheckInvoiceDlrFncngD";
  public static GetDoubleFinancingCheckInvoiceDlrFncngDV2 = environment.losUrl + "/v2" + "/FraudDetection/GetDoubleFinancingCheckInvoiceDlrFncngD";

  //Fraud Verif
  public static SurveyFraudAppCheckingValidationForFraudVerif = environment.losUrl + "/v1" + "/Application/SurveyFraudAppCheckingValidationForFraudVerif";

  //Inst table
  public static GetAppInstSchldTableByAppId = environment.losUrl + "/v1" + "/AppInstSchdl/GetAppInstSchldTableByAppId"
  public static GetAppInsStepSchmForSUSDByAppId = environment.losUrl + "/v1" + "/AppInstSchdl/GetAppInsStepSchmForSUSDByAppId"

  //CUSTOMER DUPLICATE CHECKING
  public static GetCustomerAndNegativeCustDuplicateCheck = environment.FoundationR3Url + "/v1" + "/CustDuplicateCheck/GetCustomerAndNegativeCustDuplicateCheck";
  public static GetCustomerDuplicateCheck = environment.FoundationR3Url + "/v1" + "/CustDuplicateCheck/GetCustomerDuplicateCheck";
  public static GetNegativeCustomerDuplicateCheck = environment.FoundationR3Url + "/v1" + "/CustDuplicateCheck/GetNegativeCustomerDuplicateCheck";

  // ASSET NEGATIVE DUPLICATE CHECK
  public static GetAssetNegativeDuplicateCheck = environment.FoundationR3Url + "/v1" + "/AssetNegative/GetAssetNegativeDuplicateCheck";
  public static GetAssetNegativeDuplicateCheckByListOfAsset = environment.FoundationR3Url + "/v1" + "/AssetNegative/GetAssetNegativeDuplicateCheckByListOfAsset"

  //App Duplicate Checking
  public static GetAppCustDuplicateCheck = environment.losUrl + "/v1" + "/AppDupCheck/GetAppCustDuplicateCheck";
  public static GetSpouseDuplicateCheck = environment.losUrl + "/v1" + "/AppDupCheck/GetSpouseDuplicateCheck";
  public static GetAppShareholderDuplicateCheck = environment.losUrl + "/v1" + "/AppDupCheck/GetAppShareholderDuplicateCheck";
  public static AddAppDupCheckCust = "/AppDupCheck/AddAppDupCheckCust";
  public static EditCustNoAppCust = environment.losUrl + "/v1" + "/AppDupCheck/EditCustNoAppCust";
  public static SubmitAppDupCheck = environment.losUrl + "/v1" + "/AppDupCheck/SubmitAppDupCheck";

  //Cust Main Data Dup Checking
  public static MD_GetSubjectDuplicateCheckByAppId = environment.losUrl + "/v1" + "/AppDupCheckMainData/GetSubjectDuplicateCheckByAppId";
  public static MD_GetAppCustDuplicateCheck = environment.losUrl + "/v1" + "/AppDupCheckMainData/GetAppCustDuplicateCheck";
  public static MD_EditApplicantNoCustNoAppCust = environment.losUrl + "/v1" + "/AppDupCheckMainData/EditApplicantNoCustNoAppCust";
  public static MD_SubmitAppDupCheck = environment.losUrl + "/v1" + "/AppDupCheckMainData/SubmitAppDupCheck";
  public static MD_SubmitAppDupCheckV2 = environment.losUrl + "/v2" + "/AppDupCheckMainData/SubmitAppDupCheck";

  // Product Offering
  public static GetListProdOfferingDByProdOfferingCode = environment.FoundationR3Url + "/v1" + "/ProductOffering/GetListProdOfferingDByProdOfferingCode";
  public static GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode = environment.losUrl + "/v1" + "/ProductOffering/GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode";
  public static GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL = environment.losUrl + "/v1" + "/ProductOffering/GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL";
  public static GetCurrentProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL = environment.losUrl + "/v1" + "/ProductOffering/GetCurrentProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL";
  public static GetPayFreqByProdOfferingD = environment.losUrl + "/v1" + "/ProductOffering/GetPayFreqByProdOfferingD";
  public static GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion = environment.losUrl + "/v1" + "/ProductOffering/GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion";
  public static GetProdStatByProdOffCodeAndVersion = environment.losUrl + "/v1" + "/ProductOffering/GetProdStatByProdOffCodeAndVersion";
  public static GetProdOfferingHByCode = environment.losUrl + "/v1" + "/ProductOffering/GetProdOfferingHByCode";

  //Ref Pay Freq
  public static GetPayFreqByProdOfferingCodeandRefProdCompntCode = environment.FoundationR3Url + "/v1" + "/RefPayFreq/GetPayFreqByProdOfferingCodeandRefProdCompntCode";
  public static GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat = environment.losUrl + "/v1" + "/ProductOffering/GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat";

  // ASSET TYPE
  public static GetAssetTypeById = environment.FoundationR3Url + "/v1" + "/AssetType/GetAssetTypeById";
  public static GetListAssetTypeByCode = environment.FoundationR3Url + "/v1" + "/AssetType/GetListKeyValueActiveByCode";
  public static GetListSerialNoLabelByAssetTypeCode = environment.FoundationR3Url + "/v1" + "/AssetType/GetListSerialNoLabelByAssetTypeCode"

  //App Crd Invstg
  public static AddAppCrdInvstg = environment.losUrl + "/v1" + "/AppCrdInvstgH/AddAppCrdInvstg";
  public static AddEditAppCrdInvstg = environment.losUrl + "/v1" + "/AppCrdInvstgH/AddEditAppCrdInvstg";

  public static GetAppCrdInvstgByAppId = environment.losUrl + "/v1" + "/AppCrdInvstgH/GetAppCrdInvstgByAppId";

  // APP SUBSIDY
  public static GetListAppSubsidyByAppId = environment.losUrl + "/v1" + "/AppSubsidy/GetListAppSubsidyByAppId";
  public static GetListSubsidyFromValue = environment.losUrl + "/v1" + "/AppSubsidy/GetListSubsidyFromValue";
  public static GetListSubsidyFromTypeCode = environment.losUrl + "/v1" + "/AppSubsidy/GetListSubsidyFromTypeCode";
  public static GetListSubsidyAllocation = environment.losUrl + "/v1" + "/AppSubsidy/GetListSubsidyAllocation";
  public static GetListSubsidySource = environment.losUrl + "/v1" + "/AppSubsidy/GetListSubsidySource";
  public static GetListSubsidyValueType = environment.losUrl + "/v1" + "/AppSubsidy/GetListSubsidyValueType";
  public static DeleteSubsidy = environment.losUrl + "/v1" + "/AppSubsidy/DeleteSubsidy";

  // ASSET TYPE
  // public static GetAssetTypeById = environment.FoundationR3Url + "/v1" + "/AssetType/GetAssetTypeById"

  // List Approver
  public static GetApprovedBy = environment.ApprovalR3Url + "/api/RFAWeb/GetApprovedBy/";
  public static GetRecommendations = environment.ApprovalR3Url + "/api/RFAWeb/GetRecommendations/";
  public static GetAdtQuestionByTrxNo = environment.FoundationR3Url + "/v1" + "/Approval/GetAdtQuestionByTrxNo"

  public static ApvHoldTaskUrl = environment.FoundationR3Url + "/v1" + "/Approval/Hold";
  public static ApvTakeBackTaskUrl = environment.FoundationR3Url + "/v1" + "/Approval/TakeBack";

  // PreGoLive
  public static GetListApprovedByForPreGoLive = environment.losUrl + "/v1" + "/PreGoLive/GetListApprovedByForPreGoLive";
  public static AddPreGoLive = environment.losUrl + "/v1" + "/PreGoLive/AddPreGoLive";
  public static AddPreGoLiveV2 = environment.losUrl + "/v2" + "/PreGoLive/AddPreGoLive";
  public static CreateRFAPreGoLive = environment.losUrl + "/v1" + "/PreGoLive/CreateRFAPreGoLive";
  public static CreateRFAPreGoLiveNew = environment.losUrl + "/v1" + "/PreGoLive/CreateRFAPreGoLiveNew";
  public static CreateRFAPreGoLiveNewV2 = environment.losUrl + "/v2" + "/PreGoLive/CreateRFAPreGoLiveNew";

  // Survey or Srvy
  public static GetListSrvyTaskAndOrderByTrxNoAndMrSurveySourceCode = environment.FoundationR3Url + "/v1" + "/SrvyTask/GetListSrvyTaskAndOrderByTrxNoAndMrSurveySourceCode";
  public static GetSrvyResultDataByTrxRefNo = environment.losUrl + "/v1" + "/MouCustSrvyOrder/GetSrvyResultDataByTrxRefNo";
  public static GetSrvyOrderBySrvyOrderNo = environment.FoundationR3Url + "/v1" + "/SrvyOrder/GetSrvyOrderBySrvyOrderNo";
  public static GetSrvyOrderByTrxRefNoAndSrvySourceCode = environment.FoundationR3Url + "/v1" + "/SrvyOrder/GetSrvyOrderByTrxRefNoAndSrvySourceCode";
  public static GetSrvyDataBySrvyOrderId = environment.FoundationR3Url + "/v1" + "/SrvyData/GetSrvyDataBySrvyOrderId";
  public static GetListSrvyTaskBySrvyOrderId = environment.FoundationR3Url + "/v1" + "/SrvyTask/GetListSrvyTaskBySrvyOrderId";
  public static GetSrvyTaskBySrvyTaskNo = environment.FoundationR3Url + "/v1" + "/SrvyTask/GetSrvyTaskBySrvyTaskNo";
  public static GetListSrvyTaskByRefNoForView = environment.FoundationR3Url + "/v1" + "/SrvyTask/GetListSrvyTaskByRefNoForView";
  public static GetSrvyOrderByTrxRefNo = environment.FoundationR3Url + "/v1" + "/SrvyOrder/GetSrvyOrderByTrxRefNo";

  // Workflow Engine
  public static ClaimTask = environment.FoundationR3Url + "/v1" + "/Workflow/ClaimTask";
  public static ClaimTaskV2 = environment.FoundationR3Url + "/v2" + "/Workflow/ClaimTask";
  public static ClaimTaskNap = environment.losUrl + "/v1" + "/Application/ClaimTaskNap";
  public static ClaimTaskNapCustmainData = environment.losUrl + "/v1" + "/Application/ClaimTaskNapCustmainData";
  public static ClaimTaskNapCustmainDataV2 = environment.losUrl + "/v2" + "/Application/ClaimTaskNapCustmainData";
  public static GetAllTaskWorkflow = environment.FoundationR3Url + "/v2" + "/Workflow/GetAllTaskWorkflow";
  public static GetAllWorkflowInstance = environment.FoundationR3Url + "/v2" + "/Workflow/GetAllWorkflowInstance";
  public static GetTaskHistoryByTransactionNo = environment.FoundationR3Url + "/v2" + "/Workflow/GetTaskHistoryByTransactionNo";
  public static GetListTaskHistoryByAgrmntNo = environment.FoundationR3Url + "/v2" + "/Workflow/GetListTaskHistoryByAgrmntNo";
  public static CompleteTask = environment.FoundationR3Url + "/v2" + "/Workflow/CompleteTask";

  //Application Data
  public static SaveApplicationDataFctr = environment.losUrl + "/v1" + "/ApplicationData/SaveApplicationDataFctr"
  public static EditApplicationDataFctr = environment.losUrl + "/v1" + "/ApplicationData/EditApplicationDataFctr"
  public static ClaimListTask = environment.FoundationR3Url + "/v1" + "/Workflow/ClaimListTask";
  public static GetApplicationDataByAppId = environment.losUrl + "/v1" + "/ApplicationData/GetApplicationDataByAppId";

  //Application Data DF
  public static SaveApplicationDataDF = environment.losUrl + "/v1" + "/ApplicationData/SaveApplicationDataDF";
  public static EditApplicationDataDF = environment.losUrl + "/v1" + "/ApplicationData/EditApplicationDataDF";
  public static GetAppDlrFinByAppId = environment.losUrl + "/v1" + "/ApplicationData/GetAppDlrFinByAppId";

  // Phone Verif
  public static GetAppPhoneVerifSubjectListByAppId = environment.losUrl + "/v1" + "/PhoneVerif/GetAppPhoneVerifSubjectListByAppId";
  public static GetPhoneNumberByIdSourceAppIdAndSubject = environment.losUrl + "/v1" + "/PhoneVerif/GetPhoneNumberByIdSourceAppIdAndSubject";
  public static GetVerfQuestionListByAppIdAndSubjectForPhoneVerif = environment.losUrl + "/v1" + "/PhoneVerif/GetVerfQuestionListByAppIdAndSubjectForPhoneVerif";
  public static AddReturnHandlingFromPhoneVerif = environment.losUrl + "/v1" + "/PhoneVerif/AddReturnHandlingFromPhoneVerif";

  //Survey Verif
  public static GetAppSurveyVerifSubjectListByAppId = environment.losUrl + "/v1" + "/SurveyVerif/GetAppSurveyVerifSubjectListByAppId";
  public static GetVerfQuestionListByAppIdAndSubjectForSurveyVerif = environment.losUrl + "/v1" + "/SurveyVerif/GetVerfQuestionListByAppIdAndSubjectForSurveyProcess";
  public static AddVerfResultHeaderAndVerfResultDetailForSurveyVerif = environment.FoundationR3Url + "/v1" + "/VerfResultH/AddVerfResultHeaderAndVerfResultDetailForSurveyVerif";
  public static AddVerfResultHeaderAndVerfResultDetailForSurveyVerifEdit = environment.FoundationR3Url + "/v1" + "/VerfResultH/AddEditVerfResultHeaderAndVerfResultDetailForSurveyVerif";
  public static GetVerfQuestionListByAppIdAndSubjectForSurveyVerifEdit = environment.FoundationR3Url + "/v1" + "/VerfQuestionAnswer/GetVerfQuestionAnswerListByVerfResultH";
  public static CompleteAppSurveyVerif = environment.losUrl + "/v1" + "/SurveyVerif/CompleteAppSurveyVerif";
  public static CompleteAppSurveyVerifV2 = environment.losUrl + "/v2" + "/SurveyVerif/CompleteAppSurveyVerif";

  // App Cust
  public static GetAppCustByAppId = environment.losUrl + "/v1" + "/AppCust/GetAppCustByAppId";
  public static AddNegativeCustByAppId = environment.losUrl + "/v1" + "/AppCust/AddNegativeCustByAppId";
  public static GetAppCustAndAppCustPersonalDataByAppCustId = environment.losUrl + "/v1" + "/AppCust/GetAppCustAndAppCustPersonalDataByAppCustId";
  public static GetAppCustAndAppCustCompanyDataByAppCustId = environment.losUrl + "/v1" + "/AppCust/GetAppCustAndAppCustCompanyDataByAppCustId";
  public static UpdateAppCustCompletionPersonal = environment.losUrl + "/v1" + "/AppCust/UpdateAppCustCompletionPersonal";
  public static UpdateAppCustCompletionCompany = environment.losUrl + "/v1" + "/AppCust/UpdateAppCustCompletionCompany";
  public static SubmitAppCustCompletion = environment.losUrl + "/v1" + "/AppCust/SubmitAppCustCompletion";
  public static SubmitAppCustCompletionV2 = environment.losUrl + "/v2" + "/AppCust/SubmitAppCustCompletion";
  public static SaveAppCustCompletion = environment.losUrl + "/v1" + "/AppCust/SaveAppCustCompletion";

  // App Cust Personal Job Data
  public static AddAppCustPersonalJobData = environment.losUrl + "/v1" + "/AppCustPersonalJobData/AddAppCustPersonalJobData";
  public static EditAppCustPersonalJobData = environment.losUrl + "/v1" + "/AppCustPersonalJobData/EditAppCustPersonalJobData";
  public static GetAppCustPersonalJobData = environment.losUrl + "/v1" + "/AppCustPersonalJobData/GetAppCustPersonalJobData";

  //App Cust Emergency Contact
  public static AddAppCustEmrgncCntct = environment.losUrl + "/v1" + "/AppCustEmrgncCntct/AddAppCustEmrgncCntct";
  public static EditAppCustEmrgncCntct = environment.losUrl + "/v1" + "/AppCustEmrgncCntct/EditAppCustEmrgncCntct";
  public static GetAppCustEmrgncCntctByAppCustId = environment.losUrl + "/v1" + "/AppCustEmrgncCntct/GetAppCustEmrgncCntctByAppCustId";

  //App Cust Personal Fin Data
  public static GetAppCustPersonalFinDataByAppCustPersonalId = environment.losUrl + "/v1" + "/AppCustPersonalFinData/GetAppCustPersonalFinDataByAppCustPersonalId";
  public static AddAppCustPersonalFinData = environment.losUrl + "/v1" + "/AppCustPersonalFinData/AddAppCustPersonalFinData";
  public static EditAppCustPersonalFinData = environment.losUrl + "/v1" + "/AppCustPersonalFinData/EditAppCustPersonalFinData";
  public static DeleteAppCustPersonalFinData = environment.losUrl + "/v1" + "/AppCustPersonalFinData/DeleteAppCustPersonalFinData";

  //Verf Question Answer
  public static GetVerfQuestionAnswerListByVerfSchemeCode = environment.FoundationR3Url + "/v1" + "/VerfQuestionAnswer/GetVerfQuestionAnswerListByVerfSchemeCode"

  // App Credit Review
  public static GetAppCrdRvwById = environment.losUrl + "/v1" + "/AppCrdRvw/GetAppCrdRvwById";
  public static AddOrEditAppCrdRvwDataAndListManualDeviationData = environment.losUrl + "/v1" + "/AppCrdRvw/AddOrEditAppCrdRvwDataAndListManualDeviationData";
  public static CrdRvwMakeNewApproval = environment.losUrl + "/v1" + "/AppCrdRvw/CrdRvwMakeNewApproval";
  public static CrdRvwMakeNewApprovalV2 = environment.losUrl + "/v2" + "/AppCrdRvw/CrdRvwMakeNewApproval";
  public static AddOrEditAppCrdRvwDataAndListManualDeviationDataNew = environment.losUrl + "/v1" + "/AppCrdRvw/AddOrEditAppCrdRvwDataAndListManualDeviationDataNew";
  public static GetLatestScoringResultHByTrxSourceNo = environment.FoundationR3Url + "/v1" + "/CreditScoring/GetLatestScoringResultHByTrxSourceNo";

  //RETURN HANDLING
  public static GetReturnHandlingWithDetailByReturnHandlingHId = environment.losUrl + "/v1" + "/ReturnHandlingH/GetReturnHandlingWithDetailByReturnHandlingHId";
  public static GetListReturnHandlingDByReturnHandlingHId = environment.losUrl + "/v1" + "/ReturnHandlingD/GetListReturnHandlingDByReturnHandlingHId";
  public static GetReturnHandlingDByAppIdAndMrReturnTaskCode = environment.losUrl + "/v1" + "/ReturnHandlingD/GetReturnHandlingDByAppIdAndMrReturnTaskCode";
  public static GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode = environment.losUrl + "/v1" + "/ReturnHandlingD/GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode"
  public static AddReturnHandlingD = environment.losUrl + "/v1" + "/ReturnHandlingD/AddReturnHandlingD";
  public static EditReturnHandlingD = environment.losUrl + "/v1" + "/ReturnHandlingD/EditReturnHandlingD";
  public static EditReturnHandlingDV2 = environment.losUrl + "/v2" + "/ReturnHandlingD/EditReturnHandlingD";
  public static RequestReturnTask = environment.losUrl + "/v1" + "/ReturnHandlingD/RequestReturnTask";
  public static RequestReturnTaskV2 = environment.losUrl + "/v2" + "/ReturnHandlingD/RequestReturnTask";
  public static DeleteReturnHandlingD = environment.losUrl + "/v1" + "/ReturnHandlingD/DeleteReturnHandlingD";
  public static ResumeReturnHandling = environment.losUrl + "/v1" + "/ReturnHandlingH/ResumeReturnHandling";
  public static ResumeReturnHandlingV2 = environment.losUrl + "/v2" + "/ReturnHandlingH/ResumeReturnHandling";
  public static GetReturnHandlingDByReturnHandlingDId = environment.losUrl + "/v1" + "/ReturnHandlingD/GetReturnHandlingDByReturnHandlingDId";
  public static AddReturnHandlingH = environment.losUrl + "/v1" + "/ReturnHandlingH/AddReturnHandlingH";

  // public static Test = environment.losUrl + "/v1" + "/ReturnHandlingD/Test";

  // Deviation Result
  public static GetListDeviationResultForDeviationDataByAppId = environment.losUrl + "/v1" + "/DeviationResult/GetListDeviationResultForDeviationDataByAppId";
  public static GetListDeviationResultByAppNo = environment.losUrl + "/v1" + "/DeviationResult/GetListDeviationResultByAppNo";
  public static AddListManualDeviationResultByAppId = environment.losUrl + "/v1" + "/DeviationResult/AddListManualDeviationResultByAppId";
  public static GetListDeviationTypeByAppNo = environment.losUrl + "/v1" + "/DeviationResult/GetListDeviationTypeByAppNo";

  // Upload
  public static UploadFile = environment.FoundationR3Url + "/v1" + "/Upload/UploadFile";
  public static UploadFileV2 = environment.FoundationR3Url + "/v2" + "/Upload/UploadFile";

  // Download
  public static DownloadTemplate = environment.FoundationR3Url + "/v2" + '/Download/DownloadTemplate';
  public static GetUploadAssetMasterByUploadMonitoringNoAndTrxType = environment.FoundationR3Url + "/v2" + '/AssetMaster/GetUploadAssetMasterByUploadMonitoringNoAndTrxType';

  // Report
  public static GenerateReportSync = environment.FoundationR3Url + "/v1" + '/Report/GenerateReportSync';
  public static GenerateReportR3 = environment.FoundationR3Url + "/v1" + '/Report/GenerateReportR3';

  // Asset Category
  public static GetAssetCategoryById = environment.FoundationR3Url + "/v1" + "/AssetCategory/GetAssetCategoryById";

  //Agrmnt Rsv Fund
  public static GetListAgrmntReservedFundByAgrmntId = environment.losUrl + "/v1" + "/AgrmntReservedFund/GetListAgrmntReservedFundByAgrmntId";

  //Agrmnt Life Ins
  public static GetAgrmntLifeInsDataByAgrmntId = environment.losUrl + "/v1" + "/AgrmntLifeIns/GetAgrmntLifeInsDataByAgrmntId";

  //RfaLog
  public static GetRfaLogByTrxNo = environment.FoundationR3Url + "/v1" + "/RfaLog/GetRfaLogByTrxNo";
  public static GetRfaLogByTrxNoAndApvCategory = environment.FoundationR3Url + "/v1" + "/RfaLog/GetRfaLogByTrxNoAndApvCategory";

  //Ref App Attr
  public static GetListRefAppAttrCollateral = environment.losUrl + "/v1" + "/RefAppAttr/GetListRefAppAttrCollateral";
  public static CompleteAppPhoneVerif = environment.losUrl + "/v1" + "/PhoneVerif/CompleteAppPhoneVerif";
  public static CompleteAppPhoneVerifV2 = environment.losUrl + "/v2" + "/PhoneVerif/CompleteAppPhoneVerif";

  //Agrmnt Subsidy
  public static GetAgrmntSubsidyListByAgrmntId = environment.losUrl + "/v1" + "/AgrmntSubsidy/GetAgrmntSubsidyListByAgrmntId";

  //Agrmnt Fee
  public static GetAgrmntFeeListByAgrmntId = environment.losUrl + "/v1" + "/AgrmntFee/GetAgrmntFeeListByAgrmntId";

  //APP INVOICE FCTR
  public static GetListAppInvoiceFctrByAppId = environment.losUrl + "/v1" + "/AppInvoiceFctr/GetListAppInvoiceFctrByAppId";
  public static UpdateAppInvoiceFctr = environment.losUrl + "/v1" + "/AppInvoiceFctr/UpdateAppInvoiceFctr";
  public static UpdateAppInvoiceFctrV2 = environment.losUrl + "/v2" + "/AppInvoiceFctr/UpdateAppInvoiceFctr";

  //REF PAY FREQ
  public static GetRefPayFreqByPayFreqCode = environment.FoundationR3Url + "/v1" + "/RefPayFreq/GetRefPayFreqByPayFreqCode";

  //APP SCORE GRADE
  public static GetAppScoreGradeByAppIdAndMrScoreTypeCode = environment.losUrl + "/v1" + "/AppScoreGrade/GetAppScoreGradeByAppIdAndMrScoreTypeCode";
  public static GetAppScoreGradeDsrByAppId = environment.losUrl + "/v1" + "/AppScoreGrade/GetAppScoreGradeDsrByAppId";
  public static GetListAppScoreGradeByAppId = environment.losUrl + "/v1" + "/AppScoreGrade/GetListAppScoreGradeByAppId";

  // Authentication
  public static RequestNewPassword = environment.FoundationR3Url + "/v1" + "/Authenticate/RequestNewPassword";

  // DocExpDt
  public static GetDocIsExpDtMandatory = environment.losUrl + "/v1" + "/DocumentExpDt/GetDocIsExpDtMandatory";

  // INTEGRATION
  public static ReSendLosR3DataToR2 = environment.losUrl + "/v1" + "/Integration/ReSendLosR3DataToR2";

  //EDIT APP AFTER APPROVAL
  public static GetListRefChangeItem = environment.FoundationR3Url + "/v1" + "/RefChangeItem/GetListRefChangeItem";
  public static GetEditAppAftApvTrxForChangeSummaryByEditAppAftApvTrxHId = environment.losUrl + "/v1" + "/EditAppAftApv/GetEditAppAftApvTrxForChangeSummaryByEditAppAftApvTrxHId";
  public static GetAgrmntDataForEditAppAfterApprovalByAgrmntId = environment.losUrl + "/v1" + "/EditAppAftApv/GetAgrmntDataForEditAppAfterApprovalByAgrmntId";
  public static SubmitEditAppAftApvReq = environment.losUrl + "/v1" + "/EditAppAftApv/SubmitEditAppAftApvReq";
  public static SubmitEditAppAftApvReqV2 = environment.losUrl + "/v2" + "/EditAppAftApv/SubmitEditAppAftApvReq";

  //LTKM
  public static GetCustCompanyLtkmForCopyByCustId = environment.FoundationR3Url + "/v1" + "/Cust/GetCustCompanyLtkmForCopyByCustId";
  public static SaveLtkmRequestPersonal = environment.losUrl + "/v1" + "/ManualLtkm/SaveLtkmRequestPersonal";
  public static SaveLtkmRequestPersonalV2 = environment.losUrl + "/v2" + "/ManualLtkm/SaveLtkmRequestPersonal";
  public static SaveLtkmRequestCompany = environment.losUrl + "/v1" + "/ManualLtkm/SaveLtkmRequestCompany";
  public static SaveLtkmRequestCompanyV2 = environment.losUrl + "/v2" + "/ManualLtkm/SaveLtkmRequestCompany";
  public static GetLtkmReqByLtkmNo = environment.losUrl + "/v1" + "/Ltkm/GetLtkmReqByLtkmNo";
  public static SubmitLtkmVerify = environment.losUrl + "/v1" + "/Ltkm/SubmitLtkmVerify";
  public static SubmitLtkmVerifyV2 = environment.losUrl + "/v2" + "/Ltkm/SubmitLtkmVerify";
  public static SubmitLtkmReturnAtApv = environment.losUrl + "/v1" + "/Ltkm/SubmitLtkmReturnAtApv";
  public static SubmitLtkmReturnAtApvV2 = environment.losUrl + "/v2" + "/Ltkm/SubmitLtkmReturnAtApv";
  public static GetSummaryByLtkmCustId = environment.losUrl + "/v1" + "/Ltkm/GetSummaryByLtkmCustId";
  public static GetLtkmReqByLtkmCustId = environment.losUrl + "/v1" + "/ltkm/getLtkmReqByLtkmCustId";
  public static GetLtkmCustDataPersonalForViewByLtkmCustId = environment.losUrl + "/v1" + "/LtkmCustomerData/GetLtkmCustDataPersonalForViewByLtkmCustId";
  public static GetLtkmCustDataCompanyForViewByLtkmCustId = environment.losUrl + "/v1" + "/LtkmCustomerData/GetLtkmCustDataCompanyForViewByLtkmCustId";
  public static GetLtkmCustCompanyFinDataByLtkmCustId = environment.losUrl + "/v1" + "/LtkmCustomerData/GetLtkmCustCompanyFinDataByLtkmCustId";
  public static GetLtkmCustById = environment.losUrl + "/v1" + "/LtkmCustomerData/GetLtkmCustById";
  public static getLtkmReqByLtkmCustId = environment.losUrl + "/v1" + "/Ltkm/getLtkmReqByLtkmCustId";

  public static GetCustDataByLtkmCustId = environment.losUrl + "/v1" + "/LtkmCustomerData/GetCustDataByLtkmCustId";
  public static GetLtkmCustEmrgncCntctByLtkmCustId = environment.losUrl + "/v1" + "/LtkmCustData/GetLtkmCustEmrgncCntctByLtkmCustId";
  public static GetLtkmCustAddrByLtkmCustAddrId = environment.losUrl + "/v1" + "/LtkmCustData/GetLtkmCustAddrByLtkmCustAddrId";
  public static GetListLtkmCustAddrByLtkmCustId = environment.losUrl + "/v1" + "/LtkmCustData/GetListLtkmCustAddrByLtkmCustId";
  public static GetLtkmCustBankAccAndStatementForView = environment.losUrl + "/v1" + "/LtkmCustData/GetLtkmCustBankAccAndStatementForView";
  public static DeleteLtkmCustBankAccAndStmnt = environment.losUrl + "/v1" + "/LtkmCustData/DeleteLtkmCustBankAccAndStmnt";

  public static GetListLtkmAppPrcsByCustNoAndIsAppInitDone = environment.losUrl + "/v1" + "/LtkmCustomerData/GetListLtkmAppPrcsByCustNoAndIsAppInitDone";
  public static GetLtkmAppRjcByCustNoAndAppStat = environment.losUrl + "/v1" + "/LtkmCustomerData/GetLtkmAppRjcByCustNoAndAppStat";
  public static GetLtkmExistAgrmntByCustNoAndIsAppInitDone = environment.losUrl + "/v1" + "/LtkmCustomerData/GetLtkmExistAgrmntByCustNoAndIsAppInitDone";
  //ltkm cust attr content
  public static GetListLtkmCustAttrContentByLtkmCustIdAndAttrGroup = environment.losUrl + "/v1" + "/LtkmCustomerData/GetListLtkmCustAttrContentByLtkmCustIdAndAttrGroup";

  //ltkm cust personal fin data
  public static GetListLtkmCustPersonalFinDataByLtkmCustlId = environment.losUrl + "/v1" + "/LtkmCustomerData/GetListLtkmCustPersonalFinDataByLtkmCustlId";
  public static AddEditLtkmCustPersonalFinData = environment.losUrl + "/v1" + "/LtkmCustomerData/AddEditLtkmCustPersonalFinData";

  //ltkm cust bank stmnt & account
  public static AddLtkmCustBankAccAndStmnt = environment.losUrl + "/v1" + "/LtkmCustomerData/AddLtkmCustBankAccAndStmnt";
  public static EditLtkmCustBankAccAndStmnt = environment.losUrl + "/v1" + "/LtkmCustomerData/EditLtkmCustBankAccAndStmnt";

  //ltkm cust other info
  public static GetLtkmCustOtherInfoByLtkmCustId = environment.losUrl + "/v1" + "/LtkmCustomerData/GetLtkmCustOtherInfoByLtkmCustId";

  //ltkm cust personal return handling
  public static SaveLtkmRequestPersonalReturnHandling = environment.losUrl + "/v1" + "/LtkmCustomerData/SaveLtkmRequestPersonalReturnHandling";

  //ltkm return handling
  public static SaveLtkmReturnHandlingPersonal = environment.losUrl + "/v1" + "/Ltkm/SaveLtkmReturnHandlingPersonal";
  public static SaveLtkmReturnHandlingPersonalV2 = environment.losUrl + "/v2" + "/Ltkm/SaveLtkmReturnHandlingPersonal";
  public static SaveLtkmReturnHandlingCompany = environment.losUrl + "/v1" + "/Ltkm/SaveLtkmReturnHandlingCompany";
  public static SaveLtkmReturnHandlingCompanyV2 = environment.losUrl + "/v2" + "/Ltkm/SaveLtkmReturnHandlingCompany";

  //ltkm cust personal main data
  public static GetCustPersonalForLtkmCopyByCustId = environment.FoundationR3Url + "/v1" + "/Cust/GetCustPersonalForLtkmCopyByCustId";

  // AppCustAsset
  public static GetListAppCustAssetByAppCustId = environment.losUrl + "/v1" + "/AppCustAsset/GetListAppCustAssetByAppCustId";
  public static AddAppCustAsset = environment.losUrl + "/v1" + "/AppCustAsset/AddAppCustAsset";
  public static EditAppCustAsset = environment.losUrl + "/v1" + "/AppCustAsset/EditAppCustAsset";
  public static DeleteAppCustAsset = environment.losUrl + "/v1" + "/AppCustAsset/DeleteAppCustAsset";
  public static GetAppCustAssetByAppCustAssetId = environment.losUrl + "/v1" + "/AppCustAsset/GetAppCustAssetByAppCustAssetId";
  // Potential RO
  public static GetListGenerateRoPotentialSpMapping = environment.losUrl + "/v1" + "/RoPotential/GetListGenerateRoPotentialSpMapping";
  public static GetRoPotentialDataFromSp = environment.losUrl + "/v1" + "/RoPotential/GetRoPotentialDataFromSp";
  public static GenerateRoPotentialDataFromSp = environment.losUrl + "/v1" + "/RoPotential/GenerateRoPotentialDataFromSp";
  public static GetTelemkOfferingSubjectByRoPotentialNo = environment.losUrl + "/v1" + "/RoPotential/GetTelemkOfferingSubjectByRoPotentialNo";
  public static UpdatePotentialRo = environment.losUrl + "/v1" + "/RoPotential/UpdatePotentialRo";

  // Credit Review
  public static GetCrdRvwAppByCrdRvwCustInfoId = environment.losUrl + "/v1" + "/CrdRvwApp/GetCrdRvwAppByCrdRvwCustInfoId";
  public static GetCrdRvwCustInfoByAppId = environment.losUrl + "/v1" + "/CrdRvwCustInfo/GetCrdRvwCustInfoByAppId";
  public static GetCrdRvwCustInfoIncomeAndExpenseDetails = environment.losUrl + "/v1" + "/CrdRvwCustInfo/GetCrdRvwCustInfoIncomeAndExpenseDetails";
  public static CrdRvwDataReCapture = environment.losUrl + "/v1" + "/CrdRvwCustInfo/CrdRvwDataReCapture";
  public static CrdRvwDataReCaptureV2 = environment.losUrl + "/v2" + "/CrdRvwCustInfo/CrdRvwDataReCapture";
  public static ReCaptureDataR2 = environment.losUrl + "/v1" + "/CrdRvwCustInfo/ReCaptureDataR2";
  public static ReCaptureDataR2V2 = environment.losUrl + "/v2" + "/CrdRvwCustInfo/ReCaptureDataR2";
  public static GetCrdRvwCustPersInfoByCrdRvwCustInfoId = environment.losUrl + "/v1" + "/CrdRvwCustPersInfo/GetCrdRvwCustPersInfoByCrdRvwCustInfoId";
  public static GetCrdRvwCustCoyInfoByCrdRvwCustInfoId = environment.losUrl + "/v1" + "/CrdRvwCustCoyInfo/GetCrdRvwCustCoyInfoByCrdRvwCustInfoId";
  public static GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId = environment.losUrl + "/v1" + "/CrdRvwCustPhnStatus/GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId";
  public static GetListCrdRvwExposureByCrdRvwCustInfoId = environment.losUrl + "/v1" + "/CrdRvwExposure/GetListCrdRvwExposureByCrdRvwCustInfoId";
  public static GetCrdRvwExposureByCrdRvwCustInfoIdAndRelationType = environment.losUrl + "/v1" + "/CrdRvwExposure/GetCrdRvwExposureByCrdRvwCustInfoIdAndRelationType";
  public static GetCrdRvwExposureHandDByCrdRvwExposureHId = environment.losUrl + "/v1" + "/CrdRvwExposure/GetCrdRvwExposureHandDByCrdRvwExposureHId";
  public static GetListCrdRvwCustBucketByCrdRvwExposureDId = environment.losUrl + "/v1" + "/CrdRvwExposure/GetListCrdRvwCustBucketByCrdRvwExposureDId";
  public static GetListCrdRvwAppAgrHistByCrdRvwExposureHId = environment.losUrl + "/v1" + "/CrdRvwExposure/GetListCrdRvwAppAgrHistByCrdRvwExposureHId";
  public static GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId = environment.losUrl + "/v1" + "/CrdRvwDiffAppToInPrcAppCust/GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId";
  public static GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId = environment.losUrl + "/v1" + "/CrdRvwDiffAppToMasterCust/GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId";
  public static GetSingleAssetCrdRvwAssetByCrdRvwCustInfoId = environment.losUrl + "/v1" + "/CrdRvwAsset/GetSingleAssetCrdRvwAssetByCrdRvwCustInfoId";
  public static GetMultiAssetCrdRvwAssetByCrdRvwCustInfoId = environment.losUrl + "/v1" + "/CrdRvwAsset/GetMultiAssetCrdRvwAssetByCrdRvwCustInfoId";
  public static GetCrdRvwCollateralByCrdRvwCustInfoId = environment.losUrl + "/v1" + "/CrdRvwCollateral/GetCrdRvwCollateralByCrdRvwCustInfoId";
  public static GetCrdRvwCmoBycrdRvwExposureId = environment.losUrl + "/v1" + "/CrdRvwCmo/GetCrdRvwCmoBycrdRvwExposureId";
  public static GetCrdRvwDealerByCrdRvwCustInfoId = environment.losUrl + "/v1" + "/CrdRvwDealer/GetCrdRvwDealerByCrdRvwCustInfoId";
  public static GetLatestListScoringResultHAndResultDByTrxSourceNo = environment.FoundationR3Url + "/v1" + "/CreditScoring/GetLatestListScoringResultHAndResultDByTrxSourceNo";
  public static GetListNegativeCustByCustNo = environment.FoundationR3Url + "/v1" + "/NegativeCust/GetListNegativeCustByCustNo";

  // Credit Approval
  public static Approval = environment.losUrl + "/v1" + "/Approval/Approval";
  public static RequestApproval = environment.losUrl + "/v1" + "/Approval/RequestApproval";
  public static MouApproval = environment.losUrl + "/v1" + "/Approval/MouApproval";
  public static LtkmApproval = environment.losUrl + "/v1" + "/Approval/LtkmApproval";
  public static EditAppAfterApproval = environment.losUrl + "/v1" + "/Approval/EditAppAfterApproval";
  public static ProdHOApproval = environment.losUrl + "/v1" + "/Approval/ProdHOApproval";
  public static ProdOfferingApproval = environment.losUrl + "/v1" + "/Approval/ProdOfferingApproval";
  public static PreGoLiveApproval = environment.losUrl + "/v1" + "/Approval/PreGoLiveApproval";
  public static ResultExpiredDaysApproval = environment.losUrl + "/v1" + "/Approval/ResultExpiredDaysApproval";

  // New Approval R3
  public static CreateNewRFA = "/Approval/CreateNewRFA";
  public static CreateJumpRFA = "/Approval/CreateJumpRFA";
  public static GetRefSingleCategoryByCategoryCode = "/Approval/GetRefSingleCategoryByCategoryCode";
  public static GetSchemesBySchemeCode = "/Approval/GetSchemesBySchemeCode";
  public static GetRefAdtQuestion = "/Approval/GetRefAdtQuestion";
  public static GetPossibleMemberAndAttributeExType = "/Approval/GetPossibleMemberAndAttributeExType";
  public static GetApprovalReturnHistory = "/Approval/GetApprovalReturnHistory";
  public static GetSchemesByCategoryId = "/Approval/GetSchemesByCategoryId";
  public static SubmitApproval = "/Approval/SubmitApproval";
  public static GetLevelVoting = "/Approval/GetLevelVoting";
  public static GetPossibleResult = "/Approval/GetPossibleResult";
  public static GetNextNodeMember = "/Approval/GetNextNodeMember";
  public static GetRefReasonActive = "/Approval/GetRefReasonActive";
  public static GetCanChangeMinFinalLevel = "/Approval/GetCanChangeMinFinalLevel";
  public static GetTaskHistory = "/Approval/GetTaskHistory";
  public static ReturnLevel = "/Approval/ReturnLevel";
  public static ContinueToLevel = "/Approval/ContinueToLevel";
  public static GetSingleTaskInfo = "/Approval/GetSingleTaskInfo";

  // Digitalization
  public static DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDO = environment.losUrl + "/v1" + "/Digitalization/DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDO";
  public static DigitalizationAddTrxSrcDataForFraudCheckingCollRAPINDO = environment.losUrl + "/v1" + "/Digitalization/DigitalizationAddTrxSrcDataForFraudCheckingCollRAPINDO";
  public static DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDOMultiAsset = environment.losUrl + "/v1" + "/Digitalization/DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDOMultiAsset";
  public static DigitalizationAddTrxSrcDataForFraudChecking = environment.losUrl + "/v1" + "/Digitalization/DigitalizationAddTrxSrcDataForFraudChecking";
  public static DigitalizationAddTrxSrcDataForFraudCheckingNAPCust = environment.losUrl + "/v1" + "/Digitalization/DigitalizationAddTrxSrcDataForFraudCheckingNAPCust";
  public static GetRuleIntegratorPackageMapAsset = environment.losUrl + "/v1" + "/Digitalization/GetRuleIntegratorPackageMapAsset";
  public static GetRuleIntegratorPackageMapCust = environment.losUrl + "/v1" + "/Digitalization/GetRuleIntegratorPackageMapCust";

  //ThirdPartyRsltH
  public static GetThirdPartyResultHByTrxTypeCodeAndTrxNo = environment.losUrl + "/v1" + "/ThirdPartyRsltH/GetThirdPartyResultHByTrxTypeCodeAndTrxNo";
  public static GetThirdPartyResultHForFraudChecking = environment.losUrl + "/v1" + "/ThirdPartyRsltH/GetThirdPartyResultHForFraudChecking";
  public static GetAppAssetFromThirdPartyResultHByTrxTypeCodeAndTrxNoAndChassisNoForFraudChecking = environment.losUrl + "/v1" + "/ThirdPartyRsltH/GetAppAssetFromThirdPartyResultHByTrxTypeCodeAndTrxNoAndChassisNoForFraudChecking";
  public static GetCrdRvwThirdPartyData = environment.losUrl + "/v1" + "/ThirdPartyRsltH/GetCrdRvwThirdPartyData";

  public static GetFraudResult = environment.losUrl + "/v1" + "/ThirdPartyRsltH/GetFraudResult";
  public static ExecutePotentialRo = environment.losUrl + "/v1" + "/RoPotential/ExecutePotentialRo";

  //Task Reassignment
  public static GetTaskReassignmentDetail = environment.losUrl + "/v1" + "/TaskReassignment/GetTaskReassignmentDetail";
  public static GetTaskReassignmentDetailV2 = environment.losUrl + "/v2" + "/TaskReassignment/GetTaskReassignmentDetail";
  public static SubmitTaskReassignment = environment.losUrl + "/v1" + "/TaskReassignment/SubmitTaskReassignment";
  public static SubmitTaskReassignmentV2 = environment.losUrl + "/v2" + "/TaskReassignment/SubmitTaskReassignment";
  public static GetUserRoleByUsernameForReassignment = environment.FoundationR3Url + "/v1" + "/RefUserRole/GetUserRoleByUsernameForReassignment";
  public static GetTaskReassignmentDetailForApproval = environment.losUrl + "/v1" + "/TaskReassignment/GetTaskReassignmentDetailForApproval";
  public static GetTaskReassignmentDetailForApprovalV2 = environment.losUrl + "/v2" + "/TaskReassignment/GetTaskReassignmentDetailForApproval";

  //APP CUST BANK ACC
  public static GetListAppCustBankAccByAppCustId = environment.losUrl + "/v1" + "/AppCustBankAcc/GetListAppCustBankAccByAppCustId";
  public static GetAppCustBankAccByAppCustBankAccId = environment.losUrl + "/v1" + "/AppCustBankAcc/GetAppCustBankAccByAppCustBankAccId";

  //APP OTHER INFO
  public static AddAppOtherInfo = environment.losUrl + "/v1" + "/AppOtherInfo/AddAppOtherInfo";
  public static GetAppOtherInfoByAppId = environment.losUrl + "/v1" + "/AppOtherInfo/GetAppOtherInfoByAppId";

  //AGRMNT MASTER X
  // public static AddEditAgrmntMasterX = environment.losUrl + "/v1" + "/AgrmntMasterX/AddEditAgrmntMasterX"
  //AGRMNT PARENT X
  // public static GetParentAppIdByAppNo = environment.losUrl + "/v1" + "/AgrmntMasterX/GetParentAppIdByAppNo"
  // public static GetParentAgrNoByAppId = environment.losUrl + "/v1" + "/AgrmntMasterX/GetParentAgrNoByAppId"
  //App Collateral X
  // public static GetListAppCollateralXByAppId = environment.losUrl + "/v1" + "/AppCollateralX/GetListAppCollateralByAppId";
  // public static CopyAppCollateralFromAgrmntParent = environment.losUrl + "/v1" + "/AppCollateralX/CopyAppCollateralFromAgrmntParent";

  //Bank Acc Cust
  public static GetBankAccCustByAppId = environment.losUrl + "/v1" + "/AppOtherInfo/GetBankAccCustByAppId";

  //public static GetCustThirdPartyCheckForAppCust = environment.FoundationR3Url + "/v1" + "/CustThirdPartyChecking/GetCustThirdPartyCheckForAppCust";

  //Get OsPlatfondAmt From R2
  public static GetOsPlatfondAmtMouR2ByMouCustId = environment.losUrl + "/v1" + "/AppInvoiceX/GetOsPlatfondAmtMouR2ByMouCustId"

  //Cust Bank Acc
  public static GetListCustBankAccByCustNo = environment.FoundationR3Url + "/v1" + "/CustBankAcc/GetListCustBankAccByCustNo";

  //MOU CUST DLR FNCNG
  public static GetMouCustDlrFncngByAppId = environment.losUrl + "/v1" + "/MouCustDlrFncng/GetMouCustDlrFncngByAppId";

  //App Asset OPL
  public static GetAppAssetOplMainInfoByAppAssetId = environment.losUrl + "/v1" + "/AppAssetOpl/GetAppAssetOplMainInfoByAppAssetId";
  public static GetAppAssetOplByAppAssetId = environment.losUrl + "/v1" + "/AppAssetOpl/GetAppAssetOplByAppAssetId";
  public static GetAssetRegionFromRuleByAppAssetId = environment.losUrl + "/v1" + "/AppAssetOpl/GetAssetRegionFromRuleByAppAssetId";
  public static GetListAppAssetExpenseByAppId = environment.losUrl + "/v1" + "/AppAssetOpl/GetListAppAssetExpenseByAppId";
  public static GetMaintenancePackageByAppAssetId = environment.losUrl + "/v1" + "/AppAssetOpl/GetMaintenancePackageByAppAssetId";
  public static GetMaintenanceDetailByAppAssetIdAndPackageCode = environment.losUrl + "/v1" + "/AppAssetOpl/GetMaintenanceDetailByAppAssetIdAndPackageCode";
  public static ExecuteInsRateRuleOpl = environment.losUrl + "/v1" + "/AppAssetOpl/ExecuteInsRateRuleOpl";
  public static GetOtherExpenseByAppAssetId = environment.losUrl + "/v1" + "/AppAssetOpl/GetOtherExpenseByAppAssetId";
  public static GetFeeExpenseByAppAssetId = environment.losUrl + "/v1" + "/AppAssetOpl/GetFeeExpenseByAppAssetId";
  public static SubmitAssetExpense = environment.losUrl + "/v1" + "/AssetExpenseOpl/SubmitAssetExpense";
  public static GetAssetExpenseDataByAppAssetId = environment.losUrl + "/v1" + "/AssetExpenseOpl/GetAssetExpenseDataByAppAssetId";
  public static CalculateAssetInsurance = environment.losUrl + "/v1" + "/AssetExpenseOpl/CalculateAssetInsurance";

  //Document Checklist
  public static SubmitDocChecklist = environment.losUrl + "/v1" + "/DocChecklist/SubmitDocChecklist";
  public static CreateRFADocChecklist = environment.losUrl + "/v1" + "/DocChecklist/CreateRFADocChecklist";

  // App Asset View
  public static GetListAppAssetAccessoryByAppAssetId = environment.losUrl + "/v1" + "/AppAssetView/GetListAppAssetAccessoryByAppAssetId";
  public static GetListAppAssetAccessoryAndAppAssetAttrByAppAssetId = environment.losUrl + "/v1" + "/AppAssetView/GetListAppAssetAccessoryAndAppAssetAttrByAppAssetId";
  public static GetAllAssetExpenseData = environment.losUrl + "/v1" + "/AppAssetView/GetAllAssetExpenseData";
  public static GetListAllAssetExpenseData = environment.losUrl + "/v1" + "/AppAssetView/GetListAllAssetExpenseData";
  public static GetRentalCalculationData = environment.losUrl + "/v1" + "/AppAssetView/GetRentalCalculationData";
  public static GetListAllAssetFinancialData = environment.losUrl + "/v1" + "/AppAssetView/GetListAllAssetFinancialData";

  // App List View
  public static GetAllAppAndAppOplListData = environment.losUrl + "/v1" + "/AppListView/GetAllAppAndAppOplListData";
  
  public static GetAppListForCustView = environment.losUrl + "/v1" + "/Application/GetAppListForCustView";

  // Agreement List View
  public static GetAgrmntListForCustView = environment.losUrl + "/v1" + "/Agrmnt/GetAgrmntListForCustView";

  // App Review
  public static GetAppRvwSummaryAsset = environment.losUrl + "/v1" + "/ApplicationReview/GetAppRvwSummaryAsset";
  public static GetApprovalAmount = environment.losUrl + "/v1" + "/ApplicationReview/GetApprovalAmount";

  // Requisition Decision
  public static GetRequisitionDecisionHByAppId = environment.losUrl + "/v1" + "/RequisitionDecision/GetRequisitionDecisionHByAppId";
  public static SaveRequisitionDecision = environment.losUrl + "/v1" + "/RequisitionDecision/SaveRequisitionDecision";
  public static SubmitRequisitionDecision = environment.losUrl + "/v1" + "/RequisitionDecision/SubmitRequisitionDecision";
  public static IsSecurityDepositExist = environment.losUrl + "/v1" + "/RequisitionDecision/IsSecurityDepositExist";

  // Pre Go Live
  public static SubmitPreGoLiveOpl = environment.losUrl + "/v1" + "/PreGoLiveOpl/SubmitPreGoLive";

  //App Asset Rent Data
  public static GetAppFinDataOplByAppAssetId = environment.losUrl + "/v1" + "/AppAssetRentDataOpl/GetAppFinDataOplByAppAssetId";
  public static AddEditFinDataOpl = environment.losUrl + "/v1" + "/AppAssetFinancialDataOpl/SubmitFinancialDataOpl";
  public static GetListAppAssetFinDataGridByAppId = environment.losUrl + "/v1" + "/AppAssetRentDataOpl/GetListAppAssetFinDataGridByAppId";
  public static CalculateFinancialOpl = environment.losUrl + "/v1" + "/AppFinData/CalculateFinancialOpl";
  public static GetFinancialRuleOpl = environment.losUrl + "/v1" + "/AppAssetFinancialDataOpl/GetFinancialRuleOpl";
  public static CalculateCOFOpl = environment.losUrl + "/v1" + "/AppFinData/CalculateCOFOpl";

  //Asset Allocation
  public static GetAssetAllocationDataByAppId = environment.losUrl + "/v1" + "/AppAssetAllocationOpl/GetAssetAllocationDataByAppId";
  public static SubmitAssetAllocation = environment.losUrl + "/v1" + "/AppAssetAllocationOpl/SubmitAssetAllocation";

  //API AMS
  public static GetAssetStockPagingFromAms = "/Api/Integration/GetAssetStockPaging";

  // ASSET (AMS)
  public static GetAssetByAssetNo = environment.AMSUrl + "/Asset/GetAssetByAssetNo";
  public static GetListAssetReqInProgress = environment.AMSUrl + "/Api/Integration/GetListAssetReqInProgress";

  // REF BEHAVIOUR
  public static GetRefBehaviourByBehaviourTypeCode = environment.losUrl + "/v1" + "/RefBehaviour/GetRefBehaviourByBehaviourTypeCode";

  //REF LOB
  public static GetRefLobByLobCode = environment.FoundationR3Url + "/v1" + "/RefLob/GetRefLobByLobCode";
  public static GetListRefLob = environment.FoundationR3Url + "/v1" + "/RefLob/GetListRefLob";
  public static GetListKvpInstSchmByLobCode = environment.losUrl + "/v1" + "/InstSchmMap/GetListKvpInstSchmByLobCode";
  public static GetKvpRefFinMapByLobCode = environment.losUrl + "/v1" + "/RefFinMap/GetKvpRefFinMapByLobCode";

  // PRODUCT
  public static GetProdHById = environment.losUrl + "/v1" + "/Product/GetProdHById"
  public static AddProduct = environment.losUrl + "/v1" + "/Product/AddProduct"
  public static EditProduct = environment.losUrl + "/v1" + "/Product/EditProduct"
  public static RequestDeactivation = environment.losUrl + "/v1" + "/Product/RequestDeactivation"
  public static RequestDeactivationV2 = environment.losUrl + "/v2" + "/Product/RequestDeactivation"
  public static GetListProdBranchOfficeMbrByProdHId = environment.losUrl + "/v1" + "/Product/GetListProdBranchOfficeMbrByProdHId"
  public static GetListProdHByProdCurrentProdHId = environment.losUrl + "/v1" + "/Product/GetListProdHByProdCurrentProdHId";
  public static AddProductOfficeMbrBatch = environment.losUrl + "/v1" + "/Product/AddProductOfficeMbrBatch";
  public static DeleteProductOfficeMbr = environment.losUrl + "/v1" + "/Product/DeleteProductOfficeMbr";
  public static GetListProdHVersionByProdId = environment.losUrl + "/v1" + "/Product/GetListProdHVersionByProdId";
  public static GetProductDetailComponentInfo = environment.losUrl + "/v1" + "/Product/GetProductDetailComponentInfo";
  public static AddOrEditProductDetail = environment.losUrl + "/v1" + "/Product/AddOrEditProductDetail";
  public static DownloadProductRule = environment.losUrl + "/v1" + "/Product/DownloadProductRule";
  public static UpdateProductPostApv = environment.losUrl + "/v1" + "/Product/UpdateProductPostApv";
  public static ReviewProduct = environment.losUrl + "/v1" + "/Product/ReviewProduct";
  public static ReviewProductV2 = environment.losUrl + "/v2" + "/Product/ReviewProduct";
  public static GetProductById = environment.losUrl + "/v1" + "/Product/GetProductById";
  public static GetProductByHId = environment.losUrl + "/v1" + "/Product/GetProductByHId";
  public static CopyProduct = environment.losUrl + "/v1" + "/Product/CopyProduct";
  public static SubmitProduct = environment.losUrl + "/v1" + "/Product/SubmitProduct"
  public static SubmitProductV2 = environment.losUrl + "/v2" + "/Product/SubmitProduct"
  public static GetListProdBranchOfficeMbrByProdOfferingHId = environment.losUrl + "/v1" + "/Product/GetListProdBranchOfficeMbrByProdOfferingHId";

  //PRODUCT OFFERING
  public static GetProdOfferingHById = environment.losUrl + "/v1" + "/ProductOffering/GetProdOfferingHById";
  public static AddProdOffering = environment.losUrl + "/v1" + "/ProductOffering/AddProdOffering";
  public static EditProdOffering = environment.losUrl + "/v1" + "/ProductOffering/EditProdOffering";
  public static AddOrEditProdOfferingDetail = environment.losUrl + "/v1" + "/ProductOffering/AddOrEditProdOfferingDetail";
  public static GetProdOfferingDetailInfo = environment.losUrl + "/v1" + "/ProductOffering/GetProdOfferingDetailInfo";
  public static GetListProdOfferingVersionByProdId = environment.losUrl + "/v1" + "/ProductOffering/GetListProdOfferingVersionByProdId"
  public static GetListProdOfferingBranchOfficeMbrByProdHId = environment.losUrl + "/v1" + "/ProductOffering/GetListProdOfferingBranchOfficeMbrByProdHId"
  public static GetProductOfferingComponentGrouped = environment.losUrl + "/v1" + "/ProductComponent/GetProductOfferingComponentGrouped";
  public static GetProdOfferingHByCodeAndVersion = environment.losUrl + "/v1" + "/ProductOffering/GetProdOfferingHByCodeAndVersion";
  public static GetListProdOfferingHByProdOfferingCurrentProdHId = environment.losUrl + "/v1" + "/ProductOffering/GetListProdOfferingHByProdOfferingCurrentProdHId"
  public static GetListProdOfferingDByProdOfferingHIdAndProdCompntGrpCode = environment.losUrl + "/v1" + "/ProductOffering/GetListProdOfferingDByProdOfferingHIdAndProdCompntGrpCode"
  public static RequestOfferingDeactivation = environment.losUrl + "/v1" + "/ProductOffering/RequestProdOfferingDeactivation";
  public static RequestOfferingDeactivationV2 = environment.losUrl + "/v2" + "/ProductOffering/RequestProdOfferingDeactivation";
  public static GetListProdOfferingBranchOfficeMbrByProdHIdAndApp = environment.losUrl + "/v1" + "/ProductOffering/GetListProdOfferingBranchOfficeMbrByProdHIdAndApp"
  public static CopyProductOffering = environment.losUrl + "/v1" + "/ProductOffering/CopyProductOffering";
  public static UpdateProdOfferingPostApv = environment.losUrl + "/v1" + "/ProductOffering/UpdateProdOfferingPostApv";
  public static ReviewProdOffering = environment.losUrl + "/v1" + "/ProductOffering/ReviewProdOffering";
  public static ReviewProdOfferingV2 = environment.losUrl + "/v2" + "/ProductOffering/ReviewProdOffering";
  public static GetProdOfferingByProdOfferingId = environment.losUrl + "/v1" + "/ProductOffering/GetProdOfferingByProdOfferingId";
  public static SubmitProdOffering = environment.losUrl + "/v1" + "/ProductOffering/SubmitProdOffering";
  public static SubmitProdOfferingV2 = environment.losUrl + "/v2" + "/ProductOffering/SubmitProdOffering";

  // PRODUCT COMPONENT
  public static GetProductHOComponent = environment.losUrl + "/v1" + "/ProductComponent/GetProductHOComponent";
  public static GetProductHOComponentGrouped = environment.losUrl + "/v1" + "/ProductComponent/GetProductHOComponentGrouped";
  public static GetProductOfferingComponent = environment.losUrl + "/v1" + "/ProductComponent/GetProductOfferingComponent";
  public static DeleteProdOfferingOfficeMbr = environment.losUrl + "/v1" + "/ProductOffering/DeleteProdOfferingOfficeMbr";
  public static AddProdOfferingOfficeMbrBatch = environment.losUrl + "/v1" + "/ProductOffering/AddProdOfferingOfficeMbrBatch";

  // DOC PICKUP REQUEST
  public static GetDocPickupRequestByAppId = environment.losUrl + "/v1" + "/DocPickupRequest/GetDocPickupRequestByAppId";
  public static AddDocPickupRequest = environment.FoundationR3Url + "/v1" + "/DocPickupRequest/AddDocPickupRequest";

  // GO LIVE (LMS)
  public static CheckGoLivePayment = environment.LMSUrl + "/Api/Integration/CheckGoLivePayment";

  //Check DMS
  public static GetSysConfigPncplResultByCode = environment.FoundationR3Url + "/v1" + "/SysConfigResult/GetSysConfigPncplResultByCode";

  //PEFINDO
  public static GetPefindoCustomReport = environment.losUrl + "/v1" + "/Pefindo/GetCustomReport";

  //Task Reassignment
  public static TaskReassignmentApproval = environment.losUrl + "/v1" + "/Approval/TaskReassignmentApproval";

  //Application Source
  public static AddRefAppSrc = environment.losUrl + "/v1" + "/RefAppSrc/AddRefAppSrc";
  public static AddRefAppSrcOfficeMbr = environment.losUrl + "/v1" + "/RefAppSrc/AddRefAppSrcOfficeMbr";
  public static DeleteRefAppSrcOfficeMbr = environment.losUrl + "/v1" + "/RefAppSrc/DeleteRefAppSrcOfficeMbr";
  public static EditRefAppSrc = environment.losUrl + "/v1" + "/RefAppSrc/EditRefAppSrc";
  public static GetRefAppSrcByRefAppSrcId = environment.losUrl + "/v1" + "/RefAppSrc/GetRefAppSrcByRefAppSrcId";
  public static GetListRefAppSrcOfficeMbrByRefAppSrcId = environment.losUrl + "/v1" + "/RefAppSrc/GetListRefAppSrcOfficeMbrByRefAppSrcId";

  //Config Result
  public static GetSysConfigResultByCode = environment.FoundationR3Url + "/v1" + "/SysConfigResult/GetSysConfigResultByCode";
  public static GetSysCtrlCoyBySysKey = environment.FoundationR3Url + "/v1" + "/SysCtrlCoy/GetSysCtrlCoyByKey"

  //App Attr Content
  public static GenerateAppAttrContent = environment.losUrl + "/v1" + "/AppAttrContent/GenerateAppAttrContent";
  public static GenerateAppAttrContentV2 = environment.losUrl + "/v2" + "/AppAttrContent/GenerateAppAttrContent";
  public static GetListAppAttrContentForView = environment.losUrl + "/v1" + "/AppAttrContent/GetListAppAttrContentForView";

  //Dashboard
  public static GetAppCountAndMappingStep = environment.losUrl + "/v1" + "/Dashboard/GetAppCountAndMappingStep";
  public static HitSuperset = environment.Superset + "api/v1" + "/security/login";

  //Agrmnt Tc
  public static GetListAgrmntTcbyAgrmntId = environment.losUrl + "/v1" + "/AgrmntTc/GetListAgrmntTcbyAgrmntId";
  public static SubmitAgrmntTc = environment.losUrl + "/v1" + "/AgrmntTc/SubmitAgrmntTc";

  //Ref Curr
  public static GetRefCurrByCode = environment.FoundationR3Url + "/v1" + "/RefCurr/GetRefCurrByCode";

  //Cust Phone No
  public static GetListCustPhoneNoByCustNo = environment.FoundationR3Url + "/v1" + "/Cust/GetListCustPhoneNoByCustNo";

  //Ref Tax Office
  public static GetRefTaxOfficeDetailByRefOfficeCode = environment.FoundationR3Url + "/v1" + "/RefTaxOffice/GetRefTaxOfficeDetailByRefOfficeCode";

  //OTP
  public static SendOtp = environment.FoundationR3Url + "/v1" + "/Authenticate/SendOtp";
  public static ConfirmOtp = environment.FoundationR3Url + "/v1" + "/Authenticate/ConfirmOtp";
  public static GetOtpProperties = environment.FoundationR3Url + "/v1" + "/Authenticate/GetOtpProperties";
  
}
