import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ResAppCustAddrForViewObj, ResAppCustCompanyLegalDocForViewObj, ResAppCustCompanyMgmntShrholderForViewObj, ResAppCustForViewObj, ResAppCustGrpForViewObj, ResCustDataCompanyForViewObj } from 'app/shared/model/Response/View/ResCustDataForViewObj.model';
import { ResAppCustBankAccForViewObj } from 'app/shared/model/Response/View/ResAppCustBankAccForViewObj.model';

@Component({
  selector: 'app-view-app-cust-data-company',
  templateUrl: './view-app-cust-data-company.component.html',
  styleUrls: []
})
export class ViewAppCustDataCompanyComponent implements OnInit {
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
    this.viewMainDataObj.viewEnvironment = environment.losUrl;
    this.viewMainDataObj.whereValue = this.arrValue;

    this.viewFinDataObj.viewInput = "./assets/ucviewgeneric/viewAppCustCompanyFinData.json";
    this.viewFinDataObj.viewEnvironment = environment.losUrl;
    this.viewFinDataObj.whereValue = this.arrValue;

    this.isDataAlreadyLoaded = true;
  }

  async getCustData() {
    var reqObj = {AppId: this.appId}
    await this.http.post(URLConstant.GetCustDataCompanyForViewByAppId, reqObj).toPromise().then(
      (response : ResCustDataCompanyForViewObj) => {
        this.appCustObj = response.AppCustObj;
        this.appCustAddrForViewObjs = response.ListAppCustAddrObj;
        this.appCustCompanyMgmntShrholderObjs = response.ListAppCustCompanyMgmntShrholderObj;
        this.appCustBankAccObjs = response.ListAppCustBankAccObj;
        this.appCustCompanyLegalDocObjs = response.ListAppCustCompanyLegalDocObj;
        this.appCustGrpObjs = response.ListAppCustGrpObj;
      }
    );
  }
}