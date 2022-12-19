import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppInsObjObj } from 'app/shared/model/app-ins-obj-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppInsuranceObj } from 'app/shared/model/app-insurance-obj.model';
import { AppInsMainCvgObj } from 'app/shared/model/app-ins-main-cvg-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
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

  async getInsuranceData() {
    var reqAssetObj = { Id: this.AppAssetId };
    await this.http.post(URLConstant.GetInsuranceDataByAppAssetIdForView, reqAssetObj).toPromise().then(
      async (response) => {
        this.appInsuranceObj = response["AppInsuranceObj"];
        this.appInsObjObj = response["AppInsObjObj"];
        if (response["AppAssetObj"] != null) {
          this.appAssetObj = response["AppAssetObj"];
        }
        if (response["AppCollateralObj"] != null) {
          this.appCollateralObj = response["AppCollateralObj"];
        }
        this.appInsMainCvgObjs = response["AppInsMainCvgObjs"];
        
        for (var i = 0; i < this.appInsMainCvgObjs.length; i++) {
          this.appInsMainCvgObjs[i].CustAddPremiRate = "";
          this.appInsMainCvgObjs[i].InscoAddPremiRate = "";
          for (var j = 0; j < this.appInsMainCvgObjs[i].AppInsAddCvgObjs.length; j++){
            if (j == (this.appInsMainCvgObjs[i].AppInsAddCvgObjs.length - 1)) {
              this.appInsMainCvgObjs[i].CustAddPremiRate += (this.appInsMainCvgObjs[i].AppInsAddCvgObjs[j].CustAddPremiRate).toFixed(3);
              this.appInsMainCvgObjs[i].InscoAddPremiRate +=  (this.appInsMainCvgObjs[i].AppInsAddCvgObjs[j].InscoAddPremiRate).toFixed(3);
            }
            else {
              this.appInsMainCvgObjs[i].CustAddPremiRate += (this.appInsMainCvgObjs[i].AppInsAddCvgObjs[j].CustAddPremiRate).toFixed(3) + ", ";
              this.appInsMainCvgObjs[i].InscoAddPremiRate +=  (this.appInsMainCvgObjs[i].AppInsAddCvgObjs[j].InscoAddPremiRate).toFixed(3) + ", ";
            }
          }
        }
        

        var detailForGridCoverage = {
          Data: this.appInsMainCvgObjs,
          Count: "0"
        }

        this.inputGridObj.resultData = detailForGridCoverage;
      });
  }
}
