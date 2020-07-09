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

    // APP Application
    public static AddApp = environment.losUrl + "/Application/AddApp";
    public static EditApp = "/Application/EditApp";
    public static GetAppById = environment.losUrl + "/Application/GetAppById";
    public static GetAppDetailForTabAddEditAppById = environment.losUrl + "/Application/GetAppDetailForTabAddEditAppById";
    public static GetAppDetailForAppTabById = environment.losUrl + "/Application/GetAppDetailForAppTabById";
    public static AddAppFromLead = environment.losUrl + "/Application/AddAppFromLead";
    public static DataTableNAP = environment.losUrl + "/Application/DataTableNAP";
    public static GetRuleFeeAndInsFixedNAP = environment.losUrl + "/Application/GetRuleFeeAndInsFixedNAP";
    public static GetAppAndAppCustDetailByAgrmntId = environment.losUrl + "/Application/GetAppAndAppCustDetailByAgrmntId";
    public static SubmitNAP = environment.losUrl + "/Application/SubmitNAP";
    public static AddEditAppCF2W = environment.losUrl + "/Application/AddEditAppCF2W";
    public static DataTableFeeAndInsNAP = environment.losUrl + "/Application/DataTableFeeAndInsNAP";
    public static UpdateAppStepByAppId = environment.losUrl + "/Application/UpdateAppStepByAppId";
    public static CopyCancelledApp = environment.losUrl + "/Application/CopyCancelledApp";

    //App Loan Purpose
    public static AddAppLoanPurpose = environment.losUrl + "/AppLoanPurpose/AddAppLoanPurpose";
    public static EditAppLoanPurpose = environment.losUrl + "/AppLoanPurpose/EditAppLoanPurpose";
    public static GetListAppLoanPurposeByAppId = environment.losUrl + "/AppLoanPurpose/GetListAppLoanPurposeByAppId";
    public static GetAppLoanPurposeByAppLoanPurposeId = environment.losUrl + "/AppLoanPurpose/GetAppLoanPurposeByAppLoanPurposeId";
    public static DeleteAppLoanPurpose = environment.losUrl + "/AppLoanPurpose/DeleteAppLoanPurpose"

    // App Collateral
    public static GetAppCollateralRegistrationByAppId = environment.losUrl + "/AppCollateralRegistration/GetAppCollateralRegistrationByAppId";
    public static GetAppCollateralRegistrationByAgrmntId = environment.losUrl + "/AppCollateralRegistration/GetAppCollateralRegistrationByAgrmntId";

    // App Asset Suppl Emp
    //public static GetListAppAssetSupplEmpByAppAssetId = "/AppAssetSupplEmp/GetListAppAssetSupplEmpByAppAssetId";

    // App Asset
    public static GetAppAssetListByAppIdForCommision = "/AppAsset/GetAppAssetListByAppIdForCommision";
    //public static GetAppAssetByAppAssetId = "/AppAsset/GetAppAssetByAppAssetId";
    public static GetAppAssetByAppAssetIdWithSerialNoDefinition = environment.losUrl + "/AppAsset/GetAppAssetByAppAssetIdWithSerialNoDefinition";
    public static GetAppAssetByAppAssetId = environment.losUrl + "/AppAsset/GetAppAssetByAppAssetId"

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
    public static LoginURLFrontEnd = "pages/login";

}