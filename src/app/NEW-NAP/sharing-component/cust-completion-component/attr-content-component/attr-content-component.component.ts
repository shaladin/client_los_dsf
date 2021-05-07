import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AttrContent } from 'app/shared/model/CustCompletion/AttrContent.Model';
import { RefAttr } from 'app/shared/model/CustCompletion/RefAttr.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { ReqRefAttrByAttrGroupObj } from 'app/shared/model/Request/RefAttr/ReqRefAttrByAttrGroupObj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMasterCodeObj.Model';
import { ResGetAppCustAttrContentObj, ResGetListAppCustAttrContentObj } from 'app/shared/model/Response/NAP/NAP 4/ResGetListAppCustAttrContentObj.model';
import { environment } from 'environments/environment';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
@Component({
  selector: 'app-attr-content-component',
  templateUrl: './attr-content-component.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class AttrContentComponentComponent implements OnInit {

  constructor(private httpClient: HttpClient,
    private fb: FormBuilder) { }
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() AttrGroup: string;
  @Input() AppCustId: number;
  @Input() title: string;
  ListAttrContent: Array<ResGetAppCustAttrContentObj> = new Array<ResGetAppCustAttrContentObj>();
  RefAttrList: Array<RefAttr> = new Array<RefAttr>();
  ListInputLookUpObj = new Array();
  IsFormReady: boolean = false;
  tempLookup = {};
  AttrContent: AttrContent;

  async ngOnInit() {
    let custGrp: ReqRefAttrByAttrGroupObj = new ReqRefAttrByAttrGroupObj();
    custGrp.AttrGroup = this.AttrGroup;
    await this.httpClient.post(URLConstant.GetListAppCustAttrContentByAppCustIdAndAttrGroup, { AppCustId: this.AppCustId, AttrGroup: this.AttrGroup }).toPromise().then(
      (response : ResGetListAppCustAttrContentObj) => {
        this.ListAttrContent = response.ResponseAppCustAttrContentObjs;
        this.httpClient.post<Array<RefAttr>>(URLConstant.GetListActiveRefAttrByAttrGroup, custGrp).subscribe(
          async (response) => {
            this.RefAttrList = response[CommonConstant.ReturnObj];

            var parentFormGroup = new Object();

            if (this.RefAttrList != null) {
              for (const refAttr of this.RefAttrList) {
                this.AttrContent = new AttrContent();
                let isUpdateValue = false;
                if (this.ListAttrContent.find(x => x.AttrCode == refAttr.AttrCode)) {
                  let foundAttrContent = this.ListAttrContent.find(x => x.AttrCode == refAttr.AttrCode);
                  this.AttrContent.AttrCode = foundAttrContent.AttrCode;
                  this.AttrContent.AttrName = foundAttrContent.AttrName;
                  this.AttrContent.AttrValue = foundAttrContent.AttrValue;
                  this.AttrContent.Descr = foundAttrContent.Descr;
                  this.AttrContent.MasterCode = foundAttrContent.MasterCode;
                  isUpdateValue = true;
                }

                var formGroupObject = new Object();
                formGroupObject["AttrCode"] = [refAttr.AttrCode];
                formGroupObject["IsMandatory"] = [refAttr.IsMandatory];

                await this.setFormGroupValue(refAttr, formGroupObject, parentFormGroup, isUpdateValue);
              }
              this.ListInputLookUpObj.push(this.tempLookup);
              this.parentForm.addControl(this.identifier, this.fb.group(parentFormGroup));
              this.IsFormReady = true;
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

  async setFormGroupValue(refAttr: RefAttr, formGroupObject: object, parentFormGroup, isUpdateValue: boolean) {
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
          let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
            RefMasterTypeCode: refAttr.AttrValue,
            MasterCode: refAttr.DefaultValue
          };
          await this.httpClient.post(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
            (response: KeyValueObj) => {
              this.tempLookup[refAttr.AttrCode].jsonSelect = { Descr: response.Value }
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
