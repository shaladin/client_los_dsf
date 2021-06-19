import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { forkJoin } from 'rxjs';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResGetRefFeeListObj } from 'app/shared/model/Response/RefFee/ResGetRefFeeListObj.model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-mou-cust-fee-detail',
  templateUrl: './mou-cust-fee-detail.component.html'
})
export class MouCustFeeDetailComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() UsedRefFeeIdList : Array<number>;
  refFeeList: Array<ResGetRefFeeListObj>;
  feeTypeList: Array<KeyValueObj>;
  mouCustFeePaymentTypeList: Array<KeyValueObj>;
  mrAgreementAffectedList: Array<KeyValueObj>;

  MouCustFeeForm = this.fb.group({
    MouCustId: [0, [Validators.required]],
    RefFeeId: [0, [Validators.required]],
    FeePrcnt: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    FeeAmt: [0, [Validators.required, Validators.min(1)]],
    MrFeeTypeCode: ['', [Validators.required]],
    MouCustFeePaymentType: ['', [Validators.required]],
    MrAgreementAffected: ['', [Validators.required]],
    RowVersion: ['']
  });

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    var rmFeeType = new RefMasterObj();
    rmFeeType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeFeeType;
    let getRefFee = this.httpClient.post(URLConstant.GetRefFeeList, null);
    let getFeeType = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmFeeType);
    forkJoin([getRefFee, getFeeType]).subscribe(
      (response) => {
        this.refFeeList = response[0][CommonConstant.ReturnObj];
        this.feeTypeList = response[1][CommonConstant.ReturnObj];
        this.MouCustFeeForm.patchValue({
          RefFeeId: this.refFeeList[0].RefFeeId,
          MrFeeTypeCode: this.feeTypeList[0].Key
        });
        if(this.feeTypeList[0].Value != 'Amount'){
          this.MouCustFeeForm.patchValue({
            FeeAmt: 0
          });
          this.MouCustFeeForm.controls['FeeAmt'].clearValidators();
          this.MouCustFeeForm.controls['FeeAmt'].updateValueAndValidity();
        }
      });

      var rmPaymentType = new RefMasterObj();
      rmPaymentType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeMouCustFeePaymentType;
      this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmPaymentType).subscribe(
        (response) => {
        this.mouCustFeePaymentTypeList = response[CommonConstant.ReturnObj];
        }
      ); 

      var rmAgreementAffected = new RefMasterObj();
      rmAgreementAffected.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAgreementAffected;
      this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmAgreementAffected).subscribe(
        (response) => {
          this.mrAgreementAffectedList = response[CommonConstant.ReturnObj];
        }
      );
   }

  ngOnInit() {
    this.MouCustFeeForm.patchValue({
      MouCustId: this.MouCustId
    });
  }

  currencyToNumber(value: string){
    return value.replace(/,/g, "");
  }

  feeTypeHandler(e){
    if(e.target.value == CommonConstant.FeeTypeAmt){
      this.MouCustFeeForm.patchValue({
        FeePrcnt: 0
      });
      this.MouCustFeeForm.controls['FeeAmt'].clearValidators();
      this.MouCustFeeForm.controls['FeeAmt'].setValidators([Validators.required, Validators.min(1)]);
      this.MouCustFeeForm.controls['FeeAmt'].updateValueAndValidity();
    }
    else if(e.target.value ==  CommonConstant.FeeTypePrcnt){
      this.MouCustFeeForm.patchValue({
        FeeAmt: 0
      });
      this.MouCustFeeForm.controls['FeeAmt'].clearValidators();
      this.MouCustFeeForm.controls['FeeAmt'].updateValueAndValidity();
    }
  }

  feePaymentTypeHandler(e){
    if(e.target.value == CommonConstant.PaymentTypeApDeduction){
      this.MouCustFeeForm.controls['MrAgreementAffected'].clearValidators();
      this.MouCustFeeForm.controls['MrAgreementAffected'].setValidators([Validators.required]);
      this.MouCustFeeForm.controls['MrAgreementAffected'].updateValueAndValidity();
    }
    else if(e.target.value ==  CommonConstant.PaymentTypeDirectPayment){
      this.MouCustFeeForm.controls['MrAgreementAffected'].clearValidators();
      this.MouCustFeeForm.controls['MrAgreementAffected'].updateValueAndValidity();
    }
  }

  getDdlName(key){
    for(var i=0;i< this.refFeeList.length ;i++){
      if(this.refFeeList[i]['RefFeeId'] == key){
        return this.refFeeList[i]['FeeName'];
      }
    }
  }

  Save(enjiForm){
    if(this.MouCustFeeForm.controls["MouCustFeePaymentType"].value == CommonConstant.PaymentTypeDirectPayment)
    {
      this.MouCustFeeForm.patchValue({
        MrAgreementAffected: null
      });
    }
    
    var formData = this.MouCustFeeForm.value;
    if(formData.FeeAmt > 0){
      formData.FeeAmt = this.currencyToNumber(formData.FeeAmt.toString());
    }
    if(this.UsedRefFeeIdList.includes(parseInt(formData.RefFeeId)) == true){
      var message = this.getDdlName(formData.RefFeeId) + " Already Exists";
      this.toastr.warningMessage(message);
      return;
    }
    if(formData['MrFeeTypeCode'] == 'AMT' && formData['FeeAmt'] == 0){
      this.toastr.warningMessage(message);
      return;
    }

    this.httpClient.post(URLConstant.AddMouCustFee, formData).subscribe(
      (response) => {
        this.activeModal.close(response);
      });
  }
}
