import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { AppInsuranceObj } from 'app/shared/model/AppInsuranceObj.Model';
import { AppInsMainCvgObj } from 'app/shared/model/AppInsMainCvgObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-insurance-detail',
  templateUrl: './view-insurance-detail.component.html'
})
export class ViewInsuranceDetailComponent implements OnInit {

  AppAssetId: number = 0;
  inputGridObj: InputGridObj;
  appInsuranceObj: AppInsuranceObj = new AppInsuranceObj();
  appInsObjObj: AppInsObjObj = new AppInsObjObj();
  appAssetObj: AppAssetObj = new AppAssetObj();
  appCollateralObj: AppCollateralObj = new AppCollateralObj();
  appInsMainCvgObjs: Array<AppInsMainCvgObj> = new Array<AppInsMainCvgObj>();

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['AppAssetId'] != null) {
        this.AppAssetId = params['AppAssetId'];
      }
    });
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppInsMainCvg.json";
    this.getInsuranceData();
  }

  getInsuranceData() {
    var reqAssetObj = { AppAssetId: this.AppAssetId };
    this.http.post(URLConstant.GetInsuranceDataByAppAssetIdForView, reqAssetObj).subscribe(
      (response) => {
        this.appInsuranceObj = response["AppInsuranceObj"];
        this.appInsObjObj = response["AppInsObjObj"];
        if (response["AppAssetObj"] != null) {
          this.appAssetObj = response["AppAssetObj"];
        }
        if (response["AppCollateralObj"] != null) {
          this.appCollateralObj = response["AppCollateralObj"];
        }
        this.appInsMainCvgObjs = response["AppInsMainCvgObjs"];

        var detailForGridCoverage = {
          Data: this.appInsMainCvgObjs,
          Count: "0"
        }

        this.inputGridObj.resultData = detailForGridCoverage;
      });
  }
}
