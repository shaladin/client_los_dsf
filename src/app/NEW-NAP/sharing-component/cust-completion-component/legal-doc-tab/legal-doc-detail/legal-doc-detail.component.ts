import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant'
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-legal-doc-detail',
  templateUrl: './legal-doc-detail.component.html',
  styleUrls: ['./legal-doc-detail.component.scss']
})
export class LegalDocDetailComponent implements OnInit {

  @Input() AppCustCompanyId: number;
  @Input() InputTab: AppCustCompanyLegalDocObj;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  IsExpDateMandatory: boolean;
  BusinessDt: Date;
  UserAccess: Object;
  LegalDocTypeObj: Array<KeyValueObj> = new Array();
  AppCustCompanyLegalDocObj: AppCustCompanyLegalDocObj = new AppCustCompanyLegalDocObj();

  LegalDocForm = this.fb.group({
    AppCustCompanyLegalDocId: [0],
    AppCustCompanyId: [0],
    MrLegalDocTypeCode: ['', Validators.required],
    DocNo: [''],
    DocDt: ['', Validators.required],
    DocExpiredDt: [''],
    NotaryName: [''],
    NotaryLocation: [''],
    DocNotes: [''],
    RowVersion: ['']
  })

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) {
  }

  ngOnInit() {
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.BusinessDt = this.UserAccess[CommonConstant.BUSINESS_DT];

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeLegalDocType}).subscribe(
      (response) => {
        this.LegalDocTypeObj = response[CommonConstant.ReturnObj];
        this.LegalDocForm.patchValue({
          MrLegalDocTypeCode : this.LegalDocTypeObj[0].Key
        });

        if(this.InputTab["AppCustCompanyLegalDocId"] != 0){
          this.LegalDocForm.patchValue({
            AppCustCompanyLegalDocId: this.InputTab["AppCustCompanyLegalDocId"],
            AppCustCompanyId: this.InputTab["AppCustCompanyId"],
            MrLegalDocTypeCode: this.InputTab["MrLegalDocTypeCode"],
            DocNo: this.InputTab["DocNo"],
            DocDt:  formatDate(this.InputTab["DocDt"], 'yyyy-MM-dd', 'en-US'),
            DocExpiredDt:  formatDate(this.InputTab["DocExpiredDt"], 'yyyy-MM-dd', 'en-US'),
            NotaryName: this.InputTab["NotaryName"],
            NotaryLocation: this.InputTab["NotaryLocation"],
            DocNotes: this.InputTab["DocNotes"],
            RowVersion: this.InputTab["RowVersion"]
          })
          this.ChangeLegalDocType({selectedIndex : 0}, true);
        }else{
          this.LegalDocForm = this.fb.group({
            AppCustCompanyLegalDocId: [0],
            AppCustCompanyId: [0],
            MrLegalDocTypeCode: [this.LegalDocTypeObj[0].Key, Validators.required],
            DocNo: [''],
            DocDt: ['', Validators.required],
            DocExpiredDt: [''],
            NotaryName: [''],
            NotaryLocation: [''],
            DocNotes: [''],
            RowVersion: ['']
          })
          this.ChangeLegalDocType({selectedIndex : 0});
        }
      }
    );
  }

  ChangeLegalDocType(ev, ForEdit: boolean = false){
    var idx = ev.selectedIndex;
    this.http.post(URLConstant.GetDocIsExpDtMandatory, { DocCode: this.LegalDocTypeObj[idx].Key }).subscribe(
      (response) => {
        this.IsExpDateMandatory = response["IsExpDtMandatory"];
        if(!ForEdit){
          this.IsExpDateHandler();
        }
      }
    );
  }

  IsExpDateHandler(){
      this.LegalDocForm.patchValue({
        DocExpiredDt: ""
    });

    if(this.IsExpDateMandatory){
      this.LegalDocForm.controls["DocExpiredDt"].setValidators([Validators.required]);
      this.LegalDocForm.controls["DocExpiredDt"].enable();
    }
    else{
      this.LegalDocForm.controls["DocExpiredDt"].clearValidators();
      this.LegalDocForm.controls["DocExpiredDt"].disable();
    }
    this.LegalDocForm.controls["DocExpiredDt"].updateValueAndValidity();
  }

  Cancel(){
    this.OutputTab.emit();
  }

  SaveForm(){
    this.AppCustCompanyLegalDocObj = this.LegalDocForm.value;
    this.AppCustCompanyLegalDocObj.AppCustCompanyId = this.AppCustCompanyId;
    
    this.http.post(URLConstant.AddEditAppCustCompanyLegalDoc, this.AppCustCompanyLegalDocObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.OutputTab.emit();
      }
    );
  }
}
