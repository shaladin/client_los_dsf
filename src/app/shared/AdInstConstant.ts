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

  //LOB CODE
  public static LobCodeRFN4W = "RFN4W";

  // ASSET
  public static GetListKeyValueByCode = environment.FoundationR3Url + "/AssetType/GetListKeyValueByCode";

  // App
  public static AddApp = "/Application/AddApp";
  public static EditApp = "/Application/EditApp";
  public static GetAppById = "/Application/GetAppById";  
  public static GetAppByIds = environment.losUrl + "/Application/GetAppById"; 
  public static EditAppAddAppCross = "/Application/EditAppAddAppCross";  
  
  // App Asset
  public static GetAppAssetListByAppIdForCommision = "/AppAsset/GetAppAssetListByAppIdForCommision";
  public static GetListAppAssetSupplEmpByListAppAssetId = "/AppAssetSupplEmp/GetListAppAssetSupplEmpByListAppAssetId";

  // App Referantor
  public static AddAppReferantor = "/AppReferantor/AddAppReferantor";
  public static EditAppReferantor = "/AppReferantor/EditAppReferantor";
  public static DeleteAppReferantor = "/AppReferantor/DeleteAppReferantor";
  public static GetAppReferantorByAppReferantorId = "/AppReferantor/GetAppReferantorByAppReferantorId";
  public static GetAppReferantorByAppId = "/AppReferantor/GetAppReferantorByAppId";
  
  // App Cross
  public static GetAppCrossByCrossAgrmntNo = "/AppCross/GetAppCrossByCrossAgrmntNo";
  public static DeleteAppCross = "/AppCross/DeleteAppCross";
  public static GetListAppCross = "/AppCross/GetListAppCross";
  public static AddListAppCross = "/AppCross/AddListAppCross";
  
  // Ref App Src
  public static GetListKvpActiveRefAppSrc = "/RefAppSrc/GetListKvpActiveRefAppSrc";


  public static RestrictionLike = "Like";
  public static RestrictionEq = "Eq";
  public static RestrictionNeq = "NEQ";
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
  public static GetRefOfficeByOfficeCode = environment.FoundationR3Url + "/RefOffice/GetRefOfficeByOfficeCode";

  //CUST TYPE
  public static CustTypePersonal = "PERSONAL";
  public static CustTypeCompany = "COMPANY";
  
  //Asset Master
  public static GetAssetMasterTypeByFullAssetCode = "http://localhost:5000/AssetMaster/GetAssetMasterTypeByFullAssetCode";
  
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
  
  //COVER PERIOD
  public static CoverPeriodAnnually = "AN";
  public static CoverPeriodFullTenor = "FT";
  public static CoverPeriodPartialTenor = "PT";
  public static CoverPeriodOverTenor = "OT";
  
  //PREMIUM TYPE
  public static PremiumTypeAmt = "AMT";
  public static PremiumTypePrcnt = "PRCNT";

  //GENERAL SETTING
  public static GetBusinessDt = "/GeneralSetting/GetBusinessDate";
  public static AddGeneralSetting = "/GeneralSetting/AddGeneralSetting";
  public static EditGeneralSetting = "/GeneralSetting/EditGeneralSetting";
  public static GetGeneralSettingPaging = "/GeneralSetting/GetGeneralSettingPaging";
  public static GetGeneralSettingById = "/GeneralSetting/GetGeneralSettingById";
  public static GetGeneralSettingValue = "/GeneralSetting/GetGeneralSettingValue";


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
  public static GetListActiveRefPayFreq = "/RefPayFreq/GetListActiveRefPayFreq"; 

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
  public static GetRefCoy = "/RefCoy/GetRefCoy";
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
  public static GetListActiveRefMaster = environment.FoundationR3Url + "/RefMaster/GetListActiveRefMaster";
  public static GetListActiveRefMasterWithReserveFieldAll = environment.FoundationR3Url + "/RefMaster/GetListActiveRefMasterWithReserveFieldAll";
  public static GetRefMasterByRefMasterTypeCode = environment.FoundationR3Url + "/RefMaster/GetRefMasterByRefMasterTypeCode"

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
  public static AddLead = environment.losUrl + "/Lead/AddLead";
  public static EditLead = environment.losUrl + "/Lead/EditLead";
  public static DeleteLead = environment.losUrl + "/Lead/DeleteLead";
  public static GetLeadByLeadId = environment.losUrl + "/Lead/GetLeadByLeadId";
  public static GetLeadByLeadNo = environment.losUrl + "/Lead/GetLeadByLeadNo";
  public static GetLeadForUpdateByLeadId = environment.losUrl + "/Lead/GetLeadForUpdateByLeadId";
  public static GetLeadForUpdateByLeadNo = environment.losUrl + "/Lead/GetLeadForUpdateByLeadNo";
 
  //GUARANTOR
  public static GetListAppGuarantor = environment.losUrl + "/AppGuarantor/GetListAppGuarantor"
  public static AddAppGuarantorPersonal = environment.losUrl + "/AppGuarantor/AddAppGuarantorPersonal"
  public static AddAppGuarantorCompany = environment.losUrl + "/AppGuarantor/AddAppGuarantorCompany"
  public static GetAppGuarantorPersonalByAppGuarantorId = environment.losUrl + "/AppGuarantor/GetAppGuarantorPersonalByAppGuarantorId"
  public static GetAppGuarantorCompanyByAppGuarantorId = environment.losUrl + "/AppGuarantor/GetAppGuarantorCompanyByAppGuarantorId"
  public static EditAppGuarantorPersonal = environment.losUrl + "/AppGuarantor/EditAppGuarantorPersonal"
  public static EditAppGuarantorCompany = environment.losUrl + "/AppGuarantor/EditAppGuarantorCompany"
  public static DeleteAppGuarantor = environment.losUrl + "/AppGuarantor/DeleteAppGuarantor"
 
  // Vendor
  public static GetListVendorBankAccByVendorId = "/VendorBankAcc/GetListVendorBankAccByVendorId";
  public static GetListVendorBankAccByVendorCode = "/VendorBankAcc/GetListVendorBankAccByVendorCode";
  public static GetListKeyValueByCategoryCodeAndOfficeCode = environment.losUrl + "/Vendor/GetListKeyValueByCategoryCodeAndOfficeCode";
  public static GetVendorByVendorCode = environment.FoundationR3Url + "/Vendor/GetVendorByVendorCode";
  public static GetListVendorEmpByVendorId = environment.FoundationR3Url + "/VendorEmp/GetListVendorEmpByVendorId";
  public static GetListVendorEmpByVendorIdAndPositionCodes = environment.losUrl + "/VendorEmp/GetListVendorEmpByVendorIdAndPositionCodes";
  public static GetVendorEmpSupervisorByVendorEmpId = environment.losUrl + "/VendorEmp/GetVendorEmpSupervisorByVendorEmpId";
  public static GetVendorEmpByVendorIdVendorEmpNo = environment.losUrl + "/VendorEmp/GetVendorEmpByVendorIdVendorEmpNo";
 
  // VendorEmp
  public static GetListVendorBankByVendorEmpNo = "/VendorEmp​/GetListVendorBankByVendorEmpNo";
  public static GetVendorByCategoryCodeAndOfficeCode = environment.FoundationR3Url + "/Vendor/GetVendorByCategoryCodeAndOfficeCode";
  public static GetListVendorBankAccByListVendorEmpNo = "/VendorEmp/GetListVendorBankAccByListVendorEmpNo";
  public static GetVendorEmpByVendorEmpNo = "/VendorEmp/GetVendorEmpByVendorEmpNo";
 
  //Life Ins
  public static AddAppLifeInsH = environment.losUrl + "/AppLifeIns/AddAppLifeInsH";
  public static EditAppLifeInsH = environment.losUrl + "/AppLifeIns/EditAppLifeInsH";
  public static InitAppLifeInsH = environment.losUrl + "/AppLifeIns/InitAppLifeInsH";
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

  // MOU CUST ASSET
  public static GetMouCustAssetByMouCustId = environment.losUrl + "/MouCustAsset/GetMouCustAssetByMouCustId";
  public static AddMouCustAsset = environment.losUrl + "/MouCustAsset/AddMouCustAsset";
  public static DeleteMouCustAsset = environment.losUrl + "/MouCustAsset/DeleteMouCustAsset";
  public static GetAssetTypeKeyValueCode = environment.FoundationR3Url + "/AssetType/GetListKeyValueByCode";

  // MOU CUST ASSET
  public static GetMouCustFeeByMouCustId = environment.losUrl + "/MouCustFee/GetMouCustFeeByMouCustId";
  public static GetListMouCustFeeByMouCustId = environment.losUrl +"/MouCustFee/GetListMouCustFeeByMouCustId";
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
  
  public static GetListMouCustRvwD =   environment.losUrl + "/MouCustRvwD/GetListMouCustRvwD"
  // MOU CUST LEGAL REVIEW
  public static GetMouCustLglReviewByMouCustId = environment.losUrl + "/MouCustLglReview/GetMouCustLglReviewByMouCustId";
  public static AddRangeMouCustLglReview = environment.losUrl + "/MouCustLglReview/AddRangeMouCustLglReview";
  
  // MOU CUST TC
  public static GetCustMouTcByCustMouId = environment.losUrl + "/MouCustTc/GetCustMouTcByCustMouId";
  public static GetMouCustTcForMouLglByCustMouId = environment.losUrl + "/MouCustTc/GetMouCustTcForMouLglByCustMouId";
  public static EditListMouCustTc = environment.losUrl + "/MouCustTc/EditListMouCustTc";
  
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
  
  //REF CUST MODEL
  public static GetListKeyValueByMrCustTypeCode = environment.FoundationR3Url + "/RefCustModel/GetListKeyValueByMrCustTypeCode";
  
  //CUST
  public static GetCustByCustNo = environment.FoundationR3Url + "/Cust/GetCustByCustNo";
  public static GetCustPersonalForCopyByCustId = environment.FoundationR3Url + "/Cust/GetCustPersonalForCopyByCustId";
  public static GetCustCompanyForCopyByCustId = environment.FoundationR3Url + "/Cust/GetCustCompanyForCopyByCustId";
  public static GetCustPersonalForCopyMgmntShrholderByCustId = environment.FoundationR3Url + "/Cust/GetCustPersonalForCopyMgmntShrholderByCustId";
  public static GetCustCompanyForCopyMgmntShrholderByCustId = environment.FoundationR3Url + "/Cust/GetCustCompanyForCopyMgmntShrholderByCustId";

  // CUST DATA PERSONAL
  public static AddEditCustDataPersonal = environment.losUrl + "/AppCust/AddEditCustDataPersonal";
  public static GetCustDataByAppId = environment.losUrl + "/AppCust/GetCustDataByAppId";
  public static GetAppCustPersonalContactPersonsByAppCustPersonalId = environment.losUrl + "/AppCustPersonalContactPerson/GetAppCustPersonalContactPersonsByAppCustPersonalId";
  public static DeleteAppCustPersonalContactPerson = environment.losUrl + "/AppCustPersonalContactPerson/DeleteAppCustPersonalContactPerson";
  public static GetAppCustBankAccsByAppCustId = environment.losUrl + "/AppCustBankAcc/GetAppCustBankAccsByAppCustId";
  public static GetAppCustPersonalDataAndSpouseByAppId = environment.losUrl + "/AppCust/GetAppCustPersonalDataAndSpouseByAppCustId";

  // CUST DATA COMPANY
  public static AddEditCustDataCompany = environment.losUrl + "/AppCust/AddEditCustDataCompany";
  
  // APP TC
  public static GetListTCbyAppId = environment.losUrl + "/AppTc/GetListTCbyAppId";
  
  // PURCHASE ORDER
  public static SubmitPurchaseOrder = environment.losUrl + "/PurchaseOrderH/SubmitPurchaseOrder";

  // REF LOB
  public static GetListActiveLob = environment.FoundationR3Url + "/RefLob/GetListKeyValueActiveByCode";
  
  // Rule
  public static Rule = "http://r3app-server/RULE_FINAL/RuleService/ExecuteRuleSet";

  // Tax
  public static AppCom = "APP_COM";
  public static ExchangeRateAmt = "1";
  public static TaxTypeCode = "WHT";
  public static VATTypeCode = "VAT";

  // App Commission
  public static AddAppCommissionData = "/AppCommission/AddAppCommissionData";
  public static GetAppCommissionRule = "/AppCommission/GetAppCommissionRule";
  public static GetAppCommissionTax = "/AppCommission/GetAppCommissionTax";

  // App Asset
  public static GetAppAssetListByAgrmntId = environment.losUrl + "/AppAsset/GetAppAssetListByAgrmntId";
  public static GetAppAssetByAppId = environment.losUrl + "/AppAsset/GetAppAssetByAppId";
  public static GetAppAssetListByAppId = environment.losUrl + "/AppAsset/GetAppAssetListByAppId";
  public static GetAllAssetDataForPOByAsset = environment.losUrl + "/AppAsset/GetAllAssetDataForPOByAsset";
  public static GetAppAssetByAgrmntId = environment.losUrl + "/AppAsset/GetAppAssetByAgrmntId";
  public static GetAllAssetDataByAppId = environment.losUrl + "/AppAsset/GetAllAssetDataByAppId";
  public static AddEditAllAssetData = environment.losUrl + "/AppAsset/AddEditAllAssetData";
  public static GetAppAssetDataByAppId = environment.losUrl + "/AppAsset/GetAppAssetDataByAppId";

  //Asset Doc List
  public static GetListAssetDocListByAssetTypeCode = environment.FoundationR3Url + "/AssetDocList/GetListAssetDocListByAssetTypeCode";

  //AGRMNT SIGNER
  public static SubmitAgrmntSignerData = environment.losUrl + "/AgrmntSigner/SubmitAgrmntSignerData";
  public static EditAgrmntSignerData = environment.losUrl + "/AgrmntSigner/EditAgrmntSignerData";
  public static GetAgrmntSignerByAgrmntId = environment.losUrl + "/AgrmntSigner/GetAgrmntSignerByAgrmntId";

  
  //LEAD VERF
  public static AddRangeLeadVerf = environment.losUrl + "/LeadVerf/AddRangeLeadVerf";
  public static GetListLeadVerf = environment.losUrl + "/LeadVerf/GetListLeadVerf";

  //DELIVERY ORDER
  public static SubmitDeliveryOrderData = environment.losUrl + "/DeliveryOrder/SubmitDeliveryOrderData";
  public static GetRefAssetDocList = environment.losUrl + "/DeliveryOrder/GetRefAssetDocList";
  
  //APP TC
  public static CreateTCRule = environment.losUrl + "/AppTc/CreateTCRule";
  public static SubmitOutstandingTc = environment.losUrl + "/AppTc/SubmitOutstandingTc";

  //AGRMNT
  public static GetAgrmntByAgrmntId = environment.losUrl + "/Agrmnt/GetAgrmntByAgrmntId";
  public static GetAgrmntByAppId = environment.losUrl + "/Agrmnt/GetAgrmntByAppId";
  //REF TC
  public static GetRefTcByCode = environment.FoundationR3Url + "/RefTc/GetRefTcByCode";
  public static GetListRefTcByTcCode = environment.FoundationR3Url + "/RefTc/GetListRefTcByTcCode";

  //PURCHASE ORDER
  public static ResumeWorkflowPurchaseOrder = environment.losUrl + "/PurchaseOrderH/ResumeWorkflowPurchaseOrder";

  //APP INSURANCE
  public static GetInsuranceDataByAppId = environment.losUrl + "/AppIns/GetInsDataByAppId";
  public static AddEditInsuranceData = environment.losUrl + "/AppIns/AddEditInsuranceData";
  public static ExecuteInsRateRule = environment.losUrl + "/AppIns/ExecuteInsRateRule";
  public static CalculateInsurance = environment.losUrl + "/AppIns/CalculateInsurance";

  //AGREEMENT DOC
  public static GetListAgrmntDocByAgrmntId = environment.losUrl + "/AgrmntDoc/GetListAgrmntDocByAgrmntId"
  public static GetAgrmntDocDataByAgrmntDocId = environment.losUrl + "/AgrmntDoc/GetAgrmntDocDataByAgrmntDocId"
  public static EditAgrmntDoc = environment.losUrl + "/AgrmntDoc/EditAgrmntDoc"

  //AGREEMENT DOC PRINT
  public static AddAgrmntDocPrint = environment.losUrl + "/AgrmntDocPrint/AddAgrmntDocPrint"

  //PURCHASE ORDER EXTENSION
  public static SubmitNewExpDate = environment.losUrl + "/PurchaseOrderH/SubmitNewExpDate";

  // VERF RESULT
  public static GetVerfResultById = environment.FoundationR3Url + "/VerfResult/GetVerfResultById";
  public static AddVerfResultAndVerfResultH = environment.FoundationR3Url + "/VerfResult/AddVerfResultAndVerfResultH";
  public static GetVerfResultHById = environment.FoundationR3Url + "/VerfResultH/GetVerfResultHById";
  public static GetVerfResultHsByTrxRefNo = environment.FoundationR3Url + "/VerfResultH/GetVerfResultHsByTrxRefNo";
  public static GetVerfResultHsByVerfResultIdAndSubjRelationCode = environment.FoundationR3Url + "/VerfResultH/GetVerfResultHsByVerfResultIdAndSubjRelationCode";
  public static GetListVerfResultDInQuestionGrp = environment.FoundationR3Url + "/VerfResultD/GetListVerfResultDInQuestionGrp";
  public static AddVerfResultHeaderAndVerfResultDetail = environment.FoundationR3Url + "/VerfResultH/AddVerfResultHeaderAndVerfResultDetail";

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
  public static GetListAppInvoiceFctrByAppFctrId = environment.losUrl + "/AppInvoiceFctr/GetListAppInvoiceFctrByAppFctrId"


  //AppCustAddr
  public static GetListAppCustAddrByAppId = environment.losUrl + "/AppCustAddr/GetListAppCustAddrByAppId";

  //Asset Accessory
  public static GetAssetAccessoryByCode = environment.FoundationR3Url + "/AssetAccessory/GetAssetAccessoryByCode";

  //App Fee
  public static GetListAppFeeByAppId = environment.losUrl + "/AppFee/GetListAppFeeByAppId";

  //App Reserved Fund
  public static AddEditAppReservedFund = environment.losUrl + "/AppReservedFund/AddEditAppReservedFund";
  public static GetListAppReservedFundByAppId = environment.losUrl + "/AppReservedFund/GetListAppReservedFundByAppId";
  public static CreateRsvFundRule = environment.losUrl + "/AppReservedFund/CreateRsvFundRule";

  //App Fin Data
  public static GetAppFinDataByAppId = environment.losUrl + "/AppFinData/GetAppFinDataByAppId";
  public static CreateMaxAllocAmtRsvFund = environment.losUrl + "/AppFinData/CreateMaxAllocAmtRsvFund";
  public static GetAppFinDataWithRuleByAppId = "/AppFinData/GetAppFinDataWithRuleByAppId";

  //App Duplicate Checking
  public static GetCustomerDuplicateCheck = "/CustDuplicateCheck/GetCustomerDuplicateCheck";
  public static GetNegativeCustomerDuplicateCheck = "/CustDuplicateCheck/GetNegativeCustomerDuplicateCheck";
  public static GetAppCustDuplicateCheck = "/AppDupCheck/GetAppCustDuplicateCheck";
  public static GetAppGuarantorDuplicateCheck = "/AppDupCheck/GetAppGuarantorDuplicateCheck";
  public static GetSpouseDuplicateCheck = "/AppDupCheck/GetSpouseDuplicateCheck";
  public static GetAppShareholderDuplicateCheck = "/AppDupCheck/GetAppShareholderDuplicateCheck";
  public static AddAppDupCheckCust = "/AppDupCheck/AddAppDupCheckCust";

  // Product Offering
  public static GetListProdOfferingDByProdOfferingCode = "/ProductOffering/GetListProdOfferingDByProdOfferingCode";
  public static GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode = "/ProductOffering/GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode";

  // PreGoLive
  public static GetListApprovedByForPreGoLive = environment.losUrl + "/PreGoLive/GetListApprovedByForPreGoLive";
  public static AddPreGoLive = environment.losUrl + "/PreGoLive/AddPreGoLive"
}
