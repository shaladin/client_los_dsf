import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppCustCompanyContactPersonObj } from 'app/shared/model/AppCustCompanyContactPersonObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-cust-company-contact-information-FL4W',
  templateUrl: './cust-company-contact-information-FL4W.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustCompanyContactInformationFL4WComponent implements OnInit {

  @Input() listContactPersonCompany: any = new Array<AppCustCompanyContactPersonObj>();

  @Output() callbackSubmit: EventEmitter<any> = new EventEmitter();

  mode: string;
  currentEditedIndex: number;
  closeResult: string;
  appCustCompanyContactPersonObj: AppCustCompanyContactPersonObj;
  refMasterObj = {
    RefMasterTypeCode: ""
  };
  JobPositionObj: Array<KeyValueObj>;
  defaultJobPosition: string;
  selectedJobPositionName: string;
  defaultJobPositionName: string;


  ContactInfoCompanyForm = this.fb.group({
    ContactPersonName: ['', [Validators.required, Validators.maxLength(500)]],
    MrJobPositionCode: ['', Validators.maxLength(50)],
    MobilePhnNo1: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    MobilePhnNo2: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    JobTitleName: ['', Validators.maxLength(100)],
    Email1: ['', [Validators.maxLength(50)]]
  });


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal,) {

  }

  ngOnInit() {
    this.bindJobPositionObj();
  }

  SaveForm() {
    this.appCustCompanyContactPersonObj = new AppCustCompanyContactPersonObj();
    if (this.listContactPersonCompany == undefined) {
      this.listContactPersonCompany = new Array<AppCustCompanyContactPersonObj>();
    }
    this.setAppCustCompanyContactPerson();
    if (this.mode == "add") {
      this.listContactPersonCompany.push(this.appCustCompanyContactPersonObj);
    }
    if (this.mode == "edit") {
      this.listContactPersonCompany[this.currentEditedIndex] = this.appCustCompanyContactPersonObj;
    }
    this.callbackSubmit.emit(this.listContactPersonCompany);
    this.modalService.dismissAll();
    this.clearForm();
  }

  add(content) {
    this.mode = "add";
    this.clearForm();
    this.open(content);
  }

  edit(i, content) {
    this.clearForm();
    this.mode = "edit";
    this.currentEditedIndex = i;
    this.ContactInfoCompanyForm.patchValue({
      ContactPersonName: this.listContactPersonCompany[i].ContactPersonName,
      MrJobPositionCode: this.listContactPersonCompany[i].MrJobPositionCode,
      MobilePhnNo1: this.listContactPersonCompany[i].MobilePhnNo1,
      MobilePhnNo2: this.listContactPersonCompany[i].MobilePhnNo2,
      JobTitleName: this.listContactPersonCompany[i].JobTitleName,
      Email1: this.listContactPersonCompany[i].Email1
    });
    this.selectedJobPositionName = this.listContactPersonCompany[i].JobPositionName;
    this.open(content);
  }

  delete(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.listContactPersonCompany.splice(i, 1);
      this.callbackSubmit.emit(this.listContactPersonCompany);
    }
  }

  JobPositionChanged(event) {
    this.selectedJobPositionName = event.target.options[event.target.options.selectedIndex].text;
  }

  clearForm() {
    this.ContactInfoCompanyForm = this.fb.group({
      ContactPersonName: ['', [Validators.required, Validators.maxLength(500)]],
      MrJobPositionCode: [this.defaultJobPosition, Validators.maxLength(50)],
      MobilePhnNo1: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      MobilePhnNo2: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      JobTitleName: ['', Validators.maxLength(100)],
      Email1: ['', Validators.maxLength(50)]
    });
    this.selectedJobPositionName = this.defaultJobPositionName;
  }

  setAppCustCompanyContactPerson() {
    this.appCustCompanyContactPersonObj.ContactPersonName = this.ContactInfoCompanyForm.controls.ContactPersonName.value;
    this.appCustCompanyContactPersonObj.MrJobPositionCode = this.ContactInfoCompanyForm.controls.MrJobPositionCode.value;
    this.appCustCompanyContactPersonObj.MobilePhnNo1 = this.ContactInfoCompanyForm.controls.MobilePhnNo1.value;
    this.appCustCompanyContactPersonObj.MobilePhnNo2 = this.ContactInfoCompanyForm.controls.MobilePhnNo2.value;
    this.appCustCompanyContactPersonObj.JobTitleName = this.ContactInfoCompanyForm.controls.JobTitleName.value;
    this.appCustCompanyContactPersonObj.Email1 = this.ContactInfoCompanyForm.controls.Email1.value;
    this.appCustCompanyContactPersonObj.JobPositionName = this.selectedJobPositionName;
  }

  bindJobPositionObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeJobPosition;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
        if (this.JobPositionObj.length > 0) {
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



}
