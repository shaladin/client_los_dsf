import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ResAppCustAddrForViewObj, ResAppCustAttrForViewObj, ResAppCustCompanyLegalDocForViewObj, ResAppCustCompanyMgmntShrholderForViewObj, ResAppCustForViewObj, ResAppCustGrpForViewObj, ResAppCustOtherInfoForViewObj, ResCustDataCompanyForViewObj } from 'app/shared/model/response/view/res-cust-data-for-view-obj.model';
import { ResAppCustBankAccForViewObj } from 'app/shared/model/response/view/res-app-cust-bank-acc-for-view-obj.model';
import { DatePipe } from '@angular/common';
import { AppCustCompanyObj } from 'app/shared/model/app-cust-company-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ViewAppCustDetailComponent } from 'app/components/general/app-cust-view/view-app-cust-detail/view-app-cust-detail.component';
import { ResAppCustCompanyMgmntShrholderForViewObjX, ResCustDataCompanyForViewObjX } from 'app/impl/shared/model/view/res-cust-data-for-view-obj-x.model';

@Component({
  selector: 'app-view-app-cust-data-completion-company-x',
  templateUrl: './view-app-cust-data-completion-company-x.component.html',
  styleUrls: []
})
export class ViewAppCustDataCompletionCompanyXComponent implements OnInit {
  @Input() BizTemplateCode: string = "";
  @Input() appId: number;
  @Input() isDetail: boolean = false;
  @Input() appCustId: number;
  viewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  viewJobDataProfObj: string;
  viewJobDataEmpObj: string;
  viewJobDataSmeObj: string;
  viewJobDataNonProfObj: string;
  viewAppCustCompanyContactPersonObj: UcViewGenericObj = new UcViewGenericObj();

  TitleCustFinDataSuffix:string = '';
  IsShowCustFinDataDetail:boolean = false;
  ListCustCoyFinData : Array<object> = new Array<object>();
  CustCoyFinData : object;
  attrSection:boolean = false;
  currentCustFinDataIndex: number;
  responseCustAttr: Array<object> = new Array<object>();

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
  appCustCompanyMgmntShrholderObjXs: Array<ResAppCustCompanyMgmntShrholderForViewObjX> = new Array<ResAppCustCompanyMgmntShrholderForViewObjX>();
  appCustCompanyLegalDocObjs: Array<ResAppCustCompanyLegalDocForViewObj> = new Array<ResAppCustCompanyLegalDocForViewObj>();
  appCustOtherInfoForViewObj: ResAppCustOtherInfoForViewObj = new ResAppCustOtherInfoForViewObj;
  appCustAttrContentsObj : Array<ResAppCustAttrForViewObj> = new Array<ResAppCustAttrForViewObj>();
  readonly ShrTypePublic: string = CommonConstant.CustTypePublic;

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
    this.viewMainDataObj.whereValue = this.arrValue;

    this.viewAppCustCompanyContactPersonObj.viewInput = "./assets/ucviewgeneric/viewAppCustCompanyContactPerson.json";
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
      url = URLConstantX.GetCustDataCompanyForViewXByAppId;
    }

    await this.http.post(url, reqObj).toPromise().then(
      (response : ResCustDataCompanyForViewObjX) => {
        this.appCustObj = response.AppCustObj;
        this.appCustAddrForViewObjs = response.ListAppCustAddrObj;
        this.appCustCompanyMgmntShrholderObjXs = response.ListAppCustCompanyMgmntShrholderObjX;
        this.appCustBankAccObjs = response.ListAppCustBankAccObj;
        this.appCustCompanyLegalDocObjs = response.ListAppCustCompanyLegalDocObj;
        this.appCustGrpObjs = response.ListAppCustGrpObj;
        this.ListCustCoyFinData = response.ListAppCustCompanyFinDataX;
        this.responseCustAttr = response.ListCustFinDataAttrContent;
        this.appCustOtherInfoForViewObj = response.AppCustOtherInfoForViewObj;
        this.appCustAttrContentsObj = response.ListAppCustAttrContentObj;

        this.loadShareholderListData(this.appCustObj.AppCustId);

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

  loadShareholderListData(AppCustId) {
    this.http.post<AppCustCompanyObj>(URLConstant.GetAppCustCompanyByAppCustId, { Id: AppCustId }).subscribe(
      (response) => {
        this.http.post(URLConstantX.GetListManagementShareholderForListPagingByParentAppCustCompanyId, { Id: response.AppCustCompanyId }).subscribe(
          (response) => {
            this.appCustCompanyMgmntShrholderObjXs = response[CommonConstant.ReturnObj];
          }
        );
      }
    );
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

  hideDetailCustFinData()
  {
    this.TitleCustFinDataSuffix = '';
    this.IsShowCustFinDataDetail = false;
    this.CustCoyFinData = null;
  }

  showDetailCustFinData(index:number){
    let datePipe = new DatePipe("en-US");
    this.currentCustFinDataIndex = index;
    this.CustCoyFinData = this.ListCustCoyFinData[this.currentCustFinDataIndex];
    this.TitleCustFinDataSuffix = ' Date as of '+datePipe.transform(this.CustCoyFinData['DateAsOf'], 'dd-MMM-yyyy')
    this.IsShowCustFinDataDetail = true;
  }
}