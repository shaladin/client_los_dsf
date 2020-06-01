import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { AppCustAddrForViewObj } from 'app/shared/model/AppCustAddr/AppCustAddrForViewObj.Model';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustSocmedObj } from 'app/shared/model/AppCustSocmedObj.Model';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { AppCustPersonalContactPersonObj } from 'app/shared/model/AppCustPersonalContactPersonObj.Model';


@Component({
  selector: 'app-view-app-cust-data-personal',
  templateUrl: './view-app-cust-data-personal.component.html',
  styleUrls: []
})
export class ViewAppCustDataPersonalComponent implements OnInit {

  @Input() appId: number;
  viewMainDataObj: string;
  viewJobDataProfObj: string;
  viewJobDataEmpObj: string;
  viewJobDataSmeObj: string;
  viewJobDataNonProfObj: string;
  viewFinDataObj: string;

  arrValue = [];
  isDataAlreadyLoaded: boolean = false;

  custModelCode: string;
  appCustAddrForViewObjs: Array<AppCustAddrForViewObj>;
  appCustBankAccObjs: Array<AppCustBankAccObj>;
  appCustSocmedObjs: Array<AppCustSocmedObj>;
  appCustGrpObjs: Array<AppCustGrpObj>;
  appCustPersonalContactPersonObjs: Array<AppCustPersonalContactPersonObj>;

  constructor(private http: HttpClient) {
  }

  async ngOnInit() : Promise<void>{
    await this.getCustData();
    this.arrValue.push(this.appId);
    this.viewMainDataObj = "./assets/ucviewgeneric/viewAppCustPersonalMainData.json";
    this.viewJobDataProfObj = "./assets/ucviewgeneric/viewAppCustPersonalJobDataProf.json";
    this.viewJobDataEmpObj = "./assets/ucviewgeneric/viewAppCustPersonalJobDataEmp.json";
    this.viewJobDataSmeObj = "./assets/ucviewgeneric/viewAppCustPersonalJobDataSme.json";
    this.viewJobDataNonProfObj = "./assets/ucviewgeneric/viewAppCustPersonalJobDataNonProf.json";
    this.viewFinDataObj = "./assets/ucviewgeneric/viewAppCustPersonalFinData.json";

    this.isDataAlreadyLoaded = true;
  }

  async getCustData(){
    var reqObj = {AppId: this.appId}
    await this.http.post(AdInsConstant.GetCustDataPersonalForViewByAppId, reqObj).toPromise().then(
      (response) => {
        console.log(response);
        this.custModelCode = response["CustModelCode"];
        this.appCustAddrForViewObjs = response["AppCustAddrForViewObjs"];
        this.appCustBankAccObjs = response["AppCustBankAccObjs"];
        this.appCustSocmedObjs = response["AppCustSocmedObjs"];
        this.appCustGrpObjs = response["AppCustGrpObjs"];
        this.appCustPersonalContactPersonObjs = response["AppCustPersonalContactPersonObjs"] == null? new Array<AppCustPersonalContactPersonObj>() : response["AppCustPersonalContactPersonObjs"];
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
