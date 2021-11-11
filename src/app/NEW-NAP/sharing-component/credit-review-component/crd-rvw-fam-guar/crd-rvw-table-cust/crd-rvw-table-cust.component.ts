import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CrdRvwExposureDObj } from 'app/shared/model/credit-review/crd-rvw-exposure-d-obj.model';
import { CrdRvwOvdObj } from 'app/shared/model/credit-review/crd-rvw-ovd-obj.model';
import { ResAppCustForListCustMainDataObj } from 'app/shared/model/response/nap/cust-main-data/res-list-cust-main-data-obj.model';

@Component({
  selector: 'app-crd-rvw-table-cust',
  templateUrl: './crd-rvw-table-cust.component.html',
})
export class CrdRvwTableCustComponent implements OnInit {

  @Input() CustType: string = "";
  @Input() ListAppCust: Array<ResAppCustForListCustMainDataObj> = new Array<ResAppCustForListCustMainDataObj>();
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
