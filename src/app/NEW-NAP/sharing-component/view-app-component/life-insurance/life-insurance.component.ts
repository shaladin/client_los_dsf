import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-life-insurance',
  templateUrl: './life-insurance.component.html',
  styleUrls: []
})
export class LifeInsuranceComponent implements OnInit {

  viewObj: string;
  @Input() arrValue = [];
  @Input() AppId;
  inputGridObj: InputGridObj;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppLifeInsurance.json";
    this.viewObj = "./assets/ucviewgeneric/viewAppLifeInsData.json";

    var AppObj = {
      AppId: this.AppId
    }

    this.http.post(URLConstant.GetAppLifeInsHByAppId, AppObj).subscribe(
      (response) => {
        console.log(response);
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["ListAppLifeInsD"]
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
