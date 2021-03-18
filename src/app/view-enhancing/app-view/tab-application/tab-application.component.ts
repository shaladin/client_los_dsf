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
  isReady: boolean = false;
  isLoanObjectNeeded: boolean = false;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    if(this.BizTemplateCode == CommonConstant.CF4W || this.BizTemplateCode == CommonConstant.FL4W || this.BizTemplateCode == CommonConstant.FCTR || this.BizTemplateCode == CommonConstant.OPL) {
      this.isLoanObjectNeeded = false;
    }
    else {
      this.isLoanObjectNeeded = true;
    }

    if (this.BizTemplateCode == CommonConstant.FCTR) {
      await this.http.post(URLConstant.GetAppFctrByAppId, {Id: this.appId}).toPromise().then(
      (response) => {
        if(response["MrInstTypeCode"] == CommonConstant.SINGLE_INST_TYPE){
          this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewTabApplicationFactoringSingleInfo.json";
        }
        else if(response["MrInstTypeCode"] == CommonConstant.MULTIPLE_INST_TYPE){
          this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewTabApplicationFactoringMulInfo.json";
        }
      });
    }
    else if (this.BizTemplateCode == CommonConstant.OPL) {
      this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewTabApplicationOPLInfo.json";
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
    this.isReady = true;
    await this.GetCrossAppData();
    await this.GetLoanObjData();
  }

  ListCrossAppData
  async GetCrossAppData() {
    var obj = { Id: this.appId };
    await this.http.post(URLConstant.GetListAppCross, obj).toPromise().then(
      (response) => {
        this.ListCrossAppData = response[CommonConstant.ReturnObj];

      }
    );
  }

  async GetLoanObjData() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridLoanObj.json";

    await this.http.post(URLConstant.GetListAppLoanPurposeByAppId, { Id: this.appId }).toPromise().then(
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
