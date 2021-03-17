import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-app-tc',
  templateUrl: './app-tc.component.html',
  styleUrls: []
})
export class AppTcComponent implements OnInit {
  @Input() AppId: number;
  @Input() BizTemplateCode: string;
  inputGridObj: InputGridObj;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    if(this.BizTemplateCode === CommonConstant.OPL) {
      this.inputGridObj.pagingJson = "./assets/ucgridview/app-view/opl/grid-app-tc-opl.json";
    }
    else {
      this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppTc.json";
    }

    var AppObj = {
      Id: this.AppId
    }

    this.http.post(URLConstant.GetListTCbyAppId, AppObj).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["AppTcs"]
      }
    );
  }
}
