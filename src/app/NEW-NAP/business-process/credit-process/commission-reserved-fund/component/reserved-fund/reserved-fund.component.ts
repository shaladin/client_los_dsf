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

  getAppFinDataUrl: any;
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
  maxAllocatedAmt: any;
  remainingAllocatedAmt: any;
  totalRsvFundAmt: any;
  grossYield: any;
  show: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params["WfTaskListId"] != null) {
        this.allAppReservedFundObj.WfTaskIdListId = params["WfTaskListId"];
      }
    });
  }

  initUrl() {
    this.getAppFinDataUrl = AdInsConstant.GetAppFinDataByAppId;
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
      if (this.maxAllocatedAmt < this.totalRsvFundAmt) {
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
    this.allAppReservedFundObj.RequestAppReservedFundObjs = new Array<AppReservedFundObj>();
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var appReservedFundObj = new AppReservedFundObj();
      appReservedFundObj.AppId = this.ReturnHandlingHObj.AppId;
      appReservedFundObj.MrReservedFundSourceCode = this.RsvForm.controls["ReservedFundObjs"].value[i].MrReservedFundSourceCode;
      appReservedFundObj.MrReservedFundCode = this.RsvForm.controls["ReservedFundObjs"].value[i].MrReservedFundCode;
      appReservedFundObj.ReservedFundAmt = this.RsvForm.controls["ReservedFundAmt" + i].value.replace(/\D/g, "");
      appReservedFundObj.StdReservedFundAmt = this.RsvForm.controls["ReservedFundObjs"].value[i].StdReservedFundAmt;
      appReservedFundObj.Behaviour = this.RsvForm.controls["ReservedFundObjs"].value[i].Behaviour;
      this.allAppReservedFundObj.RequestAppReservedFundObjs.push(appReservedFundObj);
    }
  }

  GetAppFinData(appObj) {
    this.http.post(this.getAppFinDataUrl, appObj).subscribe(
      (response) => {
        console.log(response);
        this.uppingRate = response["DiffRateAmt"];
        this.insuranceIncome = response["TotalInsCustAmt"] - response["TotalInsInscoAmt"];
        this.lifeInsuranceIncome = response["TotalLifeInsCustAmt"] - response["TotalLifeInsInscoAmt"];
        this.remainingAllocatedAmt = response["MaxAllocatedRefundAmt"] - response["CommissionAllocatedAmt"] - response["ReservedFundAllocatedAmt"];
      }
    );
  }

  GetAppFee(appObj) {
    this.http.post(this.getAppFinDataUrl, appObj).subscribe(
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
      Behaviour: [appReservedFundObjs.Behaviour]
    })

  }

  calculated() {
    this.totalRsvFundAmt = 0;
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var temp: number = +this.RsvForm.controls["ReservedFundAmt" + i].value.replace(/\D/g, "");
      //temp = this.RsvForm.controls["ReservedFundAmt" + i].value.replace(/\D/g, "");
      this.totalRsvFundAmt = this.totalRsvFundAmt + temp;
    }
    this.isCalculated = true;
  }

  calculating() {
    this.totalRsvFundAmt = 0;
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var temp: number = +this.RsvForm.controls["ReservedFundAmt" + i].value.replace(/\D/g, "");
      //temp = this.RsvForm.controls["ReservedFundAmt" + i].value.replace(/\D/g, "");
      this.totalRsvFundAmt = this.totalRsvFundAmt + temp;
    }
  }

  test() {
    this.setAppReservedFundData();
    console.log(this.RsvForm);
    console.log(this.allAppReservedFundObj);
  }
}
