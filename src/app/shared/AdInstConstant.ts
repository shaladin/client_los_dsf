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

    // ASSET
    public static GetListKeyValueByCode = environment.FoundationR3Url + "/AssetType/GetListKeyValueByCode";

    // App
    public static AddApp = "/Application/AddApp";
    public static EditApp = "/Application/EditApp";
    public static GetAppById = "/Application/GetAppById";   
    public static EditAppAddAppCross = "/Application/EditAppAddAppCross";   

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
    public static DeleteCenterGroupOfficeMember= "/RefOffice/DeleteCenterGroupOfficeMember"; 
    public static GetListKvpActiveRefOffice= "/RefOffice/GetListKvpActiveRefOffice"; 

    //REF OFFICE AREA
    public static GetAllListArea = "/RefOfficeArea/GetAllListArea";
    public static GetRefOfficeAreaPaging = "/RefOfficeArea/GetRefOfficeAreaPaging";
    public static GetRefArea = "/RefOfficeArea/GetRefArea";
    public static AddRefOfficeArea = "/RefOfficeArea/AddRefOfficeArea";
    public static EditRefOfficeArea = "/RefOfficeArea/EditRefOfficeArea";
    public static DeleteRefOfficeArea = "/RefOfficeArea/DeleteRefOfficeArea";
    public static CheckDuplAreaCode = "/RefOfficeArea/CheckDuplAreaCode";
    // public static GetListKvpActiveRefOfficeArea = "/RefOfficeArea/GetListKvpActiveRefOfficeArea";

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


    //REF PROV DISTRICT
    public static GetRefProvDistrictPaging = "/RefProvDistrict/GetRefProvDistrictPaging";

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
    public static DeleteRefEmpLeaveMngmnt= "/RefEmpLeaveManagement/DeleteRefEmpLeaveMngmnt";
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

    // Vendor
    public static GetListVendorBankAccByVendorId= "/VendorBankAcc/GetListVendorBankAccByVendorId";
    public static GetListVendorBankAccByVendorCode= "/VendorBankAcc/GetListVendorBankAccByVendorCode";

    // MOU CUST
    public static GetMouCustById = environment.losUrl + "/MouCust/GetMouCustById";

    // MOU CUST ASSET
    public static GetMouCustAssetByMouCustId = environment.losUrl + "/MouCustAsset/GetMouCustAssetByMouCustId";

    // MOU CUST ASSET
    public static GetMouCustFeeByMouCustId = environment.losUrl + "/MouCustFee/GetMouCustFeeByMouCustId";

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

    // MOU CUST LEGAL REVIEW
    public static GetMouCustLglReviewByMouCustId = environment.losUrl + "/MouCustLglReview/GetMouCustLglReviewByMouCustId";

    // MOU CUST TC
    public static GetCustMouTcByCustMouId = environment.losUrl + "/MouCustTc/GetCustMouTcByCustMouId";
    
    // REF COUNTRY
    public static GetRefCountryByCountryCode = environment.FoundationR3Url + "/RefCountry/GetRefCountryByCountryCode";

    // REF PROFESSION
    public static GetRefProfessionByCode = environment.FoundationR3Url + "/RefProfession/GetRefProfessionByProfessionCode";

    //REF INDUSTRY TYPE
    public static GetRefIndustryTypeByCode = environment.FoundationR3Url + "/RefIndustryType/GetRefIndustryTypeByIndustryTypeCode";

    //REF CUST MODEL
    public static GetListKeyValueByMrCustTypeCode = environment.FoundationR3Url + "/RefCustModel/GetListKeyValueByMrCustTypeCode";

    //CUST
    public static GetCustByCustNo = "http://localhost:5000/Cust/GetCustByCustNo";


    //CUST DATA PERSONAL
    public static AddEditCustDataPersonal = "http://localhost:5001/AppCust/AddEditCustDataPersonal";
    public static GetCustDataByAppId = "http://localhost:5001/AppCust/GetCustDataByAppId";
    public static GetAppCustPersonalContactPersonsByAppCustPersonalId = "http://localhost:5001/AppCustPersonalContactPerson/GetAppCustPersonalContactPersonsByAppCustPersonalId";
    public static DeleteAppCustPersonalContactPerson = "http://localhost:5001/AppCustPersonalContactPerson/DeleteAppCustPersonalContactPerson";
    public static GetAppCustBankAccsByAppCustId = "http://localhost:5001/AppCustBankAcc/GetAppCustBankAccsByAppCustId";

    //CUST DATA COMPANY
    public static AddEditCustDataCompany = "http://localhost:5001/AppCust/AddEditCustDataCompany";


    //APP ASSET
    public static GetAppAssetListByAgrmntId = environment.losUrl + "/AppAsset/GetAppAssetListByAgrmntId";
    public static GetAppAssetByAppId = environment.losUrl + "/AppAsset/GetAppAssetByAppId";
    public static GetAppAssetListByAppId = environment.losUrl + "/AppAsset/GetAppAssetListByAppId";
    public static GetAllAssetDataForPOByAsset = environment.losUrl + "/AppAsset/GetAllAssetDataForPOByAsset";
    

    //PURCHASE ORDER
    public static SubmitPurchaseOrder = environment.losUrl + "/PurchaseOrderH/SubmitPurchaseOrder";
    
}
