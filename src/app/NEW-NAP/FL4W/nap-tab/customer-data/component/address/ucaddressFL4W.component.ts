import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm, FormGroup, Validators, FormBuilder, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';

@Component({
  selector: 'app-cust-ucaddress-FL4W',
  templateUrl: './ucaddressFL4W.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustUcaddressFL4WComponent implements OnInit {

  @Input() UCAddrForm: FormGroup;
  @Input() enjiForm: NgForm;
  @Input() identifier: string;
  @Input() default: any;
  @Input() title = "Address Information";
  @Input() inputField: InputFieldObj = new InputFieldObj();
  @Input() showAllPhn: boolean = true;
  @Input() showPhn1: boolean = true;
  @Input() showPhn2: boolean = true;
  @Input() showPhn3: boolean = true;
  @Input() showFax: boolean = true;
  @Input() showOwnership: boolean = false;
  @Input() showSubsection: boolean = true;
  @Input() isRequired: boolean = true;

  houseOwnershipObj: Array<KeyValueObj>;
  inputLookupObj: InputLookupObj;
  identifierZipcode: string;

  constructor(private fb: FormBuilder, private http: HttpClient) {
  }
  ngOnInit() {

    this.identifierZipcode = this.identifier + "Zipcode";

    if (this.default == undefined) {
      this.default = new Array<string>();
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
        SubZipcode: ''
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
      Phn1: ['', [Validators.pattern("^[0-9]+$")]],
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
      SubZipcode: ['']
    }));

    if (this.inputField.inputLookupObj == undefined) {
      this.inputField.inputLookupObj = new InputLookupObj();
    }


    this.inputField.inputLookupObj.urlJson = "./assets/uclookup/zipcode/lookupZipcode.json";
    this.inputField.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputField.inputLookupObj.pagingJson = "./assets/uclookup/zipcode/lookupZipcode.json";
    this.inputField.inputLookupObj.genericJson = "./assets/uclookup/zipcode/lookupZipcode.json";
    this.inputField.inputLookupObj.isRequired = this.isRequired;

    if (this.showOwnership == true) {
      this.bindHouseOwnershipObj();
    }
  }

  getLookup(event) {
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

  bindHouseOwnershipObj() {
    var refMasterObj = { RefMasterTypeCode: "" };
    refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeBuildingOwnership;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.houseOwnershipObj = response[CommonConstant.ReturnObj];
        if (this.houseOwnershipObj.length > 0
          && (this.UCAddrForm.controls[this.identifier]["controls"]["MrHouseOwnershipCode"].value == ""
            || this.UCAddrForm.controls[this.identifier]["controls"]["MrHouseOwnershipCode"].value == undefined)) {
          this.UCAddrForm.controls[this.identifier].patchValue({
            MrHouseOwnershipCode: this.houseOwnershipObj[0].Key
          });
        }
      }
    );
  }
}
