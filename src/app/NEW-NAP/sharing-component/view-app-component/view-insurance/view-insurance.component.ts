import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { AppInsuranceObj } from 'app/shared/model/AppInsuranceObj.Model';
import { AppInsMainCvgObj } from 'app/shared/model/AppInsMainCvgObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: "view-insurance",
  templateUrl: "./view-insurance.component.html",
  providers: [NGXToastrService]
})
export class ViewInsuranceComponent implements OnInit {
  @Input() AppId: number = 0;
  @Input() AppAssetId: number = 0;
  inputGridObj: InputGridObj;
  appInsuranceObj: AppInsuranceObj = new AppInsuranceObj();
  appInsObjObj: AppInsObjObj = new AppInsObjObj();
  appAssetObj: AppAssetObj = new AppAssetObj();
  appCollateralObj: AppCollateralObj = new AppCollateralObj();
  appInsMainCvgObjs: Array<AppInsMainCvgObj> = new Array<AppInsMainCvgObj>();

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppInsMainCvg.json";
    this.getInsuranceData();
  }

  getInsuranceData() {
    if (this.AppId != 0 && this.AppId != null && this.AppId != undefined) {
      var reqObj = { AppId: this.AppId };
      this.http.post(URLConstant.GetInsuranceDataByAppIdForView, reqObj).subscribe(
        (response) => {
          console.log(response);
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
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      var reqAssetObj = { AppAssetId: this.AppAssetId };
      this.http.post(URLConstant.GetInsuranceDataByAppIdForView, reqAssetObj).subscribe(
        (response) => {
          console.log(response);
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
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
