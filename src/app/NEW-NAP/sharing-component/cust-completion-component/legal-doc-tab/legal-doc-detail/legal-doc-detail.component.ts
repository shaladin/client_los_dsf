import { formatDate, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant'
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/app-cust-company-legal-doc-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { UcDropdownListCallbackObj, UcDropdownListConstant, UcDropdownListObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { String } from 'typescript-string-operations';

@Component({
  selector: 'app-legal-doc-detail',
  templateUrl: './legal-doc-detail.component.html',
  styleUrls: ['./legal-doc-detail.component.scss']
})
export class LegalDocDetailComponent implements OnInit {

  @Input() AppCustCompanyId: number;
  @Input() ListAppCustCompanyLegalDoc: Array<AppCustCompanyLegalDocObj>;
  @Input() AppCustCompanyLegalDoc: AppCustCompanyLegalDocObj;
  @Input() ListLegalDocCantDuplicate: Array<string>;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();

  IsDisabled: boolean = false;
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

  isDataExist: boolean = false;
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
          this.isDataExist = true;
          this.LegalDocForm.patchValue({
            AppCustCompanyLegalDocId: this.AppCustCompanyLegalDoc.AppCustCompanyLegalDocId,
            AppCustCompanyId: this.AppCustCompanyLegalDoc.AppCustCompanyId,
            MrLegalDocTypeCode: this.AppCustCompanyLegalDoc.MrLegalDocTypeCode,
            DocNo: this.AppCustCompanyLegalDoc.DocNo,
            DocDt: formatDate(this.AppCustCompanyLegalDoc.DocDt, 'yyyy-MM-dd', 'en-US'),
            DocExpiredDt: this.AppCustCompanyLegalDoc.DocExpiredDt != null ? formatDate(this.AppCustCompanyLegalDoc.DocExpiredDt, 'yyyy-MM-dd', 'en-US') : '',
            NotaryName: this.AppCustCompanyLegalDoc.NotaryName,
            NotaryLocation: this.AppCustCompanyLegalDoc.NotaryLocation,
            DocNotes: this.AppCustCompanyLegalDoc.DocNotes,
            RowVersion: this.AppCustCompanyLegalDoc.RowVersion
          })
          this.IsDisabled = true;
          temp.selectedValue = this.LegalDocTypeObj[0].Key;
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
        }
        this.isDdlMrLegalDocTypeReady = true;
      }
    );
  }

  Cancel() {
    this.OutputTab.emit();
  }

  CekDtValidity() {
    let flag = false;

    let bzDt = new Date(this.MaxBusinessDt);
    let issueDt = new Date(this.LegalDocForm.get("DocDt").value);
    let expDt = this.LegalDocForm.get("DocExpiredDt").value != '' ? new Date(this.LegalDocForm.get("DocExpiredDt").value) : null;
    
    if (expDt != null && bzDt > expDt && bzDt != expDt) {
      this.toastr.warningMessage(ExceptionConstant.EXPIRED_DATE_CANNOT_LESS_THAN + this.MaxBusinessDt);
      flag = true;
    }

    bzDt.setDate(bzDt.getDate() + 1);
    if (bzDt < issueDt && bzDt != issueDt) {
      this.toastr.warningMessage(ExceptionConstant.ISSUED_DATE_CANNOT_MORE_THAN + this.MaxBusinessDt);
      flag = true;
    }

    if (expDt != null && issueDt.getTime() > expDt.getTime()) {
      this.toastr.warningMessage(ExceptionConstant.ISSUED_DATE_CANNOT_MORE_THAN_EXP_DT);
      flag = true;
    }

    return flag;
  }

  SaveForm() {
    if (this.datePipe.transform(this.LegalDocForm.controls.DocDt.value, "yyyy-MM-dd") > this.datePipe.transform(this.MaxBusinessDt, "yyyy-MM-dd")) {
      this.toastr.warningMessage(ExceptionConstant.ISSUED_DATE_CANNOT_MORE_THAN + this.datePipe.transform(this.MaxBusinessDt, 'MMMM d, y'));
      return;
    }

    let existAppCustCompanyLegalDoc = this.ListAppCustCompanyLegalDoc.find(x => x.MrLegalDocTypeCode == this.LegalDocForm.controls.MrLegalDocTypeCode.value
                                        && x.DocNo == this.LegalDocForm.controls.DocNo.value
                                        && x.AppCustCompanyLegalDocId != this.AppCustCompanyLegalDoc.AppCustCompanyLegalDocId);

    if (existAppCustCompanyLegalDoc != null) { 
      var checkGSValue = this.ListLegalDocCantDuplicate.find(x => x == existAppCustCompanyLegalDoc.MrLegalDocTypeCode);
      if(checkGSValue != null){
        let ErrorOutput = this.LegalDocTypeObj.find(x => x.Key == this.LegalDocForm.controls.MrLegalDocTypeCode.value);
        this.toastr.warningMessage(String.Format(ExceptionConstant.DUPLICATE_LEGAL_DOC, ErrorOutput.Value, this.LegalDocForm.value.DocNo));
        return;
      }
    }

    if (this.CekDtValidity()) return;
    this.AppCustCompanyLegalDocObj = this.LegalDocForm.value;
    this.AppCustCompanyLegalDocObj.MrLegalDocTypeCode = this.LegalDocForm.controls.MrLegalDocTypeCode.value;
    this.AppCustCompanyLegalDocObj.AppCustCompanyId = this.AppCustCompanyId;

    if (!this.isDataExist) {
      this.http.post(URLConstant.AddAppCustCompanyLegalDoc, this.AppCustCompanyLegalDocObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.OutputTab.emit();
        }
      );
    } else {
      this.http.post(URLConstant.EditAppCustCompanyLegalDoc, this.AppCustCompanyLegalDocObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.OutputTab.emit();
        }
      );
    }
    
  }
}
