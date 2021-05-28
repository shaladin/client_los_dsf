import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AttrContent } from 'app/shared/model/CustCompletion/AttrContent.Model';
import { RefAttr } from 'app/shared/model/CustCompletion/RefAttr.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { LtkmAttrContent } from 'app/shared/model/LTKM/LtkmAttrContent.Model';
import { environment } from 'environments/environment';
@Component({
    selector: 'app-ltkm-attr-content-component',
    templateUrl: './attr-content-component.component.html',
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class LtkmAttrContentComponentComponent implements OnInit {

    constructor(private httpClient: HttpClient,
        private fb: FormBuilder) { }
    @Input() enjiForm: NgForm;
    @Input() parentForm: FormGroup;
    @Input() identifier: string;
    @Input() AttrGroup: string;
    @Input() title: string;
    @Input() isLockMode: boolean;
    @Input() ListAttrContent: Array<LtkmAttrContent> = new Array<LtkmAttrContent>();
    RefAttrList: Array<RefAttr> = new Array<RefAttr>();
    ListInputLookUpObj = new Array();
    IsFormReady: boolean = false;
    tempLookup = {};
    AttrContent: LtkmAttrContent;

    async ngOnInit() {
        this.setData();
    }

    setData() {
        this.httpClient.post<Array<RefAttr>>(URLConstant.GetListActiveRefAttrByAttrGroup, { AttrGroup: this.AttrGroup }).subscribe(
            async (response) => {
                this.RefAttrList = response[CommonConstant.ReturnObj];

                var parentFormGroup = new Object();

                if (this.RefAttrList.length > 0) {
                    for (const refAttr of this.RefAttrList) {
                        this.AttrContent = new LtkmAttrContent();
                        let isUpdateValue = false;
                        if (this.ListAttrContent.find(x => x.AttrCode == refAttr.AttrCode)) {
                            this.AttrContent = this.ListAttrContent.find(x => x.AttrCode == refAttr.AttrCode);
                            isUpdateValue = true;
                        }

                        var formGroupObject = new Object();
                        formGroupObject["AttrCode"] = [refAttr.AttrCode];
                        formGroupObject["IsMandatory"] = [refAttr.IsMandatory];

                        await this.setFormGroupValue(refAttr, formGroupObject, parentFormGroup, isUpdateValue);
                    }
                    this.ListInputLookUpObj.push(this.tempLookup);
                    this.parentForm.removeControl(this.identifier);
                    this.parentForm.addControl(this.identifier, this.fb.group(parentFormGroup));
                    this.IsFormReady = true;
                }
            }
        );
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

                if (this.isLockMode) {
                    formGroupObject["AttrValue"] = [''];
                } else {
                    if (refAttr.IsMandatory == true) {
                        formGroupObject["AttrValue"] = ['', [Validators.required, Validators.pattern(refAttr.PatternValue)]];
                    } else {
                        formGroupObject["AttrValue"] = ['', [Validators.pattern(refAttr.PatternValue)]];
                    }
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
            // if (refAttr.DefaultValue != null) {
            //   formGroupObject["AttrValue"] = [refAttr["DefaultValue"]];
            // }

            if (formGroupObject["AttrValue"] == '') {
                if (refAttr.DefaultValue != null) {
                    formGroupObject["AttrValue"] = [refAttr["DefaultValue"]];
                }
            }

        } else {

            if (refAttr.AttrInputType == 'T' && refAttr.PatternValue != "" && refAttr.PatternValue != null) {

                if (this.isLockMode) {
                    formGroupObject["AttrValue"] = [this.AttrContent.AttrValue];
                } else {
                    if (refAttr.IsMandatory == true) {
                        formGroupObject["AttrValue"] = [this.AttrContent.AttrValue, [Validators.required, Validators.pattern(refAttr.PatternValue)]];
                    } else {
                        formGroupObject["AttrValue"] = [this.AttrContent.AttrValue, [Validators.pattern(refAttr.PatternValue)]];
                    }
                }
            } else {
                formGroupObject["AttrValue"] = [this.AttrContent.AttrValue];
            }
        }

        //disini set nilai defaultnya, gapeduli dia tipenya apa
        if (refAttr.IsMandatory == true && refAttr.AttrInputType != 'T') {
            if (!this.isLockMode) {
                formGroupObject["AttrValue"].push(Validators.required);
            }
        }
        if (this.AttrContent.AttrValue != undefined) {
            formGroupObject["AttrValue"] = [this.AttrContent.AttrValue];
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
                if (this.isLockMode) {
                    this.tempLookup[refAttr.AttrCode].isRequired = false;
                    this.tempLookup[refAttr.AttrCode].isDisable = true;
                } else {
                    this.tempLookup[refAttr.AttrCode].isRequired = true;
                    this.tempLookup[refAttr.AttrCode].isDisable = false;
                }

            } else {
                this.tempLookup[refAttr.AttrCode].isRequired = false;
                if (this.isLockMode) {
                    this.tempLookup[refAttr.AttrCode].isDisable = true;
                }
            }
            if (isUpdateValue == false) {
                if (refAttr.DefaultValue != null) {
                    await this.httpClient.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, { RefMasterTypeCode: refAttr.AttrValue, MasterCode: refAttr.DefaultValue }).toPromise().then(
                        (response) => {
                            this.tempLookup[refAttr.AttrCode].jsonSelect = { Descr: response['Descr'] }
                        });
                }
            } else {
                this.tempLookup[this.AttrContent.AttrCode].jsonSelect = { Descr: this.AttrContent.Descr == undefined ? this.AttrContent.AttrName : this.AttrContent.Descr }
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

    copyListAttrContent() {
        if (this.ListAttrContent != undefined) {
            this.setData();
        }
    }
}
