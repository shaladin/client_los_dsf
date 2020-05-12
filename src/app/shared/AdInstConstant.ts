import { environment } from "environments/environment";

export class AdInsConstant {

  //App Step
  public static AppStepNew = "NEW";
  public static AppStepCust = "CUST";
  public static AppStepGuar = "GUAR";
  public static AppStepRef = "REF";
  public static AppStepApp = "APP";
  public static AppStepAsset = "ASSET";
  public static AppStepIns = "INS";
  public static AppStepLIns = "LFI";
  public static AppStepFin = "FIN";
  public static AppStepTC = "TC";
  public static AppStepOther = "OTH";
  public static AppStepCrdIns = "CRI";
  public static AppStepComm = "COM";
  public static AppStepRSVFund = "RSV";
  public static AppStepPhnVerif = "PHN";
  public static AppStepSurvey = "SRVY";
  public static AppStepFraud = "FRD";
  public static AppStepCrdInv = "CINV";
  public static AppStepScoring = "SCOR";
  public static AppStepDev = "DEVC";
  public static AppStepRvw = "RVW";
  public static AppStepApv = "APV";
  public static AppStepRtn = "RTN";
  public static AppStepAgr = "AGR";
  public static AppStepPO = "PO";
  public static AppStepOFVC = "OFVC";
  public static AppStepOFVA = "OFVA";
  public static AppStepDO = "DO";
  public static AppStepCNFR = "CNFR";
  public static AppStepPGLV = "PGLV";
  public static AppStepCSR = "CSR";
  public static FL4W = "FL4W";
  public static CF4W = "CF4W";

  public static GENERAL = "GENERAL";
  public static FACTORING = "FACTORING";

  //WORKFLOW (LEWAT FOUNDATION)
  public static ResumeWorkflow = environment.FoundationR3Url + "/Workflow/ResumeWorkflow"

  // ASSET
  public static GetListKeyValueByCode = environment.FoundationR3Url + "/AssetType/GetListKeyValueByCode";
  public static GetAssetTypeByCode = environment.FoundationR3Url + "/AssetType/GetAssetTypeByCode";


  // APP Application
  public static AddApp = "/Application/AddApp";
  public static EditApp = "/Application/EditApp";
  public static GetAppById = environment.losUrl + "/Application/GetAppById";
  public static GetAppByIds = environment.losUrl + "/Application/GetAppById";
  public static GetAppDetailForTabAddEditAppById = environment.losUrl + "/Application/GetAppDetailForTabAddEditAppById";
  public static GetAppDetailForAppTabById = environment.losUrl + "/Application/GetAppDetailForAppTabById";
  public static AddAppFromLead = environment.losUrl + "/Application/AddAppFromLead";
  public static DataTableNAP = "http://localhost:5001" + "/Application/DataTableNAP";
  public static GetRuleFeeAndInsFixedNAP = environment.losUrl + "/Application/GetRuleFeeAndInsFixedNAP";
  public static GetAppAndAppCustDetailByAgrmntId = environment.losUrl + "/Application/GetAppAndAppCustDetailByAgrmntId";
  public static SubmitNAP = environment.losUrl + "/Application/SubmitNAP";
  public static AddEditAppCF2W = environment.losUrl + "/Application/AddEditAppCF2W";
  public static DataTableFeeAndInsNAP = "http://localhost:5001" + "/Application/DataTableFeeAndInsNAP";
  public static UpdateAppStepByAppId = environment.losUrl +"Application/UpdateAppStepByAppId";

  //App Loan Purpose
  public static AddAppLoanPurpose = environment.losUrl + "/AppLoanPurpose/AddAppLoanPurpose";
  public static EditAppLoanPurpose = environment.losUrl + "/AppLoanPurpose/EditAppLoanPurpose";
  public static GetListAppLoanPurposeByAppId = environment.losUrl + "/AppLoanPurpose/GetListAppLoanPurposeByAppId";
  public static GetAppLoanPurposeByAppLoanPurposeId = environment.losUrl + "/AppLoanPurpose/GetAppLoanPurposeByAppLoanPurposeId";
  // App Collateral
  public static GetAppCollateralRegistrationByAppId = "/AppCollateralRegistration/GetAppCollateralRegistrationByAppId";

  // App Asset Suppl Emp
  //public static GetListAppAssetSupplEmpByAppAssetId = "/AppAssetSupplEmp/GetListAppAssetSupplEmpByAppAssetId";

  // App Asset
  public static GetAppAssetListByAppIdForCommision = "/AppAsset/GetAppAssetListByAppIdForCommision";
  //public static GetAppAssetByAppAssetId = "/AppAsset/GetAppAssetByAppAssetId";
  public static GetAppAssetByAppAssetIdWithSerialNoDefinition = "/AppAsset/GetAppAssetByAppAssetIdWithSerialNoDefinition";
  public static GetAppAssetByAppAssetId = environment.losUrl + "/AppAsset/GetAppAssetByAppAssetId"

  // App Asset Suppl Emp
  public static GetListAppAssetSupplEmpByListAppAssetId = environment.losUrl + "/AppAssetSupplEmp/GetListAppAssetSupplEmpByListAppAssetId";
  public static GetAppAssetSupplEmpByAppAssetIdAndCode = environment.losUrl + "/AppAssetSupplEmp/GetAppAssetSupplEmpByAppAssetIdAndCode";

  // App Referantor
  public static AddAppReferantor = "/AppReferantor/AddAppReferantor";
  public static EditAppReferantor = "/AppReferantor/EditAppReferantor";
  public static DeleteAppReferantor = "/AppReferantor/DeleteAppReferantor";
  public static GetAppReferantorByAppReferantorId = "/AppReferantor/GetAppReferantorByAppReferantorId";
  public static GetAppReferantorByAppId = "/AppReferantor/GetAppReferantorByAppId";

