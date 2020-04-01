import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { environment } from '../../../../environments/environment';
import { AppReservedFundObj } from '../../../shared/model/AppReservedFundObj.model';
import { AllAppReservedFundObj } from '../../../shared/model/AllAppReservedFundObj.model';



@Component({
  selector: "reserved-fund-view",
  templateUrl: "./reserved-fund-view.component.html",
  providers: [NGXToastrService]
})
export class RsvFundViewComponent implements OnInit {

  getAppFinDataUrl: any;
  getAppFeeUrl: any;
  getAppRsvFundUrl: any;
  getAppRsvFundRuleUrl: any;
  addEditRsvFundUrl: any;

  RsvForm = this.fb.group({
    ReservedFundObjs: this.fb.array([])
  });
  viewObj: any;

  appId : any;
  appObj= {
    AppId : 0,
  };

  appReservedFundObjs: Array<AppReservedFundObj>;
  allAppReservedFundObj: AllAppReservedFundObj;
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

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {

    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    });
  }

  initUrl() {
    this.getAppFinDataUrl = AdInsConstant.GetAppFinDataByAppId;
    this.getAppFeeUrl = AdInsConstant.GetListAppFeeByAppId;
    this.getAppRsvFundUrl = AdInsConstant.GetListAppReservedFundByAppId;
    this.addEditRsvFundUrl = AdInsConstant.AddEditAppReservedFund;
    this.getAppRsvFundRuleUrl = AdInsConstant.CreateRsvFundRule;
  }

  ngOnInit() {
    this.initUrl();
    this.appObj.AppId = this.appId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    this.GetAppRsvFundRule(this.appObj);

  }

  SaveForm() {
    this.setAppReservedFundData();
    this.http.post(this.addEditRsvFundUrl, this.allAppReservedFundObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setAppReservedFundData() {
    this.allAppReservedFundObj = new AllAppReservedFundObj();
    this.allAppReservedFundObj.AppId = this.appId;
    this.allAppReservedFundObj.RequestAppReservedFundObjs = new Array<AppReservedFundObj>();
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var appReservedFundObj = new AppReservedFundObj();
      appReservedFundObj.AppId = this.appId;
      appReservedFundObj.MrReservedFundSourceCode = this.RsvForm.controls["ReservedFundObjs"].value[i].MrReservedFundSourceCode;
      appReservedFundObj.MrReservedFundCode = this.RsvForm.controls["ReservedFundObjs"].value[i].MrReservedFundCode;
      appReservedFundObj.ReservedFundAmt = this.RsvForm.controls["ReservedFundObjs"].value[i].ReservedFundAmt;
      appReservedFundObj.StdReservedFundAmt = this.RsvForm.controls["ReservedFundObjs"].value[i].StdReservedFundAmt;
      appReservedFundObj.Behaviour = this.RsvForm.controls["ReservedFundObjs"].value[i].Behaviour;
      this.allAppReservedFundObj.RequestAppReservedFundObjs.push(appReservedFundObj);
    }
  }

  GetAppFinData(appObj) {
    this.http.post(this.getAppFinDataUrl, this.appObj).subscribe(
      (response) => {
        this.uppingRate = response["DiffRateAmt"];
        this.insuranceIncome = response["TotalInsCustAmt"] - response["TotalInsInscoAmt"];
        this.lifeInsuranceIncome = response["TotalLifeInsCustAmt"] - response["TotalLifeInsInscoAmt"];
        this.maxAllocatedAmt = response["MaxAllocatedRefundAmt"];
        this.remainingAllocatedAmt = response["MaxAllocatedRefundAmt"] - response["CommissionAllocatedAmt"] - response["ReservedFundAllocatedAmt"];
      }
    );
  }

  GetAppFee(appObj) {
    this.http.post(this.getAppFinDataUrl, this.appObj).subscribe(
      (response) => {
        this.appFeeObj = response["ReturnObject"];

      }
    );
  }

  GetReservedFund(appObj) {

  }

  GetAppRsvFundRule(appObj) {
    this.http.post(this.getAppRsvFundRuleUrl, this.appObj).subscribe(
      (response) => {
        this.ruleObj = response;
        console.log(this.ruleObj);
        this.appReservedFundObjs = new Array<AppReservedFundObj>();
        for (let i = 0; i < this.ruleObj.length; i++) {
          var appReservedFundObj = new AppReservedFundObj();
          appReservedFundObj.AppId = this.appId;
          appReservedFundObj.MrReservedFundSourceCode = this.ruleObj[i].AllocationFrom;
          appReservedFundObj.MrReservedFundCode = this.ruleObj[i].AllocationTo;
          appReservedFundObj.ReservedFundAmt = this.ruleObj[i].AllocationAmount;
          appReservedFundObj.StdReservedFundAmt = this.ruleObj[i].AllocationAmount;
          appReservedFundObj.Behaviour = this.ruleObj[i].AllocationBehaviour;
          this.appReservedFundObjs.push(appReservedFundObj);
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

  calculate() {

  }

  test() {
    this.setAppReservedFundData();
    console.log(this.RsvForm);
    console.log(this.allAppReservedFundObj);
  }
}
