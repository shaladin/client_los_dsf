import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppReservedFundObj } from 'app/shared/model/AppReservedFundObj.model';
import { AllAppReservedFundObj } from 'app/shared/model/AllAppReservedFundObj.model';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';



@Component({
  selector: "reserved-fund",
  templateUrl: "./reserved-fund.component.html",
  providers: [NGXToastrService]
})
export class ReservedFundComponent implements OnInit {

  getAppFeeUrl: any;
  getAppRsvFundUrl: any;
  getAppRsvFundRuleUrl: any;
  getMaxAllocAmtRsvFundUrl: any;
  addEditRsvFundUrl: any;

  RsvForm = this.fb.group({
    ReservedFundObjs: this.fb.array([])
  });

  @Input() ReturnHandlingHObj: ReturnHandlingHObj;
  @Output() outputTab: EventEmitter<AllAppReservedFundObj> = new EventEmitter();

  appReservedFundObjs: Array<AppReservedFundObj>;
  allAppReservedFundObj: AllAppReservedFundObj = new AllAppReservedFundObj();
  isCalculated: boolean = false;
  uppingRate: any;
  insuranceIncome: any;
  lifeInsuranceIncome: any;
  appFeeObj: any;
  ruleObj: any;
  calcGrossYieldObj: any;
  maxAllocatedAmt: any;
  remainingAllocatedAmt: any;
  totalRsvFundAmt: number = 0;
  totalRsvFundAmtWhenSave: any;
  grossYield: any;
  show: boolean = false;
  maxAllocatedRefundAmt: number = 0;
  totalExpenseAmt: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params["WfTaskListId"] != null) {
        this.allAppReservedFundObj.WfTaskIdListId = params["WfTaskListId"];
      }
    });
  }

  initUrl() {
    this.getAppFeeUrl = AdInsConstant.GetListAppFeeByAppId;
    this.getAppRsvFundUrl = AdInsConstant.GetListAppReservedFundByAppId;
    this.addEditRsvFundUrl = AdInsConstant.AddEditAppReservedFund;
    this.getAppRsvFundRuleUrl = AdInsConstant.CreateRsvFundRule;
    this.getMaxAllocAmtRsvFundUrl = AdInsConstant.CreateMaxAllocAmtRsvFund;
  }

  ngOnInit() {
    this.allAppReservedFundObj = new AllAppReservedFundObj();
    this.initUrl();
    var appObj = {
      AppId: this.ReturnHandlingHObj.AppId,
    };
    this.GetAppRsvFundRule(appObj);
    this.GetAppFinData(appObj);
    this.GetMaxAllocAmt(appObj);
    this.GetAppFee(appObj);
    this.GetAppCust(appObj);
  }

  SaveForm() {
    if (this.isCalculated == false) {
      this.toastr.errorMessage("Please Calculate First");
    }
    else {
      this.calculating()
      if (this.totalRsvFundAmtWhenSave != this.totalRsvFundAmt)
      {
        this.toastr.errorMessage("Please Calculate Again");
      }
      else if (this.maxAllocatedAmt < this.totalRsvFundAmt) {
        this.toastr.errorMessage("Total Reserved Fund Amount Must be Less Than Remaining Allocated Amount");
      }
      else {
        var lobCode = localStorage.getItem("BizTemplateCode");
        this.setAppReservedFundData();
        this.http.post(this.addEditRsvFundUrl, this.allAppReservedFundObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.allAppReservedFundObj.ReturnHandlingHId != 0 && this.allAppReservedFundObj.ReturnHandlingHId != undefined) {
              this.outputTab.emit(this.allAppReservedFundObj);
            } else {
              this.router.navigate(["/Nap/CreditProcess/CommissionReservedFund/Paging"], { queryParams: { BizTemplateCode: lobCode } })
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }

  setAppReservedFundData() {
    this.allAppReservedFundObj.AppId = this.ReturnHandlingHObj.AppId;
    this.allAppReservedFundObj.ReturnHandlingHId = this.ReturnHandlingHObj.ReturnHandlingHId;
    this.allAppReservedFundObj.WfTaskIdListId = this.ReturnHandlingHObj.WfTaskListId;
    this.allAppReservedFundObj.GrossYield = this.grossYield;
    this.allAppReservedFundObj.TotalReservedFundAmt = this.totalRsvFundAmt;
    this.allAppReservedFundObj.RequestAppReservedFundObjs = new Array<AppReservedFundObj>();
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var appReservedFundObj = new AppReservedFundObj();
      appReservedFundObj.AppId = this.ReturnHandlingHObj.AppId;
      appReservedFundObj.MrReservedFundSourceCode = this.RsvForm.controls["ReservedFundObjs"].value[i].MrReservedFundSourceCode;
      appReservedFundObj.MrReservedFundCode = this.RsvForm.controls["ReservedFundObjs"].value[i].MrReservedFundCode;
      appReservedFundObj.ReservedFundAmt = this.RsvForm.controls["ReservedFundObjs"].value[i].ReservedFundAmt;
      appReservedFundObj.StdReservedFundAmt = this.RsvForm.controls["ReservedFundObjs"].value[i].StdReservedFundAmt;
      appReservedFundObj.Behaviour = this.RsvForm.controls["ReservedFundObjs"].value[i].Behaviour;
      this.allAppReservedFundObj.RequestAppReservedFundObjs.push(appReservedFundObj);
    }
  }

  GetAppFinData(appObj) {
    this.http.post(AdInsConstant.GetIncomeInfoRsvFund, appObj).subscribe(
      (response) => {
        console.log(response);
        this.uppingRate = response["DiffRateAmt"];
        this.insuranceIncome = response["TotalInsCustAmt"] - response["TotalInsInscoAmt"];
        this.lifeInsuranceIncome = response["TotalLifeInsCustAmt"] - response["TotalLifeInsInscoAmt"];
        this.maxAllocatedRefundAmt = response["MaxAllocatedRefundAmt"];
        this.totalExpenseAmt = response["TotalExpenseAmt"];
        this.totalRsvFundAmt = response["ReservedFundAllocatedAmt"];
        this.calculatedRemainingAmt();
      }
    );
  }

  calculatedRemainingAmt() {
    this.remainingAllocatedAmt = this.maxAllocatedRefundAmt - this.totalExpenseAmt - this.totalRsvFundAmt;
  }

  GetAppFee(appObj) {
    this.http.post(this.getAppFeeUrl, appObj).subscribe(
      (response) => {
        this.appFeeObj = response["ReturnObject"];

      }
    );
  }


  GetAppCust(appObj) {
    this.http.post<AppCustObj>(AdInsConstant.GetAppCustByAppId, appObj).subscribe(
      (response) => {
        if (response.MrCustTypeCode == AdInsConstant.CustTypeCompany) {
          this.allAppReservedFundObj.IsPersonal = false
        }
      }
    )
  }

  GetMaxAllocAmt(appObj) {
    this.http.post(this.getMaxAllocAmtRsvFundUrl, appObj).subscribe(
      (response) => {
        console.log(response);
        this.maxAllocatedAmt = response["MaxRefundAmount"];
      }
    );
  }

  GetAppRsvFundRule(appObj) {
    this.http.post(this.getAppRsvFundRuleUrl, appObj).subscribe(
      (response) => {
        this.ruleObj = response;
        console.log(this.ruleObj);
        this.appReservedFundObjs = new Array<AppReservedFundObj>();
        for (let i = 0; i < this.ruleObj.length; i++) {
          var appReservedFundObj = new AppReservedFundObj();
          appReservedFundObj.AppId = this.ReturnHandlingHObj.AppId;
          appReservedFundObj.MrReservedFundSourceCode = this.ruleObj[i].AllocationFrom;
          appReservedFundObj.MrReservedFundCode = this.ruleObj[i].AllocationTo;
          appReservedFundObj.ReservedFundAmt = this.ruleObj[i].AllocationAmount;
          appReservedFundObj.StdReservedFundAmt = this.ruleObj[i].AllocationStdAmount;
          appReservedFundObj.Behaviour = this.ruleObj[i].AllocationBehaviour;
          appReservedFundObj.MrReservedFundSourceName = this.ruleObj[i].AllocationFromName;
          this.appReservedFundObjs.push(appReservedFundObj);
          //this.RsvForm.controls['ReservedFundObjs']['controls'][i]['controls'].ReservedFundAmt = this.ruleObj[i].AllocationAmount;

        }
        for (let j = 0; j < this.appReservedFundObjs.length; j++) {
          var listAppRsvFunds = this.RsvForm.controls["ReservedFundObjs"] as FormArray;
          listAppRsvFunds.push(this.addGroup(this.appReservedFundObjs[j], j));
        }
      }

    );
  }

  addGroup(appReservedFundObjs, i) {
    return this.fb.group({
      No: [i],
      MrReservedFundSourceCode: [appReservedFundObjs.MrReservedFundSourceCode],
      MrReservedFundCode: [appReservedFundObjs.MrReservedFundCode],
      ReservedFundAmt: [appReservedFundObjs.ReservedFundAmt, Validators.required],
      StdReservedFundAmt: [appReservedFundObjs.StdReservedFundAmt],
      Behaviour: [appReservedFundObjs.Behaviour],
      MrReservedFundSourceName: [appReservedFundObjs.MrReservedFundSourceName]
    })

  }

  calculated() {
    this.totalRsvFundAmt = 0;
    var appObj = {
      AppId: this.ReturnHandlingHObj.AppId,
    };
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var temp: number = +this.RsvForm.controls["ReservedFundObjs"].value[i].ReservedFundAmt;
      //temp = this.RsvForm.controls["ReservedFundAmt" + i].value.replace(/\D/g, "");
      this.totalRsvFundAmt = this.totalRsvFundAmt + temp;
    }
    var grossyieldObj = {
      AppId: this.ReturnHandlingHObj.AppId,
      TotalReserveFundAmt: this.totalRsvFundAmt
    };

    this.calculatedRemainingAmt();
    this.http.post(AdInsConstant.CalculateGrossYieldRsvFund, grossyieldObj).subscribe(
      (response) => {
        this.calcGrossYieldObj = response;
        this.grossYield = this.calcGrossYieldObj.GrossYieldPrcnt;

      }
    );
    this.isCalculated = true;
  }

  calculating() {
    this.totalRsvFundAmtWhenSave = 0;
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var temp: number = +this.RsvForm.controls["ReservedFundObjs"].value[i].ReservedFundAmt;
      //temp = this.RsvForm.controls["ReservedFundAmt" + i].value.replace(/\D/g, "");
      this.totalRsvFundAmtWhenSave = this.totalRsvFundAmtWhenSave + temp;
    }
  }

  test() {
    this.setAppReservedFundData();
    console.log(this.RsvForm);
    console.log(this.allAppReservedFundObj);
  }

  InputChanged() {
    this.isCalculated = false;
  }
}
