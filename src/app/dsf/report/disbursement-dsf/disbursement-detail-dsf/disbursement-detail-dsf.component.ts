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
import { DatePipe } from '@angular/common';
import { CessieDsfObj } from 'app/dsf/model/CessieDsfObj.Model';

@Component({
  selector: 'app-disbursement-detail-dsf',
  templateUrl: './disbursement-detail-dsf.component.html',
  styleUrls: ['./disbursement-detail-dsf.component.css'],
  providers: [NGXToastrService]
})
export class DisbursementDetailDsfComponent implements OnInit {

  pageType: string = "add";
  CessieNo: string;
  resultData: any;

  cessieDsfObj: CessieDsfObj;

  DetailInformationForm = this.fb.group({
    CessieNo: ['',Validators.required],
    CessieDate: ['',Validators.required],
    ClientName: ['',Validators.required],
    PaymentAmount: [''],
    PaymentDueDate: [''],
    BankName: ['']
  });
  readonly CancelLink: string = NavigationConstantDsf.REPORT_DISBURSEMENR_ORDER_PAGING;

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
    var datePipe = new DatePipe("en-US");
    if (this.pageType == "add") {
      this.cessieDsfObj = new CessieDsfObj();
      this.cessieDsfObj.CessieNo = this.CessieNo;
      this.http.post(URLConstantDsf.GetCessieByCessieNo, this.cessieDsfObj).subscribe(
        (response) => {
          this.resultData = response;
          this.DetailInformationForm.patchValue({
            CessieNo: this.resultData.CessieNo,
            CessieDate: this.resultData.CessieDate,
            ClientName: this.resultData.ClientName,
            PaymentAmount: this.resultData.PaymentAmount,
            BankName: this.resultData.BankName
          })
        })
    }
    else if (this.pageType == "edit") {
      this.cessieDsfObj = new CessieDsfObj();
      this.cessieDsfObj.CessieNo = this.CessieNo;
      this.http.post(URLConstantDsf.GetCessieByCessieNo, this.cessieDsfObj).subscribe(
        (response) => {
          this.resultData = response;
          this.DetailInformationForm.patchValue({
            CessieNo: this.resultData.CessieNo,
            CessieDate: this.resultData.CessieDate,
            ClientName: this.resultData.ClientName,
            PaymentAmount: this.resultData.PaymentAmount,
            PaymentDueDate: datePipe.transform(this.resultData.PaymentDueDate, "yyyy-MM-dd"),
            BankName: this.resultData.BankName
          })
        })
    }
  }

  SaveForm():void {
    this.cessieDsfObj = new CessieDsfObj();
    this.cessieDsfObj.RowVersion = "";

    this.cessieDsfObj.CessieNo = this.CessieNo;
    this.cessieDsfObj.CessieDate = this.DetailInformationForm.controls["CessieDate"].value;
    this.cessieDsfObj.ClientName = this.DetailInformationForm.controls["ClientName"].value;
    this.cessieDsfObj.PaymentAmount = this.DetailInformationForm.controls["PaymentAmount"].value;
    this.cessieDsfObj.PaymentDueDate = this.DetailInformationForm.controls["PaymentDueDate"].value;
    this.cessieDsfObj.BankName = this.DetailInformationForm.controls["BankName"].value;

    if (this.pageType == "add") {
      this.http.post(URLConstantDsf.AddCessiePaymentDueDate, this.cessieDsfObj).subscribe(
        (response) => {
          this.toastr.successMessage(response['message']);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.REPORT_DISBURSEMENR_ORDER_PAGING],{});
        }
      );
  }
  else {
    this.cessieDsfObj.RowVersion = this.resultData.RowVersion;
    this.http.post(URLConstantDsf.EditCessiePaymentDueDate, this.cessieDsfObj).subscribe(
      (response) => {
        this.toastr.successMessage(response['message']);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.REPORT_DISBURSEMENR_ORDER_PAGING],{});
      }
    );

  }
  }

}
