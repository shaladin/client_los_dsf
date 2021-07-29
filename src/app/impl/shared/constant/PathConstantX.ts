import { PathConstant } from "app/shared/constant/PathConstant";

export class PathConstantX {

    public static PAGING = "PagingX";
    public static ADD = "AddX";

    public static DETAIL_X = PathConstant.DETAIL + "X";

    //#region Nap-Main-Data
    public static NAP1_PAGING = PathConstant.NAP1 + "/" + PathConstantX.PAGING;
    public static NAP1_ADD = PathConstant.NAP1 + "/" + PathConstantX.ADD;

    public static PGL_DETAIL_X = PathConstant.PGL + "/" + PathConstantX.DETAIL_X;
    public static DO_MULTI_ASSET_DETAIL_X = PathConstant.DO_MULTI_ASSET + "/" + PathConstantX.DETAIL_X;
    public static CUST_CONFIRM_DETAIL_X = PathConstant.CUST_CONFIRM + "/" + PathConstantX.DETAIL_X;
    
    //#region MOU
    public static MOU_CUST_REQ_ADD_COLL_X = PathConstant.MOU_CUST + "/RequestAddCollX";
}



