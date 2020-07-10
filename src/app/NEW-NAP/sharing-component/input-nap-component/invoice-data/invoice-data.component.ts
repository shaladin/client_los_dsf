import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AppInvoiceFctrObj } from 'app/shared/model/AppInvoiceFctrObj.Model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AppFctrObj } from 'app/shared/model/AppFctr/AppFctr.model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-invoice-data',
  templateUrl: './invoice-data.component.html'
})
export class InvoiceDataComponent implements OnInit {

  @Input() AppId: number;
  @Output() outputTab: EventEmitter<object> = new EventEmitter();
  inputPagingObj: UcPagingObj;
  invoiceObj: AppInvoiceFctrObj;
  AppFactoringObj: AppFctrObj = new AppFctrObj();
  dataobj: any;
  MouCustLookupObj: InputLookupObj = new InputLookupObj();
  IsDisableCustFctr: boolean = true;
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  arrAddCrit;

  constructor(private httpClient: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {

  }

  InvoiceForm = this.fb.group({
    AppFctrId: [''],
    CustomerFactoringNo: [''],
    CustomerFactoringName: ['', Validators.required],
    InvoiceNo: ['', Validators.required],
    InvoiceAmt: ['', Validators.required],
    InvoiceDueDt: ['', Validators.required],
    Notes: [''],
    RowVersion: ['']
  })

  ngOnInit() {
    this.MouCustLookupObj.urlJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";
    this.MouCustLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.MouCustLookupObj.urlEnviPaging = environment.losUrl;
    this.MouCustLookupObj.pagingJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";
    this.MouCustLookupObj.genericJson = "./assets/uclookup/NAP/lookupMouCustListedCustFctr.json";


 
    var obj = {
      AppId: this.AppId,
    }
    this.httpClient.post<AppFctrObj>(URLConstant.GetAppFctrByAppId, obj).subscribe(
      (response) => {
        this.AppFactoringObj = response;
        if (!this.AppFactoringObj.IsCustListed) {
          this.InvoiceForm.controls.CustomerFactoringName.clearValidators();
          this.InvoiceForm.controls.CustomerFactoringName.updateValueAndValidity();
        }
        this.arrAddCrit = new Array();
        var addCrit = new CriteriaObj();
        addCrit.DataType = "numeric";
        addCrit.propName = "A.APP_ID";
        addCrit.restriction = AdInsConstant.RestrictionIn;
        addCrit.listValue = [this.AppFactoringObj.AppId];
        this.arrAddCrit.push(addCrit);
        this.MouCustLookupObj.addCritInput = this.arrAddCrit;
       // this.MouCustLookupObj.isReady = true;

        this.GetListAppInvoiceFctr();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  Cancel(){
    this.outputCancel.emit();
  }

  GetListAppInvoiceFctr() {
    var obj = {
      AppFctrId: this.AppFactoringObj.AppFctrId,
    }
    this.httpClient.post(URLConstant.GetListAppInvoiceFctrByAppFctrId, obj).subscribe(
      (response) => {
        this.dataobj = response['ReturnObject'];
        if (this.AppFactoringObj.PaidBy == "CUST_FCTR" && this.dataobj.AppInvoiceFctrList.length >= 1) {
          this.IsDisableCustFctr = true;
          this.InvoiceForm.patchValue({
            CustomerFactoringNo: this.dataobj.AppInvoiceFctrList[0].CustomerFactoringNo,
            CustomerFactoringName: this.dataobj.AppInvoiceFctrList[0].CustomerFactoringName
          });
          this.InvoiceForm.controls.CustomerFactoringName.clearValidators();
          this.InvoiceForm.controls.CustomerFactoringName.updateValueAndValidity();
          this.InvoiceForm.controls.CustomerFactoringName.disable();
        } else {
          this.IsDisableCustFctr = false;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetLookupMouCust(ev) {
    this.InvoiceForm.patchValue({
      CustomerFactoringNo: ev.CustNo,
      CustomerFactoringName: ev.CustName
    });
  }

  SaveForm(enjiForm: NgForm) {
    if(this.InvoiceForm.controls.InvoiceAmt.value == 0){
      this.toastr.warningMessage(ExceptionConstant.INVOICE_AMOUNT_CANNOT_ZERO);
    }
    else if(this.InvoiceForm.controls.InvoiceAmt.value < 0){
      this.toastr.warningMessage(ExceptionConstant.INVOICE_AMOUNT_CANNOT_LESS_THAN +"zero (0).");
    }
    else{
    this.invoiceObj = new AppInvoiceFctrObj();
    this.invoiceObj.CustomerFactoringNo = this.InvoiceForm.controls.CustomerFactoringNo.value;
    this.invoiceObj.CustomerFactoringName = this.InvoiceForm.controls.CustomerFactoringName.value;
    this.invoiceObj.InvoiceNo = this.InvoiceForm.controls.InvoiceNo.value;
    this.invoiceObj.InvoiceAmt = this.InvoiceForm.controls.InvoiceAmt.value;
    this.invoiceObj.InvoiceDueDt = this.InvoiceForm.controls.InvoiceDueDt.value;
    this.invoiceObj.InvoiceStat = "NEW";
    this.invoiceObj.IsApproved = true;
    this.invoiceObj.Notes = this.InvoiceForm.controls.Notes.value;
    this.invoiceObj.AppFctrId = this.AppFactoringObj.AppFctrId;

    this.httpClient.post(URLConstant.AddAppInvoiceFctr, this.invoiceObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.GetListAppInvoiceFctr();
        this.InvoiceForm.reset();
        enjiForm.resetForm();
        this.InvoiceForm.controls.InvoiceAmt.patchValue(0);
      },
      (error) => {
        console.log(error);
      });
    }
  }

  DeleteInvoice(AppInvoiceFctrId: number) {
    if (confirm('Are you sure to delete this record?')) {
      this.invoiceObj = new AppInvoiceFctrObj();
      this.invoiceObj.AppInvoiceFctrId = AppInvoiceFctrId;

      this.httpClient.post(URLConstant.DeleteAppInvoiceFctr, this.invoiceObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.GetListAppInvoiceFctr();
        },
        (error) => {
          console.log(error);
        });
    }
  }

  SaveContinue(){
    if(this.dataobj["TotalInvoiceAmt"] <= 0)
    {
      this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_INVOICE);
    }
    else
    {
      this.outputTab.emit();
    }
  }
}
