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
}