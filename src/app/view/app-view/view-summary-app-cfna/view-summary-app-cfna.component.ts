import { Component, OnInit, Input } from '@angular/core';
import { SummaryAppObj } from 'app/shared/model/App/SummaryAppObj.Model';
import { SerialNoObj } from 'app/shared/model/SerialNo/SerialNoObj.Model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';

@Component({
  selector: 'app-view-summary-app-cfna',
  templateUrl: './view-summary-app-cfna.component.html',
  styles: []
})
export class ViewSummaryAppCfnaComponent implements OnInit {
  @Input() AppId: number;

  SummaryAppObj: SummaryAppObj = new SummaryAppObj();
  SerialNoObjs: Array<SerialNoObj> = new Array<SerialNoObj>();
  LoanObjectData: Array<Object>;
  InputGridColl: InputGridObj;
  IsGridCollReady: boolean;

  constructor(private http: HttpClient) {
    this.LoanObjectData = new Array<Object>();
    this.IsGridCollReady = false;
  }

  async ngOnInit() {
    await this.getSummaryApp();
    await this.GetLoanObjectData();
    await this.GetAppCollateral();
  }

  async getSummaryApp() {
    var reqObj = { Id: this.AppId };
    await this.http.post<SummaryAppObj>(URLConstant.GetSummaryAppByAppId, reqObj).subscribe(
      (response) => {
        this.SummaryAppObj = response;
        if(this.SummaryAppObj.AssetTypeSerialNoLabelCustomObjs != null && this.SummaryAppObj.AppAssetObjs.length == 1){
          for(let i = 0; i < this.SummaryAppObj.AssetTypeSerialNoLabelCustomObjs.length; i++){
            var serialNoObj = new SerialNoObj();
            serialNoObj.SerialNoLabel = this.SummaryAppObj.AssetTypeSerialNoLabelCustomObjs[i].SerialNoLabel;
            serialNoObj.SerialNoValue = this.SummaryAppObj.AppAssetObjs[0]["SerialNo" + (i+1)];
            this.SerialNoObjs.push(serialNoObj);
          }
        }
      });
  }

  async GetLoanObjectData(){
    var obj = {
      AppID: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetListAppLoanPurposeByAppId, obj).toPromise().then(
      (response) => {
        var temp = response["listResponseAppLoanPurpose"];
        if(temp && temp.length > 0){
          for (var i = 0; i < temp.length; i++) {
            var tempObj = {
              MrLoanPurposeDescr: temp[i].MrLoanPurposeDescr,
              IsDisburseToCust: temp[i].IsDisburseToCust,
              BudgetPlanAmt: temp[i].BudgetPlanAmt,
              SelfFinancingAmt: temp[i].SelfFinancingAmt,
              FinancingAmt: temp[i].FinancingAmt,
            }
            this.LoanObjectData.push(tempObj);
          }
        }
      }
    );
  }

  async GetAppCollateral() {
    this.InputGridColl = new InputGridObj();
    this.InputGridColl.pagingJson = "./assets/ucgridview/gridAppCollateralView.json";


    var AppObj = {
      AppId: this.AppId
    }

    this.http.post(URLConstant.GetListAppCollateralByAppId, AppObj).toPromise().then(
      (response) => {
        console.log("GetAppCollateral: " + JSON.stringify(response));
        this.InputGridColl.resultData = {
          Data: ""
        }
        this.InputGridColl.resultData["Data"] = new Array();
        this.InputGridColl.resultData.Data = response["ReturnObject"]
      });
    this.IsGridCollReady = true;
  }
}