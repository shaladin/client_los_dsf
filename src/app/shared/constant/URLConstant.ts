import { environment } from "environments/environment";

export class URLConstant {
  // NOTIFICATION HUB
  public static WebSocketUrl = environment.WebSocketURL + "/Notificationhub";
  public static GetListNotificationHByRefUserId = environment.FoundationR3Url + "/NotificationH/GetListNotificationHByRefUserId";

  //WORKFLOW (LEWAT FOUNDATION)
  public static ResumeWorkflow = environment.FoundationR3Url + "/Workflow/ResumeWorkflow"

  // ASSET
  public static GetListKeyValueByCode = environment.FoundationR3Url + "/AssetType/GetListKeyValueByCode";
  public static GetAssetTypeByCode = environment.FoundationR3Url + "/AssetType/GetAssetTypeByCode";

  // APPROVAL
  public static GetApprovalScreenViewInfo = environment.FoundationR3Url + "/Approval/GetApprovalScreenViewInfo";

  // New Application
  public static AddNewApplication = environment.losUrl + "/Application/AddNewApplication";
  public static AddNewApplicationFromCopy = environment.losUrl + "/Application/AddNewApplicationFromCopy";

  // APP Application
  public static AddApp = environment.losUrl + "/Application/AddApp";
  public static AddAppMaindata = environment.losUrl + "/Application/AddAppMainData";
  public static GetAppById = environment.losUrl + "/Application/GetAppById";
  public static GetAppByAppNo = environment.losUrl + "/Application/GetAppByAppNo";
  public static GetAppDetailForTabAddEditAppById = environment.losUrl + "/Application/GetAppDetailForTabAddEditAppById";
  public static GetAppDetailForAppTabById = environment.losUrl + "/Application/GetAppDetailForAppTabById";
  public static AddAppFromLead = environment.losUrl + "/Application/AddAppFromLead";
  public static DataTableNAP = environment.losUrl + "/Application/DataTableNAP";
  public static GetRuleFeeAndInsFixedNAP = environment.losUrl + "/Application/GetRuleFeeAndInsFixedNAP";
  public static GetAppAndAppCustDetailByAgrmntId = environment.losUrl + "/Application/GetAppAndAppCustDetailByAgrmntId";
  public static SubmitNAP = environment.losUrl + "/Application/SubmitNAP";
  public static SubmitNapCustMainData = environment.losUrl + "/Application/SubmitNAPCustMainData";
  public static CreateWorkflowDuplicateCheck = environment.losUrl + "/Application/CreateWorkflowDuplicateCheck";
  public static AddEditAppCF2W = environment.losUrl + "/Application/AddEditAppCF2W";
  public static DataTableFeeAndInsNAP = environment.losUrl + "/Application/DataTableFeeAndInsNAP";
  public static UpdateAppStepByAppId = environment.losUrl + "/Application/UpdateAppStepByAppId";
  public static CopyCancelledApp = environment.losUrl + "/Application/CopyCancelledApp";
  public static CopyCancelledAppForMainData = environment.losUrl + "/Application/CopyCancelledAppForMainData";
  public static GetSummaryAppByAppId = environment.losUrl + "/Application/GetSummaryAppByAppId";
  public static AddAppFromMou = environment.losUrl + "/Application/AddAppFromMou";
  public static CheckMouCustIntegrator = environment.losUrl + "/MouCust/CheckMouCustIntegrator";
  public static AddNap1FromLead = environment.losUrl + "/Application/AddNap1FromLead";

  //App Loan Purpose
  public static AddAppLoanPurpose = environment.losUrl + "/AppLoanPurpose/AddAppLoanPurpose";
  public static EditAppLoanPurpose = environment.losUrl + "/AppLoanPurpose/EditAppLoanPurpose";
  public static GetListAppLoanPurposeByAppId = environment.losUrl + "/AppLoanPurpose/GetListAppLoanPurposeByAppId";
  public static GetAppLoanPurposeByAppLoanPurposeId = environment.losUrl + "/AppLoanPurpose/GetAppLoanPurposeByAppLoanPurposeId";
  public static DeleteAppLoanPurpose = environment.losUrl + "/AppLoanPurpose/DeleteAppLoanPurpose"
  public static CheckFinAmtAppLoanPurpose = environment.losUrl + "/AppLoanPurpose/CheckFinAmtAppLoanPurpose"
  public static GetAppLoanPurposeByAppIdSupplCode = environment.losUrl + "/AppLoanPurpose/GetAppLoanPurposeByAppIdSupplCode";
  public static GetAppLoanPurposeVendorAndVendorEmpByAppId = environment.losUrl + "/AppLoanPurpose/GetAppLoanPurposeVendorAndVendorEmpByAppId";

  // App Collateral
  public static GetAppCollateralRegistrationByAppId = environment.losUrl + "/AppCollateralRegistration/GetAppCollateralRegistrationByAppId";
  public static GetAppCollateralRegistrationByAgrmntId = environment.losUrl + "/AppCollateralRegistration/GetAppCollateralRegistrationByAgrmntId";
  public static GetCollateralByFullAssetCodeAssetTypeSerialNoForAppCollateral = environment.FoundationR3Url + "/Collateral/GetCollateralByFullAssetCodeAssetTypeSerialNoForAppCollateral";

  // App Asset Suppl Emp
  //public static GetListAppAssetSupplEmpByAppAssetId = "/AppAssetSupplEmp/GetListAppAssetSupplEmpByAppAssetId";

  // App Asset
  public static GetAppAssetListByAppIdForCommision = "/AppAsset/GetAppAssetListByAppIdForCommision";
  public static GetListAppAssetForCopyByAppId = environment.losUrl + "/AppAsset/GetListAppAssetForCopyByAppId";
  public static GetListOfAsset = environment.losUrl + "/AppAsset/GetListOfAsset";
  //public static GetAppAssetByAppAssetId = "/AppAsset/GetAppAssetByAppAssetId";
  public static GetAppAssetByAppAssetIdWithSerialNoDefinition = environment.losUrl + "/AppAsset/GetAppAssetByAppAssetIdWithSerialNoDefinition";
  public static GetAppAssetByAppAssetId = environment.losUrl + "/AppAsset/GetAppAssetByAppAssetId"
  public static CopyAppAsset = environment.losUrl + "/AppAsset/CopyAppAsset"
  // App Asset Suppl Emp
  public static GetListAppAssetSupplEmpByListAppAssetId = environment.losUrl + "/AppAssetSupplEmp/GetListAppAssetSupplEmpByListAppAssetId";
  public static GetAppAssetSupplEmpByAppAssetIdAndCode = environment.losUrl + "/AppAssetSupplEmp/GetAppAssetSupplEmpByAppAssetIdAndCode";

  // App Referantor
  public static AddAppReferantor = environment.losUrl + "/AppReferantor/AddAppReferantor";
  public static EditAppReferantor = environment.losUrl + "/AppReferantor/EditAppReferantor";
  public static DeleteAppReferantor = environment.losUrl + "/AppReferantor/DeleteAppReferantor";
  public static GetAppReferantorByAppReferantorId = environment.losUrl + "/AppReferantor/GetAppReferantorByAppReferantorId";
  public static GetAppReferantorByAppId = environment.losUrl + "/AppReferantor/GetAppReferantorByAppId";
  public static VendorCategoryAgencyCompany = "AGENCY_COMPANY";
  public static VendorCategoryAgencyPersonal = "AGENCY_PERSONAL";

  // App Cross
  public static EditAppAddAppCross = environment.losUrl + "/Application/EditAppAddAppCross";
  public static GetAppCrossByCrossAgrmntNo = "/AppCross/GetAppCrossByCrossAgrmntNo";
  public static DeleteAppCross = environment.losUrl + "/AppCross/DeleteAppCross";
  public static GetListAppCross = environment.losUrl + "/AppCross/GetListAppCross";
  public static AddListAppCross = "/AppCross/AddListAppCross";

  // App Fctr
  public static GetAppFctrByAppId = environment.losUrl + "/AppFctr/GetAppFctrByAppId";

  // Ref App Src
  public static GetListKvpActiveRefAppSrc = environment.losUrl + "/RefAppSrc/GetListKvpActiveRefAppSrc";

  public static GetListProduct = "http://creator_websvr:7272/NEW_FINANCING/api/Catalog/getPopularViewByCriteria";
  public static Login = "/Authenticate/Login";
  public static LoginWithToken = environment.FoundationR3Url + "/Authenticate/LoginWithToken";
  public static LoginToken = "/UserManagement/HTML6Login";
  public static Logout = "/UserManagement/LogOut"
  public static GetListOffice = "/RefOffice/GetRefOfficePaging";
  public static GetProvince = "/los/v1/get_provinsi";
  public static GetCityByProvince = "/los/v1/get_kota";
  public static getProspectByProspectNo = "/api/MobileProspectTask/GetProspectByProspectNo";
  public static submitNCProspect = "/api/MobileProspectTask/submitNCProspect";
  public static addCustPersonal = "";
  public static FormDefault = "dashboard/dash-board";
  public static LoginByRole = "/Authenticate/LoginByRole";
  public static LoginByToken = "/Authenticate/LoginByToken";
  public static UpdateToken = "/Authenticate/UpdateRole";
  public static LoginURLFrontEnd = "Pages/Login";

  //Asset Master
  public static GetAssetMasterTypeByFullAssetCode = environment.FoundationR3Url + "/AssetMaster/GetAssetMasterTypeByFullAssetCode";

  // App Commission
  public static AddOrEditAppCommissionData = environment.losUrl + "/AppCommission/AddOrEditAppCommissionData";
  public static GetAppCommissionDataForEditByAppId = environment.losUrl + "/AppCommission/GetAppCommissionDataForEditByAppId";
  public static DeleteAppCommissionData = environment.losUrl + "/AppCommission/DeleteAppCommissionData";
  public static GetAppCommissionRule = environment.losUrl + "/AppCommission/GetAppCommissionRule";
  public static GetAppCommissionTax = environment.losUrl + "/AppCommission/GetAppCommissionTax";
  public static GetAppCommissionTaxAndCalcGrossYield = environment.losUrl + "/AppCommission/GetAppCommissionTaxAndCalcGrossYield";
  public static CalCulateGrossYield = environment.losUrl + "/AppCommission/CalCulateGrossYield";

  public static GetRefOfficeByOfficeCode = environment.FoundationR3Url + "/RefOffice/GetRefOfficeByOfficeCode";
  public static GetListCenterGrpMemberByCenterGrpCode = environment.FoundationR3Url + "/CenterGrpOfficeMbr/GetListCenterGrpMemberByCenterGrpCode";


  // public static GetAppDetailForAppTabById = environment.losUrl + "/Application/GetAppDetailForAppTabById";
  // public static AddAppFromLead = environment.losUrl + "/Application/AddAppFromLead";

  // App Asset
  public static GetAppAssetForDealerDataByAppId = environment.losUrl + "/AppAsset/GetAppAssetForDealerDataByAppId";
  public static GetAppAssetForDealerDataByAppAssetId = environment.losUrl + "/AppAsset/GetAppAssetForDealerDataByAppAssetId";
  public static GetCurrentProdOfferingDByProdOfferingCodeAndRefProdCompntCode = environment.tempUrl + "/ProductOffering/GetCurrentProdOfferingDByProdOfferingCodeAndRefProdCompntCode"
  public static GetProdOfferingDByProdOfferingHIdAndCompCode = environment.tempUrl + "/ProductOffering/GetProdOfferingDByProdOfferingHIdAndCompCode";
  // App Commission
  public static GetAppCommissionDataDetailByAppId = environment.losUrl + "/AppCommission/GetAppCommissionDataDetailByAppId";

  // App Referantor
  public static GetAppReferantorForAppsData = environment.losUrl + "/AppReferantor/GetAppReferantorForAppsData";

  //CUST TYPE
  public static GetAppByCustNoAndIsAppInitDone = environment.losUrl + "/Application/GetAppByCustNoAndIsAppInitDone";
  public static GetAppByCustNoAndAppStat = environment.losUrl + "/Application/GetAppByCustNoAndAppStat";

  //Asset Accessory
  public static GetAssetAccessoryByCode = environment.FoundationR3Url + "/AssetAccessory/GetAssetAccessoryByCode";

  //Asset Master
  public static GetAssetMasterForLookupEmployee = environment.FoundationR3Url + "/AssetMaster/GetAssetMasterForLookupEmployee";

  //GENERAL SETTING
  public static GetBusinessDt = "/GeneralSetting/GetBusinessDate";
  public static AddGeneralSetting = "/GeneralSetting/AddGeneralSetting";
  public static EditGeneralSetting = "/GeneralSetting/EditGeneralSetting";
  public static GetGeneralSettingPaging = "/GeneralSetting/GetGeneralSettingPaging";
  public static GetGeneralSettingById = "/GeneralSetting/GetGeneralSettingById";
  public static GetGeneralSettingValue = "/GeneralSetting/GetGeneralSettingValue";
  public static GetGeneralSettingByCode = environment.FoundationR3Url + "/GeneralSetting/GetGeneralSettingByCode";
  public static GetListGeneralSettingByListGsCode = environment.FoundationR3Url + "/GeneralSetting/GetListGeneralSettingByListGsCode";

