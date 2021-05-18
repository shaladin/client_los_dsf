import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { TranslateService } from '@ngx-translate/core';
import { InputSearchObj } from 'app/shared/model/InputSearchObj.Model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  inputObj: InputSearchObj = new InputSearchObj();
  pageSize: number = 10;
  test_uppercase: string = "asd";

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

    this.inputObj = new InputSearchObj();
    this.inputObj._url = "./assets/ucpaging/searchAppInquiry.json";
    this.inputObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "A.APP_STAT",
        environment: environment.FoundationR3Url
      },
      {
        name: "ISNULL(B.AGRMNT_CURR_STEP,A.APP_CURR_STEP)",
        environment: environment.FoundationR3Url
      },
      {
        name: "B.AGRMNT_STAT",
        environment: environment.FoundationR3Url
      },
      {
        name: "A.CUST_CHECKING_STEP",
        environment: environment.FoundationR3Url
      }
    ];

    this.ddlOfficeObj.apiUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.ddlOfficeObj.requestObj = {
      RefMasterTypeCode: "BUILDING_OWNERSHIP"
    };
  }

  test(ev)
  {
    console.log(ev);
  }

  getResult(ev) {
    console.log(ev);
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
