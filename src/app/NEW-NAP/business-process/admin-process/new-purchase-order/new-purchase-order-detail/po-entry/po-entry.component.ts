import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { forkJoin } from 'rxjs';
import { AppLoanPurposeObj } from 'app/shared/model/AppLoanPurpose.Model';
import { VendorBankAccObj } from 'app/shared/model/VendorBankAcc.Model';
import { PurchaseOrderHObj } from 'app/shared/model/PurchaseOrderHObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { PurchaseOrderDObj } from 'app/shared/model/PurchaseOrderDObj.Model';
import { DatePipe, formatDate } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-po-entry',
  templateUrl: './po-entry.component.html',
  styles: []
})
export class PoEntryComponent implements OnInit {
  @Input() SupplCode: string;
  @Input() PurchaseOrderHId: number;
  @Input() AppId: number;
  @Input() AgrmntId: number;
  @Input() MouNo: string;
  PODetailForm: FormGroup;
  AppLoanPurposeList: Array<AppLoanPurposeObj>;
  VendorBankAcc: VendorBankAccObj;
  PurchaseOrderH: PurchaseOrderHObj;
  BusinessDt: Date;
  AppData: any;
  Date: Date;
  ExpirationDate: string;
  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.AppLoanPurposeList = new Array<AppLoanPurposeObj>();
    this.VendorBankAcc = new VendorBankAccObj();
    this.PurchaseOrderH = new PurchaseOrderHObj();
    this.BusinessDt = new Date();
    this.Date = new Date();
    this.PODetailForm = this.fb.group({
      SupplName: [''],
      BankAccNo: [''],
      TotalDisburse: [0],
      Notes: [''],
      PurchaseOrderExpiredDt: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    var datePipe = new DatePipe("en-US");
    var context = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.BusinessDt = new Date(context[CommonConstant.USER_ACCESS]);
    if (!this.PurchaseOrderHId || this.PurchaseOrderHId == 0) {
      let getAppLoanPurpose = this.httpClient.post(URLConstant.GetAppLoanPurposeByAppIdSupplCode, { AppId: this.AppId, SupplCode: this.SupplCode }).toPromise();
      let getListBankAcc = this.httpClient.post(URLConstant.GetListVendorBankAccByVendorCode, { VendorCode: this.SupplCode });
      forkJoin([getAppLoanPurpose, getListBankAcc]).toPromise().then(
        (response) => {
          this.AppLoanPurposeList = response[0]["listResponseAppLoanPurpose"] as Array<AppLoanPurposeObj>;
          var vendorBankAccList = response[1]["ReturnObject"];
          var isDefaultFound = false;
          var totalDisburse = 0;
          for (const item of vendorBankAccList) {
            if (item["IsDefault"]) {
              this.VendorBankAcc = item as VendorBankAccObj;
              isDefaultFound = true;
              break;
            }
          }
          if (isDefaultFound) {
            this.VendorBankAcc = vendorBankAccList[0] as VendorBankAccObj;
          }
          for (const loan of this.AppLoanPurposeList) {
            totalDisburse += loan.FinancingAmt;
          }
          this.PODetailForm.patchValue({
            SupplName: this.AppLoanPurposeList[0].SupplName,
            BankAccNo: this.VendorBankAcc.BankAccountNo,
            TotalDisburse: totalDisburse
          });
        }
      ).catch(
      );
    }
    else {
      this.httpClient.post(URLConstant.GetPurchaseOrderHByPurchaseOrderHId, { PurchaseOrderHId: this.PurchaseOrderHId }).toPromise().then(
        (response: PurchaseOrderHObj) => {
          this.PurchaseOrderH = response;
          this.PODetailForm.patchValue({
            SupplName: this.PurchaseOrderH.SupplName,
            BankAccNo: this.PurchaseOrderH.BankAccNo,
            TotalDisburse: this.PurchaseOrderH.TotalPurchaseOrderAmt,
            Notes: this.PurchaseOrderH.Notes,
            PurchaseOrderExpiredDt: datePipe.transform(this.PurchaseOrderH.PurchaseOrderExpiredDt, "yyyy-MM-dd")
          });
        }
      ).catch(
      );

    }
    this.httpClient.post(URLConstant.GetAppById, { AppId: this.AppId }).subscribe(
      (response) => {
        this.AppData = response;
        this.httpClient.post(URLConstant.GetProdOfferingHByCode, { ProdOfferingCode: this.AppData["ProdOfferingCode"] }).toPromise().then(
          (response2) => {
            var productOfferinH = response2;
            this.httpClient.post(URLConstant.GetListProdOfferingDByProdOfferingHIdAndProdCompntGrpCode, { ProdOfferingHId: productOfferinH["ProdOfferingHId"], RefProdCompntGrpCode: ["OTHR"] }).subscribe(
              (response) => {
                var a = formatDate(this.AppData["ApvDt"], 'yyyy-MM-dd', 'en-US');
                this.Date = new Date(a);
                this.Date.setDate(this.Date.getDate() + parseInt(response["ReturnObject"]["ProdOffComponents"][0]["Components"][1]["CompntValue"]));
                this.ExpirationDate = formatDate(this.Date, 'yyyy-MM-dd', 'en-US');
                this.PODetailForm.patchValue({
                  PurchaseOrderExpiredDt: datePipe.transform(this.Date, "yyyy-MM-dd")
                });
              },
              (error) => {
                console.log(error);
              }
            );
          }
        ).catch(
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  Save() {
    var formValue = this.PODetailForm.value;
    var requestPurchaseOrderH = new PurchaseOrderHObj();
    var requestListPurchaseOrderD = new Array<PurchaseOrderDObj>();
    if (!this.PurchaseOrderHId || this.PurchaseOrderHId == 0) {
      requestPurchaseOrderH.PurchaseOrderHId = 0;
      requestPurchaseOrderH.PurchaseOrderNo = "";
      requestPurchaseOrderH.PurchaseOrderDt = new Date();
      requestPurchaseOrderH.PurchaseOrderExpiredDt = formValue["PurchaseOrderExpiredDt"];
      requestPurchaseOrderH.TotalPurchaseOrderAmt = formValue["TotalDisburse"];
      requestPurchaseOrderH.AgrmntId = this.AgrmntId;
      requestPurchaseOrderH.SupplCode = this.AppLoanPurposeList[0].SupplCode;
      requestPurchaseOrderH.BankCode = this.VendorBankAcc.BankCode;
      requestPurchaseOrderH.BankBranch = this.VendorBankAcc.BankCode;
      requestPurchaseOrderH.BankAccNo = this.VendorBankAcc.BankAccountNo;
      requestPurchaseOrderH.BankAccName = this.VendorBankAcc.BankAccountName;
      requestPurchaseOrderH.Notes = formValue["Notes"];
      requestPurchaseOrderH.NumOfExtension = 0;
      requestPurchaseOrderH.MouNo = this.MouNo;

      for (const item of this.AppLoanPurposeList) {
        var purchaseOrderDObj = new PurchaseOrderDObj();
        purchaseOrderDObj.MrPoItemCode = item.MrLoanPurposeCode;
        purchaseOrderDObj.PurchaseOrderAmt = item.FinancingAmt;
        requestListPurchaseOrderD.push(purchaseOrderDObj);
      }
    }
    else {
      requestPurchaseOrderH.PurchaseOrderHId = this.PurchaseOrderH.PurchaseOrderHId;
      requestPurchaseOrderH.PurchaseOrderNo = this.PurchaseOrderH.PurchaseOrderNo;
      requestPurchaseOrderH.PurchaseOrderDt = this.PurchaseOrderH.PurchaseOrderDt;
      requestPurchaseOrderH.PurchaseOrderExpiredDt = formValue["PurchaseOrderExpiredDt"];
      requestPurchaseOrderH.TotalPurchaseOrderAmt = this.PurchaseOrderH.TotalPurchaseOrderAmt;
      requestPurchaseOrderH.AgrmntId = this.PurchaseOrderH.AgrmntId;
      requestPurchaseOrderH.SupplCode = this.PurchaseOrderH.SupplCode;
      requestPurchaseOrderH.BankCode = this.PurchaseOrderH.BankCode;
      requestPurchaseOrderH.BankBranch = this.PurchaseOrderH.BankBranch;
      requestPurchaseOrderH.BankAccNo = this.PurchaseOrderH.BankAccNo;
      requestPurchaseOrderH.BankAccName = this.PurchaseOrderH.BankAccName;
      requestPurchaseOrderH.Notes = formValue["Notes"];
      requestPurchaseOrderH.NumOfExtension = this.PurchaseOrderH.NumOfExtension;
      requestPurchaseOrderH.MouNo = this.PurchaseOrderH.MouNo;

      for (const item of this.PurchaseOrderH.PurchaseOrderDList) {
        var purchaseOrderDObj = new PurchaseOrderDObj();
        purchaseOrderDObj.PurchaseOrderDId = item.PurchaseOrderDId;
        purchaseOrderDObj.PurchaseOrderHId = item.PurchaseOrderHId;
        purchaseOrderDObj.MrPoItemCode = item.MrPoItemCode;
        purchaseOrderDObj.PurchaseOrderAmt = item.PurchaseOrderAmt;
        requestListPurchaseOrderD.push(purchaseOrderDObj);
      }
    }

    this.httpClient.post(URLConstant.SubmitPurchaseOrder, { requestPurchaseOrderHObj: requestPurchaseOrderH, requestPurchaseOrderDObjs: requestListPurchaseOrderD }).toPromise().then(
      (response) => {
        this.activeModal.close(response);
      }
    ).catch(
      (error) => {
      }
    );

  }

}
