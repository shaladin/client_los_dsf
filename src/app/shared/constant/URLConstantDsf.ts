import { environment } from "environments/environment";

export class URLConstantDsf {
    public static GetReceiptFormByCessieNo = environment.losUrl + "/ReceiptFormDsfX/GetReceiptFormByCessieNo";
    public static GenerateReceiptFormCode = environment.losUrl + "/ReceiptFormDsfX/GenerateReceiptFormCode";
    public static AddReceiptForm = environment.losUrl + "/ReceiptFormDsfX/AddReceiptFormDsfX";
    public static EditReceiptForm = environment.losUrl + "/ReceiptFormDsfX/EditReceiptFormDsfX";
    public static GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId = environment.losUrl + "/CustomerGroupPlafondDsf/GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId";
    public static AddCustomerGroupPlafondRequestDsf = environment.losUrl + "/CustomerGroupPlafondDsf/AddCustomerGroupPlafondRequestDsf";
    public static CustomerGroupPlafondApproval = environment.losUrl + "/ApprovalDsf/CustomerGroupPlafondApprovalDsf";
}