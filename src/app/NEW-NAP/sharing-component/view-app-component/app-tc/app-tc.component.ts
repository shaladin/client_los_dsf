import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-app-tc',
  templateUrl: './app-tc.component.html',
  styleUrls: []
})
export class AppTcComponent implements OnInit {

  @Input() AppId;
  inputGridObj: InputGridObj;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppTc.json";

    
    var AppObj = {
      AppId: this.AppId
    }

    this.http.post(URLConstant.GetListTCbyAppId, AppObj).subscribe(
      (response) => {
        console.log(response);
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["AppTcs"]
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