  //REF OFFICE
  public static GetRefOfficeObj = "/RefOffice/GetRefOfficeObj";
  public static GetRefOfficeActiveAndNonVirtualKeyValue = "/RefOffice/GetRefOfficeActiveAndNonVirtualKeyValue";
  public static GetAllRefOffice = "/RefOffice/GetAllRefOffice";
  public static GetListUpperHierarchyRefOfficeByRefOrgId = "/RefOffice/GetListUpperHierarchyRefOfficeByRefOrgId";
  public static AddRefOffice = "/RefOffice/AddRefOffice";
  public static EditRefOffice = "/RefOffice/EditRefOffice";
  public static DeleteRefOffice = "/RefOffice/DeleteRefOffice";
  public static GetCenterGrpByCenterGrpTypeCode = "/RefOffice/GetCenterGrpByCenterGrpCode";
  public static GetListOfficeCenterGrp = "/RefOffice/GetListOfficeCenterGrp";
  public static AddCenterGroupOfficeMember = "RefOffice/AddCenterGroupOfficeMember";
  public static DeleteCenterGroupOfficeMember = "/RefOffice/DeleteCenterGroupOfficeMember";
  public static GetListKvpActiveRefOffice = "/RefOffice/GetListKvpActiveRefOffice";
  public static GetListRefOffice = "/RefOffice/GetListRefOffice";
  public static GetListActiveRefOffice = environment.FoundationR3Url + "/RefOffice/GetListKeyValueActiveByCode";
  public static GetListKvpActiveRefOfficeForPaging = environment.FoundationR3Url + "/RefOffice/GetListKvpActiveRefOfficeForPaging";
  public static GetListKvpActiveRefOfficeIdForPaging = environment.FoundationR3Url + "/RefOffice/GetListKvpActiveRefOfficeIdForPaging";

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
  public static GetListActiveRefReason = environment.FoundationR3Url + "/RefReason/GetListActiveRefReason";
  public static GetListActiveRefReasonByRefReasonTypeCode = environment.FoundationR3Url + "/RefReason/GetListKeyValueByCode";

  // AppAgrmntCancel
  public static AddAppAgrmntCancel = environment.losUrl + "/AppAgrmntCancel/AddAppAgrmntCancel";
  public static AddAppAssetCancel = environment.losUrl + "/AppAgrmntCancel/AddAppAssetCancel";
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
  public static GetRefBankByBankCodeAsync = environment.FoundationR3Url + "/RefBank/GetRefBankByBankCodeAsync";
  public static GetRefBankByRefBankIdAsync = environment.FoundationR3Url + "/RefBank/GetRefBankByRefBankIdAsync";

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
  public static GetRefEmpByEmpNo = "/RefEmp/GetRefEmpByEmpNo"
  public static GetListRefEmpByGsValueandOfficeId = environment.FoundationR3Url + "/RefEmp/GetListRefEmpByGsValueandOfficeId"

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
  public static GetRefUserByUsername = environment.FoundationR3Url + "/RefUser/GetRefUserByUsername";
  public static GetRefUserByResetCode = environment.FoundationR3Url + "/RefUser/GetRefUserByResetCode";
  public static ResetPasswordByUsername = environment.FoundationR3Url + "/RefUser/ResetPasswordByUsername";

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
  public static GetListActiveRefPayFreq = environment.FoundationR3Url + "/RefPayFreq/GetListActiveRefPayFreq";

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
  public static GetRefCoy = environment.FoundationR3Url + "/RefCoy/GetRefCoy";
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
  public static GetRefMasterByMasterCode = environment.FoundationR3Url + "/RefMaster/GetRefMasterByMasterCode";
  public static GetRefMasterListKeyValueActiveByCode = environment.FoundationR3Url + "/RefMaster/GetListKeyValueActiveByCode"
  public static GetListActiveRefMaster = environment.FoundationR3Url + "/RefMaster/GetListActiveRefMaster"
  public static GetRefMasterByRefMasterTypeCode = environment.FoundationR3Url + "/RefMaster/GetRefMasterByRefMasterTypeCode"
  public static GetListActiveRefMasterWithMappingCodeAll = environment.FoundationR3Url + "/RefMaster/GetListActiveRefMasterWithMappingCodeAll";
  public static GetListRefMasterByRefMasterTypeCodes = environment.FoundationR3Url + "/RefMaster/GetListRefMasterByRefMasterTypeCodes";
  public static GetRefMasterByRefMasterTypeCodeAndMasterCode = environment.FoundationR3Url + "/RefMaster/GetRefMasterByRefMasterTypeCodeAndMasterCode"
  public static GetListActiveRefMasterByRefMasterTypeCode = environment.FoundationR3Url + "/RefMaster/GetListActiveRefMasterByRefMasterTypeCode"
  public static GetListActiveRefMasterByRefMasterCodeAndMappingCodes = environment.FoundationR3Url + "/RefMaster/GetListActiveRefMasterByRefMasterCodeAndMappingCodes"

  //REF ATTR
  public static GetListActiveRefAttrByAttrGroup = environment.FoundationR3Url + "/RefAttr/GetListActiveRefAttrByAttrGroup"
  //REF PROV DISTRICT
  public static GetRefProvDistrictPaging = "/RefProvDistrict/GetRefProvDistrictPaging";
  public static GetRefProvDistrictByProvDistrictCode = environment.FoundationR3Url + "/RefProvDistrict/GetRefProvDistrictByProvDistrictCode";

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
  public static NotificationPost = "/Message/Post";
  public static UpdateReadNotification = environment.FoundationR3Url + "/NotificationD/UpdateReadNotificationD";

  //REF CURR
  public static GetRefCurrPaging = "/RefCurr/GetRefCurrPaging";
  public static AddRefCurr = "/RefCurr/AddRefCurr";
  public static EditRefCurr = "/RefCurr/EditRefCurr";
  public static GetRefCurr = "/RefCurr/GetRefCurr";
  public static AddExchangeRate = "/RefCurr/AddExchangeRate";
  public static EditExchangeRate = "/RefCurr/EditExchangeRate";
  public static GetExchangeRate = "/RefCurr/GetExchangeRate";
  public static GetListKvpActiveRefCurr = environment.FoundationR3Url + "/RefCurr/GetListKvpActiveRefCurr"
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
  public static AddQueue = environment.FoundationR3Url + "/FOUNDATION/RabbitMq/AddQueue";

  //REF MODULE
  public static GetListRefModuleKeyValue = "/RefModule/GetListRefModuleKeyValue";

  //REF EMP
  public static GetRefEmpForLookupEmployee = environment.FoundationR3Url + "/RefEmp/GetRefEmpForLookupEmployee";
  public static GetRefEmpForLookupByUsername = environment.FoundationR3Url + "/RefEmp/GetRefEmpForLookupByUsername";

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
  public static GetUploadSettingHIdByUploadTypeId = "/UploadSetting/GetUploadSettingHIdByUploadTypeId"
  public static GetListUploadSettingDIdByUploadSettingHId = "/UploadSetting/GetListUploadSettingDIdByUploadSettingHId"
  public static GetListUploadSettingDIdByUploadTypeId = "/UploadSetting/GetListUploadSettingDIdByUploadTypeId"
  public static AssignRoleToUploadSetting = "/UploadSetting/AssignRoleToUploadSetting"
  public static GetListRefRoleByUploadTypeId = "/UploadSetting/GetListRefRoleByUploadTypeId"
  public static GetListUploadSettingDByUploadSettingHId = '/UploadSetting/GetListUploadSettingDByUploadSettingHId'
  public static CancelUpload = environment.FoundationR3Url + "/Upload/CancelUpload";
  public static UploadReview = environment.FoundationR3Url + "/Upload/UploadReview";

  // GENERIC
  public static GetPagingObjectBySQL = "/Generic/GetPagingObjectBySQL";

  // LEAD
  public static AddLead = environment.losUrl + "/Lead/AddLead";
  public static EditLead = environment.losUrl + "/Lead/EditLead";
  public static DeleteLead = environment.losUrl + "/Lead/DeleteLead";
  public static GetLeadByLeadId = environment.losUrl + "/Lead/GetLeadByLeadId";
  public static GetLeadByLeadNo = environment.losUrl + "/Lead/GetLeadByLeadNo";
  public static GetLeadForUpdateByLeadId = environment.losUrl + "/Lead/GetLeadForUpdateByLeadId";
  public static GetLeadForUpdateByLeadNo = environment.losUrl + "/Lead/GetLeadForUpdateByLeadNo";

  public static SubmitWorkflowLeadInput = environment.losUrl + "/Lead/SubmitWorkflowLeadInput";
  public static GetLeadPersonalForLookupCopy = environment.losUrl + "/Lead/GetLeadPersonalForLookupCopy";
  public static SubmitWorkflowLeadInputKta = environment.losUrl + "/Lead/SubmitWorkflowLeadInputKta";
  public static RejectLead = environment.losUrl + "/Lead/RejectLead";
  public static CheckRapindo = environment.losUrl + "/Lead/CheckRapindo";
  public static CheckIntegrator = environment.losUrl + "/Lead/CheckIntegrator";

  // LEAD ASSET
  public static GetLeadAssetByLeadId = environment.losUrl + "/LeadAsset/GetLeadAssetByLeadId";
  public static GetLeadAssetForCheck = environment.losUrl + "/LeadAsset/GetLeadAssetForCheck"

  //GUARANTOR
  public static GetListAppGuarantor = environment.losUrl + "/AppGuarantor/GetListAppGuarantor"
  public static GetAppGuarantorList = environment.losUrl + "/AppGuarantor/GetAppGuarantorList"
  public static GetListAppGuarantorDetail = environment.losUrl + "/AppGuarantor/GetListAppGuarantorDetail"
  public static AddAppGuarantorPersonal = environment.losUrl + "/AppGuarantor/AddAppGuarantorPersonal"
  public static AddAppGuarantorCompany = environment.losUrl + "/AppGuarantor/AddAppGuarantorCompany"
  public static GetAppGuarantorPersonalByAppGuarantorId = environment.losUrl + "/AppGuarantor/GetAppGuarantorPersonalByAppGuarantorId"
  public static GetAppGuarantorCompanyByAppGuarantorId = environment.losUrl + "/AppGuarantor/GetAppGuarantorCompanyByAppGuarantorId"
  public static EditAppGuarantorPersonal = environment.losUrl + "/AppGuarantor/EditAppGuarantorPersonal"
  public static EditAppGuarantorCompany = environment.losUrl + "/AppGuarantor/EditAppGuarantorCompany"
  public static DeleteAppGuarantor = environment.losUrl + "/AppGuarantor/DeleteAppGuarantor"
  public static GetListAppGuarantorCompanyByAppId = environment.losUrl + "/AppGuarantor/GetListAppGuarantorCompanyByAppId"
  public static GetListAppGuarantorPersonalByAppId = environment.losUrl + "/AppGuarantor/GetListAppGuarantorPersonalByAppId"
  public static GetListAppGuarantorPersonalForView = environment.losUrl + "/AppCust/GetListAppGuarantorPersonalForView"
  public static GetListAppGuarantorCompanyForView = environment.losUrl + "/AppCust/GetListAppGuarantorCompanyForView"

  // Vendor
  public static GetListVendorBankAccByVendorId = environment.FoundationR3Url + "/VendorBankAcc/GetListVendorBankAccByVendorId";
  public static GetListVendorBankAccByVendorCode = environment.FoundationR3Url + "/VendorBankAcc/GetListVendorBankAccByVendorCode";
  public static GetListKeyValueVendorByCategoryCodeAndOfficeCode = environment.FoundationR3Url + "/Vendor/GetListKeyValueByCategoryCodeAndOfficeCode";
  public static GetListKeyValueActiveVendorByCategoryCodeAndOfficeCode = environment.FoundationR3Url + "/Vendor/GetListKeyValueActiveByCategoryCodeAndOfficeCode";
  public static GetVendorByVendorCode = environment.FoundationR3Url + "/Vendor/GetVendorByVendorCode";
  public static GetListVendorEmpByVendorId = environment.FoundationR3Url + "/VendorEmp/GetListVendorEmpByVendorId";
  public static GetListVendorEmpByVendorIdAndPositionCodes = environment.FoundationR3Url + "/VendorEmp/GetListVendorEmpByVendorIdAndPositionCodes";
  public static GetListActiveVendorEmpByVendorIdAndPositionCodes = environment.FoundationR3Url + "/VendorEmp/GetListActiveVendorEmpByVendorIdAndPositionCodes";
  public static GetVendorEmpSupervisorByVendorEmpNo = environment.FoundationR3Url + "/VendorEmp/GetVendorEmpSupervisorByVendorEmpNo";
  public static GetVendorEmpByVendorIdVendorEmpNo = environment.FoundationR3Url + "/VendorEmp/GetVendorEmpByVendorIdVendorEmpNo";
  public static GetListVendorByCategoryCodeAndOfficeCode = environment.FoundationR3Url + "/Vendor/GetListVendorByCategoryCodeAndOfficeCode";
  public static GetListActiveVendorByCategoryCodeAndOfficeCode = environment.FoundationR3Url + "/Vendor/GetListActiveVendorByCategoryCodeAndOfficeCode";
  public static GetVendorForLookup = environment.FoundationR3Url + "/Vendor/GetVendorForLookup";

  // VendorEmp
  public static GetListVendorBankByVendorEmpNo = "/VendorEmp/GetListVendorBankByVendorEmpNo";
  public static GetListBankByVendorEmpNoAndVendorCode = environment.FoundationR3Url + "/VendorEmp/GetListBankByVendorEmpNoAndVendorCode";
  public static GetVendorEmpByVendorEmpNo = "/VendorEmp/GetVendorEmpByVendorEmpNo";
  public static GetListVendorEmpByVendorIdAndPosition = environment.FoundationR3Url + "/VendorEmp/GetListVendorEmpByVendorIdAndPosition";
  public static GetListKeyValueVendorEmpByVendorIdAndPosition = environment.FoundationR3Url + "/VendorEmp/GetListKeyValueVendorEmpByVendorIdAndPosition";
  public static GetVendorEmpByVendorEmpId = environment.FoundationR3Url + "/VendorEmp/GetVendorEmpByVendorEmpId";

