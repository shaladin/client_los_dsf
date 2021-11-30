import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PurchaseOrderHObj } from 'app/shared/model/purchase-order-h-obj.model';
import { PurchaseOrderDObj } from 'app/shared/model/purchase-order-d-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqAssetDataObj } from 'app/shared/model/request/app-asset/req-app-asset-obj.model';
import { ResGetAllAssetDataForPOByAsset, ResGetAllAssetDataForPOByAssetObj } from 'app/shared/model/response/purchase-order/res-get-all-asset-data-for-po.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CookieService } from 'ngx-cookie';
import { formatDate } from '@angular/common';

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
  AssetObj: ResGetAllAssetDataForPOByAsset = new ResGetAllAssetDataForPOByAsset();
  MouNo: string = "";
  Notes: string = "";
  Address: string = "";
  ProportionalValue: number;
  TotalInsCustAmt: number;
  TotalLifeInsCustAmt: number;
  TotalPurchaseOrderAmt: number;
  DiffRateAmt : number;
  PurchaseOrderExpiredDt: Date;
  purchaseOrderHObj: PurchaseOrderHObj;
  // purchaseOrderDObj: PurchaseOrderDObj;
  lobCode: string;
  TaskListId: string;

  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_PO_PO_EXT;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private toastr: NGXToastrService, private cookieService: CookieService) {
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

  isDataExist: boolean = false;
  readonly lobCodeFl4w: string = CommonConstant.FL4W;
  async ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    this.purchaseOrderHObj = new PurchaseOrderHObj();

    let poUrl = "";
    if (this.lobCode == CommonConstant.CF4W || this.lobCode == CommonConstant.FL4W) {
      poUrl = URLConstant.GetAllAssetDataForPOByAssetV2;
    }

    let appAssetObj : ReqAssetDataObj = new ReqAssetDataObj();
    appAssetObj.AppId = this.AppId;
    appAssetObj.AgrmntId = this.AgrmntId;
    appAssetObj.SupplCode = this.SupplCode;

    await this.http.post<ResGetAllAssetDataForPOByAssetObj>(poUrl, appAssetObj).toPromise().then(
      (response) => {
        this.AssetObj = response.ReturnObject;
        if(this.AssetObj.PurchaseOrderHId != 0){
          this.isDataExist = true;
          this.Notes = this.AssetObj.Notes;
          this.purchaseOrderHObj.RowVersion = this.AssetObj.RowVersionPO;
        }
        this.ProportionalValue = this.AssetObj.ProportionalValue;
        this.TotalInsCustAmt = this.AssetObj.TotalInsCustAmt;
        this.TotalLifeInsCustAmt = this.AssetObj.TotalLifeInsCustAmt;
        this.TotalPurchaseOrderAmt = this.AssetObj.TotalPurchaseOrderAmt;
        this.DiffRateAmt = this.AssetObj.DiffRateAmt;
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
      });
  }

  async GetFromRule() {
    var tempRefMasterObj = new Array();
    await this.http.post(URLConstant.GetPurchaseOrderDPoItemCodeFromRuleByType, {}).toPromise().then(
      (response) => {
        console.log(response);
        tempRefMasterObj = response["ListPoItems"];

        //
      });
    return tempRefMasterObj;
  }

  GenerateRequestPurchaseOrderDObjs(ListPORefMasterObj) {
    var TempListPurchaseOrderD = new Array();
    for (var i = 0; i < ListPORefMasterObj.length; i++) {
      if (ListPORefMasterObj[i].Type == CommonConstant.PurchaseOrderItemTypeNonFee) {
        var tempPurchaseOrderDObj = new PurchaseOrderDObj();
        tempPurchaseOrderDObj.MrPoItemCode = ListPORefMasterObj[i].MrPoItemCode;
        tempPurchaseOrderDObj.PurchaseOrderAmt = this.AssetObj.AgrmntFinDataObj[ListPORefMasterObj[i].SourceAgrmntFinDataField] ? this.AssetObj["AgrmntFinDataObj"][ListPORefMasterObj[i].SourceAgrmntFinDataField] : 0;
        TempListPurchaseOrderD.push(tempPurchaseOrderDObj);
      }
      if (ListPORefMasterObj[i].Type == CommonConstant.PurchaseOrderItemTypeFee) {
        let tempAgrmntFeeObj = this.AssetObj.AgrmntFeeListObj.find(x => x.MrFeeTypeCode == ListPORefMasterObj[i].SourceMrFeeTypeCode);
        var tempPurchaseOrderDObj = new PurchaseOrderDObj();
        tempPurchaseOrderDObj.MrPoItemCode = ListPORefMasterObj[i].MrPoItemCode;
        if(tempAgrmntFeeObj != undefined)
          tempPurchaseOrderDObj.PurchaseOrderAmt = tempAgrmntFeeObj.AppFeeAmt ? tempAgrmntFeeObj.AppFeeAmt : 0;
        else
          tempPurchaseOrderDObj.PurchaseOrderAmt = 0;

        TempListPurchaseOrderD.push(tempPurchaseOrderDObj);
      }
    }
    return TempListPurchaseOrderD;
  }
  
  async SaveForm() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.purchaseOrderHObj.MouNo = this.MouNo;
    this.purchaseOrderHObj.Notes = this.Notes;
    this.purchaseOrderHObj.PurchaseOrderDt = new Date(formatDate(context[CommonConstant.BUSINESS_DT], 'yyyy-MM-dd', 'en-US'));
    // this.listPurchaseOrderD = new Array();
    // this.purchaseOrderDObj = new PurchaseOrderDObj();

    console.log(this.purchaseOrderHObj.PurchaseOrderDt);

    var ListPORefMasterObj = await this.GetFromRule();
    var listPurchaseOrderD = this.GenerateRequestPurchaseOrderDObjs(ListPORefMasterObj);
    
    var POObj = {
      requestPurchaseOrderHObj: this.purchaseOrderHObj,
      requestPurchaseOrderDObjs: listPurchaseOrderD
    }

    if(this.purchaseOrderHObj.BankCode ||
      this.purchaseOrderHObj.BankBranch ||
      this.purchaseOrderHObj.BankAccNo ||
      this.purchaseOrderHObj.BankAccName) {
      this.AddEditPO(POObj);
    }
    else{
      this.toastr.warningMessage(ExceptionConstant.SUPPLIER_BANK_ACC_NOT_SET);
    }
  }

  checkValidExpDt() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let bzDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
    let tempExpDt = new Date(this.PurchaseOrderExpiredDt);
    if (bzDt.getTime() > tempExpDt.getTime()) {
      throw this.toastr.typeErrorCustom("Need Extension");
    }
  }
  async AddEditPO(POObj: any) {
    console.log("First Date : " + POObj.requestPurchaseOrderHObj.PurchaseOrderDt);
    this.checkValidExpDt();
    console.log("Second Date : " + POObj.requestPurchaseOrderHObj.PurchaseOrderDt);
    if(!this.isDataExist){      
      this.http.post(URLConstant.AddPurchaseOrder, POObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_PO_PO_EXT],{ "AgrmntId": this.AgrmntId, "LobCode": this.lobCode, "AppId": this.AppId, "TaskListId": this.TaskListId });
          
        });
    }else{      
      this.http.post(URLConstant.EditPurchaseOrder, POObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_PO_PO_EXT],{ "AgrmntId": this.AgrmntId, "LobCode": this.lobCode, "AppId": this.AppId, "TaskListId": this.TaskListId });
        });
    }
  }
}
