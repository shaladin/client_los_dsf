import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-nap-cust-company-legal-doc-detail',
  templateUrl: './new-nap-cust-company-legal-doc-detail.component.html',
  styles: []
})
export class NewNapCustCompanyLegalDocDetailComponent implements OnInit {
  @Input() AppCustCompanyId: number;
  @Input() ListAppCustCompanyLegalDoc: Array<AppCustCompanyLegalDocObj>;
  @Input() AppCustCompanyLegalDoc: AppCustCompanyLegalDocObj;
  @Input() EditedIndex: number;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  IsExpDateMandatory: boolean;
  BusinessDt: Date;
  UserAccess: Object;
  LegalDocTypeObj: Array<KeyValueObj> = new Array();
  AppCustCompanyLegalDocObj: AppCustCompanyLegalDocObj = new AppCustCompanyLegalDocObj();

  LegalDocForm = this.fb.group({
    MrLegalDocTypeCode: ['', Validators.required],
    DocNo: [''],
    DocDt: ['', Validators.required],
    DocExpiredDt: [''],
    NotaryName: [''],
    NotaryLocation: [''],
    DocNotes: [''],
    RowVersion: ['']
  })

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.BusinessDt = this.UserAccess[CommonConstant.BUSINESS_DT];

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeLegalDocType}).subscribe(
      (response) => {
        this.LegalDocTypeObj = response[CommonConstant.ReturnObj];
        this.LegalDocForm.patchValue({
          MrLegalDocTypeCode : this.LegalDocTypeObj[0].Key
        });

        if(this.AppCustCompanyLegalDoc){
          this.LegalDocForm.patchValue({
            MrLegalDocTypeCode: this.AppCustCompanyLegalDoc.MrLegalDocTypeCode,
            DocNo: this.AppCustCompanyLegalDoc.DocNo,
            DocDt:  formatDate(this.AppCustCompanyLegalDoc.DocDt, 'yyyy-MM-dd', 'en-US'),
            DocExpiredDt:  formatDate(this.AppCustCompanyLegalDoc.DocExpiredDt, 'yyyy-MM-dd', 'en-US'),
            NotaryName: this.AppCustCompanyLegalDoc.NotaryName,
            NotaryLocation: this.AppCustCompanyLegalDoc.NotaryLocation,
            DocNotes: this.AppCustCompanyLegalDoc.DocNotes,
            RowVersion: this.AppCustCompanyLegalDoc.RowVersion
          })
          this.ChangeLegalDocType({selectedIndex : 0}, true);
          this.LegalDocForm.controls.MrLegalDocTypeCode.disable();
          this.LegalDocForm.updateValueAndValidity();
        }else{
          this.LegalDocForm = this.fb.group({
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
    if(this.EditedIndex == -1 && this.ListAppCustCompanyLegalDoc.find(x => x.MrLegalDocTypeCode == this.LegalDocForm.controls.MrLegalDocTypeCode.value)){
      let ErrorOutput = this.LegalDocTypeObj.find(x => x.Key == this.LegalDocForm.controls.MrLegalDocTypeCode.value);
      this.toastr.warningMessage("There's Already " + ErrorOutput.Value + " Document")
    }else{
      this.AppCustCompanyLegalDocObj = this.LegalDocForm.value;
      this.AppCustCompanyLegalDocObj.MrLegalDocTypeCode = this.LegalDocForm.controls.MrLegalDocTypeCode.value;
      this.AppCustCompanyLegalDocObj.AppCustCompanyId = this.AppCustCompanyId;
      if(this.EditedIndex == -1){
        this.ListAppCustCompanyLegalDoc.push(this.AppCustCompanyLegalDocObj);
      }else{
        this.ListAppCustCompanyLegalDoc[this.EditedIndex] = this.AppCustCompanyLegalDocObj;
      }
      this.OutputTab.emit({ ListAppCustCompanyLegalDoc: this.ListAppCustCompanyLegalDoc });    
    }    
  }

}