  // App Cross
  public static EditAppAddAppCross = environment.losUrl + "/Application/EditAppAddAppCross";
  public static GetAppCrossByCrossAgrmntNo = "/AppCross/GetAppCrossByCrossAgrmntNo";
  public static DeleteAppCross = environment.losUrl + "/AppCross/DeleteAppCross";
  public static GetListAppCross = environment.losUrl + "/AppCross/GetListAppCross";
  public static AddListAppCross = "/AppCross/AddListAppCross";

  // Ref App Src
  public static GetListKvpActiveRefAppSrc = environment.losUrl + "/RefAppSrc/GetListKvpActiveRefAppSrc";

  public static RestrictionLike = "Like";
  public static RestrictionEq = "Eq";
  public static RestrictionIn = "IN";
  public static RestrictionNotIn = "NotIn";
  public static RestrictionIsNull = "isnull";
  public static RestrictionIsNotNull = "isnotnull";
  public static showData = "10,50,100";
  public static TimeoutSession = 6000000;
  public static GetListProduct = "http://creator_websvr:7272/NEW_FINANCING/api/Catalog/getPopularViewByCriteria";
  public static Login = "/Authenticate/Login";
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

  //CUST TYPE
  public static CustTypePersonal = "PERSONAL";
  public static CustTypeCompany = "COMPANY";



  //Asset Master
  public static GetAssetMasterTypeByFullAssetCode = environment.FoundationR3Url + "/AssetMaster/GetAssetMasterTypeByFullAssetCode";

  // App Commission
  public static AddOrEditAppCommissionData = "/AppCommission/AddOrEditAppCommissionData";
  public static GetAppCommissionDataForEditByAppId = environment.losUrl + "/AppCommission/GetAppCommissionDataForEditByAppId";
  public static DeleteAppCommissionData = environment.losUrl + "/AppCommission/DeleteAppCommissionData";
  public static GetAppCommissionRule = "/AppCommission/GetAppCommissionRule";
  public static GetAppCommissionTax = "/AppCommission/GetAppCommissionTax";

  public static GetRefOfficeByOfficeCode = environment.FoundationR3Url + "/RefOffice/GetRefOfficeByOfficeCode";


  // public static GetAppDetailForAppTabById = environment.losUrl + "/Application/GetAppDetailForAppTabById";
  // public static AddAppFromLead = environment.losUrl + "/Application/AddAppFromLead";

  // App Asset
  public static GetAppAssetForDealerDataByAppId = environment.losUrl + "/AppAsset/GetAppAssetForDealerDataByAppId";

  // App Commission
  public static GetAppCommissionDataDetailByAppId = environment.losUrl + "/AppCommission/GetAppCommissionDataDetailByAppId";

  // App Referantor
  public static GetAppReferantorForAppsData = "/AppReferantor/GetAppReferantorForAppsData";


  //CUST TYPE
  public static GetAppByCustNoAndIsAppInitDone = environment.losUrl + "/Application/GetAppByCustNoAndIsAppInitDone";
  public static GetAppByCustNoAndAppStat = environment.losUrl + "/Application/GetAppByCustNoAndAppStat";

  //COVER PERIOD
  public static CoverPeriodAnnually = "AN";
  public static CoverPeriodFullTenor = "FT";
  public static CoverPeriodPartialTenor = "PT";
  public static CoverPeriodOverTenor = "OT";

  //PREMIUM TYPE
  public static PremiumTypeAmt = "AMT";
  public static PremiumTypePrcnt = "PRCNT";

  //LOB CODE
  public static LobCodeFCTR = "FCTR";
  public static LobCodeRFN4W = "RFN4W";


  //Asset Accessory
  public static GetAssetAccessoryByCode = environment.FoundationR3Url + "/AssetAccessory/GetAssetAccessoryByCode";

  //Asset Master
  public static GetAssetMasterForLookupEmployee = environment.FoundationR3Url + "/AssetMaster/GetAssetMasterForLookupEmployee";

  //ADDR TYPE
  public static AddrTypeLegal = "LEGAL";
  public static AddrTypeResidence = "RESIDENCE";
  public static AddrTypeMailing = "MAILING";
  public static AddrTypeJob = "JOB";

  //CUST MODEL
  public static CustModelProfessional = "PROF";
  public static CustModelNonProfessional = "NONPROF";
  public static CustModelEmployee = "EMP";
  public static CustModelSmallMediumEnterprise = "SME";

  //VENDOR CATEGORY 
  public static VendorCategoryAssetInscoBranch = "ASSET_INSCO_BRANCH";

  //INSURED BY
  public static InsuredByCustomer = "CU";
  public static InsuredByOffSystem = "OFF";
  public static InsuredByCompany = "CO";
  public static InsuredByCustomerCompany = "CUCO";

  //INS PAID BY
  public static InsPaidByCustomer = "CU";
  //GENERAL SETTING
  public static GetBusinessDt = "/GeneralSetting/GetBusinessDate";
  public static AddGeneralSetting = "/GeneralSetting/AddGeneralSetting";
  public static EditGeneralSetting = "/GeneralSetting/EditGeneralSetting";
  public static GetGeneralSettingPaging = "/GeneralSetting/GetGeneralSettingPaging";
  public static GetGeneralSettingById = "/GeneralSetting/GetGeneralSettingById";
  public static GetGeneralSettingValue = "/GeneralSetting/GetGeneralSettingValue";
  public static GetGeneralSettingByCode = environment.FoundationR3Url + "/GeneralSetting/GetGeneralSettingByCode";

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
  public static AddAppAgrmntCancel = environment.losUrl + "/AppAgrmntCancel/AddAppAgrmntCancel"


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
  public static EditRefZipcode = "/RefZipcode/EditRefZipCode";
  public static AddRefZipcode = "/RefZipcode/AddRefZipCode";
  public static DeleteRefZipcode = "/RefZipcode/DeleteRefZipCode";
  public static GetOfficeZipcodeMemberAddPaging = "/RefZipcode/GetOfficeZipcodeMemberAddPaging";

