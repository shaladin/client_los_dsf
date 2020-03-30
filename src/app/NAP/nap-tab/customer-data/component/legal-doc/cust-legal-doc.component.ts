import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { AppCustPersonalContactPersonObj } from 'app/shared/model/AppCustPersonalContactPersonObj.Model';

import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { RequestCriteriaObj } from 'app/shared/model/RequestCriteriaObj.model';
import { Observable } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AppCustCompanyContactPersonObj } from 'app/shared/model/AppCustCompanyContactPersonObj.Model';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';

@Component({
  selector: 'app-cust-legal-doc',
  templateUrl: './cust-legal-doc.component.html',
  styleUrls: ['./cust-legal-doc.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustLegalDocComponent implements OnInit {

  @Input() listLegalDoc: any = new Array<AppCustCompanyLegalDocObj>();

  @Output() callbackSubmit: EventEmitter<any> = new EventEmitter();

  mode: any;
  currentEditedIndex: any;
  closeResult: any;
  appCustCompanyLegalDocObj: AppCustCompanyLegalDocObj;
  refMasterObj = {
    RefMasterTypeCode: ""
  };
  LegalDocTypeObj: any;
  defaultLegalDocType: any;


  LegalDocForm = this.fb.group({
    MrLegalDocTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    DocNo: ['', [Validators.required, Validators.maxLength(50)]],
    DocDt: ['', Validators.required],
    DocExpiredDt: ['', Validators.required],
    ReleaseBy: ['', Validators.maxLength(200)],
    DocNotes: ['', Validators.maxLength(1000)],
    ReleaseLocation: ['', Validators.maxLength(200)]
  });


  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,) {

     }

  ngOnInit() {
    this.bindLegalDocTypeObj();
  }

  SaveForm(){
    this.appCustCompanyLegalDocObj = new AppCustCompanyLegalDocObj();
    if(this.listLegalDoc == undefined){
      this.listLegalDoc = new Array<AppCustCompanyLegalDocObj>();
    }
    this.setAppCustCompanyLegalDoc();
    if(this.mode == "Add"){
      this.listLegalDoc.push(this.appCustCompanyLegalDocObj);
    }
    if(this.mode == "Edit"){
      this.listLegalDoc[this.currentEditedIndex] = this.appCustCompanyLegalDocObj;
    }
    this.callbackSubmit.emit(this.listLegalDoc);
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
    this.LegalDocForm.patchValue({
      MrLegalDocTypeCode: this.listLegalDoc[i].MrLegalDocTypeCode,
      DocNo: this.listLegalDoc[i].DocNo,
      DocDt: formatDate(this.listLegalDoc[i].DocDt, 'yyyy-MM-dd', 'en-US'),
      DocExpiredDt: formatDate(this.listLegalDoc[i].DocExpiredDt, 'yyyy-MM-dd', 'en-US'),
      ReleaseBy: this.listLegalDoc[i].ReleaseBy,
      DocNotes: this.listLegalDoc[i].DocNotes,
      ReleaseLocation: this.listLegalDoc[i].ReleaseLocation
    });
    this.open(content);
  }

  delete(i){
    if (confirm("Are you sure to delete this record?")) {
      this.listLegalDoc.splice(i, 1);
      this.callbackSubmit.emit(this.listLegalDoc);
    }
  }

  clearForm(){
    this.LegalDocForm = this.fb.group({
      MrLegalDocTypeCode: [this.defaultLegalDocType, [Validators.required, Validators.maxLength(50)]],
      DocNo: ['', [Validators.required, Validators.maxLength(50)]],
      DocDt: ['', Validators.required],
      DocExpiredDt: ['', Validators.required],
      ReleaseBy: ['', Validators.maxLength(200)],
      DocNotes: ['', Validators.maxLength(1000)],
      ReleaseLocation: ['', Validators.maxLength(200)]
    });

  }

  setAppCustCompanyLegalDoc(){
    this.appCustCompanyLegalDocObj.MrLegalDocTypeCode = this.LegalDocForm.controls.MrLegalDocTypeCode.value;
    this.appCustCompanyLegalDocObj.DocDt =  this.LegalDocForm.controls.DocDt.value;
    this.appCustCompanyLegalDocObj.DocNo = this.LegalDocForm.controls.DocNo.value;
    this.appCustCompanyLegalDocObj.DocExpiredDt = this.LegalDocForm.controls.DocExpiredDt.value;
    this.appCustCompanyLegalDocObj.ReleaseBy = this.LegalDocForm.controls.ReleaseBy.value;
    this.appCustCompanyLegalDocObj.DocNotes = this.LegalDocForm.controls.DocNotes.value;
    this.appCustCompanyLegalDocObj.ReleaseLocation = this.LegalDocForm.controls.ReleaseLocation.value;
  }

  bindLegalDocTypeObj(){
    this.refMasterObj.RefMasterTypeCode = "LEGAL_DOC_TYPE";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.LegalDocTypeObj = response["ReturnObject"];
        if(this.LegalDocTypeObj.length > 0){
            this.defaultLegalDocType = this.LegalDocTypeObj[0].Key;
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



}
