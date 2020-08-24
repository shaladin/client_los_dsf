import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlContainer, FormGroupDirective, Validators, FormBuilder } from '@angular/forms';
import { AppGuarantorCompanyLegalDocObj } from 'app/shared/model/AppGuarantorCompanyLegalDocObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-guarantor-legal-doc',
  templateUrl: './guarantor-legal-doc.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class GuarantorLegalDocComponent implements OnInit {


  @Input() listLegalDoc: Array<AppGuarantorCompanyLegalDocObj> = new Array<AppGuarantorCompanyLegalDocObj>();

  @Output() callbackSubmit: EventEmitter<any> = new EventEmitter();

  mode: any;
  currentEditedIndex: any;
  closeResult: any;
  appGuarantorCompanyLegalDocObj: AppGuarantorCompanyLegalDocObj;
  refMasterObj = {
    RefMasterTypeCode: ""
  };
  LegalDocTypeObj: any;
  defaultLegalDocType: any;
  selectedLegalDocName: any;
  defaultLegalDocName: any;
  modal: any;
  isExpDateMandatory: boolean = false;


  LegalDocForm = this.fb.group({
    MrLegalDocTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    DocNo: ['', [Validators.required, Validators.maxLength(50)]],
    DocDt: ['', Validators.required],
    DocExpiredDt: [''],
    ReleaseBy: ['', Validators.maxLength(200)],
    DocNotes: ['', Validators.maxLength(1000)],
    ReleaseLocation: ['', Validators.maxLength(200)],
    IsExpDtMandatory: [false]
  });

  constructor(
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    private http: HttpClient,
    private modalService: NgbModal,) {

  }
  UserAccess: any;
  MaxDate: Date;

  ngOnInit() {
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = new Date(this.UserAccess.BusinessDt);
    this.bindLegalDocTypeObj();
  }

  IsExpDateHandler(e){
    this.LegalDocForm.patchValue({
      DocExpiredDt: ""
    });
    if(e.target.checked){
      this.LegalDocForm.controls["DocExpiredDt"].setValidators([Validators.required]);
      this.LegalDocForm.controls["DocExpiredDt"].updateValueAndValidity();
      this.LegalDocForm.controls["DocExpiredDt"].enable();
      this.isExpDateMandatory = true;
    }
    else{
      this.LegalDocForm.controls["DocExpiredDt"].clearValidators();
      this.LegalDocForm.controls["DocExpiredDt"].updateValueAndValidity();
      this.LegalDocForm.controls["DocExpiredDt"].disable();
      this.isExpDateMandatory = false;
    }
  }

  SaveForm() {
    this.appGuarantorCompanyLegalDocObj = new AppGuarantorCompanyLegalDocObj();
    if (this.listLegalDoc == undefined) {
      this.listLegalDoc = new Array<AppGuarantorCompanyLegalDocObj>();
    }
    if (this.setAppCustCompanyLegalDoc() == false) return;
    if (this.mode == "Add") {
      this.listLegalDoc.push(this.appGuarantorCompanyLegalDocObj);
    }
    if (this.mode == "Edit") {
      this.listLegalDoc[this.currentEditedIndex] = this.appGuarantorCompanyLegalDocObj;
    }
    this.callbackSubmit.emit(this.listLegalDoc);
    this.modal.close();
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
    this.LegalDocForm.patchValue({
      MrLegalDocTypeCode: this.listLegalDoc[i].MrLegalDocTypeCode,
      DocNo: this.listLegalDoc[i].DocNo,
      DocDt: formatDate(this.listLegalDoc[i].DocDt, 'yyyy-MM-dd', 'en-US'),
      DocExpiredDt: this.listLegalDoc[i].IsExpDtMandatory ? formatDate(this.listLegalDoc[i].DocExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
      ReleaseBy: this.listLegalDoc[i].ReleaseBy,
      DocNotes: this.listLegalDoc[i].DocNotes,
      ReleaseLocation: this.listLegalDoc[i].ReleaseLocation,
      IsExpDtMandatory: this.listLegalDoc[i].IsExpDtMandatory
    });
    if(this.listLegalDoc[i].IsExpDtMandatory){
      this.LegalDocForm.controls["DocExpiredDt"].setValidators([Validators.required]);
      this.LegalDocForm.controls["DocExpiredDt"].updateValueAndValidity();
      this.LegalDocForm.controls["DocExpiredDt"].enable();
      this.isExpDateMandatory = true;
    }
    else{
      this.LegalDocForm.controls["DocExpiredDt"].clearValidators();
      this.LegalDocForm.controls["DocExpiredDt"].updateValueAndValidity();
      this.LegalDocForm.controls["DocExpiredDt"].disable();
      this.isExpDateMandatory = false;
    }
    this.selectedLegalDocName = this.listLegalDoc[i].LegalDocName;
    this.open(content);
  }

  delete(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.listLegalDoc.splice(i, 1);
      this.callbackSubmit.emit(this.listLegalDoc);
    }
  }

  clearForm() {
    this.LegalDocForm = this.fb.group({
      MrLegalDocTypeCode: [this.defaultLegalDocType, [Validators.required, Validators.maxLength(50)]],
      DocNo: ['', [Validators.required, Validators.maxLength(50)]],
      DocDt: ['', Validators.required],
      DocExpiredDt: [''],
      ReleaseBy: ['', Validators.maxLength(200)],
      DocNotes: ['', Validators.maxLength(1000)],
      ReleaseLocation: ['', Validators.maxLength(200)],
      IsExpDtMandatory: [false]
    });
    this.selectedLegalDocName = this.defaultLegalDocName;
  }

  setAppCustCompanyLegalDoc() {
    var flag: boolean = true;
    this.appGuarantorCompanyLegalDocObj.MrLegalDocTypeCode = this.LegalDocForm.controls.MrLegalDocTypeCode.value;
    this.appGuarantorCompanyLegalDocObj.DocDt = this.LegalDocForm.controls.DocDt.value;
    this.appGuarantorCompanyLegalDocObj.DocNo = this.LegalDocForm.controls.DocNo.value;
    this.appGuarantorCompanyLegalDocObj.DocExpiredDt = this.LegalDocForm.controls.DocExpiredDt.value;
    this.appGuarantorCompanyLegalDocObj.ReleaseBy = this.LegalDocForm.controls.ReleaseBy.value;
    this.appGuarantorCompanyLegalDocObj.DocNotes = this.LegalDocForm.controls.DocNotes.value;
    this.appGuarantorCompanyLegalDocObj.ReleaseLocation = this.LegalDocForm.controls.ReleaseLocation.value;
    this.appGuarantorCompanyLegalDocObj.LegalDocName = this.selectedLegalDocName;
    this.appGuarantorCompanyLegalDocObj.IsExpDtMandatory = this.LegalDocForm.controls.IsExpDtMandatory.value;
    var currentEditedIndex = -1;
    if (this.mode == "Edit") {
      currentEditedIndex = this.currentEditedIndex;
    }
    flag = this.cekDuplicateDocType(currentEditedIndex);
    let d1 = new Date(this.MaxDate);
    let d2 = new Date(this.appGuarantorCompanyLegalDocObj.DocDt);
    let d3 = new Date(this.appGuarantorCompanyLegalDocObj.DocExpiredDt);
    if (d1 > d3 && d1 != d3) {
      this.toastr.warningMessage(ExceptionConstant.EXPIRED_DATE_CANNOT_LESS_THAN+ this.MaxDate);
      flag = false;
    }
    d1.setDate(d1.getDate() + 1);
    if (d1 < d2 && d1 != d2) {
      this.toastr.warningMessage(ExceptionConstant.ISSUED_DATE_CANNOT_MORE_THAN + this.MaxDate);
      flag = false;
    }
    return flag;
  }

  cekDuplicateDocType(currentEditedIndex) {
    if (this.listLegalDoc.length > 0) {
      var duplicateIndex = this.listLegalDoc.findIndex(x => x.MrLegalDocTypeCode == this.appGuarantorCompanyLegalDocObj.MrLegalDocTypeCode);
      if (duplicateIndex != currentEditedIndex && duplicateIndex != -1) {
        this.toastr.warningMessage("Legal Document Type " + this.appGuarantorCompanyLegalDocObj.MrLegalDocTypeCode + " is duplicated ");
        return false;
      }
    }
    return true;
  }
  bindLegalDocTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeLegalDocType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.LegalDocTypeObj = response[CommonConstant.ReturnObj];
        if (this.LegalDocTypeObj.length > 0) {
          this.defaultLegalDocType = this.LegalDocTypeObj[0].Key;
          this.defaultLegalDocName = this.LegalDocTypeObj[0].Value;
        }
      }
    );
  }

  changeLegalDocType(ev) {
    var idx = ev.target.selectedIndex;
    this.selectedLegalDocName = this.LegalDocTypeObj[idx].Value;
  }

  open(content) {
    this.modal = this.modalService.open(content);
    this.modal.result.then((result) => {
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
    this.modal.close();
  }
}
