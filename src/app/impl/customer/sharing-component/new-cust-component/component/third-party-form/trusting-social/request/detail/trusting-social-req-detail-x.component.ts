import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ReqRefMasterByTypeCodeAndMasterCodeXObj } from 'app/impl/shared/model/ref-master/req-ref-master-by-type-code-and-master-cod-x-obj.model';
import { CustXObj } from 'app/impl/shared/model/cust-x-obj.model';
import { CustPersonalObj } from 'app/shared/model/cust-personal-obj.model';
import { ReqUploadConsentTsXObj } from 'app/impl/shared/model/third-party-rslt/req-upload-consent-ts-x-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ThirdPartyRsltHXObj } from 'app/impl/shared/model/third-party-rslt/third-party-rslt-h-x-obj.model';
import { ThirdPartyTrustsocRsltXObj } from 'app/impl/shared/model/third-party-rslt/third-party-trustsoc-rslt-x-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ReqAddTrxSrcDataForTsXObj } from 'app/impl/shared/model/digitalization/req-add-trx-src-data-for-ts-x-obj.model';
import { environment } from 'environments/environment';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { ExceptionConstantX } from 'app/impl/shared/constant/ExceptionConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-trusting-social-req-detail-x',
  templateUrl: './trusting-social-req-detail-x.component.html'
})
export class TrustingSocialReqDetailXComponent implements OnInit {
  @Input() CustObj: CustXObj;
  @Input() CustPersonalObj: CustPersonalObj;

  readonly CustTypePersonal: string = CommonConstantX.CustomerPersonal;

  CustTypeName: string;

  DetailForm = this.fb.group({
    ThirdPartyTrustsocRslts: new FormArray([]),
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cookieService: CookieService,
    public activeModal: NgbActiveModal,
    private toastr: NGXToastrService
  ) { }

  ngOnInit() {
    this.getCustTypeDescr();
    this.initGrid();
  }

  getCustTypeDescr() {
    var refMasterObj = new ReqRefMasterByTypeCodeAndMasterCodeXObj();
    refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustType;
    refMasterObj.MasterCode = this.CustObj.MrCustTypeCode;
    this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, refMasterObj).subscribe(
      (response) => {
        this.CustTypeName = response["Descr"];
      }
    );
  }

  initGrid() {
    var form = this.DetailForm.controls['ThirdPartyTrustsocRslts'] as FormArray;
    form.push(this.fb.group({
      Relation: [CommonConstantX.TrustingSocialRelationCust, [Validators.required, Validators.maxLength(200)]],
      Name: [this.CustObj.CustName, [Validators.required, Validators.maxLength(500)]],
      MobilePhnNo: [this.CustObj.MrCustTypeCode == CommonConstantX.MR_CUST_TYPE_CODE_PERSONAL ? this.CustPersonalObj.MobilePhnNo1 : "",
      [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$")]]
    }));
  }

  AddNewData() {
    if (!this.validateMaxSubj()) {
      return;
    }

    var form = this.DetailForm.controls['ThirdPartyTrustsocRslts'] as FormArray;
    form.push(this.fb.group({
      Relation: ['', [Validators.required, Validators.maxLength(200)]],
      Name: ['', [Validators.required, Validators.maxLength(500)]],
      MobilePhnNo: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$")]]
    }));
  }

  DeleteData(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var form = this.DetailForm.controls['ThirdPartyTrustsocRslts'] as FormArray;
      form.removeAt(i);
    }
  }

  SaveForm() {

    if (!this.validateMaxSubj()) {
      return;
    }

    var reqAddTrxSrcDataForTsObj = new ReqAddTrxSrcDataForTsXObj();

    reqAddTrxSrcDataForTsObj.TrxNo = this.CustObj.ThirdPartyTrxNo;
    reqAddTrxSrcDataForTsObj.IdNo = this.CustObj.IdNo;
    reqAddTrxSrcDataForTsObj.IdType = this.CustObj.MrIdTypeCode;
    reqAddTrxSrcDataForTsObj.CustType = this.CustObj.MrCustTypeCode;


    for (let i = 0; i < this.DetailForm.controls["ThirdPartyTrustsocRslts"].value.length; i++) {
      var thirdPartyTrustsocObj = new ThirdPartyTrustsocRsltXObj();
      thirdPartyTrustsocObj.Relation = this.DetailForm.controls["ThirdPartyTrustsocRslts"].value[i].Relation;
      thirdPartyTrustsocObj.Name = this.DetailForm.controls["ThirdPartyTrustsocRslts"].value[i].Name;
      thirdPartyTrustsocObj.MobilePhnNo = this.DetailForm.controls["ThirdPartyTrustsocRslts"].value[i].MobilePhnNo;
      if (thirdPartyTrustsocObj.MobilePhnNo.substring(0,2) != '62') {
        this.toastr.warningMessage(ExceptionConstantX.MOBILE_PHN_NO_INVALID);
        return;
      }
      reqAddTrxSrcDataForTsObj.ThirdPartyTrustsocRsltObjs.push(thirdPartyTrustsocObj);
    }

    if (!this.validateSubj(reqAddTrxSrcDataForTsObj.ThirdPartyTrustsocRsltObjs)) {
      return;
    }
    if (environment.isCore) {
      this.http.post(URLConstantX.AddTrxSrcDataForTrustingSocialV2, reqAddTrxSrcDataForTsObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.activeModal.close(this.CustObj);
        }
      );
    } else {
      this.http.post(URLConstantX.AddTrxSrcDataForTrustingSocial, reqAddTrxSrcDataForTsObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.activeModal.close(this.CustObj);
        }
      );
    }
    //ISI COOKIE
    AdInsHelper.SetCookie(this.cookieService, CommonConstantX.REQ_SOCIAL, 'done');
  }

  validateMaxSubj() {
    if (this.DetailForm.controls["ThirdPartyTrustsocRslts"].value.length >= 8) {
      this.toastr.warningMessage(ExceptionConstantX.TRUSTING_SOCIAL_MAX_SUBJECT);
      return false;
    }
    return true;
  }

  validateSubj(thirdPartyTrustsocRsltObjs: Array<ThirdPartyTrustsocRsltXObj>) {
    var duplCustRelationObjs = thirdPartyTrustsocRsltObjs.filter(x => x.Relation.toLowerCase() == CommonConstantX.TrustingSocialRelationCust.toLowerCase());

    if (duplCustRelationObjs.length > 1) {
      this.toastr.warningMessage(ExceptionConstantX.TRUSTING_SOCIAL_DUPL_RELATION_CUST);
      return false;
    }

    var groupedMobilePhnNo = this.groupBy(thirdPartyTrustsocRsltObjs, function (item) {
      return [item.MobilePhnNo];
    });

    var duplMobilePhnNo = groupedMobilePhnNo.filter(x => x.length > 1);
    if (duplMobilePhnNo.length > 0) {
      this.toastr.warningMessage(ExceptionConstantX.TRUSTING_SOCIAL_DUPL_MOBILE_PHN_NO);
      return false;
    }

    var groupedMobilePhnNo = this.groupBy(thirdPartyTrustsocRsltObjs, function (item) {
      return [item.MobilePhnNo];
    });

    return true;
  }

  groupBy(array, f) {
    let groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    })
  }
}
