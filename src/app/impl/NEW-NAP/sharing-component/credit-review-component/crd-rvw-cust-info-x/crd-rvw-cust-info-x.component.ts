import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { CrdRvwAppObj } from 'app/shared/model/credit-review/crd-rvw-app-obj.model';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';
import { CrdRvwExposureDObj } from 'app/shared/model/credit-review/crd-rvw-exposure-d-obj.model';
import { ReqGetCrdRvwExposureHObj } from 'app/shared/model/credit-review/req-get-crd-rvw-exposure-h-obj.model';
import { CrdRvwExposureHObj } from 'app/shared/model/credit-review/crd-rvw-exposure-h-obj.model';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { NegCustObj } from 'app/shared/model/credit-review/neg-cust-obj.model';

@Component({
  selector: 'app-crd-rvw-cust-info-x',
  templateUrl: './crd-rvw-cust-info-x.component.html'
})
export class CrdRvwCustInfoXComponent implements OnInit {
  ReqCustNo: GenericObj = new GenericObj();
  @Input() crdRvwAppObj: CrdRvwAppObj = new CrdRvwAppObj();
  @Input() appId: number = 0;
  @Input() crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  @Input() captureStat: string = "";
  isCustCrdRvwExposureObj: boolean = false;

  //#region Exposure Type
  readonly ExposureCustTypeCode: string = CommonConstant.ExposureCustTypeCode;
  readonly ExposureCustGroupTypeCode: string = CommonConstant.ExposureCustGroupTypeCode;
  readonly ExposureObligorTypeCode: string = CommonConstant.ExposureObligorTypeCode;
  //#endregion

  readonly CustTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly CustTypeCompany: string = CommonConstant.CustTypeCompany;

  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;
  constructor(
    private modalService: NgbModal, private http: HttpClient) { }

  async ngOnInit() {
    this.crdRvwCustInfoObj.AppId = this.appId;
    await this.GetCrdRvwExposureByCrdRvwCustInfoIdAndRelationType();
    await this.GetAppCustBankAccList();
    await this.GetListNegativeCustByCustNo();
  }


  CustCrdRvwExposureObj: CrdRvwExposureDObj = new CrdRvwExposureDObj();
  CustGroupCrdRvwExposureObj: CrdRvwExposureDObj = new CrdRvwExposureDObj();
  ObligorCrdRvwExposureObj: CrdRvwExposureDObj = new CrdRvwExposureDObj();
  async GetCrdRvwExposureByCrdRvwCustInfoIdAndRelationType() {
    let reqObj: ReqGetCrdRvwExposureHObj = { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId, RelationType: CommonConstant.CrdRvwRelationTypeCustomer };
    await this.http.post<CrdRvwExposureHObj>(URLConstant.GetCrdRvwExposureByCrdRvwCustInfoIdAndRelationType, reqObj).toPromise().then(
      (response) => {
        for (let index = 0; index < response.ListCrdRvwExposureDObj.length; index++) {
          const element = response.ListCrdRvwExposureDObj[index];
          if (element.ExposureType == this.ExposureCustTypeCode) {
            this.CustCrdRvwExposureObj = element;
            this.isCustCrdRvwExposureObj = true;
          }
          if (element.ExposureType == this.ExposureCustGroupTypeCode) {
            this.CustGroupCrdRvwExposureObj = element;
          }
          if (element.ExposureType == this.ExposureObligorTypeCode) {
            this.ObligorCrdRvwExposureObj = element;
          }
        }
      }
    );
  }

  ListAppCustBankAccObjs: Array<AppCustBankAccObj> = new Array<AppCustBankAccObj>();
  async GetAppCustBankAccList() {
    await this.http.post<{ AppCustBankAccList: Array<AppCustBankAccObj> }>(URLConstant.GetAppCustBankAccAndStatementForView, { Id: this.crdRvwCustInfoObj.AppCustId }).toPromise().then(
      (response) => {
        this.ListAppCustBankAccObjs = response.AppCustBankAccList;
      });
  }

  ListNegCust: Array<NegCustObj> = new Array<NegCustObj>();
  async GetListNegativeCustByCustNo() {
    this.ReqCustNo.CustNo = this.crdRvwCustInfoObj.CustNo;
    await this.http.post<{ ListNegativeCustObj: Array<NegCustObj> }>(URLConstant.GetListNegativeCustByCustNo, this.ReqCustNo).toPromise().then(
      (response) => {
        this.ListNegCust = response.ListNegativeCustObj;
      });

  }

  ClickLinkViewCustExposure() {
    AdInsHelper.OpenCustExposureViewByCrdRvwExposureHId(this.CustCrdRvwExposureObj.CrdRvwExposureHId);
  }

  //#region Link a href
  closeResult: any;
  //#region BankAcc
  modalBankStatement: any;
  ClickLinkBankStatement(BankStatementContent) {
    this.modalBankStatement = this.modalService.open(BankStatementContent);
    this.modalBankStatement.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modalBankStatement.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalBankStatement.close();
    });
  }
  //#endregion

  //#region NegCheck
  modalNegCheckListContent: any;
  ClickLinkNegativeCheckingList(NegCheckListContent) {
    this.modalNegCheckListContent = this.modalService.open(NegCheckListContent);
    this.modalNegCheckListContent.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modalNegCheckListContent.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalNegCheckListContent.close();
    });
  }
  //#endregion

  //#region CustHistData
  modalCustHistData: any;
  ClickLinkCustHistData(CustHistDataContent) {
    this.modalCustHistData = this.modalService.open(CustHistDataContent);
    this.modalCustHistData.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modalCustHistData.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalCustHistData.close();
    });
  }
  //#endregion

  //#region SurveyData
  modalSurveyData: any;
  ClinkLinkSurveyData(SurveyDataContent) {
    this.modalSurveyData = this.modalService.open(SurveyDataContent);
    this.modalSurveyData.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modalSurveyData.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalSurveyData.close();
    });
  }
  //#endregion

  //#region FinancialData
  modalFinancialData: any;
  ClickLinkFinancialData(FinancialDataContent) {
    this.modalFinancialData = this.modalService.open(FinancialDataContent);
    this.modalFinancialData.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modalFinancialData.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalFinancialData.close();
    })
  }
  //#endregion

  //#region DismissReason
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  //#endregion
}
