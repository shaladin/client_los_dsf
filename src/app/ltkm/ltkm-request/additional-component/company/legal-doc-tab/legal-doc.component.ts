import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { LtkmCustCompanyLegalDocObj } from 'app/shared/model/LTKM/LtkmCustCompanyLegalDocObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
    selector: 'app-ltkm-legal-doc-tab',
    templateUrl: './legal-doc.component.html',
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class LtkmLegalDocComponent implements OnInit {

    @Input() enjiForm: NgForm;
    @Input() parentForm: FormGroup;
    @Input() identifier: string;
    @Input() isLockMode: boolean = false;

    @Input() AppCustId: number;
    @Input() AppCustCompanyId: number;
    @Output() UpdateSource: EventEmitter<any> = new EventEmitter();
    @Input() listLtkmCustCompanyLegalDoc: Array<LtkmCustCompanyLegalDocObj> = new Array<LtkmCustCompanyLegalDocObj>();
    LtkmCustCompanyLegalDoc: LtkmCustCompanyLegalDocObj = new LtkmCustCompanyLegalDocObj();
    IsDetail: boolean = false;
    ListLegalDoc: Array<AppCustCompanyLegalDocObj> = new Array();
    InputGridObj: InputGridObj = new InputGridObj();

    LegalDocTypeObj: Array<KeyValueObj> = new Array();

    IsExpDateMandatory: boolean;
    currentIndex: number = -1;

    Mode: string = "Add";
    Title: string = "Legal Document Detail"

    constructor(private fb: FormBuilder,
        private http: HttpClient,
        private toastr: NGXToastrService,
        public formValidate: FormValidateService) { }

    setForm() {
        this.parentForm.addControl(this.identifier, this.fb.group({
            LtkmCustCompanyLegalDocId: [0],
            LtkmCustCompanyId: [0],
            MrLegalDocTypeCode: [this.LegalDocTypeObj[0].Key],
            DocNo: [''],
            DocDt: [''],
            DocExpiredDt: [''],
            NotaryName: [''],
            NotaryLocation: [''],
            DocNotes: [''],
            RowVersion: ['']
        }));
        this.ChangeLegalDocType({
            selectedIndex: 0
        });
    }

    ngOnInit() {

        this.parentForm.addControl(this.identifier, this.fb.group({
            LtkmCustCompanyLegalDocId: [0],
            LtkmCustCompanyId: [0],
            MrLegalDocTypeCode: [''],
            DocNo: [''],
            DocDt: [''],
            DocExpiredDt: [''],
            NotaryName: [''],
            NotaryLocation: [''],
            DocNotes: [''],
            RowVersion: ['']
        }));

        this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {
            RefMasterTypeCode: CommonConstant.RefMasterTypeCodeLegalDocType
        }).subscribe(
            (response) => {
                this.LegalDocTypeObj = response[CommonConstant.ReturnObj];
            });
    }

    ClearForm() {
        this.parentForm['controls'][this.identifier].patchValue({
            LtkmCustCompanyLegalDocId: 0,
            LtkmCustCompanyId: 0,
            MrLegalDocTypeCode: this.LegalDocTypeObj[0].Key,
            DocNo: '',
            DocDt: '',
            DocExpiredDt: '',
            NotaryName: '',
            NotaryLocation: '',
            DocNotes: '',
            RowVersion: ''
        })
    }

    LegalDocHandler(Mode: string, legalcustcompanyobj: LtkmCustCompanyLegalDocObj = undefined, index: number) {
        this.ClearForm();
        switch (Mode) {
            case "Add":
                this.IsDetail = true;
                this.Mode = "Add";
                this.setForAdd();
                break;
            case "Edit":
                this.SetForEdit(legalcustcompanyobj, index);
                this.currentIndex = index;
                this.IsDetail = true;
                this.Mode = "Edit";
                this.Title = "Edit Bank Account";
                break;
            case "Delete":
                this.IsDetail = false;
                this.DeleteLegalDoc(index);
                break;
            case "Cancel":
                this.IsDetail = false;
                break;
        }
        if (this.IsDetail) {
            this.parentForm['controls'][this.identifier]['controls']['MrLegalDocTypeCode'].setValidators([Validators.required]);
            this.parentForm['controls'][this.identifier]['controls']['DocDt'].setValidators([Validators.required]);
        } else {
            this.parentForm['controls'][this.identifier]['controls']['MrLegalDocTypeCode'].clearValidators();
            this.parentForm['controls'][this.identifier]['controls']['DocDt'].clearValidators();
            this.parentForm['controls'][this.identifier]['controls']['DocExpiredDt'].clearValidators();
        }

        this.parentForm['controls'][this.identifier]['controls']['MrLegalDocTypeCode'].updateValueAndValidity();
        this.parentForm['controls'][this.identifier]['controls']['DocDt'].updateValueAndValidity();
        this.parentForm['controls'][this.identifier]['controls']['DocExpiredDt'].updateValueAndValidity();

        this.UpdateSource.emit({
            Key: 'IsDetail',
            Value: this.IsDetail,
            listLtkmCustCompanyLegalDoc: this.listLtkmCustCompanyLegalDoc
        });
    }

    DeleteLegalDoc(index) {
        if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
            this.listLtkmCustCompanyLegalDoc.splice(index, 1);
        }
    }

    setForAdd() {
        this.parentForm['controls'][this.identifier]['controls']['MrLegalDocTypeCode'].setValidators([Validators.required]);
        this.parentForm['controls'][this.identifier]['controls']['DocDt'].setValidators([Validators.required]);
        this.ChangeLegalDocType({
            selectedIndex: 0
        });
    }

    SetForEdit(LtkmCustCompanyLegalDocObj: LtkmCustCompanyLegalDocObj, index: number) {
        this.LtkmCustCompanyLegalDoc = LtkmCustCompanyLegalDocObj;
        this.parentForm['controls'][this.identifier].patchValue({
            MrLegalDocTypeCode: this.LegalDocTypeObj[0].Key
        });
        this.parentForm['controls'][this.identifier].patchValue({
            LtkmCustCompanyLegalDocId: this.LtkmCustCompanyLegalDoc.LtkmCustCompanyLegalDocId,
            LtkmCustCompanyId: this.LtkmCustCompanyLegalDoc.LtkmCustCompanyId,
            MrLegalDocTypeCode: this.LtkmCustCompanyLegalDoc.MrLegalDocTypeCode,
            DocNo: this.LtkmCustCompanyLegalDoc.DocNo,
            DocDt: formatDate(this.LtkmCustCompanyLegalDoc.DocDt, 'yyyy-MM-dd', 'en-US'),
            DocExpiredDt: formatDate(this.LtkmCustCompanyLegalDoc.DocExpiredDt, 'yyyy-MM-dd', 'en-US'),
            NotaryName: this.LtkmCustCompanyLegalDoc.NotaryName,
            NotaryLocation: this.LtkmCustCompanyLegalDoc.NotaryLocation,
            DocNotes: this.LtkmCustCompanyLegalDoc.DocNotes,
            // RowVersion: this.LtkmCustCompanyLegalDoc.RowVersion
        })
        this.ChangeLegalDocType({
            selectedIndex: 0
        }, true); //buat edit doang. buat add gak di cek ulang
        this.parentForm['controls'][this.identifier]['controls']['MrLegalDocTypeCode'].disable();
        this.parentForm['controls'][this.identifier].updateValueAndValidity();
    }

    ChangeLegalDocType(ev, ForEdit: boolean = false) {
        var idx = ev.selectedIndex;
        this.http.post(URLConstant.GetDocIsExpDtMandatory, {
            DocCode: this.LegalDocTypeObj[idx].Key
        }).subscribe(
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
            this.parentForm['controls'][this.identifier]['controls']["DocExpiredDt"].setValidators([Validators.required]);
            this.parentForm['controls'][this.identifier]['controls']["DocExpiredDt"].enable();
        } else {
            this.parentForm['controls'][this.identifier]['controls']["DocExpiredDt"].clearValidators();
            this.parentForm['controls'][this.identifier]['controls']["DocExpiredDt"].disable();
        }
        this.parentForm['controls'][this.identifier]['controls']["DocExpiredDt"].updateValueAndValidity();
    }

    LoadListLegalDocData() {
        this.http.post(URLConstant.GetAppCustCompanyLegalDocsByAppCustCompanyId, {
            AppCustCompanyId: this.AppCustCompanyId
        }).subscribe(
            (response) => {
                this.InputGridObj.resultData = {
                    Data: ""
                }
                this.InputGridObj.resultData["Data"] = new Array();
                this.InputGridObj.resultData.Data = response["ListCompanyLegalDoc"];
                this.ListLegalDoc = this.InputGridObj.resultData.Data;
            }
        );
    }

    GetEvent() {
        this.IsDetail = false;
        this.LoadListLegalDocData();
    }

    SaveForm(enjiForm: NgForm) {
        if (this.listLtkmCustCompanyLegalDoc.find(x => x.MrLegalDocTypeCode == this.parentForm['controls'][this.identifier]['controls'].MrLegalDocTypeCode.value)) {
            let ErrorOutput = this.LegalDocTypeObj.find(x => x.Key == this.parentForm['controls'][this.identifier]['controls'].MrLegalDocTypeCode.value);
            this.toastr.warningMessage("There's Already " + ErrorOutput.Value + " Document")

            this.LtkmCustCompanyLegalDoc.ReleaseLocation = this.parentForm['controls'][this.identifier]['controls'].BegBalanceAmt.value;

            this.LtkmCustCompanyLegalDoc.MrLegalDocTypeCode = this.parentForm['controls'][this.identifier]['controls'].MrLegalDocTypeCode.value;
            this.LtkmCustCompanyLegalDoc.DocNo = this.parentForm['controls'][this.identifier]['controls'].DocNo.value;
            this.LtkmCustCompanyLegalDoc.DocDt = this.parentForm['controls'][this.identifier]['controls'].DocDt.value;
            this.LtkmCustCompanyLegalDoc.DocExpiredDt = this.parentForm['controls'][this.identifier]['controls'].DocExpiredDt.value;
            this.LtkmCustCompanyLegalDoc.NotaryName = this.parentForm['controls'][this.identifier]['controls'].NotaryName.value;
            this.LtkmCustCompanyLegalDoc.NotaryLocation = this.parentForm['controls'][this.identifier]['controls'].NotaryLocation.value;
            this.LtkmCustCompanyLegalDoc.DocNotes = this.parentForm['controls'][this.identifier]['controls'].DocNotes.value;


            if (this.Mode != "Edit") {
                this.listLtkmCustCompanyLegalDoc.push(this.LtkmCustCompanyLegalDoc);
                this.LtkmCustCompanyLegalDoc = new LtkmCustCompanyLegalDocObj();
                this.IsDetail = false;
                this.UpdateSource.emit({
                    Key: 'IsDetail',
                    Value: this.IsDetail,
                    listLtkmCustCompanyLegalDoc: this.listLtkmCustCompanyLegalDoc
                });
                enjiForm.resetForm();
            } else {
                this.listLtkmCustCompanyLegalDoc[this.currentIndex].MrLegalDocTypeCode = this.parentForm['controls'][this.identifier]['controls'].MrLegalDocTypeCode.value;
                this.listLtkmCustCompanyLegalDoc[this.currentIndex].DocNo = this.parentForm['controls'][this.identifier]['controls'].DocNo.value;
                this.listLtkmCustCompanyLegalDoc[this.currentIndex].DocDt = this.parentForm['controls'][this.identifier]['controls'].DocDt.value;
                this.listLtkmCustCompanyLegalDoc[this.currentIndex].DocExpiredDt = this.parentForm['controls'][this.identifier]['controls'].DocExpiredDt.value;
                this.listLtkmCustCompanyLegalDoc[this.currentIndex].NotaryName = this.parentForm['controls'][this.identifier]['controls'].NotaryName.value;
                this.listLtkmCustCompanyLegalDoc[this.currentIndex].NotaryLocation = this.parentForm['controls'][this.identifier]['controls'].NotaryLocation.value;
                this.listLtkmCustCompanyLegalDoc[this.currentIndex].DocNotes = this.parentForm['controls'][this.identifier]['controls'].DocNotes.value;

                this.IsDetail = false;
                this.UpdateSource.emit({
                    Key: 'IsDetail',
                    Value: this.IsDetail,
                    listLtkmCustCompanyLegalDoc: this.listLtkmCustCompanyLegalDoc
                });
                enjiForm.resetForm();
            }
        }
    }
}
