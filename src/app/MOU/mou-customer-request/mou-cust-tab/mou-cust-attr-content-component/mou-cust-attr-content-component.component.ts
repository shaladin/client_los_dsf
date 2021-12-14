import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AttrContent } from 'app/shared/model/cust-completion/attr-content.model';
import { RefAttr } from 'app/shared/model/cust-completion/ref-attr.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { ReqRefAttrByAttrGroupObj } from 'app/shared/model/request/ref-attr/req-ref-attr-by-attr-group-obj.model';
import { ResGetAppCustAttrContentObj, ResGetListAppCustAttrContentObj } from 'app/shared/model/response/nap/NAP 4/res-get-list-app-cust-attr-content-obj.model';
import { environment } from 'environments/environment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-mou-cust-attr-content-component',
  templateUrl: './mou-cust-attr-content-component.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class MouCustAttrContentComponentComponent implements OnInit {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() AttrGroup: string;
  @Input() AttrGroups: Array<string> = [];
  @Input() MouCustId: number;
  @Input() title: string;
  @Output() IncomeAmt: EventEmitter<{ Index: number, Amount: number }> = new EventEmitter();
  @Output() ExpenseAmt: EventEmitter<{ Index: number, Amount: number }> = new EventEmitter();
  
  ListAttrContent: Array<ResGetAppCustAttrContentObj> = new Array();
  RefAttrList: Array<RefAttr> = new Array<RefAttr>();
  ListInputLookUpObj = new Array();
  IsFormReady: boolean = false;
  tempLookup = {};
  AttrContent: AttrContent;
  AttrGroupCustPersonalFinData: string = CommonConstant.AttrGroupCustPersonalFinData;
  AttrGroupCustPersonalFinDataIncome: string = CommonConstant.AttrGroupCustPersonalFinDataIncome;
  AttrGroupCustPersonalFinDataExpense: string = CommonConstant.AttrGroupCustPersonalFinDataExpense;
  AttrGroupCustPersonalFinDataOther: string = CommonConstant.AttrGroupCustPersonalFinDataOther;
  
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  dictMultiOptions: { [key: string]: Array<{ item_id: string, item_text: string }>; } = {};
  selectedMultiDDLItems: { [key: string]: Array<{ item_id: string, item_text: string }>; } = {};
  
  constructor(private httpClient: HttpClient, private fb: FormBuilder) { }

  async ngOnInit() {
    if (this.AttrGroup !== undefined) {
      // let custGrp: ReqRefAttrByAttrGroupObj = new ReqRefAttrByAttrGroupObj();
      // custGrp.AttrGroup = this.AttrGroup;
      // await this.httpClient.post(URLConstant.GetListAppCustAttrContentByAppCustIdAndAttrGroup, { AppCustId: this.AppCustId, AttrGroup: this.AttrGroup }).toPromise().then(
      //   async (response: ResGetListAppCustAttrContentObj) => {
      //     this.ListAttrContent = response.ResponseAppCustAttrContentObjs;
      //     await this.httpClient.post<Array<RefAttr>>(URLConstant.GetListActiveRefAttrByAttrGroup, custGrp).toPromise().then(
      //       async (response) => {
      //         this.RefAttrList = response[CommonConstant.ReturnObj];
      //         var parentFormGroup = new Object();
      //         if (this.RefAttrList != null) {
      //           for (const refAttr of this.RefAttrList) {
      //             this.AttrContent = new AttrContent();
      //             let isUpdateValue = false;
      //             if (this.ListAttrContent.find(x => x.AttrCode == refAttr.AttrCode)) {
      //               let foundAttrContent = this.ListAttrContent.find(x => x.AttrCode == refAttr.AttrCode);
      //               this.AttrContent.AttrCode = foundAttrContent.AttrCode;
      //               this.AttrContent.AttrName = foundAttrContent.AttrName;
      //               this.AttrContent.AttrValue = foundAttrContent.AttrValue;
      //               this.AttrContent.Descr = foundAttrContent.Descr;
      //               this.AttrContent.MasterCode = foundAttrContent.MasterCode;
      //               isUpdateValue = true;
      //             }
      //             var formGroupObject = new Object();
      //             formGroupObject["AttrCode"] = [refAttr.AttrCode];
      //             formGroupObject["IsMandatory"] = [refAttr.IsMandatory];
      //             formGroupObject["AttrGroup"] = this.AttrGroup;
      //             await this.setFormGroupValue(refAttr, formGroupObject, parentFormGroup, isUpdateValue);
      //           }
      //           this.ListInputLookUpObj.push(this.tempLookup);
      //           this.parentForm.addControl(this.identifier, this.fb.group(parentFormGroup));
      //           this.IsFormReady = true;
      //         }
      //       }
      //     );
      //   }
      // );
    }
    else if (this.AttrGroups !== undefined) {
      await this.httpClient.post(URLConstant.GetListMouCustFinDataAttrContentByMouCustIdAndListAttrGroup, { MouCustId: this.MouCustId, AttrGroups: this.AttrGroups }).toPromise().then(
        async (response) => {
          this.ListAttrContent = response[CommonConstant.ReturnObj];
          var parentFormGroup = new Object();

          await this.httpClient.post<Array<RefAttr>>(URLConstant.GetListActiveRefAttrByListAttrGroup, { AttrGroups: this.AttrGroups }).toPromise().then(
            async (response) => {
              this.RefAttrList = response[CommonConstant.ReturnObj];

              if (this.RefAttrList != null) {
                let index = 0;
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
                  formGroupObject["AttrGroup"] = [refAttr.AttrGroup];
                  await this.setFormGroupValueForAttrGroups(refAttr, formGroupObject, parentFormGroup, isUpdateValue, index);
                  index++;
                }
                this.ListInputLookUpObj.push(this.tempLookup);
                this.parentForm.addControl(this.identifier, this.fb.group(parentFormGroup));
                this.IsFormReady = true;
              }
            }
          );
        }
      );
    }
    console.log(this.RefAttrList);
  }

  readonly AttrInputTypeSearchList: string = CommonConstant.AttrInputTypeSearchList;
  async setFormGroupValueForAttrGroups(refAttr: RefAttr, formGroupObject: object, parentFormGroup, isUpdateValue: boolean, index: number) {
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
        if (refAttr.IsMandatory == false) {
          formGroupObject["AttrValue"] = [temp[0]];
        }
        else {
          formGroupObject["AttrValue"] = [""];
        }
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
    }
    else {
      if (refAttr.AttrInputType == 'T' && refAttr.PatternValue != "" && refAttr.PatternValue != null) {
        if (refAttr.IsMandatory == true) {
          formGroupObject["AttrValue"] = [this.AttrContent.AttrValue, [Validators.required, Validators.pattern(refAttr.PatternValue)]];
        } else {
          formGroupObject["AttrValue"] = [this.AttrContent.AttrValue, [Validators.pattern(refAttr.PatternValue)]];
        }
      }
      else {
        formGroupObject["AttrValue"] = [this.AttrContent.AttrValue];
        this.CalculateAmt(refAttr.AttrGroup, this.AttrContent.AttrValue, index);
      }
    }

    if (refAttr.AttrInputType == this.AttrInputTypeSearchList) {
      this.setAttrInputTypeSearchList(refAttr.AttrCode, refAttr.AttrValue);
    }

    if (refAttr.IsMandatory == true && refAttr.AttrInputType != 'T') {
      if (refAttr.AttrInputType == 'N') {
        formGroupObject["AttrValue"].push([Validators.required, Validators.min(1.00)])
      } else {
        formGroupObject["AttrValue"].push(Validators.required)
      }
    }
    parentFormGroup[refAttr.AttrCode] = this.fb.group(formGroupObject);

    if (refAttr.AttrInputType == 'RM') {
      this.tempLookup[refAttr.AttrCode] = new InputLookupObj();
      this.tempLookup[refAttr.AttrCode].urlJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[refAttr.AttrCode].urlEnviPaging = environment.FoundationR3Url + "/v1";
      this.tempLookup[refAttr.AttrCode].pagingJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[refAttr.AttrCode].genericJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[refAttr.AttrCode].title = refAttr["AttrName"];
      if (refAttr.IsMandatory == true) {
        this.tempLookup[refAttr.AttrCode].isRequired = true;
      }
      else {
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
      }
      else {
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
        if (refAttr.IsMandatory == false) {
          formGroupObject["AttrValue"] = [temp[0]];
        }
        else {
          formGroupObject["AttrValue"] = [""];
        }
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
    }
    else {
      if (refAttr.AttrInputType == 'T' && refAttr.PatternValue != "" && refAttr.PatternValue != null) {
        if (refAttr.IsMandatory == true) {
          formGroupObject["AttrValue"] = [this.AttrContent.AttrValue, [Validators.required, Validators.pattern(refAttr.PatternValue)]];
        } else {
          formGroupObject["AttrValue"] = [this.AttrContent.AttrValue, [Validators.pattern(refAttr.PatternValue)]];
        }
      }
      else {
        formGroupObject["AttrValue"] = [this.AttrContent.AttrValue];
      }
    }

    if (refAttr.AttrInputType == this.AttrInputTypeSearchList) {
      this.setAttrInputTypeSearchList(refAttr.AttrCode, refAttr.AttrValue);
    }

    if (refAttr.IsMandatory == true && refAttr.AttrInputType != 'T') {
      if (refAttr.AttrInputType == 'N') {
        formGroupObject["AttrValue"].push([Validators.required, Validators.min(1.00)])
      } else {
        formGroupObject["AttrValue"].push(Validators.required)
      }
    }
    parentFormGroup[refAttr.AttrCode] = this.fb.group(formGroupObject);

    if (refAttr.AttrInputType == 'RM') {
      this.tempLookup[refAttr.AttrCode] = new InputLookupObj();
      this.tempLookup[refAttr.AttrCode].urlJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[refAttr.AttrCode].urlEnviPaging = environment.FoundationR3Url + "/v1";
      this.tempLookup[refAttr.AttrCode].pagingJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[refAttr.AttrCode].genericJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[refAttr.AttrCode].title = refAttr["AttrName"];
      if (refAttr.IsMandatory == true) {
        this.tempLookup[refAttr.AttrCode].isRequired = true;
      }
      else {
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
      }
      else {
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

  CalculateAmt(attrGroup: string, amount: string, index: number) {
    if (attrGroup === this.AttrGroupCustPersonalFinDataIncome) {
      this.IncomeAmt.emit({ Index: index, Amount: parseFloat(amount.replace(/,/g, '')) });
    }
    else if (attrGroup === this.AttrGroupCustPersonalFinDataExpense) {
      this.ExpenseAmt.emit({ Index: index, Amount: parseFloat(amount.replace(/,/g, '')) });
    }
  }

  dictRuleSetName: { [Id: string]: string } = {};
  tempExistingValueSelected: { [Id: string]: string } = {};
  setAttrInputTypeSearchList(AttrCode: string, ruleSetName: string) {
    this.dictRuleSetName[AttrCode] = ruleSetName;
    this.selectedMultiDDLItems[AttrCode] = new Array();
    this.tempExistingValueSelected[AttrCode] = "";
    if (this.AttrContent.AttrValue) {
      this.tempExistingValueSelected[AttrCode] = this.AttrContent.AttrValue;
    }
    if (this.dictProf[AttrCode] != undefined) {
      this.SetSearchListInputType(AttrCode, this.dictProf[AttrCode]);
      this.dictProf[AttrCode] = undefined;
    }
  }

  dictProf: { [id: string]: string } = {};
  SetSearchListInputType(attrCode: string, ProfessionCode: string) {
    if (this.dictRuleSetName[attrCode] == undefined) {
      this.dictProf[attrCode] = ProfessionCode;
      return;
    }
    this.httpClient.post(URLConstant.GetRuleForAttrContent, { RuleSetName: this.dictRuleSetName[attrCode], Code: ProfessionCode }).subscribe(
      (response: GenericListObj) => {
        let tempList: Array<KeyValueObj> = response.ReturnObject;
        this.dictMultiOptions[attrCode] = new Array();
        if (tempList) {
          for (let index = 0; index < tempList.length; index++) {
            const element = tempList[index];
            if (element.Key == this.tempExistingValueSelected[attrCode]) {
              this.selectedMultiDDLItems[attrCode] = new Array();
              this.selectedMultiDDLItems[attrCode].push({ item_id: element.Key, item_text: element.Value });
              this.onMultiDDLChangeEvent(attrCode);
              this.tempExistingValueSelected[attrCode] = "";
            }
            this.dictMultiOptions[attrCode].push({ item_id: element.Key, item_text: element.Value });
          }
        }
      }
    )
  }

  onMultiDDLChangeEvent(attrCode: string) {
    if (this.selectedMultiDDLItems[attrCode] && this.selectedMultiDDLItems[attrCode].length > 0) {
      let selectedId = this.selectedMultiDDLItems[attrCode].map(x => x.item_id);
      // let selectedText = this.selectedMultiDDLItems[attrCode].map(x => x.item_text);
      let tempArray = this.parentForm.get(this.identifier) as FormArray;
      let tempFb = tempArray.get(attrCode) as FormGroup;
      tempFb.get("AttrValue").patchValue(selectedId[0]);
    }
  }

  SplitAttrListValue(value: string) {
    return value.split(";").sort();
  }

  getLookUp(e, AttrCode: string) {
    this.parentForm['controls'][this.identifier]["controls"][AttrCode].patchValue({
      AttrValue: e.MasterCode
    });
  }
}
