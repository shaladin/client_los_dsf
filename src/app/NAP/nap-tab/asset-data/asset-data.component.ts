import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataPersonalObj } from 'app/shared/model/CustDataPersonalObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AllAssetDataObj } from '../../../shared/model/AllAssetDataObj.Model';


@Component({
  selector: 'app-asset-data',
  templateUrl: './asset-data.component.html',
})

export class AssetDataComponent implements OnInit {

  appId: any;

  AssetDataForm = this.fb.group({
    /* AppAsset Value that in form*/

    FullAssetName: ['', [Validators.required, Validators.maxLength(1000)]],
    MrAssetConditionCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrAssetUsageCode: ['', [Validators.required, Validators.maxLength(50)]],
    SerialNo1: [''],
    SerialNo2: [''],
    SerialNo3: [''],
    SupplName: ['', Validators.maxLength(500)],
    AssetPriceAmt: ['', Validators.required],
    DownPaymentAmt: ['', Validators.required],
    AssetNotes: ['', Validators.maxLength(4000)],
    Color: ['', Validators.maxLength(50)],
    TaxCityIssuer: ['', Validators.maxLength(50)],
    TaxIssueDt: [''],
    ManufacturingYear: [''],


    /* AppAsset Value That required but not in form*/
    FullAssetCode: ['', [Validators.required, Validators.maxLength(500)]],
    AssetStat: ['', [Validators.required, Validators.maxLength(50)]],
    AssetTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    AssetCategoryCode: ['', [Validators.required, Validators.maxLength(50)]],
    SupplCode: ['', Validators.maxLength(50)],
    IsCollateral: ['', Validators.required],
    IsInsurance: ['', Validators.required],
    IsEditableDp: ['', Validators.required],

    /*Admin Head SuppEmp*/
    AdminHeadName: ['', [Validators.required, Validators.maxLength(500)]],
    AdminHeadNo: ['', [Validators.required, Validators.maxLength(50)]],
    AdminHeadPositionCode: ['', [Validators.required, Validators.maxLength(50)]],

    /*Sales Person SuppEmp*/
    SalesPersonName: ['', [Validators.required, Validators.maxLength(500)]],
    SalesPersonNo: ['', [Validators.required, Validators.maxLength(50)]],
    SalesPersonPositionCode: ['', [Validators.required, Validators.maxLength(50)]],

    /*Branch Manager SuppEmp*/
    BranchManagerName: ['', [Validators.required, Validators.maxLength(500)]],
    BranchManagerNo: ['', [Validators.required, Validators.maxLength(50)]],
    BranchManagerPositionCode: ['', [Validators.required, Validators.maxLength(50)]],

    /*App Collateral Regist*/
    UserName: ['', Validators.maxLength(50)],
    MrUserRelationshipCode: ['', Validators.maxLength(4)],
    OwnerName: ['', Validators.maxLength(50)],
    MrIdTypeCode: ['', Validators.maxLength(50)],
    OwnerIdNo: ['', Validators.maxLength(50)],
    MrOwnerRelationshipCode: ['', Validators.maxLength(50)],
    OwnerAddr: ['', Validators.maxLength(50)],
    OwnerAreaCode1: ['', Validators.maxLength(50)],
    OwnerAreaCode2: ['', Validators.maxLength(50)],
    OwnerAreaCode3: ['', Validators.maxLength(50)],
    OwnerAreaCode4: ['', Validators.maxLength(50)],
    OwnerCity: ['', Validators.maxLength(50)],
    OwnerZipcode: ['', Validators.maxLength(50)],
    OwnerMobilePhnNo: ['', Validators.maxLength(50)],
    LocationAddr: ['', Validators.maxLength(50)],
    LocationAreaCode1: ['', Validators.maxLength(50)],
    LocationAreaCode2: ['', Validators.maxLength(50)],
    LocationAreaCode3: ['', Validators.maxLength(50)],
    LocationAreaCode4: ['', Validators.maxLength(50)],
    LocationCity: ['', Validators.maxLength(50)],
    LocationZipcode: ['', Validators.maxLength(50)],

  });


  refMasterObj = {
    RefMasterTypeCode: "",
  };
  appObj = {
    AppId: 0,
  };

