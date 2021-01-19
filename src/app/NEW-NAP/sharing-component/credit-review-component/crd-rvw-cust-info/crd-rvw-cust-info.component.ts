import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { CrdRvwExposureObj } from 'app/shared/model/CreditReview/CrdRvwExposureObj.Model';
import { NegCustObj } from 'app/shared/model/CreditReview/NegCustObj.model';

@Component({
  selector: 'app-crd-rvw-cust-info',
  templateUrl: './crd-rvw-cust-info.component.html',
  styleUrls: ['./crd-rvw-cust-info.component.scss']
})
export class CrdRvwCustInfoComponent implements OnInit {

  @Input() appId: number = 0;
  @Input() crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();

  //#region Exposure Type
  readonly ExposureCustTypeCode: string = CommonConstant.ExposureCustTypeCode;
  readonly ExposureCustGroupTypeCode: string = CommonConstant.ExposureCustGroupTypeCode;
  readonly ExposureObligorTypeCode: string = CommonConstant.ExposureObligorTypeCode;
  //#endregion

  readonly CustTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly CustTypeCompany: string = CommonConstant.CustTypeCompany;

  constructor(
    private modalService: NgbModal, private http: HttpClient) { }

  async ngOnInit() {
    this.crdRvwCustInfoObj.AppId = this.appId;
    await this.GetListCrdRvwExposureByCrdRvwCustInfoId();
    await this.GetAppCustBankAccList();
    await this.GetListNegativeCustByCustNo();
  }


  CustCrdRvwExposureObj: CrdRvwExposureObj = new CrdRvwExposureObj();
  CustGroupCrdRvwExposureObj: CrdRvwExposureObj = new CrdRvwExposureObj();
  ObligorCrdRvwExposureObj: CrdRvwExposureObj = new CrdRvwExposureObj();
  async GetListCrdRvwExposureByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwExposureObj: Array<CrdRvwExposureObj> }>(URLConstant.GetListCrdRvwExposureByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        for (let index = 0; index < response.ListCrdRvwExposureObj.length; index++) {
          const element = response.ListCrdRvwExposureObj[index];
          if (element.ExposureType == this.ExposureCustTypeCode) {
            this.CustCrdRvwExposureObj = element;
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
    await this.http.post<{ AppCustBankAccList: Array<AppCustBankAccObj> }>(URLConstant.GetAppCustBankAccAndStatementForView, { AppCustId: this.crdRvwCustInfoObj.AppCustId }).toPromise().then(
      (response) => {
        this.ListAppCustBankAccObjs = response.AppCustBankAccList;
      });
  }

  ListNegCust: Array<NegCustObj> = new Array<NegCustObj>();
  async GetListNegativeCustByCustNo() {
    await this.http.post<Array<NegCustObj>>(URLConstant.GetListNegativeCustByCustNo, { CustNo: this.crdRvwCustInfoObj.CustNo }).toPromise().then(
      (response) => {
        // console.log(response);
        this.ListNegCust = response;
      });

  }

  ClickLinkViewCustExposure() {
    AdInsHelper.OpenCustExposureViewByCrdRvwCustInfoId(this.appId);
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