  //Life Ins
  public static AddAppLifeInsH = environment.losUrl + "/AppLifeIns/AddAppLifeInsH";
  public static EditAppLifeInsH = environment.losUrl + "/AppLifeIns/EditAppLifeInsH";
  public static InitAppLifeInsH = environment.losUrl + "/AppLifeIns/InitAppLifeInsH";
  public static GetRuleAdmFee = environment.losUrl + "/AppLifeIns/GetRuleAdmFee";
  public static GetRuleRate = environment.losUrl + "/AppLifeIns/GetRuleRate";
  public static GetRuleRateV2 = environment.losUrl + "/AppLifeIns/GetRuleRateV2";
  public static DeleteAppLifeIns = environment.losUrl + "/AppLifeIns/DeleteAppLifeIns";
  public static AddEditAppLifeInsH = environment.losUrl + "/AppLifeIns/AddEditAppLifeInsH";

  // MOU CUST SCORING
  public static GetMouCustScoreByMouCustId = environment.losUrl + "/MouCustScoring/GetMouCustScoreByMouCustId";

  // MOU CUST ASSET
  public static GetMouCustAssetByMouCustId = environment.losUrl + "/MouCustAsset/GetMouCustAssetByMouCustId";

  // MOU CUST ASSET
  public static GetAppLifeInsHByAppId = environment.losUrl + "/AppLifeIns/GetAppLifeInsHByAppId";

  // MOU CUST
  public static GetMouCustById = environment.losUrl + "/MouCust/GetMouCustById";
  public static AddMouCust = environment.losUrl + "/MouCust/AddMouCust";
  public static EditMouCust = environment.losUrl + "/MouCust/EditMouCust";
  public static GetMouCustClauseByMouCustId = environment.losUrl + "/MouCustClause/GetMouCustClauseByMouCustId";
  public static AddMouCustClause = environment.losUrl + "/MouCustClause/AddMouCustClause";
  public static EditMouCustClause = environment.losUrl + "/MouCustClause/EditMouCustClause";
  public static GetMouCustTcFromRule = environment.losUrl + "/MouCustTc/GetMouCustTcFromRule";
  public static EditListMouCustTc = environment.losUrl + "/MouCustTc/EditListMouCustTc";
  public static GetListMouCustListedCustFctrByMouCustId = environment.losUrl + "/MouCustListedCustFctr/GetListMouCustListedCustFctrByMouCustId";
  public static DeleteMouCustListedCustFctr = environment.losUrl + "/MouCustListedCustFctr/DeleteMouCustListedCustFctr";
  public static AddMouCustListedCustFctr = environment.losUrl + "/MouCustListedCustFctr/AddMouCustListedCustFctr";
  public static SubmitWorkflowMouRequest = environment.losUrl + "/MouCust/SubmitWorkflowMouRequest";
  public static SubmitMouReview = environment.losUrl + "/MouCust/SubmitMouReview";
  public static SubmitMouReviewNew = environment.losUrl + "/MouCust/SubmitMouReviewNew";
  public static ReturnMouReview = environment.losUrl + "/MouCust/ReturnMouReview";
  public static EditMouForCancelByMouId = environment.losUrl + "/MouCust/EditMouForCancelByMouId";
  public static GetListMouByAppIdAndMouType = environment.losUrl + "/MouCust/GetListMouByAppIdAndMouType";
  public static GetListMouCustByCustNo = environment.losUrl + "/MouCust/GetListMouCustByCustNo";
  public static GetMouCustByAppId = environment.losUrl + "/MouCust/GetMouCustByAppId";
  public static MouCustExecutionHumanActivity = environment.losUrl + "/MouCust/MouCustExecutionHumanActivity";

  public static AddEditMouCustPersonalData = environment.losUrl + "/MouCust/AddEditMouCustPersonalData";
  public static AddEditMouCustCompanyData = environment.losUrl + "/MouCust/AddEditMouCustCompanyData";
  public static GetMouCustByMouCustId = environment.losUrl + "/MouCust/GetMouCustByMouCustId";

  // MOU CUST DUPCHECK
  public static GetMouCustDuplicateCheck = environment.losUrl + "/MouCustDupCheck/GetMouCustDuplicateCheck";
  public static GetMouSpouseDuplicateCheck = environment.losUrl + "/MouCustDupCheck/GetMouSpouseDuplicateCheck";
  public static GetMouGuarantorDuplicateCheck = environment.losUrl + "/MouCustDupCheck/GetMouGuarantorDuplicateCheck";
  public static GetMouShareholderDuplicateCheck = environment.losUrl + "/MouCustDupCheck/GetMouShareholderDuplicateCheck";
  public static EditCustNoMouCust = environment.losUrl + "/MouCustDupCheck/EditCustNoMouCust";
  public static SubmitMouDupCheck = environment.losUrl + "/MouCustDupCheck/SubmitMouDupCheck";

  // MOU CUST FCTR
  public static AddMouCustFctr = environment.losUrl + "/MouCustFctr/AddMouCustFctr";
  public static EditMouCustFctr = environment.losUrl + "/MouCustFctr/EditMouCustFctr";
  public static AddorEditListMouCustListedCustFctr = environment.losUrl + "/MouCustListedCustFctr/AddorEditListMouCustListedCustFctr";
  public static GetMouCustFctrByMouCustId = environment.losUrl + "/MouCustFctr/GetMouCustFctrByMouCustId";
  public static GetMouCustFctrForMouViewByMouCustId = environment.losUrl + "/MouCustFctr/GetMouCustFctrForMouViewByMouCustId";

  // MOU CUST ASSET
  public static AddMouCustAsset = environment.losUrl + "/MouCustAsset/AddMouCustAsset";
  public static DeleteMouCustAsset = environment.losUrl + "/MouCustAsset/DeleteMouCustAsset";
  public static GetAssetTypeKeyValueCode = environment.FoundationR3Url + "/AssetType/GetListKeyValueByCode";

  // MOU CUST ASSET
  public static GetMouCustFeeByMouCustId = environment.losUrl + "/MouCustFee/GetMouCustFeeByMouCustId";
  public static GetListMouCustFeeByMouCustId = environment.losUrl + "/MouCustFee/GetListMouCustFeeByMouCustId";
  public static GetMouCustFeeForMouRequestByMouCustId = environment.losUrl + "/MouCustFee/GetMouCustFeeForMouRequestByMouCustId";
  public static GetRefFeeList = environment.losUrl + "/RefFee/GetRefFeeList";
  public static AddMouCustFee = environment.losUrl + "/MouCustFee/AddMouCustFee";
  public static DeleteMouCustFee = environment.losUrl + "/MouCustFee/DeleteMouCustFee";

  // MOU CUST CLAUSE
  public static GetMouCustDataByMouCustId = environment.losUrl + "/MouCustClause/GetMouCustDataByMouCustId";

  // MOU CUST COLLATERAL
  public static AddMouCustCollateralData = environment.losUrl + "/MouCustCollateral/AddMouCustCollateralData";
  public static AddExistingCustCollateralData = environment.losUrl + "/MouCustCollateral/AddExistingCustCollateralData";
  public static EditMouCustCollateralData = environment.losUrl + "/MouCustCollateral/EditMouCustCollateralData";
  public static DeleteMouCustCollateral = environment.losUrl + "/MouCustCollateral/DeleteMouCustCollateral";
  public static GetMouCustCollateralByMouCustId = environment.losUrl + "/MouCustCollateral/GetMouCustCollateralByMouCustId";
  public static GetMouCustCollateralForMouViewByMouCustId = environment.losUrl + "/MouCustCollateral/GetMouCustCollateralForMouViewByMouCustId";

  public static GetMouCustCollateralDataForUpdateByMouCustCollateralId = environment.losUrl + "/MouCustCollateral/GetMouCustCollateralDataForUpdateByMouCustCollateralId";
  public static GetListCollateralByCustNo = environment.FoundationR3Url + "/Collateral/GetListCollateralByCustNo";
  public static GetListCollateralByListCollateralNo = environment.FoundationR3Url + "/Collateral/GetListCollateralByListCollateralNo";
  public static GetMouCustCollateralDataExistingByCollateralNo = environment.losUrl + "/MouCustCollateral/GetMouCustCollateralDataExistingByCollateralNo";

  public static CheckMouCustCollateralIntegrator = environment.losUrl + "/MouCustCollateral/CheckMouCustCollateralIntegrator";
  // MOU CUST COLLATERAL DOC

  // MOU CUST RVW H
  public static GetMouCustRvwHByMouCustId = environment.losUrl + "/MouCustRvwH/GetMouCustRvwHByMouCustId"
  public static GetListMouCustRvwD = environment.losUrl + "/MouCustRvwD/GetListMouCustRvwD"

  // MOU CUST LEGAL REVIEW
  public static GetMouCustLglReviewByMouCustId = environment.losUrl + "/MouCustLglReview/GetMouCustLglReviewByMouCustId";
  public static AddEditRangeMouCustLglReview = environment.losUrl + "/MouCustLglReview/AddEditRangeMouCustLglReview";
  public static EditRangeMouCustLglReview = environment.losUrl + "/MouCustLglReview/EditRangeMouCustLglReview";

  // MOU CUST TC
  public static GetCustMouTcByCustMouId = environment.losUrl + "/MouCustTc/GetCustMouTcByCustMouId";
  public static GetMouCustTcForMouLglByCustMouId = environment.losUrl + "/MouCustTc/GetMouCustTcForMouLglByCustMouId";
  // public static EditListMouCustTc = environment.losUrl + "/MouCustTc/EditListMouCustTc";

  // MOU DOC SIGNER
  public static AddMouCustSigner = environment.losUrl + "/MouCustSigner/AddMouCustSigner";
  public static GetMouCustSignerByMouCustId = environment.losUrl + "/MouCustSigner/GetMouCustSignerByMouCustId";

  // MOU CUST DOC PRINT
  public static GetListMouCustDocPrintForViewByMouCustId = environment.losUrl + "/MouCustDocPrint/GetListMouCustDocPrintForViewByMouCustId";
  public static EditMouCustDocPrintSequenceNo = environment.losUrl + "/MouCustDocPrint/EditMouCustDocPrintSequenceNo";

  // REF COUNTRY
  public static GetRefCountryByCountryCode = environment.FoundationR3Url + "/RefCountry/GetRefCountryByCountryCode";

  // REF PROFESSION
  public static GetRefProfessionByCode = environment.FoundationR3Url + "/RefProfession/GetRefProfessionByProfessionCode";

  //REF INDUSTRY TYPE
  public static GetRefIndustryTypeByCode = environment.FoundationR3Url + "/RefIndustryType/GetRefIndustryTypeByIndustryTypeCode";
  public static GetRefIndustryTypeByRefIndustryTypeId = environment.FoundationR3Url + "/RefIndustryType/GetRefIndustryTypeByRefIndustryTypeId";

  //REF CUST MODEL
  public static GetListKeyValueByMrCustTypeCode = environment.FoundationR3Url + "/RefCustModel/GetListKeyValueByMrCustTypeCode";

  // REF LOB
  public static GetListActiveLob = environment.FoundationR3Url + "/RefLob/GetListKeyValueActiveByCode";

  //CUST
  public static GetCustByCustNo = environment.FoundationR3Url + "/Cust/GetCustByCustNo";
  public static GetCustByCustId = environment.FoundationR3Url + "/Cust/GetCustByCustId";
  public static GetCustPersonalByCustId = environment.FoundationR3Url + "/CustPersonal/GetCustPersonalByCustId";
  public static GetCustCompanyByCustId = environment.FoundationR3Url + "/CustCompany/GetCustCompanyByCustId";
  public static GetCustAddrByMrCustAddrType = environment.FoundationR3Url + "/CustAddr/GetCustAddrByMrCustAddrType";
  public static GetCustCompanyContactPersonByCustCompanyId = environment.FoundationR3Url + "/CustCompanyContactPerson/GetCustCompanyContactPersonByCustCompanyId";
  public static GetCustPersonalForCopyByCustId = environment.FoundationR3Url + "/Cust/GetCustPersonalForCopyByCustId";
  public static GetCustPersonalMainDataForCopyByCustId = environment.FoundationR3Url + "/Cust/GetCustPersonalMainDataForCopyByCustId";
  public static GetCustCompanyForCopyByCustId = environment.FoundationR3Url + "/Cust/GetCustCompanyForCopyByCustId";
  public static GetCustCompanyMainDataForCopyByCustId = environment.FoundationR3Url + "/Cust/GetCustCompanyMainDataForCopyByCustId";
  public static GetCustPersonalForCopyMgmntShrholderByCustId = environment.FoundationR3Url + "/Cust/GetCustPersonalForCopyMgmntShrholderByCustId";
  public static GetCustCompanyForCopyMgmntShrholderByCustId = environment.FoundationR3Url + "/Cust/GetCustCompanyForCopyMgmntShrholderByCustId";
  public static GetListKeyValueMobilePhnByAppId = environment.losUrl + "/AppCust/GetListKeyValueMobilePhnByAppId";

  //CUST DATA COMPANY
  public static AddEditCustDataCompany = environment.losUrl + "/AppCust/AddEditCustDataCompany";

