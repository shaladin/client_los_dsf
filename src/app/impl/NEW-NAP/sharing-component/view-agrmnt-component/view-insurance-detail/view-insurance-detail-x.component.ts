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
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { AppAssetAccessoryObj } from 'app/shared/model/app-asset-accessory-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-view-insurance-detail-x',
  templateUrl: './view-insurance-detail-x.component.html'
})
export class ViewInsuranceDetailXComponent implements OnInit {

  AppAssetId: number = 0;
  inputGridObj: InputGridObj;
  inputGridAccObj: InputGridObj;
  appInsuranceObj: AppInsuranceObj = new AppInsuranceObj();
  appInsObjObj: AppInsObjObj = new AppInsObjObj();
  appAssetObj: any;
  appCollateralObj: AppCollateralObj = new AppCollateralObj();
  appInsMainCvgObjs: Array<AppInsMainCvgObj> = new Array<AppInsMainCvgObj>();
  appAssetAcessoryObj: AppAssetAccessoryObj = new AppAssetAccessoryObj();
  assetCategoryName: string = "";

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['AppAssetId'] != null) {
        this.AppAssetId = params['AppAssetId'];
      }
    });
  }

  async ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridAccObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppInsMainCvg.json";
    this.inputGridAccObj.pagingJson = "./assets/impl/ucgridview/gridAppInsuranceAssetAccessory.json";
    this.getInsuranceData();
  }

  async getInsuranceData() {
    var reqAssetObj = { Id: this.AppAssetId };
    await this.http.post(URLConstantX.GetInsuranceDataByAppAssetIdXForView, reqAssetObj).toPromise().then(
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

        for (var i = 0; i < this.appInsMainCvgObjs.length; i++) {
          this.appInsMainCvgObjs[i].CustAddPremiRate = "";
          this.appInsMainCvgObjs[i].InscoAddPremiRate = "";
          var arrCustAddPremiRate = [];
          var arrInscoAddPremiRate = [];
          if(this.appInsMainCvgObjs[i].AppInsAddCvgObjs != null && this.appInsMainCvgObjs[i].AppInsAddCvgObjs != undefined){
            for (var j = 0; j < this.appInsMainCvgObjs[i].AppInsAddCvgObjs.length; j++) {
              if (this.appInsMainCvgObjs[i].AppInsMainCvgId == this.appInsMainCvgObjs[i].AppInsAddCvgObjs[j].AppInsMainCvgId) {
                arrCustAddPremiRate.push((this.appInsMainCvgObjs[i].AppInsAddCvgObjs[j].CustAddPremiRate).toFixed(3));
                arrInscoAddPremiRate.push((this.appInsMainCvgObjs[i].AppInsAddCvgObjs[j].InscoAddPremiRate).toFixed(3));
              }
            }
            this.appInsMainCvgObjs[i].CustAddPremiRate = arrCustAddPremiRate.join(", ");
            this.appInsMainCvgObjs[i].InscoAddPremiRate = arrInscoAddPremiRate.join(", ");
          }
        }

        if (response["AppAssetAccessoryObjs"] != null)
        {
          this.appAssetAcessoryObj = response["AppAssetAccessoryObjs"];
        }

        var detailForGridCoverage = {
          Data: this.appInsMainCvgObjs,
          Count: "0"
        }

        var detailForGridAccCoverage = {
          Data: this.appAssetAcessoryObj,
          Count: "0"
        }

        this.inputGridObj.resultData = detailForGridCoverage;
        this.inputGridAccObj.resultData = detailForGridAccCoverage;
      });
      this.getAssetCategoryName();
  }

  getAssetCategoryName(){
    var assetObj = this.appAssetObj;
    this.http.post(URLConstantX.GetAssetCategoryNameByAssetCategoryCode, assetObj).subscribe(
      (response) => {
        this.assetCategoryName = response.toString();
      }
    );
  }
}
