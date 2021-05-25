import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { ResponseCustPersonalForCopyObj } from 'app/shared/model/ResponseCustPersonalForCopyObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { CustomPatternObj } from 'app/shared/model/CustomPatternObj.model';
import { RegexService } from 'app/shared/services/regex.services';
import { LtkmCustEmrgncCntctObj } from 'app/shared/model/LTKM/LtkmCustEmrgncCntctObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
@Component({
  selector: 'app-ltkm-emergency-contact',
  templateUrl: './emergency-contact.component.html',
  providers: [RegexService],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class LtkmEmergencyContactComponent implements OnInit {

    @Input() enjiForm: NgForm;
    @Input() parentForm: FormGroup;
    @Input() identifier: any;
    @Input() isLockMode: boolean = false;

    @Input() LtkmCustEmergencyContact = new LtkmCustEmrgncCntctObj();
    // @Input() appCustGrpObjs: Array<AttrCon

  @Input() AppCustId: number;
  @Input() LtkmCustId: number;

  @Input() IsMarried: boolean;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  isUcAddressReady: boolean;
  InputLookupCustObj: InputLookupObj = new InputLookupObj();
  InputUcAddressObj: InputAddressObj = new InputAddressObj();
  InputFieldUcAddressObj: InputFieldObj = new InputFieldObj();
  UcAddrObj: AddrObj = new AddrObj();
  IdTypeObj: Array<KeyValueObj> = new Array();
  GenderObj: Array<KeyValueObj> = new Array();
  MrCustRelationshipObj: Array<KeyValueObj> = new Array();
  ArrAddCrit: Array<CriteriaObj> = new Array();
  copyAddressFromObj: any;
  appCustEmrgncCntctObj: LtkmCustEmrgncCntctObj = new LtkmCustEmrgncCntctObj();
  BusinessDt: Date;
  
  resultLtkmCustEmergencyContact: any;

  EmergencyContactForm = this.fb.group({
    ContactPersonName: [''],
    ContactPersonCustNo: [''],
    MrIdTypeCode: [''],
    MrGenderCode: ['', Validators.required],
    IdNo: [''],
    BirthPlace: [''],
    IdExpiredDt: [''],
    BirthDt: ['', Validators.required],
    MrCustRelationshipCode: ['', Validators.required],
    MobilePhnNo1: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    MobilePhnNo2: ['', Validators.pattern("^[0-9]+$")],
    Email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
    CopyAddrFrom: ['']
  })

  constructor(
    private regexService: RegexService,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) {
  }

  ngOnInit() {

    if(this.isLockMode)
    {
        this.parentForm.addControl(this.identifier, this.fb.group({
            ContactPersonName: [''],
            ContactPersonCustNo: [''],
            MrIdTypeCode: [''],
            MrGenderCode: [''],
            IdNo: [''],
            BirthPlace: [''],
            IdExpiredDt: [''],
            BirthDt: [''],
            MrCustRelationshipCode: [''],
            MobilePhnNo1: [''],
            MobilePhnNo2: [''],
            Email: [''],
            CopyAddrFrom: ['']
          }));
    }else{
        this.parentForm.addControl(this.identifier, this.fb.group({
            ContactPersonName: [''],
            ContactPersonCustNo: [''],
            MrIdTypeCode: [''],
            MrGenderCode: ['', Validators.required],
            IdNo: [''],
            BirthPlace: [''],
            IdExpiredDt: [''],
            BirthDt: ['', Validators.required],
            MrCustRelationshipCode: ['', Validators.required],
            MobilePhnNo1: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
            MobilePhnNo2: ['', Validators.pattern("^[0-9]+$")],
            Email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
            CopyAddrFrom: ['']
          }));
    }

    this.customPattern = new Array<CustomPatternObj>();
    let UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.BusinessDt = UserAccess.BusinessDt;

    this.InputLookupCustObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupCustObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.addCritInput = new Array();
    this.InputLookupCustObj.isReadonly = false;
    if(this.isLockMode)
    {
        this.InputLookupCustObj.isRequired = false;
        this.InputLookupCustObj.isDisable = true;
    }else{
        this.InputLookupCustObj.isRequired = true;
        this.InputLookupCustObj.isDisable = false;
    }
    this.InputLookupCustObj.nameSelect = "";

    this.ArrAddCrit = new Array<CriteriaObj>();
    let critObj = new CriteriaObj();
    critObj.DataType = "text";
    critObj.propName = 'C.MR_CUST_TYPE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = CommonConstant.CustTypePersonal;
    this.ArrAddCrit.push(critObj);
    this.InputLookupCustObj.addCritInput = this.ArrAddCrit;
    this.InputLookupCustObj.isReady = true;

    this.InputUcAddressObj.inputField.inputLookupObj = new InputLookupObj();

    if(this.isLockMode)
    {
      this.InputUcAddressObj.inputField.inputLookupObj.isDisable = true;
      this.InputUcAddressObj.inputField.inputLookupObj.isRequired = false;
    }
    this.InputUcAddressObj.showSubsection = false;
    this.InputUcAddressObj.showFax = false;
    this.isUcAddressReady = true;

    if(this.isLockMode)
    {
        this.InputUcAddressObj.isRequired = false;
        this.InputUcAddressObj.isReadonly = true;
    }else{
        this.InputUcAddressObj.isRequired = true;
        this.InputUcAddressObj.isReadonly = false;
    }

    this.setDropdown();
    this.getData();
  }

  setDropdown() {
    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.RefMasterObjs];
        if (this.IdTypeObj.length > 0) {
          let idxDefault = this.IdTypeObj.findIndex(x => x["IsDefaultValue"]);
          this.parentForm.controls[this.identifier].patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"]
          });
          if(!this.isLockMode)
          {
            this.getInitPattern();
          }
          this.ChangeIdType(this.IdTypeObj[idxDefault]["MasterCode"]);
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender }).subscribe(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          this.parentForm.controls[this.identifier].patchValue({
            MrGenderCode: this.GenderObj[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship }).subscribe(
      async (response) => {
        this.MrCustRelationshipObj = response[CommonConstant.ReturnObj];
        if (!this.IsMarried) {
          await this.removeSpouse();
        }
        await this.parentForm.controls[this.identifier].patchValue({
          MrCustRelationshipCode: this.MrCustRelationshipObj[0].Key
        });
      }
    );

    if(this.LtkmCustId != undefined)
    {
    this.http.post(URLConstant.GetListLtkmCustAddrByLtkmCustId, { LtkmCustId: this.LtkmCustId }).subscribe(
      (response) => {
        this.copyAddressFromObj = response;
        this.parentForm.controls[this.identifier].patchValue({ CopyAddrFrom: response[0]['LtkmCustAddrId'] });
      });
    }
  }
getData() {
  // this.http.post(URLConstant.GetLtkmCustEmrgncCntctByLtkmCustId, {LtkmCustId: this.LtkmCustId}).subscribe(
  //   (response) => {
  //     this.resultLtkmCustEmergencyContact = response;
  if (this.LtkmCustEmergencyContact != undefined) {
    this.parentForm.controls[this.identifier].patchValue({
      MrIdTypeCode: this.LtkmCustEmergencyContact.MrIdTypeCode,
      MrGenderCode: this.LtkmCustEmergencyContact.MrGenderCode,
      IdNo: this.LtkmCustEmergencyContact.IdNo,
      BirthPlace: this.LtkmCustEmergencyContact.BirthPlace,
      IdExpiredDt: this.LtkmCustEmergencyContact.IdExpiredDt != null && this.LtkmCustEmergencyContact.IdExpiredDt != undefined ? formatDate(this.LtkmCustEmergencyContact.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
      BirthDt: this.LtkmCustEmergencyContact.BirthDt != null && this.LtkmCustEmergencyContact.BirthDt != undefined ? formatDate(this.LtkmCustEmergencyContact.BirthDt, 'yyyy-MM-dd', 'en-US') : "",
      MrCustRelationshipCode: this.LtkmCustEmergencyContact.MrCustRelationshipCode,
      MobilePhnNo1: this.LtkmCustEmergencyContact.MobilePhnNo1,
      MobilePhnNo2: this.LtkmCustEmergencyContact.MobilePhnNo2,
      Email: this.LtkmCustEmergencyContact.Email
    })
    // }        
    this.appCustEmrgncCntctObj['RowVersion'] = this.LtkmCustEmergencyContact["RowVersion"];
    this.InputLookupCustObj.nameSelect = this.LtkmCustEmergencyContact["ContactPersonName"];
    this.InputLookupCustObj.jsonSelect = {
      CustName: this.LtkmCustEmergencyContact["ContactPersonName"]
    };

    this.UcAddrObj.Addr = this.LtkmCustEmergencyContact["Addr"];
    this.UcAddrObj.AreaCode1 = this.LtkmCustEmergencyContact["AreaCode1"];
    this.UcAddrObj.AreaCode2 = this.LtkmCustEmergencyContact["AreaCode2"];
    this.UcAddrObj.AreaCode3 = this.LtkmCustEmergencyContact["AreaCode3"];
    this.UcAddrObj.AreaCode4 = this.LtkmCustEmergencyContact["AreaCode4"];
    this.UcAddrObj.City = this.LtkmCustEmergencyContact["City"];
    this.UcAddrObj.Fax = this.LtkmCustEmergencyContact["Fax"];
    this.UcAddrObj.FaxArea = this.LtkmCustEmergencyContact["FaxArea"];
    this.UcAddrObj.Phn1 = this.LtkmCustEmergencyContact["Phn1"];
    this.UcAddrObj.Phn2 = this.LtkmCustEmergencyContact["Phn2"];
    this.UcAddrObj.PhnArea1 = this.LtkmCustEmergencyContact["PhnArea1"];
    this.UcAddrObj.PhnArea2 = this.LtkmCustEmergencyContact["PhnArea2"];
    this.UcAddrObj.PhnExt1 = this.LtkmCustEmergencyContact["PhnExt1"];
    this.UcAddrObj.PhnExt2 = this.LtkmCustEmergencyContact["PhnExt2"];

    this.UcAddrObj.Phn3 = this.LtkmCustEmergencyContact["Phn3"];
    this.UcAddrObj.PhnArea3 = this.LtkmCustEmergencyContact["PhnArea3"];
    this.UcAddrObj.PhnExt3 = this.LtkmCustEmergencyContact["PhnExt3"];

    this.InputUcAddressObj.inputField.inputLookupObj.nameSelect = this.LtkmCustEmergencyContact["Zipcode"];
    this.InputUcAddressObj.inputField.inputLookupObj.jsonSelect = {
      Zipcode: this.LtkmCustEmergencyContact["Zipcode"]
    };
    this.InputUcAddressObj.default = this.UcAddrObj;
    // },
    // error => {
    //   console.log(error);
    // });
  }
}

  ChangeIdType(IdType: string){
    this.parentForm.controls[this.identifier]['controls']["IdExpiredDt"].patchValue("");

    if(!this.isLockMode)
    {
      if(IdType == "KITAS" || IdType == "SIM"){
        this.parentForm.controls[this.identifier]['controls']["IdExpiredDt"].setValidators([Validators.required]);
      }else{
        this.parentForm.controls[this.identifier]['controls']["IdExpiredDt"].clearValidators();
      }
    }

    this.parentForm.controls[this.identifier]['controls']["IdExpiredDt"].updateValueAndValidity();
    
    if(!this.isLockMode)
    {
      this.setValidatorPattern();
    }
  }

  removeSpouse() {
    let idxSpouse = this.MrCustRelationshipObj.findIndex(x => x.Key == CommonConstant.MasteCodeRelationshipSpouse);
    this.MrCustRelationshipObj.splice(idxSpouse, 1)
  }

  copyCustomerEvent(event) {
    this.http.post<ResponseCustPersonalForCopyObj>(URLConstant.GetCustPersonalForCopyByCustId, { CustId: event.CustId }).subscribe(
      (response) => {
        if (response.CustObj != undefined) {
          this.parentForm.controls[this.identifier].patchValue({
            ContactPersonName: response.CustObj.CustName,
            ContactPersonCustNo: response.CustObj.CustNo,
            MrCustTypeCode: response.CustObj.MrCustTypeCode,
            MrIdTypeCode: response.CustObj.MrIdTypeCode,
            IdNo: response.CustObj.IdNo,
            IdExpiredDt: response.CustObj.IdExpiredDt != null ? formatDate(response.CustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
          });
          this.InputLookupCustObj.nameSelect = response.CustObj.CustName;
          this.InputLookupCustObj.jsonSelect = { CustName: response.CustObj.CustName };
        }

        if (response.CustPersonalObj != undefined) {
          this.parentForm.controls[this.identifier].patchValue({
            MrGenderCode: response.CustPersonalObj.MrGenderCode,
            BirthPlace: response.CustPersonalObj.BirthPlace,
            BirthDt: response.CustPersonalObj.BirthDt != null ? formatDate(response.CustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US') : "",
            MobilePhnNo1: response.CustPersonalObj.MobilePhnNo1,
            MobilePhnNo2: response.CustPersonalObj.MobilePhnNo2,
            Email: response.CustPersonalObj.Email1,
          });
        }

        if (response.CustAddrLegalObj != undefined) {
          this.UcAddrObj.Addr = response.CustAddrLegalObj.Addr;
          this.UcAddrObj.AreaCode1 = response.CustAddrLegalObj.AreaCode1;
          this.UcAddrObj.AreaCode2 = response.CustAddrLegalObj.AreaCode2;
          this.UcAddrObj.AreaCode3 = response.CustAddrLegalObj.AreaCode3;
          this.UcAddrObj.AreaCode4 = response.CustAddrLegalObj.AreaCode4;
          this.UcAddrObj.City = response.CustAddrLegalObj.City;
          this.UcAddrObj.Phn1 = response.CustAddrLegalObj.Phn1;
          this.UcAddrObj.Phn2 = response.CustAddrLegalObj.Phn2;
          this.UcAddrObj.Phn3 = response.CustAddrLegalObj.Phn3;
          this.UcAddrObj.PhnArea1 = response.CustAddrLegalObj.PhnArea1;
          this.UcAddrObj.PhnArea2 = response.CustAddrLegalObj.PhnArea2;
          this.UcAddrObj.PhnArea3 = response.CustAddrLegalObj.PhnArea3;
          this.UcAddrObj.PhnExt1 = response.CustAddrLegalObj.PhnExt1;
          this.UcAddrObj.PhnExt2 = response.CustAddrLegalObj.PhnExt2;
          this.UcAddrObj.PhnExt3 = response.CustAddrLegalObj.PhnExt3;

          this.InputUcAddressObj.inputField.inputLookupObj.nameSelect = response.CustAddrLegalObj.Zipcode;
          this.InputUcAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.CustAddrLegalObj.Zipcode };
          this.InputUcAddressObj.default = this.UcAddrObj;
        }
      });
  }

  CopyAddress() {
    if (this.copyAddressFromObj.length < 1) {
      return
    }

    this.http.post(URLConstant.GetLtkmCustAddrByLtkmCustAddrId, { LtkmCustAddrId: this.parentForm.controls[this.identifier]['controls']["CopyAddrFrom"].value }).subscribe(
      (response) => {
        this.UcAddrObj.Addr = response["Addr"];
        this.UcAddrObj.AreaCode1 = response["AreaCode1"];
        this.UcAddrObj.AreaCode2 = response["AreaCode2"];
        this.UcAddrObj.AreaCode3 = response["AreaCode3"];
        this.UcAddrObj.AreaCode4 = response["AreaCode4"];
        this.UcAddrObj.City = response["City"];
        this.UcAddrObj.Phn1 = response["Phn1"];
        this.UcAddrObj.Phn2 = response["Phn2"];
        this.UcAddrObj.PhnArea1 = response["PhnArea1"];
        this.UcAddrObj.PhnArea2 = response["PhnArea2"];
        this.UcAddrObj.PhnExt1 = response["PhnExt1"];
        this.UcAddrObj.PhnExt2 = response["PhnExt2"];

        this.InputUcAddressObj.inputField.inputLookupObj.nameSelect = response["Zipcode"];
        this.InputUcAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response["Zipcode"] };
        this.InputUcAddressObj.default = this.UcAddrObj;
      });
  }

//   SaveForm() {
//     this.appCustEmrgncCntctObj.AppCustId = this.AppCustId;
//     this.appCustEmrgncCntctObj.ContactPersonName = this.EmergencyContactForm.value.lookupCustomer.value;
//     this.appCustEmrgncCntctObj.MrIdTypeCode = this.parentForm.controls[this.identifier]['controls']["MrIdTypeCode"].value;
//     this.appCustEmrgncCntctObj.MrGenderCode = this.parentForm.controls[this.identifier]['controls']["MrGenderCode"].value;
//     this.appCustEmrgncCntctObj.IdNo = this.parentForm.controls[this.identifier]['controls']["IdNo"].value;
//     this.appCustEmrgncCntctObj.BirthPlace = this.parentForm.controls[this.identifier]['controls']["BirthPlace"].value;
//     this.appCustEmrgncCntctObj.IdExpiredDt = this.parentForm.controls[this.identifier]['controls']["IdExpiredDt"].value;
//     this.appCustEmrgncCntctObj.BirthDt = this.parentForm.controls[this.identifier]['controls']["BirthDt"].value;
//     this.appCustEmrgncCntctObj.MrCustRelationshipCode = this.parentForm.controls[this.identifier]['controls']["MrCustRelationshipCode"].value;
//     this.appCustEmrgncCntctObj.MobilePhnNo1 = this.parentForm.controls[this.identifier]['controls']["MobilePhnNo1"].value;
//     this.appCustEmrgncCntctObj.MobilePhnNo2 = this.parentForm.controls[this.identifier]['controls']["MobilePhnNo2"].value;
//     this.appCustEmrgncCntctObj.Email = this.parentForm.controls[this.identifier]['controls']["Email"].value;
//     this.appCustEmrgncCntctObj.Addr = this.UcAddrObj.Addr;
//     this.appCustEmrgncCntctObj.AreaCode1 = this.UcAddrObj.AreaCode1;
//     this.appCustEmrgncCntctObj.AreaCode2 = this.UcAddrObj.AreaCode2;
//     this.appCustEmrgncCntctObj.AreaCode3 = this.UcAddrObj.AreaCode3;
//     this.appCustEmrgncCntctObj.AreaCode4 = this.UcAddrObj.AreaCode4;
//     this.appCustEmrgncCntctObj.City = this.UcAddrObj.City;
//     this.appCustEmrgncCntctObj.Phn1 = this.UcAddrObj.Phn1;
//     this.appCustEmrgncCntctObj.Phn2 = this.UcAddrObj.Phn2;
//     this.appCustEmrgncCntctObj.Phn3 = this.UcAddrObj.Phn3;
//     this.appCustEmrgncCntctObj.PhnArea1 = this.UcAddrObj.PhnArea1;
//     this.appCustEmrgncCntctObj.PhnArea2 = this.UcAddrObj.PhnArea2;
//     this.appCustEmrgncCntctObj.PhnArea3 = this.UcAddrObj.PhnArea3;
//     this.appCustEmrgncCntctObj.PhnExt1 = this.UcAddrObj.PhnExt1;
//     this.appCustEmrgncCntctObj.PhnExt2 = this.UcAddrObj.PhnExt2;
//     this.appCustEmrgncCntctObj.PhnExt3 = this.UcAddrObj.PhnExt3;
//     this.appCustEmrgncCntctObj.Zipcode = this.EmergencyContactForm.controls["AddressZipcode"]["controls"].value.value;
    
//     this.http.post(URLConstant.AddEditAppCustEmrgncCntct, this.appCustEmrgncCntctObj).subscribe(
//       (response) => {
//         this.toastr.successMessage(response["message"]);
//         this.OutputTab.emit({IsComplete: true});
//       },
//       error => {
//         console.log(error);
//       });
//   }

  //START URS-LOS-041
  controlNameIdNo: any = 'IdNo';
  controlNameIdType: any = 'MrIdTypeCode';
  customPattern: Array<CustomPatternObj>;
  initIdTypeCode: any;
  resultPattern: any;

  getInitPattern() {
    this.regexService.getListPattern().subscribe(
      response => {
        this.resultPattern = response[CommonConstant.ReturnObj];
        if(this.resultPattern != undefined)
        {
          for (let i = 0; i < this.resultPattern.length; i++) {
            let patternObj: CustomPatternObj = new CustomPatternObj();
            let pattern: string = this.resultPattern[i].Value;
    
            patternObj.pattern = pattern;
            patternObj.invalidMsg = this.regexService.getErrMessage(pattern);
            this.customPattern.push(patternObj);
          }
          this.setValidatorPattern();
        }
      }
    );
  }
  setValidatorPattern() {
    let idTypeValue: string;
    idTypeValue = this.parentForm.controls[this.identifier]['controls'][this.controlNameIdType].value;
    var pattern: string = '';
    if (idTypeValue != undefined) {
      if (this.resultPattern != undefined) {
        var result = this.resultPattern.find(x => x.Key == idTypeValue)
        if (result != undefined) {
          pattern = result.Value;
        }
      }
    }
    this.setValidator(pattern);
  }
  setValidator(pattern: string) {
    if (pattern != undefined) {
        this.parentForm.controls[this.identifier]['controls'][this.controlNameIdNo].setValidators(Validators.pattern(pattern));
        this.parentForm.controls[this.identifier]['controls'][this.controlNameIdNo].updateValueAndValidity();
    }
  }
  //END OF URS-LOS-041
}
