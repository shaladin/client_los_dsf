import { environment } from "environments/environment";

export class URLConstantDsf {
    public static AddNapRole = environment.losUrl + "/v1" + "/CrdRvwX/AddAppRoleIdentityX";
    public static GetCrdRvwDataRobot = environment.losUrl + "/v1" + "/CrdRvwX/GetCrdRvwDataRobotX";
    public static UpdateNotify = environment.losUrl + "/v1" + "/LeadX/UpdateLeadNotifyX";
    public static GetReceiptFormByCessieNo = environment.losUrl + "/ReceiptFormDsfX/GetReceiptFormByCessieNo";
    public static GenerateReceiptFormCode = environment.losUrl + "/ReceiptFormDsfX/GenerateReceiptFormCode";
    public static GenerateSKPCode = environment.losUrl + "/ReceiptFormDsfX/GenerateSKPCode";
    public static AddReceiptForm = environment.losUrl + "/ReceiptFormDsfX/AddReceiptFormDsfX";
    public static EditReceiptForm = environment.losUrl + "/ReceiptFormDsfX/EditReceiptFormDsfX";
    public static GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId = environment.losUrl + "/v1" + "/CustomerGroupPlafondDsf/GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId";
    public static GetExistingReturnByCustomerGroupPlafondId = environment.losUrl + "/v1" + "/CustomerGroupPlafondDsf/GetExistingReturnByCustomerGroupPlafondId";
    public static AddCustomerGroupPlafondRequestDsf = environment.losUrl + "/v1" + "/CustomerGroupPlafondDsf/AddCustomerGroupPlafondRequestDsf";
    public static EditCustomerGroupPlafondRequestDsf = environment.losUrl + "/v1" + "/CustomerGroupPlafondDsf/EditCustomerGroupPlafondRequestDsf";
    public static AddCustomerGroupPlafondRequestDsfV2 = environment.losUrl + "/v2" + "/CustomerGroupPlafondDsf/AddCustomerGroupPlafondRequestDsf";
    public static EditCustomerGroupPlafondRequestDsfV2 = environment.losUrl + "/v2" + "/CustomerGroupPlafondDsf/EditCustomerGroupPlafondRequestDsf";
    public static CustomerGroupPlafondApproval = environment.losUrl + "/ApprovalDsf/CustomerGroupPlafondApprovalDsf";
    public static GetCustomerGroupPlafondDsfByCustomerGroupPlafondId = environment.losUrl + "/v1" + "/CustomerGroupPlafondDsf/GetCustomerGroupPlafondDsfByCustomerGroupPlafondId";

    public static GetSignerRoleCode = environment.losUrl + "/DocumentDsf/GetDocSignerRoleCodeDsf";

    public static GetCessieByCessieNo = environment.losUrl + "/CessieDsf/GetCessieByCessieNo";
    public static AddCessiePaymentDueDate = environment.losUrl + "/CessieDsf/AddCessiePaymentDueDate";
    public static EditCessiePaymentDueDate = environment.losUrl + "/CessieDsf/EditCessiePaymentDueDate";

    public static GetSpvDPCDSF = environment.losUrl + "/v1" + "/CrdRvwX/GetSpvDPCDSF";
    public static AddXDAACPDSF = environment.losUrl + "/v2" + "/XDAACPDsf/AddXDAACPDSF";

    public static GetAgrmntSignerDsfByAgrmntId = environment.losUrl + "/DocumentDsf/GetAgrmntSignerDsfByAgrmntId";
    public static SubmitAgrmntSignerDsfData = environment.losUrl + "/DocumentDsf/SubmitAgrmntSignerDsfData";
    public static EditAgrmntSignerDsfData = environment.losUrl + "/DocumentDsf/EditAgrmntSignerDsfData";

    public static AddListDocumentPrintingLBByAgrmntIdDsf = environment.losUrl + "/DocumentDsf/AddListDocumentPrintingLBByAgrmntIdDsf";
    public static GetListAgrmntDocByAgrmntIdDsf = environment.losUrl + "/DocumentDsf/GetListAgrmntDocByAgrmntIdDsf";
    public static AddAgrmntDocPrintDsf = environment.losUrl + "/DocumentDsf/AddAgrmntDocPrintDsf"

