import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';
import { CrdRvwCustPhnStatusObj } from 'app/shared/model/credit-review/crd-rvw-cust-phn-status-obj.model';
import { CrdRvwCustCoyInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-coy-info-obj.model';
import { CrdRvwDiffAppToMasterCustObj } from 'app/shared/model/credit-review/crd-rvw-diff-app-to-master-cust-obj.model';
import { ResponseCrdRvwDiffAppToInPrcAppCustObj } from 'app/shared/model/credit-review/response-crd-rvw-diff-app-to-in-prc-app-cust-obj.model';
import { ReqCrdRvwDiffAppToInPrcAppCustObj } from 'app/shared/model/credit-review/req-crd-rvw-obj.model';


@Component({
  selector: 'app-crd-rvw-cust-company-info-x',
  templateUrl: './crd-rvw-cust-company-info-x.component.html'
})
export class CrdRvwCustCompanyInfoXComponent implements OnInit {

  @Input() crdRvwCustInfoObj: CrdRvwCustInfoObj;
  @Output() ngModelForBankAcc: EventEmitter<any> = new EventEmitter();
  @Output() ngModelForNegCheckList: EventEmitter<any> = new EventEmitter();
  @Output() ngModelForCustHistDataX: EventEmitter<any> = new EventEmitter();
  @Output() ngModelForSurveyDataX: EventEmitter<any> = new EventEmitter();
  @Output() ngModelForFinancialData: EventEmitter<any> = new EventEmitter();

  //#region Exposure Type
  readonly ExposureCustTypeCode: string = CommonConstant.ExposureCustTypeCode;
  readonly ExposureCustGroupTypeCode: string = CommonConstant.ExposureCustTypeCode;
  readonly ExposureObligorTypeCode: string = CommonConstant.ExposureCustTypeCode;
  //#endregion
  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;
  constructor(
    private http: HttpClient,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    await this.GetCrdRvwCustCoyInfoByCrdRvwCustInfoId();
    await this.GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId();
    await this.GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId();
    await this.GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId();
  }

  //#region Get
  ListCrdRvwCustPhnStatusObj: Array<CrdRvwCustPhnStatusObj> = new Array<CrdRvwCustPhnStatusObj>();
  async GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwCustPhnStatusObj: Array<CrdRvwCustPhnStatusObj> }>(URLConstant.GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId, { Id: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.ListCrdRvwCustPhnStatusObj = response.ListCrdRvwCustPhnStatusObj;
      }
    );
  }

  crdRvwCustCoyInfoObj: CrdRvwCustCoyInfoObj = new CrdRvwCustCoyInfoObj();
  async GetCrdRvwCustCoyInfoByCrdRvwCustInfoId() {
    await this.http.post<CrdRvwCustCoyInfoObj>(URLConstant.GetCrdRvwCustCoyInfoByCrdRvwCustInfoId, { Id: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.crdRvwCustCoyInfoObj = response;
      }
    );
  }

  ListCrdRvwDiffAppToMasterCustObj: Array<CrdRvwDiffAppToMasterCustObj> = new Array<CrdRvwDiffAppToMasterCustObj>();
  async GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwDiffAppToMasterCustObj: Array<CrdRvwDiffAppToMasterCustObj> }>(URLConstant.GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId, { Id: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.ListCrdRvwDiffAppToMasterCustObj = response.ListCrdRvwDiffAppToMasterCustObj;
      }
    );
  }

  responseCrdRvwDiffAppToInPrcAppCustObj: ResponseCrdRvwDiffAppToInPrcAppCustObj = new ResponseCrdRvwDiffAppToInPrcAppCustObj();
  async GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId() {
    let reqObj: ReqCrdRvwDiffAppToInPrcAppCustObj = { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId, IsGenerateDict: true };
    await this.http.post<ResponseCrdRvwDiffAppToInPrcAppCustObj>(URLConstant.GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId, reqObj).toPromise().then(
      (response) => {
        this.responseCrdRvwDiffAppToInPrcAppCustObj = response;
      }
    );
  }

  //#endregion

  //#region Click View
  ClickLinkBankStatement(){
    this.ngModelForBankAcc.emit();
  }

  ClickLinkNegativeCheckingList(){
    this.ngModelForNegCheckList.emit();
  }

  ClickLinkSurvey() {
    this.ngModelForSurveyDataX.emit();
  }

  ClickLinkCustomerHistoryData() {
    this.ngModelForCustHistDataX.emit();
  }
  
  ClickLinkFinancialData() {
    this.ngModelForFinancialData.emit();
  }
  //#endregion

  //#region Link a href
  closeResult: any;
  //#region DiffCust
  modalDiffCustContent: any;
  ClickLinkDiffCust(DiffCustContent) {
    console.log("click diffCust");
    this.modalDiffCustContent = this.modalService.open(DiffCustContent);
    this.modalDiffCustContent.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.cancelDiffCustContent();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.cancelDiffCustContent();
    });
  }

  cancelDiffCustContent() {
    this.modalDiffCustContent.close();
  }
  //#endregion

  //#region DiffApp
  modalDiffAppContent: any;
  ClickLinkDiffApp(DiffAppContent) {
    console.log("click diffApp");
    this.modalDiffAppContent = this.modalService.open(DiffAppContent);
    this.modalDiffAppContent.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.cancelDiffAppContent();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.cancelDiffAppContent();
    });
  }

  cancelDiffAppContent() {
    this.modalDiffAppContent.close();
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
