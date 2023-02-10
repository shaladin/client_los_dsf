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
    CustomerModel: string = '-';
    TotalMonthlyExpense: number = 0;
    MrWopCode: string = '-';
    MrWopDescr: string = '-';

    isAppAssetNull: boolean = false;
    AssetName: string = '-';
    AssetPrice: number = 0;
    AssetCondition: string = '-';
    DPAmount: number = 0;
    DPPercentage: number = 0;
    AssetUsage: string = '-';
    ManufacturingYear: string = '-';
    Color: string = '-';
    SupplierName: string = '-';
    SalesPerson: string = '-';
    AdminHead: string = '-';
    BranchManager: string = '-';


    constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
    }

    ngOnInit() {
        this.GetAppSummary();
    }

    GetAppSummary() {
        this.http.post(URLConstant.GetAppSummaryByAppId, { Id: this.AppId }).subscribe(
            (response) => {
                this.SummaryObj = response;
                if(this.SummaryObj.App != null){
                    this.MrWopCode = this.SummaryObj.App.MrWopCode;
                }
                if (this.SummaryObj.AppIns != null) {
                    this.totalInsPremi = this.SummaryObj.AppIns.TotalInscoMainPremiAmt + this.SummaryObj.AppIns.TotalInscoAddPremiAmt + this.SummaryObj.AppIns.InscoAdminFeeAmt;
                }
                if(this.SummaryObj.AppCustPersonalFinData != null){
                    this.TotalMonthlyExpense = this.SummaryObj.AppCustPersonalFinData.MonthlyExpenseAmt;
                }
                if(this.SummaryObj.AppAsset != null){
                    this.isAppAssetNull = true;
                    if(this.SummaryObj.AppAsset.FullAssetName != undefined && this.SummaryObj.AppAsset.FullAssetName != null){
                        this.AssetName = this.SummaryObj.AppAsset.FullAssetName;
                    }
                    if(this.SummaryObj.AppAsset.AssetPriceAmt != undefined && this.SummaryObj.AppAsset.AssetPriceAmt != null){
                        this.AssetPrice = this.SummaryObj.AppAsset.AssetPriceAmt;
                    }
                    if(this.SummaryObj.AppAsset.MrAssetConditionCode != undefined && this.SummaryObj.AppAsset.MrAssetConditionCode != null){
                        this.AssetCondition = this.SummaryObj.AppAsset.MrAssetConditionCode;
                    }
                    if(this.SummaryObj.AppAsset.DownPaymentAmt != undefined && this.SummaryObj.AppAsset.DownPaymentAmt != null){
                        this.DPAmount = this.SummaryObj.AppAsset.DownPaymentAmt;
                    }
                    if(this.SummaryObj.AppAsset.DownPaymentPrcnt != undefined && this.SummaryObj.AppAsset.DownPaymentPrcnt != null){
                        this.DPPercentage = this.SummaryObj.AppAsset.DownPaymentPrcnt;
                    }
                    if(this.SummaryObj.AppAsset.MrAssetUsageCodeDesc != undefined && this.SummaryObj.AppAsset.MrAssetUsageCodeDesc != null){
                        this.AssetUsage = this.SummaryObj.AppAsset.MrAssetUsageCodeDesc;
                    }
                    if(this.SummaryObj.AppAsset.ManufacturingYear != undefined && this.SummaryObj.AppAsset.ManufacturingYear != null){
                        this.ManufacturingYear = this.SummaryObj.AppAsset.ManufacturingYear;
                    }
                    if(this.SummaryObj.AppAsset.Color != undefined && this.SummaryObj.AppAsset.Color != null){
                        this.Color = this.SummaryObj.AppAsset.Color;
                    }
                    if(this.SummaryObj.AppAsset.SupplName != undefined && this.SummaryObj.AppAsset.SupplName != null){
                        this.SupplierName = this.SummaryObj.AppAsset.SupplName;
                    }

                    this.AssetCondition = this.SummaryObj.AppAsset.MrAssetConditionCode;
                    this.DPAmount = this.SummaryObj.AppAsset.DownPaymentAmt;
                    this.DPPercentage = this.SummaryObj.AppAsset.DownPaymentPrcnt;
                    this.AssetUsage = this.SummaryObj.AppAsset.MrAssetUsageCodeDesc;
                    this.ManufacturingYear = this.SummaryObj.AppAsset.ManufacturingYear;
                    this.Color = this.SummaryObj.AppAsset.Color;
                    this.SupplierName = this.SummaryObj.AppAsset.SupplName;
                }
                if(this.SummaryObj.AppAssetEmpList != null){
                    if(this.SummaryObj.AppAssetEmpList.SalesPerson != undefined && this.SummaryObj.AppAssetEmpList.SalesPerson != null){
                        this.SalesPerson = this.SummaryObj.AppAssetEmpList.SalesPerson;
                    }
                    if(this.SummaryObj.AppAssetEmpList.AdminHead != undefined && this.SummaryObj.AppAssetEmpList.AdminHead != null){
                        this.AdminHead = this.SummaryObj.AppAssetEmpList.AdminHead;
                    }
                    if(this.SummaryObj.AppAssetEmpList.BranchManager != undefined && this.SummaryObj.AppAssetEmpList.BranchManager != null){
                        this.BranchManager = this.SummaryObj.AppAssetEmpList.BranchManager;
                    }
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

        if(this.SummaryObj.AppAsset != null && this.SummaryObj.AppAsset.MrAssetUsageCode != undefined){
            var objAssetUsage: ReqRefMasterByTypeCodeAndMasterCodeObj = {
                RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetUsage,
                MasterCode: this.SummaryObj.AppAsset.MrAssetUsageCode
            }
            this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, objAssetUsage).subscribe(
                (response) => {
                    this.SummaryObj.AppAsset.MrAssetUsageCode = response["Descr"];
                });
        }

        if(this.SummaryObj.AppIns != null && this.SummaryObj.AppIns.InsAssetPaidBy != undefined){
            var objInsPaidBy: ReqRefMasterByTypeCodeAndMasterCodeObj = {
                RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsPaidBy,
                MasterCode: this.SummaryObj.AppIns.InsAssetPaidBy
            }
            this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, objInsPaidBy).subscribe(
                (response) => {
                    this.SummaryObj.AppIns.InsAssetPaidBy = response["Descr"];
                });
        }

        var objCustModel = {
            code: this.SummaryObj.AppCust.MrCustModelCode
        }
        this.http.post(URLConstant.GetRefMasterByMasterCode, objCustModel).subscribe(
            (response) => {
                this.CustomerModel = response["Descr"];
            });

        if(this.SummaryObj.App != null){
            var objWopCode = {
                code: this.MrWopCode
            }
            this.http.post(URLConstant.GetRefMasterByMasterCode, objWopCode).subscribe(
                (response) => {
                    this.MrWopDescr = response["Descr"];
                });
        }
    }
}
