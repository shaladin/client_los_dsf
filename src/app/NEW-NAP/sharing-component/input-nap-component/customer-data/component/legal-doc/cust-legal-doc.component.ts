import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { formatDate } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/app-cust-company-legal-doc-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';

@Component({
  selector: 'app-cust-legal-doc',
  templateUrl: './cust-legal-doc.component.html',
  styles:[
    '.disabledLink { color: #ccc; pointer-events:none;}'
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustLegalDocComponent implements OnInit {
  @Input() isLockMode: boolean = false;
  @Input() listLegalDoc: Array<AppCustCompanyLegalDocObj> = new Array<AppCustCompanyLegalDocObj>();

  @Output() callbackSubmit: EventEmitter<any> = new EventEmitter();

  mode: string;
  currentEditedIndex: number;
  closeResult: string;
  appCustCompanyLegalDocObj: AppCustCompanyLegalDocObj;
  refMasterObj = {
    RefMasterTypeCode: ""
  };
  LegalDocTypeObj: Array<KeyValueObj>;
  defaultLegalDocType: string;
  selectedLegalDocName: string;
  defaultLegalDocName: string;
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
    private modalService: NgbModal, private cookieService: CookieService) {

  }

  UserAccess: CurrentUserContext;
  MaxDate: Date;
  ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = new Date(this.UserAccess.BusinessDt);
    this.bindLegalDocTypeObj();
  }

  IsExpDateHandler() {
    var isExpDt = this.LegalDocForm.controls["IsExpDtMandatory"].value;
    console.log("IsExpDt: " + isExpDt);
    this.LegalDocForm.patchValue({
      DocExpiredDt: ""
    });
    if (isExpDt) {
      this.LegalDocForm.controls["DocExpiredDt"].setValidators([Validators.required]);
      this.LegalDocForm.controls["DocExpiredDt"].updateValueAndValidity();
      // this.LegalDocForm.controls["DocExpiredDt"].enable();
      this.isExpDateMandatory = true;
    }
    else {
      this.LegalDocForm.controls["DocExpiredDt"].clearValidators();
      this.LegalDocForm.controls["DocExpiredDt"].updateValueAndValidity();
      // this.LegalDocForm.controls["DocExpiredDt"].disable();
      this.isExpDateMandatory = false;
    }
  }

  SaveForm() {
    this.appCustCompanyLegalDocObj = new AppCustCompanyLegalDocObj();
    if (this.listLegalDoc == undefined) {
      this.listLegalDoc = new Array<AppCustCompanyLegalDocObj>();
    }
    if (this.setAppCustCompanyLegalDoc() == false) return;
    if (this.mode == "Add") {
      this.listLegalDoc.push(this.appCustCompanyLegalDocObj);
    }
    if (this.mode == "Edit") {
      this.listLegalDoc[this.currentEditedIndex] = this.appCustCompanyLegalDocObj;
    }
    this.callbackSubmit.emit(this.listLegalDoc);
    this.modalService.dismissAll();
    this.clearForm();
  }

  add(content) {
    this.mode = "Add";
    this.clearForm();
    this.http.post(URLConstant.GetDocIsExpDtMandatory, { Code: this.LegalDocTypeObj[0].Key }).subscribe(
      (response) => {
        console.log("GetDocIsExpDtMandatory: " + JSON.stringify(response));
        this.LegalDocForm.patchValue({
          IsExpDtMandatory: response["IsExpDtMandatory"]
        });
        this.IsExpDateHandler();
      }
    );
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
      DocExpiredDt: formatDate(this.listLegalDoc[i].DocExpiredDt, 'yyyy-MM-dd', 'en-US'),
      ReleaseBy: this.listLegalDoc[i].ReleaseBy,
      DocNotes: this.listLegalDoc[i].DocNotes,
      ReleaseLocation: this.listLegalDoc[i].ReleaseLocation,
      IsExpDtMandatory: this.listLegalDoc[i].IsExpDtMandatory
    });
    console.log(this.LegalDocForm);
    if (this.listLegalDoc[i].IsExpDtMandatory) {
      this.LegalDocForm.controls["DocExpiredDt"].setValidators([Validators.required]);
      this.LegalDocForm.controls["DocExpiredDt"].updateValueAndValidity();
      // this.LegalDocForm.controls["DocExpiredDt"].enable();
      this.isExpDateMandatory = true;
    }
    else {
      this.LegalDocForm.controls["DocExpiredDt"].clearValidators();
      this.LegalDocForm.controls["DocExpiredDt"].updateValueAndValidity();
      // this.LegalDocForm.controls["DocExpiredDt"].disable();
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
    this.appCustCompanyLegalDocObj.MrLegalDocTypeCode = this.LegalDocForm.controls.MrLegalDocTypeCode.value;
    this.appCustCompanyLegalDocObj.DocDt = this.LegalDocForm.controls.DocDt.value;
    this.appCustCompanyLegalDocObj.DocNo = this.LegalDocForm.controls.DocNo.value;
    this.appCustCompanyLegalDocObj.DocExpiredDt = this.LegalDocForm.controls.DocExpiredDt.value;
    this.appCustCompanyLegalDocObj.ReleaseBy = this.LegalDocForm.controls.ReleaseBy.value;
    this.appCustCompanyLegalDocObj.DocNotes = this.LegalDocForm.controls.DocNotes.value;
    this.appCustCompanyLegalDocObj.ReleaseLocation = this.LegalDocForm.controls.ReleaseLocation.value;
    this.appCustCompanyLegalDocObj.LegalDocName = this.selectedLegalDocName;
    this.appCustCompanyLegalDocObj.IsExpDtMandatory = this.LegalDocForm.controls.IsExpDtMandatory.value;
    var currentEditedIndex = -1;
    if (this.mode == "Edit") {
      currentEditedIndex = this.currentEditedIndex;
    }
    flag = this.cekDuplicateDocType(currentEditedIndex);
    let d1 = new Date(this.MaxDate);
    let d2 = new Date(this.appCustCompanyLegalDocObj.DocDt);
    let d3 = new Date(this.appCustCompanyLegalDocObj.DocExpiredDt);
    if (d1 > d3 && d1 != d3) {
      this.toastr.warningMessage(ExceptionConstant.EXPIRED_DATE_CANNOT_LESS_THAN + this.MaxDate);
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
      var duplicateIndex = this.listLegalDoc.findIndex(x => x.MrLegalDocTypeCode == this.appCustCompanyLegalDocObj.MrLegalDocTypeCode);
      if (duplicateIndex != currentEditedIndex && duplicateIndex != -1) {
        this.toastr.warningMessage("Legal Document Type " + this.appCustCompanyLegalDocObj.MrLegalDocTypeCode + " is duplicated ");
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
    console.log("selectedLegalDocName: " + this.selectedLegalDocName);
    this.http.post(URLConstant.GetDocIsExpDtMandatory, { Code: this.selectedLegalDocName }).subscribe(
      (response) => {
        this.LegalDocForm.patchValue({
          IsExpDtMandatory: response["IsExpDtMandatory"]
        });
        this.IsExpDateHandler();
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
