import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ToastrService } from 'ngx-toastr';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';
import { CrdRvwCustPersInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-pers-info.model';
import { CrdRvwCustPhnStatusObj } from 'app/shared/model/credit-review/crd-rvw-cust-phn-status-obj.model';
import { ResponseCrdRvwDiffAppToInPrcAppCustObj } from 'app/shared/model/credit-review/response-crd-rvw-diff-app-to-in-prc-app-cust-obj.model';
import { ReqCrdRvwDiffAppToInPrcAppCustObj } from 'app/shared/model/credit-review/req-crd-rvw-obj.model';
import { CrdRvwDiffAppToMasterCustObj } from 'app/shared/model/credit-review/crd-rvw-diff-app-to-master-cust-obj.model';
import { ReqGetVerfResult2Obj } from 'app/shared/model/verf-result/req-get-verf-result-obj.model';

@Component({
  selector: 'app-crd-rvw-cust-personal-info-x',
  templateUrl: './crd-rvw-cust-personal-info-x.component.html'
})
export class CrdRvwCustPersonalInfoXComponent implements OnInit {
  @Input() crdRvwCustInfoObj: CrdRvwCustInfoObj;
  @Output() ngModelForBankAcc: EventEmitter<any> = new EventEmitter();
  @Output() ngModelForNegCheckList: EventEmitter<any> = new EventEmitter();
  @Output() ngModelForCustHistDataX: EventEmitter<any> = new EventEmitter();
  @Output() ngModelForSurveyDataX: EventEmitter<any> = new EventEmitter();
  @Output() ngModelForFinancialData: EventEmitter<any> = new EventEmitter();

  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;
  readonly MaritalStatusMarried: string = CommonConstant.MasteCodeMartialStatsMarried;
  crdRvwCustPersInfoObj: CrdRvwCustPersInfoObj = new CrdRvwCustPersInfoObj();
  constructor(private modalService: NgbModal, private http: HttpClient, private toastr: ToastrService) { }

  async ngOnInit() {
    await this.GetCrdRvwCustPersInfoByCrdRvwCustInfoId();
    await this.GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId();
    await this.GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId();
    await this.GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId();
  }

  //#region Get data
  async GetCrdRvwCustPersInfoByCrdRvwCustInfoId() {
    await this.http.post<CrdRvwCustPersInfoObj>(URLConstant.GetCrdRvwCustPersInfoByCrdRvwCustInfoId, { Id: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.crdRvwCustPersInfoObj = response;
      }
    );
  }

  ListCrdRvwCustPhnStatusObj: Array<CrdRvwCustPhnStatusObj> = new Array<CrdRvwCustPhnStatusObj>();
  async GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwCustPhnStatusObj: Array<CrdRvwCustPhnStatusObj> }>(URLConstant.GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId, { Id: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.ListCrdRvwCustPhnStatusObj = response.ListCrdRvwCustPhnStatusObj;
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

  ListCrdRvwDiffAppToMasterCustObj: Array<CrdRvwDiffAppToMasterCustObj> = new Array<CrdRvwDiffAppToMasterCustObj>();
  async GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwDiffAppToMasterCustObj: Array<CrdRvwDiffAppToMasterCustObj> }>(URLConstant.GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId, { Id: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.ListCrdRvwDiffAppToMasterCustObj = response.ListCrdRvwDiffAppToMasterCustObj;
      }
    );
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

  async ClickLinkPhoneVerif() {
    console.log("click phn verif");
    let tempReqObj: ReqGetVerfResult2Obj = { TrxRefNo: this.crdRvwCustInfoObj.AppNo, MrVerfTrxTypeCode: "PHN_VERIF", MrVerfObjCode: "CUSTOMER" };
    await this.http.post<{ VerfResultHId: number }>(URLConstant.GetVerfResultHsByTrxRefNoAndMrVerfTrxTypeCodeAndMrVerfObjCode, tempReqObj).toPromise().then(
      (response) => {
        if (response != null || response != undefined) {
          AdInsHelper.OpenPhoneVerifViewByAppId(this.crdRvwCustInfoObj.AppId, response.VerfResultHId, this.crdRvwCustInfoObj.CustName);
        } else {
          this.toastr.warning(ExceptionConstant.NO_PHONE_VERF);
        }
      }
    )
  }

  // GetPhnVerfSubjData() {
  //   this.http.post<PhoneVerifObj>(URLConstant.GetAppPhoneVerifSubjectListByAppId, {AppId: this.crdRvwCustInfoObj.AppId}).subscribe(
  //     (response) => {
  //     }
  //   );
  // }
  //#endregion

  //#region Click View
  ClickLinkBankStatement() {
    this.ngModelForBankAcc.emit();
  }

  ClickLinkNegativeCheckingList() {
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
}