  //DELIVERY ORDER
  public static SubmitDeliveryOrderData = environment.losUrl + "/DeliveryOrder/SubmitDeliveryOrderData";
  public static GetRefAssetDocList = environment.FoundationR3Url + "/AssetDocList/GetListAssetDocListByAssetTypeCode";
  public static GetDeliveryOrderHByAgrmntId = environment.losUrl + "/DeliveryOrder/GetDeliveryOrderHByAgrmntId";
  public static GetAssetListForDOMultiAsset = environment.losUrl + "/DeliveryOrder/GetAssetListForDOMultiAsset";
  public static GetListDeliveryOrderHByAppIdAgrmntId = environment.losUrl + "/DeliveryOrder/GetListDeliveryOrderHByAppIdAgrmntId";
  public static AddDeliveryOrderMultiAsset = environment.losUrl + "/DeliveryOrder/AddDeliveryOrderMultiAsset";
  public static DeleteDeliveryOrderMultiAsset = environment.losUrl + "/DeliveryOrder/DeleteDeliveryOrderMultiAsset";
  public static GetAppAssetForDOMultiAsset = environment.losUrl + "/AppAsset/GetAppAssetForDOMultiAsset";
  public static EditAppAssetDOMultiAsset = environment.losUrl + "/AppAsset/EditAppAssetDOMultiAsset";
  public static EditDeliveryOrderMultiAsset = environment.losUrl + "/DeliveryOrder/EditDeliveryOrderMultiAsset";
  public static GetDeliveryOrderHByDeliveryOrderHId = environment.losUrl + "/DeliveryOrder/GetDeliveryOrderHByDeliveryOrderHId";
  public static GetDeliveryOrderDataForOneAssetByAgrmntId = environment.losUrl + "/DeliveryOrder/GetDeliveryOrderDataForOneAssetByAgrmntId";
  public static SubmitDeliveryOrderMultiAsset = environment.losUrl + "/DeliveryOrder/SubmitDeliveryOrderMultiAsset";
  public static CheckAllDeliveryOrderData = environment.losUrl + "/DeliveryOrder/CheckAllDeliveryOrderData";

  //PURCHASE ORDER
  public static SubmitPurchaseOrder = environment.losUrl + "/PurchaseOrderH/SubmitPurchaseOrder";
  public static SubmitNewPurchaseOrder = environment.losUrl + "/PurchaseOrderH/SubmitNewPurchaseOrder";
  public static ResumeWorkflowPurchaseOrder = environment.losUrl + "/PurchaseOrderH/ResumeWorkflowPurchaseOrder";
  public static GetPurchaseOrderHDetailViewByAgrmntId = environment.losUrl + "/PurchaseOrderH/GetPurchaseOrderHDetailViewByAgrmntId";
  public static GetPurchaseOrderHByAgrmntId = environment.losUrl + "/PurchaseOrderH/GetPurchaseOrderHByAgrmntId";
  public static GetListPurchaseOrderHByAgrmntId = environment.losUrl + "/PurchaseOrderH/GetListPurchaseOrderHByAgrmntId"
  public static GetPurchaseOrderHDetailViewMultiAssetByAgrmntId = environment.losUrl + "/PurchaseOrderH/GetPurchaseOrderHDetailViewMultiAssetByAgrmntId"
  public static GetPurchaseOrderListForNewPOByAppId = environment.losUrl + "/PurchaseOrderH/GetPurchaseOrderListForNewPOByAppId";
  public static GetPurchaseOrderHByPurchaseOrderHId = environment.losUrl + "/PurchaseOrderH/GetPurchaseOrderHByPurchaseOrderHId";
  public static GetPurchaseOrderByPurchaseOrderHIdForNewPO = environment.losUrl + "/PurchaseOrderH/GetPurchaseOrderByPurchaseOrderHIdForNewPO";
  public static GetPurchaseOrderDPoItemCodeFromRuleByType = environment.losUrl + "/PurchaseOrderH/GetPurchaseOrderDPoItemCodeFromRuleByType";
  public static ResumeWorkflowNewPurchaseOrder = environment.losUrl + "/PurchaseOrderH/ResumeWorkflowNewPurchaseOrder";

  // LEAD
  public static AddEditLeadCustPersonal = environment.losUrl + "/LeadCust/AddEditLeadCustPersonal";
  public static AddEditLeadData = environment.losUrl + "/Lead/AddEditLeadData";
  public static GetLeadMonitoringByUploadMonitoringNoAndTrxType = environment.losUrl + "/Lead/GetLeadMonitoringByUploadMonitoringNoAndTrxType";
  public static AddEditLeadDataKta = environment.losUrl + "/Lead/AddEditLeadDataKta";

  //LEAD CANCEL
  public static GetListLeadForLeadCancelByListLeadId = environment.losUrl + "/Lead/GetListLeadForLeadCancelByListLeadId";
  public static EditListLeadForCancelByListLeadId = environment.losUrl + "/Lead/EditListLeadForCancelByListLeadId";

  // LEAD APP
  public static GetLeadAppByLeadId = environment.losUrl + "/LeadApp/GetLeadAppByLeadId";

  // LEAD CUST
  public static GetLeadCustByLeadId = environment.losUrl + "/LeadCust/GetLeadCustByLeadId";

  // LEAD CUST SOCMED
  public static GetListLeadCustSocmedByLeadCustId = environment.losUrl + "/LeadCustSocmed/GetListLeadCustSocmedByLeadCustId";

  // LEAD CUST ADDR
  public static GetLeadCustAddrByLeadCustIdAndAddrTypeCode = environment.losUrl + "/LeadCustAddr/GetLeadCustAddrByLeadCustIdAndAddrTypeCode";

  // LEAD CUST PERSONAL
  public static GetLeadCustPersonalByLeadCustId = environment.losUrl + "/LeadCustPersonal/GetLeadCustPersonalByLeadCustId";

  // LEAD CUST PERSONAL FIN DATA
  public static GetLeadCustPersonalFinDataByLeadCustPersonalId = environment.losUrl + "/LeadCustPersonalFinData/GetLeadCustPersonalFinDataByLeadCustPersonalId";

  // LEAD CUST PERSONAL JOB DATA
  public static GetLeadCustPersonalJobDataByLeadCustPersonalId = environment.losUrl + "/LeadCustPersonalJobData/GetLeadCustPersonalJobDataByLeadCustPersonalId";

  // CUST DATA PERSONAL
  public static AddEditCustDataPersonal = environment.losUrl + "/AppCust/AddEditCustDataPersonal";
  public static GetCustDataByAppId = environment.losUrl + "/AppCust/GetCustDataByAppId";
  public static GetAppCustPersonalContactPersonsByAppCustPersonalId = environment.losUrl + "/AppCustPersonalContactPerson/GetAppCustPersonalContactPersonsByAppCustPersonalId";
  public static DeleteAppCustPersonalContactPerson = environment.losUrl + "/AppCustPersonalContactPerson/DeleteAppCustPersonalContactPerson";
  public static GetAppCustPersonalDataAndSpouseByAppId = environment.losUrl + "/AppCust/GetAppCustPersonalDataAndSpouseByAppCustId";

  //CUST DATA COMPANY
  public static GetCustDataForViewByAppId = environment.losUrl + "/AppCust/GetCustDataForViewByAppId";
  public static GetCustDataPersonalForViewByAppId = environment.losUrl + "/AppCust/GetCustDataPersonalForViewByAppId";
  public static GetCustDataPersonalForViewByAppCustId = environment.losUrl + "/AppCust/GetCustDataPersonalForViewByAppCustId";
  public static GetCustDataCompanyForViewByAppId = environment.losUrl + "/AppCust/GetCustDataCompanyForViewByAppId";
  public static GetCustDataCompanyForViewByAppCustId = environment.losUrl + "/AppCust/GetCustDataCompanyForViewByAppCustId";
  public static GetAppCustCompanyByAppCustId = environment.losUrl + "/AppCust/GetAppCustCompanyByAppCustId";
  public static GetAppCustCompanyContactPersonByAppCustId = environment.losUrl + "/AppCust/GetAppCustCompanyContactPersonByAppCustId";
  public static AddOrEditAppCustCompanyContactPerson = environment.losUrl + "/AppCust/AddOrEditAppCustCompanyContactPerson";
  public static GetAppCustCompanyLegalDocsByAppCustCompanyId = environment.losUrl + "/AppCustCompanyLegalDoc/GetAppCustCompanyLegalDocsByAppCustCompanyId";
  public static AddEditAppCustCompanyLegalDoc = environment.losUrl + "/AppCustCompanyLegalDoc/AddEditAppCustCompanyLegalDoc";
  public static DeleteAppCustCompanyLegalDoc = environment.losUrl + "/AppCustCompanyLegalDoc/DeleteAppCustCompanyLegalDoc";
  public static GetAppCustCompanyFinDataByAppCustId = environment.losUrl + "/AppCustCompanyFinData/GetAppCustCompanyFinDataByAppCustId";
  public static AddEditAppCustCompanyFinData = environment.losUrl + "/AppCustCompanyFinData/AddEditAppCustCompanyFinData";

  //CUST MAIN DATA
  public static GetAppCustMainDataByAppId = environment.losUrl + "/AppCust/GetAppCustMainDataByAppId";
  public static GetAppCustMainDataByAppCustId = environment.losUrl + "/AppCust/GetAppCustMainDataByAppCustId";
  public static GetListAppCustMainDataByAppId = environment.losUrl + "/AppCust/GetListAppCustMainDataByAppId";
  public static AddCustMainDataPersonal = environment.losUrl + "/AppCust/AddCustMainDataPersonal";
  public static EditCustMainDataPersonal = environment.losUrl + "/AppCust/EditCustMainDataPersonal";
  public static AddCustMainDataCompanyData = environment.losUrl + "/AppCust/AddCustMainDataCompanyData";
  public static EditCustMainDataCompanyData = environment.losUrl + "/AppCust/EditCustMainDataCompanyData";
  public static DeleteAppCustMainData = environment.losUrl + "/AppCust/DeleteAppCustMainData";
  public static DeleteAllAppCust = environment.losUrl + "/AppCust/DeleteAllAppCust";
  public static CopyAllExistingCustByAppId = environment.losUrl + "/AppCust/CopyAllExistingCustByAppId";
  public static GetListAppCustCompletion = environment.losUrl + "/AppCust/GetListAppCustCompletion";
  public static GetAppCustAndListFamilyByAppId = environment.losUrl + "/AppCust/GetAppCustAndListFamilyByAppId";
  public static GetAppCustAndListShareholderByAppId = environment.losUrl + "/AppCust/GetAppCustAndListShareholderByAppId";
  public static GetAppCustBankAccAndStatementForView = environment.losUrl + "/AppCustBankAcc/GetAppCustBankAccAndStatementForView";
  public static AddAppCustBankAccAndStmnt = environment.losUrl + "/AppCustBankAcc/AddAppCustBankAccAndStmnt";
  public static EditAppCustBankAccAndStmnt = environment.losUrl + "/AppCustBankAcc/EditAppCustBankAccAndStmnt";
  public static DeleteAppCustBankAccAndStmnt = environment.losUrl + "/AppCustBankAcc/DeleteAppCustBankAccAndStmnt";
  public static DeleteAppCustBankStmnt = environment.losUrl + "/AppCustBankStmnt/DeleteAppCustBankStmnt";

  // APP CUST ATTR CONTENT 
  public static GetListAppCustAttrContentByAppCustIdAndAttrGroup = environment.losUrl + "/AppCustAttrContent/GetListAppCustAttrContentByAppCustIdAndAttrGroup"
  public static GetListAppCustAttrContentForNewNap = environment.losUrl + "/AppCustAttrContent/GetListAppCustAttrContentForNewNap";

  // APP CUST OTHER INFO
  public static AddEditCustCompletionOtherInfo = environment.losUrl + "/AppCustOtherInfo/AddEditCustCompletionOtherInfo";
  public static GetAppCustOtherInfoByAppCustId = environment.losUrl + "/AppCustOtherInfo/GetAppCustOtherInfoByAppCustId"

  // APP TC
  public static GetListTCbyAppId = environment.losUrl + "/AppTc/GetListTCbyAppId";
  public static GetListExistingTCbyAppId = environment.losUrl + "/AppTc/GetListExistingTCbyAppId";
  public static GetListNewTCbyAppId = environment.losUrl + "/AppTc/GetListNewTCbyAppId";
  public static DeleteAppTc = environment.losUrl + "/AppTc/DeleteAppTc";
  public static DeleteRangeAppTc = environment.losUrl + "/AppTc/DeleteRangeAppTc";
  public static EditAdditionalTcNew = environment.losUrl + "/AppTc/EditAdditionalTcNew";
  public static AddEditAdditionalTc = environment.losUrl + "/AppTc/AddEditAdditionalTc";

  // App Asset
  public static GetAppAssetListByAgrmntId = environment.losUrl + "/AppAsset/GetAppAssetListByAgrmntId";
  public static GetAppAssetByAppId = environment.losUrl + "/AppAsset/GetAppAssetDataByAppId";
  public static GetAppAssetListByAppId = environment.losUrl + "/AppAsset/GetAppAssetListByAppId";
  public static GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppId = environment.losUrl + "/AppAsset/GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppId";
  public static GetAppAssetListByAgrmntIdForViewAgrmnt = environment.losUrl + "/AppAsset/GetAppAssetListByAgrmntIdForViewAgrmnt";
  public static GetAppAssetListForInsuranceByAppId = environment.losUrl + "/AppAsset/GetAppAssetListForInsuranceByAppId"
  public static GetAppAssetListForInsuranceByAgrmntId = environment.losUrl + "/AppAsset/GetAppAssetListForInsuranceByAgrmntId"
  public static GetAllAssetDataForPOByAsset = environment.losUrl + "/AppAsset/GetAllAssetDataForPOByAsset";
  public static GetAllAssetDataForPOMultiAsset = environment.losUrl + "/AppAsset/GetAllAssetDataForPOMultiAsset";
  public static GetAppAssetByAgrmntId = environment.losUrl + "/AppAsset/GetAppAssetByAgrmntId";
  public static GetAllAssetDataByAppId = environment.losUrl + "/AppAsset/GetAllAssetDataByAppId";
  public static GetListAllAssetDataByAppId = environment.losUrl + "/AppAsset/GetListAllAssetDataByAppId";
  public static GetAllAssetDataByAppAssetId = environment.losUrl + "/AppAsset/GetAllAssetDataByAppAssetId";
  public static GetListAppAssetByDOHId = environment.losUrl + "/AppAsset/GetListAppAssetByDOHId";
  public static AddEditAllAssetData = environment.losUrl + "/AppAsset/AddEditAllAssetData";
  public static CheckAssetValidationRule = environment.losUrl + "/AppAsset/CheckAssetValidationRule";
  public static DeleteAppAsset = environment.losUrl + "/AppAsset/DeleteAppAsset";
  public static GenerateAppAssetAttr = environment.losUrl + "/AppAsset/GenerateAppAssetAttr";

