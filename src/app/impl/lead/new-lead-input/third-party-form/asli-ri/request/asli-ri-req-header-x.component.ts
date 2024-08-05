import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReqAddTrxSrcDataForAsliRIXObj } from 'app/impl/shared/model/asli-ri/req-add-trx-src-data-for-asli-ri-x-obj.model';
import { CustDocFileFormXObj } from 'app/impl/shared/model/cust-doc-file/cust-doc-file-form-x-obj.model';
import { CustObj } from 'app/shared/model/cust-obj.model';

@Component({
  selector: 'app-asli-ri-req-header-x',
  templateUrl: './asli-ri-req-header-x.component.html',
})
export class AsliRiReqHeaderXComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  @Input() parentForm: FormGroup;
  @Input() MrCustTypeCode: string;
  @Input() custObj: CustObj;
  @Input() custDocFileFormObj: CustDocFileFormXObj;
  @Input() height: number;
  @Input() width: number;
  @Input() url: any;

  isConfirmation: boolean = false;
  reqAddTrxSrcDataForAsliRIObj: ReqAddTrxSrcDataForAsliRIXObj = new ReqAddTrxSrcDataForAsliRIXObj();

  ngOnInit() {
  }

  nextConfirm(ev: boolean) {
    this.isConfirmation = ev;
  }

  outputForm(ev: ReqAddTrxSrcDataForAsliRIXObj) {
    this.reqAddTrxSrcDataForAsliRIObj = ev;
  }
}
