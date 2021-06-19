import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { LtkmCustGrpObj } from 'app/shared/model/LTKM/LtkmCustGrpObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { CustObj } from 'app/shared/model/CustObj.Model';

@Component({
    selector: 'app-ltkm-cust-grp-member',
    templateUrl: './cust-grp-member.component.html',
    styles: [
        '.disabledLink { color: #ccc; pointer-events:none;}'
    ],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class LtkmCustGrpMemberComponent implements OnInit {
    @Input() isLockMode: boolean = false;
    @Input() enjiForm: NgForm;
    @Input() parentForm: FormGroup;
    @Input() identifier: string;
    @Input() ltkmCustGrpObjs: Array<LtkmCustGrpObj>;

    custDataObj: CustDataObj;
    dictLookup: { [key: string]: InputLookupObj; } = {};
    CustRelationshipObjs: Array<{ list: Array<KeyValueObj> }> = new Array();

    CustRelationshipPersonalObj: Array<KeyValueObj>;
    CustRelationshipCompanyObj: Array<KeyValueObj>;
    defaultCustRelationshipPersonalCode: string;
    defaultCustRelationshipCompanyCode: string;

    InputLookupCustomerObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
    lookupCustomerIdentifiers: Array<string> = new Array<string>();
    custMasterObj: CustObj;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient) {

    }

    async ngOnInit(): Promise<void> {

        this.parentForm.removeControl(this.identifier);
        this.parentForm.addControl(this.identifier, this.fb.array([]));
        this.CustRelationshipObjs.splice(0, 1);

        await this.bindCustRelationshipPersonalObj();
        await this.bindCustRelationshipCompanyObj();
        await this.bindAppGrp();
    }

    addCustGrp() {
        var custSocmedObjs = this.parentForm.controls[this.identifier] as FormArray;
        var length = this.parentForm.value[this.identifier].length;
        var max: number = 0;
        if (length > 0) {
            max = this.parentForm.value[this.identifier][length - 1].No;
        }
        custSocmedObjs.push(this.addGroup(undefined, max + 1));

        var InputLookupCustomerObj = this.initLookup();
        this.InputLookupCustomerObjs.push(InputLookupCustomerObj);
        this.dictLookup[max + 1] = InputLookupCustomerObj;

        this.CustRelationshipObjs.push({ list: [] });
    }

    deleteCustGrp(i: number) {
        if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
            var custCustGrpObjs = this.parentForm.controls[this.identifier] as FormArray;
            var no = custCustGrpObjs.controls[i]["controls"]["No"].value;
            this.parentForm.removeControl("lookupCustomerForGrp" + no);
            custCustGrpObjs.removeAt(i);
            this.CustRelationshipObjs.splice(i, 1);
        }
    }

    initLookup(): InputLookupObj {
        var InputLookupCustomerObj = new InputLookupObj();
        InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustGrp.json";
        InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
        InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
        InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustGrp.json";
        InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustGrp.json";

        InputLookupCustomerObj.ddlEnvironments = [
            {
                name: "C.MR_CUST_TYPE_CODE",
                environment: environment.FoundationR3Url
            },
        ];

        if (this.isLockMode) {
            InputLookupCustomerObj.isDisable = true;
            InputLookupCustomerObj.isRequired = false;
        }

        return InputLookupCustomerObj;
    }

    CopyCustomer(event, i: number) {
        this.parentForm.controls[this.identifier]["controls"][i].patchValue({
            CustNo: event.CustNo,
            CustName: event.CustName
        });

        // jika ada pihak yg tipenya company maka pake relasi company
        if (this.identifier == 'custGrpMemberCompany' || this.identifier == CommonConstant.CustTypeCompany || event.MrCustTypeCode == CommonConstant.CustTypeCompany) {
            this.CustRelationshipObjs[i].list = this.CustRelationshipCompanyObj;
            this.parentForm.controls[this.identifier]["controls"][i].patchValue({
                MrCustRelationshipCode: this.defaultCustRelationshipCompanyCode
            });
        }
        else {
            this.CustRelationshipObjs[i].list = this.CustRelationshipPersonalObj;
            this.parentForm.controls[this.identifier]["controls"][i].patchValue({
                MrCustRelationshipCode: this.defaultCustRelationshipPersonalCode
            });
        }
    }

    async bindAppGrp() {
        if (this.ltkmCustGrpObjs != undefined) {
            for (let i = 0; i < this.ltkmCustGrpObjs.length; i++) {
                var listCustGrp = this.parentForm.controls[this.identifier] as FormArray;
                listCustGrp.push(this.addGroup(this.ltkmCustGrpObjs[i], i));

                var InputLookupCustomerObj = this.initLookup();
                this.dictLookup[i] = InputLookupCustomerObj;
                this.InputLookupCustomerObjs.push(InputLookupCustomerObj);
                await this.setCustNameAndCustRelationship(i, this.ltkmCustGrpObjs[i].CustNo);
            }
        }
    }

    copyAppGrp() {
        var custCustGrpObjs = this.parentForm.controls[this.identifier] as FormArray;
        for (let i = 0; i < custCustGrpObjs.controls.length; i++) {
            var no = custCustGrpObjs.controls[i]["controls"]["No"].value;
            this.parentForm.removeControl("lookupCustomerForGrp" + no);
        }
        this.parentForm.removeControl(this.identifier);
        this.parentForm.addControl(this.identifier, this.fb.array([]));
        this.bindAppGrp();
    }

    addGroup(appCustGrpObj: LtkmCustGrpObj, i: number) {
        if (this.isLockMode) {
            if (appCustGrpObj == undefined) {
                return this.fb.group({
                    No: [i],
                    CustNo: [''],
                    CustName: [''],
                    MrCustRelationshipCode: [''],
                    CustGrpNotes: [''],
                    //IsReversible: [false]
                })
            } else {
                return this.fb.group({
                    No: [i],
                    CustNo: [appCustGrpObj.CustNo],
                    CustName: [''],
                    MrCustRelationshipCode: [appCustGrpObj.MrCustRelationshipCode],
                    CustGrpNotes: [appCustGrpObj.CustGrpNotes],
                    //IsReversible: [appCustGrpObj.IsReversible == null ? false : appCustGrpObj.IsReversible],
                })
            }
        } else {
            if (appCustGrpObj == undefined) {
                return this.fb.group({
                    No: [i],
                    CustNo: ['', [Validators.required, Validators.maxLength(50)]],
                    CustName: [''],
                    MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
                    CustGrpNotes: ['', [Validators.maxLength(4000)]],
                    //IsReversible: [false]
                })
            } else {
                return this.fb.group({
                    No: [i],
                    CustNo: [appCustGrpObj.CustNo, [Validators.required, Validators.maxLength(50)]],
                    CustName: [''],
                    MrCustRelationshipCode: [appCustGrpObj.MrCustRelationshipCode, [Validators.required, Validators.maxLength(50)]],
                    CustGrpNotes: [appCustGrpObj.CustGrpNotes, [Validators.maxLength(4000)]],
                    //IsReversible: [appCustGrpObj.IsReversible == null ? false : appCustGrpObj.IsReversible],
                })
            }
        }
    }

    async setCustNameAndCustRelationship(i: number, custNo: string) {
        await this.http.post(URLConstant.GetCustByCustNo, { CustNo: custNo }).toPromise().then(
            (response: CustObj) => {
                this.custMasterObj = response;
                this.dictLookup[i].nameSelect = response["CustName"];
                this.dictLookup[i].jsonSelect = response;
                this.InputLookupCustomerObjs[i].jsonSelect = response;

                if (response["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
                    this.CustRelationshipObjs.push({ list: this.CustRelationshipPersonalObj });
                }

                if (response["MrCustTypeCode"] == CommonConstant.CustTypeCompany) {
                    this.CustRelationshipObjs.push({ list: this.CustRelationshipCompanyObj });
                }

                this.parentForm.controls[this.identifier]["controls"][i].patchValue({
                    CustNo: custNo,
                    CustName: response["CustName"]
                });
            });
    }


    async bindCustRelationshipPersonalObj() {
        await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship }).toPromise().then(
            (response) => {
                this.CustRelationshipPersonalObj = response[CommonConstant.ReturnObj];
                if (this.CustRelationshipPersonalObj.length > 0) {
                    this.defaultCustRelationshipPersonalCode = this.CustRelationshipPersonalObj[0].Key;
                }
            }
        );
    }

    async bindCustRelationshipCompanyObj() {
        await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustCompanyRelationship }).toPromise().then(
            (response) => {
                this.CustRelationshipCompanyObj = response[CommonConstant.ReturnObj];
                if (this.CustRelationshipCompanyObj.length > 0) {
                    this.defaultCustRelationshipCompanyCode = this.CustRelationshipCompanyObj[0].Key;
                }
            }
        );
    }

}
