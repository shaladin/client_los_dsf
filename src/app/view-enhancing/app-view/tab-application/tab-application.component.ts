import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AppAttrContentObj } from 'app/shared/model/app-attr-content/app-attr-content-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

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
  viewRestructuringDataObj: UcViewGenericObj = new UcViewGenericObj();
  inputGridObj: InputGridObj;
  IsGridLoanReady: boolean = false;
  isReady: boolean = false;
  isLoanObjectNeeded: boolean = false;
  ListCrossAppData: any;
  isDF: boolean = false;
  AppAttrContentObjs: Array<AppAttrContentObj> = new Array<AppAttrContentObj>();

  constructor(private http: HttpClient, private route: ActivatedRoute, private adInsHelperService: AdInsHelperService) {
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

    if (this.BizTemplateCode == CommonConstant.DF)
      await this.GetRestObjData();

    this.getRestructuringData();
    await this.getAppAttrContent();
    this.isReady = true;
  }

  async GetCrossAppData() {
    var obj = { Id: this.appId };
    await this.http.post(URLConstant.GetListAppCrossForView, obj).toPromise().then(
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

  getRestructuringData(){
    this.viewRestructuringDataObj.viewInput = "./assets/ucviewgeneric/viewRestructuringData.json";
  }

  async getAppAttrContent(){
    var GenObj =
    {
      AppId: this.appId,
      AttrGroup: CommonConstant.AttrGroupApplicationData + "_" + this.BizTemplateCode,
    };
    
    await this.http.post(URLConstant.GetListAppAttrContentForView, GenObj).toPromise().then(
      (response) => {
        this.AppAttrContentObjs = response["ReturnObject"];
        
        for(let i = 0; i < this.AppAttrContentObjs.length; i++){
          if(this.AppAttrContentObjs[i].AttrInputType == CommonConstant.AttrInputTypeRefMaster
            && this.AppAttrContentObjs[i].RefAttrValue != null 
            && this.AppAttrContentObjs[i].RefAttrValue != ""){
              let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
                RefMasterTypeCode: this.AppAttrContentObjs[i].RefAttrValue,
                MasterCode: this.AppAttrContentObjs[i].AttrValue
              };
              this.http.post(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
                (responseRefMaster: KeyValueObj) => {
                  this.AppAttrContentObjs[i].AttrValue = responseRefMaster.Value
                });
          }
        }
      });
  }

  OpenAppView(appNo) {
    var appObj = { TrxNo: appNo };
  
    this.http.post(URLConstant.GetAppByAppNo, appObj).subscribe(
      (response) => {
        AdInsHelper.OpenAppViewByAppId(response["AppId"]);
      });
  }

  OpenAgrmntView(agrmntNo) {
    var agrObj = { TrxNo: agrmntNo };
  
    this.http.post(URLConstant.GetAgrmntByAgrmntNo, agrObj).subscribe(
      (response) => {
        AdInsHelper.OpenAgrmntViewByAgrmntId(response["AgrmntId"]);
      });
  }

  OpenCustView(custNo) {
    var custObj = { TrxNo: custNo };
    this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
      (response) => {
        if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
          this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
        }
        if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
          this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
        }
      });
  }
}
