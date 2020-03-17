import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataPersonalObj } from 'app/shared/model/CustDataPersonalObj.Model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-asset-data',
  templateUrl: './asset-data.component.html',
})

export class AssetDataComponent implements OnInit {


  AssetDataForm = this.fb.group({
    FullAssetCode: ['', [Validators.required, Validators.maxLength(50)]],
    FullAssetName: ['', [Validators.required, Validators.maxLength(500)]],
    MrAssetConditionCode: ['', [Validators.required, Validators.maxLength(50)]],
    ManufacturingYear: ['', [Validators.required, Validators.maxLength(50)]],
    SerialNo1: ['', [Validators.required, Validators.maxLength(50)]],
    SerialNo2: ['', [Validators.required, Validators.maxLength(500)]],
    SerialNo3: [''],
    Color: ['', Validators.maxLength(50)],
    AssetNotes: ['', [Validators.required, Validators.maxLength(100)]],
    AssetPriceAmt: ['', Validators.required],
    DownPaymentAmt: ['', Validators.maxLength(50)],
    MrAssetUsageCode: ['', Validators.maxLength(50)],
    TaxCityIssuer: ['', [Validators.required, Validators.maxLength(50)]],
    TaxIssueDt: ['', Validators.maxLength(50)],

    SupplName: ['', Validators.maxLength(50)],
    SupplCode: ['', Validators.maxLength(50)],
    AdminHead: ['', Validators.maxLength(50)],
    SalesPerson: ['', Validators.maxLength(100)],
    BranchManager: ['', Validators.maxLength(50)],

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

  appId: any;

  refMasterObj = {
    RefMasterTypeCode: "",
  };
  countryObj = {
    CountryCode: ""
  };
  selectedCustNo: any;
  selectedNationalityCountryCode: any;
  custDataObj: CustDataObj;
  custDataPersonalObj: CustDataPersonalObj;

  InputLookupCustomerObj: any;
  InputLookupCountryObj: any;
  CustTypeObj: any;
  IdTypeObj: any;
  GenderObj: any;
  MaritalStatObj: any;
  NationalityObj: any;
  EducationObj: any;
  ReligionObj: any;

  getRefMasterUrl: any;
  addEditCustDataPersonalUrl: any;
  getCustDataUrl: any;


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
    //this.initUrl();
    //this.initLookup();
    //this.bindAllRefMasterObj();
    //this.getCustData();
  }

  //SaveForm() {
  //  if (this.CustDataForm.controls.FullAssetCode.value == "PERSONAL") {
  //    this.custDataPersonalObj = new CustDataPersonalObj();
  //    this.setCustPersonalObj();
  //    this.http.post(this.addEditCustDataPersonalUrl, this.custDataPersonalObj).subscribe(
  //      (response) => {
  //        console.log(response);
  //        this.toastr.successMessage(response["message"]);
  //      },
  //      (error) => {
  //        console.log(error);
  //      }
  //    );
  //  }
  //}

  setCustPersonalObj() {
    //this.custDataPersonalObj.AppCustObj.FullAssetCode = this.CustDataForm.controls.FullAssetCode.value;
    //this.custDataPersonalObj.AppCustObj.CustName = this.InputLookupCustomerObj.nameSelect;
    //this.custDataPersonalObj.AppCustObj.CustNo = this.selectedCustNo;
    //this.custDataPersonalObj.AppCustObj.MrAssetConditionCode = this.CustDataForm.controls.MrAssetConditionCode.value;
    //this.custDataPersonalObj.AppCustObj.SerialNo1 = this.CustDataForm.controls.SerialNo1.value;
    //this.custDataPersonalObj.AppCustObj.SerialNo3 = this.CustDataForm.controls.SerialNo3.value;
    //this.custDataPersonalObj.AppCustObj.MrAssetUsageCode = this.CustDataForm.controls.MrAssetUsageCode.value;
    //this.custDataPersonalObj.AppCustObj.IsVip = this.CustDataForm.controls.IsVip.value;
    //this.custDataPersonalObj.AppCustObj.CustModelCode = "PROF";
    //this.custDataPersonalObj.AppCustObj.AppId = 11;

    //this.custDataPersonalObj.AppCustPersonalObj.FullAssetName = this.CustDataForm.controls.FullAssetName.value;
    //this.custDataPersonalObj.AppCustPersonalObj.ManufacturingYear = this.CustDataForm.controls.ManufacturingYear.value;
    //this.custDataPersonalObj.AppCustPersonalObj.SerialNo2 = this.CustDataForm.controls.SerialNo2.value;
    //this.custDataPersonalObj.AppCustPersonalObj.Color = this.CustDataForm.controls.Color.value;
    //this.custDataPersonalObj.AppCustPersonalObj.AssetNotes = this.CustDataForm.controls.AssetNotes.value;
    //this.custDataPersonalObj.AppCustPersonalObj.AssetPriceAmt = this.CustDataForm.controls.AssetPriceAmt.value;
    //this.custDataPersonalObj.AppCustPersonalObj.DownPaymentAmt = this.CustDataForm.controls.DownPaymentAmt.value;
    //this.custDataPersonalObj.AppCustPersonalObj.NationalityCountryCode = this.selectedNationalityCountryCode;
    //this.custDataPersonalObj.AppCustPersonalObj.TaxCityIssuer = this.CustDataForm.controls.TaxCityIssuer.value;
    //this.custDataPersonalObj.AppCustPersonalObj.SupplName = this.CustDataForm.controls.SupplName.value;
    //this.custDataPersonalObj.AppCustPersonalObj.AdminHead = this.CustDataForm.controls.AdminHead.value;
    //this.custDataPersonalObj.AppCustPersonalObj.TaxIssueDt = this.CustDataForm.controls.TaxIssueDt.value;
    //this.custDataPersonalObj.AppCustPersonalObj.SupplCode = this.CustDataForm.controls.SupplCode.value;
    //this.custDataPersonalObj.AppCustPersonalObj.SalesPerson = this.CustDataForm.controls.SalesPerson.value;
    //this.custDataPersonalObj.AppCustPersonalObj.Email2 = this.CustDataForm.controls.Email2.value;
    //this.custDataPersonalObj.AppCustPersonalObj.Email3 = this.CustDataForm.controls.Email3.value;
    //this.custDataPersonalObj.AppCustPersonalObj.BranchManager = this.CustDataForm.controls.BranchManager.value;
    //this.custDataPersonalObj.AppCustPersonalObj.NoOfResidence = this.CustDataForm.controls.NoOfResidence.value;
    //this.custDataPersonalObj.AppCustPersonalObj.NoOfDependents = this.CustDataForm.controls.NoOfDependents.value;
  }

  CopyCustomer(event) {
    this.selectedCustNo = event.CustNo;
    this.InputLookupCustomerObj.isReadonly = true;
  }


  GetCountry(event) {
    this.selectedNationalityCountryCode = event.CountryCode;
  }

  CustTypeChanged(event) {
    this.setCriteriaLookupCustomer(event.value);
  }

  setCriteriaLookupCustomer(custTypeCode) {
    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MR_CUST_TYPE_CODE';
    critObj.value = custTypeCode;
    arrCrit.push(critObj);
    this.InputLookupCustomerObj.addCritInput = arrCrit;
  }



  //getCustData() {
  //  this.custDataObj = new CustDataObj();
  //  this.custDataObj.AppId = this.appId;
  //  console.log(this.custDataObj);
  //  this.http.post(this.getCustDataUrl, this.custDataObj).subscribe(
  //    (response) => {
  //      console.log(response);
  //      var appCustObj = response["AppCustObj"];
  //      var appCustPersonalObj = response["AppCustPersonalObj"];
  //      this.CustDataForm.patchValue({
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
  //      this.InputLookupCustomerObj.nameSelect = appCustObj.CustName;
  //      this.selectedCustNo = appCustObj.CustNo;
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
    this.addEditCustDataPersonalUrl = AdInsConstant.AddEditCustDataPersonal;
    this.getCustDataUrl = AdInsConstant.GetCustDataByAppId;
  }

