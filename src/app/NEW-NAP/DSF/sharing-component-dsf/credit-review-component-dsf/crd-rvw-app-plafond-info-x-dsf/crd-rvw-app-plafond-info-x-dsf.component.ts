import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwAppObjX } from 'app/impl/shared/model/CreditReview/CrdRvwAppObjX.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CrdRvwAppObj } from 'app/shared/model/credit-review/crd-rvw-app-obj.model';
import { ScoringResultHObj } from 'app/shared/model/scoring-result-h-obj.model';
import { ScoringResultDObj } from 'app/shared/model/scoring-result-d-obj.model';
import { AppFinDataObjX } from 'app/impl/shared/model/AppFinDataObjX.model';
import { SummaryAppObj } from 'app/shared/model/app/summary-app-obj.model';
import { AgrmntMasterXDsfObj } from 'app/shared/model/agrmnt-master-x-dsf-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { AppObj } from 'app/shared/model/app/app.model';

@Component({
  selector: 'app-crd-rvw-app-plafond-info-x-dsf',
  templateUrl: './crd-rvw-app-plafond-info-x-dsf.component.html',
  styleUrls: ['./crd-rvw-app-plafond-info-x-dsf.component.css']
})
export class CrdRvwAppPlafondInfoXDsfComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number = 0;
  @Input() appId: number = 0;
  @Input() BizTemplateCode: string = "";
  @Output() callbackCrdRvwAppObj: EventEmitter<CrdRvwAppObj> = new EventEmitter();
  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;
  AppNo: string = "";
  AppObj: AppObj;
  MasterAgreementNo;
  RemainingPlafond: number = 0;
  RequestedPlafond: number = 0;
  MaxPlafondMasterAgreement: number = 0;
  AgrmntMasterXDsf: AgrmntMasterXDsfObj;
  isRequestedPlafondAvailable: boolean = true;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
  ) { }

  crdRvwAppObj: CrdRvwAppObjX = new CrdRvwAppObjX();
  appFinDataObj: AppFinDataObjX = new AppFinDataObjX();
  async ngOnInit() {
    await this.GetCrdRvwAppByCrdRvwCustInfoId();
    await this.GetLatestListScoringResultHAndResultDByTrxSourceNo();
    await this.GetAppSummary();
  }

  async GetCrdRvwAppByCrdRvwCustInfoId() {
    await this.http.post<CrdRvwAppObjX>(URLConstantX.GetCrdRvwAppByCrdRvwCustInfoId, { Id: this.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.crdRvwAppObj = response;
        this.callbackCrdRvwAppObj.emit(response);
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

  async GetAppSummary()
  {
    var appObj = { Id: this.appId };
    await this.http.post<AppObj>(URLConstant.GetAppById, appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
        this.AppNo = this.AppObj.AppNo;
      });

    let obj: AgrmntMasterXDsfObj = new AgrmntMasterXDsfObj();
      obj.MasterAgreementNo = this.MasterAgreementNo == null ? "" : this.MasterAgreementNo;
      obj.AppNo = this.AppNo;

      await this.http.post(URLConstantDsf.GetAgrmntMasterXDsf, obj).toPromise().then(
        (response) => {
          if (response["MasterAgreementNo"] != null && response["StatusCode"] == "200") {
            this.MasterAgreementNo = response["MasterAgreementNo"];
            // this.MaxPlafondMasterAgreement = response["MaxPlafondMasterAgreement"],
            this.RequestedPlafond = response["RequestedPlafond"];
            this.RemainingPlafond = response["RemainingPlafond"];
            this.MaxPlafondMasterAgreement = response["MaxPlafondMasterAgreement"];
            // this.RemainingPlafond = response["RemainingPlafond"]
          }
          else
          {
            this.isRequestedPlafondAvailable = false;
          }
        })
  }

  //#region Link a href
  closeResult: any;

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
