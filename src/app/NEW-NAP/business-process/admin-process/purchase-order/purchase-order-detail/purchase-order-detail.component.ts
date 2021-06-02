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
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqAssetDataObj } from 'app/shared/model/Request/AppAsset/ReqAppAssetObj.model';
import { ResGetAllAssetDataForPOByAsset, ResGetAllAssetDataForPOByAssetObj } from 'app/shared/model/Response/PurchaseOrder/ResGetAllAssetDataForPO.model';
import { CookieService } from 'ngx-cookie';

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
  PurchaseOrderExpiredDt: Date;
  purchaseOrderHObj: PurchaseOrderHObj;
  // purchaseOrderDObj: PurchaseOrderDObj;
  lobCode: string;
  TaskListId: string;
  bankVisible: boolean = false;
  responseRefBank: any;
  responseGeneralSetting: any;
  businessDt: Date;

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
  async ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    this.purchaseOrderHObj = new PurchaseOrderHObj();
    this.getBankAcc();

    let poUrl = "";
    if (this.lobCode == CommonConstant.CF4W) {
      poUrl = URLConstant.GetAllAssetDataForPOByAsset;
    } else if (this.lobCode == CommonConstant.FL4W) {
      poUrl = URLConstant.GetAllAssetDataForPOMultiAsset;
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
        tempRefMasterObj = response["ListPoItems"];

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
        tempPurchaseOrderDObj.PurchaseOrderAmt = tempAgrmntFeeObj.AppFeeAmt ? tempAgrmntFeeObj.AppFeeAmt : 0;
        TempListPurchaseOrderD.push(tempPurchaseOrderDObj);
      }
    }
    return TempListPurchaseOrderD;
  }
  
  async SaveForm() {

    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
    this.purchaseOrderHObj.MouNo = this.MouNo;
    this.purchaseOrderHObj.Notes = this.Notes;
    this.purchaseOrderHObj.PurchaseOrderDt = this.businessDt;
    if(this.bankVisible == true){
      this.purchaseOrderHObj.BankCode = this.responseGeneralSetting.BankCode;
      this.purchaseOrderHObj.BankBranch = this.responseGeneralSetting.OfficeBankAccBranch;
      this.purchaseOrderHObj.BankAccNo = this.responseGeneralSetting.OfficeBankAccNo;
      this.purchaseOrderHObj.BankAccName = this.responseGeneralSetting.OfficeBankAccName;
    }
    // this.listPurchaseOrderD = new Array();
    // this.purchaseOrderDObj = new PurchaseOrderDObj();

    var ListPORefMasterObj = await this.GetFromRule();
    var listPurchaseOrderD = this.GenerateRequestPurchaseOrderDObjs(ListPORefMasterObj);
    var POObj = {
      requestPurchaseOrderHObj: this.purchaseOrderHObj,
      requestPurchaseOrderDObjs: listPurchaseOrderD
    }
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

  selectedOption(event)
  {    
    if(event == 'Yes'){
      this.bankVisible = true;
    } 
    else{
      this.bankVisible = false;
    }      
  }

  getBankAcc(){
    this.http.post(URLConstant.GetBankDsfbyGeneralSettingR2, {}).subscribe(
    (response) => {
      this.responseGeneralSetting = response;
      this.getBankName(this.responseGeneralSetting.BankCode);
    });
  }

  getBankName(BankCode: string){
    var bankObj = {
      Code: BankCode
    };
    this.http.post(URLConstant.GetRefBankByBankCodeAsync, bankObj).subscribe(
      (response) => {
        this.responseRefBank = response
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
