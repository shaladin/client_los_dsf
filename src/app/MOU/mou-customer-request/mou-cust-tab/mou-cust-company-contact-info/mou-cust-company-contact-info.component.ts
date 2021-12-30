import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MouCustCompanyContactPersonObj } from 'app/shared/model/mou-cust-company-contact-person-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CustomPatternObj } from 'app/shared/model/custom-pattern-obj.model';
import { RegexService } from 'app/shared/services/regex.services';
import { formatDate } from '@angular/common';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-mou-cust-company-contact-info',
  templateUrl: './mou-cust-company-contact-info.component.html',
  styleUrls: ['./mou-cust-company-contact-info.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class MouCustCompanyContactInfoComponent implements OnInit {
  @Input() listContactPersonCompany: Array<MouCustCompanyContactPersonObj> = new Array<MouCustCompanyContactPersonObj>();
  @Output() callbackSubmit: EventEmitter<Array<MouCustCompanyContactPersonObj>> = new EventEmitter();
  @Output() callbackCopyAddrComp: EventEmitter<string> = new EventEmitter();

  mode: string;
  currentEditedIndex: number;
  closeResult: string;
  copyFromContactPerson: string;
  MouCustCompanyContactPersonObj: MouCustCompanyContactPersonObj;
  refMasterObj = {
    RefMasterTypeCode: ""
  };
  copyToContactPersonAddrObj: Array<KeyValueObj> = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
    {
      Key: "BIZ",
      Value: "Business"
    },
    {
      Key: "MAILING",
      Value: "Mailing"
    }
  ];
  JobPositionObj: Array<KeyValueObj>;
  CustRelationshipObj: Array<KeyValueObj>;
  GenderObj: Array<KeyValueObj>;
  IdTypeObj: Array<KeyValueObj>;
  defaultGender: string;
  defaultGenderName: string;
  defaultIdType: string;
  defaultCustRelationship: string;
  defaultRelationshipName: string;
  defaultJobPosition: string;
  selectedJobPositionName: string;
  defaultJobPositionName: string;
  inputAddressObjForCPComp: InputAddressObj;
  contactPersonAddrObj: AddrObj;
  inputFieldContactPersonObj: InputFieldObj;
  resultPattern: Array<KeyValueObj>;
  customPattern: Array<CustomPatternObj>;
  UserAccess: CurrentUserContext;
  MaxDate: Date;
  BusinessDt: Date;
  selectedRelationshipName: string;
  selectedGenderName: string;

  ContactInfoCompanyForm = this.fb.group({
    ContactPersonName: ['', [Validators.required, Validators.maxLength(500)]],
    MrGenderCode: ['', Validators.required],
    MrIdTypeCode: [''],
    IdNo: ['', Validators.maxLength(100)],
    IdExpiredDt: [''],
    BirthPlace: ['', Validators.maxLength(100)],
    BirthDt: [''],
    MrCustRelationshipCode: ['', Validators.maxLength(50)],
    MrJobPositionCode: ['', [Validators.required, Validators.maxLength(50)]],
    MobilePhnNo1: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    MobilePhnNo2: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    JobTitleName: ['', [Validators.required, Validators.maxLength(100)]],
    Email1: ['', Validators.pattern(CommonConstant.regexEmail)],
    Email2: ['', Validators.pattern(CommonConstant.regexEmail)],
    CopyFromContactPerson: [''],
    IsGuarantor: [false]
  });

  controlNameIdType: string = 'MrIdTypeCode';
  controlNameIdNo: string = 'IdNo';
  constructor(private fb: FormBuilder, private http: HttpClient, 
              private modalService: NgbModal, private cookieService: CookieService, 
              private regexService: RegexService, private toastr: NGXToastrService,) {

  }

  ngOnInit() {
    this.customPattern = new Array<CustomPatternObj>();
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess.BusinessDt;
    this.BusinessDt = this.UserAccess.BusinessDt;
    this.bindCopyFrom();
    this.bindJobPositionObj();
    this.bindAllRefMasterObj();
    this.initContactPersonAddrObj();
  }

  initContactPersonAddrObj() {
    this.contactPersonAddrObj = new AddrObj()
    this.inputFieldContactPersonObj = new InputFieldObj();
    this.inputFieldContactPersonObj.inputLookupObj = new InputLookupObj();

    this.inputAddressObjForCPComp = new InputAddressObj();
    this.inputAddressObjForCPComp.showPhn3 = false;
    this.inputAddressObjForCPComp.showSubsection = false;
  }

  getInitPattern() {
    this.regexService.getListPattern().subscribe(
      response => {
        this.resultPattern = response[CommonConstant.ReturnObj];
        console.log(this.resultPattern);
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

  bindAllRefMasterObj() {
    this.bindGenderObj();
    this.bindIdTypeObj();
    this.bindCustRelationshipObj();
  }

  bindGenderObj() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender }).toPromise().then(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          this.defaultGender = this.GenderObj[0].Key;
          this.defaultGenderName = this.GenderObj[0].Value;
        }
      }
    );
  }

  bindIdTypeObj() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).toPromise().then(
      (response) => {
        this.IdTypeObj = response[CommonConstant.ReturnObj];
        if (this.IdTypeObj.length > 0) {
          this.defaultIdType = this.IdTypeObj[0].Key;
          this.onChangeIdType(this.defaultIdType);
        }
        console.log(this.defaultIdType);
      }
    );
  }

  bindCustRelationshipObj() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship }).toPromise().then(
      (response) => {
        this.CustRelationshipObj = response[CommonConstant.ReturnObj];
        if (this.CustRelationshipObj.length > 0) {
          this.defaultCustRelationship = this.CustRelationshipObj[0].Key;
          this.defaultRelationshipName = this.CustRelationshipObj[0].Value;
        }
      }
    );
  }

  bindCopyFrom() {
    this.ContactInfoCompanyForm.patchValue({
      CopyFromContactPerson: this.copyToContactPersonAddrObj[0].Key
    });
  }

  copyFromChangedComp() {
    this.callbackCopyAddrComp.emit(this.copyFromContactPerson);
  }

  CheckIsGuarantor() {
    this.ContactInfoCompanyForm.controls.BirthDt.clearValidators();
    if(this.ContactInfoCompanyForm.controls.IsGuarantor.value == true) {
      this.ContactInfoCompanyForm.controls.BirthDt.setValidators(Validators.required);
    }
    this.ContactInfoCompanyForm.controls.BirthDt.updateValueAndValidity();
  }

  SaveForm(){
    this.MouCustCompanyContactPersonObj = new MouCustCompanyContactPersonObj();
    if(this.listContactPersonCompany == undefined){
      this.listContactPersonCompany = new Array<MouCustCompanyContactPersonObj>();
    }

    let businessDtStr = formatDate(this.UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
    let businessDt = new Date(businessDtStr);
    let birthDt = new Date(this.ContactInfoCompanyForm.controls.BirthDt.value);

    if (birthDt > businessDt) {
      this.toastr.warningMessage(ExceptionConstant.BIRTH_DATE_CANNOT_MORE_THAN + businessDtStr);
      return;
    }

    if (this.checkEmergencyCustContactPerson() == false) {
      return;
    }

    this.setAppCustCompanyContactPerson();
    if(this.mode == "add"){
      this.listContactPersonCompany.push(this.MouCustCompanyContactPersonObj);
    }
    if(this.mode == "edit"){
      this.listContactPersonCompany[this.currentEditedIndex] = this.MouCustCompanyContactPersonObj;
    }
    this.callbackSubmit.emit(this.listContactPersonCompany);
    this.modalService.dismissAll();
    this.clearForm();
  }

  checkEmergencyCustContactPerson() {
    var isValid: boolean = true;

    let max17Yodt = new Date(this.BusinessDt);
    let birthDt = new Date(this.ContactInfoCompanyForm.controls.BirthDt.value);
    let tempBusinessDt = new Date(this.BusinessDt);
    let idExpiredDt = new Date(this.ContactInfoCompanyForm.controls.IdExpiredDt.value);
    max17Yodt.setFullYear(tempBusinessDt.getFullYear() - 17);

    if (birthDt > max17Yodt) {
      this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
      isValid = false;
    }

    if (birthDt > tempBusinessDt) {
      this.toastr.warningMessage(ExceptionConstant.BIRTH_DATE_CANNOT_MORE_THAN + 'Business Date');
      isValid = false;
    }

    if (tempBusinessDt >= idExpiredDt) {
      let checkIdType = this.ContactInfoCompanyForm.controls.MrIdTypeCode.value;
      if (checkIdType == CommonConstant.MrIdTypeCodeEKTP || checkIdType == CommonConstant.MrIdTypeCodeNPWP || checkIdType == CommonConstant.MrIdTypeCodeAKTA) {
        isValid = true;
      }
      else {
        this.toastr.warningMessage(ExceptionConstant.ID_EXPIRED_DATE_CANNOT_LESS_THAN + 'Equal Business Date');
        isValid = false;
      }
    }

    return isValid;
  }

  add(content){
    this.mode = "add";
    this.clearForm();
    this.open(content);
  }

  edit(i, content){
    this.clearForm();
    this.mode = "edit";
    this.currentEditedIndex = i;
    var birthDt;
    if (this.listContactPersonCompany[i].BirthDt != undefined) {
      if (this.listContactPersonCompany[i].BirthDt.toString() != '') {
        birthDt = formatDate(this.listContactPersonCompany[i].BirthDt, 'yyyy-MM-dd', 'en-US');
      } else {
        birthDt = "";
      }
    } else {
      birthDt = "";
    }

    this.ContactInfoCompanyForm.patchValue({
      ContactPersonName: this.listContactPersonCompany[i].ContactPersonName,
      MrGenderCode: this.listContactPersonCompany[i].MrGenderCode,
      MrIdTypeCode: this.listContactPersonCompany[i].MrIdTypeCode,
      MrCustRelationshipCode: this.listContactPersonCompany[i].MrCustRelationshipCode,
      IdNo: this.listContactPersonCompany[i].IdNo,
      IdExpiredDt: this.checkIsNullOrEmpty(this.listContactPersonCompany[i].IdExpiredDt) ? "" : formatDate(this.listContactPersonCompany[i].IdExpiredDt, 'yyyy-MM-dd', 'en-US'),
      BirthPlace: this.listContactPersonCompany[i].BirthPlace,
      BirthDt: birthDt,
      MrJobPositionCode: this.listContactPersonCompany[i].MrJobPositionCode,
      MobilePhnNo1: this.listContactPersonCompany[i].MobilePhnNo1,
      MobilePhnNo2: this.listContactPersonCompany[i].MobilePhnNo2,
      JobTitleName: this.listContactPersonCompany[i].JobTitleName,
      Email1: this.listContactPersonCompany[i].Email1,
      Email2: this.listContactPersonCompany[i].Email2,
      IsGuarantor: this.listContactPersonCompany[i].IsGuarantor
    });

    this.setCustRelationShip(this.listContactPersonCompany[i].MrCustRelationshipCode);
    this.setContactPersonAddr(this.listContactPersonCompany[i]);
    this.selectedJobPositionName = this.listContactPersonCompany[i].JobPositionName;
    this.getInitPattern();
    this.open(content);
  }

  checkIsNullOrEmpty(item: any) {
    if(item == null || item == "") return true;
    return false;
  }

  setCustRelationShip(MrCustRelationshipCode: string) {
    var selectedRelationship = this.CustRelationshipObj.find(x => x.Key == MrCustRelationshipCode);
    if (selectedRelationship != undefined) {
      this.selectedRelationshipName = selectedRelationship.Value;
    }
  }

  setContactPersonAddr(MouCustCompanyContactPerson) {
    this.contactPersonAddrObj.Addr = MouCustCompanyContactPerson.Addr;
    this.contactPersonAddrObj.AreaCode1 = MouCustCompanyContactPerson.AreaCode1;
    this.contactPersonAddrObj.AreaCode2 = MouCustCompanyContactPerson.AreaCode2;
    this.contactPersonAddrObj.AreaCode3 = MouCustCompanyContactPerson.AreaCode3;
    this.contactPersonAddrObj.AreaCode4 = MouCustCompanyContactPerson.AreaCode4;
    this.contactPersonAddrObj.City = MouCustCompanyContactPerson.City;
    this.contactPersonAddrObj.Fax = MouCustCompanyContactPerson.Fax;
    this.contactPersonAddrObj.FaxArea = MouCustCompanyContactPerson.FaxArea;
    this.contactPersonAddrObj.Phn1 = MouCustCompanyContactPerson.Phn1;
    this.contactPersonAddrObj.Phn2 = MouCustCompanyContactPerson.Phn2;
    this.contactPersonAddrObj.Phn3 = MouCustCompanyContactPerson.Phn3;
    this.contactPersonAddrObj.PhnArea1 = MouCustCompanyContactPerson.PhnArea1;
    this.contactPersonAddrObj.PhnArea2 = MouCustCompanyContactPerson.PhnArea2;
    this.contactPersonAddrObj.PhnArea3 = MouCustCompanyContactPerson.PhnArea3;
    this.contactPersonAddrObj.PhnExt1 = MouCustCompanyContactPerson.PhnExt1;
    this.contactPersonAddrObj.PhnExt2 = MouCustCompanyContactPerson.PhnExt2;
    this.contactPersonAddrObj.PhnExt3 = MouCustCompanyContactPerson.PhnExt3;

    this.inputFieldContactPersonObj.inputLookupObj.nameSelect = MouCustCompanyContactPerson.Zipcode;
    this.inputFieldContactPersonObj.inputLookupObj.jsonSelect = { Zipcode: MouCustCompanyContactPerson.Zipcode };
    this.inputAddressObjForCPComp.default = this.contactPersonAddrObj;
    this.inputAddressObjForCPComp.inputField = this.inputFieldContactPersonObj;
  }

  delete(i){
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.listContactPersonCompany.splice(i, 1);
      this.callbackSubmit.emit(this.listContactPersonCompany);
    }
  }

  JobPositionChanged(event){
    this.selectedJobPositionName = event.target.options[event.target.options.selectedIndex].text;
  }

  onChangeIdType(IdType: string){
    this.ContactInfoCompanyForm.controls.IdExpiredDt.patchValue("");

    if (IdType == "KITAS" || IdType == "SIM") {
      this.ContactInfoCompanyForm.controls.IdExpiredDt.setValidators([Validators.required]);
    } else {
      this.ContactInfoCompanyForm.controls.IdExpiredDt.clearValidators();
    }
    this.ContactInfoCompanyForm.controls.IdExpiredDt.updateValueAndValidity();

    let IdTypeCode = this.ContactInfoCompanyForm.get("MrIdTypeCode").value;
    if (IdTypeCode == CommonConstant.MrIdTypeCodeNPWP) {
      this.ContactInfoCompanyForm.controls.IdNo.setValidators([Validators.required]);
    } else {
      this.ContactInfoCompanyForm.controls.IdNo.clearValidators();
    }
    this.ContactInfoCompanyForm.controls.IdNo.updateValueAndValidity();

    this.setValidatorPattern();
  }

  setValidatorPattern() {
    let idTypeValue: string;

    idTypeValue = this.ContactInfoCompanyForm.controls[this.controlNameIdType].value;
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
      this.ContactInfoCompanyForm.controls[this.controlNameIdNo].setValidators([Validators.pattern(pattern)]);
      this.ContactInfoCompanyForm.controls[this.controlNameIdNo].updateValueAndValidity();
    }
  }

  
  clearForm(){
    this.ContactInfoCompanyForm = this.fb.group({
      ContactPersonName: ['', [Validators.required, Validators.maxLength(500)]],
      MrGenderCode: [this.defaultGender, [Validators.required]],
      MrIdTypeCode: [this.defaultIdType],
      IdNo: ['', Validators.maxLength(100)],
      IdExpiredDt: [''],
      BirthPlace: ['', Validators.maxLength(100)],
      BirthDt: [''],
      MrCustRelationshipCode: [this.defaultCustRelationship, [Validators.maxLength(50)]],
      MrJobPositionCode: [this.defaultJobPosition, [Validators.required, Validators.maxLength(50)]],
      MobilePhnNo1: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      MobilePhnNo2: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      JobTitleName: ['', [Validators.required, Validators.maxLength(100)]],
      Email1: ['', Validators.pattern(CommonConstant.regexEmail)],
      Email2: ['', Validators.pattern(CommonConstant.regexEmail)],
      CopyFromContactPerson: [''],
      IsGuarantor: [false]
    });
    this.copyFromContactPerson = "";
    this.selectedGenderName = this.defaultGenderName;
    this.selectedRelationshipName = this.defaultRelationshipName;
    this.selectedJobPositionName = this.defaultJobPositionName;

    this.initContactPersonAddrObj();
    if (this.defaultIdType != undefined) {
      this.ContactInfoCompanyForm.patchValue({
        MrIdTypeCode: this.defaultIdType
      });
      this.getInitPattern();
    }
  }

  setAppCustCompanyContactPerson(){
    this.MouCustCompanyContactPersonObj.ContactPersonName = this.ContactInfoCompanyForm.controls.ContactPersonName.value;
    this.MouCustCompanyContactPersonObj.MrGenderCode = this.ContactInfoCompanyForm.controls.MrGenderCode.value;
    this.MouCustCompanyContactPersonObj.MrIdTypeCode = this.ContactInfoCompanyForm.controls.MrIdTypeCode.value;
    this.MouCustCompanyContactPersonObj.MrCustRelationshipCode = this.ContactInfoCompanyForm.controls.MrCustRelationshipCode.value;
    this.MouCustCompanyContactPersonObj.IdNo = this.ContactInfoCompanyForm.controls.IdNo.value;
    this.MouCustCompanyContactPersonObj.IdExpiredDt = this.ContactInfoCompanyForm.controls.IdExpiredDt.value;
    this.MouCustCompanyContactPersonObj.BirthPlace = this.ContactInfoCompanyForm.controls.BirthPlace.value;
    this.MouCustCompanyContactPersonObj.BirthDt = this.ContactInfoCompanyForm.controls.BirthDt.value;
    this.MouCustCompanyContactPersonObj.MrJobPositionCode = this.ContactInfoCompanyForm.controls.MrJobPositionCode.value;
    this.MouCustCompanyContactPersonObj.MobilePhnNo1 = this.ContactInfoCompanyForm.controls.MobilePhnNo1.value;
    this.MouCustCompanyContactPersonObj.MobilePhnNo2 = this.ContactInfoCompanyForm.controls.MobilePhnNo2.value;
    this.MouCustCompanyContactPersonObj.JobTitleName = this.ContactInfoCompanyForm.controls.JobTitleName.value;
    this.MouCustCompanyContactPersonObj.Email1 = this.ContactInfoCompanyForm.controls.Email1.value;
    this.MouCustCompanyContactPersonObj.Email2 = this.ContactInfoCompanyForm.controls.Email2.value;
    this.MouCustCompanyContactPersonObj.Zipcode = this.ContactInfoCompanyForm.controls["contactPersonCompAddrZipcode"]["controls"].value.value;
    this.MouCustCompanyContactPersonObj.City = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].City.value;
    this.MouCustCompanyContactPersonObj.Addr = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].Addr.value;
    this.MouCustCompanyContactPersonObj.AreaCode1 = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].AreaCode1.value;
    this.MouCustCompanyContactPersonObj.AreaCode2 = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].AreaCode2.value;
    this.MouCustCompanyContactPersonObj.AreaCode3 = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].AreaCode3.value;
    this.MouCustCompanyContactPersonObj.AreaCode4 = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].AreaCode4.value;
    this.MouCustCompanyContactPersonObj.Phn1 = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].Phn1.value;
    this.MouCustCompanyContactPersonObj.Phn2 = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].Phn2.value;
    this.MouCustCompanyContactPersonObj.PhnArea1 = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].PhnArea1.value;
    this.MouCustCompanyContactPersonObj.PhnArea2 = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].PhnArea2.value;
    this.MouCustCompanyContactPersonObj.PhnExt1 = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].PhnExt1.value;
    this.MouCustCompanyContactPersonObj.PhnExt2 = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].PhnExt2.value;
    this.MouCustCompanyContactPersonObj.FaxArea = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].FaxArea.value;
    this.MouCustCompanyContactPersonObj.Fax = this.ContactInfoCompanyForm.controls["contactPersonCompAddr"]["controls"].Fax.value;
    this.MouCustCompanyContactPersonObj.JobPositionName = this.selectedJobPositionName;
    this.MouCustCompanyContactPersonObj.IsGuarantor = this.ContactInfoCompanyForm.controls.IsGuarantor.value;
  }

  bindJobPositionObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeJobPosition;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
        if(this.JobPositionObj.length > 0){
            this.defaultJobPosition = this.JobPositionObj[0].Key;
            this.defaultJobPositionName = this.JobPositionObj[0].Value;
        }
      }
    );
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  cancel()
  {
    this.modalService.dismissAll();
  }



}
