import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { SummaryAppObj } from 'app/shared/model/App/SummaryAppObj.Model';
import { SerialNoObj } from 'app/shared/model/SerialNo/SerialNoObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';

@Component({
  selector: "view-summary-app",
  templateUrl: "./view-summary-app.component.html",
  providers: [NGXToastrService]
})

export class ViewSummaryAppComponent implements OnInit {
  @Input() AppId: number;
  SummaryAppObj: SummaryAppObj = new SummaryAppObj();
  SerialNoObjs: Array<SerialNoObj> = new Array<SerialNoObj>();
  LoanObjectData: Array<Object>;
  InputGridColl: InputGridObj;
  IsGridCollReady: boolean;
bizTemplateCode : string = "";
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
     this.getSummaryApp();
  }

  getSummaryApp() {
    var reqObj = { AppId: this.AppId };
    this.http.post<SummaryAppObj>(URLConstant.GetSummaryAppByAppId, reqObj).subscribe(
      (response) => {
        this.SummaryAppObj = response;
        this.bizTemplateCode = this.SummaryAppObj["AppObj"]["BizTemplateCode"];
        if(this.SummaryAppObj.AssetTypeSerialNoLabelCustomObjs != null && this.SummaryAppObj.AppAssetObjs.length == 1){
          for(let i = 0; i < this.SummaryAppObj.AssetTypeSerialNoLabelCustomObjs.length; i++){
            var serialNoObj = new SerialNoObj();
            serialNoObj.SerialNoLabel = this.SummaryAppObj.AssetTypeSerialNoLabelCustomObjs[i].SerialNoLabel;
            serialNoObj.SerialNoValue = this.SummaryAppObj.AppAssetObjs[0]["SerialNo" + (i+1)];
            this.SerialNoObjs.push(serialNoObj);
          }
        }

        if(this.SummaryAppObj.AppObj.BizTemplateCode == "CFRFN4W"){
          this.http.post(URLConstant.GetListAppLoanPurposeByAppId, {AppID: this.AppId, RowVersion: ""}).toPromise().then(
            (response) => {
              this.LoanObjectData = response["listResponseAppLoanPurpose"];
            }
          );
      
          this.InputGridColl = new InputGridObj();
          this.InputGridColl.pagingJson = "./assets/ucgridview/gridAppCollateralView.json";

          this.http.post(URLConstant.GetListAppCollateralByAppId, {AppId: this.AppId}).toPromise().then(
            (response) => {
              this.InputGridColl.resultData = {
                Data: ""
              }
              this.InputGridColl.resultData["Data"] = new Array();
              this.InputGridColl.resultData.Data = response["ReturnObject"]
            });
          this.IsGridCollReady = true;
        }
      });
  }

}