    public static CheckIfCustHasOngoingAppDsf = environment.losUrl + "/AppDsf/CheckIfCustHasOngoingAppDsf";
    public static CheckIfAgrmntParentHasOngoingAppDsf = environment.losUrl + "/AppDsf/CheckIfAgrmntParentHasOngoingAppDsf";
    public static CheckIfAgrmntParentHasOngoingAppV2Dsf = environment.losUrl + "/AppDsf/CheckIfAgrmntParentHasOngoingAppV2Dsf";
    public static GetListAgrmntParentDsf = environment.losUrl + "/AppDsf/ListAgrmntParentDsf";
    public static GetListAgrmntParentUsedDsf = environment.losUrl + "/AppDsf/ListAgrmntParentUsedDsf";

    public static GetAgrmntMasterXDsf = environment.losUrl + "/AppDsf/GetAgrmntMasterXDsf";
    public static CalculatePlafondAgrmntXDsf = environment.losUrl + "/AppDsf/CalculatePlafondAgrmntXDsf";
    public static AddAgrmntMasterXDsf = environment.losUrl + "/AppDsf/AddAgrmntMasterXDsf";
    public static EditAgrmntMasterXDsf = environment.losUrl + "/AppDsf/EditAgrmntMasterXDsf";
    public static GetListAgrmntChildOsNiDsf = environment.losUrl + "/AppDsf/GetListAgrmntChildOsNiDsf";
    public static DeactivateAgrmntMasterXDsf = environment.losUrl + "/AppDsf/DeactivateAgrmntMasterXDsf";
    public static PreGoLiveApproval = environment.losUrl + "/AppDsf/PreGoLiveApprovalDsf";
    public static GoLiveApprovalX = environment.losUrl + "/AppDsf/GoLiveApprovalDsf";
    public static ApprovalDsf = environment.losUrl + "/AppDsf/ApprovalDsf";
    public static GetListAgrmntParentByCustNoX = environment.losUrl + "/AppDsf/GetListAgrmntParentByCustNoDsf";

    public static UploadFileV2 = environment.FoundationR3Url + "/UploadXDsf/UploadFileV2";
    public static GetReferencePayment = environment.losUrl + "/CessieDsf/GetReferencePayment";
    public static GetPotentialROMonitoringByUploadMonitoringNoAndTrxType = environment.losUrl + "/ROPotentialDsf/GetPotentialROMonitoringByUploadMonitoringNoAndTrxTypeDsf";
    public static GetListGenerateRoPotentialCampaign = environment.losUrl + "/RoPotentialDsf/GetListGenerateRoPotentialCampaignDsf";
    public static GetRoPotentialDataFromCampaign = environment.losUrl  + "/RoPotentialDsf/GetRoPotentialDataFromCampaignDsf";
    public static GenerateRoPotentialDataFromCampaign = environment.losUrl  + "/RoPotentialDsf/GenerateRoPotentialDataFromCampaignDsf";
    public static AddVerfResultHeaderDsf = environment.FoundationR3Url + "/VerfResultHDsf/AddVerfResultHeaderDsf";
    public static EditVerfResultHeaderDsf = environment.FoundationR3Url + "/VerfResultHDsf/EditVerfResultHeaderDsf";
    public static GetVerfResultHDsfsByVerfResultIdAndObjectCode = environment.FoundationR3Url + "/VerfResultHDsf/GetVerfResultHDsfsByVerfResultIdAndObjectCode";
    public static AddLeadDsf = environment.losUrl + "/v1" + "/LeadX/AddLeadDsf";
    public static UpdateLeadDsf = environment.losUrl + "/v1" + "/LeadX/UpdateLeadDsf";
    public static UpdateLeadStep = environment.losUrl + "/v1" + "/LeadX/UpdateLeadStep";
    public static GetLeadDsfByLeadId = environment.losUrl + "/v1" + "/LeadX/GetLeadDsfByLeadId";
    public static GetListAppLoanPurposeDsfByAppId = environment.losUrl + "/AppLoanPurposeDsf/GetListAppLoanPurposeDsfByAppId";
    public static GetAppLoanPurposeDsfByAppLoanPurposeId = environment.losUrl + "/AppLoanPurposeDsf/GetAppLoanPurposeDsfByAppLoanPurposeId";
    public static DeleteAppLoanPurposeDsf = environment.losUrl + "/AppLoanPurposeDsf/DeleteAppLoanPurposeDsf";
    public static AddAppLoanPurposeDsf = environment.losUrl + "/AppLoanPurposeDsf/AddAppLoanPurposeDsf";
    public static EditAppLoanPurposeDsf = environment.losUrl + "/AppLoanPurposeDsf/EditAppLoanPurposeDsf";
    public static ValidateGeneralByAppId = environment.losUrl + "/AppDsf/ValidateGeneralByAppIdDsf";

