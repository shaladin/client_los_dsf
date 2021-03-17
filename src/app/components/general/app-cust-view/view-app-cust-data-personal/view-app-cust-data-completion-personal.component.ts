import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCustAddrForViewObj } from 'app/shared/model/AppCustAddr/AppCustAddrForViewObj.Model';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { AppCustPersonalContactPersonObj } from 'app/shared/model/AppCustPersonalContactPersonObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewAppCustDetailComponent } from '../view-app-cust-detail/view-app-cust-detail.component';

@Component({
  selector: 'app-view-app-cust-data-completion-personal',
  templateUrl: './view-app-cust-data-completion-personal.component.html',
  styleUrls: []
})
export class ViewAppCustDataCompletionPersonalComponent implements OnInit {

  @Input() appId: number;
  @Input() isDetail: boolean = false;
  @Input() appCustId: number;
  viewMainDataObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataProfObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataEmpObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataSmeObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataNonProfObj:  UcViewGenericObj = new UcViewGenericObj();
  viewFinDataObj:  UcViewGenericObj = new UcViewGenericObj();
  viewEmergencyContactObj:  UcViewGenericObj = new UcViewGenericObj();

  customerTitle: string;
  arrValue = [];
  isDataAlreadyLoaded: boolean = false;
  
  isPopupDetail: boolean = false;
  isShowDetail: boolean = false;
  detailAppCustId: number;
  detailMrCustTypeCode: string;
  detailCustomerTitle: string;

  appCustObj: AppCustObj;
  custModelCode: string;
  appCustAddrForViewObjs: Array<AppCustAddrForViewObj>;
  appCustBankAccObjs: Array<AppCustBankAccObj>;
  appCustGrpObjs: Array<AppCustGrpObj>;
  appCustPersonalContactPersonObjs: Array<AppCustPersonalContactPersonObj>;
  appCustFamilyObjs: Array<Object>;

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  async ngOnInit(): Promise<void> {
    await this.getCustData();
    this.arrValue.push(this.appCustObj.AppCustId);
    this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalMainData.json";
    this.viewMainDataObj.viewEnvironment = environment.losUrl;
    this.viewMainDataObj.whereValue = this.arrValue;

    this.viewJobDataProfObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalJobDataProf.json";
    this.viewJobDataProfObj.viewEnvironment = environment.losUrl;
    this.viewJobDataProfObj.whereValue = this.arrValue;

    this.viewJobDataEmpObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalJobDataEmp.json";
    this.viewJobDataEmpObj.viewEnvironment = environment.losUrl;
    this.viewJobDataEmpObj.whereValue = this.arrValue;

    this.viewJobDataSmeObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalJobDataSme.json";
    this.viewJobDataSmeObj.viewEnvironment = environment.losUrl;
    this.viewJobDataSmeObj.whereValue = this.arrValue;

    this.viewJobDataNonProfObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalJobDataNonProf.json";
    this.viewJobDataNonProfObj.viewEnvironment = environment.losUrl;
    this.viewJobDataNonProfObj.whereValue = this.arrValue;

    this.viewFinDataObj.viewInput = "./assets/ucviewgeneric/viewAppCustPersonalFinData.json";
    this.viewFinDataObj.viewEnvironment = environment.losUrl;
    this.viewFinDataObj.whereValue = this.arrValue;

    this.viewEmergencyContactObj.viewInput = "./assets/ucviewgeneric/viewAppCustEmrgncCntct.json";
    this.viewEmergencyContactObj.viewEnvironment = environment.losUrl;
    this.viewEmergencyContactObj.whereValue = this.arrValue;

    this.isDataAlreadyLoaded = true;
  }

  async getCustData() {
    let reqObj = {};
    let url = '';

    if(this.isDetail) {
      reqObj = { AppCustId: this.appCustId, IsForNapCompletionVersion: true };
      url = URLConstant.GetCustDataPersonalForViewByAppCustId;
    }
    else {
      reqObj = { AppId: this.appId, IsForNapCompletionVersion: true };
      url = URLConstant.GetCustDataPersonalForViewByAppId;
    }

    await this.http.post(url, reqObj).toPromise().then(
      (response) => {
        this.appCustObj = response["AppCustObj"];
        this.custModelCode = response["MrCustModelCode"];
        this.appCustAddrForViewObjs = response["AppCustAddrForViewObjs"];
        this.appCustBankAccObjs = response["AppCustBankAccObjs"];
        this.appCustGrpObjs = response["AppCustGrpObjs"];
        this.appCustPersonalContactPersonObjs = response["AppCustPersonalContactPersonObjs"] == null ? new Array<AppCustPersonalContactPersonObj>() : response["AppCustPersonalContactPersonObjs"];
        this.appCustFamilyObjs = response["AppCustFamilyObjs"];

        // filter family yg punya relationship
        if(this.appCustFamilyObjs && this.appCustFamilyObjs.length > 0) {
          this.appCustFamilyObjs = this.appCustFamilyObjs.filter(item => item['MrCustRelationshipCode'])
        }

        // filter cust group yg punya cust no & applicant no
        if(this.appCustGrpObjs && this.appCustGrpObjs.length > 0) {
          this.appCustGrpObjs = this.appCustGrpObjs.filter(item => item['CustNo'] || item['ApplicantNo'])
        }

        if(this.appCustObj.IsFamily) this.customerTitle = 'Family';
        else if(this.appCustObj.IsShareholder) this.customerTitle = 'Shareholder';
        else if(this.appCustObj.IsGuarantor) this.customerTitle = 'Guarantor';
        else this.customerTitle = 'Customer';
      });
  }

  viewDetailFamilyHandler(AppCustId, MrCustTypeCode){
    if(this.isPopupDetail)
    {
      const modalInsDetail = this.modalService.open(ViewAppCustDetailComponent);
      modalInsDetail.componentInstance.AppCustId = AppCustId;
      modalInsDetail.componentInstance.MrCustTypeCode = MrCustTypeCode;
      modalInsDetail.componentInstance.CustomerTitle = 'Family';
      modalInsDetail.result.then().catch((error) => {
      });
    }
    else
    {
      this.detailAppCustId = AppCustId;
      this.detailMrCustTypeCode = MrCustTypeCode;
      this.detailCustomerTitle = 'Family';
      this.isShowDetail = true;
    }
  }

  closeDetailHandler()
  {
    this.isShowDetail = false;
  }
}