  //OFFICE ZIPCODE MEMBER
  public static GetOfficeZipCodeMemberPaging = "/OfficeZipcodeMember/GetOfficeZipCodeMemberPaging";
  public static GetRefOfficeZipcodePaging = "/OfficeZipcodeMember/GetRefOfficeZipcodePaging";
  public static AddOfficeZipcodeMember = "/OfficeZipcodeMember/AddOfficeZipcodeMember";
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
  public static GetRefMasterByMasterCode = "/RefMaster/GetRefMasterByMasterCode";
  public static GetRefMasterListKeyValueActiveByCode = environment.FoundationR3Url + "/RefMaster/GetListKeyValueActiveByCode"
  public static GetListActiveRefMaster = environment.FoundationR3Url + "/RefMaster/GetListActiveRefMaster"
  public static GetRefMasterByRefMasterTypeCode = environment.FoundationR3Url + "/RefMaster/GetRefMasterByRefMasterTypeCode"
  public static GetListActiveRefMasterWithReserveFieldAll = environment.FoundationR3Url + "/RefMaster/GetListActiveRefMasterWithReserveFieldAll";

  public static RefMasterTypeCodeCustType = "CUST_TYPE";
  public static RefMasterTypeCodeSlsRecom = "SLS_RECOM";
  public static RefMasterTypeCodeWOP = "WOP";
  public static RefMasterTypeCodeInstSchm = "INST_SCHM";
  public static RefMasterTypeCodeCustNotifyOpt = "CUST_NOTIF_OPT";
  public static RefMasterTypeCodeFirstInstType = "FIRST_INST_TYPE";
  public static RefMasterTypeCodeInterestType = "INTRSTTYPE";
  public static RefMasterTypeCodeAssetCondition = "ASSET_CONDITION";
  public static RefMasterTypeCodeAssetUsage = "ASSET_USAGE";
  public static RefMasterTypeCodeCustPersonalRelationship = "CUST_PERSONAL_RELATIONSHIP";
  public static RefMasterTypeCodeIdType = "ID_TYPE";
  public static RefMasterTypeCodeRateType = "RATE_TYPE";
  public static RefMasterTypeCodeAddrType = "ADDR_TYPE";
  public static RefMasterTypeCodeGracePeriodType = "GRACE_PERIOD_TYPE";
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

  //REF CURR
  public static GetRefCurrPaging = "/RefCurr/GetRefCurrPaging";
  public static AddRefCurr = "/RefCurr/AddRefCurr";
  public static EditRefCurr = "/RefCurr/EditRefCurr";
  public static GetRefCurr = "/RefCurr/GetRefCurr";
  public static AddExchangeRate = "/RefCurr/AddExchangeRate";
  public static EditExchangeRate = "/RefCurr/EditExchangeRate";
  public static GetExchangeRate = "/RefCurr/GetExchangeRate";

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
  public static AddQueue = "http://R3App-Server/FOUNDATION/RabbitMq/AddQueue";

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

  // GENERIC
  public static GetPagingObjectBySQL = "/Generic/GetPagingObjectBySQL";

  // LEAD
  public static ViewHeaderLeadMainInfo = "./assets/ucviewgeneric/viewLeadHeader.json";
  public static AddLead = environment.losUrl + "/Lead/AddLead";
  public static EditLead = environment.losUrl + "/Lead/EditLead";
  public static DeleteLead = environment.losUrl + "/Lead/DeleteLead";
  public static GetLeadByLeadId = environment.losUrl + "/Lead/GetLeadByLeadId";
  public static GetLeadByLeadNo = environment.losUrl + "/Lead/GetLeadByLeadNo";
  public static GetLeadForUpdateByLeadId = environment.losUrl + "/Lead/GetLeadForUpdateByLeadId";
  public static GetLeadForUpdateByLeadNo = environment.losUrl + "/Lead/GetLeadForUpdateByLeadNo";

  public static SubmitWorkflowLeadInput = environment.losUrl + "/Lead/SubmitWorkflowLeadInput";
  public static GetLeadPersonalForLookupCopy = environment.losUrl + "/Lead/GetLeadPersonalForLookupCopy";

  // LEAD ASSET
  public static GetLeadAssetByLeadId = environment.losUrl + "/LeadAsset/GetLeadAssetByLeadId";
  public static GetLeadAssetForCheck = environment.losUrl + "/LeadAsset/GetLeadAssetForCheck"

  //GUARANTOR
  public static GetListAppGuarantor = environment.losUrl + "/AppGuarantor/GetListAppGuarantor"
  public static GetListAppGuarantorDetail = environment.losUrl + "/AppGuarantor/GetListAppGuarantorDetail"
  public static AddAppGuarantorPersonal = environment.losUrl + "/AppGuarantor/AddAppGuarantorPersonal"
  public static AddAppGuarantorCompany = environment.losUrl + "/AppGuarantor/AddAppGuarantorCompany"
  public static GetAppGuarantorPersonalByAppGuarantorId = environment.losUrl + "/AppGuarantor/GetAppGuarantorPersonalByAppGuarantorId"
  public static GetAppGuarantorCompanyByAppGuarantorId = environment.losUrl + "/AppGuarantor/GetAppGuarantorCompanyByAppGuarantorId"
  public static EditAppGuarantorPersonal = environment.losUrl + "/AppGuarantor/EditAppGuarantorPersonal"
  public static EditAppGuarantorCompany = environment.losUrl + "/AppGuarantor/EditAppGuarantorCompany"
  public static DeleteAppGuarantor = environment.losUrl + "/AppGuarantor/DeleteAppGuarantor"
  public static GetListAppGuarantorCompanyByAppId = environment.losUrl + "/AppGuarantor/GetListAppGuarantorCompanyByAppId"
  public static GuarantorTypeCodePersonal = "PERSONAL";
  public static GuarantorTypeCodeCompany = "COMPANY";


