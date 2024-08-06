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
import { CustXObj } from 'app/impl/shared/model/cust-x-obj.model';
import { CustPersonalObj } from 'app/shared/model/cust-personal-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';


@Component({
  selector: 'app-trusting-social-req-header-x',
  templateUrl: './trusting-social-req-header-x.component.html',
})
export class TrustingSocialReqHeaderXComponent implements OnInit {
  @Input() CustObj: CustXObj;
  @Input() CustPersonalObj: CustPersonalObj;

  ThirdPartyRsltHObj: ThirdPartyRsltHXObj = new ThirdPartyRsltHXObj();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.checkConsent();
  }

  checkConsent(){
    if (this.CustObj.ThirdPartyTrxNo)
    {
      this.http.post(URLConstantX.GetFirstRequestedThirdPartyRsltHByTrxNoAndSvcTypeCode, { TrxNo: this.CustObj.ThirdPartyTrxNo, SvcTypeCode: CommonConstant.DigitalizationSvcTypeTrustingSocial }).subscribe(
        (response: ThirdPartyRsltHXObj) => {
          this.ThirdPartyRsltHObj = response;
        }
      );
    }
  }

  OutUpload(e: ThirdPartyRsltHXObj){
    this.ThirdPartyRsltHObj = e;
  }

  OutCustObj(e: CustXObj){
    this.CustObj = e;
  }
}
