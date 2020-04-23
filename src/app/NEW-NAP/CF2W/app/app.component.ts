import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.getRefMasterListKeyValueActiveByCodeUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.getListKvpActiveRefAppSrcUrl = AdInsConstant.GetListKvpActiveRefAppSrc;
    this.getListActiveRefPayFreqUrl = AdInsConstant.GetListActiveRefPayFreq;
  }
  titleFinancialData: string = "Financial Data" + "  Regular Fixed";
  appCustAddrObj: any;
  getCustAddr: string;
  getRefMasterListKeyValueActiveByCodeUrl: string;
  getListKvpActiveRefAppSrcUrl: string;
  getListActiveRefPayFreqUrl: string;
  ownerAddressObj: any;
  copyCustomerAddr: any;
  inputFieldOwnerAddressObj: any;
  inputLookupObj: any;
  tempMrSalesRecommendCode: any;
  tempMrAppSourceCode: any;
  tempPayFreqCode: any;
  tempMrFirstInstTypeCode: any;
  tempMrCustNotifyOptCode: any;
  tempMrWopCode : any;
  tempInterestType : any;
  tempMrAssetConditionCode : any;
  tempMrAssetUsageCode : any;
  tempMrUserRelationshipCode : any;
  tempMrOwnerRelationshipCode : any;
  appForm = this.fb.group({
    SalesOfficerNo: [''],
    SalesOfficerName: [''],
    SalesHeadNo: [''],
    SalesHeadName: [''],
    MrSalesRecommendCode: [''],
    SalesNotes: [''],
    MrAppSourceCode: [''],
    SrvyOrderNo: [''],
    Tenor: ["", [Validators.pattern("^[0-9]+$"), Validators.required]],
    MrFirstInstTypeCode: [''],
    PayFreqCode: [''],
    InterestType: [''],
    NumOfInst: [''],
    MrInstSchemeCode: [''],
    MrCustNotifyOptCode: [''],
    MrWopCode: [''],

    MrAssetConditionCode: [''],
    SerialNo1: [''],
    MrAssetUsageCode: [''],
    SerialNo2: [''],
    TaxCityIssuer: [''],
    SerialNo3: [''],
    TaxCityDt: [''],
    ManufacturingYear: ['',[Validators.pattern("^[0-9]+$")]],
    AssetTaxDt: [''],

    CopyAddrFrom: [''],
    UserName: [''],
    MrUserRelationshipCode: [''],
    OwnerName: [''],
    MrIdTypeCode: [''],
    MrOwnerRelationshipCode: [''],
    OwnerIdNo: [''],
    // OwnerAddr: [''],
    // OwnerAreaCode1: [''],
    // OwnerAreaCode2: [''],
    // OwnerAreaCode3: [''],
    // OwnerAreaCode4: [''],
    // OwnerCity: [''],
    // OwnerZipcode: [''],
    OwnerMobilePhnNo: [''],
    Notes: [''],


    //Inurance ...
    InsuranceCapitalizedAmount: [''],


  });
  ngOnInit() {

    
    this.inputFieldOwnerAddressObj = new InputFieldObj();
    this.inputFieldOwnerAddressObj.inputLookupObj = new InputLookupObj();

    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.nameSelect = this.appForm.controls.SalesOfficerName.value;


    //DDL Var Type Code
    var refMasterSalesRecommendation = new RefMasterObj();
    refMasterSalesRecommendation.RefMasterTypeCode = 'SLS_RECOM';
    var AppSourceObj = {
      RowVersion: ""
    };
    var PayFreqCodeObj = {
      RowVersion: ""
    };
    var refMasterFirstInstType = new RefMasterObj();
    refMasterFirstInstType.RefMasterTypeCode = AdInsConstant.RefMasterTypeCodeFirstInstType;
    var refMasterInterestType = new RefMasterObj();
    refMasterInterestType.RefMasterTypeCode = AdInsConstant.RefMasterTypeCodeInterestType;
    var refMasterCustNotifyOpt = new RefMasterObj();
    refMasterCustNotifyOpt.RefMasterTypeCode = AdInsConstant.RefMasterTypeCodeCustNotifyOpt;
    var refMasterWop =new RefMasterObj();
    refMasterWop.RefMasterTypeCode = AdInsConstant.RefMasterTypeCodeWOP;
    var refMasterCodeInterestType =new RefMasterObj();
    refMasterCodeInterestType.RefMasterTypeCode = AdInsConstant.RefMasterTypeCodeInterestType;
    var refMasterCodeAssetCondition =new RefMasterObj();
    refMasterCodeAssetCondition.RefMasterTypeCode = AdInsConstant.RefMasterTypeCodeAssetCondition;
    var refMasterCodeAssetUsage=new RefMasterObj();
    refMasterCodeAssetUsage.RefMasterTypeCode = AdInsConstant.RefMasterTypeCodeAssetUsage;
    var refMasterCodeCustPersonalRelationship=new RefMasterObj();
    refMasterCodeCustPersonalRelationship.RefMasterTypeCode = AdInsConstant.RefMasterTypeCodeCustPersonalRelationship;
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterSalesRecommendation).subscribe(
      (response) => {
        this.tempMrSalesRecommendCode = response["ReturnObject"];
        console.log(this.tempMrSalesRecommendCode);

        if (this.tempMrSalesRecommendCode.length > 0) {
          this.appForm.patchValue({
            MrSalesRecommendCode: this.tempMrSalesRecommendCode[0].Key
          });;
        }
      }
    );
    this.http.post(this.getListKvpActiveRefAppSrcUrl, AppSourceObj).subscribe(
      (response) => {
        this.tempMrAppSourceCode = response["ReturnObject"];
        if (this.tempMrAppSourceCode.length > 0) {
          this.appForm.patchValue({
            MrAppSourceCode: this.tempMrAppSourceCode[0].Key
          });;
        }
      }
    );
    this.http.post(this.getListActiveRefPayFreqUrl, PayFreqCodeObj).subscribe(
      (response) => {
        console.log(response);
        this.tempPayFreqCode = response["ReturnObject"];
        if (this.tempPayFreqCode.length > 0) {
          this.appForm.patchValue({
            PayFreqCode: this.tempPayFreqCode[0].PayFreqCode
          });;
        }
      }
    ); 
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterFirstInstType).subscribe(
      (response) => { 
        this.tempMrFirstInstTypeCode = response["ReturnObject"];
        console.log(this.tempMrFirstInstTypeCode);

        if (this.tempMrFirstInstTypeCode.length > 0) {
          this.appForm.patchValue({
            MrFirstInstTypeCode: this.tempMrFirstInstTypeCode[0].Key
          });;
        }
      }
    );

    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterFirstInstType).subscribe(
      (response) => { 
        this.tempMrFirstInstTypeCode = response["ReturnObject"];
        console.log(this.tempMrFirstInstTypeCode);

        if (this.tempMrFirstInstTypeCode.length > 0) {
          this.appForm.patchValue({
            MrFirstInstTypeCode: this.tempMrFirstInstTypeCode[0].Key
          });;
        }
      }
    );

    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCustNotifyOpt).subscribe(
      (response) => { 
        this.tempMrCustNotifyOptCode = response["ReturnObject"];
        console.log(this.tempMrCustNotifyOptCode);

        if (this.tempMrCustNotifyOptCode.length > 0) {
          this.appForm.patchValue({
            MrCustNotifyOptCode: this.tempMrCustNotifyOptCode[0].Key
          });;
        }
      }
    );

    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterWop).subscribe(
      (response) => { 
        this.tempMrWopCode = response["ReturnObject"];
        console.log(this.tempMrWopCode); 
        if (this.tempMrWopCode.length > 0) {
          this.appForm.patchValue({
          MrWopCode: this.tempMrWopCode[0].Key
          });;
        }
      }
    );
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCodeInterestType).subscribe(
      (response) => { 
        this.tempInterestType = response["ReturnObject"];
        console.log(this.tempInterestType); 
        if (this.tempInterestType.length > 0) {
          this.appForm.patchValue({
          InterestType: this.tempInterestType[0].Key
          });;
        }
      }
    ); 
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCodeAssetCondition).subscribe(
      (response) => { 
        this.tempMrAssetConditionCode = response["ReturnObject"];
         
        console.log(this.tempMrAssetConditionCode); 
        if (this.tempMrAssetConditionCode.length > 0) {
          this.appForm.patchValue({
            MrAssetConditionCode: this.tempMrAssetConditionCode[0].Key
          });;
        }
      }
    );
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCodeAssetUsage).subscribe(
      (response) => { 
        this.tempMrAssetUsageCode = response["ReturnObject"]; 
        if (this.tempMrAssetUsageCode.length > 0) {
          this.appForm.patchValue({
            MrAssetUsageCode: this.tempMrAssetUsageCode[0].Key
          });;
        }
      }
    );
 
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCodeCustPersonalRelationship).subscribe(
      (response) => {
        this.tempMrUserRelationshipCode = response["ReturnObject"];
        this.tempMrOwnerRelationshipCode = response["ReturnObject"];
        if (this.tempMrUserRelationshipCode.length > 0) {
          this.appForm.patchValue({
            MrUserRelationshipCode: this.tempMrUserRelationshipCode[0].Key,
            MrOwnerRelationshipCode: this.tempMrOwnerRelationshipCode[0].Key
          });
        }
      }
    );
    
  }
  copyAddress() {
    this.appCustAddrObj = new AppCustAddrObj();
    this.appCustAddrObj.CustAddrId = this.appForm.controls["CopyAddrFrom"].value;
    this.http.post(this.getCustAddr, this.appCustAddrObj).subscribe(
      (response) => {
        this.copyCustomerAddr = response;
        this.appForm.patchValue({
          Notes: this.copyCustomerAddr.Notes
        });
        this.ownerAddressObj = new AppCustAddrObj();
        this.ownerAddressObj.Addr = this.copyCustomerAddr.Addr;
        this.ownerAddressObj.AreaCode3 = this.copyCustomerAddr.AreaCode3;
        this.ownerAddressObj.AreaCode4 = this.copyCustomerAddr.AreaCode4;
        this.ownerAddressObj.AreaCode1 = this.copyCustomerAddr.AreaCode1;
        this.ownerAddressObj.AreaCode2 = this.copyCustomerAddr.AreaCode2;
        this.ownerAddressObj.City = this.copyCustomerAddr.City;
  

        this.inputFieldOwnerAddressObj = new InputFieldObj();
        this.inputFieldOwnerAddressObj.inputLookupObj = new InputLookupObj();
        this.inputFieldOwnerAddressObj.inputLookupObj.nameSelect = this.copyCustomerAddr.Zipcode;
        this.inputFieldOwnerAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.copyCustomerAddr.Zipcode };

      });
  }
  getLookupEmployeeResponse(ev) {
    console.log(ev);
    this.appForm.patchValue({
      SalesOfficerNo: ev.SalesOfficerNo,
      SalesOfficerName: ev.SalesOfficerName,
      SalesHeadNo: ev.SalesHeadNo,
      SalesHeadName: ev.SalesHeadName

    });
    console.log(this.appForm);
  }

  PayFreqVal;
  PayFreqTimeOfYear;
  ChangeNumOfInstallmentTenor() {
    console.log("Change Num from tenor");
    var temp = this.appForm.controls.Tenor.value;
    if (!isNaN(temp)) {
      if (this.PayFreqTimeOfYear == null && this.PayFreqVal == null) {
        this.PayFreqVal = this.tempPayFreqCode[0].PayFreqVal;
        this.PayFreqTimeOfYear = this.tempPayFreqCode[0].TimeOfYear;
      }
      var total = Math.floor((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
  }

  ChangeNumOfInstallmentPayFreq(ev) {
    console.log(ev);
    console.log("Change Num from pay freq");

    var idx = ev.target.selectedIndex;
    console.log(idx);
    var temp = this.appForm.controls.Tenor.value;
    if (!isNaN(temp)) {
      console.log("isNUM");
      this.PayFreqVal = this.tempPayFreqCode[idx].PayFreqVal;
      this.PayFreqTimeOfYear = this.tempPayFreqCode[idx].TimeOfYear;
      var total = Math.floor((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
  }
  PatchNumOfInstallment(num) {
    this.appForm.patchValue({
      NumOfInst: num
    });
  }
}
