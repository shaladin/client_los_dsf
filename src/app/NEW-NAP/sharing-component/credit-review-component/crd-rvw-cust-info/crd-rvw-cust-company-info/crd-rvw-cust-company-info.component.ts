import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCustCoyInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustCoyInfoObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { CrdRvwCustPhnStatusObj } from 'app/shared/model/CreditReview/CrdRvwCustPhnStatusObj.Model';
import { CrdRvwDiffAppToMasterCustObj } from 'app/shared/model/CreditReview/CrdRvwDiffAppToMasterCustObj.Model';
import { CrdRvwExposureObj } from 'app/shared/model/CreditReview/CrdRvwExposureObj.Model';
import { ResponseCrdRvwDiffAppToInPrcAppCustObj } from 'app/shared/model/CreditReview/ResponseCrdRvwDiffAppToInPrcAppCustObj.Model';

@Component({
  selector: 'app-crd-rvw-cust-company-info',
  templateUrl: './crd-rvw-cust-company-info.component.html',
  styleUrls: ['./crd-rvw-cust-company-info.component.scss']
})
export class CrdRvwCustCompanyInfoComponent implements OnInit {

  @Input() crdRvwCustInfoObj: CrdRvwCustInfoObj;
  @Output() ngModelForBankAcc: EventEmitter<any> = new EventEmitter<any>();
  @Output() ngModelForNegCheckList: EventEmitter<any> = new EventEmitter<any>();

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
    await this.http.post<{ ListCrdRvwCustPhnStatusObj: Array<CrdRvwCustPhnStatusObj> }>(URLConstant.GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.ListCrdRvwCustPhnStatusObj = response.ListCrdRvwCustPhnStatusObj;
      }
    );
  }

  crdRvwCustCoyInfoObj: CrdRvwCustCoyInfoObj = new CrdRvwCustCoyInfoObj();
  async GetCrdRvwCustCoyInfoByCrdRvwCustInfoId() {
    await this.http.post<CrdRvwCustCoyInfoObj>(URLConstant.GetCrdRvwCustCoyInfoByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.crdRvwCustCoyInfoObj = response;
      }
    );
  }  
  
  ListCrdRvwDiffAppToMasterCustObj: Array<CrdRvwDiffAppToMasterCustObj> = new Array<CrdRvwDiffAppToMasterCustObj>();
  async GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwDiffAppToMasterCustObj: Array<CrdRvwDiffAppToMasterCustObj> }>(URLConstant.GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.ListCrdRvwDiffAppToMasterCustObj = response.ListCrdRvwDiffAppToMasterCustObj;
      }
    );
  }
  
  responseCrdRvwDiffAppToInPrcAppCustObj: ResponseCrdRvwDiffAppToInPrcAppCustObj = new ResponseCrdRvwDiffAppToInPrcAppCustObj();
  async GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId() {
    await this.http.post<ResponseCrdRvwDiffAppToInPrcAppCustObj>(URLConstant.GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId, IsGenerateDict: true }).toPromise().then(
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
