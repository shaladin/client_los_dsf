import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewAppCustDetailComponent } from '../view-app-cust-detail/view-app-cust-detail.component';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ResAppCustAddrForViewObj, ResAppCustCompanyLegalDocForViewObj, ResAppCustCompanyMgmntShrholderForViewObj, ResAppCustForViewObj, ResAppCustGrpForViewObj, ResCustDataCompanyForViewObj } from 'app/shared/model/Response/View/ResCustDataForViewObj.model';
import { ResAppCustBankAccForViewObj } from 'app/shared/model/Response/View/ResAppCustBankAccForViewObj.model';

@Component({
  selector: 'app-view-app-cust-data-completion-company',
  templateUrl: './view-app-cust-data-completion-company.component.html',
  styleUrls: []
})
export class ViewAppCustDataCompletionCompanyComponent implements OnInit {
  @Input() BizTemplateCode: string = "";
  @Input() appId: number;
  @Input() isDetail: boolean = false;
  @Input() appCustId: number;
  viewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  viewJobDataProfObj: string;
  viewJobDataEmpObj: string;
  viewJobDataSmeObj: string;
  viewJobDataNonProfObj: string;
  viewFinDataObj: UcViewGenericObj = new UcViewGenericObj();
  viewAppCustCompanyContactPersonObj: UcViewGenericObj = new UcViewGenericObj();

  customerTitle: string;
  arrValue = [];
  isDataAlreadyLoaded: boolean = false;

  isPopupDetail: boolean = false;
  isShowDetail: boolean = false;
  detailAppCustId: number;
  detailMrCustTypeCode: string;
  detailCustomerTitle: string;

  appCustObj: ResAppCustForViewObj = new ResAppCustForViewObj();
  appCustAddrForViewObjs: Array<ResAppCustAddrForViewObj> = new Array<ResAppCustAddrForViewObj>();
  appCustBankAccObjs: Array<ResAppCustBankAccForViewObj> = new Array<ResAppCustBankAccForViewObj>();
  appCustGrpObjs: Array<ResAppCustGrpForViewObj> = new Array<ResAppCustGrpForViewObj>();
  appCustCompanyMgmntShrholderObjs: Array<ResAppCustCompanyMgmntShrholderForViewObj> = new Array<ResAppCustCompanyMgmntShrholderForViewObj>();
  appCustCompanyLegalDocObjs: Array<ResAppCustCompanyLegalDocForViewObj> = new Array<ResAppCustCompanyLegalDocForViewObj>();

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  async ngOnInit() : Promise<void> {
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

    this.viewAppCustCompanyContactPersonObj.viewInput = "./assets/ucviewgeneric/viewAppCustCompanyContactPerson.json";
    this.viewAppCustCompanyContactPersonObj.viewEnvironment = environment.losUrl;
    this.viewAppCustCompanyContactPersonObj.whereValue = this.arrValue;

    this.isDataAlreadyLoaded = true;
  }

  async getCustData() {
    let reqObj = {};
    let url = '';

    if(this.isDetail) {
      reqObj = {AppCustId: this.appCustId, IsForNapCompletionVersion: true};
      url = URLConstant.GetCustDataCompanyForViewByAppCustId;
    }
    else {
      reqObj ={AppId: this.appId, IsForNapCompletionVersion: true};
      url = URLConstant.GetCustDataCompanyForViewByAppId;
    }

    await this.http.post(url, reqObj).toPromise().then(
      (response : ResCustDataCompanyForViewObj) => {
        this.appCustObj = response.AppCustObj;
        this.appCustAddrForViewObjs = response.ListAppCustAddrObj;
        this.appCustCompanyMgmntShrholderObjs = response.ListAppCustCompanyMgmntShrholderObj;
        this.appCustBankAccObjs = response.ListAppCustBankAccObj;
        this.appCustCompanyLegalDocObjs = response.ListAppCustCompanyLegalDocObj;
        this.appCustGrpObjs = response.ListAppCustGrpObj;

        if(this.appCustObj.IsFamily) this.customerTitle = 'Family';
        else if(this.appCustObj.IsShareholder) this.customerTitle = 'Shareholder';
        else if(this.appCustObj.IsGuarantor) this.customerTitle = 'Guarantor';
        else this.customerTitle = 'Customer';          

        // filter cust group yg punya cust no & applicant no
        if(this.appCustGrpObjs && this.appCustGrpObjs.length > 0) {
          this.appCustGrpObjs = this.appCustGrpObjs.filter(item => item['CustNo'] || item['ApplicantNo'])
        }
      });
  }

  viewDetailShareholderHandler(AppCustId, MrCustTypeCode) {
    if(this.isPopupDetail) {
      const modalInsDetail = this.modalService.open(ViewAppCustDetailComponent);
      modalInsDetail.componentInstance.AppCustId = AppCustId;
      modalInsDetail.componentInstance.MrCustTypeCode = MrCustTypeCode;
      modalInsDetail.componentInstance.CustomerTitle = 'Shareholder';
      modalInsDetail.result.then().catch((error) => {
      });
    }
    else {
      this.detailAppCustId = AppCustId;
      this.detailMrCustTypeCode = MrCustTypeCode;
      this.detailCustomerTitle = 'Shareholder';
      this.isShowDetail = true;
    }
  }

  closeDetailHandler() {
    this.isShowDetail = false;
  }
}