  selectedSupplCode: any;
  selectedSupplName: any;
  selectedNationalityCountryCode: any;

  allAssetDataObj: AllAssetDataObj;

  InputLookupSupplierObj: any;
  InputLookupCityIssuerObj: any;
  InputLookupAssetObj: any;
  InputLookupSupplAccObj: any;
  InputLookupAccObj: any;

  AdminHeadObj: any;
  SalesPersonObj: any;
  BranchManagerObj: any;
  UserRelationObj: any;
  OwnerRelationObj: any;
  IdTypeObj: any;
  AssetUsageObj: any;
  AppObj: any;

  getRefMasterUrl: any;
  AddEditAllAssetDataUrl: any;
  GetAllAssetDataUrl: any;
  getAppUrl: any;

  OfficeCode: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    })
  }

  ngOnInit() {
    this.initUrl();
    this.initLookup();
    this.bindAllRefMasterObj();
    //this.getCustData();
  }

  SaveForm() {
    this.allAssetDataObj = new AllAssetDataObj();
    this.setCustPersonalObj();
    this.http.post(this.AddEditAllAssetDataUrl, this.allAssetDataObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  setCustPersonalObj() {
    this.allAssetDataObj.AppAssetObj.FullAssetName = this.AssetDataForm.controls.FullAssetName.value;
    this.allAssetDataObj.AppAssetObj.MrAssetConditionCode = this.AssetDataForm.controls.MrAssetConditionCode.value;
    this.allAssetDataObj.AppAssetObj.MrAssetUsageCode = this.AssetDataForm.controls.MrAssetUsageCode.value;
    this.allAssetDataObj.AppAssetObj.SerialNo1 = this.AssetDataForm.controls.SerialNo1.value;
    this.allAssetDataObj.AppAssetObj.SerialNo2 = this.AssetDataForm.controls.SerialNo2.value;
    this.allAssetDataObj.AppAssetObj.SerialNo3 = this.AssetDataForm.controls.SerialNo3.value;
    this.allAssetDataObj.AppAssetObj.SupplName = this.AssetDataForm.controls.SupplName.value;
    this.allAssetDataObj.AppAssetObj.AssetPriceAmt = this.AssetDataForm.controls.AssetPriceAmt.value;
    this.allAssetDataObj.AppAssetObj.DownPaymentAmt = this.AssetDataForm.controls.DownPaymentAmt.value;
    this.allAssetDataObj.AppAssetObj.AssetNotes = this.AssetDataForm.controls.AssetNotes.value;
    this.allAssetDataObj.AppAssetObj.Color = this.AssetDataForm.controls.Color.value;
    this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.AssetDataForm.controls.TaxCityIssuer.value;
    this.allAssetDataObj.AppAssetObj.TaxIssueDt = this.AssetDataForm.controls.TaxIssueDt.value;
    this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.AssetDataForm.controls.ManufacturingYear.value;

    //this.custDataPersonalObj.AppCustPersonalObj.FullAssetName = this.AssetDataForm.controls.FullAssetName.value;
    //this.custDataPersonalObj.AppCustPersonalObj.ManufacturingYear = this.AssetDataForm.controls.ManufacturingYear.value;
    //this.custDataPersonalObj.AppCustPersonalObj.SerialNo2 = this.AssetDataForm.controls.SerialNo2.value;
    //this.custDataPersonalObj.AppCustPersonalObj.Color = this.AssetDataForm.controls.Color.value;
    //this.custDataPersonalObj.AppCustPersonalObj.AssetNotes = this.AssetDataForm.controls.AssetNotes.value;
    //this.custDataPersonalObj.AppCustPersonalObj.AssetPriceAmt = this.AssetDataForm.controls.AssetPriceAmt.value;
    //this.custDataPersonalObj.AppCustPersonalObj.DownPaymentAmt = this.AssetDataForm.controls.DownPaymentAmt.value;
    //this.custDataPersonalObj.AppCustPersonalObj.NationalityCountryCode = this.selectedNationalityCountryCode;
    //this.custDataPersonalObj.AppCustPersonalObj.TaxCityIssuer = this.AssetDataForm.controls.TaxCityIssuer.value;
    //this.custDataPersonalObj.AppCustPersonalObj.SupplName = this.AssetDataForm.controls.SupplName.value;
    //this.custDataPersonalObj.AppCustPersonalObj.AdminHead = this.AssetDataForm.controls.AdminHead.value;
    //this.custDataPersonalObj.AppCustPersonalObj.TaxIssueDt = this.AssetDataForm.controls.TaxIssueDt.value;
    //this.custDataPersonalObj.AppCustPersonalObj.SupplCode = this.AssetDataForm.controls.SupplCode.value;
    //this.custDataPersonalObj.AppCustPersonalObj.SalesPerson = this.AssetDataForm.controls.SalesPerson.value;
    //this.custDataPersonalObj.AppCustPersonalObj.Email2 = this.AssetDataForm.controls.Email2.value;
    //this.custDataPersonalObj.AppCustPersonalObj.Email3 = this.AssetDataForm.controls.Email3.value;
    //this.custDataPersonalObj.AppCustPersonalObj.BranchManager = this.AssetDataForm.controls.BranchManager.value;
    //this.custDataPersonalObj.AppCustPersonalObj.NoOfResidence = this.AssetDataForm.controls.NoOfResidence.value;
    //this.custDataPersonalObj.AppCustPersonalObj.NoOfDependents = this.AssetDataForm.controls.NoOfDependents.value;
  }

  //CopyAsset(event) {
  //  this.selectedSupplCode = event.CustNo;
  //}




  CustTypeChanged(event) {
    this.setCriteriaLookupCustomer(event.value);
  }

  setCriteriaLookupCustomer(custTypeCode) {
    var suppCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MR_CUST_TYPE_CODE';
    critObj.value = custTypeCode;
    suppCrit.push(critObj);
    this.InputLookupSupplierObj.addCritInput = suppCrit;
  }



  //getCustData() {
  //  this.custDataObj = new CustDataObj();
  //  this.custDataObj.AppId = this.appId;
  //  console.log(this.custDataObj);
  //  this.http.post(this.GetAllAssetDataUrl, this.custDataObj).subscribe(
  //    (response) => {
  //      console.log(response);
  //      var appCustObj = response["AppCustObj"];
  //      var appCustPersonalObj = response["AppCustPersonalObj"];
  //      this.AssetDataForm.patchValue({
  //        FullAssetCode: appCustObj.FullAssetCode,
  //        FullAssetName: appCustPersonalObj.FullAssetName,
  //        MrAssetConditionCode: appCustObj.MrAssetConditionCode,
  //        ManufacturingYear: appCustPersonalObj.ManufacturingYear,
  //        SerialNo1: appCustObj.SerialNo1,
  //        SerialNo2: appCustPersonalObj.SerialNo2,
  //        SerialNo3: formatDate(appCustObj.SerialNo3, 'yyyy-MM-dd', 'en-US'),
  //        Color: appCustPersonalObj.Color,
  //        AssetNotes: appCustPersonalObj.AssetNotes,
  //        AssetPriceAmt: formatDate(appCustPersonalObj.AssetPriceAmt, 'yyyy-MM-dd', 'en-US'),
  //        DownPaymentAmt: appCustPersonalObj.DownPaymentAmt,
  //        MrAssetUsageCode: appCustObj.MrAssetUsageCode,
  //        TaxCityIssuer: appCustPersonalObj.TaxCityIssuer,
  //        TaxIssueDt: appCustPersonalObj.TaxIssueDt,
  //        SupplName: appCustPersonalObj.SupplName,
  //        SupplCode: appCustPersonalObj.SupplCode,
  //        AdminHead: appCustPersonalObj.AdminHead,
  //        IsVip: appCustObj.IsVip,
  //        SalesPerson: appCustPersonalObj.SalesPerson,
  //        BranchManager: appCustPersonalObj.BranchManager,
  //        Email2: appCustPersonalObj.Email2,
  //        NoOfResidence: appCustPersonalObj.NoOfResidence,
  //        Email3: appCustPersonalObj.Email3,
  //        NoOfDependents: appCustPersonalObj.NoOfDependents
  //      });
  //      this.setCriteriaLookupCustomer(appCustObj.FullAssetCode);
  //      this.InputLookupSupplierObj.nameSelect = appCustObj.CustName;
  //      this.selectedSupplCode = appCustObj.CustNo;
  //      this.selectedNationalityCountryCode = appCustPersonalObj.NationalityCountryCode;
  //      this.setCountryName(appCustPersonalObj.NationalityCountryCode);
  //    },
  //    (error) => {
  //      console.log(error);
  //    }
  //  );
  //}

  initUrl() {
    this.getRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.GetAllAssetDataUrl = AdInsConstant.GetCustDataByAppId;
    this.getAppUrl = AdInsConstant.GetAppById;
  }

  initLookup() {
    this.InputLookupSupplierObj = new InputLookupObj();
    this.InputLookupSupplierObj.urlJson = "./assets/uclookup/lookupSupplier.json";
    this.InputLookupSupplierObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupSupplierObj.pagingJson = "./assets/uclookup/lookupSupplier.json";
    this.InputLookupSupplierObj.genericJson = "./assets/uclookup/lookupSupplier.json";
    var suppCrit = new Array();
    var critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionEq;
    critSuppObj.propName = 'ro.OFFICE_CODE';
    critSuppObj.value = this.OfficeCode;
    suppCrit.push(critSuppObj);
    this.InputLookupSupplierObj.addCritInput = suppCrit;

    this.InputLookupCityIssuerObj = new InputLookupObj();
    this.InputLookupCityIssuerObj.urlJson = "./assets/uclookup/lookupDistrict.json";
    this.InputLookupCityIssuerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCityIssuerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCityIssuerObj.pagingJson = "./assets/uclookup/lookupDistrict.json";
    this.InputLookupCityIssuerObj.genericJson = "./assets/uclookup/lookupDistrict.json";
    var disCrit = new Array();
    var critDisObj = new CriteriaObj();
    critDisObj.DataType = 'text';
    critDisObj.restriction = AdInsConstant.RestrictionEq;
    critDisObj.propName = 'DISTRICT_REG_RPT_CODE';
    critDisObj.value = 'DIS';
    disCrit.push(critDisObj);
    this.InputLookupSupplierObj.addCritInput = disCrit;

    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/lookupAsset.json";


    this.InputLookupAccObj = new InputLookupObj();
    this.InputLookupAccObj.urlJson = "./assets/uclookup/lookupSupplier.json";
    this.InputLookupAccObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAccObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAccObj.pagingJson = "./assets/uclookup/lookupSupplier.json";
    this.InputLookupAccObj.genericJson = "./assets/uclookup/lookupSupplier.json";

  }

  bindAllRefMasterObj() {
    this.bindAssetUsageObj();
    this.bindIdTypeObj();
    this.bindUserOwnerRelationshipObj();
  }

  bindAssetUsageObj() {
    this.refMasterObj.RefMasterTypeCode = "ASSET_USAGE";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.AssetUsageObj = response["ReturnObject"];
        if (this.AssetUsageObj.length > 0) {
          this.AssetDataForm.patchValue({
            MrAssetUsageCode: this.AssetUsageObj[0].Key
          });

        }
      }
    );
  }

  bindIdTypeObj() {
    this.refMasterObj.RefMasterTypeCode = "ID_TYPE";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.IdTypeObj = response["ReturnObject"];
        if (this.IdTypeObj.length > 0) {
          this.AssetDataForm.patchValue({
            MrIdTypeCode: this.IdTypeObj[0].Key
          });
        }
      }
    );
  }

  bindUserOwnerRelationshipObj() {

    this.refMasterObj.RefMasterTypeCode = "CUST_PERSONAL_RELATIONSHIP";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.UserRelationObj = response["ReturnObject"];
        this.OwnerRelationObj = response["ReturnObject"];
        if (this.UserRelationObj.length > 0) {
          this.AssetDataForm.patchValue({
            MrUserRelationshipCode: this.UserRelationObj[0].Key,
            MrOwnerRelationshipCode: this.UserRelationObj[0].Key
          });
        }
      }
    );
  }

  GetAppData() {
    this.appObj.AppId = this.appId;
    this.http.post(this.getAppUrl, this.appObj).subscribe(
      (response) => {
        this.AppObj = response["ReturnObject"];
        this.OfficeCode = this.AppObj.OriOfficeCode;

      }
    );
  }

}
