import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustOtherInfoObj } from 'app/shared/model/AppCustOtherInfoObj.model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-other-info-tab',
  templateUrl: './other-info-tab.component.html'
})
export class OtherInfoTabComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder) { 

      this.route.queryParams.subscribe(params => {
         
        if (params['AppCustId'] != null) {
          this.AppCustId = params['AppCustId'];
        }
      });
    }
  OtherInformationForm = this.fb.group({
    LbppmsBizSclLbppCode: ['', [Validators.required]],
    LbppmsBizSustainLbppCode: ['', [Validators.required]],
    LbppmsCntrprtLbppCode: ['', [Validators.required]],
    LbppmsDebtGrpLbppCode: ['', [Validators.required]],
    LbppmsCntrprtLbppDescr: ['', [Validators.required]],
    LbppmsDebtGrpLbppDescr: ['', [Validators.required]],
    LbppmsBizSustainLbppDescr: ['', [Validators.required]],
    LbppmsBizSclLbppDescr: ['', [Validators.required]]
  }); 

  @Input() CustTypeCode: string;
  InputDebitorGroupLookupObj : InputLookupObj;
  InputDebitorBusinessScaleLookupObj: InputLookupObj;
  InputCounterpartCategoryLookupObj: InputLookupObj;
  InputSustaianableFinancialBusinessLookupObj: InputLookupObj;
  IsLookupReady: boolean;
  AppCustId : number;
  ListAttrContent: any;
  RefAttrList: any;
  ListInputLookUpObj = new Array(); 
  IsFormReady: boolean = false;
  attrGroup: string;
  ResponseCustOtherInfo : any;
  appCustOtherInfo : AppCustOtherInfoObj;
  async ngOnInit() {
    this.attrGroup = this.CustTypeCode == CommonConstant.CustTypeCompany ? CommonConstant.AttrGroupCustCompanyOther:CommonConstant.AttrGroupCustPersonalOther;
 
    
   
    
    var AppcustOtherInfo = {
        AppCustId : this.AppCustId
      } 
    await this.httpClient.post(URLConstant.GetAppCustOtherInfoByAppCustId, AppcustOtherInfo).toPromise().then(
      (response: any) => {
        this.ResponseCustOtherInfo = response;
      });
  
      this.InputDebitorGroupLookupObj = new InputLookupObj();
      this.InputDebitorGroupLookupObj.urlJson = "./assets/uclookup/lookupDebitorGroup.json";
      this.InputDebitorGroupLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
      this.InputDebitorGroupLookupObj.urlEnviPaging = environment.FoundationR3Url;
      this.InputDebitorGroupLookupObj.pagingJson = "./assets/uclookup/lookupDebitorGroup.json";
      this.InputDebitorGroupLookupObj.genericJson = "./assets/uclookup/lookupDebitorGroup.json";
      this.InputDebitorGroupLookupObj.isReady = true;
  
      this.InputDebitorBusinessScaleLookupObj = new InputLookupObj(); 
      this.InputDebitorBusinessScaleLookupObj.urlJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
      this.InputDebitorBusinessScaleLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
      this.InputDebitorBusinessScaleLookupObj.urlEnviPaging = environment.FoundationR3Url;
      this.InputDebitorBusinessScaleLookupObj.pagingJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
      this.InputDebitorBusinessScaleLookupObj.genericJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
      this.InputDebitorBusinessScaleLookupObj.isReady = true;
      
      this.InputCounterpartCategoryLookupObj = new InputLookupObj(); 
      this.InputCounterpartCategoryLookupObj.urlJson = "./assets/uclookup/lookupCounterpartCategory.json";
      this.InputCounterpartCategoryLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
      this.InputCounterpartCategoryLookupObj.urlEnviPaging = environment.FoundationR3Url;
      this.InputCounterpartCategoryLookupObj.pagingJson = "./assets/uclookup/lookupCounterpartCategory.json";
      this.InputCounterpartCategoryLookupObj.genericJson = "./assets/uclookup/lookupCounterpartCategory.json";
      this.InputCounterpartCategoryLookupObj.isReady = true;
  
      this.InputSustaianableFinancialBusinessLookupObj = new InputLookupObj();
      this.InputSustaianableFinancialBusinessLookupObj.urlJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
      this.InputSustaianableFinancialBusinessLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
      this.InputSustaianableFinancialBusinessLookupObj.urlEnviPaging = environment.FoundationR3Url;
      this.InputSustaianableFinancialBusinessLookupObj.pagingJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
      this.InputSustaianableFinancialBusinessLookupObj.genericJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
      this.InputSustaianableFinancialBusinessLookupObj.isReady = true;

      if (this.ResponseCustOtherInfo.AppCustOtherInfoId != null) {

        this.InputDebitorGroupLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsDebtGrpLbppDescr };
        this.InputDebitorBusinessScaleLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsBizSclLbppDescr };
        this.InputCounterpartCategoryLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsCntrprtLbppDescr };
        this.InputSustaianableFinancialBusinessLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsBizSustainLbppDescr };
  
        this.OtherInformationForm.patchValue({
          LbppmsDebtGrpLbppCode: this.ResponseCustOtherInfo.LbppmsDebtGrpLbppCode,
          LbppmsCntrprtLbppCode: this.ResponseCustOtherInfo.LbppmsCntrprtLbppCode,
          LbppmsBizSustainLbppCode: this.ResponseCustOtherInfo.LbppmsBizSustainLbppCode,
          LbppmsBizSclLbppCode: this.ResponseCustOtherInfo.LbppmsBizSclLbppCode,
          LbppmsCntrprtLbppDescr: this.ResponseCustOtherInfo.LbppmsCntrprtLbppDescr,
          LbppmsDebtGrpLbppDescr: this.ResponseCustOtherInfo.LbppmsDebtGrpLbppDescr,
          LbppmsBizSustainLbppDescr: this.ResponseCustOtherInfo.LbppmsBizSustainLbppDescr,
          LbppmsBizSclLbppDescr: this.ResponseCustOtherInfo.LbppmsBizSclLbppDescr
        });
      }
      this.IsLookupReady = true;
 
    var AttrContent = {
      AppCustId: this.AppCustId,
      AttrGroup: this.attrGroup
    };

    await this.httpClient.post(URLConstant.GetListAppCustAttrContentByAppCustIdAndAttrGroup, AttrContent).toPromise().then(
      (response) => {
        this.ListAttrContent = response["ResponseAppCustAttrContentObjs"]
        if (this.ListAttrContent.length < 1) {
          var custGrp = {
            AttrGroup: this.attrGroup
          };
          this.httpClient.post(URLConstant.GetListActiveRefAttrByAttrGroup, custGrp).subscribe(
            async (response: any) => {
              var parentFormGroup = new Object();
              this.RefAttrList = response[CommonConstant.ReturnObj];

              let tempLookup = {};
              for (const refAttr of this.RefAttrList) {

                var formGroupObject = new Object();
                formGroupObject["CustAttrContentId"] = [0];
                formGroupObject["AttrCode"] = [refAttr["AttrCode"]];
                formGroupObject["IsMandatory"] = [refAttr["IsMandatory"]];

                if (refAttr["AttrInputType"] == 'T' && refAttr["PatternValue"] != "" && refAttr["PatternValue"] != null) {
                  if (refAttr["IsMandatory"] == true) {
                    formGroupObject["AttrValue"] = ['', [Validators.required, Validators.pattern(refAttr['PatternValue'])]];
                  } else {
                    formGroupObject["AttrValue"] = ['', [Validators.pattern(refAttr['PatternValue'])]];
                  }
                }
                else if (refAttr["AttrInputType"] == 'L') {
                  var temp = refAttr["AttrValue"].split(";");
                  formGroupObject["AttrValue"] = [temp[0]];
                }
                else {
                  formGroupObject["AttrValue"] = [''];
                }
                if (refAttr["DefaultValue"] != null) {
                  formGroupObject["AttrValue"] = [refAttr["DefaultValue"]];
                }
                if (refAttr["IsMandatory"] == true && refAttr["AttrInputType"] != 'T') {
                  formGroupObject["AttrValue"].push(Validators.required)
                }

                parentFormGroup[refAttr["AttrCode"]] = this.fb.group(formGroupObject);

                if (refAttr["AttrInputType"] == 'RM') {
                  tempLookup[refAttr["AttrCode"]] = new InputLookupObj();
                  tempLookup[refAttr["AttrCode"]].urlJson = "./assets/uclookup/lookupRefMaster.json";
                  tempLookup[refAttr["AttrCode"]].urlQryPaging = URLConstant.GetPagingObjectBySQL;
                  tempLookup[refAttr["AttrCode"]].urlEnviPaging = environment.FoundationR3Url;
                  tempLookup[refAttr["AttrCode"]].pagingJson = "./assets/uclookup/lookupRefMaster.json";
                  tempLookup[refAttr["AttrCode"]].genericJson = "./assets/uclookup/lookupRefMaster.json";

                  tempLookup[refAttr["AttrCode"]].title = refAttr.AttrName;
                  if (refAttr["IsMandatory"] == true) {
                    tempLookup[refAttr["AttrCode"]].isRequired = true;
                  } else {
                    tempLookup[refAttr["AttrCode"]].isRequired = false;
                  }
                  var arrAddCrit = new Array();
                  var critAssetObj = new CriteriaObj();
                  critAssetObj.DataType = 'text';
                  critAssetObj.restriction = AdInsConstant.RestrictionEq;
                  critAssetObj.propName = 'REF_MASTER_TYPE_CODE';
                  critAssetObj.value = refAttr.AttrValue;
                  arrAddCrit.push(critAssetObj);
                  tempLookup[refAttr["AttrCode"]].addCritInput = arrAddCrit;

                  if (refAttr["DefaultValue"] != null) {
                    var refMaster = {
                      RefMasterTypeCode: refAttr["AttrValue"],
                      MasterCode: refAttr["DefaultValue"]
                    };
                  await this.httpClient.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
                      (response) => {
                        tempLookup[refAttr["AttrCode"]].jsonSelect = { Descr: response['Descr'] }
                      });
                  }
                }

              }
              this.ListInputLookUpObj.push(tempLookup);
              this.OtherInformationForm.addControl("AttrList", this.fb.group(parentFormGroup));
              this.IsFormReady = true;
            }
          );
        }
        else {
          var parentFormGroup = new Object();
          let tempLookup = {};

          var custGrp = {
            AttrGroup: this.attrGroup
          };
          this.httpClient.post(URLConstant.GetListActiveRefAttrByAttrGroup, custGrp).subscribe(
            async (response: any) => {
              this.RefAttrList = response[CommonConstant.ReturnObj];
              for (const refAttr of this.RefAttrList) {
                var item = this.ListAttrContent.find(x => x.AttrCode == refAttr.AttrCode);
                if (item == undefined) {
                  var formGroupObject = new Object();
                  formGroupObject["CustAttrContentId"] = [0];
                  formGroupObject["AttrCode"] = [refAttr["AttrCode"]];
                  formGroupObject["IsMandatory"] = [refAttr["IsMandatory"]];

                  if (refAttr["AttrInputType"] == 'T' && refAttr["PatternValue"] != "" && refAttr["PatternValue"] != null) {
                    if (refAttr["IsMandatory"] == true) {
                      formGroupObject["AttrValue"] = ['', [Validators.required, Validators.pattern(refAttr['PatternValue'])]];
                    } else {
                      formGroupObject["AttrValue"] = ['', [Validators.pattern(refAttr['PatternValue'])]];
                    }
                  }
                  else if (refAttr["AttrInputType"] == 'L') {
                    var temp = refAttr["AttrValue"].split(";");
                    formGroupObject["AttrValue"] = [temp[0]];
                  } else {
                    formGroupObject["AttrValue"] = [''];
                  }
                  if (refAttr["DefaultValue"] != null) {
                    formGroupObject["AttrValue"] = [refAttr["DefaultValue"]];
                  }

                  if (refAttr["IsMandatory"] == true && refAttr["AttrInputType"] != 'T') {
                    formGroupObject["AttrValue"].push(Validators.required)
                  }

                  parentFormGroup[refAttr["AttrCode"]] = this.fb.group(formGroupObject);

                  if (refAttr["AttrInputType"] == 'RM') {

                    tempLookup[refAttr["AttrCode"]] = new InputLookupObj();
                    tempLookup[refAttr["AttrCode"]].urlJson = "./assets/uclookup/lookupRefMaster.json";
                    tempLookup[refAttr["AttrCode"]].urlQryPaging = URLConstant.GetPagingObjectBySQL;
                    tempLookup[refAttr["AttrCode"]].urlEnviPaging = environment.FoundationR3Url;
                    tempLookup[refAttr["AttrCode"]].pagingJson = "./assets/uclookup/lookupRefMaster.json";
                    tempLookup[refAttr["AttrCode"]].genericJson = "./assets/uclookup/lookupRefMaster.json";
                    if (refAttr["DefaultValue"] != null) {
                      var refMaster = {
                        RefMasterTypeCode: refAttr["AttrValue"],
                        MasterCode: refAttr["DefaultValue"]
                      };
                      this.httpClient.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).subscribe(
                        (response) => { 
                          tempLookup[refAttr["AttrCode"]].jsonSelect = { Descr: response['Descr'] }
                        });
                    } 
                    tempLookup[refAttr["AttrCode"]].title = refAttr.AttrName;
                    if (refAttr["IsMandatory"] == true) {
                      tempLookup[refAttr["AttrCode"]].isRequired = true;
                    } else {
                      tempLookup[refAttr["AttrCode"]].isRequired = false;
                    }
                    if (refAttr["DefaultValue"] != null) {
                      var refMaster = {
                        RefMasterTypeCode: refAttr["AttrValue"],
                        MasterCode: refAttr["DefaultValue"]
                      };
                    await this.httpClient.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
                        (response) => {
                          tempLookup[refAttr["AttrCode"]].jsonSelect = { Descr: response['Descr'] }
                        });
                    }
                    var arrAddCrit = new Array();
                    var critAssetObj = new CriteriaObj();
                    critAssetObj.DataType = 'text';
                    critAssetObj.restriction = AdInsConstant.RestrictionEq;
                    critAssetObj.propName = 'REF_MASTER_TYPE_CODE';
                    critAssetObj.value = refAttr.AttrValue;
                    arrAddCrit.push(critAssetObj);
                    tempLookup[refAttr["AttrCode"]].addCritInput = arrAddCrit; 
                  }

                } else {
                  var formGroupObject = new Object();
                  formGroupObject["CustAttrContentId"] = [item["CustAttrContentId"]];
                  formGroupObject["AttrCode"] = [item["AttrCode"]];
                  formGroupObject["IsMandatory"] = [refAttr["IsMandatory"]];

                  if (refAttr["AttrInputType"] == 'T' && refAttr["PatternValue"] != "" && refAttr["PatternValue"] != null) {
                    if (refAttr["IsMandatory"] == true) {
                      formGroupObject["AttrValue"] = [item["AttrValue"], [Validators.required, Validators.pattern(refAttr['PatternValue'])]];
                    } else {
                      formGroupObject["AttrValue"] = [item["AttrValue"], [Validators.pattern(refAttr['PatternValue'])]];
                    }
                  } else {
                    formGroupObject["AttrValue"] = [item["AttrValue"]];
                  }
                  if (refAttr["IsMandatory"] == true && refAttr["AttrInputType"] != 'T') {
                    formGroupObject["AttrValue"].push(Validators.required)
                  }
                  parentFormGroup[item["AttrCode"]] = this.fb.group(formGroupObject);
                  if (item["AttrInputType"] == 'RM') {
                    tempLookup[item["AttrCode"]] = new InputLookupObj();
                    tempLookup[item["AttrCode"]].urlJson = "./assets/uclookup/lookupRefMaster.json";
                    tempLookup[item["AttrCode"]].urlQryPaging = URLConstant.GetPagingObjectBySQL;
                    tempLookup[item["AttrCode"]].urlEnviPaging = environment.FoundationR3Url;
                    tempLookup[item["AttrCode"]].pagingJson = "./assets/uclookup/lookupRefMaster.json";
                    tempLookup[item["AttrCode"]].genericJson = "./assets/uclookup/lookupRefMaster.json";
                    tempLookup[refAttr["AttrCode"]].title = refAttr.AttrName;
                    if (refAttr["IsMandatory"] == true) {
                      tempLookup[refAttr["AttrCode"]].isRequired = true;
                    } else {
                      tempLookup[refAttr["AttrCode"]].isRequired = false;
                    }
                     tempLookup[item["AttrCode"]].jsonSelect = { Descr: item["Descr"] }
                    var arrAddCrit = new Array();
                    var critAssetObj = new CriteriaObj();
                    critAssetObj.DataType = 'text';
                    critAssetObj.restriction = AdInsConstant.RestrictionEq;
                    critAssetObj.propName = 'REF_MASTER_TYPE_CODE';
                    critAssetObj.value = item.MasterCode;
                    arrAddCrit.push(critAssetObj);
                    tempLookup[item["AttrCode"]].addCritInput = arrAddCrit;
                  }
                }
              }
              this.ListInputLookUpObj.push(tempLookup);
              this.OtherInformationForm.addControl("AttrList", this.fb.group(parentFormGroup));
              this.IsFormReady = true;

            });
        }
      });
  }

  SaveForm(){ 
    var formValue = this.OtherInformationForm['controls']['AttrList'].value;
    var custAttrRequest = new Array<Object>();
     
    if(Object.keys(formValue).length > 0 && formValue.constructor === Object){
      for (const key in formValue) {
        if(formValue[key]["AttrValue"]!=null ) { 
        var custAttr = {
          CustAttrContentId: formValue[key]["CustAttrContentId"],
          AppCustId: this.AppCustId,
          RefAttrCode: formValue[key]["AttrCode"],
          AttrValue: formValue[key]["AttrValue"],
          AttrGroup: this.attrGroup
        };
        custAttrRequest.push(custAttr);}

      }  
    }
        this.setAppCustOtherInfoData();

        var RequestAppCustOtherInfoObj= {
          ListRequestAppCustAttrObject: custAttrRequest,
          RequestAppCustOtherInfoObj: this.appCustOtherInfo
        }
        this.httpClient.post(URLConstant.AddEditCustCompletionOtherInfo, RequestAppCustOtherInfoObj).subscribe(
          (response) => { 
            this.toastr.successMessage(response["Message"]);
          },
          (error) => {
            console.log(error);
          }
        );
     
  }
  setAppCustOtherInfoData() {
    this.appCustOtherInfo = new AppCustOtherInfoObj();
    if(this.ResponseCustOtherInfo != undefined){
     this.appCustOtherInfo.RowVersion = this.ResponseCustOtherInfo.RowVersion 
    }
    this.appCustOtherInfo.LbppmsBizSclLbppCode = this.OtherInformationForm.controls.LbppmsBizSclLbppCode.value;
    this.appCustOtherInfo.LbppmsBizSustainLbppCode = this.OtherInformationForm.controls.LbppmsBizSustainLbppCode.value;
    this.appCustOtherInfo.LbppmsCntrprtLbppCode = this.OtherInformationForm.controls.LbppmsCntrprtLbppCode.value;
    this.appCustOtherInfo.LbppmsDebtGrpLbppCode = this.OtherInformationForm.controls.LbppmsDebtGrpLbppCode.value;
    this.appCustOtherInfo.LbppmsCntrprtLbppDescr = this.OtherInformationForm.controls.LbppmsCntrprtLbppDescr.value;
    this.appCustOtherInfo.LbppmsDebtGrpLbppDescr = this.OtherInformationForm.controls.LbppmsDebtGrpLbppDescr.value;
    this.appCustOtherInfo.LbppmsBizSustainLbppDescr = this.OtherInformationForm.controls.LbppmsBizSustainLbppDescr.value;
    this.appCustOtherInfo.LbppmsBizSclLbppDescr = this.OtherInformationForm.controls.LbppmsBizSclLbppDescr.value;

  }
  getLookupDebitorGroup(e){
    this.OtherInformationForm.patchValue({
      LbppmsDebtGrpLbppCode: e.LbppCode,
      LbppmsDebtGrpLbppDescr: e.Descr
    }); 
  }   
  getLookupDebitorBusinessScale(e){
    this.OtherInformationForm.patchValue({
      LbppmsBizSclLbppCode: e.LbppCode,
      LbppmsBizSclLbppDescr: e.Descr
    }); 
  }
  getLookupCounterpartCategory(e){
    this.OtherInformationForm.patchValue({
      LbppmsCntrprtLbppCode: e.LbppCode,
      LbppmsCntrprtLbppDescr: e.Descr
    });  

  }
  getLookupSustainableFinancialBusiness(e){
    this.OtherInformationForm.patchValue({
      LbppmsBizSustainLbppCode: e.LbppCode,
      LbppmsBizSustainLbppDescr: e.Descr
    }); 
  }
  SplitAttrListValue(value) {
    return value.split(";");
  }
  getLookUp(e, AttrCode) {
    this.OtherInformationForm['controls']["AttrList"]["controls"][AttrCode].patchValue({
      AttrValue: e.MasterCode
    });
  }

}
