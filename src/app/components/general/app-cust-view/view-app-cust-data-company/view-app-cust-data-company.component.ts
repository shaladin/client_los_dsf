import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { AppCustAddrForViewObj } from 'app/shared/model/AppCustAddr/AppCustAddrForViewObj.Model';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustSocmedObj } from 'app/shared/model/AppCustSocmedObj.Model';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { AppCustCompanyMgmntShrholderObj } from 'app/shared/model/AppCustCompanyMgmntShrholderObj.Model';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';


@Component({
  selector: 'app-view-app-cust-data-company',
  templateUrl: './view-app-cust-data-company.component.html',
  styleUrls: []
})
export class ViewAppCustDataCompanyComponent implements OnInit {

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

  appCustObj: AppCustObj;
  appCustAddrForViewObjs: Array<AppCustAddrForViewObj>;
  appCustBankAccObjs: Array<AppCustBankAccObj>;
  appCustSocmedObjs: Array<AppCustSocmedObj>;
  appCustGrpObjs: Array<AppCustGrpObj>;
  appCustCompanyMgmntShrholderObjs: Array<AppCustCompanyMgmntShrholderObj>;
  appCustCompanyLegalDocObjs: Array<AppCustCompanyLegalDocObj>;

  constructor(private http: HttpClient) {
  }

  async ngOnInit() : Promise<void>{
    //jika pake NAP versi baru maka langsung arahkan semua ke view completion tanpa init data di view lama
    if(this.IsNAPVersionCompletion) return;
    await this.getCustData();
    this.arrValue.push(this.appCustObj.AppCustId);
    this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewAppCustCompanyMainData.json";
    this.viewMainDataObj.viewEnvironment = environment.losUrl;
    this.viewMainDataObj.whereValue = this.arrValue;

    this.viewFinDataObj.viewInput = "./assets/ucviewgeneric/viewAppCustCompanyFinData.json";
    this.viewFinDataObj.viewEnvironment = environment.losUrl;
    this.viewFinDataObj.whereValue = this.arrValue;

    this.isDataAlreadyLoaded = true;
  }

  async getCustData(){
    var reqObj = {AppId: this.appId}
    await this.http.post(URLConstant.GetCustDataCompanyForViewByAppId, reqObj).toPromise().then(
      (response) => {
        this.appCustObj = response["AppCustObj"];
        this.appCustAddrForViewObjs = response["AppCustAddrObjs"];
        this.appCustCompanyMgmntShrholderObjs = response["AppCustCompanyMgmntShrholderObjs"];
        this.appCustBankAccObjs = response["AppCustBankAccObjs"];
        this.appCustCompanyLegalDocObjs = response["AppCustCompanyLegalDocObjs"];
        this.appCustSocmedObjs = response["AppCustSocmedObjs"];
        this.appCustGrpObjs = response["AppCustGrpObjs"];
      });
  }
}
