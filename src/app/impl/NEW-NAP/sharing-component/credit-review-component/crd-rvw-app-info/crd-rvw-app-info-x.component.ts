import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwAppObjX } from 'app/impl/shared/model/CreditReview/CrdRvwAppObjX.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CrdRvwAppObj } from 'app/shared/model/credit-review/crd-rvw-app-obj.model';
import { CrdRvwCustInfoIncomeAndExpenseDetailsObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-income-and-expense-details-obj.model';
import { ScoringResultHObj } from 'app/shared/model/scoring-result-h-obj.model';
import { ScoringResultDObj } from 'app/shared/model/scoring-result-d-obj.model';
import { ResMouCustClauseObj } from 'app/shared/model/response/mou/mou-cust/res-mou-cust-clause-obj.model';
import { AppFinDataObjX } from 'app/impl/shared/model/AppFinDataObjX.model';
import { AppSubsidyProfitablityXObj } from 'app/impl/shared/model/AppSubsidyProfitablityXObj.model';

@Component({
  selector: 'app-crd-rvw-app-info-x',
  templateUrl: './crd-rvw-app-info-x.component.html'
})
export class CrdRvwAppInfoXComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number = 0;
  @Input() appId: number = 0;
  @Input() BizTemplateCode: string = "";
  @Output() callbackCrdRvwAppObj: EventEmitter<CrdRvwAppObj> = new EventEmitter();
  @Output() callbackAppFinDataObj: EventEmitter<AppFinDataObjX> = new EventEmitter();
  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
  ) { }

  totalIncomeAmt: number = 0;
  tacAmt: number = 0;
  ListAppSubsidyProfitablityXObj : Array<AppSubsidyProfitablityXObj> = new  Array<AppSubsidyProfitablityXObj>();
  crdRvwAppObj: CrdRvwAppObjX = new CrdRvwAppObjX();
  appFinDataObj: AppFinDataObjX = new AppFinDataObjX();
  async ngOnInit() {
    await this.GetCrdRvwAppByCrdRvwCustInfoId();
    await this.GetCrdRvwCustInfoIncomeAndExpenseDetails();
    await this.GetLatestListScoringResultHAndResultDByTrxSourceNo();
    await this.GetInitAppFinDataByAppIdX();
    await this.GetAppSubsidyProfitablityXObj();
    await this.SetTotalIncome();
    await this.SetTacAmt();
  }

  async GetCrdRvwAppByCrdRvwCustInfoId() {
    await this.http.post<CrdRvwAppObjX>(URLConstantX.GetCrdRvwAppByCrdRvwCustInfoId, { Id: this.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.crdRvwAppObj = response;
        this.callbackCrdRvwAppObj.emit(response);
      }
    );
  }

  async SetTotalIncome() {
    this.totalIncomeAmt = 0;
    this.totalIncomeAmt = this.crdRvwCustInfoIncomeAndExpenseDetailsObj.InsAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.LifeInsAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.SubsidyRateAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.TotalInterestAmt;
    for (let index = 0; index < this.crdRvwCustInfoIncomeAndExpenseDetailsObj.ListAppFeeObj.length; index++) {
      const element = this.crdRvwCustInfoIncomeAndExpenseDetailsObj.ListAppFeeObj[index];
      this.totalIncomeAmt += element.AppFeeAmt;
    }
    for (let index = 0; index < this.ListAppSubsidyProfitablityXObj.length; index++) {
      const element = this.ListAppSubsidyProfitablityXObj[index];
      this.totalIncomeAmt += element.SubsidyAmt;
    }
  }

  async GetAppSubsidyProfitablityXObj() {
    await this.http.post<AppSubsidyProfitablityXObj>(URLConstantX.GetListAppSubsidyProfitabilityXForViewByAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.ListAppSubsidyProfitablityXObj= response["ListObjs"];
      }
    );
  }

  async SetTacAmt() {
    this.tacAmt = this.crdRvwCustInfoIncomeAndExpenseDetailsObj.CommissionAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.ReserveFundAmt;
  }

  crdRvwCustInfoIncomeAndExpenseDetailsObj: CrdRvwCustInfoIncomeAndExpenseDetailsObj = new CrdRvwCustInfoIncomeAndExpenseDetailsObj();
  async GetCrdRvwCustInfoIncomeAndExpenseDetails() {
    await this.http.post<CrdRvwCustInfoIncomeAndExpenseDetailsObj>(URLConstant.GetCrdRvwCustInfoIncomeAndExpenseDetails, { Id: this.appId }).toPromise().then(
      (response) => {
        this.crdRvwCustInfoIncomeAndExpenseDetailsObj = response;
      }
    );
  }

  scoringResultHObj: ScoringResultHObj = new ScoringResultHObj();
  ListScoringResultDObj: Array<ScoringResultDObj> = new Array<ScoringResultDObj>();
  async GetLatestListScoringResultHAndResultDByTrxSourceNo() {
    console.log(this.scoringResultHObj);
    await this.http.post<{ ScoringResultHObj: ScoringResultHObj, ListScoringResultDObj: Array<ScoringResultDObj> }>(URLConstant.GetLatestListScoringResultHAndResultDByTrxSourceNo, { TrxSourceNo: this.crdRvwAppObj.AppNo ,TrxSourceType: CommonConstant.LOAN_ORIGINATION}).toPromise().then(
      (response) => {
        this.scoringResultHObj = response.ScoringResultHObj;
        this.ListScoringResultDObj = response.ListScoringResultDObj;
      }
    );
  }
  async GetInitAppFinDataByAppIdX() {
    await this.http.post<AppFinDataObjX>(URLConstantX.GetInitAppFinDataByAppIdX, { Id: this.appId }).toPromise().then(
      (response) => {
        this.appFinDataObj = response;
        this.callbackAppFinDataObj.emit(response);
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
