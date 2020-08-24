import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AppCustPersonalContactPersonObj } from 'app/shared/model/AppCustPersonalContactPersonObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { formatDate } from '@angular/common';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';

@Component({
  selector: 'app-cust-personal-contact-information',
  templateUrl: './cust-personal-contact-information.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustPersonalContactInformationComponent implements OnInit {
  @Input() listContactPersonPersonal: Array<AppCustPersonalContactPersonObj> = new Array<AppCustPersonalContactPersonObj>();


  @Output() callbackSubmit: EventEmitter<any> = new EventEmitter();
  @Output() callbackCopyAddr: EventEmitter<any> = new EventEmitter();
  @Input() isMarried: boolean = true;
  @Input() spouseGender: string = "";

  mode: any;
  currentEditedIndex: any;
  closeResult: any;
  selectedProfessionCode: any;
  getCustContactPersonPersonalUrl: any;
  getRefMasterUrl: any;
  getRefProfessionUrl: any;
  appCustPersonalContactPersonObj: AppCustPersonalContactPersonObj;
  refMasterObj = {
    RefMasterTypeCode: ""
  };
  professionObj = {
    ProfessionCode: ""
  };
  copyToContactPersonAddrObj: any = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
    {
      Key: "RESIDENCE",
      Value: "Residence"
    },
    {
      Key: "MAILING",
      Value: "Mailing"
    }
  ];
  copyFromContactPerson: any;
  contactPersonAddrObj: AddrObj;
  inputFieldContactPersonObj: InputFieldObj;
  GenderObj: any;
  IdTypeObj: any;
  CustRelationshipObj: any;
  InputLookupProfessionObj: any;
  defaultGender: any;
  defaultIdType: any;
  defaultCustRelationship: any;
  selectedGenderName: any;
  selectedRelationshipName: any;
  defaultGenderName: any;
  defaultRelationshipName: any;
  UserAccess: any;
  MaxDate: Date;

  ContactInfoPersonalForm = this.fb.group({
    ContactPersonName: ['', [Validators.required, Validators.maxLength(1000)]],
    MrGenderCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrIdTypeCode: ['', Validators.maxLength(50)],
    MrCustRelationshipCode: ['', Validators.maxLength(50)],
    IdNo: ['', Validators.maxLength(100)],
    BirthPlace: ['', Validators.maxLength(100)],
    BirthDt: [''],
    IsEmergencyContact: [false],
    MobilePhnNo1: ['', [Validators.required, Validators.maxLength(100)]],
    MobilePhnNo2: ['', [Validators.required, Validators.maxLength(100)]],
    IsFamily: [false],
    Email: ['', Validators.maxLength(100)],
    CopyFromContactPerson: [''],
    IsGuarantor: [false]
  });
  inputAddressObjForCP: InputAddressObj;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal,
    private toastr: NGXToastrService,) {

  }

  ngOnInit() {
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess.BusinessDt;
    this.bindCopyFrom();
    this.initLookup();
    this.initUrl();
    this.bindAllRefMasterObj();
    this.initContactPersonAddrObj();
  }

  SaveForm() {
    this.appCustPersonalContactPersonObj = new AppCustPersonalContactPersonObj();
    if (this.listContactPersonPersonal == undefined) {
      this.listContactPersonPersonal = new Array<AppCustPersonalContactPersonObj>();
    }
    var selectedRelationship = this.CustRelationshipObj.find(x => x.Key == this.ContactInfoPersonalForm.controls.MrCustRelationshipCode.value);
    if(selectedRelationship==undefined){ 
      this.toastr.errorMessage(ExceptionConstant.CHOOSE_CUST_RELATIONSHIP) ;
      return;
    } 
    var userAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var businessDtStr = formatDate(userAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
    var businessDt = new Date(businessDtStr);
    var birthDt = new Date(this.ContactInfoPersonalForm.controls.BirthDt.value);

    if (birthDt > businessDt) {
      this.toastr.warningMessage(ExceptionConstant.BIRTH_DATE_CANNOT_MORE_THAN + businessDtStr);
      return;
    }

    this.setAppCustPersonalContactPerson();
    if (this.mode == "Add") {
      this.listContactPersonPersonal.push(this.appCustPersonalContactPersonObj);
    }
    if (this.mode == "Edit") {
      this.listContactPersonPersonal[this.currentEditedIndex] = this.appCustPersonalContactPersonObj;
    }
    this.callbackSubmit.emit(this.listContactPersonPersonal);
    this.modalService.dismissAll();
    this.clearForm();
  }

  add(content) {
    this.mode = "Add";
    this.clearForm();
    this.open(content);
  }

  edit(i, content) {
    this.clearForm();
    this.mode = "Edit";
    this.currentEditedIndex = i;
    var birthDt;
    if (this.listContactPersonPersonal[i].BirthDt != undefined) {
      if (this.listContactPersonPersonal[i].BirthDt.toString() != '') {
        birthDt = formatDate(this.listContactPersonPersonal[i].BirthDt, 'yyyy-MM-dd', 'en-US');
      } else {
        birthDt = '';
      }
    } else {
      birthDt = '';
    }

    this.ContactInfoPersonalForm.patchValue({
      ContactPersonName: this.listContactPersonPersonal[i].ContactPersonName,
      MrGenderCode: this.listContactPersonPersonal[i].MrGenderCode,
      MrIdTypeCode: this.listContactPersonPersonal[i].MrIdTypeCode,
      MrCustRelationshipCode: this.listContactPersonPersonal[i].MrCustRelationshipCode,
      IdNo: this.listContactPersonPersonal[i].IdNo,
      BirthPlace: this.listContactPersonPersonal[i].BirthPlace,
      BirthDt: birthDt,
      IsEmergencyContact: this.listContactPersonPersonal[i].IsEmergencyContact,
      MobilePhnNo1: this.listContactPersonPersonal[i].MobilePhnNo1,
      MobilePhnNo2: this.listContactPersonPersonal[i].MobilePhnNo2,
      Email: this.listContactPersonPersonal[i].Email,
      IsFamily: this.listContactPersonPersonal[i].IsFamily,
      IsGuarantor: this.listContactPersonPersonal[i].IsGuarantor
    });

    this.setCustRelationShip(this.listContactPersonPersonal[i].MrCustRelationshipCode);
    this.setContactPersonAddr(this.listContactPersonPersonal[i]);
    this.selectedProfessionCode = this.listContactPersonPersonal[i].MrJobProfessionCode;
    this.setProfessionName(this.listContactPersonPersonal[i].MrJobProfessionCode);
    this.CheckSpouse();
    this.open(content);
  }

  setCustRelationShip(MrCustRelationshipCode: string) {
    var selectedRelationship = this.CustRelationshipObj.find(x => x.Key == MrCustRelationshipCode);
    if(selectedRelationship!=undefined){
      this.selectedRelationshipName = selectedRelationship.Value;
    }
   
  }

  delete(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.listContactPersonPersonal.splice(i, 1);
      this.callbackSubmit.emit(this.listContactPersonPersonal);
    }
  }

  clearForm() {
    this.ContactInfoPersonalForm = this.fb.group({
      ContactPersonName: ['', [Validators.required, Validators.maxLength(500)]],
      MrGenderCode: [this.defaultGender, [Validators.required, Validators.maxLength(50)]],
      MrIdTypeCode: [this.defaultIdType, Validators.maxLength(50)],
      MrCustRelationshipCode: [this.defaultCustRelationship, Validators.maxLength(50)],
      IdNo: ['', Validators.maxLength(100)],
      BirthPlace: ['', Validators.maxLength(100)],
      BirthDt: [''],
      IsEmergencyContact: [false],
      MobilePhnNo1: ['', [Validators.required, Validators.maxLength(100), Validators.pattern("^[0-9]+$")]],
      MobilePhnNo2: ['', [Validators.maxLength(100), Validators.pattern("^[0-9]+$")]],
      IsFamily: [false],
      Email: ['', Validators.maxLength(100)],
      CopyFromContactPerson: [''],
      IsGuarantor: [false]
    });

    this.copyFromContactPerson = "";
    this.selectedGenderName = this.defaultGenderName;
    this.selectedRelationshipName = this.defaultRelationshipName;

    this.initLookup();
    this.initContactPersonAddrObj();
    this.CheckSpouse();
  }

  setAppCustPersonalContactPerson() { 
    this.appCustPersonalContactPersonObj.ContactPersonName = this.ContactInfoPersonalForm.controls.ContactPersonName.value;
    this.appCustPersonalContactPersonObj.MrGenderCode = this.ContactInfoPersonalForm.controls.MrGenderCode.value;
    this.appCustPersonalContactPersonObj.MrIdTypeCode = this.ContactInfoPersonalForm.controls.MrIdTypeCode.value; 
    this.appCustPersonalContactPersonObj.MrCustRelationshipCode = this.ContactInfoPersonalForm.controls.MrCustRelationshipCode.value;
    this.appCustPersonalContactPersonObj.IdNo = this.ContactInfoPersonalForm.controls.IdNo.value;
    this.appCustPersonalContactPersonObj.MrJobProfessionCode = this.selectedProfessionCode;
    this.appCustPersonalContactPersonObj.BirthPlace = this.ContactInfoPersonalForm.controls.BirthPlace.value;
    this.appCustPersonalContactPersonObj.BirthDt = this.ContactInfoPersonalForm.controls.BirthDt.value;
    this.appCustPersonalContactPersonObj.IsEmergencyContact = this.ContactInfoPersonalForm.controls.IsEmergencyContact.value;
    this.appCustPersonalContactPersonObj.IsFamily = this.ContactInfoPersonalForm.controls.IsFamily.value;
    this.appCustPersonalContactPersonObj.MobilePhnNo1 = this.ContactInfoPersonalForm.controls.MobilePhnNo1.value;
    this.appCustPersonalContactPersonObj.MobilePhnNo2 = this.ContactInfoPersonalForm.controls.MobilePhnNo2.value;
    this.appCustPersonalContactPersonObj.Email = this.ContactInfoPersonalForm.controls.Email.value;
    this.appCustPersonalContactPersonObj.Zipcode = this.ContactInfoPersonalForm.controls["contactPersonAddrZipcode"]["controls"].value.value;
    this.appCustPersonalContactPersonObj.Addr = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].Addr.value;
    this.appCustPersonalContactPersonObj.AreaCode1 = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].AreaCode1.value;
    this.appCustPersonalContactPersonObj.AreaCode2 = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].AreaCode2.value;
    this.appCustPersonalContactPersonObj.AreaCode3 = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].AreaCode3.value;
    this.appCustPersonalContactPersonObj.AreaCode4 = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].AreaCode4.value;
    this.appCustPersonalContactPersonObj.City = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].City.value;
    this.appCustPersonalContactPersonObj.GenderName = this.selectedGenderName;
    this.appCustPersonalContactPersonObj.RelationshipName = this.selectedRelationshipName;
    this.appCustPersonalContactPersonObj.IsGuarantor = this.ContactInfoPersonalForm.controls.IsGuarantor.value;
  }

  GetProfession(event) {
    this.selectedProfessionCode = event.ProfessionCode;
  }

  GenderChanged(event) {
    this.selectedGenderName = event.target.options[event.target.options.selectedIndex].text;
  }

  RelationshipChanged(event) {
    this.selectedRelationshipName = event.target.options[event.target.options.selectedIndex].text;
    this.CheckSpouse();
  }

  copyFromChanged() {
    this.callbackCopyAddr.emit(this.copyFromContactPerson);
  }

  setContactPersonAddr(appCustPersonalContactPerson) {
    this.contactPersonAddrObj.Addr = appCustPersonalContactPerson.Addr;
    this.contactPersonAddrObj.AreaCode1 = appCustPersonalContactPerson.AreaCode1;
    this.contactPersonAddrObj.AreaCode2 = appCustPersonalContactPerson.AreaCode2;
    this.contactPersonAddrObj.AreaCode3 = appCustPersonalContactPerson.AreaCode3;
    this.contactPersonAddrObj.AreaCode4 = appCustPersonalContactPerson.AreaCode4;
    this.contactPersonAddrObj.City = appCustPersonalContactPerson.City;
    this.contactPersonAddrObj.Fax = appCustPersonalContactPerson.Fax;
    this.contactPersonAddrObj.FaxArea = appCustPersonalContactPerson.FaxArea;
    this.contactPersonAddrObj.Phn1 = appCustPersonalContactPerson.Phn1;
    this.contactPersonAddrObj.Phn2 = appCustPersonalContactPerson.Phn2;
    this.contactPersonAddrObj.PhnArea1 = appCustPersonalContactPerson.PhnArea1;
    this.contactPersonAddrObj.PhnArea2 = appCustPersonalContactPerson.PhnArea2;
    this.contactPersonAddrObj.PhnExt1 = appCustPersonalContactPerson.PhnExt1;
    this.contactPersonAddrObj.PhnExt2 = appCustPersonalContactPerson.PhnExt2;

    this.inputFieldContactPersonObj.inputLookupObj.nameSelect = appCustPersonalContactPerson.Zipcode;
    this.inputFieldContactPersonObj.inputLookupObj.jsonSelect = { Zipcode: appCustPersonalContactPerson.Zipcode };
    this.inputAddressObjForCP.default = this.contactPersonAddrObj;
    this.inputAddressObjForCP.inputField = this.inputFieldContactPersonObj;

  }

  setProfessionName(professionCode) {
    this.professionObj.ProfessionCode = professionCode;
    this.http.post(this.getRefProfessionUrl, this.professionObj).subscribe(
      (response) => {
        this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
        this.InputLookupProfessionObj.jsonSelect = response;
      });
  }

  initContactPersonAddrObj() {
    this.contactPersonAddrObj = new AddrObj();
    this.inputFieldContactPersonObj = new InputFieldObj();
    this.inputFieldContactPersonObj.inputLookupObj = new InputLookupObj();
    
    this.inputAddressObjForCP = new InputAddressObj();
    this.inputAddressObjForCP.showSubsection = false;
    this.inputAddressObjForCP.showAllPhn = false;
  }

  initLookup() {
    this.InputLookupProfessionObj = new InputLookupObj();
    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupProfessionObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.isRequired = false;
  }

  initUrl() {
    this.getCustContactPersonPersonalUrl = URLConstant.GetAppCustPersonalContactPersonsByAppCustPersonalId;
    this.getRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.getRefProfessionUrl = URLConstant.GetRefProfessionByCode;
  }

  bindCopyFrom() {
    this.ContactInfoPersonalForm.patchValue({
      CopyFromContactPerson: this.copyToContactPersonAddrObj[0].Key
    });
  }

  bindAllRefMasterObj() {
    this.bindGenderObj();
    this.bindIdTypeObj();
    this.bindCustRelationshipObj();
  }

  bindGenderObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeGender;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
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
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeIdType;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.ReturnObj];
        if (this.IdTypeObj.length > 0) {
          this.defaultIdType = this.IdTypeObj[0].Key;
        }
      }
    );
  }

  bindCustRelationshipObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.CustRelationshipObj = response[CommonConstant.ReturnObj];
        if (this.CustRelationshipObj.length > 0) {
          this.defaultCustRelationship = this.CustRelationshipObj[0].Key;
          this.defaultRelationshipName = this.CustRelationshipObj[0].Value;
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  cancel() {
    this.modalService.dismissAll();
  }

  CheckSpouse() {
    if (this.ContactInfoPersonalForm.controls.MrCustRelationshipCode.value == CommonConstant.MasteCodeRelationshipSpouse) {
      this.ContactInfoPersonalForm.controls.BirthDt.setValidators([Validators.required]);
      this.ContactInfoPersonalForm.controls.BirthDt.updateValueAndValidity();
      if (this.isMarried == true && this.spouseGender == CommonConstant.MasteCodeGenderMale) {
        this.ContactInfoPersonalForm.patchValue({
          MrGenderCode: CommonConstant.MasteCodeGenderMale
        });
        this.ContactInfoPersonalForm.controls["MrGenderCode"].disable();
      }
      else if (this.isMarried == true && this.spouseGender == CommonConstant.MasterCodeGenderFemale) {
        this.ContactInfoPersonalForm.patchValue({
          MrGenderCode: CommonConstant.MasterCodeGenderFemale
        });
        this.ContactInfoPersonalForm.controls["MrGenderCode"].disable();
      }
      else {
        this.ContactInfoPersonalForm.controls["MrGenderCode"].enable();
      }
    }
    else {
      this.ContactInfoPersonalForm.controls.BirthDt.clearValidators();
      this.ContactInfoPersonalForm.controls.BirthDt.updateValueAndValidity();
      this.ContactInfoPersonalForm.controls["MrGenderCode"].enable();
    }
  }

}
