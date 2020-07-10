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


@Component({
  selector: 'app-view-app-cust-data-company',
  templateUrl: './view-app-cust-data-company.component.html',
  styleUrls: []
})
export class ViewAppCustDataCompanyComponent implements OnInit {

  @Input() appId: number;
  viewMainDataObj: string;
  viewJobDataProfObj: string;
  viewJobDataEmpObj: string;
  viewJobDataSmeObj: string;
  viewJobDataNonProfObj: string;
  viewFinDataObj: string;

  arrValue = [];
  isDataAlreadyLoaded: boolean = false;

  appCustAddrForViewObjs: Array<AppCustAddrForViewObj>;
  appCustBankAccObjs: Array<AppCustBankAccObj>;
  appCustSocmedObjs: Array<AppCustSocmedObj>;
  appCustGrpObjs: Array<AppCustGrpObj>;
  appCustCompanyMgmntShrholderObjs: Array<AppCustCompanyMgmntShrholderObj>;
  appCustCompanyLegalDocObjs: Array<AppCustCompanyLegalDocObj>;

  constructor(private http: HttpClient) {
  }

  async ngOnInit() : Promise<void>{
    await this.getCustData();
    this.arrValue.push(this.appId);
    this.viewMainDataObj = "./assets/ucviewgeneric/viewAppCustCompanyMainData.json";
    this.viewFinDataObj = "./assets/ucviewgeneric/viewAppCustCompanyFinData.json";

    this.isDataAlreadyLoaded = true;
  }

  async getCustData(){
    var reqObj = {AppId: this.appId}
    await this.http.post(URLConstant.GetCustDataCompanyForViewByAppId, reqObj).toPromise().then(
      (response) => {
        console.log(response);
        this.appCustAddrForViewObjs = response["AppCustAddrObjs"];
        this.appCustCompanyMgmntShrholderObjs = response["AppCustCompanyMgmntShrholderObjs"];
        this.appCustBankAccObjs = response["AppCustBankAccObjs"];
        this.appCustCompanyLegalDocObjs = response["AppCustCompanyLegalDocObjs"];
        this.appCustSocmedObjs = response["AppCustSocmedObjs"];
        this.appCustGrpObjs = response["AppCustGrpObjs"];
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
