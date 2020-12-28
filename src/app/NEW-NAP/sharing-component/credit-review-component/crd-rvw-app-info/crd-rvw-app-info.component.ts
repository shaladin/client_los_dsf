import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwAppObj } from 'app/shared/model/CreditReview/CrdRvwAppObj.Model';
import { CrdRvwCustInfoIncomeAndExpenseDetailsObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoIncomeAndExpenseDetailsObj.Model';
import { ScoringResultDObj } from 'app/shared/model/ScoringResultDObj.Model';
import { ScoringResultHObj } from 'app/shared/model/ScoringResultHObj.Model';

@Component({
  selector: 'app-crd-rvw-app-info',
  templateUrl: './crd-rvw-app-info.component.html',
  styleUrls: ['./crd-rvw-app-info.component.scss']
})
export class CrdRvwAppInfoComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number = 0;
  @Input() appId: number = 0;
  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;

  constructor(
    // private route: ActivatedRoute,
    private http: HttpClient,
    private modalService: NgbModal,
    private _renderer2: Renderer2,
    // private fb: FormBuilder,
    // private router: Router
  ) { }

  crdRvwAppObj: CrdRvwAppObj = new CrdRvwAppObj();
  async ngOnInit() {
    // console.log(this.CrdRvwCustInfoId);
    await this.GetCrdRvwAppByCrdRvwCustInfoId();
    await this.GetCrdRvwCustInfoIncomeAndExpenseDetails();
    await this.GetLatestListScoringResultHAndResultDByTrxSourceNo();
  }

  async GetCrdRvwAppByCrdRvwCustInfoId() {
    await this.http.post<CrdRvwAppObj>(URLConstant.GetCrdRvwAppByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        console.log(response);
        this.crdRvwAppObj = response;
      }
    );
  }
  
  crdRvwCustInfoIncomeAndExpenseDetailsObj: CrdRvwCustInfoIncomeAndExpenseDetailsObj = new CrdRvwCustInfoIncomeAndExpenseDetailsObj();
  async GetCrdRvwCustInfoIncomeAndExpenseDetails(){
    await this.http.post<CrdRvwCustInfoIncomeAndExpenseDetailsObj>(URLConstant.GetCrdRvwCustInfoIncomeAndExpenseDetails, { AppId: this.appId }).toPromise().then(
      (response) => {
        console.log(response);
        this.crdRvwCustInfoIncomeAndExpenseDetailsObj = response;
      }
    );
  }

  scoringResultHObj: ScoringResultHObj = new ScoringResultHObj();
  ListScoringResultDObj: Array<ScoringResultDObj> = new Array<ScoringResultDObj>();
  async GetLatestListScoringResultHAndResultDByTrxSourceNo() {
    await this.http.post<{ ScoringResultHObj: ScoringResultHObj, ListScoringResultDObj: Array<ScoringResultDObj> }>(URLConstant.GetLatestListScoringResultHAndResultDByTrxSourceNo, { ScoringResultH: { TrxSourceNo: this.crdRvwAppObj.AppNo } }).toPromise().then(
      (response) => {
        console.log(response);
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
    console.log("click IncomeExpense");
    this.modalIncomeExpenseDetail = this.modalService.open(IncomeExpenseDetail);
    this.modalIncomeExpenseDetail.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.cancelIncomeExpenseDetail();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.cancelIncomeExpenseDetail();
    });
  }

  cancelIncomeExpenseDetail() {
    this.modalIncomeExpenseDetail.close();
  }
  //#endregion

  //#region CreditScoring
  modalCreditScoring: any;
  ClickLinkCreditScoring(CreditScoring) {
    console.log("click CreditScoring");
    this.modalCreditScoring = this.modalService.open(CreditScoring);
    this.modalCreditScoring.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.cancelCreditScoring();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.cancelCreditScoring();
    });
  }

  cancelCreditScoring() {
    this.modalCreditScoring.close();
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
