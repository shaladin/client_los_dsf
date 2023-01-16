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
    public static AddCustomerGroupPlafondRequestDsf = environment.losUrl + "/v1" + "/CustomerGroupPlafondDsf/AddCustomerGroupPlafondRequestDsf";
    public static AddCustomerGroupPlafondRequestDsfV2 = environment.losUrl + "/v2" + "/CustomerGroupPlafondDsf/AddCustomerGroupPlafondRequestDsf";
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
}