  //Asset Doc List
  public static GetAppAssetDataByAppId = environment.losUrl + "/AppAsset/GetAppAssetDataByAppId";
  public static GetListAppCollateralForDOView = environment.losUrl + "/AppCollateralDoc/GetListAppCollateralForDOView";

  //Asset Doc List
  public static GetListAssetDocListByAssetTypeCode = environment.FoundationR3Url + "/AssetDocList/GetListAssetDocListByAssetTypeCode";
  public static GetListAppAssetData = environment.losUrl + "/AppAsset/GetListAppAssetData";

  // App Collateral
  public static GetListAppCollateral = environment.losUrl + "/AppCollateral/GetListAppCollateral";
  public static GetListAppCollateralByAppId = environment.losUrl + "/AppCollateral/GetListAppCollateralByAppId";
  public static GetListAdditionalCollateralByAppId = environment.losUrl + "/AppCollateral/GetListAdditionalCollateralByAppId";
  public static DeleteAppCollateral = environment.losUrl + "/AppCollateral/DeleteAppCollateral";
  public static GetRefAttrList = environment.losUrl + "/AppCollateral/GetRefAttrList"
  public static AddEditAllCollateralData = environment.losUrl + "/AppCollateral/AddEditAllCollateralData"
  public static AddExistingAppCollateralData = environment.losUrl + "/AppCollateral/AddExistingAppCollateralData"
  public static GetViewAppCollateralObjByAppId = environment.losUrl + "/AppCollateral/GetViewAppCollateralObjByAppId";
  public static GetViewAppCollateralObjByAgrmntId = environment.losUrl + "/AppCollateral/GetViewAppCollateralObjByAgrmntId";
  public static GetAppCollateralByAppCollateralId = environment.losUrl + "/AppCollateral/GetAppCollateralByAppCollateralId";
  public static GetAppCollateralByAppId = environment.losUrl + "/AppCollateral/GetAppCollateralByAppId";
  public static GetAppCollateralAndRegistrationByAppCollateralId = environment.losUrl + "/AppCollateral/GetAppCollateralAndRegistrationByAppCollateralId";
  public static AddEditAllCollateralDataFactoring = environment.losUrl + "/AppCollateral/AddEditAllCollateralDataFactoring"
  public static GetAppCollateralAttrByAppCollateralId = environment.losUrl + "/AppCollateral/GetAppCollateralAttrByAppCollateralId";
  public static GetAppCollateralListForInsuranceByAppId = environment.losUrl + "/AppCollateral/GetAppCollateralListForInsuranceByAppId";
  public static GetAppCollateralAttrByAppAssetId = environment.losUrl + "/AppCollateral/GetAppCollateralAttrByAppAssetId";
  public static GetListAppCollateralByAgrmntId = environment.losUrl + "/AppCollateral/GetListAppCollateralByAgrmntId";
  public static GetAppCollateralByAgrmntId = environment.losUrl + "/AppCollateral/GetAppCollateralByAgrmntId";
  public static GetListNegativeCollateralByAppId = environment.losUrl + "/AppCollateral/GetListNegativeCollateralByAppId";
  public static GetListExistingAppCollateralWithInsurance = environment.losUrl + "/AppCollateral/GetListExistingAppCollateralWithInsurance";
  public static GetAppCollateralByAppAssetId = environment.losUrl + "/AppCollateral/GetAppCollateralByAppAssetId";
  public static GenerateAppCollateralAttr = environment.losUrl + "/AppCollateral/GenerateAppCollateralAttr";

  // App Collateral Suppl Emp
  public static GetListAppAssetSupplEmpByAppAssetId = environment.losUrl + "/AppAssetSupplEmp/GetListAppAssetSupplEmpByAppAssetId";
  public static AddEditAllCollateralDataByAppCollateraId = environment.losUrl + "/AppCollateral/AddEditAllCollateralDataByAppCollateraId";

  // App Collateral Registration
  public static GetAppCollateralRegistrationByAppCollateralId = environment.losUrl + "/AppCollateralRegistration/GetAppCollateralRegistrationByAppCollateralId";

  // App Collateral Doc
  public static GetListAppCollateralDocsByAppCollateralId = environment.losUrl + "/AppCollateralDoc/GetListAppCollateralDocsByAppCollateralId";

  //AGRMNT SIGNER
  public static SubmitAgrmntSignerData = environment.losUrl + "/AgrmntSigner/SubmitAgrmntSignerData";
  public static EditAgrmntSignerData = environment.losUrl + "/AgrmntSigner/EditAgrmntSignerData";
  public static GetAgrmntSignerByAgrmntId = environment.losUrl + "/AgrmntSigner/GetAgrmntSignerByAgrmntId";

  //AGRMNT FIN DATA
  public static GetAgrmntFinDataByAgrmntId = environment.losUrl + "/AgrmntFinData/GetAgrmntFinDataByAgrmntId";
  public static GetFinancialDataByAgrmntIdForView = environment.losUrl + "/AgrmntFinData/GetFinancialDataByAgrmntIdForView";

  // LEAD FRAUD VERF
  public static AddLeadFraudVerf = environment.losUrl + "/LeadFraudVerf/AddLeadFraudVerf";
  public static GetDoubleFinancingCheckAppAsset = environment.losUrl + "/FraudDetection/GetDoubleFinancingCheckAppAsset";

  //LEAD VERF
  public static AddRangeLeadVerf = environment.losUrl + "/LeadVerf/AddRangeLeadVerf";
  public static GetListLeadVerf = environment.losUrl + "/LeadVerf/GetListLeadVerf";

  //APP TC
  public static GetListTCbyAppIdFromRule = environment.losUrl + "/AppTc/GetListTCbyAppIdFromRule";
  public static AddAppTc = environment.losUrl + "/AppTc/AddAppTc";
  public static EditAppTc = environment.losUrl + "/AppTc/EditAppTc";
  public static SubmitOutstandingTc = environment.losUrl + "/AppTc/SubmitOutstandingTc";

  //AGRMNT
  public static GetAgrmntByAgrmntId = environment.losUrl + "/Agrmnt/GetAgrmntByAgrmntId";
  public static GetAgrmntByCustNo = environment.losUrl + "/Agrmnt/GetAgrmntByCustNo";
  public static GetAgrmntByAppId = environment.losUrl + "/Agrmnt/GetAgrmntByAppId";
  public static GetAgrmntByAgrmntNo = environment.losUrl + "/Agrmnt/GetAgrmntByAgrmntNo";
  public static GetAgrmtSummaryByAgrmntId = environment.losUrl + "/Agrmnt/GetAgrmtSummaryByAgrmntId";

  //AGRMNT Commission
  public static GetListAgrmntCommissionWithDetailByAgrmntId = environment.losUrl + "/AgrmntCommission/GetListAgrmntCommissionWithDetailByAgrmntId";

  //REF TC
  public static GetRefTcByCode = environment.FoundationR3Url + "/RefTc/GetRefTcByCode";
  public static GetListRefTcByTcCode = environment.FoundationR3Url + "/RefTc/GetListRefTcByTcCode";
  public static GetListActiveRefTc = environment.FoundationR3Url + "/RefTc/GetListActiveRefTc";
  public static GetListRefTcCompany = environment.FoundationR3Url + "/RefTc/GetListRefTcCompany";
  public static GetListRefTcPersonal = environment.FoundationR3Url + "/RefTc/GetListRefTcPersonal";

  //APP INSURANCE
  public static GetInsuranceDataByAppId = environment.losUrl + "/AppIns/GetInsDataByAppId";
  public static GetInsuranceDataByAppIdForView = environment.losUrl + "/AppIns/GetInsDataByAppIdForView";
  public static GetInsuranceDataByAppAssetIdForView = environment.losUrl + "/AppIns/GetInsDataByAppAssetIdForView";
  public static GetInsDataByAppIdAndAssetId = environment.losUrl + "/AppIns/GetInsDataByAppIdAndAssetId";
  public static GetInsDataByAppAssetId = environment.losUrl + "/AppIns/GetInsDataByAppAssetId";
  public static AddEditInsuranceData = environment.losUrl + "/AppIns/AddEditInsuranceData";
  public static AddInsuranceData = environment.losUrl + "/AppIns/AddInsuranceData";
  public static EditInsuranceData = environment.losUrl + "/AppIns/EditInsuranceData";
  public static AddEditInsuranceDataMultiAsset = environment.losUrl + "/AppIns/AddEditInsuranceDataMultiAsset";
  public static AddInsuranceDataMultiAsset = environment.losUrl + "/AppIns/AddInsuranceDataMultiAsset";
  public static EditInsuranceDataMultiAsset = environment.losUrl + "/AppIns/EditInsuranceDataMultiAsset";
  public static GetListAppInsObjByAppIdForView = environment.losUrl + "/AppIns/GetListAppInsObjByAppIdForView";
  public static GetListAppInsObjByAgrmntIdForView = environment.losUrl + "/AppIns/GetListAppInsObjByAgrmntIdForView";
  public static GetAppInsObjViewDetail = environment.losUrl + "/AppIns/GetAppInsObjViewDetail";
  public static GetListCollateralAppInsObjForViewByAppId = environment.losUrl + "/AppIns/GetListCollateralAppInsObjForViewByAppId";

  //APP INSURANCE
  public static ExecuteInsRateRule = environment.losUrl + "/AppIns/ExecuteInsRateRule";
  public static CalculateInsurance = environment.losUrl + "/AppIns/CalculateInsurance";

  //AGREEMENT DOC
  public static GetListAgrmntDocByAgrmntId = environment.losUrl + "/AgrmntDoc/GetListAgrmntDocByAgrmntId"
  public static GetAgrmntDocDataByAgrmntDocId = environment.losUrl + "/AgrmntDoc/GetAgrmntDocDataByAgrmntDocId"
  public static EditAgrmntDoc = environment.losUrl + "/AgrmntDoc/EditAgrmntDoc"

  //AGREEMENT DOC PRINT
  public static AddAgrmntDocPrint = environment.losUrl + "/AgrmntDocPrint/AddAgrmntDocPrint"
  public static GetListAgrmntDocPrintByAgrmntId = environment.losUrl + "/AgrmntDocPrint/GetListAgrmntDocPrintByAgrmntId"

  //CREDIT APV RESULT EXTENSION
  public static SubmitNewExpDate = environment.losUrl + "/PurchaseOrderH/SubmitNewExpDate";
  public static GetCreditApvResultExtMainData = environment.losUrl + "/PurchaseOrderH/GetCreditApvResultExtMainData";
  //VERF
  public static GetVerfQuestionAnswerListBySchemeCode = environment.FoundationR3Url + "/VerfQuestionAnswer/GetVerfQuestionAnswerListByVerfSchemeCode"

  // VERF RESULT
  public static GetVerfResultById = environment.FoundationR3Url + "/VerfResult/GetVerfResultById";
  public static AddVerfResultAndVerfResultH = environment.FoundationR3Url + "/VerfResult/AddVerfResultAndVerfResultH";
  public static GetVerfResultHById = environment.FoundationR3Url + "/VerfResultH/GetVerfResultHById";
  public static GetVerfResultHsByTrxRefNoAndMrVerfTrxTypeCodeAndMrVerfObjCode = environment.FoundationR3Url + "/VerfResultH/GetVerfResultHsByTrxRefNoAndMrVerfTrxTypeCodeAndMrVerfObjCode";
  public static GetVerfResultHsByTrxRefNo = environment.FoundationR3Url + "/VerfResultH/GetVerfResultHsByTrxRefNo";
  public static GetVerfResultHsByVerfResultIdAndSubjRelationCode = environment.FoundationR3Url + "/VerfResultH/GetVerfResultHsByVerfResultIdAndSubjRelationCode";
  public static GetListVerfResultDInQuestionGrp = environment.FoundationR3Url + "/VerfResultD/GetListVerfResultDInQuestionGrp";
  public static AddVerfResultHeaderAndVerfResultDetail = environment.FoundationR3Url + "/VerfResultH/AddVerfResultHeaderAndVerfResultDetail";
  public static GetVerfResultByTrxRefNoAndVerfTrxTypeCode = environment.FoundationR3Url + "/VerfResult/GetVerfResultByTrxRefNoAndVerfTrxTypeCode";
  public static AddVerfResult = environment.FoundationR3Url + "/VerfResult/AddVerfResult";
  public static GetVerfResultHsByVerfResultIdAndObjectCode = environment.FoundationR3Url + "/VerfResultH/GetVerfResultHsByVerfResultIdAndObjectCode";

  //CUST CONFIRM
  public static GetVerfQuestionAnswerListByAppIdAndSubject = environment.losUrl + "/CustCnfrm/GetVerfQuestionAnswerListByAppIdAndSubject";
  public static AddCustCnfrm = environment.losUrl + "/CustCnfrm/AddCustCnfrm";

  //REF STATUS
  public static GetListActiveRefStatusByStatusGrpCode = environment.FoundationR3Url + "/RefStatus/GetListKeyValueActiveGrpCodeByCode";

