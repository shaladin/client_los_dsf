import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ResAppCustAddrForViewObj, ResAppCustAttrForViewObj, ResAppCustCompanyLegalDocForViewObj, ResAppCustCompanyMgmntShrholderForViewObj, ResAppCustForViewObj, ResAppCustGrpForViewObj, ResAppCustOtherInfoForViewObj, ResCustDataCompanyForViewObj } from 'app/shared/model/response/view/res-cust-data-for-view-obj.model';
import { ResAppCustBankAccForViewObj } from 'app/shared/model/response/view/res-app-cust-bank-acc-for-view-obj.model';

@Component({
  selector: 'app-view-app-cust-data-company-x',
  templateUrl: './view-app-cust-data-company-x.component.html',
  styleUrls: []
})
export class ViewAppCustDataCompanyXComponent implements OnInit {
  @Input() BizTemplateCode: string = "";
  @Input() appId: number;
  @Input() IsNAPVersionCompletion: boolean = true;
  viewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  viewJobDataProfObj: string;
  viewJobDataEmpObj: string;
  viewJobDataSmeObj: string;
  viewJobDataNonProfObj: string;
  viewFinDataObj: UcViewGenericObj = new UcViewGenericObj();

  arrValue = [];
  isDataAlreadyLoaded: boolean = false;

  appCustObj: ResAppCustForViewObj = new ResAppCustForViewObj();
  appCustAddrForViewObjs: Array<ResAppCustAddrForViewObj> = new Array<ResAppCustAddrForViewObj>();
  appCustBankAccObjs: Array<ResAppCustBankAccForViewObj> = new Array<ResAppCustBankAccForViewObj>();
  appCustGrpObjs: Array<ResAppCustGrpForViewObj> = new Array<ResAppCustGrpForViewObj>();
  appCustCompanyMgmntShrholderObjs: Array<ResAppCustCompanyMgmntShrholderForViewObj> = new Array<ResAppCustCompanyMgmntShrholderForViewObj>();
  appCustCompanyLegalDocObjs: Array<ResAppCustCompanyLegalDocForViewObj> = new Array<ResAppCustCompanyLegalDocForViewObj>();
  appCustOtherInfoForViewObj: ResAppCustOtherInfoForViewObj = new ResAppCustOtherInfoForViewObj;
  appCustAttrContentsObj : Array<ResAppCustAttrForViewObj> = new Array<ResAppCustAttrForViewObj>();

  constructor(private http: HttpClient) { }

  async ngOnInit() : Promise<void>{
    //jika pake NAP versi baru maka langsung arahkan semua ke view completion tanpa init data di view lama
    if(this.IsNAPVersionCompletion) return;
    await this.getCustData();
    this.arrValue.push(this.appCustObj.AppCustId);

    if(this.BizTemplateCode === CommonConstant.OPL) {
      this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/opl/cust/company/viewAppCustCompanyMainDataOpl.json";
    }
    else {
      this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewAppCustCompanyMainData.json";
    }
    this.viewMainDataObj.whereValue = this.arrValue;

    this.viewFinDataObj.viewInput = "./assets/ucviewgeneric/viewAppCustCompanyFinData.json";
    this.viewFinDataObj.whereValue = this.arrValue;

    this.isDataAlreadyLoaded = true;
  }

  async getCustData() {
    var reqObj = {AppId: this.appId, IsForNapCompletionVersion: true }
    await this.http.post(URLConstant.GetCustDataCompanyForViewByAppId, reqObj).toPromise().then(
      (response : ResCustDataCompanyForViewObj) => {
        this.appCustObj = response.AppCustObj;
        this.appCustAddrForViewObjs = response.ListAppCustAddrObj;
        this.appCustCompanyMgmntShrholderObjs = response.ListAppCustCompanyMgmntShrholderObj;
        this.appCustBankAccObjs = response.ListAppCustBankAccObj;
        this.appCustCompanyLegalDocObjs = response.ListAppCustCompanyLegalDocObj;
        this.appCustGrpObjs = response.ListAppCustGrpObj;
        this.appCustOtherInfoForViewObj = response.AppCustOtherInfoForViewObj;
        this.appCustAttrContentsObj = response.ListAppCustAttrContentObj;
      }
    );
  }
}