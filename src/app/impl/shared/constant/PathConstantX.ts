import { PathConstant } from "app/shared/constant/PathConstant";

export class PathConstantX{

    //#region Common-Path
    public static PAGING = "PagingX";
    public static DETAIL = "DetailX";

    //#region Nap-Crd-Prcs
    public static COMM_RSV_FUND_PAGING = PathConstant.COMM_RSV_FUND + "/" + PathConstantX.PAGING;
    public static COMM_RSV_FUND_DETAIL = PathConstant.COMM_RSV_FUND + "/" + PathConstantX.DETAIL;

}