  initLookup() {
    this.InputLookupCustomerObj = new InputLookupObj();
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.isReadonly = false;

    this.InputLookupCountryObj = new InputLookupObj();
    this.InputLookupCountryObj.urlJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCountryObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCountryObj.pagingJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.genericJson = "./assets/uclookup/lookupCountry.json";

  }

  //bindAllRefMasterObj() {
  //  this.bindCustTypeObj();
  //  this.bindIdTypeObj();
  //  this.bindGenderObj();
  //  this.bindMaritalStatObj();
  //  this.bindNationalityObj();
  //  this.bindEducationObj();
  //  this.bindReligionObj();
  //}

  //bindCustTypeObj() {
  //  this.refMasterObj.RefMasterTypeCode = "CUST_TYPE";
  //  this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //    (response) => {
  //      this.CustTypeObj = response["ReturnObject"];
  //      if (this.CustTypeObj.length > 0) {
  //        this.CustDataForm.patchValue({
  //          FullAssetCode: this.CustTypeObj[0].Key
  //        });
  //        this.setCriteriaLookupCustomer(this.CustTypeObj[0].Key);
  //      }
  //    }
  //  );
  //}

  //bindIdTypeObj() {
  //  this.refMasterObj.RefMasterTypeCode = "ID_TYPE";
  //  this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //    (response) => {
  //      this.IdTypeObj = response["ReturnObject"];
  //      if (this.IdTypeObj.length > 0) {
  //        this.CustDataForm.patchValue({
  //          MrAssetConditionCode: this.IdTypeObj[0].Key
  //        });
  //      }
  //    }
  //  );
  //}

