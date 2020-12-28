import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { CrdRvwCustPersInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustPersInfo.Model';
import { CrdRvwCustPhnStatusObj } from 'app/shared/model/CreditReview/CrdRvwCustPhnStatusObj.Model';
import { CrdRvwDiffAppToInPrcAppCustObj } from 'app/shared/model/CreditReview/CrdRvwDiffAppToInPrcAppCustObj.Model';
import { CrdRvwDiffAppToMasterCustObj } from 'app/shared/model/CreditReview/CrdRvwDiffAppToMasterCustObj.Model';
import { CrdRvwExposureObj } from 'app/shared/model/CreditReview/CrdRvwExposureObj.Model';
import { PhoneVerifObj } from 'app/shared/model/PhoneVerifObj.model';

@Component({
  selector: 'app-crd-rvw-cust-personal-info',
  templateUrl: './crd-rvw-cust-personal-info.component.html',
  styleUrls: ['./crd-rvw-cust-personal-info.component.scss']
})
export class CrdRvwCustPersonalInfoComponent implements OnInit {

  @Input() crdRvwCustInfoObj: CrdRvwCustInfoObj;

  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;
  readonly MaritalStatusMarried: string = CommonConstant.MasteCodeMartialStatsMarried;
  readonly ExposureCustTypeCode: string = CommonConstant.ExposureCustTypeCode;
  crdRvwCustPersInfoObj: CrdRvwCustPersInfoObj = new CrdRvwCustPersInfoObj();
  constructor(
    // private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private fb: FormBuilder,
    // private router: Router
  ) { }

  async ngOnInit() {
    console.log(this.crdRvwCustInfoObj);
    await this.GetCrdRvwCustPersInfoByCrdRvwCustInfoId();
    await this.GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId();
    await this.GetListCrdRvwExposureByCrdRvwCustInfoId();
    await this.GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId();
    await this.GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId();
    await this.GetAppCustBankAccList();
  }

  //#region Get data
  async GetCrdRvwCustPersInfoByCrdRvwCustInfoId() {
    await this.http.post<CrdRvwCustPersInfoObj>(URLConstant.GetCrdRvwCustPersInfoByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        // console.log(response);
        this.crdRvwCustPersInfoObj = response;
      }
    );
  }

  ListCrdRvwCustPhnStatusObj: Array<CrdRvwCustPhnStatusObj> = new Array<CrdRvwCustPhnStatusObj>();
  async GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwCustPhnStatusObj: Array<CrdRvwCustPhnStatusObj> }>(URLConstant.GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        // console.log(response);
        this.ListCrdRvwCustPhnStatusObj = response.ListCrdRvwCustPhnStatusObj;
      }
    );
  }

  ListCrdRvwExposureObj: Array<CrdRvwExposureObj> = new Array<CrdRvwExposureObj>();
  CustCrdRvwExposureObj: CrdRvwExposureObj = new CrdRvwExposureObj();
  async GetListCrdRvwExposureByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwExposureObj: Array<CrdRvwExposureObj> }>(URLConstant.GetListCrdRvwExposureByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        // console.log(response);
        this.ListCrdRvwExposureObj = response.ListCrdRvwExposureObj;
        for (let index = 0; index < response.ListCrdRvwExposureObj.length; index++) {
          const element = response.ListCrdRvwExposureObj[index];
          if (element.ExposureType == this.ExposureCustTypeCode) {
            this.CustCrdRvwExposureObj = element;
            break;
          }
        }
      }

    )
  }

  ListAppCustBankAccObjs: Array<AppCustBankAccObj> = new Array<AppCustBankAccObj>();
  async GetAppCustBankAccList() {
    await this.http.post<Array<AppCustBankAccObj>>(URLConstant.GetAppCustBankAccAndStatementForView, { AppCustId: this.crdRvwCustInfoObj.AppCustId }).toPromise().then(
      (response) => {
        // console.log(response);
        this.ListAppCustBankAccObjs = response["AppCustBankAccList"]
      });
  }

  ListCrdRvwDiffAppToInPrcAppCustObj: Array<CrdRvwDiffAppToInPrcAppCustObj> = new Array<CrdRvwDiffAppToInPrcAppCustObj>();
  async GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwDiffAppToInPrcAppCustObj: Array<CrdRvwDiffAppToInPrcAppCustObj> }>(URLConstant.GetListCrdRvwDiffAppToInPrcAppCustByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        // console.log(response);
        this.ListCrdRvwDiffAppToInPrcAppCustObj = response.ListCrdRvwDiffAppToInPrcAppCustObj;
      }
    );
  }

  ListCrdRvwDiffAppToMasterCustObj: Array<CrdRvwDiffAppToMasterCustObj> = new Array<CrdRvwDiffAppToMasterCustObj>();
  async GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwDiffAppToMasterCustObj: Array<CrdRvwDiffAppToMasterCustObj> }>(URLConstant.GetListCrdRvwDiffAppToMasterCustByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        // console.log(response);
        this.ListCrdRvwDiffAppToMasterCustObj = response.ListCrdRvwDiffAppToMasterCustObj;
      }
    );
  }
  //#endregion

  //#region Link a href
  closeResult: any;
  //#region BankAcc
  modalBankStatement: any;
  ClickLinkBankStatement(BankStatementContent) {
    console.log("click BS");
    this.modalBankStatement = this.modalService.open(BankStatementContent);
    this.modalBankStatement.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.cancelBankStatement();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.cancelBankStatement();
    });
  }

  cancelBankStatement() {
    this.modalBankStatement.close();
  }
  //#endregion

  //#region NegCheck
  modalNegCheckListContent: any;
  ClickLinkNegativeCheckingList(NegCheckListContent) {
    console.log("click Neg");
    this.modalNegCheckListContent = this.modalService.open(NegCheckListContent);
    this.modalNegCheckListContent.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.cancelNegCheckListContent();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.cancelNegCheckListContent();
    });
  }

  cancelNegCheckListContent() {
    this.modalNegCheckListContent.close();
  }
  //#endregion

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

  @Output() LinkViewCustExposure: EventEmitter<any> = new EventEmitter<any>();
  ClickLinkViewCustExposure(){
    this.LinkViewCustExposure.emit();
  }

  async ClickLinkSurvey() {
    console.log("click Survey");
    await this.http.post<{ SrvyOrderId: number }>(URLConstant.GetSrvyOrderByTrxRefNoAndSrvySourceCode, { TrxRefNo: this.crdRvwCustInfoObj.AppNo, MrSrvySourceCode: "APP" }).toPromise().then(
      (response) => {
        if (response != null || response != undefined) {
          AdInsHelper.OpenSrvyOrderViewBySrvyOrderId(response.SrvyOrderId);
        }
      }
    )
  }
  ClickLinkPhoneVerif() {
    console.log("click phn verif");
    // AdInsHelper.OpenPhoneVerifViewByAppId(this.crdRvwCustInfoObj.AppId, 0,"");
  }

  // GetPhnVerfSubjData() {
  //   this.http.post<PhoneVerifObj>(URLConstant.GetAppPhoneVerifSubjectListByAppId, {AppId: this.crdRvwCustInfoObj.AppId}).subscribe(
  //     (response) => {
  //     }
  //   );
  // }
  //#endregion
}