  // Vendor
  public static GetListVendorBankAccByVendorId = environment.FoundationR3Url + "/VendorBankAcc/GetListVendorBankAccByVendorId";
  public static GetListVendorBankAccByVendorCode = environment.FoundationR3Url + "/VendorBankAcc/GetListVendorBankAccByVendorCode";
  public static GetListKeyValueByCategoryCodeAndOfficeCode = environment.FoundationR3Url + "/Vendor/GetListKeyValueByCategoryCodeAndOfficeCode";
  public static GetVendorByVendorCode = environment.FoundationR3Url + "/Vendor/GetVendorByVendorCode";
  public static GetListVendorEmpByVendorId = environment.FoundationR3Url + "/VendorEmp/GetListVendorEmpByVendorId";
  public static GetListVendorEmpByVendorIdAndPositionCodes = environment.FoundationR3Url + "/VendorEmp/GetListVendorEmpByVendorIdAndPositionCodes";
  public static GetVendorEmpSupervisorByVendorEmpId = environment.FoundationR3Url + "/VendorEmp/GetVendorEmpSupervisorByVendorEmpId";
  public static GetVendorEmpByVendorIdVendorEmpNo = environment.FoundationR3Url + "/VendorEmp/GetVendorEmpByVendorIdVendorEmpNo";
  public static GetListVendorByCategoryCodeAndOfficeCode = environment.FoundationR3Url + "/Vendor/GetListVendorByCategoryCodeAndOfficeCode";
  public static GetVendorForLookup = environment.FoundationR3Url + "/Vendor/GetVendorForLookup";


  // VendorEmp
  public static GetListVendorBankByVendorEmpNo = "/VendorEmp​/GetListVendorBankByVendorEmpNo";
  public static GetListVendorBankAccByListVendorEmpNo = "/VendorEmp/GetListVendorBankAccByListVendorEmpNo";
  public static GetVendorEmpByVendorEmpNo = "/VendorEmp/GetVendorEmpByVendorEmpNo";
  public static GetListVendorEmpByVendorIdAndPosition = environment.FoundationR3Url + "/VendorEmp/GetListVendorEmpByVendorIdAndPosition";
  public static GetListKeyValueVendorEmpByVendorIdAndPosition = environment.FoundationR3Url + "/VendorEmp/GetListKeyValueVendorEmpByVendorIdAndPosition"


  //Life Ins
  public static AddAppLifeInsH = environment.losUrl + "/AppLifeIns/AddAppLifeInsH";
  public static EditAppLifeInsH = environment.losUrl + "/AppLifeIns/EditAppLifeInsH";
  public static InitAppLifeInsH = environment.losUrl + "/AppLifeIns/InitAppLifeInsH";


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
  public static AddMouCustFctr = environment.losUrl + "/MouCustFctr/AddMouCustFctr";
  public static EditMouCustFctr = environment.losUrl + "/MouCustFctr/EditMouCustFctr";
  public static GetMouCustFctrByMouCustId = environment.losUrl + "/MouCustFctr/GetMouCustFctrByMouCustId";
  public static GetMouCustTcFromRule = environment.losUrl + "/MouCustTc/GetMouCustTcFromRule";
  public static EditListMouCustTc = environment.losUrl + "/MouCustTc/EditListMouCustTc";
  public static GetListMouCustListedCustFctrByMouCustId = environment.losUrl + "/MouCustListedCustFctr/GetListMouCustListedCustFctrByMouCustId";
  public static DeleteMouCustListedCustFctr = environment.losUrl + "/MouCustListedCustFctr/DeleteMouCustListedCustFctr";
  public static AddMouCustListedCustFctr = environment.losUrl + "/MouCustListedCustFctr/AddMouCustListedCustFctr";
  public static SubmitWorkflowMouRequest = environment.losUrl + "/MouCust/SubmitWorkflowMouRequest";
  public static SubmitMouReview = environment.losUrl + "/MouCust/SubmitMouReview";
  public static ReturnMouReview = environment.losUrl + "/MouCust/ReturnMouReview";

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
  public static GetMouCustCollateralDataForUpdateByMouCustCollateralId = environment.losUrl + "/MouCustCollateral/GetMouCustCollateralDataForUpdateByMouCustCollateralId";
  public static GetListCollateralByCustNo = environment.FoundationR3Url + "/Collateral/GetListCollateralByCustNo";

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
  public static GetCustCompanyForCopyByCustId = environment.FoundationR3Url + "/Cust/GetCustCompanyForCopyByCustId";
  public static GetCustPersonalForCopyMgmntShrholderByCustId = environment.FoundationR3Url + "/Cust/GetCustPersonalForCopyMgmntShrholderByCustId";
  public static GetCustCompanyForCopyMgmntShrholderByCustId = environment.FoundationR3Url + "/Cust/GetCustCompanyForCopyMgmntShrholderByCustId";

  //CUST DATA COMPANY
  public static AddEditCustDataCompany = environment.losUrl + "/AppCust/AddEditCustDataCompany";

