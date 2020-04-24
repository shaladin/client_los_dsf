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
  titleFinancialData : string = "Financial Data" + "  Regular Fixed";
  appCustAddrObj : any;
  getCustAddr : string;
  getRefMasterListKeyValueActiveByCodeUrl : string;
  getListKvpActiveRefAppSrcUrl : string;
  getListActiveRefPayFreqUrl : string;
  addressObj : any;
  copyCustomerAddr : any;
  inputFieldAddressObj : any;
  inputLookupObj : any;
  tempMrSalesRecommendCode : any;
  tempMrAppSourceCode : any;
  tempPayFreqCode : any;
  appForm = this.fb.group({
    SalesOfficerNo: [''],
    SalesOfficerName:[''],
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
    ManufacturingYear: [''],
    AssetTaxDt:  [''],

    CopyAddrFrom:[''],

    //Inurance ...
    InsuranceCapitalizedAmount:[''],
     
    
  });
  ngOnInit() {
    this.inputFieldAddressObj = new InputFieldObj();
    this.inputFieldAddressObj.inputLookupObj = new InputLookupObj();
    
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
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterSalesRecommendation).subscribe(
      (response) => {
        this.tempMrSalesRecommendCode = response["ReturnObject"];
        console.log(this.tempMrSalesRecommendCode);
      
        if(this.tempMrSalesRecommendCode.length > 0){
          this.appForm.patchValue({
            MrSalesRecommendCode: this.tempMrSalesRecommendCode[0].Key
          });;
        }
      }
    );
    this.http.post(this.getListKvpActiveRefAppSrcUrl, AppSourceObj).subscribe(
      (response) => {
        this.tempMrAppSourceCode = response["ReturnObject"]; 
        if(this.tempMrAppSourceCode.length > 0){
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
        if(this.tempPayFreqCode.length > 0){
          this.appForm.patchValue({
            PayFreqCode: this.tempPayFreqCode[0].PayFreqCode
          });;
        }
      }
    );








  }
  copyAddress(){
    this.appCustAddrObj = new AppCustAddrObj();
    this.appCustAddrObj.CustAddrId = this.appForm.controls["CopyAddrFrom"].value;
    this.http.post(this.getCustAddr, this.appCustAddrObj).subscribe(
      (response) => {
          this.copyCustomerAddr = response;
          this.appForm.patchValue({
              Notes: this.copyCustomerAddr.Notes
          }); 
          this.addressObj = new AppCustAddrObj();
          this.addressObj.Addr = this.copyCustomerAddr.Addr;
          this.addressObj.AreaCode3 = this.copyCustomerAddr.AreaCode3;
          this.addressObj.AreaCode4 = this.copyCustomerAddr.AreaCode4;
          this.addressObj.AreaCode1 = this.copyCustomerAddr.AreaCode1;
          this.addressObj.AreaCode2 = this.copyCustomerAddr.AreaCode2;
          this.addressObj.City = this.copyCustomerAddr.City;
          this.addressObj.PhnArea1 = this.copyCustomerAddr.PhnArea1;
          this.addressObj.Phn1 = this.copyCustomerAddr.Phn1;
          this.addressObj.PhnExt1 = this.copyCustomerAddr.PhnExt1;
          this.addressObj.PhnArea2 = this.copyCustomerAddr.PhnArea2;
          this.addressObj.Phn2 = this.copyCustomerAddr.Phn2;
          this.addressObj.PhnExt2 = this.copyCustomerAddr.PhnExt2;
          this.addressObj.PhnArea3 = this.copyCustomerAddr.PhnArea3;
          this.addressObj.Phn3 = this.copyCustomerAddr.Phn3;
          this.addressObj.PhnExt3 = this.copyCustomerAddr.PhnExt3;
          this.addressObj.FaxArea = this.copyCustomerAddr.FaxArea;
          this.addressObj.Fax = this.copyCustomerAddr.Fax;
          this.addressObj.MrHouseOwnershipCode = this.copyCustomerAddr.MrBuildingOwnershipCode;

          this.inputFieldAddressObj = new InputFieldObj();
          this.inputFieldAddressObj.inputLookupObj = new InputLookupObj();
          this.inputFieldAddressObj.inputLookupObj.nameSelect = this.copyCustomerAddr.Zipcode;
          this.inputFieldAddressObj.inputLookupObj.jsonSelect = {Zipcode: this.copyCustomerAddr.Zipcode};
          
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

}
