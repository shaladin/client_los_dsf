import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwAppObj } from 'app/shared/model/credit-review/crd-rvw-app-obj.model';
import { CrdRvwCustInfoIncomeAndExpenseDetailsObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-income-and-expense-details-obj.model';
import { ScoringResultDObj } from 'app/shared/model/scoring-result-d-obj.model';
import { ScoringResultHObj } from 'app/shared/model/scoring-result-h-obj.model';

@Component({
  selector: 'app-crd-rvw-app-info',
  templateUrl: './crd-rvw-app-info.component.html',
  styleUrls: ['./crd-rvw-app-info.component.scss']
})
export class CrdRvwAppInfoComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number = 0;
  @Input() appId: number = 0;
  @Input() BizTemplateCode: string = "";
  @Output() callbackCrdRvwAppObj: EventEmitter<CrdRvwAppObj> = new EventEmitter();
  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
  ) { }

  crdRvwAppObj: CrdRvwAppObj = new CrdRvwAppObj();
  async ngOnInit() {
    await this.GetCrdRvwAppByCrdRvwCustInfoId();
    await this.GetCrdRvwCustInfoIncomeAndExpenseDetails();
    await this.GetLatestListScoringResultHAndResultDByTrxSourceNo();
  }

  async GetCrdRvwAppByCrdRvwCustInfoId() {
    await this.http.post<CrdRvwAppObj>(URLConstant.GetCrdRvwAppByCrdRvwCustInfoId, { Id: this.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.crdRvwAppObj = response;
        this.callbackCrdRvwAppObj.emit(response);
      }
    );
  }
  
  crdRvwCustInfoIncomeAndExpenseDetailsObj: CrdRvwCustInfoIncomeAndExpenseDetailsObj = new CrdRvwCustInfoIncomeAndExpenseDetailsObj();
  async GetCrdRvwCustInfoIncomeAndExpenseDetails(){
    await this.http.post<CrdRvwCustInfoIncomeAndExpenseDetailsObj>(URLConstant.GetCrdRvwCustInfoIncomeAndExpenseDetails, { Id: this.appId }).toPromise().then(
      (response) => {
        this.crdRvwCustInfoIncomeAndExpenseDetailsObj = response;
      }
    );
  }

  scoringResultHObj: ScoringResultHObj = new ScoringResultHObj();
  ListScoringResultDObj: Array<ScoringResultDObj> = new Array<ScoringResultDObj>();
  async GetLatestListScoringResultHAndResultDByTrxSourceNo() {
    await this.http.post<{ ScoringResultHObj: ScoringResultHObj, ListScoringResultDObj: Array<ScoringResultDObj> }>(URLConstant.GetLatestListScoringResultHAndResultDByTrxSourceNo, { TrxSourceNo: this.crdRvwAppObj.AppNo, TrxSourceType: "LOS" }).toPromise().then(
      (response) => {
        this.scoringResultHObj = response.ScoringResultHObj;
        this.ListScoringResultDObj = response.ListScoringResultDObj;
      }
    );
  }

  //#region Link a href
  closeResult: any;
  //#region IncomeExpenseDetail
  modalIncomeExpenseDetail: any;
  ClickLinkIncomeExpenseDetail(IncomeExpenseDetail) {
    this.modalIncomeExpenseDetail = this.modalService.open(IncomeExpenseDetail);
    this.modalIncomeExpenseDetail.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modalIncomeExpenseDetail.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalIncomeExpenseDetail.close();
    });
  }
  //#endregion

  //#region CreditScoring
  modalCreditScoring: any;
  ClickLinkCreditScoring(CreditScoring) {
    console.log("click CreditScoring");
    this.modalCreditScoring = this.modalService.open(CreditScoring);
    this.modalCreditScoring.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modalCreditScoring.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalCreditScoring.close();
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
