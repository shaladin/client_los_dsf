import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ResRefEmpObj } from 'app/shared/model/Response/RefEmp/ResRefEmpObj.model';

@Component({
    selector: 'app-ltkm-request-analysis',
    templateUrl: './ltkm-request-analysis.component.html',
    styleUrls: [],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

export class LtkmRequestAnalysisComponent implements OnInit {
    //urs-los-054 variable
    readonly MasterLevelIndication = CommonConstant.RefMasterTypeCodeLevelIndication;
    readonly MasterSourceIndication = CommonConstant.RefMasterTypeCodeSourceIndication;
    readonly MasterSuspciousFor = CommonConstant.RefMasterTypeCodeSuspciousFor;
    readonly MasterSuspciousTrxDueTo = CommonConstant.RefMasterTypeCodeSuspciousTrxDueTo;
    DictRefMaster: Array<KeyValueObj> = new Array<KeyValueObj>();
    refOfficeObj: RefOfficeObj;
    listRefOffice: Array<KeyValueObj>;
    user: any;
    allInSalesOffice: Array<ResRefEmpObj> = new Array<ResRefEmpObj>();

    @Input() enjiForm: NgForm;
    @Input() parentForm: FormGroup;
    @Input() identifier: string;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private toastr: NGXToastrService,
        private route: ActivatedRoute,
        private cookieService: CookieService) {
    }

    async ngOnInit(): Promise<void> {
        this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        this.parentForm.removeControl(this.identifier);
        this.parentForm.addControl(this.identifier, this.fb.group({
            MrSuspiciousTrxDueToCode: ['', Validators.required],
            MrSuspiciousForCode: ['', Validators.required],
            MrSourceIndicationCode: ['', Validators.required],
            MrLevelIndicationCode: ['', Validators.required],
            Notes: [''],
            OfficeCode: ['', Validators.required],
            OfficeName: [''],
            EmpNo: ['', Validators.required],
            EmpName: ['']
        }));
        //urs-los-054 set refmaster
        await this.getRefMaster();
        await this.GetOfficeDDL();
    }
    //urs-los-054 set refmaster
    async getRefMaster() {
        await this.GetListActiveRefMaster(this.MasterLevelIndication);
        await this.GetListActiveRefMaster(this.MasterSourceIndication);
        await this.GetListActiveRefMaster(this.MasterSuspciousFor);
        await this.GetListActiveRefMaster(this.MasterSuspciousTrxDueTo);
    }

    async GetListActiveRefMaster(RefMasterTypeCode: string) {
        await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: RefMasterTypeCode }).toPromise().then(
            (response) => {
                this.DictRefMaster[RefMasterTypeCode] = response[CommonConstant.ReturnObj];
            });
    }

    OfficeChanged() {
        var OfficeCode = this.parentForm.controls[this.identifier]["controls"].OfficeCode.value;
        var result = this.listRefOffice.find(x => x.Key == OfficeCode);
        this.parentForm.controls[this.identifier].patchValue({
            OfficeName: result.Value
        });
        this.updateSalesOfficer();
    }

    EmpChanged() {
        var EmpNo = this.parentForm.controls[this.identifier]["controls"].EmpNo.value;
        var result = this.allInSalesOffice.find(x => x.EmpNo == EmpNo);
        this.parentForm.controls[this.identifier].patchValue({
            EmpName: result.EmpName
        });
    }

    updateSalesOfficer() {
        var OfficeCode = this.parentForm.controls[this.identifier]["controls"].OfficeCode.value;
        this.http.post(URLConstant.GetListRefEmpByGsValueandOfficeCode, { OfficeCode: OfficeCode }).subscribe(
            (response) => {
                this.allInSalesOffice = response[CommonConstant.ReturnObj];
            });
    }

    async GetOfficeDDL() {
        await this.http.post(URLConstant.GetListKvpActiveRefOfficeForPaging, {}).subscribe(
            (response) => {
                this.listRefOffice = response[CommonConstant.ReturnObj];
                if (this.user.MrOfficeTypeCode == "CG" || this.user.MrOfficeTypeCode == CommonConstant.HeadOffice) {

                }
                else {
                    this.parentForm.controls[this.identifier]["controls"].OfficeCode.disable();
                    this.parentForm.controls[this.identifier].patchValue({
                        OfficeCode: this.user.OfficeCode,
                        OfficeName: this.user.OfficeName
                    });

                    this.updateSalesOfficer();
                }
            });
    }
}
