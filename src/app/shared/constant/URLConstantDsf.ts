import { environment } from "environments/environment";

export class URLConstantDsf {
    public static AddNapRole = environment.losUrl + "/CrdRvwX/AddAppRoleIdentityX";

    public static GetCrdRvwDataRobot = environment.losUrl + "/CrdRvwX/GetCrdRvwDataRobotX";
    public static GetReceiptFormByCessieNo = environment.losUrl + "/ReceiptFormDsfX/GetReceiptFormByCessieNo";
    public static GenerateReceiptFormCode = environment.losUrl + "/ReceiptFormDsfX/GenerateReceiptFormCode";
    public static AddReceiptForm = environment.losUrl + "/ReceiptFormDsfX/AddReceiptFormDsfX";
    public static EditReceiptForm = environment.losUrl + "/ReceiptFormDsfX/EditReceiptFormDsfX";
}