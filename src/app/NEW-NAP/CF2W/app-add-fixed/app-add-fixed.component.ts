import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';
import { DataTableFixedNAPObj } from 'app/shared/model/DataTableFixedNAPObj.Model';
import { SaveAppDataCF2WObj } from 'app/shared/model/SaveAppDataCF2WObj.Model';
import { AppFixedFeeObj } from 'app/shared/model/AppFixedFeeObj.Model';
import { AppFixedInsObj } from 'app/shared/model/AppFixedInsObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-app-add-fixed',
  templateUrl: './app-add-fixed.component.html',
  providers: [NGXToastrService]
})
export class AppAddFixedComponent implements OnInit {

  param;
  ProductOfferingIdentifier;
  ProductOfferingNameIdentifier;
  LobCode;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService, private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params["LobCode"] != null) {
        this.LobCode = params["LobCode"];
      }
    });
  }

  NapAppForm = this.fb.group({
    MouCustId: [''],
    LeadId: [''],
    AppNo: [''],
    OriOfficeCode: [''],
    OriOfficeName: [''],
    CrtOfficeCode: [''],
    CrtOfficeName: [''],
    ProdOfferingCode: [''],
    ProdOfferingName: [''],
    ProdOfferingVersion: [''],
    AppCreatedDt: [''],
    AppStat: [''],
    AppCurrStep: [''],
    AppLastStep: [''],
    CurrCode: [''],
    LobCode: [''],
    RefProdTypeCode: [''],
    Tenor: [''],
    NumOfInst: 0,
    PayFreqCode: [''],
    MrFirstInstTypeCode: [''],
    NumOfAsset: 1,
    MrLcCalcMethodCode: [''],
    LcInstRatePrml: [''],
    LcInsRatePrml: [''],
    MrAppSourceCode: "test",
    MrWopCode: "test",
    SrvyOrderNo: [''],
    ApvDt: [''],
    SalesHeadNo: [''],
    SalesNotes: [''],
    SalesOfficerNo: "test",
    CreditAdminNo: [''],
    CreditAnalystNo: [''],
    CreditRiskNo: [''],
    DataEntryNo: [''],
    MrSalesRecommendCode: [''],
    MrCustNotifyOptCode: "test",
    PreviousAppId: [''],
    IsAppInitDone: [''],
    MrOrderInfoCode: [''],
    ApprovalStat: [''],
    RsvField1: [''],
    RsvField2: [''],
    RsvField3: [''],
    RsvField4: [''],
    RsvField5: ['']
  });

  inputLookupObjCopyProduct;
  InputLookupAssetObj;
  inputLookupObjName;
  inputLookupSupplierObj;
  officeItems;
  user;
  listRefOfficeId: Array<any> = [];
  allAppDataObj: SaveAppDataCF2WObj;

  ngOnInit() {
    // Lookup Obj
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.MakeLookUpObj();

    this.GetOfficeDDL();

    if (this.user.MrOfficeTypeCode == CommonConstant.HeadOffice) {
      this.NapAppForm.controls.OriOfficeCode.disable();
      this.NapAppForm.patchValue({
        OriOfficeCode: this.user.OfficeCode,
        OriOfficeName: this.user.OfficeName,
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    } else if (this.user.MrOfficeTypeCode == CommonConstant.CenterGroup) {
      this.NapAppForm.patchValue({
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }

    this.refOfficeObj = new RefOfficeObj();
    this.http.post(URLConstant.GetListKvpActiveRefOfficeIdForPaging, this.refOfficeObj).subscribe(
      (response) => {
        this.returnRefOfficeObj = response[CommonConstant.ReturnObj];
        for (let i = 0; i < this.returnRefOfficeObj.length; i++) {
          this.listRefOfficeId.push(this.returnRefOfficeObj[i].Key)
        }
      }
    );

    // Test Data

  }

  refOfficeObj;
  returnRefOfficeObj;
  arrAddCrit;
  critSupplier;
  MakeLookUpObj() {
    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";

    this.inputLookupObjCopyProduct = new InputLookupObj();
    this.inputLookupObjCopyProduct.urlJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupObjCopyProduct.urlEnviPaging = environment.losUrl;
    this.inputLookupObjCopyProduct.pagingJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.genericJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.isRequired = false;

    this.inputLookupObjName = new InputLookupObj();
    this.inputLookupObjName.urlJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupObjName.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObjName.pagingJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.genericJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.nameSelect = this.NapAppForm.controls.ProdOfferingName.value;

    this.arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE ";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.user.MrOfficeTypeCode];
    this.arrAddCrit.push(addCrit);
    this.inputLookupObjName.addCritInput = this.arrAddCrit;

    this.inputLookupSupplierObj = new InputLookupObj();
    this.inputLookupSupplierObj.urlJson = "./assets/uclookup/NAP/lookupSupplierBranch.json";
    this.inputLookupSupplierObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupSupplierObj.pagingJson = "./assets/uclookup/NAP/lookupSupplierBranch.json";
    this.inputLookupSupplierObj.genericJson = "./assets/uclookup/NAP/lookupSupplierBranch.json";


    // this.critSupplier = new Array();
    // var addCritSupp = new CriteriaObj();
    // addCritSupp.DataType = "number";
    // addCritSupp.propName = "VOM.REF_OFFICE_ID";
    // addCritSupp.restriction = AdInsConstant.RestrictionIn;
    // addCritSupp.listValue = this.listRefOfficeId;
    // this.critSupplier.push(addCritSupp);
    // this.inputLookupSupplierObj.addCritInput = this.critSupplier;
  }

  GetOfficeDDL() {
    // Office DDL
    var obj = {
      RowVersion: ""
    };
    var url = environment.FoundationR3Url + URLConstant.GetListKvpActiveRefOffice;
    this.http.post(url, obj).subscribe(
      (response) => {
        this.officeItems = response[CommonConstant.ReturnObj];
        this.NapAppForm.patchValue({
          OriOfficeCode: this.officeItems[0].Key,
          OriOfficeName: this.officeItems[0].Value,
        });
      });
  }

  CheckValue(obj) {
    if (obj.MrWopCode == null) {
      obj.MrWopCode = "";
    }
    if (obj.SalesOfficerNo == null) {
      obj.SalesOfficerNo = "";
    }
    if (obj.MrAppSourceCode == null) {
      obj.MrAppSourceCode = "";
    }
    if (obj.MrCustNotifyOptCode == null) {
      obj.MrCustNotifyOptCode = "";
    }
    if (obj.MrFirstInstTypeCode == null) {
      obj.MrFirstInstTypeCode = "";
    }

    return obj;
  }

  setApp() {
    if (this.NapAppForm.controls["LeadId"].value == 0) {
      this.allAppDataObj.AppObj.LeadId = null;
    }
    this.allAppDataObj.AppObj.AppNo = "0";
    this.allAppDataObj.AppObj.PreviousAppId = null;
    // this.allAppDataObj.AppObj.MouCustId = this.NapAppForm.controls["MouCustId"].value;
    // this.allAppDataObj.AppObj.LeadId = this.NapAppForm.controls["LeadId"].value;
    this.allAppDataObj.AppObj.OriOfficeCode = this.NapAppForm.controls["OriOfficeCode"].value;
    this.allAppDataObj.AppObj.OriOfficeName = this.NapAppForm.controls["OriOfficeName"].value;
    this.allAppDataObj.AppObj.CrtOfficeCode = this.NapAppForm.controls["CrtOfficeCode"].value;
    this.allAppDataObj.AppObj.CrtOfficeName = this.NapAppForm.controls["CrtOfficeName"].value;
    this.allAppDataObj.AppObj.ProdOfferingCode = this.NapAppForm.controls["ProdOfferingCode"].value;
    this.allAppDataObj.AppObj.ProdOfferingName = this.NapAppForm.controls["ProdOfferingName"].value;
    this.allAppDataObj.AppObj.ProdOfferingVersion = this.NapAppForm.controls["ProdOfferingVersion"].value;
    this.allAppDataObj.AppObj.AppCreatedDt = this.user.BusinessDt;
    this.allAppDataObj.AppObj.AppStat = CommonConstant.AppStepNew;
    this.allAppDataObj.AppObj.AppCurrStep = CommonConstant.AppStepNew;
    this.allAppDataObj.AppObj.CurrCode = this.NapAppForm.controls["CurrCode"].value;
    this.allAppDataObj.AppObj.LobCode = this.NapAppForm.controls["LobCode"].value;
    this.allAppDataObj.AppObj.RefProdTypeCode = this.NapAppForm.controls["RefProdTypeCode"].value;
    this.allAppDataObj.AppObj.NumOfInst = this.NapAppForm.controls["NumOfInst"].value;
    this.allAppDataObj.AppObj.PayFreqCode = this.NapAppForm.controls["PayFreqCode"].value;
    this.allAppDataObj.AppObj.MrFirstInstTypeCode = this.NapAppForm.controls["MrFirstInstTypeCode"].value;
    this.allAppDataObj.AppObj.NumOfAsset = this.NapAppForm.controls["NumOfAsset"].value;
    this.allAppDataObj.AppObj.MrAppSourceCode = this.NapAppForm.controls["MrAppSourceCode"].value;
    this.allAppDataObj.AppObj.MrWopCode = this.NapAppForm.controls["MrWopCode"].value;
    this.allAppDataObj.AppObj.SalesOfficerNo = this.NapAppForm.controls["SalesOfficerNo"].value;
    this.allAppDataObj.AppObj.MrCustNotifyOptCode = this.NapAppForm.controls["MrCustNotifyOptCode"].value;
    this.allAppDataObj.AppObj.IsAppInitDone = false;
  }

  setAppAsset() {
    this.allAppDataObj.AppAssetObj.FullAssetName = this.assetName;
    this.allAppDataObj.AppAssetObj.MrAssetConditionCode = CommonConstant.AssetConditionNew;
    this.allAppDataObj.AppAssetObj.MrAssetUsageCode = CommonConstant.AssetUsageNonComm;
    this.allAppDataObj.AppAssetObj.SupplName = this.supplierName;
    this.allAppDataObj.AppAssetObj.SupplCode = this.supplierCode;

    this.allAppDataObj.AppAssetObj.AssetSeqNo = 1;
    this.allAppDataObj.AppAssetObj.FullAssetCode = this.assetCode;

    this.allAppDataObj.AppAssetObj.AssetStat = CommonConstant.AssetStatNew;
    this.allAppDataObj.AppCollateralObj.CollateralStat = CommonConstant.AssetStatNew;

    this.allAppDataObj.AppAssetObj.AssetTypeCode = this.assetTypeCode;
    this.allAppDataObj.AppAssetObj.AssetCategoryCode = this.assetCategoryCode;
    this.allAppDataObj.AppAssetObj.IsCollateral = true;
    this.allAppDataObj.AppAssetObj.IsInsurance = true;

    this.allAppDataObj.AppCollateralObj.CollateralSeqNo = 1;
    this.allAppDataObj.AppCollateralObj.FullAssetCode = this.assetCode;
    this.allAppDataObj.AppCollateralObj.FullAssetName = this.assetName;
    this.allAppDataObj.AppCollateralObj.MrCollateralConditionCode = CommonConstant.AssetConditionNew;
    this.allAppDataObj.AppCollateralObj.MrCollateralUsageCode = CommonConstant.AssetUsageNonComm;

    this.allAppDataObj.AppCollateralObj.AssetTypeCode = this.assetTypeCode;
    this.allAppDataObj.AppCollateralObj.AssetCategoryCode = this.assetCategoryCode;

  }

  supplierCode;
  supplierName;
  SetSupplierBranch(event) {
    this.supplierCode = event.VendorCode;
    this.supplierName = event.VendorName;

  }

  assetCode;
  assetName;
  assetTypeCode;
  assetCategoryCode;
  asset;
  brand;
  model;
  type;
  SetAsset(event) {
    this.assetCode = event.FullAssetCode;
    this.assetName = event.FullAssetName;
    this.assetTypeCode = event.AssetTypeCode;
    this.assetCategoryCode = event.AssetCategoryCode
    this.asset = this.assetCode.split('.');
    for (var i = 0; i < this.asset.length; i++) {
      this.brand = this.asset[0];
      this.model = this.asset[1];
      this.type = this.asset[2];
    }
  }


  SupplCode;
  BrandCode;
  ModelCode;
  TypeCode;
  returnDtFixedNAPObj;
  generateData() {
    this.SupplCode = this.supplierCode;
    this.BrandCode = this.brand;
    this.ModelCode = this.model;
    this.TypeCode = this.type;

    var dtFixedNAPObj = new DataTableFixedNAPObj();
    dtFixedNAPObj.SupplCode = this.SupplCode;
    dtFixedNAPObj.BrandCode = this.BrandCode;
    dtFixedNAPObj.ModelCode = this.ModelCode;
    dtFixedNAPObj.TypeCode = this.TypeCode;
    this.http.post(URLConstant.DataTableNAP, dtFixedNAPObj).subscribe(
      (response) => {
        this.returnDtFixedNAPObj = response;
        this.toastr.successMessage(response["message"]);
      });
  }

  returnFeeAndInsFixedNAP;
  returnAllAppDataObj;
  downPayment;
  assetPrice;
  firstInstallmentType;
  editItem(item: any) {
    this.downPayment = parseInt(item.DP, 10),
      this.assetPrice = parseInt(item.OTR, 10),

      this.NapAppForm.patchValue({
        Tenor: parseInt(item.Tenor, 10),
        MrFirstInstTypeCode: item.FirstInstallmentType
      });

    var feeAndInsFixedNAP = new DataTableFixedNAPObj();
    feeAndInsFixedNAP.LobCode = this.LobCode;
    feeAndInsFixedNAP.OfficeCode = this.user.MrOfficeTypeCode;
    feeAndInsFixedNAP.InsPackage = item.InsPackage;
    feeAndInsFixedNAP.Tenor = parseInt(item.Tenor, 10);
    this.http.post(URLConstant.DataTableFeeAndInsNAP, feeAndInsFixedNAP).subscribe(
      (response) => {
        this.returnFeeAndInsFixedNAP = response[CommonConstant.ReturnObj];

        this.allAppDataObj = new SaveAppDataCF2WObj();
        for (var i = 0; i < this.returnFeeAndInsFixedNAP.DtFeeFixedNAP.length; i++) {
          var appFixedFeeObj = new AppFixedFeeObj();
          appFixedFeeObj.MrFeeTypeCode = this.returnFeeAndInsFixedNAP.DtFeeFixedNAP[i].ListFee;
          appFixedFeeObj.MrFeePaymentTypeCode = this.returnFeeAndInsFixedNAP.DtFeeFixedNAP[i].FeeType;
          appFixedFeeObj.StdFeeAmt = this.returnFeeAndInsFixedNAP.DtFeeFixedNAP[i].StdFeeAmt;
          appFixedFeeObj.SellFeeAmt = this.returnFeeAndInsFixedNAP.DtFeeFixedNAP[i].SellFeeAmt;
          appFixedFeeObj.StdFeePrcnt = this.returnFeeAndInsFixedNAP.DtFeeFixedNAP[i].StdFeePrcntg;
          appFixedFeeObj.SellFeePrcnt = this.returnFeeAndInsFixedNAP.DtFeeFixedNAP[i].SellFeePrcntg;
          appFixedFeeObj.MrFeeCptlzTypeCode = this.returnFeeAndInsFixedNAP.DtFeeFixedNAP[i].FeeCapitalizeType;
          appFixedFeeObj.CptlzPrnct = this.returnFeeAndInsFixedNAP.DtFeeFixedNAP[i].FeeCapitalizePrcntg;
          appFixedFeeObj.CptlzAmt = this.returnFeeAndInsFixedNAP.DtFeeFixedNAP[i].FeeCapitalizeAmt;
          this.allAppDataObj.AppFixedFeeObj.push(appFixedFeeObj);
        }

        for (var j = 0; j < this.returnFeeAndInsFixedNAP.DtInsFixedNAP.length; j++) {
          var appFixedInsObj = new AppFixedInsObj();
          appFixedInsObj.YearNum = parseInt(this.returnFeeAndInsFixedNAP.DtInsFixedNAP[j].Year, 10);
          appFixedInsObj.MrInsMainCvgTypeCode = this.returnFeeAndInsFixedNAP.DtInsFixedNAP[j].MainCoverage;
          appFixedInsObj.SumInsuredPrcnt = this.returnFeeAndInsFixedNAP.DtInsFixedNAP[j].SumInsuredPercentage;
          appFixedInsObj.InsCapitalize = this.returnFeeAndInsFixedNAP.DtInsFixedNAP[j].InsCapitalize;
          appFixedInsObj.SellingRatePrcnt = this.returnFeeAndInsFixedNAP.DtInsFixedNAP[j].SellingRate;
          appFixedInsObj.BaseRatePrcnt = this.returnFeeAndInsFixedNAP.DtInsFixedNAP[j].BaseRate;
          appFixedInsObj.MrAddCvgTypeCode = this.returnFeeAndInsFixedNAP.DtInsFixedNAP[j].AdditionalCoverage;
          this.allAppDataObj.AppFixedInsObj.push(appFixedInsObj);
        }

        this.allAppDataObj.AppAssetObj.AssetPriceAmt = this.assetPrice;
        this.allAppDataObj.AppAssetObj.DownPaymentAmt = this.downPayment;
        this.allAppDataObj.AppCollateralObj.CollateralValueAmt = this.assetPrice;
        this.setAppAsset();
        this.allAppDataObj.AppObj.Tenor = this.NapAppForm.controls["Tenor"].value;
        this.allAppDataObj.AppObj.MrFirstInstTypeCode = this.NapAppForm.controls["MrFirstInstTypeCode"].value;
        this.setApp();
        this.allAppDataObj.AppFixedObj.MrFirstInstTypeCode = item.FirstInstallmentType;
        this.allAppDataObj.AppFixedObj.Tenor = this.NapAppForm.controls["Tenor"].value;
        this.allAppDataObj.AppFixedObj.SupplEffectiveRate = item.SupplEffRate;
        this.allAppDataObj.AppFixedObj.EffectiveRate = item.EffRate;
        this.allAppDataObj.AppFixedObj.DownPaymentAmt = item.DP;
        this.allAppDataObj.AppFixedObj.IsEditableDp = item.EditableDP;
        this.allAppDataObj.AppFixedObj.AssetPriceAmt = item.OTR;
        this.allAppDataObj.AppFixedObj.GracePeriod = parseInt(item.GracePeriod, 10);
        this.allAppDataObj.AppFixedObj.MrGracePeriodTypeCode = item.GracePeriodType;
        this.allAppDataObj.AppFixedObj.InscoBranchCode = item.InscoCode;
        this.allAppDataObj.AppFixedObj.InsPackageCode = item.InsPackage;
        this.allAppDataObj.AppFixedObj.InsAdminFee = item.InsAdmFee;
        this.allAppDataObj.AppFixedObj.IsCoverLifeIns = item.LifeInsCover;
        this.allAppDataObj.AppFixedObj.LifeInsCoverSubject = item.LifeInsCoverSubject;
        this.allAppDataObj.AppFixedObj.LifeInscoBranchCode = item.LifeInsco;
        this.allAppDataObj.AppFixedObj.LifeInsPaymentMethod = item.LifeInsPaymentMethod;


        this.http.post(URLConstant.AddEditAppCF2W, this.allAppDataObj).subscribe(
          (response) => {
            this.returnAllAppDataObj = response;
            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router, ["Nap/CF2W/Add/Detail"], { "AppId": response["AppId"], "LobCode": this.LobCode });
          }
        );
      });
    //this.allAppDataObj.AppFixedFeeObj = this.returnFeeAndInsFixedNAP.DtFeeFixedNAP;
    //this.allAppDataObj.AppFixedInsObj = this.returnFeeAndInsFixedNAP.DtInsFixedNAP;
  }

  getLookupAppResponseCopy(ev: any) {
    this.NapAppForm.patchValue({
      ProdOfferingCode: ev.ProdOfferingCode,
      ProdOfferingName: ev.ProdOfferingName,
      ProdOfferingVersion: ev.ProdOfferingVersion,
      AppNo: ev.AppNo,
      MouCustId: ev.MouCustId,
      LeadId: ev.LeadId,
      CurrCode: ev.CurrCode,
      LobCode: ev.LobCode,
      RefProdTypeCode: ev.RefProdTypeCode,
      Tenor: ev.Tenor,
      NumOfInst: ev.NumOfInst,
      NumOfAsset: ev.NumOfAsset,
      PayFreqCode: ev.PayFreqCode,
      MrFirstInstTypeCode: ev.MrFirstInstTypeCode,
      MrAppSourceCode: ev.MrAppSourceCode,
      MrWopCode: ev.MrWopCode,
      MrCustNotifyOptCode: ev.MrCustNotifyOptCode,
      SalesOfficerNo: ev.SalesOfficerNo
    });
    this.inputLookupObjName.nameSelect = ev.ProdOfferingName;
  }

  productOffering;
  getLookupProductOfferingName(ev: any) {
    var url = environment.FoundationR3Url + URLConstant.GetListProdOfferingDByProdOfferingCode;
    var obj = {
      ProdOfferingCode: ev.ProdOfferingCode
    };
    var tempLobCode;
    var tempCurrCode;
    var tempPayFreqCode;
    var tempRefProdTypeCode;
    this.http.post(url, obj).subscribe(
      (response) => {
        var temp = response[CommonConstant.ReturnObj];
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntLob) {
            tempLobCode = temp[i].CompntValue;
          } else if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntCurr) {
            tempCurrCode = temp[i].CompntValue;
          } else if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntPayFreq) {
            tempPayFreqCode = temp[i].CompntValue;
          } else if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntProdType) {
            tempRefProdTypeCode = temp[i].CompntValue;
          } else {
          }
        }
        this.NapAppForm.patchValue({
          ProdOfferingCode: ev.ProdOfferingCode,
          ProdOfferingName: ev.ProdOfferingName,
          ProdOfferingVersion: ev.ProdOfferingVersion,
          CurrCode: tempCurrCode,
          LobCode: tempLobCode,
          PayFreqCode: tempPayFreqCode,
          RefProdTypeCode: tempRefProdTypeCode
        });
        this.productOffering = ev.ProdOfferingName;
      });
  }

  ChangeValueOffice(ev: any) {
    this.NapAppForm.patchValue({
      OriOfficeCode: ev.target.selectedOptions[0].value,
      OriOfficeName: ev.target.selectedOptions[0].text
    });
  }
}
