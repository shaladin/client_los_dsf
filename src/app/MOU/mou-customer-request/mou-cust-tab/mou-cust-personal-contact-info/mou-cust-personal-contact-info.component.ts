import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { formatDate } from '@angular/common';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { MouCustPersonalContactPersonObj } from 'app/shared/model/MouCustPersonalContactPersonObj.Model';

@Component({
  selector: 'app-mou-cust-personal-contact-info',
  templateUrl: './mou-cust-personal-contact-info.component.html',
  styleUrls: ['./mou-cust-personal-contact-info.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class MouCustPersonalContactInfoComponent implements OnInit {
  @Input() listContactPersonPersonal: Array<MouCustPersonalContactPersonObj> = new Array<MouCustPersonalContactPersonObj>();
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
  MouCustPersonalContactPersonObj: MouCustPersonalContactPersonObj;
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
  InputLookupProfessionObj: InputLookupObj = new InputLookupObj();
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
    IsGuarantor:[false]
  });


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

  SaveForm(){
    this.MouCustPersonalContactPersonObj = new MouCustPersonalContactPersonObj();
    if(this.listContactPersonPersonal == undefined){
      this.listContactPersonPersonal = new Array<MouCustPersonalContactPersonObj>();
    }
    var userAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var businessDtStr = formatDate(userAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
    var businessDt = new Date(businessDtStr);
    var birthDt = new Date(this.ContactInfoPersonalForm.controls.BirthDt.value);

    if(birthDt > businessDt){
      this.toastr.warningMessage(ExceptionConstant.BIRTH_DATE_CANNOT_MORE_THAN + businessDtStr);
      return;
    }

    this.setAppCustPersonalContactPerson();
    if(this.mode == "Add"){
      this.listContactPersonPersonal.push(this.MouCustPersonalContactPersonObj);
    }
    if(this.mode == "Edit"){
      this.listContactPersonPersonal[this.currentEditedIndex] = this.MouCustPersonalContactPersonObj;
    }
    this.callbackSubmit.emit(this.listContactPersonPersonal);
    this.modalService.dismissAll();
    this.clearForm();
  }

  add(content){
    this.mode = "Add";
    this.clearForm();
    this.open(content);
  }

  edit(i, content){
    this.clearForm();
    this.mode = "Edit";
    this.currentEditedIndex = i;
    var birthDt;
    if(this.listContactPersonPersonal[i].BirthDt != undefined){
      if(this.listContactPersonPersonal[i].BirthDt.toString() != ''){
        birthDt = formatDate(this.listContactPersonPersonal[i].BirthDt, 'yyyy-MM-dd', 'en-US');
      }else{
        birthDt = '';
      }
    }else{
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

  setCustRelationShip(MrCustRelationshipCode: string){
    var selectedRelationship = this.CustRelationshipObj.find(x => x.Key == MrCustRelationshipCode);
    this.selectedRelationshipName = selectedRelationship.Value;
  }

  delete(i){
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.listContactPersonPersonal.splice(i, 1);
      this.callbackSubmit.emit(this.listContactPersonPersonal);
    }
  }

  clearForm(){
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
    this.contactPersonAddrObj = new AddrObj();
    this.selectedGenderName = this.defaultGenderName;
    this.selectedRelationshipName = this.defaultRelationshipName;

    this.initLookup();
    this.initContactPersonAddrObj();
    this.CheckSpouse();
  }

  setAppCustPersonalContactPerson(){
    this.MouCustPersonalContactPersonObj.ContactPersonName = this.ContactInfoPersonalForm.controls.ContactPersonName.value;
    this.MouCustPersonalContactPersonObj.MrGenderCode = this.ContactInfoPersonalForm.controls.MrGenderCode.value;
    this.MouCustPersonalContactPersonObj.MrIdTypeCode = this.ContactInfoPersonalForm.controls.MrIdTypeCode.value;
    this.MouCustPersonalContactPersonObj.MrCustRelationshipCode = this.ContactInfoPersonalForm.controls.MrCustRelationshipCode.value;
    this.MouCustPersonalContactPersonObj.IdNo = this.ContactInfoPersonalForm.controls.IdNo.value;
    this.MouCustPersonalContactPersonObj.MrJobProfessionCode = this.selectedProfessionCode;
    this.MouCustPersonalContactPersonObj.BirthPlace = this.ContactInfoPersonalForm.controls.BirthPlace.value;
    this.MouCustPersonalContactPersonObj.BirthDt = this.ContactInfoPersonalForm.controls.BirthDt.value;
    this.MouCustPersonalContactPersonObj.IsEmergencyContact = this.ContactInfoPersonalForm.controls.IsEmergencyContact.value;
    this.MouCustPersonalContactPersonObj.IsFamily = this.ContactInfoPersonalForm.controls.IsFamily.value;
    this.MouCustPersonalContactPersonObj.MobilePhnNo1 = this.ContactInfoPersonalForm.controls.MobilePhnNo1.value;
    this.MouCustPersonalContactPersonObj.MobilePhnNo2 = this.ContactInfoPersonalForm.controls.MobilePhnNo2.value;
    this.MouCustPersonalContactPersonObj.Email = this.ContactInfoPersonalForm.controls.Email.value;
    this.MouCustPersonalContactPersonObj.Zipcode = this.ContactInfoPersonalForm.controls["contactPersonAddrZipcode"]["controls"].value.value;
    this.MouCustPersonalContactPersonObj.Addr = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].Addr.value;
    this.MouCustPersonalContactPersonObj.AreaCode1 = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].AreaCode1.value;
    this.MouCustPersonalContactPersonObj.AreaCode2 = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].AreaCode2.value;
    this.MouCustPersonalContactPersonObj.AreaCode3 = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].AreaCode3.value;
    this.MouCustPersonalContactPersonObj.AreaCode4 = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].AreaCode4.value;
    this.MouCustPersonalContactPersonObj.City = this.ContactInfoPersonalForm.controls["contactPersonAddr"]["controls"].City.value;
    this.MouCustPersonalContactPersonObj.GenderName = this.selectedGenderName;
    this.MouCustPersonalContactPersonObj.RelationshipName = this.selectedRelationshipName;
    this.MouCustPersonalContactPersonObj.IsGuarantor = this.ContactInfoPersonalForm.controls.IsGuarantor.value;
  }

  GetProfession(event){
    this.selectedProfessionCode = event.ProfessionCode;
  }

  GenderChanged(event){
    this.selectedGenderName = event.target.options[event.target.options.selectedIndex].text;
  }

  RelationshipChanged(event){
    this.selectedRelationshipName = event.target.options[event.target.options.selectedIndex].text;
    this.CheckSpouse();
  }

  copyFromChanged(){
    this.callbackCopyAddr.emit(this.copyFromContactPerson);
  }

  setContactPersonAddr(appCustPersonalContactPerson){
      this.contactPersonAddrObj = new AddrObj();
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
      this.inputFieldContactPersonObj.inputLookupObj.jsonSelect = {Zipcode: appCustPersonalContactPerson.Zipcode};
    
  }

  setProfessionName(professionCode){
    this.professionObj.ProfessionCode = professionCode;
    this.http.post(this.getRefProfessionUrl, this.professionObj).subscribe(
      (response) => {
        this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
        this.InputLookupProfessionObj.jsonSelect = response;     
      },
      (error) => {
        console.log(error);
      }
    );
  }

  initContactPersonAddrObj(){
    this.inputFieldContactPersonObj = new InputFieldObj();
    this.inputFieldContactPersonObj.inputLookupObj = new InputLookupObj();    
  }

  initLookup(){
    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupProfessionObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.isRequired = false;
  }

  initUrl(){
    this.getCustContactPersonPersonalUrl = URLConstant.GetAppCustPersonalContactPersonsByAppCustPersonalId;
    this.getRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.getRefProfessionUrl = URLConstant.GetRefProfessionByCode;
  }

  bindCopyFrom(){
    this.ContactInfoPersonalForm.patchValue({
      CopyFromContactPerson: this.copyToContactPersonAddrObj[0].Key
    }); 
  }

  bindAllRefMasterObj(){
    this.bindGenderObj();
    this.bindIdTypeObj();
    this.bindCustRelationshipObj();
  }

  bindGenderObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeGender;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if(this.GenderObj.length > 0){
          this.defaultGender = this.GenderObj[0].Key;
          this.defaultGenderName = this.GenderObj[0].Value;
        }
      }
    );
  }

  bindIdTypeObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeIdType;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.ReturnObj];
        if(this.IdTypeObj.length > 0){
          this.defaultIdType = this.IdTypeObj[0].Key;
        }
      }
    );
  }

  bindCustRelationshipObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;  
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.CustRelationshipObj = response[CommonConstant.ReturnObj];
        if(this.CustRelationshipObj.length > 0){
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

  cancel()
  {
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