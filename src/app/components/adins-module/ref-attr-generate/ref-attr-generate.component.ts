import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators } from "@angular/forms";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CriteriaObj } from "app/shared/model/CriteriaObj.model";
import { InputLookupObj } from "app/shared/model/InputLookupObj.Model";
import { KeyValueObj } from "app/shared/model/KeyValue/KeyValueObj.model";
import { RefAttrGenerateObj } from "app/shared/model/RefAttrGenerate.Model";
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from "app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMasterCodeObj.Model";
import { IDropdownSettings } from "ng-multiselect-dropdown";

@Component({
    selector: 'ref-attr-generate',
    templateUrl: './ref-attr-generate.component.html',
    providers: [NGXToastrService],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

export class RefAttrGenerateComponent implements OnInit {

    @Input() enjiForm: NgForm;
    @Input() parentForm: FormGroup;
    @Input() ListAttrObjs: Array<RefAttrGenerateObj> = new Array();
    @Input() identifier: string = "AttrForm";
    @Input() IsVertical: boolean = false;
    @Input() IsDisable: boolean = false;
    @Input() IsShowBtnRefresh: boolean = true;
    @Input() Title: string = "Ref Attribute Generate";
    @Output() Callback: EventEmitter<string> = new EventEmitter();

    dropdownSettings: IDropdownSettings = {
        singleSelection: true,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 5,
        allowSearchFilter: true
    };

    //#region Attr Inpute Type
    readonly AttrInputTypeText = CommonConstant.AttrInputTypeText;
    readonly AttrInputTypeDate = CommonConstant.AttrInputTypeDate;
    readonly AttrInputTypeNum = CommonConstant.AttrInputTypeNum;
    readonly AttrInputTypeNumPerc = CommonConstant.AttrInputTypeNumPerc;
    readonly AttrInputTypeList = CommonConstant.AttrInputTypeList;
    readonly AttrInputTypeTextArea = CommonConstant.AttrInputTypeTextArea;
    readonly AttrInputTypeRefMaster = CommonConstant.AttrInputTypeRefMaster;
    readonly AttrInputTypeSearchList: string = CommonConstant.AttrInputTypeSearchList;
    //#endregion

    constructor(private http: HttpClient, private fb: FormBuilder) { }

    async ngOnInit() {
        this.GenerateCollateralAttrForm(this.ListAttrObjs);
    }

    async GenerateCollateralAttrForm(ListAttrObjs: Array<RefAttrGenerateObj>) {
        if (ListAttrObjs.length > 0) {
            let listAppAssetAttrs = this.parentForm.get(this.identifier) as FormArray;
            while (listAppAssetAttrs.length !== 0) {
                listAppAssetAttrs.removeAt(0);
            }
            for (let i = 0; i < ListAttrObjs.length; i++) {
                let tempFormGrp = await this.addGroupAppAttrContent(ListAttrObjs[i]);
                listAppAssetAttrs.push(tempFormGrp);
            }
        }
    }

    private async addGroupAppAttrContent(generateAttrContentObj: RefAttrGenerateObj) {
        let ListValidator: Array<ValidatorFn> = this.setAppAttrContentValidators(generateAttrContentObj);

        return await this.setFbGroupAppAttrContent(generateAttrContentObj, ListValidator);
    }

    private setAppAttrContentValidators(generateAttrContentObj: RefAttrGenerateObj) {
        let ListValidator: Array<ValidatorFn> = new Array<ValidatorFn>();

        if (generateAttrContentObj.IsMandatory == true) {
            ListValidator.push(Validators.required);
        }
        if (generateAttrContentObj.AttrLength != null && generateAttrContentObj.AttrLength != 0) {
            ListValidator.push(Validators.maxLength(generateAttrContentObj.AttrLength));
        }
        if (generateAttrContentObj.PatternValue != null && generateAttrContentObj.PatternValue != "") {
            ListValidator.push(Validators.pattern(generateAttrContentObj.PatternValue));
        }

        return ListValidator;
    }

    DictAttrLookup: { [id: string]: InputLookupObj } = {};
    DictAttrList: { [id: string]: Array<KeyValueObj> } = {};
    private async setFbGroupAppAttrContent(generateAttrContentObj: RefAttrGenerateObj, ListValidator: Array<ValidatorFn>) {
        let tempFB = this.fb.group({
            AttrCode: [generateAttrContentObj.AttrCode],
            AttrName: [generateAttrContentObj.AttrName],
            AttrInputType: [generateAttrContentObj.AttrInputType],
            AttrValue: [generateAttrContentObj.AttrValue],
            IsMandatory: [generateAttrContentObj.IsMandatory]
        });
        if (ListValidator.length > 0) {
            tempFB.get("AttrValue").setValidators(ListValidator);
        }
        if(this.IsDisable){
            tempFB.get("AttrValue").disable();
        }

        switch (generateAttrContentObj.AttrInputType) {
            case this.AttrInputTypeRefMaster:
                await this.SetAttrLookup(generateAttrContentObj);
                break;
            case this.AttrInputTypeList:
                this.SetAttrQuestion(generateAttrContentObj.AttrCode, generateAttrContentObj.AttrQuestionValue);
                break;
        }
        tempFB.updateValueAndValidity();

        return tempFB;
    }

    private async SetAttrLookup(generateAttrContentObj: RefAttrGenerateObj) {
        let RefAttrCode: string = generateAttrContentObj.AttrCode;
        this.DictAttrLookup[RefAttrCode] = new InputLookupObj();
        this.DictAttrLookup[RefAttrCode].isReady = false;
        this.DictAttrLookup[RefAttrCode].urlJson = "./assets/uclookup/lookupRefMaster.json";
        this.DictAttrLookup[RefAttrCode].pagingJson = "./assets/uclookup/lookupRefMaster.json";
        this.DictAttrLookup[RefAttrCode].genericJson = "./assets/uclookup/lookupRefMaster.json";
        this.DictAttrLookup[RefAttrCode].title = generateAttrContentObj.AttrName;
        if (generateAttrContentObj.IsMandatory) {
            this.DictAttrLookup[RefAttrCode].isRequired = true;
        }
        else {
            this.DictAttrLookup[RefAttrCode].isRequired = false;
        }
        this.DictAttrLookup[RefAttrCode].isReadonly = this.IsDisable;        

        let arrAddCrit = new Array();
        let critAssetObj = new CriteriaObj();
        critAssetObj.DataType = 'text';
        critAssetObj.restriction = AdInsConstant.RestrictionEq;
        critAssetObj.propName = 'REF_MASTER_TYPE_CODE';
        critAssetObj.value = generateAttrContentObj.MasterTypeCode;
        arrAddCrit.push(critAssetObj);
        this.DictAttrLookup[RefAttrCode].addCritInput = arrAddCrit;

        if (generateAttrContentObj.AttrValue != null && generateAttrContentObj.AttrValue != "") {
            let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
                RefMasterTypeCode: generateAttrContentObj.MasterTypeCode,
                MasterCode: generateAttrContentObj.AttrValue
            };
            await this.http.post(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
                (response: KeyValueObj) => {
                    this.DictAttrLookup[RefAttrCode].nameSelect = response.Value;
                    this.DictAttrLookup[RefAttrCode].jsonSelect = { Descr: response.Value };
                });
        }

        this.DictAttrLookup[RefAttrCode].isReady = true;
    }

    private SetAttrQuestion(attrCode: string, listQuestion: Array<KeyValueObj>) {
        this.DictAttrList[attrCode] = listQuestion;
    }

    RefreshAttr() {
        this.Callback.emit("refresh");
    }
}