  //DELIVERY ORDER
  public static SubmitDeliveryOrderData = environment.losUrl + "/DeliveryOrder/SubmitDeliveryOrderData";
  public static GetRefAssetDocList = environment.losUrl + "/DeliveryOrder/GetRefAssetDocList";
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

  //PURCHASE ORDER
  public static SubmitPurchaseOrder = environment.losUrl + "/PurchaseOrderH/SubmitPurchaseOrder";
  public static ResumeWorkflowPurchaseOrder = environment.losUrl + "/PurchaseOrderH/ResumeWorkflowPurchaseOrder";

  // LEAD
  public static AddEditLeadCustPersonal = environment.losUrl + "/LeadCust/AddEditLeadCustPersonal";
  public static AddEditLeadData = environment.losUrl + "/Lead/AddEditLeadData";

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
  //CUST DATA PERSONAL
  public static AddEditCustDataPersonal = environment.losUrl + "/AppCust/AddEditCustDataPersonal";
  public static GetCustDataByAppId = environment.losUrl + "/AppCust/GetCustDataByAppId";
  public static GetAppCustPersonalContactPersonsByAppCustPersonalId = environment.losUrl + "/AppCustPersonalContactPerson/GetAppCustPersonalContactPersonsByAppCustPersonalId";
  public static DeleteAppCustPersonalContactPerson = environment.losUrl + "/AppCustPersonalContactPerson/DeleteAppCustPersonalContactPerson";
  public static GetAppCustBankAccsByAppCustId = environment.losUrl + "/AppCustBankAcc/GetAppCustBankAccsByAppCustId";

  public static GetAppCustPersonalDataAndSpouseByAppId = environment.losUrl + "/AppCust/GetAppCustPersonalDataAndSpouseByAppCustId";

  //CUST DATA COMPANY
  public static GetCustDataForViewByAppId = environment.losUrl + "/AppCust/GetCustDataForViewByAppId";
  public static GetCustDataPersonalForViewByAppId = environment.losUrl + "/AppCust/GetCustDataPersonalForViewByAppId";
  public static GetCustDataCompanyForViewByAppId = environment.losUrl + "/AppCust/GetCustDataCompanyForViewByAppId";
  public static GetAppCustCompanyByAppCustId = environment.losUrl + "/AppCust/GetAppCustCompanyByAppCustId";



  // APP TC
  public static GetListTCbyAppId = environment.losUrl + "/AppTc/GetListTCbyAppId";

  // Rule
  public static Rule = "http://r3app-server/RULE_FINAL/RuleService/ExecuteRuleSet";


  // App Asset
  public static GetAppAssetListByAgrmntId = environment.losUrl + "/AppAsset/GetAppAssetListByAgrmntId";
  public static GetAppAssetByAppId = environment.losUrl + "/AppAsset/GetAppAssetDataByAppId";
  public static GetAppAssetListByAppId = environment.losUrl + "/AppAsset/GetAppAssetListByAppId";
  public static GetAllAssetDataForPOByAsset = environment.losUrl + "/AppAsset/GetAllAssetDataForPOByAsset";
  public static GetAppAssetByAgrmntId = environment.losUrl + "/AppAsset/GetAppAssetByAgrmntId";
  public static GetAllAssetDataByAppId = environment.losUrl + "/AppAsset/GetAllAssetDataByAppId";
  public static AddEditAllAssetData = environment.losUrl + "/AppAsset/AddEditAllAssetData";

  //Asset Doc List
  public static GetAppAssetDataByAppId = environment.losUrl + "/AppAsset/GetAppAssetDataByAppId";


  // Tax
  public static AppCom = "APP_COM";
  public static ExchangeRateAmt = "1";
  public static TaxTypeCode = "WHT";
  public static VATTypeCode = "VAT";
  public static TrxTypeCode = "APP_COM";
  public static ContentSupplier = "Supplier";
  public static ContentSupplierEmp = "SupplierEmployee";
  public static ContentReferantor = "Referantor";
  public static CommissionReceipientTypeCodeSupplier = "SUPPLIER";
  public static CommissionReceipientTypeCodeSupplierEmp = "SUPPLIER_EMP";
  public static CommissionReceipientTypeCodeReferantor = "REFERANTOR";

  public static TitleSupplier = "List Supplier Commission Data";
  public static TitleSupplierEmp = "List Supplier Employee Commission Data";
  public static TitleReferantor = "List Referantor Commission Data";
  public static ReturnObj = "ReturnObject";


  //Asset Doc List
  public static GetListAssetDocListByAssetTypeCode = environment.FoundationR3Url + "/AssetDocList/GetListAssetDocListByAssetTypeCode";
  public static GetListAppAssetData = environment.losUrl + "/AppAsset/GetListAppAssetData";

  // App Collateral
  public static GetListAppCollateral = environment.losUrl + "/AppCollateral/GetListAppCollateral";
  public static GetListAppCollateralByAppId = environment.losUrl + "/AppCollateral/GetListAppCollateralByAppId";
  public static DeleteAppCollateral = environment.losUrl + "/AppCollateral/DeleteAppCollateral";
  public static GetViewAppCollateralObjByAppId = environment.losUrl + "/AppCollateral/GetViewAppCollateralObjByAppId";
  public static AddEditAllCollateralData = environment.losUrl + "/AppCollateral/AddEditAllCollateralData";
  public static AddExistingAppCollateralData = environment.losUrl + "/AppCollateral/AddExistingAppCollateralData";
  public static GetAppCollateralByAppCollateralId = environment.losUrl + "/AppCollateral/GetAppCollateralByAppCollateralId";
  public static GetAppCollateralByAppId = environment.losUrl + "/AppCollateral/GetAppCollateralByAppId";

