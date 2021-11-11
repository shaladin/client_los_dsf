import { AdInsConstant } from "app/shared/AdInstConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CriteriaObj } from "app/shared/model/criteria-obj.model";
import { InputAddressObj } from "app/shared/model/input-address-obj.model";
import { InputFieldObj } from "app/shared/model/input-field-obj.model";
import { InputLookupObj } from "app/shared/model/input-lookup-obj.model";
import { UcDropdownListObj } from "app/shared/model/library/uc-dropdown-list-obj.model";
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from "app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model";
import { UcAddressObj } from "app/shared/model/uc-address-obj.model";

export class CustSetData {

  public static BindSetLegalAddr(): InputAddressObj {
    let inputFieldObj = new InputFieldObj();
    inputFieldObj.inputLookupObj = new InputLookupObj();
    let inputAddressObj = new InputAddressObj();
    inputAddressObj.showSubsection = false;
    inputAddressObj.title = "Customer Address";
    inputAddressObj.default = new UcAddressObj();
    inputAddressObj.inputField = inputFieldObj;
    inputAddressObj.showAllPhn = false;

    return inputAddressObj;
  }

  public static BindLookupPositionSlik(): InputLookupObj {
    let inputLookupObjName = new InputLookupObj();
    inputLookupObjName.urlJson = "./assets/uclookup/customer/lookupPositionSlik.json";
    inputLookupObjName.pagingJson = "./assets/uclookup/customer/lookupPositionSlik.json";
    inputLookupObjName.genericJson = "./assets/uclookup/customer/lookupPositionSlik.json";
    return inputLookupObjName;
  }

  public static BindLookupExistingCust(CustId: number, listCustNoToExclude: Array<string>, MrCustTypeCode: string): InputLookupObj {
    let existingCustomerLookUpObj = new InputLookupObj();
    existingCustomerLookUpObj.isReadonly = false;
    existingCustomerLookUpObj.urlJson = "./assets/lookup/lookupExistingCustomer.json";
    existingCustomerLookUpObj.pagingJson = "./assets/lookup/lookupExistingCustomer.json";
    existingCustomerLookUpObj.genericJson = "./assets/lookup/lookupExistingCustomer.json";

    existingCustomerLookUpObj.addCritInput = this.ResetCriteriaExisting(CustId, listCustNoToExclude, MrCustTypeCode);
    if (CustId == 0) existingCustomerLookUpObj.isReady = true;
    return existingCustomerLookUpObj;
  }

  public static ResetCriteriaExisting(CustId: number, listCustNoToExclude: Array<string>, MrCustTypeCode: string, IsMarried: boolean = false, ParentGenderCode: string = ""): Array<CriteriaObj> {
    let criteriaListCust = new Array();
    if (listCustNoToExclude.length > 0) {

      let criteriaCustObj = new CriteriaObj();
      criteriaCustObj.DataType = "text";
      criteriaCustObj.restriction = AdInsConstant.RestrictionNotIn;
      criteriaCustObj.propName = 'C.CUST_NO';
      criteriaCustObj.listValue = listCustNoToExclude;
      criteriaListCust.push(criteriaCustObj);
    }
    if (CustId != 0 || CustId == null) {
      let criteriaCustObj = new CriteriaObj();
      criteriaCustObj.DataType = "text";
      criteriaCustObj.restriction = AdInsConstant.RestrictionNeq;
      criteriaCustObj.propName = 'C.CUST_ID';
      criteriaCustObj.value = CustId.toString();
      criteriaListCust.push(criteriaCustObj);
    }

    if(IsMarried){
      let criteriaCustObj = new CriteriaObj();
      criteriaCustObj.DataType = "text";
      criteriaCustObj.restriction = AdInsConstant.RestrictionEq;
      criteriaCustObj.propName = 'CP.MR_MARITAL_STAT_CODE';
      criteriaCustObj.value = CommonConstant.MaritalStatusMarried;
      criteriaListCust.push(criteriaCustObj);

      // criteriaCustObj = new CriteriaObj();
      // criteriaCustObj.DataType = "text";
      // criteriaCustObj.restriction = AdInsConstant.RestrictionEq;
      // criteriaCustObj.propName = 'CP.MR_GENDER_CODE';
      // criteriaCustObj.value = ParentGenderCode == CommonConstant.GENDER_MALE ? CommonConstant.GENDER_FEMALE : CommonConstant.GENDER_MALE;
      // criteriaListCust.push(criteriaCustObj);
    }

    let criteriaCustObj = new CriteriaObj();
    criteriaCustObj.DataType = "text";
    criteriaCustObj.restriction = AdInsConstant.RestrictionEq;
    criteriaCustObj.propName = 'MR_CUST_TYPE_CODE';
    criteriaCustObj.value = MrCustTypeCode;
    criteriaListCust.push(criteriaCustObj);

    return criteriaListCust;
  }
  
  public static initDdlRefMaster(refMasterTypeCode: string, mappingCode: string = null, isSelectOutput: boolean = false, apiUrl: string = URLConstant.GetListActiveRefMaster): UcDropdownListObj {
    let tempDdlObj: UcDropdownListObj = new UcDropdownListObj();
    let ReqRefMasterObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
      RefMasterTypeCode: refMasterTypeCode,
      MappingCode: mappingCode
    };
    tempDdlObj.apiUrl = apiUrl;
    tempDdlObj.requestObj = ReqRefMasterObj;
    tempDdlObj.isSelectOutput = isSelectOutput;
    if (apiUrl == URLConstant.GetListActiveRefMaster) {
      tempDdlObj.customKey = "MasterCode";
      tempDdlObj.customValue = "Descr";
    }
    tempDdlObj.isReady = true;
    return tempDdlObj;
  }
}