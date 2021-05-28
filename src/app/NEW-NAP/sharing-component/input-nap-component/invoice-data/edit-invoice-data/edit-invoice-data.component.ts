import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { formatDate } from '@angular/common';
import { ResGetAppInvoiceDlrFncngHByAppInvoiceDlrFncngHIdObj } from 'app/shared/model/Response/AppInvoice/ResAppInvoiceObj.model';
import { ReqEditAppINvoiceDlrFncngHObj } from 'app/shared/model/Request/AppInvoice/ReqAppInvoiceObj.model';

@Component({
  selector: 'app-edit-invoice-data',
  templateUrl: './edit-invoice-data.component.html',
  styleUrls: ['./edit-invoice-data.component.css']
})
export class EditInvoiceDataComponent implements OnInit {
  @Output() objTempOutput: EventEmitter<any> = new EventEmitter();
  @Input() EditAppInvoiceDlrFncngHIdInput: any;

  InvoiceForm = this.fb.group({
    InvoiceNo: ['', Validators.required],
    InvoiceAmt: ['', Validators.required],
    InvoiceDueDt: ['', Validators.required],
    AppInvoiceDlrFncngHId: ['']
  })
  constructor(
    private toastr:NGXToastrService,
    private modalService: NgbModal,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    console.log(this.EditAppInvoiceDlrFncngHIdInput)

    var obj = {
      Id : this.EditAppInvoiceDlrFncngHIdInput
    }

    this.httpClient.post<ResGetAppInvoiceDlrFncngHByAppInvoiceDlrFncngHIdObj>(URLConstant.GetAppInvoiceDlrFncngHByAppInvoiceDlrFncngHId, obj).subscribe(
      (response) => {
        this.InvoiceForm.patchValue({
          InvoiceNo: response.InvoiceNo,
          InvoiceAmt: response.InvoiceAmt,
          InvoiceDueDt: response.InvoiceDueDt != null? formatDate(response.InvoiceDueDt, 'yyyy-MM-dd', 'en-US') : "",
          AppInvoiceDlrFncngHId: response.AppInvoiceDlrFncngHId
        });

      });
  }

  SaveForm(enjiForm: NgForm){

    let obj : ReqEditAppINvoiceDlrFncngHObj = new ReqEditAppINvoiceDlrFncngHObj();
    obj.InvoiceNo = this.InvoiceForm.controls.InvoiceNo.value,
    obj.InvoiceAmt = this.InvoiceForm.controls.InvoiceAmt.value,
    obj.InvoiceDueDt = this.InvoiceForm.controls.InvoiceDueDt.value,
    obj.AppInvoiceDlrFncngHId = this.InvoiceForm.controls.AppInvoiceDlrFncngHId.value

    this.httpClient.post(URLConstant.EditAppInvoiceDlrFncngH, obj).subscribe(
      (response) => {
        this.objTempOutput.emit(obj);
        this.modalService.dismissAll();
      });
     
  }
  
}
