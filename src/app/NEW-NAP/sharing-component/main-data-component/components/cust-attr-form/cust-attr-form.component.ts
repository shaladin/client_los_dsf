import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustAttrContent } from 'app/shared/model/AppCust/CustAttrContent/AppCustAttrContent.Model';
import { ReqGetListAppCustAttrContentObj } from 'app/shared/model/AppCust/CustAttrContent/ReqGetListAppCustAttrContentObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-cust-attr-form',
  templateUrl: './cust-attr-form.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustAttrFormComponent implements OnInit {

  @Input() Label: string = "";
  @Input() AppCustId: number = 0;
  @Input() AttrGroup: string = "";
  @Input() IsVertical: boolean = false;
  @Input() AttrCodes: Array<string> = [];
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string = "CustAttrForm";

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

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  async ngOnInit() {
    this.parentForm.addControl(this.identifier, this.fb.array([]));
    await this.GetQuestion();
  }

  async GetQuestion(AppCustId: number = this.AppCustId) {
    let tempReq: ReqGetListAppCustAttrContentObj = {
      AttrCodes: this.AttrCodes,
      AttrGroup: this.AttrGroup,
      AppCustId: AppCustId,
    };
    // let urlApi: string = URLConstant.GetListCustAttrContentByCustIdAndAttrGroup;
    // if (this.AttrCodes.length > 0) urlApi = URLConstant.GetListCustAttrContentByCustIdAndAttrGroupAndListAttrCodes;
    await this.http.post(URLConstant.GetListAppCustAttrContentsByAppCustIdAndAttrGroupAndListAttrCodes, tempReq).toPromise().then(
      (response: GenericListObj) => {
        let tempList: Array<AppCustAttrContent> = response.ReturnObject;
        let tempFormArray: FormArray = this.parentForm.get("CustAttrForm") as FormArray;
        while (tempFormArray.length > 0) {
          tempFormArray.removeAt(0);
        }
        for (let index = 0; index < tempList.length; index++) {
          const element = tempList[index];
          tempFormArray.push(this.SetFormGroup(element));
          this.dictAttrCodeIdxAt[element.AttrCode] = index;
        }
      }
    )
  }

  readonly AttrInputTypeDate: string = CommonConstant.AttrInputTypeDate;
  readonly AttrInputTypeNum: string = CommonConstant.AttrInputTypeNum;
  readonly AttrInputTypeNumPerc: string = CommonConstant.AttrInputTypeNumPerc;
  readonly AttrInputTypeList: string = CommonConstant.AttrInputTypeList;
  readonly AttrInputTypeText: string = CommonConstant.AttrInputTypeText;
  readonly AttrInputTypeTextArea: string = CommonConstant.AttrInputTypeTextArea;
  readonly AttrInputTypeRefMaster: string = CommonConstant.AttrInputTypeRefMaster;
  readonly AttrInputTypeSearchList: string = CommonConstant.AttrInputTypeSearchList;
  dictAttrCodeIdxAt: { [Id: string]: number } = {};
  dictRuleSetName: { [Id: string]: string } = {};
  tempExistingValueSelected: { [Id: string]: string } = {};
  SetFormGroup(QA: AppCustAttrContent): FormGroup {
    let tempFormGroup: FormGroup = this.fb.group({
      AttrCode: QA.AttrCode,
      AttrName: QA.AttrName,
      AttrInputType: QA.AttrInputType,
      AttrValue: QA.AttrValue,
      IsMandatory: QA.IsMandatory,
      RowVersion: QA.RowVersion,
    });

    // comment sementara di buat cuman khusus input text/simple2 + refMaster, list belom.
    switch (QA.AttrInputType) {
      case this.AttrInputTypeRefMaster:
        this.SetRefMasterInputType(QA.AttrCode, QA.AttrName, QA.IsMandatory, QA.RefAttrValueDesc, QA.RefAttrValue);
        break;
      case this.AttrInputTypeSearchList:
        this.dictRuleSetName[QA.AttrCode] = QA.RefAttrValue;
        this.selectedMultiDDLItems[QA.AttrCode] = new Array();
        this.tempExistingValueSelected[QA.AttrCode] = "";
        if (QA.AttrValue) {
          this.tempExistingValueSelected[QA.AttrCode] = QA.AttrValue;
        }
        break;
      case this.AttrInputTypeList:
        this.SetDictListItem(QA.AttrCode, QA.RefAttrValue);
        tempFormGroup = this.SetValidator(tempFormGroup, QA.PatternValue, QA.IsMandatory);
        break;
      default:
        tempFormGroup = this.SetValidator(tempFormGroup, QA.PatternValue, QA.IsMandatory);
        break;
    };
    return tempFormGroup;
  }

  SetValidator(tempFormGroup: FormGroup, pattern: string, isMandatory: boolean): FormGroup {
    let tempListValidators: Array<ValidatorFn> = new Array();
    if (isMandatory) tempListValidators.push(Validators.required);
    if (pattern) tempListValidators.push(Validators.pattern(pattern));

    if (tempListValidators.length > 0) {
      tempFormGroup.get("AttrValue").setValidators(tempListValidators);
      tempFormGroup.get("AttrValue").updateValueAndValidity();
    }
    return tempFormGroup;
  }

  dictRefMasterLookup: { [id: string]: InputLookupObj } = {};
  SetRefMasterInputType(attrCode: string, attrName: string, isMandatory: boolean, Descr: string, masterCode: string) {
    this.dictRefMasterLookup[attrCode] = new InputLookupObj();
    this.dictRefMasterLookup[attrCode].urlJson = "./assets/uclookup/RefMaster/lookupRefMaster.json";
    this.dictRefMasterLookup[attrCode].pagingJson = "./assets/uclookup/RefMaster/lookupRefMaster.json";
    this.dictRefMasterLookup[attrCode].genericJson = "./assets/uclookup/RefMaster/lookupRefMaster.json";
    this.dictRefMasterLookup[attrCode].title = attrName;
    this.dictRefMasterLookup[attrCode].isRequired = isMandatory;

    let arrAddCrit = new Array();
    let critAssetObj = new CriteriaObj();
    critAssetObj.DataType = 'text';
    critAssetObj.restriction = AdInsConstant.RestrictionEq;
    critAssetObj.propName = 'REF_MASTER_TYPE_CODE';
    critAssetObj.value = masterCode;
    arrAddCrit.push(critAssetObj);
    this.dictRefMasterLookup[attrCode].addCritInput = arrAddCrit;

    this.dictRefMasterLookup[attrCode].nameSelect = Descr;
    this.dictRefMasterLookup[attrCode].jsonSelect = { Descr: Descr };
  }

  DictListItem: { [Id: string]: Array<KeyValueObj> } = {};
  SetDictListItem(attrCode: string, masterCode: string) {
    let tempList: Array<string> = masterCode.split(";");
    let tempListKeyValueObj: Array<KeyValueObj> = new Array();
    for (let index = 0; index < tempList.length; index++) {
      const element = tempList[index];
      tempListKeyValueObj.push({ Key: element, Value: element });
    }
    this.DictListItem[attrCode] = tempListKeyValueObj;
  }

  SetSearchListInputType(attrCode: string, ProfessionCode: string) {
    this.http.post(URLConstant.GetRuleForAttrContent, { RuleSetName: this.dictRuleSetName[attrCode], Code: ProfessionCode }).subscribe(
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
            }
            this.dictMultiOptions[attrCode].push({ item_id: element.Key, item_text: element.Value });
          }
        }
      }
    )
  }

  getLookUp(e: RefMasterObj, idx: number) {
    let tempArray = this.parentForm.get(this.identifier) as FormArray;
    let tempFb = tempArray.get(idx.toString()) as FormGroup;
    tempFb.get("AttrValue").patchValue(e.MasterCode);
  }

  ResetValueFromAttrCode(attrCode: string, value: string = "") {
    let tempArray = this.parentForm.get(this.identifier) as FormArray;
    let tempFb = tempArray.get(this.dictAttrCodeIdxAt[attrCode].toString()) as FormGroup;
    tempFb.get("AttrValue").patchValue(value);
    if (tempFb.get("AttrInputType").value == this.AttrInputTypeRefMaster) {
      this.dictRefMasterLookup[attrCode].nameSelect = value;
      this.dictRefMasterLookup[attrCode].jsonSelect = { Descr: value };
    }
    if (tempFb.get("AttrInputType").value == this.AttrInputTypeSearchList) {
      if (this.tempExistingValueSelected[attrCode] == "") this.selectedMultiDDLItems[attrCode] = new Array();
    }
  }

  onMultiDDLChangeEvent(attrCode: string) {
    if (this.selectedMultiDDLItems[attrCode] && this.selectedMultiDDLItems[attrCode].length > 0) {
      let selectedId = this.selectedMultiDDLItems[attrCode].map(x => x.item_id);
      // let selectedText = this.selectedMultiDDLItems[attrCode].map(x => x.item_text);
      let tempArray = this.parentForm.get(this.identifier) as FormArray;
      let tempFb = tempArray.get(this.dictAttrCodeIdxAt[attrCode].toString()) as FormGroup;
      tempFb.get("AttrValue").patchValue(selectedId[0]);
    }
  }
}