  // App Collateral Suppl Emp
  public static GetListAppAssetSupplEmpByAppAssetId = environment.losUrl + "/AppAssetSupplEmp/GetListAppAssetSupplEmpByAppAssetId";
  public static AddEditAllCollateralDataByAppCollateraId = "";
  // App Collateral Registration
  public static GetAppCollateralRegistrationByAppCollateralId = environment.losUrl + "/AppCollateralRegistration/GetAppCollateralRegistrationByAppCollateralId"


  //AGRMNT SIGNER
  public static SubmitAgrmntSignerData = environment.losUrl + "/AgrmntSigner/SubmitAgrmntSignerData";
  public static EditAgrmntSignerData = environment.losUrl + "/AgrmntSigner/EditAgrmntSignerData";
  public static GetAgrmntSignerByAgrmntId = environment.losUrl + "/AgrmntSigner/GetAgrmntSignerByAgrmntId";

  //AGRMNT FIN DATA
  public static GetAgrmntFinDataByAgrmntId = environment.losUrl + "/AgrmntFinData/GetAgrmntFinDataByAgrmntId";
  public static GetFinancialDataByAgrmntIdForView = environment.losUrl + "/AgrmntFinData/GetFinancialDataByAgrmntIdForView";


  // LEAD FRAUD VERF
  public static AddLeadFraudVerf = environment.losUrl + "/LeadFraudVerf/AddLeadFraudVerf"

  // VERIFY STAT
  public static Reject = "REJECT";
  public static Verify = "VERIFY";

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
  public static GetAgrmntByAppIdGetAgrmntByAgrmntNo = environment.losUrl + "/Agrmnt/GetAgrmntByAgrmntNo";
    
  //AGRMNT Commission
  public static GetListAgrmntCommissionWithDetailByAgrmntId = environment.losUrl + "/AgrmntCommission/GetListAgrmntCommissionWithDetailByAgrmntId";

  //REF TC
  public static GetRefTcByCode = environment.FoundationR3Url + "/RefTc/GetRefTcByCode";
  public static GetListRefTcByTcCode = environment.FoundationR3Url + "/RefTc/GetListRefTcByTcCode";

  //PURCHASE ORDER


  //APP INSURANCE
  public static GetInsuranceDataByAppId = environment.losUrl + "/AppIns/GetInsDataByAppId";
  public static GetInsuranceDataByAppIdForView = environment.losUrl + "/AppIns/GetInsDataByAppIdForView";
  public static GetInsDataByAppIdAndAssetId = environment.losUrl + "/AppIns/GetInsDataByAppIdAndAssetId";
  public static AddEditInsuranceData = environment.losUrl + "/AppIns/AddEditInsuranceData";
  public static GetListAppInsObjByAppIdForView = environment.losUrl + "/AppIns/GetListAppInsObjByAppIdForView";
  public static GetAppInsObjViewDetail = environment.losUrl + "/AppIns/GetAppInsObjViewDetail";

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

  //PURCHASE ORDER EXTENSION
  public static SubmitNewExpDate = environment.losUrl + "/PurchaseOrderH/SubmitNewExpDate";

  //VERF
  public static GetVerfQuestionAnswerListBySchemeCode = environment.FoundationR3Url + "/VerfQuestionAnswer/GetVerfQuestionAnswerListByVerfSchemeCode"

  // VERF RESULT
  public static GetVerfResultById = environment.FoundationR3Url + "/VerfResult/GetVerfResultById";
  public static AddVerfResultAndVerfResultH = environment.FoundationR3Url + "/VerfResult/AddVerfResultAndVerfResultH";
  public static GetVerfResultHById = environment.FoundationR3Url + "/VerfResultH/GetVerfResultHById";
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
  public static DeleteAppInvoiceFctr = environment.losUrl + "/AppInvoiceFctr/DeleteAppInvoiceFctr";
  public static GetAppInvoiceFctrByAppFctrId = environment.losUrl + "/AppInvoiceFctr/GetAppInvoiceFctrByAppFctrId";
  public static GetListAppInvoiceFctrByAppFctrId = environment.losUrl + "/AppInvoiceFctr/GetListAppInvoiceFctrByAppFctrId";
  public static GetListAppInvoiceFctrByAgrmntId = environment.losUrl + "/AppInvoiceFctr/GetListAppInvoiceFctrByAgrmntId";


  public static GetAppFinDataWithRuleByAppId = environment.losUrl + "/AppFinData/GetAppFinDataWithRuleByAppId";

  //App Cust Addr
  public static GetListAppCustAddrByAppId = environment.losUrl + "/AppCustAddr/GetListAppCustAddrByAppId";
  public static GetAppCustAddrByAppCustAddrId = environment.losUrl + "/AppCustAddr/GetAppCustAddrByAppCustAddrId"

  //App Fee
  public static GetListAppFeeByAppId = environment.losUrl + "/AppFee/GetListAppFeeByAppId";
  public static MrFeeTypeCodeAdmin = "ADMIN";
  public static MrFeeTypeCodeProvision = "PROVISION";

  //App Reserved Fund
  public static AddEditAppReservedFund = environment.losUrl + "/AppReservedFund/AddEditAppReservedFund";
  public static GetListAppReservedFundByAppId = environment.losUrl + "/AppReservedFund/GetListAppReservedFundByAppId";
  public static CreateRsvFundRule = environment.losUrl + "/AppReservedFund/CreateRsvFundRule";

