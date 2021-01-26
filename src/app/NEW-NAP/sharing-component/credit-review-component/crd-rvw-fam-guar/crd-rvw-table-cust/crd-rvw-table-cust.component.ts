import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { CrdRvwExposureDObj } from 'app/shared/model/CreditReview/CrdRvwExposureDObj.Model';
import { CrdRvwOvdObj } from 'app/shared/model/CreditReview/CrdRvwOvdObj.Model';

@Component({
  selector: 'app-crd-rvw-table-cust',
  templateUrl: './crd-rvw-table-cust.component.html',
})
export class CrdRvwTableCustComponent implements OnInit {

  @Input() CustType: string = "";
  @Input() ListAppCust: Array<AppCustObj> = new Array<AppCustObj>();
  @Input() DictCrdRvwExposure: { [Id: string]: CrdRvwExposureDObj } = {};
  @Input() DictCrdRvwExposureHId: { [Id: string]: number } = {};
  @Input() DictCrdRvwGuarantorExposure: { [Id: string]: CrdRvwOvdObj } = {};
  
  //#region RelationType
  readonly RelationTypeCustomer = CommonConstant.CrdRvwRelationTypeCustomer;
  readonly RelationTypeFamily = CommonConstant.CrdRvwRelationTypeFamily;
  readonly RelationTypeShrholder = CommonConstant.CrdRvwRelationTypeShrholder;
  readonly RelationTypeGuarantor = CommonConstant.CrdRvwRelationTypeGuarantor;
  //#endregion
  constructor() { }

  ngOnInit() {
  }

  //#region Link a href
  ClickLinkCust(CrdRvwExposureHId: number) {
    // console.log(CrdRvwExposureHId);
    AdInsHelper.OpenCustExposureViewByCrdRvwExposureHId(CrdRvwExposureHId);
  }
  //#endregion
}
