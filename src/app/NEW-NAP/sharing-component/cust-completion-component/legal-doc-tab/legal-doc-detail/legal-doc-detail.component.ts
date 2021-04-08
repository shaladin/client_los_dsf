import { formatDate, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant'
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { UcDropdownListCallbackObj, UcDropdownListConstant, UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';

@Component({
  selector: 'app-legal-doc-detail',
  templateUrl: './legal-doc-detail.component.html',
  styleUrls: ['./legal-doc-detail.component.scss']
})
export class LegalDocDetailComponent implements OnInit {

  @Input() AppCustCompanyId: number;
  @Input() ListAppCustCompanyLegalDoc: Array<AppCustCompanyLegalDocObj>;
  @Input() AppCustCompanyLegalDoc: AppCustCompanyLegalDocObj;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  IsExpDateMandatory: boolean;
  MinBusinessDt: Date;
  MaxBusinessDt: Date;
  UserAccess: Object;
  LegalDocTypeObj: Array<KeyValueObj> = new Array();
  ddlMrLegalDocTypeObj: UcDropdownListObj = new UcDropdownListObj();
  isDdlMrLegalDocTypeReady: boolean = false;
  AppCustCompanyLegalDocObj: AppCustCompanyLegalDocObj = new AppCustCompanyLegalDocObj();
  datePipe = new DatePipe("en-US");

  LegalDocForm = this.fb.group({
    AppCustCompanyLegalDocId: [0],
    AppCustCompanyId: [0],
    MrLegalDocTypeCode: ['', Validators.required],
    DocNo: ['', Validators.required],
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
    public formValidate: FormValidateService, private cookieService: CookieService) {
  }

  ngOnInit() {
    this.ddlMrLegalDocTypeObj.isSelectOutput = true;
    this.ddlMrLegalDocTypeObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxBusinessDt = new Date(this.UserAccess[CommonConstant.BUSINESS_DT]);
    this.MinBusinessDt = new Date(this.UserAccess[CommonConstant.BUSINESS_DT]);
    this.MinBusinessDt.setDate(this.MinBusinessDt.getDate() + 1);

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeLegalDocType }).subscribe(
      (response) => {
        this.LegalDocTypeObj = response[CommonConstant.ReturnObj];
        this.LegalDocForm.patchValue({
          MrLegalDocTypeCode: this.LegalDocTypeObj[0].Key
        });

        var temp = new UcDropdownListCallbackObj();
        if (this.AppCustCompanyLegalDoc.AppCustCompanyLegalDocId != 0) {
          this.LegalDocForm.patchValue({
            AppCustCompanyLegalDocId: this.AppCustCompanyLegalDoc.AppCustCompanyLegalDocId,
            AppCustCompanyId: this.AppCustCompanyLegalDoc.AppCustCompanyId,
            MrLegalDocTypeCode: this.AppCustCompanyLegalDoc.MrLegalDocTypeCode,
            DocNo: this.AppCustCompanyLegalDoc.DocNo,
            DocDt: formatDate(this.AppCustCompanyLegalDoc.DocDt, 'yyyy-MM-dd', 'en-US'),
            DocExpiredDt: formatDate(this.AppCustCompanyLegalDoc.DocExpiredDt, 'yyyy-MM-dd', 'en-US'),
            NotaryName: this.AppCustCompanyLegalDoc.NotaryName,
            NotaryLocation: this.AppCustCompanyLegalDoc.NotaryLocation,
            DocNotes: this.AppCustCompanyLegalDoc.DocNotes,
            RowVersion: this.AppCustCompanyLegalDoc.RowVersion
          })
          temp.selectedValue = this.LegalDocTypeObj[0].Key;
          this.ChangeLegalDocType(this.LegalDocTypeObj[0].Key, true);
          this.LegalDocForm.controls.MrLegalDocTypeCode.disable();
          this.LegalDocForm.updateValueAndValidity();
        } else {
          this.LegalDocForm = this.fb.group({
            AppCustCompanyLegalDocId: [0],
            AppCustCompanyId: [0],
            MrLegalDocTypeCode: [this.LegalDocTypeObj[0].Key, Validators.required],
            DocNo: ['', Validators.required],
            DocDt: ['', Validators.required],
            DocExpiredDt: [''],
            NotaryName: [''],
            NotaryLocation: [''],
            DocNotes: [''],
            RowVersion: ['']
          })
          this.ChangeLegalDocType(this.LegalDocTypeObj[0].Key);
        }
        this.isDdlMrLegalDocTypeReady = true;
      }
    );
  }

  ChangeLegalDocType(ev : string, ForEdit: boolean = false) {
    this.http.post(URLConstant.GetDocIsExpDtMandatory, { Code: ev }).subscribe(
      (response) => {
        this.IsExpDateMandatory = response["IsExpDtMandatory"];
        if (!ForEdit) {
          this.IsExpDateHandler();
        }
      }
    );
  }

  IsExpDateHandler() {
    if (this.IsExpDateMandatory) {
      this.LegalDocForm.controls["DocExpiredDt"].setValidators([Validators.required]);
      this.LegalDocForm.controls["DocExpiredDt"].enable();
    }
    else {
      this.LegalDocForm.controls["DocExpiredDt"].clearValidators();
      this.LegalDocForm.controls["DocExpiredDt"].disable();
    }
    this.LegalDocForm.controls["DocExpiredDt"].updateValueAndValidity();
  }

  Cancel() {
    this.OutputTab.emit();
  }

  SaveForm() {
    if( this.datePipe.transform(this.LegalDocForm.controls.DocDt.value, "yyyy-MM-dd") > this.datePipe.transform(this.MaxBusinessDt, "yyyy-MM-dd") ){
      this.toastr.warningMessage(ExceptionConstant.ISSUED_DATE_CANNOT_MORE_THAN + this.datePipe.transform(this.MaxBusinessDt, 'MMMM d, y'));
      return;
   } 

    if (this.AppCustCompanyLegalDoc.AppCustCompanyLegalDocId == 0 && this.ListAppCustCompanyLegalDoc.find(x => x.MrLegalDocTypeCode == this.LegalDocForm.controls.MrLegalDocTypeCode.value)) {
      let ErrorOutput = this.LegalDocTypeObj.find(x => x.Key == this.LegalDocForm.controls.MrLegalDocTypeCode.value);
      this.toastr.warningMessage("There's Already " + ErrorOutput.Value + " Document")
    } else {
      this.AppCustCompanyLegalDocObj = this.LegalDocForm.value;
      this.AppCustCompanyLegalDocObj.MrLegalDocTypeCode = this.LegalDocForm.controls.MrLegalDocTypeCode.value;
      this.AppCustCompanyLegalDocObj.AppCustCompanyId = this.AppCustCompanyId;

      this.http.post(URLConstant.AddEditAppCustCompanyLegalDoc, this.AppCustCompanyLegalDocObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.OutputTab.emit();
        }
      );
    }
  }
}