  //App Fin Data
  public static GetAppFinDataByAppId = environment.losUrl + "/AppFinData/GetAppFinDataByAppId";
  public static CreateMaxAllocAmtRsvFund = environment.losUrl + "/AppFinData/CreateMaxAllocAmtRsvFund";
  public static CalculateInstallmentStepUpStepDown = environment.losUrl + "/AppFinData/CalculateInstallmentStepUpStepDown";
  public static CalculateInstallmentEvenPrincipal = environment.losUrl + "/AppFinData/CalculateInstallmentEvenPrincipal";
  public static GetFinancialDataByAppIdForView = environment.losUrl + "/AppFinData/GetFinancialDataByAppIdForView";



  //Fraud Detection
  public static GetAppDupCheckCustByAppId = environment.losUrl + "/FraudDetection/GetAppDupCheckCustByAppId";
  public static GetFraudDukcapilByIdNo = environment.losUrl + "/FraudDetection/GetFraudDukcapilByIdNo";
  public static AddAppFraudVerf = environment.losUrl + "/FraudDetection/AddAppFraudVerf";
  public static GetListAppNegativeCheckCustByAppId = environment.losUrl + "/AppDupCheck/GetListAppNegativeCheckCustByAppId";
  public static GetAppFraudVerificationByAppId = environment.losUrl + "/FraudDetection/GetAppFraudVerificationByAppId";

  //Dukcapil
  public static GetFraudDukcapilByTrxNoAndTrxType = environment.losUrl + "/Dukcapil/GetFraudDukcapilByTrxNoAndTrxType"


  //CUSTOMER DUPLICATE CHECKING
  public static GetCustomerAndNegativeCustDuplicateCheck = environment.FoundationR3Url + "/CustDuplicateCheck/GetCustomerAndNegativeCustDuplicateCheck";
  // ASSET NEGATIVE DUPLICATE CHECK
  public static GetAssetNegativeDuplicateCheck = environment.FoundationR3Url + "/AssetNegative/GetAssetNegativeDuplicateCheck";
  public static GetAssetNegativeDuplicateCheckByListOfAsset = environment.FoundationR3Url + "/AssetNegative/GetAssetNegativeDuplicateCheckByListOfAsset"
  //App Duplicate Checking
  public static GetCustomerDuplicateCheck = "/CustDuplicateCheck/GetCustomerAndNegativeCustDuplicateCheck";
  public static GetNegativeCustomerDuplicateCheck = environment.FoundationR3Url + "/CustDuplicateCheck/GetNegativeCustomerDuplicateCheck";
  public static GetAppCustDuplicateCheck = "/AppDupCheck/GetAppCustDuplicateCheck";
  public static GetAppGuarantorDuplicateCheck = "/AppDupCheck/GetAppGuarantorDuplicateCheck";
  public static GetSpouseDuplicateCheck = "/AppDupCheck/GetSpouseDuplicateCheck";
  public static GetAppShareholderDuplicateCheck = "/AppDupCheck/GetAppShareholderDuplicateCheck";
  public static AddAppDupCheckCust = "/AppDupCheck/AddAppDupCheckCust";
  public static EditCustNoAppCust = environment.losUrl + "/AppDupCheck/EditCustNoAppCust";
  public static SubmitAppDupCheck = environment.losUrl + "/AppDupCheck/SubmitAppDupCheck";



  // Product Offering
  public static GetListProdOfferingDByProdOfferingCode = "/ProductOffering/GetListProdOfferingDByProdOfferingCode";
  public static GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode = environment.FoundationR3Url + "/ProductOffering/GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode";
  public static GetPayFreqByProdOfferingD = environment.FoundationR3Url + "/ProductOffering/GetPayFreqByProdOfferingD";

  //Ref Pay Freq
  public static GetPayFreqByProdOfferingCodeandRefProdCompntCode = environment.FoundationR3Url + "/RefPayFreq/GetPayFreqByProdOfferingCodeandRefProdCompntCode";
  public static GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat = environment.FoundationR3Url + "/ProductOffering/GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat";

  // ASSET TYPE
  public static GetAssetTypeById = environment.FoundationR3Url + "/AssetType/GetAssetTypeById";
  public static GetListAssetTypeByCode = environment.FoundationR3Url + "/AssetType/GetListKeyValueActiveByCode";

  //App Crd Invstg
  public static AddAppCrdInvstg = environment.losUrl + "/AppCrdInvstgH/AddAppCrdInvstg";
  public static GetAppCrdInvstgByAppId = environment.losUrl + "/AppCrdInvstgH/GetAppCrdInvstgByAppId";

  // APP SUBSIDY
  public static GetListAppSubsidyByAppId = environment.losUrl + "/AppSubsidy/GetListAppSubsidyByAppId";

  // ASSET TYPE
  // public static GetAssetTypeById = environment.FoundationR3Url + "/AssetType/GetAssetTypeById"

  // List Approver
  public static GetApprovedBy = environment.ApprovalR3Url + "/api/RFAWeb/GetApprovedBy/";
  public static GetRecommendations = environment.ApprovalR3Url + "/api/RFAWeb/GetRecommendations/";

  // PreGoLive
  public static GetListApprovedByForPreGoLive = environment.losUrl + "/PreGoLive/GetListApprovedByForPreGoLive";
  public static AddPreGoLive = environment.losUrl + "/PreGoLive/AddPreGoLive";
  public static CreateRFAPreGoLive = environment.losUrl + "/PreGoLive/CreateRFAPreGoLive";

