import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { environment } from '../../../../environments/environment';



@Component({
  selector: "reserved-fund-view",
  templateUrl: "./reserved-fund-view.component.html",
  providers: [NGXToastrService]
})
export class RsvFundViewComponent implements OnInit {

  getAppFinDataUrl: any;
  getAppFeeUrl: any;
  getRsvFundUrl: any;

  RsvForm = this.fb.group({
    ReservedFundObjs: this.fb.array([])
  });
  viewObj: any;

  appId: any;
  appObj: {
    AppId: 0;
  };

  isCalculated: boolean = false;
  uppingRate: any;
  insuranceIncome: any;
  lifeInsuranceIncome: any;
  appFeeObj: any;
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
    this.getAppFinDataUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.getAppFeeUrl = AdInsConstant.GetAllAssetDataByAppId;
    this.getRsvFundUrl = AdInsConstant.GetAppById;
  }

  ngOnInit() {
    this.initUrl();
    this.appObj.AppId = this.appId
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";


  }

  SaveForm() {


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

  calculate() {

  }
}
