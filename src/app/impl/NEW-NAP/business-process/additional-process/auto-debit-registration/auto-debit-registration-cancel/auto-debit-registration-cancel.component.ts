import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AutoDebitRegistrationObj } from 'app/impl/shared/model/auto-debit-registration/AutoDebitRegistrationObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-auto-debit-registration-cancel',
  templateUrl: './auto-debit-registration-cancel.component.html'
})
export class AutoDebitRegistrationCancelComponent implements OnInit {

  AutoDebitRegistrationId: number;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  autoDebitRegistrationObj: AutoDebitRegistrationObj;
  listReason: Array<KeyValueObj>;
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private adInsHelperService: AdInsHelperService,
    private toastr: NGXToastrService,
    private router: Router
    ) {
    this.route.queryParams.subscribe(
      (params) => {
        if(params["AutoDebitRegistrationId"] != 0)
        {
          this.AutoDebitRegistrationId = params["AutoDebitRegistrationId"];
        }
      }
    )
  }

  FormCancel = this.fb.group(
    {
      Reason: ['', Validators.required],
      Notes: ['', Validators.required]
    }
  )

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewAutoDebitRegistration.json"

    await this.GetAutoDebitRegistrationById();

    await this.http.post(URLConstant.GetListActiveRefReason, { RefReasonTypeCode: CommonConstantX.REF_REASON_AUTO_DEBIT_REG }).subscribe(
      (response) => {
        this.listReason = response[CommonConstant.ReturnObj];
      }
    );
  }

  GetCallback(e: any) {
    if (e.Key == "customer") {
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: e.ViewObj.CustNo }).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }

  GetAutoDebitRegistrationById()
  {
    this.http.post(URLConstantX.GetAutoDebitRegistrationById, {Id: this.AutoDebitRegistrationId}).subscribe(
      (response: AutoDebitRegistrationObj) => {
        this.autoDebitRegistrationObj = response;
      }
    )
  }

  onChangeReason(ev) {
    this.FormCancel.patchValue({
        Reason: ev.target.value
    });
  }

  SaveCancelForm(){
    let obj = 
    {
      TransactionNo : this.autoDebitRegistrationObj.TransactionNo,
      CancellationReason: this.FormCancel.controls.Reason.value,
      CancellationNotes: this.FormCancel.controls.Notes.value,
      RowVersion: this.autoDebitRegistrationObj.RowVersion
    }
    this.http.post(URLConstantX.AutoDebitRegistrationCancellation, obj).subscribe(
      (response) => {
        if(response["StatusCode"] != 200){
          throw this.toastr.errorMessage(response["Message"]);
        }
        else
        {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_AUTO_DEBIT_REGISTRATION_PAGING]);
        }
      }
    )
  }
}
