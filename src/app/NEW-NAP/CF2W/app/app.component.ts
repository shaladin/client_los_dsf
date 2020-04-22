import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient, private fb: FormBuilder) { }
  titleFinancialData : string = "Financial Data" + "  Regular Fixed";
  appCustAddrObj : any;
  getCustAddr : string;
  addressObj : any;
  copyCustomerAddr : any;
  inputFieldAddressObj : any;
  appForm = this.fb.group({
    SalesOfficerNo: [''],
    SalesHeadNo: [''],
    MrSalesRecommendCode: [''],
    SalesNotes: [''],
    MrAppSourceCode: [''],
    SrvyOrderNo: [''],
    Tenor: [''],
    MrFirstInstTypeCode: [''],
    PayFreqCode: [''],
    // interest type
    NumOfInst: [''],
    //Installment Scheme
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
    console.log(this.titleFinancialData);
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

}
