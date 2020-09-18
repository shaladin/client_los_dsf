import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'app-tab-application',
  templateUrl: './tab-application.component.html'
})
export class TabApplicationComponent implements OnInit {
  @Input() appId;
  @Input() BizTemplateCode: string = "";
  viewProdMainInfoObj: UcViewGenericObj = new UcViewGenericObj();
  inputGridObj: InputGridObj;
  IsGridLoanReady: boolean = false;

  constructor(
    private http: HttpClient
  ) { }

  initData() {
    if (this.BizTemplateCode == CommonConstant.FCTR) {
      this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewTabApplicationFactoringInfo.json";
    }
    else {
      this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewTabApplicationInfo.json";
    }
    this.viewProdMainInfoObj.viewEnvironment = environment.losUrl;
    this.viewProdMainInfoObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
  }

  async ngOnInit() {
    this.initData();
    await this.GetCrossAppData();
    this.GetLoanObjData();
  }

  ListCrossAppData
  async GetCrossAppData() {
    var obj = { AppId: this.appId };

    await this.http.post(URLConstant.GetListAppCross, obj).toPromise().then(
      (response) => {
        this.ListCrossAppData = response[CommonConstant.ReturnObj];

      }
    );
  }

  GetLoanObjData() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridLoanObj.json";

    this.http.post(URLConstant.GetListAppLoanPurposeByAppId, { AppId: this.appId }).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["listResponseAppLoanPurpose"]
      });

    this.IsGridLoanReady = true;
  }
}
