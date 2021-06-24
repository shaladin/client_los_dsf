import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab-application',
  templateUrl: './tab-application.component.html'
})
export class TabApplicationComponent implements OnInit {
  @Input() appId;
  @Input() BizTemplateCode: string = "";
  AppNo: string;
  viewProdMainInfoObj: UcViewGenericObj = new UcViewGenericObj();
  viewRestObj: UcViewGenericObj = new UcViewGenericObj();
  inputGridObj: InputGridObj;
  IsGridLoanReady: boolean = false;
  isReady: boolean = false;
  isLoanObjectNeeded: boolean = false;
  ListCrossAppData: any;
  isDF: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {      
      if(params["AppId"] == "undefined") {
        this.AppNo = params["AppNo"];
      }
      else {
        this.appId = params["AppId"];
      }
    })
   }

  async ngOnInit() {
    if(this.appId == null) {
      await this.http.post(URLConstant.GetAppByAppNo, {TrxNo: this.AppNo}).toPromise().then(
        (response) => {
          this.appId = response["AppId"];        
        }
      )
    }

    if(this.BizTemplateCode == CommonConstant.CF4W || this.BizTemplateCode == CommonConstant.FL4W || this.BizTemplateCode == CommonConstant.FCTR || this.BizTemplateCode == CommonConstant.OPL || this.BizTemplateCode == CommonConstant.DF) {
      this.isLoanObjectNeeded = false;
    }
    else {
      this.isLoanObjectNeeded = true;
      await this.GetLoanObjData();    
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
      if(this.AppNo !== undefined) {
        this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewTabApplicationOPLInfoByAppNo.json";
      }
      else {
        this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewTabApplicationOPLInfo.json";
      }
    }
    else {
      this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewTabApplicationInfo.json";
    }

    await this.GetCrossAppData();
    await this.GetLoanObjData();

    if (this.BizTemplateCode == CommonConstant.DF)
      await this.GetRestObjData();
    this.isReady = true;
  }

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
      }
    );

    this.IsGridLoanReady = true;
  }

  async GetRestObjData() {
    this.viewRestObj.viewInput = "./assets/ucviewgeneric/viewRestructureObj.json";
  }
}
