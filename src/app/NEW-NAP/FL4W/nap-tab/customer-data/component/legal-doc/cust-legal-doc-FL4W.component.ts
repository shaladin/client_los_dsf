import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { formatDate } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-cust-legal-doc-FL4W',
  templateUrl: './cust-legal-doc-FL4W.component.html',
  styleUrls: [],
  providers: [NGXToastrService],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustLegalDocFL4WComponent implements OnInit {

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


  LegalDocForm = this.fb.group({
    MrLegalDocTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    DocNo: ['', [Validators.required, Validators.maxLength(50)]],
    DocDt: ['', Validators.required],
    DocExpiredDt: ['', Validators.required],
    ReleaseBy: ['', Validators.maxLength(200)],
    DocNotes: ['', Validators.maxLength(1000)],
    ReleaseLocation: ['', Validators.maxLength(200)]
  });


  constructor(private fb: FormBuilder, private http: HttpClient, private modalService: NgbModal, private toastr: NGXToastrService) {
  }

  ngOnInit() {
    this.bindLegalDocTypeObj();
  }

  SaveForm() {
    this.appCustCompanyLegalDocObj = new AppCustCompanyLegalDocObj();
    if (this.listLegalDoc == undefined) {
      this.listLegalDoc = new Array<AppCustCompanyLegalDocObj>();
    }
    this.setAppCustCompanyLegalDoc();

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
      ReleaseLocation: this.listLegalDoc[i].ReleaseLocation
    });
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
      DocExpiredDt: ['', Validators.required],
      ReleaseBy: ['', Validators.maxLength(200)],
      DocNotes: ['', Validators.maxLength(1000)],
      ReleaseLocation: ['', Validators.maxLength(200)]
    });
    this.selectedLegalDocName = this.defaultLegalDocName;
  }

  setAppCustCompanyLegalDoc() {
    this.appCustCompanyLegalDocObj.MrLegalDocTypeCode = this.LegalDocForm.controls.MrLegalDocTypeCode.value;
    this.appCustCompanyLegalDocObj.DocDt = this.LegalDocForm.controls.DocDt.value;
    this.appCustCompanyLegalDocObj.DocNo = this.LegalDocForm.controls.DocNo.value;
    this.appCustCompanyLegalDocObj.DocExpiredDt = this.LegalDocForm.controls.DocExpiredDt.value;
    this.appCustCompanyLegalDocObj.ReleaseBy = this.LegalDocForm.controls.ReleaseBy.value;
    this.appCustCompanyLegalDocObj.DocNotes = this.LegalDocForm.controls.DocNotes.value;
    this.appCustCompanyLegalDocObj.ReleaseLocation = this.LegalDocForm.controls.ReleaseLocation.value;
    this.appCustCompanyLegalDocObj.LegalDocName = this.selectedLegalDocName;
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
