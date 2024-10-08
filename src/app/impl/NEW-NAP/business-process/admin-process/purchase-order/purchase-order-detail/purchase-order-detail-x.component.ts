import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResAgrmntFeeForPOObj, ResGetAllAssetDataForPOByAssetObj } from 'app/shared/model/response/purchase-order/res-get-all-asset-data-for-po.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CookieService } from 'ngx-cookie';
import { formatDate } from '@angular/common';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { Validators, FormBuilder } from '@angular/forms';
import { ResGetAllAssetDataForPOByAsset } from 'app/shared/model/response/purchase-order/res-get-all-asset-data-for-po.model';
import { PurchaseOrderHObj } from 'app/shared/model/purchase-order-h-obj.model';
import { ReqAssetDataObj } from 'app/shared/model/request/app-asset/req-app-asset-obj.model';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { PurchaseOrderDObj } from 'app/shared/model/purchase-order-d-obj.model';
import { UcDropdownListObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';

@Component({
  selector: 'app-purchase-order-detail-x',
  templateUrl: './purchase-order-detail-x.component.html'
})
export class PurchaseOrderDetailXComponent implements OnInit {

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
  TotalPurchaseOrderAmt: number;
  PurchaseOrderExpiredDt: Date;
  purchaseOrderHObj: PurchaseOrderHObj;
  // purchaseOrderDObj: PurchaseOrderDObj;
  lobCode: string;
  TaskListId: string;
  BizTemplateCode: string;
  bankVisible: boolean = false;
  responseRefBank: any
  ucDdlVendorBankAccObj: UcDropdownListObj = new UcDropdownListObj();
  isDdlVendorBankAccReady: boolean = false;
  ReqByCode: GenericObj = new GenericObj();
  ListRefMaster: Array<RefMasterObj> = new Array<RefMasterObj>();
  ListPurchaseOrder: Array<PurchaseOrderDObj> = new Array<PurchaseOrderDObj>();
  isReady: boolean = false;

  POForm = this.fb.group({
    Notes: [''],
    CustBankAcc: ['', Validators.required],
    VendorBankAccNo: ['', Validators.required]
  });
  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_PO_PO_EXT;
  constructor(private fb: FormBuilder,
              private route: ActivatedRoute, private http: HttpClient, private router: Router, private toastr: NGXToastrService, private cookieService: CookieService) {
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
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  isDataExist: boolean = false;
  readonly bizTemplateCodeFl4w: string = CommonConstant.FL4W;
  async ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    this.purchaseOrderHObj = new PurchaseOrderHObj();
    this.getGeneralSetBankAcc();

    let poUrl = "";
    if (this.BizTemplateCode == CommonConstant.CF4W || this.BizTemplateCode == CommonConstant.FL4W) {
      poUrl = URLConstantX.GetAllAssetDataForPOByAsset;
    }

    let appAssetObj: ReqAssetDataObj = new ReqAssetDataObj();
    appAssetObj.AppId = this.AppId;
    appAssetObj.AgrmntId = this.AgrmntId;
    appAssetObj.SupplCode = this.SupplCode;

    if (this.lobCode == CommonConstantX.SLB) {
      this.POForm.get("VendorBankAccNo").clearValidators();
    }

    await this.http.post<ResGetAllAssetDataForPOByAssetObj>(poUrl, appAssetObj).toPromise().then(
      async (response) => {
        this.AssetObj = response.ReturnObject;
        this.getDataFromRefMaster();
        if (this.AssetObj.PurchaseOrderHId != 0) {
          this.isDataExist = true;
          this.Notes = this.AssetObj.Notes;
          this.purchaseOrderHObj.RowVersion = this.AssetObj.RowVersionPO;
        }
        this.ProportionalValue = this.AssetObj.ProportionalValue;
        this.TotalInsCustAmt = this.AssetObj.TotalInsCustAmt;
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

        this.purchaseOrderHObj.TotalPurchaseOrderAmt = this.TotalPurchaseOrderAmt;
        if (this.lobCode == CommonConstantX.SLB) {
          await this.GetListAppCustBankAcc();
          if (this.isDataExist) {
            await this.GetPoDataForCustBank(appAssetObj);
          }
        }
        else {
          let defaultBankAcc;
          if (this.AssetObj.PurchaseOrderHBankAccNo != null) {
            defaultBankAcc = this.AssetObj.ListVendorBankAccObj.find(obj => obj.BankAccountNo == this.AssetObj.PurchaseOrderHBankAccNo);
          }
          else {
            defaultBankAcc = this.AssetObj.ListVendorBankAccObj.find(obj => obj.IsDefault == true);
          }

          if (defaultBankAcc != undefined) {
            this.POForm.patchValue({
              CustBankAcc: 0,
              VendorBankAccNo: defaultBankAcc.BankAccountNo
            });

            this.purchaseOrderHObj.BankCode = defaultBankAcc.BankCode;
            this.purchaseOrderHObj.BankBranch = defaultBankAcc.BankName;
            this.purchaseOrderHObj.BankAccNo = defaultBankAcc.BankAccountNo;
            this.purchaseOrderHObj.BankAccName = defaultBankAcc.BankAccountName;
          }
          else {
            this.POForm.patchValue({
              CustBankAcc: 0,
              VendorBankAccNo: ''
            });
          }

          this.initDdlVendorBankAcc();
        }
      });
    this.checkValidExpDt();
  }

  async getDataFromRefMaster() {
    this.ReqByCode.Code = CommonConstant.RefMasterTypeCodePoItemCode;
    await this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCodeOrderedBySeqNo, this.ReqByCode).toPromise().then(
      (response: RefMasterObj) => {
        this.ListRefMaster = response[CommonConstant.RefMasterObjs];

        for (var i = 0; i < this.ListRefMaster.length; i++) {
          var tempPurchaseOrderDObj = new PurchaseOrderDObj();
          if (this.ListRefMaster[i].ReserveField2 == CommonConstant.PurchaseOrderItemTypeNonFee) {
            tempPurchaseOrderDObj.FeeName = this.ListRefMaster[i].Descr;
            tempPurchaseOrderDObj.MrPoItemCode = this.ListRefMaster[i].MasterCode;
            let purchaseOrderAmt = this.AssetObj.AgrmntFinDataObj[this.ListRefMaster[i].ReserveField3] ? this.AssetObj["AgrmntFinDataObj"][this.ListRefMaster[i].ReserveField3] : 0;

            if (this.ListRefMaster[i].MasterCode == CommonConstant.PoItemCodeInsNotCptlz) purchaseOrderAmt = this.AssetObj.TotalInsCustAmt;
            if (this.ListRefMaster[i].MasterCode == CommonConstant.PoItemCodeLfiNotCptlz) purchaseOrderAmt = this.AssetObj.TotalLifeInsCustAmt;
            if (this.ListRefMaster[i].MasterCode == CommonConstant.PoItemCodeDiffRateAmt) purchaseOrderAmt = this.AssetObj.DiffRateAmt;

            tempPurchaseOrderDObj.PurchaseOrderAmt = purchaseOrderAmt;
            this.ListPurchaseOrder.push(tempPurchaseOrderDObj);
          }
          if (this.ListRefMaster[i].ReserveField2 == CommonConstant.PurchaseOrderItemTypeFee) {
            let tempAgrmntFeeObj = this.AssetObj.AgrmntFeeListObj.find(x => x.MrFeeTypeCode == this.ListRefMaster[i].ReserveField3);
            tempPurchaseOrderDObj.FeeName = this.ListRefMaster[i].Descr;
            tempPurchaseOrderDObj.MrPoItemCode = this.ListRefMaster[i].MasterCode;

            if (tempAgrmntFeeObj != undefined)
              tempPurchaseOrderDObj.PurchaseOrderAmt = tempAgrmntFeeObj.AppFeeAmt ? tempAgrmntFeeObj.AppFeeAmt : 0;
            else
              tempPurchaseOrderDObj.PurchaseOrderAmt = 0;

            this.ListPurchaseOrder.push(tempPurchaseOrderDObj);
          }
        }
      });
    this.isReady = true;
  }

  listCustBankAcc: Array<AppCustBankAccObj>;
  async GetListAppCustBankAcc() {
    await this.http.post<GenericListObj>(URLConstantX.GetAppCustBankAccsByAppIdX, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.listCustBankAcc = response.ReturnObject["AppCustBankAccObjs"];
        var x = this.listCustBankAcc.find(x => x.IsDefault);
        if (x != null) {
          this.POForm.patchValue({
            CustBankAcc: x.AppCustBankAccId
          });
          this.purchaseOrderHObj.BankCode = x.BankCode;
          this.purchaseOrderHObj.BankBranch = x.BankBranch;
          this.purchaseOrderHObj.BankAccNo = x.BankAccNo;
          this.purchaseOrderHObj.BankAccName = x.BankAccName;
        }

      }
    );
  }

  async GetPoDataForCustBank(appAssetObj) {
    await this.http.post(URLConstantX.GetPurchaseOrderHByAgrmntIdAndSupplCodeX, appAssetObj).toPromise().then(
      (response) => {
        if (response["PurchaseOrderHId"] != 0) {
          var x = this.listCustBankAcc.find(x => x.BankCode == response["BankCode"] && x.BankBranch == response["BankBranch"] && x.BankAccNo == response["BankAccNo"] && x.BankAccName == response["BankAccName"]);
          if (x != null) {
            this.POForm.patchValue({
              CustBankAcc: x.AppCustBankAccId
            });
            this.purchaseOrderHObj.BankCode = x.BankCode;
            this.purchaseOrderHObj.BankBranch = x.BankBranch;
            this.purchaseOrderHObj.BankAccNo = x.BankAccNo;
            this.purchaseOrderHObj.BankAccName = x.BankAccName;
          }
        }

      }
    );
  }

  selectedBank() {

    let custBankAccId: number = this.POForm.get("CustBankAcc").value;
    let selectedBankAcc: AppCustBankAccObj = this.listCustBankAcc.find(x => x.AppCustBankAccId == custBankAccId);
    if (selectedBankAcc != null) {
      this.purchaseOrderHObj.BankCode = selectedBankAcc.BankCode;
      this.purchaseOrderHObj.BankBranch = selectedBankAcc.BankBranch;
      this.purchaseOrderHObj.BankAccNo = selectedBankAcc.BankAccNo;
      this.purchaseOrderHObj.BankAccName = selectedBankAcc.BankAccName;
    }
  }

  async GetFromRule() {
    var tempRefMasterObj = new Array();
    await this.http.post(URLConstant.GetPurchaseOrderDPoItemCodeFromRuleByType, {}).toPromise().then(
      (response) => {
        console.log(response);
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

        //START X DSF UATDSFCF-588: Fix perhitungan PO D Insurance yg PayPeriodToInsco == Annualy (dihitung tersendiri di luar AgrmntFinData)
        if (ListPORefMasterObj[i].SourceAgrmntFinDataField == CommonConstantX.SRC_AGRMNT_FIN_DATA_FIELD_TOTAL_INS_CUST_AMT) {
          tempPurchaseOrderDObj.PurchaseOrderAmt = this.TotalInsCustAmt;
        }
        //END X DSF UATDSFCF-588

        TempListPurchaseOrderD.push(tempPurchaseOrderDObj);
      }
      if (ListPORefMasterObj[i].Type == CommonConstant.PurchaseOrderItemTypeFee) {
        let tempAgrmntFeeObj = this.AssetObj.AgrmntFeeListObj.find(x => x.MrFeeTypeCode == ListPORefMasterObj[i].SourceMrFeeTypeCode);
        var tempPurchaseOrderDObj = new PurchaseOrderDObj();
        tempPurchaseOrderDObj.MrPoItemCode = ListPORefMasterObj[i].MrPoItemCode;
        if (tempAgrmntFeeObj != undefined)
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
    this.purchaseOrderHObj.PurchaseOrderExpiredDt = this.PurchaseOrderExpiredDt;

    if (this.bankVisible == true) {
      this.purchaseOrderHObj.BankCode = this.responseRefBank.BankCode;
      this.purchaseOrderHObj.BankBranch = this.responseRefBank.OfficeBankAccBranch;
      this.purchaseOrderHObj.BankAccNo = this.responseRefBank.OfficeBankAccNo;
      this.purchaseOrderHObj.BankAccName = this.responseRefBank.OfficeBankAccName;
    }

    var ListPORefMasterObj = await this.GetFromRule();
    var listPurchaseOrderD = this.GenerateRequestPurchaseOrderDObjs(ListPORefMasterObj);

    var POObj = {
      requestPurchaseOrderHObj: this.purchaseOrderHObj,
      requestPurchaseOrderDObjs: listPurchaseOrderD
    }

    if (this.purchaseOrderHObj.BankCode ||
      this.purchaseOrderHObj.BankBranch ||
      this.purchaseOrderHObj.BankAccNo ||
      this.purchaseOrderHObj.BankAccName) {
      this.AddEditPO(POObj);
    }
    else {
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
    this.checkValidExpDt();
    if (!this.isDataExist) {
      this.http.post(URLConstant.AddPurchaseOrder, POObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PO_PO_EXT], { "AgrmntId": this.AgrmntId, "LobCode": this.lobCode, "AppId": this.AppId, "TaskListId": this.TaskListId, "BizTemplateCode": this.BizTemplateCode });

        });
    } else {
      this.http.post(URLConstant.EditPurchaseOrder, POObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PO_PO_EXT], { "AgrmntId": this.AgrmntId, "LobCode": this.lobCode, "AppId": this.AppId, "TaskListId": this.TaskListId, "BizTemplateCode": this.BizTemplateCode });
        });
    }
  }

  selectedOption(event) {
    if (event == 'Yes') {
      this.bankVisible = true;
    }
    else {
      this.bankVisible = false;
    }
  }

  getGeneralSetBankAcc() {
    let reqByCodeObj = {
      Code: CommonConstantX.GsCodePONoNeedToPayBank
    }
    this.http.post(URLConstant.GetGeneralSettingByCode, reqByCodeObj).subscribe(
      (response) => {
        console.log(response)
        if (response != null) {
          this.getBankAcc(response['GsValue']);
        }

      });
    // this.responseGeneralSetting = {OfficeBankAccNo:"testNo", OfficeBankAccName:"testName"}
    // this.getBankName("002");
  }

  getBankAcc(OfficeBankAccCode: string) {
    var officeBankObj = {
      Code: OfficeBankAccCode
    };
    this.http.post(URLConstantX.GetOfficeBankAccAndRefBankDataByOfficeBankAccCode, officeBankObj).subscribe(
      (response) => {
        this.responseRefBank = response
      },
      (error) => {
        console.log(error);
      }
    );
  }

  initDdlVendorBankAcc() {
    this.ucDdlVendorBankAccObj = new UcDropdownListObj;
    this.ucDdlVendorBankAccObj.ddlType = "one";
    this.ucDdlVendorBankAccObj.isCustomList = true;
    this.ucDdlVendorBankAccObj.isSelectOutput = true;
    this.ucDdlVendorBankAccObj.customKey = "BankAccountNo";
    this.ucDdlVendorBankAccObj.customValue = "VendorBankAccInfoForDisplay"
    this.isDdlVendorBankAccReady = true
  }

  vendorBankAccChange(ev) {
    this.purchaseOrderHObj.BankCode = ev.selectedObj.BankCode;
    this.purchaseOrderHObj.BankBranch = ev.selectedObj.BankName;
    this.purchaseOrderHObj.BankAccNo = ev.selectedObj.BankAccountNo;
    this.purchaseOrderHObj.BankAccName = ev.selectedObj.BankAccountName;
  }
}
