import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppSubsidyObj } from 'app/shared/model/app-subsidy-obj.model';
import { AppFeeObj } from 'app/shared/model/app-fee-obj.model';
import { AppFinDataObj } from 'app/shared/model/app-fin-data/app-fin-data.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { InstallmentObj } from 'app/shared/model/app-fin-data/installment-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';

@Component({
    selector: "view-ltkm-app-summary-data",
    templateUrl: "./ltkm-app-summary-data.component.html",
    providers: [NGXToastrService]
})

export class ViewLtkmAppSummaryDataComponent implements OnInit {
    @Input() AppId: number = 0;

    totalInsPremi: number;
    totalRsvFund: number;
    SummaryObj: any;
    installmentScheme: string;
    firstInstType: string;

    constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
    }

    ngOnInit() {
        this.GetAppSummary();
    }

    GetAppSummary() {
        this.http.post(URLConstant.GetAppSummaryByAppId, { Id: this.AppId }).subscribe(
            (response) => {
                this.SummaryObj = response;
                if (this.SummaryObj.AppIns != null) {
                    this.totalInsPremi = this.SummaryObj.AppIns.TotalInscoMainPremiAmt + this.SummaryObj.AppIns.TotalInscoAddPremiAmt + this.SummaryObj.AppIns.InscoAdminFeeAmt;
                }
                this.GetDescrByCode();
            }
        );
    }

    GetDescrByCode() {
        var obj: ReqRefMasterByTypeCodeAndMasterCodeObj = {
            RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInstSchm,
            MasterCode: this.SummaryObj.AppFinData.MrInstSchemeCode
        }
        this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, obj).subscribe(
            (response) => {
                this.installmentScheme = response["Descr"];
            });

        var objFirstInstType: ReqRefMasterByTypeCodeAndMasterCodeObj = {
            RefMasterTypeCode: CommonConstant.RefMasterTypeCodeFirstInstType,
            MasterCode: this.SummaryObj.App.MrFirstInstTypeCode
        }
        this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, objFirstInstType).subscribe(
            (response) => {
                this.firstInstType = response["Descr"];
            });

        var objAssetUsage: ReqRefMasterByTypeCodeAndMasterCodeObj = {
            RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetUsage,
            MasterCode: this.SummaryObj.AppAsset.MrAssetUsageCode
        }
        this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, objAssetUsage).subscribe(
            (response) => {
                this.SummaryObj.AppAsset.MrAssetUsageCode = response["Descr"];
            });

        var objInsPaidBy: ReqRefMasterByTypeCodeAndMasterCodeObj = {
            RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsPaidBy,
            MasterCode: this.SummaryObj.AppIns.InsAssetPaidBy
        }
        this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, objInsPaidBy).subscribe(
            (response) => {
                this.SummaryObj.AppIns.InsAssetPaidBy = response["Descr"];
            });    
    }
}