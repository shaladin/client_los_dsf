import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { PurchaseOrderHObj } from 'app/shared/model/purchase-order-h-obj.model';
import { ReqAssetDataObj } from 'app/shared/model/request/app-asset/req-app-asset-obj.model';
import { ResGetAllAssetDataForPOViewByAsset, ResGetAllAssetDataForPOViewByAssetObj, ResPurchaseOrderDObj } from 'app/shared/model/response/purchase-order/res-get-all-asset-data-for-po.model';

@Component({
  selector: 'app-view-purchase-order-detail',
  templateUrl: './view-purchase-order-detail.component.html'
})
export class ViewPurchaseOrderDetailComponent implements OnInit {

  @Input() AgrmntId: number = 0;
  @Input() AppId: number = 0;
  @Input() SupplCode: string = "";
  @Input() LobCode: string = "";
  
  isDataExist: boolean = false;
  readonly lobCodeFl4w: string = CommonConstant.FL4W;
  
  ProportionalValue: number;
  TotalInsCustAmt: number;
  TotalLifeInsCustAmt: number;
  TotalPurchaseOrderAmt: number;
  PurchaseOrderExpiredDt: Date;
  DiffRateAmt : number;
  TotalAssetPriceAmt: number;
  DpNettAmt: number;
  TdpAtCoy: number;
  AdminFeeAmt: number;
  NotaryFeeAmt: number;
  FiduciaFeeAmt: number;
  FirstInstallmentAmt: number;
  ProvisionFeeAmt: number;
  Notes: string = "";
  Address: string = "";
  purchaseOrderHObj: PurchaseOrderHObj = new PurchaseOrderHObj();;
  AssetObj: ResGetAllAssetDataForPOViewByAsset = new ResGetAllAssetDataForPOViewByAsset();
  isReady: boolean = false;
  
  constructor(private http: HttpClient, public activeModal: NgbActiveModal) { }

  async ngOnInit() {

    let poUrl = "";
    if (this.LobCode == CommonConstant.CF4W || this.LobCode == CommonConstant.FL4W) {
      poUrl = URLConstant.GetAllAssetDataForPOViewByAsset;
    }

    let appAssetObj : ReqAssetDataObj = new ReqAssetDataObj();
    appAssetObj.AppId = this.AppId;
    appAssetObj.AgrmntId = this.AgrmntId;
    appAssetObj.SupplCode = this.SupplCode;

    await this.http.post<ResGetAllAssetDataForPOViewByAssetObj>(poUrl, appAssetObj).toPromise().then(
      (response) => {
        this.AssetObj = response.ReturnObject;
        if(this.AssetObj.PurchaseOrderHId != 0){
          this.setPurchaseOrderD(this.AssetObj.PurchaseOrderDObj);
          this.isDataExist = true;
          this.Notes = this.AssetObj.Notes;
          this.purchaseOrderHObj.RowVersion = this.AssetObj.RowVersionPO;

          this.ProportionalValue = this.AssetObj.ProportionalValue;
          this.TotalPurchaseOrderAmt = this.AssetObj.TotalPurchaseOrderAmt;
          var tempAddr = this.AssetObj.AppCustAddrObj.Addr == null ? '-' : this.AssetObj.AppCustAddrObj.Addr;
          var areaCode4 = this.AssetObj.AppCustAddrObj.AreaCode4 == null ? '-' : this.AssetObj.AppCustAddrObj.AreaCode4;
          var areaCode3 = this.AssetObj.AppCustAddrObj.AreaCode3 == null ? '-' : this.AssetObj.AppCustAddrObj.AreaCode3;
          var areaCode2 = this.AssetObj.AppCustAddrObj.AreaCode2 == null ? '' : this.AssetObj.AppCustAddrObj.AreaCode2;
          var areaCode1 = this.AssetObj.AppCustAddrObj.AreaCode1 == null ? '' : this.AssetObj.AppCustAddrObj.AreaCode1;
          var city = this.AssetObj.AppCustAddrObj.City == null ? '' : this.AssetObj.AppCustAddrObj.City;
          var zipCode = this.AssetObj.AppCustAddrObj.Zipcode == null ? '' : this.AssetObj.AppCustAddrObj.Zipcode;
  
          this.Address = tempAddr + ' RT/RW: ' + areaCode4 + '/' +
            areaCode3 + ' ' + areaCode2 + ' ' + areaCode1 + ' ' + city + ' ' + zipCode;
          this.PurchaseOrderExpiredDt = this.AssetObj.PurchaseOrderExpiredDt;
  
          this.purchaseOrderHObj.AgrmntId = this.AgrmntId;
          this.purchaseOrderHObj.SupplCode = this.SupplCode;
          this.purchaseOrderHObj.BankCode = this.AssetObj.VendorBankAccObj.BankCode;
          this.purchaseOrderHObj.BankBranch = this.AssetObj.VendorBankAccObj.BankName;
          this.purchaseOrderHObj.BankAccNo = this.AssetObj.VendorBankAccObj.BankAccountNo;
          this.purchaseOrderHObj.BankAccName = this.AssetObj.VendorBankAccObj.BankAccountName;
          this.purchaseOrderHObj.TotalPurchaseOrderAmt = this.TotalPurchaseOrderAmt;
        }
       
      });

    this.isReady = true;
  }

  setPurchaseOrderD(purchaseOrderD: Array<ResPurchaseOrderDObj>){
    this.TotalInsCustAmt = purchaseOrderD.find(x=> x.MrPoItemCode == CommonConstant.PoItemCodeInsNotCptlz).PurchaseOrderAmt;
    this.TotalLifeInsCustAmt = purchaseOrderD.find(x=> x.MrPoItemCode == CommonConstant.PoItemCodeLfiNotCptlz).PurchaseOrderAmt;
    this.TotalAssetPriceAmt = purchaseOrderD.find(x=> x.MrPoItemCode == CommonConstant.PoItemCodeTotalAssetPrice).PurchaseOrderAmt;
    this.DpNettAmt = purchaseOrderD.find(x=> x.MrPoItemCode == CommonConstant.PoItemCodeDpNett).PurchaseOrderAmt;
    this.TdpAtCoy = purchaseOrderD.find(x=> x.MrPoItemCode == CommonConstant.PoItemCodeTdpAtCoy).PurchaseOrderAmt;
    this.AdminFeeAmt = purchaseOrderD.find(x=> x.MrPoItemCode == CommonConstant.PoItemCodeAdminFee).PurchaseOrderAmt;
    this.NotaryFeeAmt = purchaseOrderD.find(x=> x.MrPoItemCode == CommonConstant.PoItemCodeNotaryFee).PurchaseOrderAmt;
    this.FiduciaFeeAmt = purchaseOrderD.find(x=> x.MrPoItemCode == CommonConstant.PoItemCodeFiduciaFee).PurchaseOrderAmt;
    this.DiffRateAmt = purchaseOrderD.find(x=> x.MrPoItemCode == CommonConstant.PoItemCodeDiffRateAmt).PurchaseOrderAmt;
    this.FirstInstallmentAmt = purchaseOrderD.find(x=> x.MrPoItemCode == CommonConstant.PoItemCodeFirstInstAmt).PurchaseOrderAmt;
    this.ProvisionFeeAmt = purchaseOrderD.find(x=> x.MrPoItemCode == CommonConstant.PoItemCodeProvisionFee).PurchaseOrderAmt;
  }
  
}
