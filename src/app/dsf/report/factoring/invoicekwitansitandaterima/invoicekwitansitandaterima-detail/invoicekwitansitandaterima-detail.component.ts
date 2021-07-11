import { Component, OnInit, ViewChild } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { ReceiptDsfObj } from 'app/dsf/model/ReceiptDsfObj.Model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { AdInsHelper } from 'app/shared/AdInsHelper';


@Component({
  selector: 'app-invoicekwitansitandaterima-detail',
  templateUrl: './invoicekwitansitandaterima-detail.component.html',
  styleUrls: ['./invoicekwitansitandaterima-detail.component.css'],
  providers: [NGXToastrService]
})
export class InvoicekwitansitandaterimaDetailComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  viewCessieDetailObj: UcViewGenericObj = new UcViewGenericObj();
  pageType: string = "add";
  CessieNo: any;
  resultData: any;

  receiptDsfObj: ReceiptDsfObj;

  DetailInformationForm = this.fb.group({
    NoInvoice: ['',Validators.required],
    NoKwitansi: ['',Validators.required],
    NoTandaTerima: ['',Validators.required],
    NoAgreementFactoring: [''],
    AgreementFactoringDate: [''],
    DocumentSigner: [''],
    PositionSigner: [''],
  });
  readonly CancelLink: string = NavigationConstantDsf.REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_PAGING;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] != null) {
        this.pageType = params['mode'];
      }
      if (params['CessieNo'] != null) {
        this.CessieNo = params['CessieNo'];
      }
    });
  }


 
  ngOnInit() {
    this.viewCessieDetailObj.viewInput = "./assets/ucviewgeneric/viewCessieDetail.json";
    if (this.pageType == "add") {

    }
    else if (this.pageType == "edit") {
      this.receiptDsfObj = new ReceiptDsfObj();
      this.receiptDsfObj.CessieNo = this.CessieNo;
      this.http.post(URLConstantDsf.GetReceiptFormByCessieNo, {Id : this.receiptDsfObj.CessieNo}).subscribe(
        (response) => {
          this.resultData = response;
          this.DetailInformationForm.patchValue({
            NoInvoice: this.resultData.NoInvoice,
            NoKwitansi: this.resultData.NoKwitansi,
            NoTandaTerima: this.resultData.NoTandaTerima,
            NoAgreementFactoring: this.resultData.NoAgreementFactoring,
            AgreementFactoringDate: this.resultData.AgreementFactoringDate,
            DocumentSigner: this.resultData.DocSignCol,
            PositionSigner: this.resultData.PositionSignCol,
          })
        })
    }
  }

  SaveForm():void {
    this.receiptDsfObj = new ReceiptDsfObj();
    this.receiptDsfObj.RowVersion = "";

    this.receiptDsfObj.CessieNo = this.CessieNo;
    this.receiptDsfObj.InvoiceNo = this.DetailInformationForm.controls[""].value;
    this.receiptDsfObj.KwitansiNo = this.DetailInformationForm.controls[""].value;
    this.receiptDsfObj.TandaTerimaNo = this.DetailInformationForm.controls[""].value;
    this.receiptDsfObj.AgrmntFacNo = this.DetailInformationForm.controls[""].value;
    this.receiptDsfObj.AgrmntFacDt = this.DetailInformationForm.controls[""].value;
    this.receiptDsfObj.DocSignCol = this.DetailInformationForm.controls[""].value;
    this.receiptDsfObj.PositionSignCol = this.DetailInformationForm.controls[""].value;

    if (this.pageType == "add") {
      this.http.post(URLConstantDsf.AddReceiptForm, this.receiptDsfObj).subscribe(
        (response) => {
          this.toastr.successMessage(response['message']);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_PAGING],{});
        }
      );
  }
  else {
    this.receiptDsfObj.RowVersion = this.resultData.RowVersion;
    this.http.post(URLConstantDsf.EditReceiptForm, this.receiptDsfObj).subscribe(
      (response) => {
        this.toastr.successMessage(response['message']);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_PAGING],{});
      }
    );

  }
  }

}
