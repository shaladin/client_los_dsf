import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCustPersonalContactPersonObj } from 'app/shared/model/app-cust-personal-contact-person-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { ResAppCustAddrForViewObj, ResAppCustAttrForViewObj, ResAppCustForViewObj, ResAppCustGrpForViewObj, ResAppCustOtherInfoForViewObj } from 'app/shared/model/response/view/res-cust-data-for-view-obj.model';
import { ResAppCustBankAccForViewObjX } from 'app/impl/shared/model/view/res-app-cust-bank-acc-for-view-obj-x.model';
import { ResCustDataPersonalForViewObjX } from 'app/impl/shared/model/view/res-cust-data-for-view-obj-x.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-view-app-cust-data-personal-x',
  templateUrl: './view-app-cust-data-personal-x.component.html',
  styleUrls: []
})
export class ViewAppCustDataPersonalXComponent implements OnInit {

  @Input() appId: number;
  @Input() IsNAPVersionCompletion: boolean = true;
  viewMainDataObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataProfObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataEmpObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataSmeObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataNonProfObj:  UcViewGenericObj = new UcViewGenericObj();
  viewFinDataObj:  UcViewGenericObj = new UcViewGenericObj();

  arrValue = [];
  isDataAlreadyLoaded: boolean = false;

  custModelCode: string;
  appCustObj: ResAppCustForViewObj = new ResAppCustForViewObj();
  appCustAddrForViewObjs: Array<ResAppCustAddrForViewObj> = new Array<ResAppCustAddrForViewObj>();
  appCustBankAccObjs: Array<ResAppCustBankAccForViewObjX> = new Array<ResAppCustBankAccForViewObjX>();
  appCustGrpObjs: Array<ResAppCustGrpForViewObj> = new Array<ResAppCustGrpForViewObj>();
  appCustPersonalContactPersonObjs: Array<AppCustPersonalContactPersonObj> = new Array<AppCustPersonalContactPersonObj>();
  appCustOtherInfoForViewObj: ResAppCustOtherInfoForViewObj = new ResAppCustOtherInfoForViewObj;
  appCustAttrContentsObj : Array<ResAppCustAttrForViewObj> = new Array<ResAppCustAttrForViewObj>();

  constructor(private http: HttpClient) {
  }

  async ngOnInit(): Promise<void> {
    //jika pake NAP versi baru maka langsung arahkan semua ke view completion tanpa init data di view lama
    if(this.IsNAPVersionCompletion) return;
    await this.getCustData();
    this.arrValue.push(this.appCustObj.AppCustId);
    this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalMainData.json";
    this.viewMainDataObj.whereValue = this.arrValue;

    this.viewJobDataProfObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalJobDataProf.json";
    this.viewJobDataProfObj.whereValue = this.arrValue;

    this.viewJobDataEmpObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalJobDataEmp.json";
    this.viewJobDataEmpObj.whereValue = this.arrValue;

    this.viewJobDataSmeObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalJobDataSme.json";
    this.viewJobDataSmeObj.whereValue = this.arrValue;

    this.viewJobDataNonProfObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalJobDataNonProf.json";
    this.viewJobDataNonProfObj.whereValue = this.arrValue;

    this.viewFinDataObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalFinData.json";
    this.viewFinDataObj.whereValue = this.arrValue;

    this.isDataAlreadyLoaded = true;
  }

  async getCustData() {
    var reqObj = { AppId: this.appId }
    await this.http.post(URLConstantX.GetCustDataPersonalXForViewByAppId, reqObj).toPromise().then(
      (response : ResCustDataPersonalForViewObjX) => {
        this.appCustObj = response.AppCustObj;
        this.appCustAddrForViewObjs = response.ListAppCustAddrObj;
        this.appCustBankAccObjs = response.ListAppCustBankAccObjX;
        this.appCustGrpObjs = response.ListAppCustGrpObj;
        this.appCustOtherInfoForViewObj = response.AppCustOtherInfoForViewObj;
        this.appCustAttrContentsObj = response.ListAppCustAttrContentObj;
      });
  }
}