  //AGRMNT ACTIVATION
  public static GetAppAssetByAppIdAndCriteria = environment.losUrl + "/AgrmntActivation/GetAppAssetByAppIdAndCriteria";
  public static GetAppFinDataAndFeeByAppIdAndListAppAssetId = environment.losUrl + "/AgrmntActivation/GetAppFinDataAndFeeByAppIdAndListAppAssetId";
  public static SubmitAgrmntActivationByHuman = environment.losUrl + "/AgrmntActivation/SubmitAgrmntActivationByHuman";

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
  public static AddAppInvoiceFctr = environment.losUrl + "/AppInvoiceFctr/AddAppInvoiceFctr";
  public static EditAppInvoiceFctr = environment.losUrl + "/AppInvoiceFctr/EditAppInvoiceFctr";
  public static DeleteAppInvoiceFctr = environment.losUrl + "/AppInvoiceFctr/DeleteAppInvoiceFctr";
  public static GetAppInvoiceFctrByAppInvoiceFctrId = environment.losUrl + "/AppInvoiceFctr/GetAppInvoiceFctrByAppFctrId";
  public static GetListAppInvoiceFctrByAppFctrId = environment.losUrl + "/AppInvoiceFctr/GetListAppInvoiceFctrByAppFctrId";
  public static GetListAppInvoiceFctrByAgrmntId = environment.losUrl + "/AppInvoiceFctr/GetListAppInvoiceFctrByAgrmntId";

  public static GetAppFinDataWithRuleByAppId = environment.losUrl + "/AppFinData/GetAppFinDataWithRuleByAppId";

  //App Cust Addr
  public static AddAppCustAddr = environment.losUrl + "/AppCustAddr/AddAppCustAddr";
  public static EditAppCustAddr = environment.losUrl + "/AppCustAddr/EditAppCustAddr";
  public static GetListAppCustAddrByAppId = environment.losUrl + "/AppCustAddr/GetListAppCustAddrByAppId";
  public static GetAppCustAddrByAppCustAddrId = environment.losUrl + "/AppCustAddr/GetAppCustAddrByAppCustAddrId"
  public static GetListAppCustAddrByAppCustId = environment.losUrl + "/AppCustAddr/GetListAppCustAddrByAppCustId";
  public static GetListAppCustAddrDataForCopyByAppCustId = environment.losUrl + "/AppCustAddr/GetListAppCustAddrDataForCopyByAppCustId";
  public static GetListAppCustAddrDataForCopyByAppId = environment.losUrl + "/AppCustAddr/GetListAppCustAddrDataForCopyByAppId";
  public static GetAppCustAddrCustomerByAppIdAndMrAddrTypeCode = environment.losUrl + "/AppCustAddr/GetAppCustAddrCustomerByAppIdAndMrAddrTypeCode";

  //App Fee
  public static GetListAppFeeByAppId = environment.losUrl + "/AppFee/GetListAppFeeByAppId";

  //App Reserved Fund
  public static AddEditAppReservedFund = environment.losUrl + "/AppReservedFund/AddEditAppReservedFund";
  public static GetListAppReservedFundByAppId = environment.losUrl + "/AppReservedFund/GetListAppReservedFundByAppId";
  public static CreateRsvFundRule = environment.losUrl + "/AppReservedFund/CreateRsvFundRule";
  public static CalculateGrossYieldRsvFund = environment.losUrl + "/AppReservedFund/CalculateGrossYieldRsvFund";
  public static GetIncomeInfoRsvFund = environment.losUrl + "/AppReservedFund/GetIncomeInfoRsvFund";

  //App Fin Data
  public static GetAppFinDataByAppId = environment.losUrl + "/AppFinData/GetAppFinDataByAppId";
  public static CreateMaxAllocAmtRsvFund = environment.losUrl + "/AppFinData/CreateMaxAllocAmtRsvFund";
  public static CalculateInstallmentStepUpStepDown = environment.losUrl + "/AppFinData/CalculateInstallmentStepUpStepDown";
  public static CalculateInstallmentEvenPrincipal = environment.losUrl + "/AppFinData/CalculateInstallmentEvenPrincipal";
  public static CalculateInstallmentBalloon = environment.losUrl + "/AppFinData/CalculateInstallmentBalloon";
  public static CalculateIrregular = environment.losUrl + "/AppFinData/CalculateIrregular";
  public static CalculateInstallmentRegularFix = environment.losUrl + "/AppFinData/CalculateInstallmentRegularFix"
  public static GetFinancialDataByAppIdForView = environment.losUrl + "/AppFinData/GetFinancialDataByAppIdForView";
  public static GetInitAppFinDataFctrByAppId = environment.losUrl + "/AppFinData/GetInitAppFinDataFctrByAppId";
  public static CalculateInstallmentRegularFixFctr = environment.losUrl + "/AppFinData/CalculateInstallmentRegularFixFctr";
  public static SaveAppFinDataFctr = environment.losUrl + "/AppFinData/SaveAppFinDataFctr";
  public static SaveAppFinData = environment.losUrl + "/AppFinData/SaveAppFinData";
  public static CalculateInstallmentEvenPrincipalFctr = environment.losUrl + "/AppFinData/CalculateInstallmentEvenPrincipalFctr";
  public static CalculateSingleInst = environment.losUrl + "/AppFinData/CalculateSingleInst";
  public static CalculateProvisionFee = environment.losUrl + "/AppFee/CalculateProvisionFee";
  public static GetOrInitAppSubsidyByAppId = environment.losUrl + "/AppSubsidy/GetOrInitAppSubsidyByAppId";
  public static GetRuleSubsidyMax = environment.losUrl + "/AppSubsidy/GetRuleSubsidyMax";
  public static GetInitAppFinDataByAppId = environment.losUrl + "/AppFinData/GetInitAppFinDataByAppId";
  public static GetAppSubsidyByAppSubsidyId = environment.losUrl + "/AppSubsidy/GetAppSubsidyByAppSubsidyId";
  public static AddAppSubsidy = environment.losUrl + "/AppSubsidy/AddSubsidy";
  public static EditAppSubsidy = environment.losUrl + "/AppSubsidy/EditAppSubsidy";

  //Fraud Detection
  public static GetAppDupCheckCustByAppId = environment.losUrl + "/FraudDetection/GetAppDupCheckCustByAppId";
  public static GetFraudDukcapilByIdNo = environment.losUrl + "/FraudDetection/GetFraudDukcapilByIdNo";
  public static AddAppFraudVerf = environment.losUrl + "/FraudDetection/AddAppFraudVerf";
  public static GetListAppNegativeCheckCustByAppId = environment.losUrl + "/AppDupCheck/GetListAppNegativeCheckCustByAppId";
  public static GetAppFraudVerificationByAppId = environment.losUrl + "/FraudDetection/GetAppFraudVerificationByAppId";

  //Fraud Verif
  public static SurveyFraudAppCheckingValidationForFraudVerif = environment.losUrl + "/Application/SurveyFraudAppCheckingValidationForFraudVerif";

  //Dukcapil
  public static GetFraudDukcapilByTrxNoAndTrxType = environment.losUrl + "/Dukcapil/GetFraudDukcapilByTrxNoAndTrxType"

  //CUSTOMER DUPLICATE CHECKING
  public static GetCustomerAndNegativeCustDuplicateCheck = environment.FoundationR3Url + "/CustDuplicateCheck/GetCustomerAndNegativeCustDuplicateCheck";

  // ASSET NEGATIVE DUPLICATE CHECK
  public static GetAssetNegativeDuplicateCheck = environment.FoundationR3Url + "/AssetNegative/GetAssetNegativeDuplicateCheck";
  public static GetAssetNegativeDuplicateCheckByListOfAsset = environment.FoundationR3Url + "/AssetNegative/GetAssetNegativeDuplicateCheckByListOfAsset"

  //App Duplicate Checking
  public static GetCustomerDuplicateCheck = environment.FoundationR3Url + "/CustDuplicateCheck/GetCustomerDuplicateCheck";
  public static GetNegativeCustomerDuplicateCheck = environment.FoundationR3Url + "/CustDuplicateCheck/GetNegativeCustomerDuplicateCheck";
  public static GetAppCustDuplicateCheck = "/AppDupCheck/GetAppCustDuplicateCheck";
  public static GetAppGuarantorDuplicateCheck = "/AppDupCheck/GetAppGuarantorDuplicateCheck";
  public static GetSpouseDuplicateCheck = "/AppDupCheck/GetSpouseDuplicateCheck";
  public static GetAppShareholderDuplicateCheck = "/AppDupCheck/GetAppShareholderDuplicateCheck";
  public static AddAppDupCheckCust = "/AppDupCheck/AddAppDupCheckCust";
  public static EditCustNoAppCust = environment.losUrl + "/AppDupCheck/EditCustNoAppCust";
  public static SubmitAppDupCheck = environment.losUrl + "/AppDupCheck/SubmitAppDupCheck";

  //Cust Main Data Dup Checking
  public static MD_GetSubjectDuplicateCheckByAppId = environment.losUrl + "/AppDupCheckMainData/GetSubjectDuplicateCheckByAppId";
  public static MD_GetAppCustDuplicateCheck = environment.losUrl + "/AppDupCheckMainData/GetAppCustDuplicateCheck";
  public static MD_EditApplicantNoCustNoAppCust = environment.losUrl + "/AppDupCheckMainData/EditApplicantNoCustNoAppCust";
  public static MD_SubmitAppDupCheck = environment.losUrl + "/AppDupCheckMainData/SubmitAppDupCheck";

  // Product Offering
  public static GetListProdOfferingDByProdOfferingCode = environment.tempUrl + "/ProductOffering/GetListProdOfferingDByProdOfferingCode";
  public static GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode = environment.tempUrl + "/ProductOffering/GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode";
  public static GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL = environment.tempUrl + "/ProductOffering/GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL";
  public static GetPayFreqByProdOfferingD = environment.tempUrl + "/ProductOffering/GetPayFreqByProdOfferingD";
  public static GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion = environment.tempUrl + "/ProductOffering/GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion";
  public static GetProdOfferingHByCode = environment.tempUrl + "/ProductOffering/GetProdOfferingHByCode";

  //Ref Pay Freq
  public static GetPayFreqByProdOfferingCodeandRefProdCompntCode = environment.FoundationR3Url + "/RefPayFreq/GetPayFreqByProdOfferingCodeandRefProdCompntCode";
  public static GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat = environment.tempUrl + "/ProductOffering/GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat";

  // ASSET TYPE
  public static GetAssetTypeById = environment.FoundationR3Url + "/AssetType/GetAssetTypeById";
  public static GetListAssetTypeByCode = environment.FoundationR3Url + "/AssetType/GetListKeyValueActiveByCode";
  public static GetListSerialNoLabelByAssetTypeCode = environment.FoundationR3Url + "/AssetType/GetListSerialNoLabelByAssetTypeCode"

  //App Crd Invstg
  public static AddAppCrdInvstg = environment.losUrl + "/AppCrdInvstgH/AddAppCrdInvstg";
  public static AddEditAppCrdInvstg = environment.losUrl + "/AppCrdInvstgH/AddEditAppCrdInvstg";

  public static GetAppCrdInvstgByAppId = environment.losUrl + "/AppCrdInvstgH/GetAppCrdInvstgByAppId";

  // APP SUBSIDY
  public static GetListAppSubsidyByAppId = environment.losUrl + "/AppSubsidy/GetListAppSubsidyByAppId";
  public static GetListSubsidyFromValue = environment.losUrl + "/AppSubsidy/GetListSubsidyFromValue";
  public static GetListSubsidyFromTypeCode = environment.losUrl + "/AppSubsidy/GetListSubsidyFromTypeCode";
  public static GetListSubsidyAllocation = environment.losUrl + "/AppSubsidy/GetListSubsidyAllocation"
  public static GetListSubsidySource = environment.losUrl + "/AppSubsidy/GetListSubsidySource";
  public static GetListSubsidyValueType = environment.losUrl + "/AppSubsidy/GetListSubsidyValueType";
  public static DeleteSubsidy = environment.losUrl + "/AppSubsidy/DeleteSubsidy";

  // ASSET TYPE
  // public static GetAssetTypeById = environment.FoundationR3Url + "/AssetType/GetAssetTypeById"

  // List Approver
  public static GetRecommendations = environment.ApprovalR3Url + "/api/RFAWeb/GetRecommendations/";

  public static ApvHoldTaskUrl = environment.FoundationR3Url + "/Approval/Hold";
  public static ApvTakeBackTaskUrl = environment.FoundationR3Url + "/Approval/TakeBack";

  // PreGoLive
  public static GetListApprovedByForPreGoLive = environment.losUrl + "/PreGoLive/GetListApprovedByForPreGoLive";
  public static AddPreGoLive = environment.losUrl + "/PreGoLive/AddPreGoLive";
  public static CreateRFAPreGoLive = environment.losUrl + "/PreGoLive/CreateRFAPreGoLive";
  public static CreateRFAPreGoLiveNew = environment.losUrl + "/PreGoLive/CreateRFAPreGoLiveNew";

  // Survey or Srvy
  public static GetListSrvyTaskAndOrderByTrxNoAndMrSurveySourceCode = environment.FoundationR3Url + "/SrvyTask/GetListSrvyTaskAndOrderByTrxNoAndMrSurveySourceCode";
  public static GetSrvyResultDataByTrxRefNo = environment.losUrl + "/MouCustSrvyOrder/GetSrvyResultDataByTrxRefNo";
  public static GetSrvyOrderBySrvyOrderNo = environment.FoundationR3Url + "/SrvyOrder/GetSrvyOrderBySrvyOrderNo";
  public static GetSrvyOrderByTrxRefNoAndSrvySourceCode = environment.FoundationR3Url + "/SrvyOrder/GetSrvyOrderByTrxRefNoAndSrvySourceCode";
  public static GetSrvyDataBySrvyOrderId = environment.FoundationR3Url + "/SrvyData/GetSrvyDataBySrvyOrderId";
  public static GetListSrvyTaskBySrvyOrderId = environment.FoundationR3Url + "/SrvyTask/GetListSrvyTaskBySrvyOrderId";
  public static GetSrvyTaskBySrvyTaskNo = environment.FoundationR3Url + "/SrvyTask/GetSrvyTaskBySrvyTaskNo";