  // Survey or Srvy
  public static GetListSrvyTaskAndOrderByTrxNoAndMrSurveySourceCode = environment.FoundationR3Url + "/SrvyTask/GetListSrvyTaskAndOrderByTrxNoAndMrSurveySourceCode";
  public static GetSrvyResultDataByTrxRefNo = environment.losUrl + "/MouCustSrvyOrder/GetSrvyResultDataByTrxRefNo";
  public static GetSrvyOrderBySrvyOrderNo = environment.FoundationR3Url + "/SrvyOrder/GetSrvyOrderBySrvyOrderNo";
  public static GetSrvyDataBySrvyOrderId = environment.FoundationR3Url + "/SrvyData/GetSrvyDataBySrvyOrderId";
  public static GetListSrvyTaskBySrvyOrderId = environment.FoundationR3Url + "/SrvyTask/GetListSrvyTaskBySrvyOrderId";

  // Workflow Engine
  public static ClaimTask = environment.FoundationR3Url + "/Workflow/ClaimTask";
  public static ClaimTaskNap = environment.losUrl + "/Application/ClaimTaskNap";

  //Application Data
  public static SaveApp = environment.losUrl + "/ApplicationData/SaveApp"
  public static ClaimListTask = environment.FoundationR3Url + "/Workflow/ClaimListTask";

  // Phone Verif
  public static GetAppPhoneVerifSubjectListByAppId = environment.losUrl + "/PhoneVerif/GetAppPhoneVerifSubjectListByAppId";
  public static GetPhoneNumberByIdSourceAppIdAndSubject = environment.losUrl + "/PhoneVerif/GetPhoneNumberByIdSourceAppIdAndSubject";
  public static GetVerfQuestionListByAppIdAndSubjectForPhoneVerif = environment.losUrl + "/PhoneVerif/GetVerfQuestionListByAppIdAndSubjectForPhoneVerif";
  // App Cust
  public static GetAppCustByAppId = environment.losUrl + "/AppCust/GetAppCustByAppId";

  //Verf Question Answer
  public static GetVerfQuestionAnswerListByVerfSchemeCode = environment.FoundationR3Url + "/VerfQuestionAnswer/GetVerfQuestionAnswerListByVerfSchemeCode"

  // App Credit Review
  public static GetAppCrdRvwById = environment.losUrl + "/AppCrdRvw/GetAppCrdRvwById";
  public static AddOrEditAppCrdRvwData = environment.losUrl + "/AppCrdRvw/AddOrEditAppCrdRvwData";

  //RETURN HANDLING
  public static GetReturnHandlingWithDetailByReturnHandlingHId = environment.losUrl + "/ReturnHandlingH/GetReturnHandlingWithDetailByReturnHandlingHId";
  public static GetReturnHandlingDByAppIdAndMrReturnTaskCode = environment.losUrl + "/ReturnHandlingD/GetReturnHandlingDByAppIdAndMrReturnTaskCode";
  public static AddReturnHandlingD = environment.losUrl + "/ReturnHandlingD/AddReturnHandlingD";
  public static EditReturnHandlingDNotesData = environment.losUrl + "/ReturnHandlingD/EditReturnHandlingDNotesData";
  public static EditReturnHandlingD = environment.losUrl + "/ReturnHandlingD/EditReturnHandlingD";
  public static RequestReturnTask = environment.losUrl + "/ReturnHandlingD/RequestReturnTask";
  public static DeleteReturnHandlingD = environment.losUrl + "/ReturnHandlingD/DeleteReturnHandlingD";
  public static ResumeReturnHandling = environment.losUrl + "/ReturnHandlingH/ResumeReturnHandling";
  // public static Test = environment.losUrl + "/ReturnHandlingD/Test";

  public static ReturnHandlingEditApp = "RTN_EDIT_APP";
  public static GetReturnHandlingDByReturnHandlingDId = environment.losUrl + "/ReturnHandlingD/GetReturnHandlingDByReturnHandlingDId";



  // Deviation Result
  public static GetListDeviationResultForDeviationDataByAppId = environment.losUrl + "/DeviationResult/GetListDeviationResultForDeviationDataByAppId";
  public static AddListManualDeviationResultByAppId = environment.losUrl + "/DeviationResult/AddListManualDeviationResultByAppId";

  // APP Mode
  public static ModeResultHandling = "ReturnHandling";

  // Upload
  public static UploadFile = environment.FoundationR3Url + "/Upload/UploadFile";

  // Download
  public static DownloadTemplate = environment.FoundationR3Url + '/Download/DownloadTemplate';
  public static GetUploadAssetMasterByUploadMonitoringNoAndTrxType = environment.FoundationR3Url + '/AssetMaster/GetUploadAssetMasterByUploadMonitoringNoAndTrxType';

  // Asset Category
    public static GetAssetCategoryById = environment.FoundationR3Url + "/AssetCategory/GetAssetCategoryById";
    
  //Agrmnt Rsv Fund
  public static GetListAgrmntReservedFundByAgrmntId = environment.losUrl + "/AgrmntReservedFund/GetListAgrmntReservedFundByAgrmntId";

  //Agrmnt Life Ins
  public static GetAgrmntLifeInsDataByAgrmntId = environment.losUrl + "/AgrmntLifeIns/GetAgrmntLifeInsDataByAgrmntId";

  //RfaLog
  public static GetRfaLogByTrxNo  = environment.FoundationR3Url + "/RfaLog/GetRfaLogByTrxNo";

  public static CompleteAppPhoneVerif = environment.losUrl + "/PhoneVerif/CompleteAppPhoneVerif";
  //Agrmnt Subsidy
  public static GetAgrmntSubsidyListByAgrmntId  = environment.losUrl + "/AgrmntSubsidy/GetAgrmntSubsidyListByAgrmntId";

  //Agrmnt Fee
  public static GetAgrmntFeeListByAgrmntId  = environment.losUrl + "/AgrmntFee/GetAgrmntFeeListByAgrmntId";

}
