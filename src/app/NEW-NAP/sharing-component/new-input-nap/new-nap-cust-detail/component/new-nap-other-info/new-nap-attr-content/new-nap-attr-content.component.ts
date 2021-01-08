import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AttrContent } from 'app/shared/model/CustCompletion/AttrContent.Model';
import { RefAttr } from 'app/shared/model/CustCompletion/RefAttr.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-nap-attr-content',
  templateUrl: './new-nap-attr-content.component.html',
  styles: []
})
export class NewNapAttrContentComponent implements OnInit {
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() AttrGroup: string;
  @Input() AppCustId: number;
  @Input() title: string;
  @Input() IsAttrSubmitted: boolean;
  ListAttrContent: Array<AttrContent> = new Array<AttrContent>();
  RefAttrList: Array<RefAttr> = new Array<RefAttr>();
  ListInputLookUpObj = new Array();
  IsFormReady: boolean = false;
  tempLookup = {};
  AttrContent: AttrContent;

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {
    this.IsAttrSubmitted = false;
   }

  async ngOnInit() {
    var custGrp = {
      AttrGroup: this.AttrGroup
    };
    await this.httpClient.post<Array<AttrContent>>(URLConstant.GetListAppCustAttrContentForNewNap, { AppCustId: this.AppCustId, AttrGroup: this.AttrGroup }).toPromise().then(
      (response) => {
        this.ListAttrContent = response["ResponseAppCustAttrContentObjs"]
        this.httpClient.post<Array<RefAttr>>(URLConstant.GetListActiveRefAttrByAttrGroup, custGrp).subscribe(
          async (response) => {
            this.RefAttrList = response[CommonConstant.ReturnObj];

            var parentFormGroup = new Object();
             
            if(this.RefAttrList.length > 0){
              for (const refAttr of this.RefAttrList) { 
                this.AttrContent = new AttrContent();
                let isUpdateValue = false;
                if(this.ListAttrContent.find(x => x.AttrCode == refAttr.AttrCode) ){
                  this.AttrContent = this.ListAttrContent.find(x => x.AttrCode == refAttr.AttrCode);
                  isUpdateValue = true;
                }
  
                var formGroupObject = new Object();
                formGroupObject["AttrCode"] = [refAttr.AttrCode];
                formGroupObject["IsMandatory"] = [refAttr.IsMandatory]; 
                
                await this.setFormGroupValue(refAttr, formGroupObject, parentFormGroup, isUpdateValue); 
              }
              this.ListInputLookUpObj.push(this.tempLookup);
              if(this.parentForm.controls[this.identifier]){
                this.parentForm.removeControl(this.identifier);
              }
              this.parentForm.addControl(this.identifier, this.fb.group(parentFormGroup));
              this.IsFormReady = true;
              console.log(this.parentForm);
            }
          }
        );

      });
  }

  SplitAttrListValue(value: string) {
    return value.split(";");
  }
  getLookUp(e, AttrCode: string) {
    this.parentForm['controls'][this.identifier]["controls"][AttrCode].patchValue({
      AttrValue: e.MasterCode
    });
  }

  async setFormGroupValue(refAttr: RefAttr, formGroupObject: object, parentFormGroup, isUpdateValue: boolean ){
    if (isUpdateValue == false) {
      if (refAttr.AttrInputType == 'T' && refAttr.PatternValue != "" && refAttr.PatternValue != null) {
        if (refAttr.IsMandatory == true) {
          formGroupObject["AttrValue"] = ['', [Validators.required, Validators.pattern(refAttr.PatternValue)]];
        } else {
          formGroupObject["AttrValue"] = ['', [Validators.pattern(refAttr.PatternValue)]];
        }
      }
      else if (refAttr.AttrInputType == 'L') {
        var temp = refAttr.AttrValue.split(";");
        formGroupObject["AttrValue"] = [temp[0]];
      }
      else if (refAttr.AttrInputType == 'P' || refAttr.AttrInputType == 'N') {
        formGroupObject["AttrValue"] = [0];
      }
      else {
        formGroupObject["AttrValue"] = [''];
      }
      if (refAttr.DefaultValue != null) {
        formGroupObject["AttrValue"] = [refAttr["DefaultValue"]];
      }
    } else {
      if (refAttr.AttrInputType == 'T' && refAttr.PatternValue != "" && refAttr.PatternValue != null) {
        if (refAttr.IsMandatory == true) {
          formGroupObject["AttrValue"] = [this.AttrContent.AttrValue, [Validators.required, Validators.pattern(refAttr.PatternValue)]];
        } else {
          formGroupObject["AttrValue"] = [this.AttrContent.AttrValue, [Validators.pattern(refAttr.PatternValue)]];
        }
      } else {
        formGroupObject["AttrValue"] = [this.AttrContent.AttrValue];
      }
    }

    if (refAttr.IsMandatory == true && refAttr.AttrInputType != 'T') {
      formGroupObject["AttrValue"].push(Validators.required)
    }
    parentFormGroup[refAttr.AttrCode] = this.fb.group(formGroupObject);

    if (refAttr.AttrInputType == 'RM') { 
     this.tempLookup[refAttr.AttrCode] = new InputLookupObj();
     this.tempLookup[refAttr.AttrCode].urlJson = "./assets/uclookup/lookupRefMaster.json";
     this.tempLookup[refAttr.AttrCode].urlQryPaging = URLConstant.GetPagingObjectBySQL;
     this.tempLookup[refAttr.AttrCode].urlEnviPaging = environment.FoundationR3Url;
     this.tempLookup[refAttr.AttrCode].pagingJson = "./assets/uclookup/lookupRefMaster.json";
     this.tempLookup[refAttr.AttrCode].genericJson = "./assets/uclookup/lookupRefMaster.json";
     this.tempLookup[refAttr.AttrCode].title = refAttr["AttrName"];
      if (refAttr.IsMandatory == true) {
        this.tempLookup[refAttr.AttrCode].isRequired = true;
      } else {
        this.tempLookup[refAttr.AttrCode].isRequired = false;
      } 
      if (isUpdateValue == false) { 
        if (refAttr.DefaultValue != null) {
          var refMaster = {
            RefMasterTypeCode: refAttr.AttrValue,
            MasterCode: refAttr.DefaultValue
          };
          await this.httpClient.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
            (response) => {
              this.tempLookup[refAttr.AttrCode].jsonSelect = { Descr: response['Descr'] }
            });
        } 
      } else {
        this.tempLookup[this.AttrContent.AttrCode].jsonSelect = { Descr: this.AttrContent.Descr }
      } 
      var arrAddCrit = new Array();
      var critAssetObj = new CriteriaObj();
      critAssetObj.DataType = 'text';
      critAssetObj.restriction = AdInsConstant.RestrictionEq;
      critAssetObj.propName = 'REF_MASTER_TYPE_CODE';
      critAssetObj.value = this.AttrContent == undefined || this.AttrContent.MasterCode == undefined ? refAttr.AttrValue : this.AttrContent.MasterCode;   
      arrAddCrit.push(critAssetObj);
      this.tempLookup[refAttr.AttrCode].addCritInput = arrAddCrit;
    }
  }

}
