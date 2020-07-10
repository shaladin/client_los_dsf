import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { PurchaseOrderHObj } from 'app/shared/model/PurchaseOrderHObj.Model';
import { PurchaseOrderDObj } from 'app/shared/model/PurchaseOrderDObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';

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
  lobCode: string;
  TaskListId: string;

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
    console.log("ini po");
    this.arrValue.push(this.AgrmntId);
    this.purchaseOrderHObj = new PurchaseOrderHObj();

    let poUrl = "";
    if (this.lobCode == CommonConstant.CF4W) {
      poUrl = URLConstant.GetAllAssetDataForPOByAsset;
    } else if (this.lobCode == CommonConstant.FL4W) {
      poUrl = URLConstant.GetAllAssetDataForPOMultiAsset;
    }

    this.GetFromRefMaster();
    var appAssetObj = {
      AppId: this.AppId,
      AgrmntId: this.AgrmntId,
      SupplCode: this.SupplCode
    }
    this.http.post(poUrl, appAssetObj).subscribe(
      (response) => {
        console.log(response);
        this.AssetObj = response["ReturnObject"];
        this.ProportionalValue = this.AssetObj["ProportionalValue"];
        this.TotalInsCustAmt = this.AssetObj["TotalInsCustAmt"];
        this.TotalLifeInsCustAmt = this.AssetObj["TotalLifeInsCustAmt"];
        this.TotalPurchaseOrderAmt = this.AssetObj["TotalPurchaseOrderAmt"];
        var tempAddr = this.AssetObj["AppCustAddrObj"].Addr == null ? '-' : this.AssetObj["AppCustAddrObj"].Addr;
        var areaCode4 = this.AssetObj["AppCustAddrObj"].AreaCode4 == null ? '-' : this.AssetObj["AppCustAddrObj"].AreaCode4;
        var areaCode3 = this.AssetObj["AppCustAddrObj"].AreaCode3 == null ? '-' : this.AssetObj["AppCustAddrObj"].AreaCode3;
        var areaCode2 = this.AssetObj["AppCustAddrObj"].AreaCode2 == null ? '' : this.AssetObj["AppCustAddrObj"].AreaCode2;
        var areaCode1 = this.AssetObj["AppCustAddrObj"].AreaCode1 == null ? '' : this.AssetObj["AppCustAddrObj"].AreaCode1;
        var city = this.AssetObj["AppCustAddrObj"].City == null ? '' : this.AssetObj["AppCustAddrObj"].City;
        var zipCode = this.AssetObj["AppCustAddrObj"].Zipcode == null ? '' : this.AssetObj["AppCustAddrObj"].Zipcode;

        this.Address = tempAddr + ' RT/RW: ' + areaCode4 + '/' +
          areaCode3 + ' ' + areaCode2 + ' ' + areaCode1 + ' ' + city + ' ' + zipCode;
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

  ListPORefMasterObj: Array<RefMasterObj>;
  GetFromRefMaster() {
    this.http.post(URLConstant.GetListRefMasterByRefMasterTypeCodes, { refMasterTypeCodes: [CommonConstant.RefMasterTypeCodePoItemCode] }).subscribe(
      (response) => {
        // console.log(response);
        this.ListPORefMasterObj = response["ReturnObject"];
        // console.log(this.ListPORefMasterObj);

      },
      (error) => {
        console.log(error);
      }
    );
  }

  GeneratePONonFee() {
    // console.log(this.AssetObj["AgrmntFinDataObj"]);
    for (var i = 0; i < this.ListPORefMasterObj.length; i++) {
      if (this.ListPORefMasterObj[i].ReserveField2 == CommonConstant.RefMasterReservedField2NonFee) {
        // console.log(this.ListPORefMasterObj[i]);
        // console.log(this.AssetObj["AgrmntFinDataObj"][this.ListPORefMasterObj[i].ReserveField3]);
        var tempPurchaseOrderDObj = new PurchaseOrderDObj();
        tempPurchaseOrderDObj.MrPoItemCode = this.ListPORefMasterObj[i].MasterCode;
        tempPurchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFinDataObj"][this.ListPORefMasterObj[i].ReserveField3] ? this.AssetObj["AgrmntFinDataObj"][this.ListPORefMasterObj[i].ReserveField3] : 0;
        this.listPurchaseOrderD.push(tempPurchaseOrderDObj);
      }
    }
  }

  GeneratePOFee() {
    for (var i = 0; i < this.ListPORefMasterObj.length; i++) {
      if (this.ListPORefMasterObj[i].ReserveField2 == CommonConstant.RefMasterReservedField2Fee) {
        // console.log(this.ListPORefMasterObj[i]);
        let tempAgrmntFeeObj = this.AssetObj["AgrmntFeeListObj"].find(x => x.MrFeeTypeCode == this.ListPORefMasterObj[i].ReserveField3);
        // console.log(tempAgrmntFeeObj);
        var tempPurchaseOrderDObj = new PurchaseOrderDObj();
        tempPurchaseOrderDObj.MrPoItemCode = this.ListPORefMasterObj[i].MasterCode;
        tempPurchaseOrderDObj.PurchaseOrderAmt = tempAgrmntFeeObj.AppFeeAmt ? tempAgrmntFeeObj.AppFeeAmt : 0;
        this.listPurchaseOrderD.push(tempPurchaseOrderDObj);
      }
    }
  }
  
  listPurchaseOrderD:Array<PurchaseOrderDObj>;
  SaveForm() {
    this.purchaseOrderHObj.MouNo = this.MouNo;
    this.purchaseOrderHObj.Notes = this.Notes;

    this.listPurchaseOrderD = new Array();
    this.purchaseOrderDObj = new PurchaseOrderDObj();

    this.GeneratePONonFee();
    this.GeneratePOFee();
    // this.purchaseOrderDObj.MrPoItemCode = CommonConstant.PoItemCodeTotalAssetPrice ;
    // this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFinDataObj"].TotalAssetPriceAmt;
    // this.listPurchaseOrderD.push(this.purchaseOrderDObj);

    // this.purchaseOrderDObj = new PurchaseOrderDObj();
    // this.purchaseOrderDObj.MrPoItemCode = CommonConstant.PoItemCodeDpNett;
    // this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFinDataObj"].TotalDownPaymentNettAmt ? this.AssetObj["AgrmntFinDataObj"].TotalDownPaymentNettAmt : 0;
    // this.listPurchaseOrderD.push(this.purchaseOrderDObj);
    // this.purchaseOrderDObj = new PurchaseOrderDObj();
    // this.purchaseOrderDObj.MrPoItemCode = CommonConstant.PoItemCodeTdpAtCoy;
    // this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFinDataObj"].TdpPaidCoyAmt;
    // this.listPurchaseOrderD.push(this.purchaseOrderDObj);
    // this.purchaseOrderDObj = new PurchaseOrderDObj();
    // this.purchaseOrderDObj.MrPoItemCode = CommonConstant.PoItemCodeInstAmt;
    // this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFinDataObj"].InstAmt;
    // this.listPurchaseOrderD.push(this.purchaseOrderDObj);
    // this.purchaseOrderDObj = new PurchaseOrderDObj();
    // this.purchaseOrderDObj.MrPoItemCode = CommonConstant.PoItemCodeInsNotCptlz;
    // this.purchaseOrderDObj.PurchaseOrderAmt = this.TotalInsCustAmt;
    // this.listPurchaseOrderD.push(this.purchaseOrderDObj);
    // this.purchaseOrderDObj = new PurchaseOrderDObj();
    // this.purchaseOrderDObj.MrPoItemCode = CommonConstant.PoItemCodeLfiNotCptlz;
    // this.purchaseOrderDObj.PurchaseOrderAmt = this.TotalLifeInsCustAmt;
    // this.listPurchaseOrderD.push(this.purchaseOrderDObj);


    //TEMUAN STEVEN INI FEE GK BOLEH GINI, KLO GAK NNTI GBS DINAMIS JUGA NIH NTAR
    // if (this.AssetObj["AgrmntFeeListObj"].length != 0) {
    //   for (let i = 0; i < this.AssetObj["AgrmntFeeListObj"].length; i++) {
    //     this.purchaseOrderDObj = new PurchaseOrderDObj();
    //     if (this.AssetObj["AgrmntFeeListObj"][i].MrFeeTypeCode == "ADM") {
    //       this.purchaseOrderDObj.MrPoItemCode = "ADMIN_FEE_NOT_CPTLZ";
    //       this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFeeListObj"][i].AppFeeAmt;
    //       this.listPurchaseOrderD.push(this.purchaseOrderDObj);
    //     } else if (this.AssetObj["AgrmntFeeListObj"][i].MrFeeTypeCode == "PROVISION") {
    //       this.purchaseOrderDObj.MrPoItemCode = "PRVSN_FEE_NOT_CPTLZ";
    //       this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFeeListObj"][i].AppFeeAmt;
    //       this.listPurchaseOrderD.push(this.purchaseOrderDObj);
    //     } else if (this.AssetObj["AgrmntFeeListObj"][i].MrFeeTypeCode == "NOTARY") {
    //       this.purchaseOrderDObj.MrPoItemCode = "NTRY_FEE_NOT_CPTLZ";
    //       this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFeeListObj"][i].AppFeeAmt;
    //       this.listPurchaseOrderD.push(this.purchaseOrderDObj);
    //     } else if (this.AssetObj["AgrmntFeeListObj"][i].MrFeeTypeCode == "FIDUCIA") {
    //       this.purchaseOrderDObj.MrPoItemCode = "FDCIA_FEE_NOT_CPTLZ";
    //       this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFeeListObj"][i].AppFeeAmt;
    //       this.listPurchaseOrderD.push(this.purchaseOrderDObj);
    //     } else if (this.AssetObj["AgrmntFeeListObj"][i].MrFeeTypeCode == "ADDADMIN") {
    //       this.purchaseOrderDObj.MrPoItemCode = "ADD_ADMIN_FEE_NOT_CPTLZ";
    //       this.purchaseOrderDObj.PurchaseOrderAmt = this.AssetObj["AgrmntFeeListObj"][i].AppFeeAmt;
    //       this.listPurchaseOrderD.push(this.purchaseOrderDObj);
    //     }
    //   }
    // }
    var POObj = {
      requestPurchaseOrderHObj: this.purchaseOrderHObj,
      requestPurchaseOrderDObjs: this.listPurchaseOrderD
    }
    this.http.post(URLConstant.SubmitPurchaseOrder, POObj).subscribe(
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
