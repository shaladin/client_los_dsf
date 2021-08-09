import { environment } from "environments/environment";

export class URLConstantDsf {
    public static AddNapRole = environment.losUrl + "/CrdRvwX/AddAppRoleIdentityX";

    public static GetCrdRvwDataRobot = environment.losUrl + "/CrdRvwX/GetCrdRvwDataRobotX";

    public static UpdateNotify = environment.losUrl + "/LeadX/UpdateLeadNotifyX";
    public static GetReceiptFormByCessieNo = environment.losUrl + "/ReceiptFormDsfX/GetReceiptFormByCessieNo";
    public static GenerateReceiptFormCode = environment.losUrl + "/ReceiptFormDsfX/GenerateReceiptFormCode";
    public static AddReceiptForm = environment.losUrl + "/ReceiptFormDsfX/AddReceiptFormDsfX";
    public static EditReceiptForm = environment.losUrl + "/ReceiptFormDsfX/EditReceiptFormDsfX";
    public static GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId = environment.losUrl + "/CustomerGroupPlafondDsf/GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId";
    public static AddCustomerGroupPlafondRequestDsf = environment.losUrl + "/CustomerGroupPlafondDsf/AddCustomerGroupPlafondRequestDsf";
    public static CustomerGroupPlafondApproval = environment.losUrl + "/ApprovalDsf/CustomerGroupPlafondApprovalDsf";
    public static GetCustomerGroupPlafondDsfByCustomerGroupPlafondId = environment.losUrl + "/CustomerGroupPlafondDsf/GetCustomerGroupPlafondDsfByCustomerGroupPlafondId";

    public static GetSignerRoleCode = environment.losUrl + "/DocumentDsf/GetDocSignerRoleCodeDsf";
}