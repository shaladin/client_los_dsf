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

  public static MOU_CUSTOMER_X = "CustomerX";
  public static CHANGE_MOU_REQ_ADD_COLL_X = PathConstant.CHANGE_MOU + "/RequestAddCollX";
  public static CHANGE_MOU_REQ_DETAIL_CUST_X = PathConstant.CHANGE_MOU_REQ + "/" + PathConstant.DETAIL + "/" + PathConstantX.MOU_CUSTOMER_X;
  public static CHANGE_MOU_REQ_DETAIL_CUST_TYPE_X = PathConstant.CHANGE_MOU_REQ + "/" + PathConstant.DETAIL + "/" + PathConstantX.MOU_CUSTOMER_X +  "/:MOUType";
}



