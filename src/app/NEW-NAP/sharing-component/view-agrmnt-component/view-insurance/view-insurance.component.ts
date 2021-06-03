import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppAssetCollateralForInsuranceObj } from 'app/shared/model/AppAssetCollateralForInsurance.Model';

@Component({
  selector: 'agrmnt-view-insurance',
  templateUrl: './view-insurance.component.html'
})
export class ViewAgrmntInsuranceComponent implements OnInit {
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
  result : Array<AppAssetCollateralForInsuranceObj> = new Array();
  resultData : any;
  closeResult: any; 
  appAssetObj: AppAssetObj = new AppAssetObj();
  gridAssetDataObj: InputGridObj = new InputGridObj();
  listAppAssetObj: any;

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridInsDataView.json";
    this.inputGridObj.deleteUrl = URLConstant.DeleteAppGuarantor;
    
    this.http.post(URLConstant.GetAppAssetListForInsuranceByAgrmntId, { Id: this.agrmntId }).subscribe(
      (response) => {
        this.listAppAssetObj = response[CommonConstant.ReturnObj];

        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj];
        this.result = this.inputGridObj.resultData.Data;

        this.PaidAmtByCust = 0;
        this.InsCpltzAmt = 0;
        this.InsDiscAmt = 0;
        this.TotalPremiumToCust = 0;

        for (var i = 0; i < this.listAppAssetObj.length; i++) {
          if (this.listAppAssetObj[i].PaidAmtByCust != null)
            this.PaidAmtByCust += this.listAppAssetObj[i].PaidAmtByCust;

          if (this.listAppAssetObj[i].InsCpltzAmt != null)
            this.InsCpltzAmt += this.listAppAssetObj[i].InsCpltzAmt;

          if (this.listAppAssetObj[i].InsDiscAmt != null)
            this.InsDiscAmt += this.listAppAssetObj[i].InsDiscAmt;

          if (this.listAppAssetObj[i].TotalCustPremiAmt != null)
            this.TotalPremiumToCust += this.listAppAssetObj[i].TotalCustPremiAmt;
        }
      });
  }

  getEvent(event){
    this.AppAssetId = event.RowObj.AppAssetId;
    this.link = environment.losR3Web + "/Nap/FinanceLeasing/ViewInsurance?AppAssetId=" + event.RowObj.AppAssetId;
    window.open(this.link, '_blank');
  }
}