  // Workflow Engine
  public static ClaimTask = environment.FoundationR3Url + "/Workflow/ClaimTask";
  public static ClaimTaskNap = environment.losUrl + "/Application/ClaimTaskNap";
  public static ClaimTaskNapCustmainData = environment.losUrl + "/Application/ClaimTaskNapCustmainData";

  //Application Data
  public static SaveApplicationData = environment.losUrl + "/ApplicationData/SaveApplicationData"
  public static EditApplicationData = environment.losUrl + "/ApplicationData/EditApplicationData"
  public static ClaimListTask = environment.FoundationR3Url + "/Workflow/ClaimListTask";
  public static GetApplicationDataByAppId = environment.losUrl + "/ApplicationData/GetApplicationDataByAppId";

  // Phone Verif
  public static GetAppPhoneVerifSubjectListByAppId = environment.losUrl + "/PhoneVerif/GetAppPhoneVerifSubjectListByAppId";
  public static GetPhoneNumberByIdSourceAppIdAndSubject = environment.losUrl + "/PhoneVerif/GetPhoneNumberByIdSourceAppIdAndSubject";
  public static GetVerfQuestionListByAppIdAndSubjectForPhoneVerif = environment.losUrl + "/PhoneVerif/GetVerfQuestionListByAppIdAndSubjectForPhoneVerif";
  public static AddReturnHandlingFromPhoneVerif = environment.losUrl + "/PhoneVerif/AddReturnHandlingFromPhoneVerif";

  // App Cust
  public static GetAppCustByAppId = environment.losUrl + "/AppCust/GetAppCustByAppId";
  public static AddNegativeCustByAppId = environment.losUrl + "/AppCust/AddNegativeCustByAppId";
  public static GetAppCustAndAppCustPersonalDataByAppCustId = environment.losUrl + "/AppCust/GetAppCustAndAppCustPersonalDataByAppCustId";
  public static GetAppCustAndAppCustCompanyDataByAppCustId = environment.losUrl + "/AppCust/GetAppCustAndAppCustCompanyDataByAppCustId";
  public static UpdateAppCustCompletionPersonal = environment.losUrl + "/AppCust/UpdateAppCustCompletionPersonal";
  public static UpdateAppCustCompletionCompany = environment.losUrl + "/AppCust/UpdateAppCustCompletionCompany";
  public static SubmitAppCustCompletion = environment.losUrl + "/AppCust/SubmitAppCustCompletion";
  public static SaveAppCustCompletion = environment.losUrl + "/AppCust/SaveAppCustCompletion";

  // App Cust Personal Job Data
  public static AddEditAppCustPersonalJobData = environment.losUrl + "/AppCustPersonalJobData/AddEditAppCustPersonalJobData";
  public static GetAppCustPersonalJobData = environment.losUrl + "/AppCustPersonalJobData/GetAppCustPersonalJobData";

  //App Cust Emergency Contact
  public static AddEditAppCustEmrgncCntct = environment.losUrl + "/AppCustEmrgncCntct/AddEditAppCustEmrgncCntct";
  public static GetAppCustEmrgncCntctByAppCustId = environment.losUrl + "/AppCustEmrgncCntct/GetAppCustEmrgncCntctByAppCustId";

  //App Cust Personal Fin Data
  public static GetAppCustPersonalFinDataByAppCustPersonalId = environment.losUrl + "/AppCustPersonalFinData/GetAppCustPersonalFinDataByAppCustPersonalId";
  public static AddEditAppCustPersonalFinData = environment.losUrl + "/AppCustPersonalFinData/AddEditAppCustPersonalFinData";

  //Verf Question Answer
  public static GetVerfQuestionAnswerListByVerfSchemeCode = environment.FoundationR3Url + "/VerfQuestionAnswer/GetVerfQuestionAnswerListByVerfSchemeCode"

  // App Credit Review
  public static GetAppCrdRvwById = environment.losUrl + "/AppCrdRvw/GetAppCrdRvwById";
  public static AddOrEditAppCrdRvwDataAndListManualDeviationData = environment.losUrl + "/AppCrdRvw/AddOrEditAppCrdRvwDataAndListManualDeviationData";
  public static CrdRvwMakeNewApproval = environment.losUrl + "/AppCrdRvw/CrdRvwMakeNewApproval";
  public static AddOrEditAppCrdRvwDataAndListManualDeviationDataNew = environment.losUrl + "/AppCrdRvw/AddOrEditAppCrdRvwDataAndListManualDeviationDataNew";
  public static GetLatestScoringResultHByTrxSourceNo = environment.FoundationR3Url + "/CreditScoring/GetLatestScoringResultHByTrxSourceNo";

  //RETURN HANDLING
  public static GetReturnHandlingWithDetailByReturnHandlingHId = environment.losUrl + "/ReturnHandlingH/GetReturnHandlingWithDetailByReturnHandlingHId";
  public static GetReturnHandlingDByAppIdAndMrReturnTaskCode = environment.losUrl + "/ReturnHandlingD/GetReturnHandlingDByAppIdAndMrReturnTaskCode";
  public static GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode = environment.losUrl + "/ReturnHandlingD/GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode"
  public static AddReturnHandlingD = environment.losUrl + "/ReturnHandlingD/AddReturnHandlingD";
  public static EditReturnHandlingD = environment.losUrl + "/ReturnHandlingD/EditReturnHandlingD";
  public static RequestReturnTask = environment.losUrl + "/ReturnHandlingD/RequestReturnTask";
  public static DeleteReturnHandlingD = environment.losUrl + "/ReturnHandlingD/DeleteReturnHandlingD";
  public static ResumeReturnHandling = environment.losUrl + "/ReturnHandlingH/ResumeReturnHandling";
  public static GetReturnHandlingDByReturnHandlingDId = environment.losUrl + "/ReturnHandlingD/GetReturnHandlingDByReturnHandlingDId";
  public static AddReturnHandlingH = environment.losUrl + "/ReturnHandlingH/AddReturnHandlingH";

  // public static Test = environment.losUrl + "/ReturnHandlingD/Test";

  // Deviation Result
  public static GetListDeviationResultForDeviationDataByAppId = environment.losUrl + "/DeviationResult/GetListDeviationResultForDeviationDataByAppId";
  public static GetListDeviationResultByAppNo = environment.losUrl + "/DeviationResult/GetListDeviationResultByAppNo";
  public static AddListManualDeviationResultByAppId = environment.losUrl + "/DeviationResult/AddListManualDeviationResultByAppId";
  public static GetListDeviationTypeByAppNo = environment.losUrl + "/DeviationResult/GetListDeviationTypeByAppNo";

  // Upload
  public static UploadFile = environment.FoundationR3Url + "/Upload/UploadFile";

  // Download
  public static DownloadTemplate = environment.FoundationR3Url + '/Download/DownloadTemplate';
  public static GetUploadAssetMasterByUploadMonitoringNoAndTrxType = environment.FoundationR3Url + '/AssetMaster/GetUploadAssetMasterByUploadMonitoringNoAndTrxType';

  // Report
  public static GenerateReportSync = environment.FoundationR3Url + '/Report/GenerateReportSync';
  public static GenerateReportR3 = environment.FoundationR3Url + '/Report/GenerateReportR3';

  // Asset Category
  public static GetAssetCategoryById = environment.FoundationR3Url + "/AssetCategory/GetAssetCategoryById";

  //Agrmnt Rsv Fund
  public static GetListAgrmntReservedFundByAgrmntId = environment.losUrl + "/AgrmntReservedFund/GetListAgrmntReservedFundByAgrmntId";

  //Agrmnt Life Ins
  public static GetAgrmntLifeInsDataByAgrmntId = environment.losUrl + "/AgrmntLifeIns/GetAgrmntLifeInsDataByAgrmntId";

  //RfaLog
  public static GetRfaLogByTrxNo = environment.FoundationR3Url + "/RfaLog/GetRfaLogByTrxNo";
  public static GetRfaLogByTrxNoAndApvCategory = environment.FoundationR3Url + "/RfaLog/GetRfaLogByTrxNoAndApvCategory";

  //Ref App Attr
  public static GetListRefAppAttrCollateral = environment.losUrl + "/RefAppAttr/GetListRefAppAttrCollateral";
  public static CompleteAppPhoneVerif = environment.losUrl + "/PhoneVerif/CompleteAppPhoneVerif";
  //Agrmnt Subsidy
  public static GetAgrmntSubsidyListByAgrmntId = environment.losUrl + "/AgrmntSubsidy/GetAgrmntSubsidyListByAgrmntId";

  //Agrmnt Fee
  public static GetAgrmntFeeListByAgrmntId = environment.losUrl + "/AgrmntFee/GetAgrmntFeeListByAgrmntId";

  //APP INVOICE FCTR
  public static GetListAppInvoiceFctrByAppId = environment.losUrl + "/AppInvoiceFctr/GetListAppInvoiceFctrByAppId";
  public static UpdateAppInvoiceFctr = environment.losUrl + "/AppInvoiceFctr/UpdateAppInvoiceFctr";

  //REF PAY FREQ
  public static GetRefPayFreqByPayFreqCode = environment.FoundationR3Url + "/RefPayFreq/GetRefPayFreqByPayFreqCode";

  //APP SCORE GRADE
  public static GetAppScoreGradeByAppIdAndMrScoreTypeCode = environment.losUrl + "/AppScoreGrade/GetAppScoreGradeByAppIdAndMrScoreTypeCode";
  public static GetAppScoreGradeDsrByAppId = environment.losUrl + "/AppScoreGrade/GetAppScoreGradeDsrByAppId";
  public static GetListAppScoreGradeByAppId = environment.losUrl + "/AppScoreGrade/GetListAppScoreGradeByAppId";

  // Authentication
  public static RequestNewPassword = environment.FoundationR3Url + "/Authenticate/RequestNewPassword";

  // DocExpDt
  public static GetDocIsExpDtMandatory = environment.losUrl + "/DocumentExpDt/GetDocIsExpDtMandatory";

  // INTEGRATION
  public static ReSendLosR3DataToR2 = environment.losUrl + "/Integration/ReSendLosR3DataToR2";

  // Credit Review
  public static GetCrdRvwAppByCrdRvwCustInfoId = environment.losUrl + "/CrdRvwApp/GetCrdRvwAppByCrdRvwCustInfoId";
  public static GetCrdRvwCustInfoByAppId = environment.losUrl + "/CrdRvwCustInfo/GetCrdRvwCustInfoByAppId";
  public static GetCrdRvwCustInfoIncomeAndExpenseDetails = environment.losUrl + "/CrdRvwCustInfo/GetCrdRvwCustInfoIncomeAndExpenseDetails";
  public static CrdRvwDataReCapture = environment.losUrl + "/CrdRvwCustInfo/CrdRvwDataReCapture";
  public static ReCaptureDataR2 = environment.losUrl + "/CrdRvwCustInfo/ReCaptureDataR2";
  public static GetCrdRvwCustPersInfoByCrdRvwCustInfoId = environment.losUrl + "/CrdRvwCustPersInfo/GetCrdRvwCustPersInfoByCrdRvwCustInfoId";
  public static GetCrdRvwCustCoyInfoByCrdRvwCustInfoId = environment.losUrl + "/CrdRvwCustCoyInfo/GetCrdRvwCustCoyInfoByCrdRvwCustInfoId";
  public static GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId = environment.losUrl + "/CrdRvwCustPhnStatus/GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId";
  public static GetListCrdRvwExposureByCrdRvwCustInfoId = environment.losUrl + "/CrdRvwExposure/GetListCrdRvwExposureByCrdRvwCustInfoId";
  public static GetCrdRvwExposureByCrdRvwCustInfoIdAndRelationType = environment.losUrl + "/CrdRvwExposure/GetCrdRvwExposureByCrdRvwCustInfoIdAndRelationType";
  public static GetCrdRvwExposureHandDByCrdRvwExposureHId = environment.losUrl + "/CrdRvwExposure/GetCrdRvwExposureHandDByCrdRvwExposureHId";
  public static GetListCrdRvwCustBucketByCrdRvwExposureDId = environment.losUrl + "/CrdRvwExposure/GetListCrdRvwCustBucketByCrdRvwExposureDId";
  public static GetListCrdRvwAppAgrHistByCrdRvwExposureHId = environment.losUrl + "/CrdRvwExposure/GetListCrdRvwAppAgrHistByCrdRvwExposureHId";
  public static GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId = environment.losUrl + "/CrdRvwDiffAppToInPrcAppCust/GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId";
  public static GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId = environment.losUrl + "/CrdRvwDiffAppToMasterCust/GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId";
  public static GetSingleAssetCrdRvwAssetByCrdRvwCustInfoId = environment.losUrl + "/CrdRvwAsset/GetSingleAssetCrdRvwAssetByCrdRvwCustInfoId";
  public static GetMultiAssetCrdRvwAssetByCrdRvwCustInfoId = environment.losUrl + "/CrdRvwAsset/GetMultiAssetCrdRvwAssetByCrdRvwCustInfoId";
  public static GetCrdRvwCollateralByCrdRvwCustInfoId = environment.losUrl + "/CrdRvwCollateral/GetCrdRvwCollateralByCrdRvwCustInfoId";
  public static GetCrdRvwCmoBycrdRvwExposureId = environment.losUrl + "/CrdRvwCmo/GetCrdRvwCmoBycrdRvwExposureId";
  public static GetCrdRvwDealerByCrdRvwCustInfoId = environment.losUrl + "/CrdRvwDealer/GetCrdRvwDealerByCrdRvwCustInfoId";
  public static GetLatestListScoringResultHAndResultDByTrxSourceNo = environment.FoundationR3Url + "/CreditScoring/GetLatestListScoringResultHAndResultDByTrxSourceNo";
  public static GetListNegativeCustByCustNo = environment.FoundationR3Url + "/NegativeCust/GetListNegativeCustByCustNo";

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

