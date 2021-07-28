import { PathConstant } from "app/shared/constant/PathConstant";

export class PathConstantX {

    //#region layout-routes
    public static LR_IMPL = "Impl";
    //#endregion
    
    //#region Common-Path
    public static CESSIE = "Cessie";
    public static PAGING = "PagingX";
    public static ADD = "AddX";
    public static DETAIL_X = PathConstant.DETAIL + "X";
    public static MONITORING = "Monitoring";
    //#endregion

    //#region Nap-Main-Data
    public static NAP1_PAGING = PathConstant.NAP1 + "/" + PathConstantX.PAGING;
    public static NAP1_ADD = PathConstant.NAP1 + "/" + PathConstantX.ADD;

    public static PGL_DETAIL_X = PathConstant.PGL + "/" + PathConstantX.DETAIL_X;
    public static DO_MULTI_ASSET_DETAIL_X = PathConstant.DO_MULTI_ASSET + "/" + PathConstantX.DETAIL_X;
    public static CUST_CONFIRM_DETAIL_X = PathConstant.CUST_CONFIRM + "/" + PathConstantX.DETAIL_X;
    //#endregion

    //#region Cessie
    public static CESSIE_MONITORING = PathConstantX.CESSIE + "/" + PathConstantX.MONITORING;
    //#endregion
}



