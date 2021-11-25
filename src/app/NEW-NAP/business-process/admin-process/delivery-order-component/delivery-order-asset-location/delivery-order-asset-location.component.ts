import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';

@Component({
  selector: 'app-delivery-order-asset-location',
  templateUrl: './delivery-order-asset-location.component.html',
  styleUrls: []
})
export class DeliveryOrderAssetLocationComponent implements OnInit {
  @Input() AppCustAddrObj: Array<AppCustAddrObj>;
  @Input() AppCollateralRegistrationObj: any;
  @Input() identifier: string;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  copyFromAppCustAddrForLocation: any;
  AddrObj: Array<AppCustAddrObj> = new Array();
  locationAddrObj: AddrObj;
  inputFieldLocationAddrObj: InputFieldObj;
  inputAddressObjForLoc: InputAddressObj;

  ngOnInit() {
    this.parentForm.addControl(this.identifier, this.fb.group({ 
      LocationAddr: [''],
      LocationAreaCode1: ['', Validators.maxLength(50)],
      LocationAreaCode2: ['', Validators.maxLength(50)],
      LocationAreaCode3: ['', Validators.maxLength(50)],
      LocationAreaCode4: ['', Validators.maxLength(50)],
      LocationCity: ['', Validators.maxLength(50)],
      LocationZipcode: ['', Validators.maxLength(50)],
      LocationAddrType: ['']
    }));

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;
    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
    
    this.setAssetLocationData();
  }

  setAssetLocationData() {
    this.parentForm.controls.AssetLocation.patchValue({
      LocationAddr: this.AppCollateralRegistrationObj.LocationAddr,
      LocationAreaCode1: this.AppCollateralRegistrationObj.LocationAreaCode1,
      LocationAreaCode2: this.AppCollateralRegistrationObj.LocationAreaCode2,
      LocationAreaCode3: this.AppCollateralRegistrationObj.LocationAreaCode3,
      LocationAreaCode4: this.AppCollateralRegistrationObj.LocationAreaCode4,
      LocationCity: this.AppCollateralRegistrationObj.LocationCity,
      LocationZipcode: this.AppCollateralRegistrationObj.LocationZipcode,
    });
    this.locationAddrObj = new AddrObj();
    this.locationAddrObj.Addr = this.AppCollateralRegistrationObj.LocationAddr;
    this.locationAddrObj.AreaCode1 = this.AppCollateralRegistrationObj.LocationAreaCode1;
    this.locationAddrObj.AreaCode2 = this.AppCollateralRegistrationObj.LocationAreaCode2;
    this.locationAddrObj.AreaCode3 = this.AppCollateralRegistrationObj.LocationAreaCode3;
    this.locationAddrObj.AreaCode4 = this.AppCollateralRegistrationObj.LocationAreaCode4;
    this.locationAddrObj.City = this.AppCollateralRegistrationObj.LocationCity;

    this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.parentForm.controls.AssetLocation["controls"].LocationZipcode.value;
    this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.parentForm.controls.AssetLocation["controls"].LocationZipcode.value };

    this.inputAddressObjForLoc.default = this.locationAddrObj;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
  }

  SetLocationAddrType(event) {
    this.copyFromAppCustAddrForLocation = event;
  }


  copyToLocationAddr() {
    if (this.copyFromAppCustAddrForLocation != "") {
      this.AddrObj = this.AppCustAddrObj.filter(
        emp => emp.MrCustAddrTypeCode === this.copyFromAppCustAddrForLocation);

      this.parentForm.controls.AssetLocation.patchValue({
        LocationAddr: this.AddrObj[0].Addr,
        LocationAreaCode1: this.AddrObj[0].AreaCode1,
        LocationAreaCode2: this.AddrObj[0].AreaCode2,
        LocationAreaCode3: this.AddrObj[0].AreaCode3,
        LocationAreaCode4: this.AddrObj[0].AreaCode4,
        LocationCity: this.AddrObj[0].City,
        LocationZipcode: this.AddrObj[0].Zipcode
      });
      this.locationAddrObj = new AddrObj();
      this.locationAddrObj.Addr = this.AddrObj[0].Addr;
      this.locationAddrObj.AreaCode1 = this.AddrObj[0].AreaCode1;
      this.locationAddrObj.AreaCode2 = this.AddrObj[0].AreaCode2;
      this.locationAddrObj.AreaCode3 = this.AddrObj[0].AreaCode3;
      this.locationAddrObj.AreaCode4 = this.AddrObj[0].AreaCode4;
      this.locationAddrObj.City = this.AddrObj[0].City;

      this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.parentForm.controls.AssetLocation["controls"].LocationZipcode.value;
      this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.parentForm.controls.AssetLocation["controls"].LocationZipcode.value };

      this.inputAddressObjForLoc.default = this.locationAddrObj;
      this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
    }
  }

}
