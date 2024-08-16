import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ReqPersonalXObj } from 'app/impl/shared/model/new-cust/req-personal-x-obj.model';
import { ReqCoyXObj } from 'app/impl/shared/model/new-cust/req-coy-x-obj.model';
import { ThirdPartyRsltHXObj } from 'app/impl/shared/model/third-party-rslt/third-party-rslt-h-x-obj.model';
import { CustObj } from 'app/shared/model/cust-obj.model';
import { CustPersonalObj } from 'app/shared/model/cust-personal-obj.model';

@Component({
  selector: 'app-trusting-social-view-header-x-dsf',
  templateUrl: './trusting-social-view-header-x-dsf.component.html'
})
export class TrustingSocialViewHeaderXDsfComponent implements OnInit {
  @Input() ThirdPartyTrxNo: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }
}