  //bindGenderObj() {
  //  this.refMasterObj.RefMasterTypeCode = "GENDER";
  //  this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //    (response) => {
  //      this.GenderObj = response["ReturnObject"];
  //      if (this.GenderObj.length > 0) {
  //        this.CustDataForm.patchValue({
  //          ManufacturingYear: this.GenderObj[0].Key
  //        });
  //      }
  //    }
  //  );
  //}

  //bindMaritalStatObj() {
  //  this.refMasterObj.RefMasterTypeCode = "MARITAL_STAT";
  //  this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //    (response) => {
  //      this.MaritalStatObj = response["ReturnObject"];
  //      if (this.MaritalStatObj.length > 0) {
  //        this.CustDataForm.patchValue({
  //          Color: this.MaritalStatObj[0].Key
  //        });
  //      }
  //    }
  //  );
  //}

  //bindNationalityObj() {
  //  this.refMasterObj.RefMasterTypeCode = "NATIONALITY";
  //  this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //    (response) => {
  //      this.NationalityObj = response["ReturnObject"];
  //      if (this.NationalityObj.length > 0) {
  //        this.CustDataForm.patchValue({
  //          DownPaymentAmt: this.NationalityObj[0].Key
  //        });
  //      }
  //    }
  //  );
  //}

  //bindEducationObj() {
  //  this.refMasterObj.RefMasterTypeCode = "EDUCATION";
  //  this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //    (response) => {
  //      this.EducationObj = response["ReturnObject"];
  //      if (this.EducationObj.length > 0) {
  //        this.CustDataForm.patchValue({
  //          TaxIssueDt: this.EducationObj[0].Key
  //        });
  //      }
  //    }
  //  );
  //}

  //bindReligionObj() {
  //  this.refMasterObj.RefMasterTypeCode = "RELIGION";
  //  this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //    (response) => {
  //      this.ReligionObj = response["ReturnObject"];
  //      if (this.ReligionObj.length > 0) {
  //        this.CustDataForm.patchValue({
  //          SupplCode: this.ReligionObj[0].Key
  //        });
  //      }
  //    }
  //  );
  //}

}