  // Digitalization
  public static DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDO = environment.losUrl + "/Digitalization/DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDO";
  public static DigitalizationAddTrxSrcDataForFraudCheckingCollRAPINDO = environment.losUrl + "/Digitalization/DigitalizationAddTrxSrcDataForFraudCheckingCollRAPINDO";
  public static DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDOMultiAsset = environment.losUrl + "/Digitalization/DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDOMultiAsset";
  public static DigitalizationAddTrxSrcDataForFraudChecking = environment.losUrl + "/Digitalization/DigitalizationAddTrxSrcDataForFraudChecking";
  public static DigitalizationAddTrxSrcDataForFraudCheckingNAPCust = environment.losUrl + "/Digitalization/DigitalizationAddTrxSrcDataForFraudCheckingNAPCust";

  //ThirdPartyRsltH
  public static GetThirdPartyResultHByTrxTypeCodeAndTrxNo = environment.losUrl + "/ThirdPartyRsltH/GetThirdPartyResultHByTrxTypeCodeAndTrxNo";
  public static GetThirdPartyResultHForFraudChecking = environment.losUrl + "/ThirdPartyRsltH/GetThirdPartyResultHForFraudChecking";
  public static GetAppAssetFromThirdPartyResultHByTrxTypeCodeAndTrxNoAndChassisNoForFraudChecking = environment.losUrl + "/ThirdPartyRsltH/GetAppAssetFromThirdPartyResultHByTrxTypeCodeAndTrxNoAndChassisNoForFraudChecking";
  public static GetCrdRvwThirdPartyData = environment.losUrl + "/ThirdPartyRsltH/GetCrdRvwThirdPartyData";

  public static GetFraudResult = environment.losUrl + "/ThirdPartyRsltH/GetFraudResult";

  //App Asset OPL
  public static GetAppAssetOplMainInfoByAppAssetId = environment.losUrl + "/AppAssetOpl/GetAppAssetOplMainInfoByAppAssetId";
  public static GetAppAssetOplByAppAssetId = environment.losUrl + "/AppAssetOpl/GetAppAssetOplByAppAssetId";
  public static GetAssetRegionFromRuleByAppAssetId = environment.losUrl + "/AppAssetOpl/GetAssetRegionFromRuleByAppAssetId";
  public static GetListAppAssetExpenseByAppId = environment.losUrl + "/AppAssetOpl/GetListAppAssetExpenseByAppId";
  public static GetMaintenancePackageByAppAssetId = environment.losUrl + "/AppAssetOpl/GetMaintenancePackageByAppAssetId";
  public static GetMaintenanceDetailByAppAssetIdAndPackageCode = environment.losUrl + "/AppAssetOpl/GetMaintenanceDetailByAppAssetIdAndPackageCode";
  public static ExecuteInsRateRuleOpl = environment.losUrl + "/AppAssetOpl/ExecuteInsRateRuleOpl";
  public static GetOtherExpenseByAppAssetId = environment.losUrl + "/AppAssetOpl/GetOtherExpenseByAppAssetId";
  public static GetFeeExpenseByAppAssetId = environment.losUrl + "/AppAssetOpl/GetFeeExpenseByAppAssetId";
  public static SubmitAssetExpense = environment.losUrl + "/AssetExpenseOpl/SubmitAssetExpense";
  public static GetAssetExpenseDataByAppAssetId = environment.losUrl + "/AssetExpenseOpl/GetAssetExpenseDataByAppAssetId";
  public static CalculateAssetInsurance = environment.losUrl + "/AssetExpenseOpl/CalculateAssetInsurance";

  //Document Checklist
  public static SubmitDocChecklist = environment.losUrl + "/DocChecklist/SubmitDocChecklist";
  public static CreateRFADocChecklist = environment.losUrl + "/DocChecklist/CreateRFADocChecklist";

  // App Asset View
  public static GetListAppAssetAccessoryByAppAssetId = environment.losUrl + "/AppAssetView/GetListAppAssetAccessoryByAppAssetId";
  public static GetListAppAssetAccessoryAndAppAssetAttrByAppAssetId = environment.losUrl + "/AppAssetView/GetListAppAssetAccessoryAndAppAssetAttrByAppAssetId";
  public static GetAllAssetExpenseData = environment.losUrl + "/AppAssetView/GetAllAssetExpenseData";
  public static GetListAllAssetExpenseData = environment.losUrl + "/AppAssetView/GetListAllAssetExpenseData";
  public static GetRentalCalculationData = environment.losUrl + "/AppAssetView/GetRentalCalculationData";
  public static GetListAllAssetFinancialData = environment.losUrl + "/AppAssetView/GetListAllAssetFinancialData";

  // App List View
  public static GetAllAppAndAppOplListData = environment.losUrl + "/AppListView/GetAllAppAndAppOplListData";

  // App Review
  public static GetAppRvwSummaryAsset = environment.losUrl + "/ApplicationReview/GetAppRvwSummaryAsset";
  public static GetApprovalAmount = environment.losUrl + "/ApplicationReview/GetApprovalAmount";

  // Requisition Decision
  public static GetRequisitionDecisionHByAppId = environment.losUrl + "/RequisitionDecision/GetRequisitionDecisionHByAppId";
  public static SaveRequisitionDecision = environment.losUrl + "/RequisitionDecision/SaveRequisitionDecision";
  public static SubmitRequisitionDecision = environment.losUrl + "/RequisitionDecision/SubmitRequisitionDecision";
  public static IsSecurityDepositExist = environment.losUrl + "/RequisitionDecision/IsSecurityDepositExist";

  // Pre Go Live
  public static SubmitPreGoLive = environment.losUrl + "/PreGoLive/SubmitPreGoLive";

  //App Asset Rent Data
  public static GetAppFinDataOplByAppAssetId = environment.losUrl + "/AppAssetRentDataOpl/GetAppFinDataOplByAppAssetId";
  public static AddEditFinDataOpl = environment.losUrl + "/AppAssetFinancialDataOpl/SubmitFinancialDataOpl";
  public static GetListAppAssetFinDataGridByAppId = environment.losUrl + "/AppAssetRentDataOpl/GetListAppAssetFinDataGridByAppId";
  public static CalculateFinancialOpl = environment.losUrl + "/AppFinData/CalculateFinancialOpl";
  public static GetFinancialRuleOpl = environment.losUrl + "/AppAssetFinancialDataOpl/GetFinancialRuleOpl";
  public static CalculateCOFOpl = environment.losUrl + "/AppFinData/CalculateCOFOpl";

  //Asset Allocation
  public static GetAssetAllocationDataByAppId = environment.losUrl + "/AppAssetAllocationOpl/GetAssetAllocationDataByAppId";
  public static SubmitAssetAllocation = environment.losUrl + "/AppAssetAllocationOpl/SubmitAssetAllocation";

  //API AMS
  public static GetAssetStockPagingFromAms = "/Api/Integration/GetAssetStockPaging";

  // ASSET (AMS)
  public static GetAssetByAssetNo = environment.AMSUrl + "/Asset/GetAssetByAssetNo";
  public static GetListAssetReqInProgress = environment.AMSUrl + "/Api/Integration/GetListAssetReqInProgress";

  // REF BEHAVIOUR
  public static GetRefBehaviourByBehaviourTypeCode = environment.tempUrl + "/RefBehaviour/GetRefBehaviourByBehaviourTypeCode";

  //REF LOB
  public static GetListKvpInstSchmByLobCode = environment.tempUrl + "/InstSchmMap/GetListKvpInstSchmByLobCode";
  public static GetKvpRefFinMapByLobCode = environment.tempUrl + "/RefFinMap/GetKvpRefFinMapByLobCode";

  // PRODUCT
  public static GetProductMainInfo = environment.losUrl + "/Product/GetProductMainInfo"
  public static AddProduct = environment.losUrl + "/Product/AddProduct"
  public static EditProduct = environment.losUrl + "/Product/EditProduct"
  public static RequestDeactivation = environment.losUrl + "/Product/RequestDeactivation"
  public static RequestDeactivationNew = environment.losUrl + "/Product/RequestDeactivationNew"
  public static GetListProdBranchOfficeMbrByProdHId = environment.losUrl + "/Product/GetListProdBranchOfficeMbrByProdHId"
  public static GetListProdHByProdCurrentProdHId = environment.losUrl + "/Product/GetListProdHByProdCurrentProdHId";
  public static AddProductOfficeMbrBatch = environment.losUrl + "/Product/AddProductOfficeMbrBatch";
  public static DeleteProductOfficeMbr = environment.losUrl + "/Product/DeleteProductOfficeMbr";
  public static GetListProdHVersionByProdId = environment.losUrl + "/Product/GetListProdHVersionByProdId";
  public static GetProductDetailComponentInfo = environment.losUrl + "/Product/GetProductDetailComponentInfo";
  public static AddOrEditProductDetail = environment.losUrl + "/Product/AddOrEditProductDetail";
  public static DownloadProductRule = environment.losUrl + "/Product/DownloadProductRule";
  public static UpdateProductPostApv = environment.losUrl + "/Product/UpdateProductPostApv";
  public static ReviewProduct = environment.losUrl + "/Product/ReviewProduct";
  public static ReviewProductNew = environment.losUrl + "/Product/ReviewProductNew";
  public static GetProductById = environment.losUrl + "/Product/GetProductById";
  public static GetProductByHId = environment.losUrl + "/Product/GetProductByHId";
  public static CopyProduct = environment.losUrl + "/Product/CopyProduct";
  public static SubmitProduct = environment.losUrl + "/Product/SubmitProduct"

  //PRODUCT OFFERING
  public static GetProductOfferingMainInfo = environment.losUrl + "/ProductOffering/GetProductOfferingMainInfo";
  public static AddProdOffering = environment.losUrl + "/ProductOffering/AddProdOffering";
  public static EditProdOffering = environment.losUrl + "/ProductOffering/EditProdOffering";
  public static AddOrEditProdOfferingDetail = environment.losUrl + "/ProductOffering/AddOrEditProdOfferingDetail";
  public static GetProdOfferingDetailInfo = environment.losUrl + "/ProductOffering/GetProdOfferingDetailInfo";
  public static GetListProdOfferingVersionByProdId = environment.losUrl + "/ProductOffering/GetListProdOfferingVersionByProdId"
  public static GetListProdOfferingBranchOfficeMbrByProdHId = environment.losUrl + "/ProductOffering/GetListProdOfferingBranchOfficeMbrByProdHId"
  public static GetProductOfferingComponentGrouped = environment.losUrl + "/ProductComponent/GetProductOfferingComponentGrouped";
  public static GetProdOfferingHByCodeAndVerion = environment.losUrl + "/ProductOffering/GetProdOfferingHByCodeAndVerion";
  public static GetListProdOfferingHByProdOfferingCurrentProdHId = environment.losUrl + "/ProductOffering/GetListProdOfferingHByProdOfferingCurrentProdHId"
  public static GetListProdOfferingDByProdOfferingHIdAndProdCompntGrpCode = environment.losUrl + "/ProductOffering/GetListProdOfferingDByProdOfferingHIdAndProdCompntGrpCode"
  public static RequestOfferingDeactivation = environment.losUrl + "/ProductOffering/RequestProdOfferingDeactivationProdOffering"
  public static RequestOfferingDeactivationNew = environment.losUrl + "/ProductOffering/RequestProdOfferingDeactivationNew"
  public static GetListProdOfferingBranchOfficeMbrByProdHIdAndApp = environment.losUrl + "/ProductOffering/GetListProdOfferingBranchOfficeMbrByProdHIdAndApp"
  public static CopyProductOffering = environment.losUrl + "/ProductOffering/CopyProductOffering";
  public static UpdateProdOfferingPostApv = environment.losUrl + "/ProductOffering/UpdateProdOfferingPostApv";
  public static ReviewProdOffering = environment.losUrl + "/ProductOffering/ReviewProdOffering";
  public static ReviewProdOfferingNew = environment.losUrl + "/ProductOffering/ReviewProdOfferingNew";
  public static GetProdOfferingByProdOfferingId = environment.losUrl + "/ProductOffering/GetProdOfferingByProdOfferingId"

  // PRODUCT COMPONENT
  public static GetProductHOComponent = environment.losUrl + "/ProductComponent/GetProductHOComponent";
  public static GetProductHOComponentGrouped = environment.losUrl + "/ProductComponent/GetProductHOComponentGrouped";
  public static GetProductOfferingComponent = environment.losUrl + "/ProductComponent/GetProductOfferingComponent";
  public static DeleteProdOfferingOfficeMbr = environment.losUrl + "/ProductOffering/DeleteProdOfferingOfficeMbr";
  public static AddProdOfferingOfficeMbrBatch = environment.losUrl + "/ProductOffering/AddProdOfferingOfficeMbrBatch";


  // GO LIVE (LMS)
  public static CheckGoLivePayment = environment.LMSUrl + "/Api/Integration/CheckGoLivePayment";
  
  //Check DMS
  public static GetSysConfigPncplResultByCode = environment.FoundationR3Url + "/SysConfigResult/GetSysConfigPncplResultByCode";
}
