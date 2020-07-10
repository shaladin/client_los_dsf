import { environment } from "environments/environment";

export class URLConstant {
  public static GetRefMasterByMasterCode = environment.FoundationR3Url + "/RefMaster/GetRefMasterByMasterCode";
  public static GetRefMasterByRefMasterTypeCode = environment.FoundationR3Url + "/RefMaster/GetRefMasterByRefMasterTypeCode"
  public static GetListRefMasterByRefMasterTypeCodes = environment.FoundationR3Url + "/RefMaster/GetListRefMasterByRefMasterTypeCodes";

}