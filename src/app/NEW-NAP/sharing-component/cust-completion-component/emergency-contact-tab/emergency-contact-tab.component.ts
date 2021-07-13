import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustEmrgncCntctObj } from 'app/shared/model/AppCustEmrgncCntctObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ResponseCustPersonalForCopyObj } from 'app/shared/model/ResponseCustPersonalForCopyObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { CustomPatternObj } from 'app/shared/model/CustomPatternObj.model';
import { RegexService } from 'app/shared/services/regex.services';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-emergency-contact-tab',
  templateUrl: './emergency-contact-tab.component.html',
  styleUrls: ['./emergency-contact-tab.component.scss'],
  providers: [RegexService]
})
export class EmergencyContactTabComponent implements OnInit {

  @Input() AppCustId: number;
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
  appCustEmrgncCntctObj: AppCustEmrgncCntctObj = new AppCustEmrgncCntctObj();
  BusinessDt: Date;
  MaxDate: Date;
  IsCustRelationshipReady: boolean = false;
  IsGenderReady: boolean = false;
  IsIdTypeReady: boolean = false;


  EmergencyContactForm = this.fb.group({
    ContactPersonName: [''],
    ContactPersonCustNo: [''],
    MrIdTypeCode: [''],
    MrGenderCode: [''],
    IdNo: [''],
    BirthPlace: [''],
    IdExpiredDt: [''],
    BirthDt: [''],
    MrCustRelationshipCode: [''],
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
    public formValidate: FormValidateService, private cookieService: CookieService) {
  }

  async ngOnInit() {
    this.customPattern = new Array<CustomPatternObj>();
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.BusinessDt = UserAccess.BusinessDt;
    this.MaxDate = UserAccess.BusinessDt;

    this.InputLookupCustObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.addCritInput = new Array();
    this.InputLookupCustObj.isReadonly = false;
    this.InputLookupCustObj.isRequired = true;
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
    this.InputUcAddressObj.inputField.inputLookupObj.isRequired = false;
    this.InputUcAddressObj.showSubsection = false;
    this.InputUcAddressObj.showFax = false;
    this.InputUcAddressObj.isRequired = false;
    this.isUcAddressReady = true;

    await this.setDropdown();
    await this.getData();
  }

  async setDropdown() {
    await this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { Code: CommonConstant.RefMasterTypeCodeIdType }).toPromise().then(
      (response) => {
        this.IdTypeObj = response[CommonConstant.RefMasterObjs];
        if (this.IdTypeObj.length > 0) {
          let idxDefault = this.IdTypeObj.findIndex(x => x["IsDefaultValue"]);
          this.getInitPattern();
          this.ChangeIdType(this.IdTypeObj[idxDefault]["MasterCode"]);
        }
      });

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender }).toPromise().then(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
      });

    let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
    tempReq.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, tempReq).toPromise().then(
      async (response) => {
        this.MrCustRelationshipObj = response[CommonConstant.ReturnObj];
        if (!this.IsMarried) {
          await this.removeSpouse();
        }
      }
    );

    await this.http.post(URLConstant.GetListAppCustAddrDataForCopyByAppCustId, { Id: this.AppCustId }).toPromise().then(
      (response) => {
        this.copyAddressFromObj = response[CommonConstant.ReturnObj];
        this.EmergencyContactForm.patchValue({ CopyAddrFrom: this.copyAddressFromObj[0]['AppCustAddrId'] });
      });
  }

  isDataExist: boolean = false;
  async getData() {
    await this.http.post<AppCustEmrgncCntctObj>(URLConstant.GetAppCustEmrgncCntctByAppCustId, { Id: this.AppCustId }).toPromise().then(
      (response) => {
        if (response.AppCustEmrgncCntctId != 0) {
          this.isDataExist = true;
          this.EmergencyContactForm.patchValue({
            MrIdTypeCode: response.MrIdTypeCode == null? "" : response.MrIdTypeCode,
            MrGenderCode: response.MrGenderCode == null? "" : response.MrGenderCode,
            IdNo: response.IdNo,
            BirthPlace: response.BirthPlace,
            IdExpiredDt: response.IdExpiredDt != null ? formatDate(response.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
            BirthDt:  response.BirthDt != null ? formatDate(response.BirthDt, 'yyyy-MM-dd', 'en-US') : "",
            MrCustRelationshipCode: response.MrCustRelationshipCode == null? "" : response.MrCustRelationshipCode,
            MobilePhnNo1: response.MobilePhnNo1,
            MobilePhnNo2: response.MobilePhnNo2,
            Email: response.Email
          })

          if (this.GenderObj.findIndex(x => x.Key == this.EmergencyContactForm.controls.MrGenderCode.value) == -1) {
            this.EmergencyContactForm.patchValue({
              MrGenderCode: ''
            })
          }
          this.setValidatorPattern();
        }
        this.appCustEmrgncCntctObj.RowVersion = response["RowVersion"];
        this.InputLookupCustObj.nameSelect = response["ContactPersonName"];
        this.InputLookupCustObj.jsonSelect = { CustName: response["ContactPersonName"] };

        this.UcAddrObj.Addr = response["Addr"];
        this.UcAddrObj.AreaCode1 = response["AreaCode1"];
        this.UcAddrObj.AreaCode2 = response["AreaCode2"];
        this.UcAddrObj.AreaCode3 = response["AreaCode3"];
        this.UcAddrObj.AreaCode4 = response["AreaCode4"];
        this.UcAddrObj.City = response["City"];
        this.UcAddrObj.Fax = response["Fax"];
        this.UcAddrObj.FaxArea = response["FaxArea"];
        this.UcAddrObj.Phn1 = response["Phn1"];
        this.UcAddrObj.Phn2 = response["Phn2"];
        this.UcAddrObj.Phn3 = response["Phn3"];
        this.UcAddrObj.PhnArea1 = response["PhnArea1"];
        this.UcAddrObj.PhnArea2 = response["PhnArea2"];
        this.UcAddrObj.PhnArea3 = response["PhnArea3"];
        this.UcAddrObj.PhnExt1 = response["PhnExt1"];
        this.UcAddrObj.PhnExt2 = response["PhnExt2"];
        this.UcAddrObj.PhnExt3 = response["PhnExt3"];

        this.InputUcAddressObj.inputField.inputLookupObj.nameSelect = response["Zipcode"];
        this.InputUcAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response["Zipcode"] };
        this.InputUcAddressObj.default = this.UcAddrObj;

        this.IsCustRelationshipReady = true;
        this.IsGenderReady = true;
        this.IsIdTypeReady = true;
      },
      error => {
        console.log(error);
      });
  }

  ChangeIdType(IdType: string) {
    this.EmergencyContactForm.controls.IdExpiredDt.patchValue("");

    if (IdType == "KITAS" || IdType == "SIM") {
      this.EmergencyContactForm.controls.IdExpiredDt.setValidators([Validators.required]);
    } else {
      this.EmergencyContactForm.controls.IdExpiredDt.clearValidators();
    }

    this.EmergencyContactForm.controls.IdExpiredDt.updateValueAndValidity();
    this.setValidatorPattern();
  }

  removeSpouse() {
    let idxSpouse = this.MrCustRelationshipObj.findIndex(x => x.Key == CommonConstant.MasteCodeRelationshipSpouse);
    this.MrCustRelationshipObj.splice(idxSpouse, 1)
  }

  copyCustomerEvent(event) {
    this.http.post<ResponseCustPersonalForCopyObj>(URLConstant.GetCustPersonalForCopyByCustId, { Id: event.CustId }).subscribe(
      (response) => {
        if (response.CustObj != undefined) {
          this.EmergencyContactForm.patchValue({
            ContactPersonName: response.CustObj.CustName,
            ContactPersonCustNo: response.CustObj.CustNo,
            MrCustTypeCode: response.CustObj.MrCustTypeCode,
            MrIdTypeCode: response.CustObj.MrIdTypeCode,
            IdNo: response.CustObj.IdNo,
            IdExpiredDt: response.CustObj.IdExpiredDt != null ? formatDate(response.CustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
          });
          this.setValidatorPattern();
          this.InputLookupCustObj.nameSelect = response.CustObj.CustName;
          this.InputLookupCustObj.jsonSelect = { CustName: response.CustObj.CustName };
        }

        if (response.CustPersonalObj != undefined) {
          this.EmergencyContactForm.patchValue({
            MrGenderCode: response.CustPersonalObj.MrGenderCode,
            BirthPlace: response.CustPersonalObj.BirthPlace,
            BirthDt: response.CustPersonalObj.BirthDt != null ? formatDate(response.CustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US') : "",
            MobilePhnNo1: response.CustPersonalObj.MobilePhnNo1,
            MobilePhnNo2: response.CustPersonalObj.MobilePhnNo2,
            Email: response.CustPersonalObj.Email1,
          });
        }

        if (response.CustAddrObjs.length > 0) {
          var custAddrLegalObj = response.CustAddrObjs.find(x => x.MrCustAddrTypeCode == CommonConstant.AddrTypeLegal);

          this.UcAddrObj.Addr = custAddrLegalObj.Addr;
          this.UcAddrObj.AreaCode1 = custAddrLegalObj.AreaCode1;
          this.UcAddrObj.AreaCode2 = custAddrLegalObj.AreaCode2;
          this.UcAddrObj.AreaCode3 = custAddrLegalObj.AreaCode3;
          this.UcAddrObj.AreaCode4 = custAddrLegalObj.AreaCode4;
          this.UcAddrObj.City = custAddrLegalObj.City;
          this.UcAddrObj.Phn1 = custAddrLegalObj.Phn1;
          this.UcAddrObj.Phn2 = custAddrLegalObj.Phn2;
          this.UcAddrObj.Phn3 = custAddrLegalObj.Phn3;
          this.UcAddrObj.PhnArea1 = custAddrLegalObj.PhnArea1;
          this.UcAddrObj.PhnArea2 = custAddrLegalObj.PhnArea2;
          this.UcAddrObj.PhnArea3 = custAddrLegalObj.PhnArea3;
          this.UcAddrObj.PhnExt1 = custAddrLegalObj.PhnExt1;
          this.UcAddrObj.PhnExt2 = custAddrLegalObj.PhnExt2;
          this.UcAddrObj.PhnExt3 = custAddrLegalObj.PhnExt3;

          this.InputUcAddressObj.inputField.inputLookupObj.nameSelect = custAddrLegalObj.Zipcode;
          this.InputUcAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: custAddrLegalObj.Zipcode };
          this.InputUcAddressObj.default = this.UcAddrObj;
        }
      });
  }

  CopyAddress() {
    if (this.copyAddressFromObj.length < 1) {
      return
    }

    this.http.post(URLConstant.GetAppCustAddrByAppCustAddrId, { Id: this.EmergencyContactForm.controls.CopyAddrFrom.value }).subscribe(
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

  SaveForm() {
    this.appCustEmrgncCntctObj.AppCustId = this.AppCustId;
    this.appCustEmrgncCntctObj.ContactPersonName = this.EmergencyContactForm.value.lookupCustomer.value;
    this.appCustEmrgncCntctObj.MrIdTypeCode = this.EmergencyContactForm.controls.MrIdTypeCode.value;
    this.appCustEmrgncCntctObj.MrGenderCode = this.EmergencyContactForm.controls.MrGenderCode.value;
    this.appCustEmrgncCntctObj.IdNo = this.EmergencyContactForm.controls.IdNo.value;
    this.appCustEmrgncCntctObj.BirthPlace = this.EmergencyContactForm.controls.BirthPlace.value;
    this.appCustEmrgncCntctObj.IdExpiredDt = this.EmergencyContactForm.controls.IdExpiredDt.value;
    this.appCustEmrgncCntctObj.BirthDt = this.EmergencyContactForm.controls.BirthDt.value;
    this.appCustEmrgncCntctObj.MrCustRelationshipCode = this.EmergencyContactForm.controls.MrCustRelationshipCode.value;
    this.appCustEmrgncCntctObj.MobilePhnNo1 = this.EmergencyContactForm.controls.MobilePhnNo1.value;
    this.appCustEmrgncCntctObj.MobilePhnNo2 = this.EmergencyContactForm.controls.MobilePhnNo2.value;
    this.appCustEmrgncCntctObj.Email = this.EmergencyContactForm.controls.Email.value;
    this.appCustEmrgncCntctObj.Addr = this.UcAddrObj.Addr;
    this.appCustEmrgncCntctObj.AreaCode1 = this.UcAddrObj.AreaCode1;
    this.appCustEmrgncCntctObj.AreaCode2 = this.UcAddrObj.AreaCode2;
    this.appCustEmrgncCntctObj.AreaCode3 = this.UcAddrObj.AreaCode3;
    this.appCustEmrgncCntctObj.AreaCode4 = this.UcAddrObj.AreaCode4;
    this.appCustEmrgncCntctObj.City = this.UcAddrObj.City;
    this.appCustEmrgncCntctObj.Phn1 = this.UcAddrObj.Phn1;
    this.appCustEmrgncCntctObj.Phn2 = this.UcAddrObj.Phn2;
    this.appCustEmrgncCntctObj.Phn3 = this.UcAddrObj.Phn3;
    this.appCustEmrgncCntctObj.PhnArea1 = this.UcAddrObj.PhnArea1;
    this.appCustEmrgncCntctObj.PhnArea2 = this.UcAddrObj.PhnArea2;
    this.appCustEmrgncCntctObj.PhnArea3 = this.UcAddrObj.PhnArea3;
    this.appCustEmrgncCntctObj.PhnExt1 = this.UcAddrObj.PhnExt1;
    this.appCustEmrgncCntctObj.PhnExt2 = this.UcAddrObj.PhnExt2;
    this.appCustEmrgncCntctObj.PhnExt3 = this.UcAddrObj.PhnExt3;
    this.appCustEmrgncCntctObj.Zipcode = this.EmergencyContactForm.controls["AddressZipcode"]["controls"].value.value;

    if(this.checkEmergencyCustContactPerson() == false){
      return;
    }

    if (!this.isDataExist) {
      this.http.post(URLConstant.AddAppCustEmrgncCntct, this.appCustEmrgncCntctObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.OutputTab.emit({ IsComplete: true });
        },
        error => {
          console.log(error);
        });
    } else {
      this.http.post(URLConstant.EditAppCustEmrgncCntct, this.appCustEmrgncCntctObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.OutputTab.emit({ IsComplete: true });
        },
        error => {
          console.log(error);
        });
    }
  }

  //START URS-LOS-041
  controlNameIdNo: string = 'IdNo';
  controlNameIdType: string = 'MrIdTypeCode';
  customPattern: Array<CustomPatternObj>;
  resultPattern: Array<KeyValueObj>;

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
    idTypeValue = this.EmergencyContactForm.controls[this.controlNameIdType].value;
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
      this.EmergencyContactForm.controls[this.controlNameIdNo].setValidators(Validators.pattern(pattern));
      this.EmergencyContactForm.controls[this.controlNameIdNo].updateValueAndValidity();
    }
  }
  //END OF URS-LOS-041

  checkEmergencyCustContactPerson(){
    var flag: boolean = true;

    let max17Yodt = new Date(this.MaxDate);
    let d1 = new Date(this.EmergencyContactForm.controls.BirthDt.value);
    let d2 = new Date(this.MaxDate);
    let d3 = new Date(this.EmergencyContactForm.controls.IdExpiredDt.value);
    max17Yodt.setFullYear(d2.getFullYear() - 17);

    if (d1 > max17Yodt) {
      this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
      flag = false;
    }

    if(d1 > d2){
      this.toastr.warningMessage(ExceptionConstant.BIRTH_DATE_CANNOT_MORE_THAN + 'Business Date');
      flag = false;
    }

    if(d2 > d3 || d2.getDate() === d3.getDate()){
      let checkIdType = this.EmergencyContactForm.controls.MrIdTypeCode.value;
      if(checkIdType == CommonConstant.MrIdTypeCodeEKTP || checkIdType == CommonConstant.MrIdTypeCodeNPWP || checkIdType == CommonConstant.MrIdTypeCodeAKTA){
        flag = true;
      }
      else{
        this.toastr.warningMessage(ExceptionConstant.ID_EXPIRED_DATE_CANNOT_LESS_THAN + 'Equal Business Date');
        flag = false;
      }
    }

    return flag;
  }
}