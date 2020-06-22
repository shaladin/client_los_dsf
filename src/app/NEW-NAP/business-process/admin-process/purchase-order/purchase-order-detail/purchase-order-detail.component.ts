import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { PurchaseOrderHObj } from 'app/shared/model/PurchaseOrderHObj.Model';
import { PurchaseOrderDObj } from 'app/shared/model/PurchaseOrderDObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html'
})
export class PurchaseOrderDetailComponent implements OnInit {

  arrValue: Array<number> = [];
  AgrmntId: number;
  AppId: number;
  AppAssetId: number;
  SupplCode: string;
  AssetObj: Object;
  MouNo: string = "";
  Notes: string = "";
  Address: string = "";
  ProportionalValue: number;
  TotalInsCustAmt: number;
  TotalLifeInsCustAmt: number;
  TotalPurchaseOrderAmt: number;
  PurchaseOrderExpiredDt: Date;
  purchaseOrderHObj: PurchaseOrderHObj;
  purchaseOrderDObj: PurchaseOrderDObj;
  lobCode : string;
  TaskListId : string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AppAssetId"] != null) {
        this.AppAssetId = params["AppAssetId"];
      }
      if (params["SupplCode"] != null) {
        this.SupplCode = params["SupplCode"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if (params["LobCode"] != null) {
        this.lobCode = params["LobCode"];
      }
    });
  }

  ngOnInit() {
    console.log("ini po")
    this.arrValue.push(this.AgrmntId);
    this.purchaseOrderHObj = new PurchaseOrderHObj();

    var appAssetObj = {
      AppId: this.AppId,
      AgrmntId: this.AgrmntId,
      SupplCode: this.SupplCode
    }
    this.http.post(AdInsConstant.GetAllAssetDataForPOByAsset, appAssetObj).subscribe(
      (response) => {
        console.log(response);
        this.AssetObj = response["ReturnObject"];
        this.ProportionalValue = this.AssetObj["ProportionalValue"];
        this.TotalInsCustAmt = this.AssetObj["TotalInsCustAmt"];
        this.TotalLifeInsCustAmt = this.AssetObj["TotalLifeInsCustAmt"];
        this.TotalPurchaseOrderAmt = this.AssetObj["TotalPurchaseOrderAmt"];
        this.Address = this.AssetObj["AppCustAddrObj"].Addr + ' RT/RW: ' + this.AssetObj["AppCustAddrObj"].AreaCode4 + '/' +
          this.AssetObj["AppCustAddrObj"].AreaCode3 + ' ' + this.AssetObj["AppCustAddrObj"].AreaCode2 + ' ' +
          this.AssetObj["AppCustAddrObj"].AreaCode1 + ' ' + this.AssetObj["AppCustAddrObj"].City + ' ' +
          this.AssetObj["AppCustAddrObj"].Zipcode;
        this.PurchaseOrderExpiredDt = this.AssetObj["PurchaseOrderExpiredDt"];

        this.purchaseOrderHObj.AgrmntId = this.AgrmntId;
        this.purchaseOrderHObj.SupplCode = this.SupplCode;
        this.purchaseOrderHObj.BankCode = this.AssetObj["VendorBankAccObj"].BankCode;
        this.purchaseOrderHObj.BankBranch = this.AssetObj["VendorBankAccObj"].BankName;
        this.purchaseOrderHObj.BankAccNo = this.AssetObj["VendorBankAccObj"].BankAccountNo;
        this.purchaseOrderHObj.BankAccName = this.AssetObj["VendorBankAccObj"].BankAccountName;
        this.purchaseOrderHObj.TotalPurchaseOrderAmt = this.TotalPurchaseOrderAmt;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  SaveForm() {
    this.purchaseOrderHObj.MouNo = this.MouNo;
    this.purchaseOrderHObj.Notes = this.Notes;

    var listPurchaseOrderD = new Array();
    this.purchaseOrderDObj = new PurchaseOrderDObj();

    this.purchaseOrderDObj.MrPoItemCode = "TOTAL_ASSET_PRICE";
    this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFinDataObj"].TotalAssetPriceAmt;
    listPurchaseOrderD.push(this.purchaseOrderDObj);

    this.purchaseOrderDObj = new PurchaseOrderDObj();
    this.purchaseOrderDObj.MrPoItemCode = "DP_NETT";
    this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFinDataObj"].TotalDownPaymentNettAmt ? this.AssetObj["AgrmntFinDataObj"].TotalDownPaymentNettAmt : 0;
    listPurchaseOrderD.push(this.purchaseOrderDObj);
    this.purchaseOrderDObj = new PurchaseOrderDObj();
    this.purchaseOrderDObj.MrPoItemCode = "TDP_AT_COY";
    this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFinDataObj"].TdpPaidCoyAmt;
    listPurchaseOrderD.push(this.purchaseOrderDObj);
    this.purchaseOrderDObj = new PurchaseOrderDObj();
    this.purchaseOrderDObj.MrPoItemCode = "INST_AMT";
    this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFinDataObj"].InstAmt;
    listPurchaseOrderD.push(this.purchaseOrderDObj);
    this.purchaseOrderDObj = new PurchaseOrderDObj();
    this.purchaseOrderDObj.MrPoItemCode = "INS_NOT_CPTLZ";
    this.purchaseOrderDObj.PurchaseOrderAmt = this.TotalInsCustAmt;
    listPurchaseOrderD.push(this.purchaseOrderDObj);
    this.purchaseOrderDObj = new PurchaseOrderDObj();
    this.purchaseOrderDObj.MrPoItemCode = "LFI_NOT_CPTLZ";
    this.purchaseOrderDObj.PurchaseOrderAmt = this.TotalLifeInsCustAmt;
    listPurchaseOrderD.push(this.purchaseOrderDObj);

    if (this.AssetObj["AgrmntFeeListObj"].length != 0) {
      for (let i = 0; i < this.AssetObj["AgrmntFeeListObj"].length; i++) {
        this.purchaseOrderDObj = new PurchaseOrderDObj();
        if (this.AssetObj["AgrmntFeeListObj"][i].MrFeeTypeCode == "ADM") {
          this.purchaseOrderDObj.MrPoItemCode = "ADMIN_FEE_NOT_CPTLZ";
          this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFeeListObj"][i].AppFeeAmt;
          listPurchaseOrderD.push(this.purchaseOrderDObj);
        } else if (this.AssetObj["AgrmntFeeListObj"][i].MrFeeTypeCode == "PROVISION") {
          this.purchaseOrderDObj.MrPoItemCode = "PRVSN_FEE_NOT_CPTLZ";
          this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFeeListObj"][i].AppFeeAmt;
          listPurchaseOrderD.push(this.purchaseOrderDObj);
        } else if (this.AssetObj["AgrmntFeeListObj"][i].MrFeeTypeCode == "NOTARY") {
          this.purchaseOrderDObj.MrPoItemCode = "NTRY_FEE_NOT_CPTLZ";
          this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFeeListObj"][i].AppFeeAmt;
          listPurchaseOrderD.push(this.purchaseOrderDObj);
        } else if (this.AssetObj["AgrmntFeeListObj"][i].MrFeeTypeCode == "FIDUCIA") {
          this.purchaseOrderDObj.MrPoItemCode = "FDCIA_FEE_NOT_CPTLZ";
          this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFeeListObj"][i].AppFeeAmt;
          listPurchaseOrderD.push(this.purchaseOrderDObj);
        } else if (this.AssetObj["AgrmntFeeListObj"][i].MrFeeTypeCode == "ADDADMIN"){
          this.purchaseOrderDObj.MrPoItemCode = "ADD_ADMIN_FEE_NOT_CPTLZ";
          this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFeeListObj"][i].AppFeeAmt;
          listPurchaseOrderD.push(this.purchaseOrderDObj);
        }
      }
    }
    var POObj = {
      requestPurchaseOrderHObj: this.purchaseOrderHObj,
      requestPurchaseOrderDObjs: listPurchaseOrderD
    }
    this.http.post(AdInsConstant.SubmitPurchaseOrder, POObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Nap/AdminProcess/PurchaseOrder/PO"], { queryParams: { "AgrmntId": this.AgrmntId, "LobCode": this.lobCode, "AppId": this.AppId, "TaskListId": this.TaskListId } });
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
