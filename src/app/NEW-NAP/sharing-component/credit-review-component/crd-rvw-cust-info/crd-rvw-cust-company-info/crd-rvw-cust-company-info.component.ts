import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCustCoyInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustCoyInfoObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { CrdRvwCustPhnStatusObj } from 'app/shared/model/CreditReview/CrdRvwCustPhnStatusObj.Model';
import { CrdRvwExposureObj } from 'app/shared/model/CreditReview/CrdRvwExposureObj.Model';

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
  ) { }

  async ngOnInit() {
    await this.GetCrdRvwCustCoyInfoByCrdRvwCustInfoId();
    await this.GetListCrdRvwCustPhnStatusByCrdRvwCustInfoId();
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
  //#endregion

  //#region Click View
  ClickLinkBankStatement(){
    this.ngModelForBankAcc.emit();
  }

  ClickLinkNegativeCheckingList(){
    this.ngModelForNegCheckList.emit();
  }
  //#endregion
}