    public static GetCustforAgrmntMasterDsf = environment.losUrl + "/AppDsf/GetCustforAgrmntMasterDsf";
    public static GetAgrmntMasterList = environment.losUrl + "/AppDsf/GetAgrmntMasterList";
    public static CheckLMSR2APIConnection = environment.losUrl + "/AppDsf/CheckLMSR2APIConnection";
    public static GetAgrmntMasterXByAgrmntParentId = environment.losUrl + "/AppDsf/GetAgrmntMasterXByAgrmntParentId";
    public static GetInitFinDataForTrialCalcX = environment.losUrl + "/AppDsf/GetOrInitFinDataForTrialCalcDsf";

    public static GetDealerSubsidyAuto = environment.losUrl + "/AppFinDataDsf/GetDealerSubsidyAutoDsf";
    public static GetAppFinDataByAppIdDsf = environment.losUrl + "/AppFinDataDsf/GetAppFinDataByAppIdDsf";
    public static SaveNtfAmtAppFinDataDsf = environment.losUrl + "/AppFinDataDsf/SaveNtfAmtAppFinDataDsf";
    public static UpdateLeadStepStatBulkByLeadId = environment.losUrl + "/v1" + "/PubSubDsf/UpdateLeadStepStatBulkByLeadId";
    public static GetAgrmntListForCustHistDsf = environment.losUrl + "/AgrmntDsf/GetAgrmntListForCustHistDsf"; 
    public static GetAppListForCustHistDsf = environment.losUrl + "/AppDsf/GetAppListForCustHistDsf";
    public static AddEditAppCrdRvwHDsf    = environment.losUrl + "/v1/CrdRvwX/AddEditAppCrdRvwHDsf";
    public static GetAppCrdRvwHDsfByAppId = environment.losUrl + "/v1/CrdRvwX/GetAppCrdRvwHDsfByAppId";

    public static GetProvisionFeeByAppId = environment.losUrl + "/AppDsf/GetAppProvisionFeeByAppIdDsf";

    public static CheckIsNegCustAllowedCreateAppDsf = environment.FoundationR3Url + "/CustDsf/CheckIsNegCustAllowedCreateAppDsf"
    public static GetMouMainInfoByIdXDsf = environment.losUrl + "/MouCustXDsf/GetMouMainInfoByIdXDsf";
    public static GetMouCustXDsf = environment.losUrl + "/MouCustXDsf/GetMouCustXDsf";
    public static AddMouCustXDsf = environment.losUrl + "/MouCustXDsf/AddMouCustXDsf";
    public static EditMouCustXDsf = environment.losUrl + "/MouCustXDsf/EditMouCustXDsf";
    public static EditMouCustNewCalculationXDsf = environment.losUrl + "/MouCustXDsf/EditMouCustNewCalculationXDsf";
    public static SubmitReviewDsf = environment.losUrl + "/MouCustXDsf/SubmitReviewDsf";

    public static GetClaimTaskLeadDsf = environment.losUrl + "/v1" + "/LeadX/GetClaimTaskLeadDsf";
    public static AddClaimTaskLeadDsf = environment.losUrl + "/v1" + "/LeadX/AddClaimTaskLeadDsf";
    public static EditClaimTaskLeadDsf = environment.losUrl + "/v1" + "/LeadX/EditClaimTaskLeadDsf";
    public static SubmitWorkflowLeadQCV2Dsf = environment.losUrl + "/v2" + "/LeadX/SubmitWorkflowLeadQC";
    public static SimpleLeadReturnDsf = environment.losUrl + "/v2" + "/LeadX/SimpleLeadReturnDsf";
}
