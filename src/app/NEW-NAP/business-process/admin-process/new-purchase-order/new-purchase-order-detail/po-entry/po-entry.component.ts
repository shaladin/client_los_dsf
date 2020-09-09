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
import { DatePipe } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { Console } from '@angular/core/src/console';

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
  vendorBankAccList: Array<Object>;

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
    this.BusinessDt = new Date(context["BusinessDt"]);
    if(!this.PurchaseOrderHId || this.PurchaseOrderHId == 0){
      let getAppLoanPurpose = this.httpClient.post(URLConstant.GetAppLoanPurposeByAppIdSupplCode, { AppId: this.AppId, SupplCode: this.SupplCode }).toPromise();
      let getListBankAcc = this.httpClient.post(URLConstant.GetListVendorBankAccByVendorCode, { VendorCode: this.SupplCode }).toPromise();
      forkJoin([getAppLoanPurpose, getListBankAcc]).toPromise().then(
        (response) => {
          this.AppLoanPurposeList = response[0]["listResponseAppLoanPurpose"] as Array<AppLoanPurposeObj>;
          this.vendorBankAccList = response[1]["ReturnObject"];
          this.vendorBankAccList.sort((a,b) => {return (a["IsDefault"] === b["IsDefault"]) ? 0 : a["IsDefault"]? -1 : 1});
          console.log("vendorBankAccList: " + JSON.stringify(this.vendorBankAccList));
          var isDefaultFound = false;
          var totalDisburse = 0;
          for (const item of this.vendorBankAccList) {
            if(item["IsDefault"]){
              this.VendorBankAcc = item as VendorBankAccObj;
              isDefaultFound = true;
              break;
            }
          }
          if(isDefaultFound){
            this.VendorBankAcc = this.vendorBankAccList[0] as VendorBankAccObj;
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
        (error) => {
          console.log(error);
        }
      );
    }
    else{
      let getPurchaseOrderHId = this.httpClient.post(URLConstant.GetPurchaseOrderByPurchaseOrderHIdForNewPO, { PurchaseOrderHId: this.PurchaseOrderHId }).toPromise();
      let getListBankAcc = this.httpClient.post(URLConstant.GetListVendorBankAccByVendorCode, { VendorCode: this.SupplCode }).toPromise();
      forkJoin([getPurchaseOrderHId, getListBankAcc]).toPromise().then(
        (response) => {
          this.vendorBankAccList = response[1]["ReturnObject"];
          this.PurchaseOrderH = response[0] as PurchaseOrderHObj;
          this.vendorBankAccList.sort((a,b) => {return (a["IsDefault"] === b["IsDefault"]) ? 0 : a["IsDefault"]? -1 : 1});
          for (const item of this.vendorBankAccList) {
            if(item["BankAccountNo"] == this.PurchaseOrderH.BankAccNo){
              this.VendorBankAcc = item as VendorBankAccObj;
              break;
            }
          }
          this.PODetailForm.patchValue({
            SupplName: this.PurchaseOrderH.SupplName,
            BankAccNo: this.VendorBankAcc.BankAccountNo,
            TotalDisburse: this.PurchaseOrderH.TotalPurchaseOrderAmt,
            Notes: this.PurchaseOrderH.Notes,
            PurchaseOrderExpiredDt: datePipe.transform(this.PurchaseOrderH.PurchaseOrderExpiredDt, "yyyy-MM-dd")
          });
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }
  }

  BankAccHandler(){
    var value = this.PODetailForm.controls["BankAccNo"].value;
    for (const item of this.vendorBankAccList) {
      if(item["BankAccountNo"] == value){
        this.VendorBankAcc = item as VendorBankAccObj;
        break;
      }
    }
  }

  Save(){
    var formValue = this.PODetailForm.value;
    var requestPurchaseOrderH = new PurchaseOrderHObj();
    var requestListPurchaseOrderD = new Array<PurchaseOrderDObj>();
    if(!this.PurchaseOrderHId || this.PurchaseOrderHId == 0){
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
    else{
      requestPurchaseOrderH.PurchaseOrderHId = this.PurchaseOrderH.PurchaseOrderHId;
      requestPurchaseOrderH.PurchaseOrderNo = this.PurchaseOrderH.PurchaseOrderNo;
      requestPurchaseOrderH.PurchaseOrderDt = this.PurchaseOrderH.PurchaseOrderDt;
      requestPurchaseOrderH.PurchaseOrderExpiredDt = formValue["PurchaseOrderExpiredDt"];
      requestPurchaseOrderH.TotalPurchaseOrderAmt = this.PurchaseOrderH.TotalPurchaseOrderAmt;
      requestPurchaseOrderH.AgrmntId = this.PurchaseOrderH.AgrmntId;
      requestPurchaseOrderH.SupplCode = this.PurchaseOrderH.SupplCode;
      // requestPurchaseOrderH.BankCode = this.PurchaseOrderH.BankCode;
      // requestPurchaseOrderH.BankBranch = this.PurchaseOrderH.BankBranch;
      // requestPurchaseOrderH.BankAccNo = this.PurchaseOrderH.BankAccNo;
      // requestPurchaseOrderH.BankAccName = this.PurchaseOrderH.BankAccName;
      requestPurchaseOrderH.BankCode = this.VendorBankAcc.BankCode;
      requestPurchaseOrderH.BankBranch = this.VendorBankAcc.BankCode;
      requestPurchaseOrderH.BankAccNo = this.VendorBankAcc.BankAccountNo;
      requestPurchaseOrderH.BankAccName = this.VendorBankAcc.BankAccountName;
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

    this.httpClient.post(URLConstant.SubmitNewPurchaseOrder, { requestPurchaseOrderHObj: requestPurchaseOrderH, requestPurchaseOrderDObjs: requestListPurchaseOrderD }).toPromise().then(
      (response) => {
        this.activeModal.close(response);
      }
    ).catch(
      (error) => {
      }
    );
    
  }

}
