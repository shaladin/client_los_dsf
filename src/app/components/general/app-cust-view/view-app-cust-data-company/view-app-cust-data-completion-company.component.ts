import { Component, OnInit, Input } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { ViewAppCustDetailComponent } from '../view-app-cust-detail/view-app-cust-detail.component';


@Component({
  selector: 'app-view-app-cust-data-completion-company',
  templateUrl: './view-app-cust-data-completion-company.component.html',
  styleUrls: []
})
export class ViewAppCustDataCompletionCompanyComponent implements OnInit {

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

  appCustObj: AppCustObj;
  appCustAddrForViewObjs: Array<AppCustAddrForViewObj>;
  appCustBankAccObjs: Array<AppCustBankAccObj>;
  appCustSocmedObjs: Array<AppCustSocmedObj>;
  appCustGrpObjs: Array<AppCustGrpObj>;
  appCustCompanyMgmntShrholderObjs: Array<AppCustCompanyMgmntShrholderObj>;
  appCustCompanyLegalDocObjs: Array<AppCustCompanyLegalDocObj>;

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  async ngOnInit() : Promise<void>{
    await this.getCustData();
    this.arrValue.push(this.appCustObj.AppCustId);
    this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewAppCustCompanyMainData.json";
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

  async getCustData(){
    let reqObj = {};
    let url = '';

    if(this.isDetail)
    {
      reqObj = {AppCustId: this.appCustId, IsForNapCompletionVersion: true};
      url = URLConstant.GetCustDataCompanyForViewByAppCustId;
    } else {
      reqObj ={AppId: this.appId, IsForNapCompletionVersion: true};
      url = URLConstant.GetCustDataCompanyForViewByAppId;
    }

    await this.http.post(url, reqObj).toPromise().then(
      (response) => {
        this.appCustObj = response["AppCustObj"];
        this.appCustAddrForViewObjs = response["AppCustAddrObjs"];
        this.appCustCompanyMgmntShrholderObjs = response["AppCustCompanyMgmntShrholderObjs"];
        this.appCustBankAccObjs = response["AppCustBankAccObjs"];
        this.appCustCompanyLegalDocObjs = response["AppCustCompanyLegalDocObjs"];
        this.appCustSocmedObjs = response["AppCustSocmedObjs"];
        this.appCustGrpObjs = response["AppCustGrpObjs"];

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

  viewDetailShareholderHandler(AppCustId, MrCustTypeCode){
    if(this.isPopupDetail)
    {
      const modalInsDetail = this.modalService.open(ViewAppCustDetailComponent);
      modalInsDetail.componentInstance.AppCustId = AppCustId;
      modalInsDetail.componentInstance.MrCustTypeCode = MrCustTypeCode;
      modalInsDetail.componentInstance.CustomerTitle = 'Shareholder';
      modalInsDetail.result.then().catch((error) => {
      });
    }
    else
    {
      this.detailAppCustId = AppCustId;
      this.detailMrCustTypeCode = MrCustTypeCode;
      this.detailCustomerTitle = 'Shareholder';
      this.isShowDetail = true;
    }
  }

  closeDetailHandler()
  {
    this.isShowDetail = false;
  }
}
