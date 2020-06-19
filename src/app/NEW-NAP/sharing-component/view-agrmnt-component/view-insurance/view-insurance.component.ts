import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetDataDetailComponent } from '../../view-app-component/app-asset-data/app-asset-data-detail/app-asset-data-detail.component';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';

@Component({
  selector: 'agrmnt-view-insurance',
  templateUrl: './view-insurance.component.html'
})
export class ViewInsuranceComponent implements OnInit {
  @Input() agrmntId: number = 0;
  AppId: number = 0;
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

  inputGridObj: any;
  result : any = new Array();
  resultData : any;
  closeResult: any;
  token : any = localStorage.getItem("Token");
  appAssetObj: AppAssetObj = new AppAssetObj();
  gridAssetDataObj: InputGridObj = new InputGridObj();
  listAppAssetObj: any;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAssetDataView.json";
    this.inputGridObj.deleteUrl = AdInsConstant.DeleteAppGuarantor;
    
    this.httpClient.post(AdInsConstant.GetAppAssetListForInsuranceByAgrmntId, { AgrmntId: this.agrmntId }).subscribe(
      (response) => {
        this.listAppAssetObj = response["ReturnObject"];
        console.log(this.listAppAssetObj);

        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["ReturnObject"];
        this.result = this.inputGridObj.resultData.Data;
        console.log(this.result);

        if (this.listAppAssetObj[0].PaidAmtByCust != null)
          this.PaidAmtByCust = this.listAppAssetObj[0].PaidAmtByCust;

        if (this.listAppAssetObj[0].InsCpltzAmt != null)
          this.InsCpltzAmt += this.listAppAssetObj[0].InsCpltzAmt;

        if (this.listAppAssetObj[0].InsDiscAmt != null)
          this.InsDiscAmt += this.listAppAssetObj[0].InsDiscAmt;

        if (this.listAppAssetObj[0].TotalCustPremiAmt != null)
          this.TotalPremiumToCust = this.listAppAssetObj[0].TotalCustPremiAmt;

      },
      (error) => {
        console.log(error);
      }
    );
  }

  viewDetailLoanHandler(appAssetId) {
    const modalAssetDetail = this.modalService.open(AppAssetDataDetailComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AppId = this.AppId;
    modalAssetDetail.result.then().catch((error) => {
      if (error != 0) {
        console.log(error);
      }
    });
  }

  getEvent(event){
  }
}
