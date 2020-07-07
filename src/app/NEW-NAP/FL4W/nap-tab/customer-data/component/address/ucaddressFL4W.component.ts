import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm, FormGroup, Validators, FormBuilder, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';

@Component({
  selector: 'app-cust-ucaddress-FL4W',
  templateUrl: './ucaddressFL4W.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustUcaddressFL4WComponent implements OnInit {

  @Input() UCAddrForm: FormGroup;
  @Input() enjiForm: NgForm;  
  @Input() identifier: any;
  @Input() default: any;
  @Input() title = "Address Information";
  @Input() inputField: any = new InputFieldObj();
  @Input() showAllPhn: boolean = true;
  @Input() showPhn1: boolean = true;
  @Input() showPhn2: boolean = true;
  @Input() showPhn3: boolean = true;
  @Input() showFax: boolean = true;
  @Input() showOwnership: boolean = false;
  @Input() showSubsection: boolean = true;
  @Input() isRequired: boolean = true;

  houseOwnershipObj: any;
  inputLookupObj: any;
  identifierZipcode: any;
  
  constructor(private fb: FormBuilder, private http: HttpClient) {
  }
  ngOnInit() { 
    console.log("UcAddressForm");

    this.identifierZipcode = this.identifier + "Zipcode";

    if(this.default == undefined){
      this.default = new Array();
      this.default = {
        Addr: '',
        AreaCode4: '',
        AreaCode3: '',
        AreaCode2: '',
        AreaCode1: '',
        City: '',
        PhnArea1: '',
        Phn1: '',
        PhnExt1: '',
        PhnArea2: '',
        Phn2: '',
        PhnExt2: '',
        PhnArea3: '',
        Phn3: '',
        PhnExt3: '',
        FaxArea: '',
        Fax: '',
        MrHouseOwnershipCode: '',
        SubZipcode:''
      };
    }
    this.UCAddrForm.addControl(this.identifier, this.fb.group({
      Addr: [''],
      AreaCode4: ['', [Validators.pattern("^[0-9]+$"), Validators.maxLength(3)]],
      AreaCode3: ['', [Validators.pattern("^[0-9]+$"), Validators.maxLength(3)]],
      AreaCode2: [''],
      AreaCode1: [''],
      City: [''],
      PhnArea1: ['', [Validators.pattern("^[0-9]+$")]],
      Phn1: ['', [ Validators.pattern("^[0-9]+$")]],
      PhnExt1: ['', Validators.pattern("^[0-9]+$")],
      PhnArea2: ['', Validators.pattern("^[0-9]+$")],
      Phn2: ['', Validators.pattern("^[0-9]+$")],
      PhnExt2: ['', Validators.pattern("^[0-9]+$")],
      PhnArea3: ['', Validators.pattern("^[0-9]+$")],
      Phn3: ['', Validators.pattern("^[0-9]+$")],
      PhnExt3: ['', Validators.pattern("^[0-9]+$")],
      FaxArea: ['', Validators.pattern("^[0-9]+$")],
      Fax: ['', Validators.pattern("^[0-9]+$")],
      MrHouseOwnershipCode: [''],
      SubZipcode:['']
    }));

    if(this.inputField.inputLookupObj == undefined){
      this.inputField.inputLookupObj = new InputLookupObj();
    }

    
    this.inputField.inputLookupObj.urlJson = "./assets/uclookup/zipcode/lookupZipcode.json";
    this.inputField.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputField.inputLookupObj.urlEnviPaging = "http://r3app-server.ad-ins.com/FOUNDATION_R3";
    this.inputField.inputLookupObj.pagingJson = "./assets/uclookup/zipcode/lookupZipcode.json";
    this.inputField.inputLookupObj.genericJson = "./assets/uclookup/zipcode/lookupZipcode.json";
    this.inputField.inputLookupObj.isRequired = this.isRequired;

    if(this.showOwnership == true){
      this.bindHouseOwnershipObj();
    }
  }

  getLookup(event) {
    console.log(event);
    this.UCAddrForm.controls[this.identifier].patchValue(
      {
        AreaCode2: event.AreaCode2,
        AreaCode1: event.AreaCode1,
        PhnArea1: event.PhnArea,
        City: event.City,
        SubZipcode: event.SubZipcode
      });
      this.inputField.inputLookupObj.nameSelect = event.Zipcode;
      this.inputField.inputLookupObj.idSelect = event.Zipcode;
  }

  bindHouseOwnershipObj(){
    var refMasterObj = {RefMasterTypeCode: ""};
    refMasterObj.RefMasterTypeCode = AdInsConstant.RefMasterTypeCodeBuildingOwnership;
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.houseOwnershipObj = response["ReturnObject"];
        if(this.houseOwnershipObj.length > 0 
          && (this.UCAddrForm.controls[this.identifier]["controls"]["MrHouseOwnershipCode"].value == ""
              || this.UCAddrForm.controls[this.identifier]["controls"]["MrHouseOwnershipCode"].value == undefined)){
          this.UCAddrForm.controls[this.identifier].patchValue({
            MrHouseOwnershipCode: this.houseOwnershipObj[0].Key
          });
        }
      }
    );
  }
}
