import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-mou-cust-fee-detail',
  templateUrl: './mou-cust-fee-detail.component.html',
  styleUrls: ['./mou-cust-fee-detail.component.scss']
})
export class MouCustFeeDetailComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() UsedRefFeeIdList : Array<number>;
  refFeeList: any;
  feeTypeList: any;

  MouCustFeeForm = this.fb.group({
    MouCustFeeId: [0, [Validators.required]],
    MouCustId: [0, [Validators.required]],
    RefFeeId: [0, [Validators.required]],
    FeePrcnt: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    FeeAmt: [0, [Validators.required, Validators.min(1)]],
    MrFeeTypeCode: ['', [Validators.required]],
    RowVersion: ['']
  });

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    var rmFeeType = new RefMasterObj();
    rmFeeType.RefMasterTypeCode = AdInsConstant.RefMasterTypeCodeFeeType;
    let getRefFee = this.httpClient.post(AdInsConstant.GetRefFeeList, null);
    let getFeeType = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmFeeType);
    forkJoin([getRefFee, getFeeType]).subscribe(
      (response) => {
        this.refFeeList = response[0]["ReturnObject"];
        this.feeTypeList = response[1]["ReturnObject"];
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
      },
      (error) => {
        console.log(error);
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
    if(e.target.value == AdInsConstant.FeeTypeAmt){
      this.MouCustFeeForm.patchValue({
        FeePrcnt: 0
      });
      this.MouCustFeeForm.controls['FeeAmt'].clearValidators();
      this.MouCustFeeForm.controls['FeeAmt'].setValidators([Validators.required, Validators.min(1)]);
      this.MouCustFeeForm.controls['FeeAmt'].updateValueAndValidity();
    }
    else if(e.target.value ==  AdInsConstant.FeeTypePrcnt){
      this.MouCustFeeForm.patchValue({
        FeeAmt: 0
      });
      this.MouCustFeeForm.controls['FeeAmt'].clearValidators();
      this.MouCustFeeForm.controls['FeeAmt'].updateValueAndValidity();
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
    var formData = this.MouCustFeeForm.value;
    if(formData.FeeAmt > 0){
      formData.FeeAmt = this.currencyToNumber(formData.FeeAmt.toString());
    }
    if(this.UsedRefFeeIdList.includes(parseInt(formData.RefFeeId)) == true){
      var message = this.getDdlName(formData.RefFeeId) + " Already Exists";
      this.toastr.errorMessage(message);
      return;
    }
    if(formData['MrFeeTypeCode'] == 'AMT' && formData['FeeAmt'] == 0){
      this.toastr.errorMessage(message);
      return;
    }

    this.httpClient.post(AdInsConstant.AddMouCustFee, formData).subscribe(
      (response) => {
        this.activeModal.close(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
