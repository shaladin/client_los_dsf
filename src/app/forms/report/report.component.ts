import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  ddlOfficeObj: UcDropdownListObj = new UcDropdownListObj();
  JobDataForm = this.fb.group({
    OriOfficeCode: [''],
    Deductions: this.fb.array([
    ])
  })
  isDisabled: boolean = false;
  lang: string = "Current Page";
  tanggal: Date = new Date();
  ml: any;

  constructor(private fb: FormBuilder, public translate: TranslateService) {
    this.inputReportObj.JsonPath = "./assets/ucreport/ReportTest.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }

  ngOnInit() {
    console.log("testing");
    this.ddlOfficeObj.apiUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.ddlOfficeObj.requestObj = {
      RefMasterTypeCode: "BUILDING_OWNERSHIP"
    };
  }

  clickMe() {
    this.isDisabled = !this.isDisabled;
    console.log(this.JobDataForm.value);

    let listF = this.JobDataForm.get("Deductions") as FormArray;
    let fgn = this.fb.group({
      DeductTypeList: ['', [Validators.required]],
      DeductAmt: ['']
    }) as FormGroup;
    listF.push(fgn);
    console.log(this.JobDataForm);
  }

  disableMe() {
    this.JobDataForm.controls["OriOfficeCode"].disable();
    this.JobDataForm.controls["OriOfficeCode"].updateValueAndValidity();
    console.log(this.JobDataForm.value);
  }

  enableMe() {
    this.JobDataForm.controls["OriOfficeCode"].enable();
    this.JobDataForm.controls["OriOfficeCode"].updateValueAndValidity();
    console.log(this.JobDataForm.value);
  }

  ChangeLanguage(language: string) {
    localStorage.setItem('lang', language);
    this.translate.use(language);
  }
}
