import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppAssetCollateralForInsuranceObj } from 'app/shared/model/app-asset-collateral-for-insurance.model';

@Component({
  selector: 'agrmnt-view-insurance-x',
  templateUrl: './view-insurance-x.component.html'
})
export class ViewAgrmntInsuranceXComponent implements OnInit {
  @Input() agrmntId: number = 0;
  AppId: number = 0;
  AppAssetId: number = 0;
  appInsObjs: any;
  appCollObjs: any;
  custTotalPremi: number;
  totalCapitalizedAmt: number;
  totalCustPaidAmt: number;
  ResponseAppDetailData: any;
  PaidAmtByCust: number = 0;
  InsCpltzAmt: number  = 0;
  InsDiscAmt: number  = 0;
  TotalPremiumToCust: number  = 0;
  link: string = 'false';

  inputGridObj: any;
  result : Array<AppAssetCollateralForInsuranceObj> = new Array<AppAssetCollateralForInsuranceObj>();
  resultData : any;
  closeResult: any;
  appAssetObj: AppAssetObj = new AppAssetObj();
  gridAssetDataObj: InputGridObj = new InputGridObj();
  listAppAssetObj: any;
  appCollObjFinal: Array<any>;
  appInsCvgs: any;

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridInsDataView.json";

    this.http.post(URLConstant.GetAppAssetListForInsuranceByAgrmntId, { Id: this.agrmntId }).subscribe(
      (response) => {
        this.listAppAssetObj = response[CommonConstant.ReturnObj];

        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        for (let i = 0; i < this.appCollObjFinal.length; i++){
          this.http.post(URLConstant.GetAppInsObjViewDetail, { Id: this.appCollObjFinal[i].AppInsObjId }).toPromise().then(
            (response: any) => {
              this.appInsCvgs = response.appInsCvgs;
              let list = [];
              let joinText: any;
              list = this.appInsCvgs.map(function(val){
                return val.appInsMainCvgObj.MrMainCvgTypeCode;
              });
              list = list.filter(function (x, i, a) {
                return a.indexOf(x) == i;
              });
              joinText = list.join(',');
              this.appCollObjFinal[i].MainCoverage = joinText;
            });
          }
        this.inputGridObj.resultData.Data = this.appCollObjFinal;
        this.result = this.inputGridObj.resultData.Data;

        this.PaidAmtByCust = 0;
        this.InsCpltzAmt = 0;
        this.InsDiscAmt = 0;
        this.TotalPremiumToCust = 0;

        for (var i = 0; i < this.listAppAssetObj.length; i++) {
          if (this.listAppAssetObj[i].PaidAmtByCust != null)
            this.PaidAmtByCust = this.listAppAssetObj[i].PaidAmtByCust;

          if (this.listAppAssetObj[i].InsCpltzAmt != null)
            this.InsCpltzAmt += this.listAppAssetObj[i].InsCpltzAmt;

          if (this.listAppAssetObj[i].InsDiscAmt != null)
            this.InsDiscAmt += this.listAppAssetObj[i].InsDiscAmt;

          if (this.listAppAssetObj[i].TotalCustPremiAmt != null)
            this.TotalPremiumToCust = this.listAppAssetObj[i].TotalCustPremiAmt;
        }
      });
  }

  getEvent(event){
    this.AppAssetId = event.RowObj.AppAssetId;
    this.link = environment.losR3Web + "/Nap/FinanceLeasing/ViewInsuranceX?AppAssetId=" + event.RowObj.AppAssetId;
    window.open(this.link, '_blank');
  }
}
