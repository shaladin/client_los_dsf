import { Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { TranslateService } from '@ngx-translate/core';
import { InputSearchObj } from 'app/shared/model/InputSearchObj.Model';
import { RdlcReportObj, ReportParamObj } from 'app/shared/model/library/RdlcReportObj.model';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';

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
  RdlcReport: RdlcReportObj = new RdlcReportObj();
  Configuration: any;
  UserContext: any;
  CritLength: number = 0;

  constructor(private fb: FormBuilder, public translate: TranslateService, private toastr: ToastrService, private http: HttpClient,  private cookieService: CookieService) {
    this.inputReportObj.JsonPath = "./assets/ucreport/ReportTest.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }

  ngOnInit() {
    console.log("testing");

    // this.inputObj = new InputSearchObj();
    // this.inputObj._url = "./assets/ucpaging/searchAppInquiry.json";

    this.ddlOfficeObj.apiUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.ddlOfficeObj.requestObj = {
      RefMasterTypeCode: "BUILDING_OWNERSHIP"
    };
    this.initiateForm();
  }
  initiateForm() {
    this.inputObj = new InputSearchObj();
    this.inputObj._url = this.inputReportObj.JsonPath;
    this.inputObj.enviromentUrl = this.inputReportObj.EnvironmentUrl;
    this.inputObj.apiQryPaging = this.inputReportObj.ApiReportPath;
    this.inputObj.ddlEnvironments = this.inputReportObj.ddlEnvironments;
    this.inputObj.listEnvironments = this.inputReportObj.listEnvironments;

    this.getJSON(this.inputReportObj.JsonPath).subscribe(data => {
      this.inputObj.title = data.title;
      this.Configuration = data;
      this.CritLength = data.component.length;

      let value = this.cookieService.get('UserAccess');
      let userAccess = this.DecryptString(value, "AdInsFOU12345678");

      this.UserContext = JSON.parse(userAccess);
      this.RdlcReport.RequestingUsername = this.UserContext.UserName;
      this.RdlcReport.ReportInfo.ReportName = data.reportName;
      this.RdlcReport.ReportInfo.ReportTemplateCode = data.reportTemplateCode;
    });
  }
  
  public getJSON(url: string): Observable<any> {
    return this.http.get(url);
  }

  GenerateReport(ev: { ExportType: number, ElRef: ElementRef }) {
    this.RdlcReport.ReportInfo.ReportParameters = new Array<ReportParamObj>();
    this.RdlcReport.ReportInfo.ExportFormat = ev.ExportType;

    if (this.CritLength != 0) {
      let IsBreak = false;

      for (let i = 0; i < this.CritLength; i++) {
        let component = ev.ElRef.nativeElement[i];
        let label = component.getAttribute('label');
        let reportParamObj: ReportParamObj = new ReportParamObj();
        reportParamObj.paramKey = this.Configuration.component[i].name;
        reportParamObj.paramAssignment = this.Configuration.component[i].paramAssignment;
        reportParamObj.paramLabel = label;

        if (component.nodeName == 'SELECT') {
          let ddl = component.options;
          let text = ddl[ddl.selectedIndex].value.trim();
          if (text == "one") {
            IsBreak = true;
            this.toastr.warning("Please select " + label);
            break;
          }
          if (text == "all") {
            reportParamObj.paramValue = "";
          } else {
            reportParamObj.paramValue = component.value;
          }
        } else {
          reportParamObj.paramValue = component.value;
        }

        this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj);
      }

      if (IsBreak) {
        return;
      }
    }

    this.http.post(this.inputReportObj.EnvironmentUrl + this.inputReportObj.ApiReportPath, this.RdlcReport).subscribe(
      (response) => {
        let linkSource: string = "";
        let fileName: string = "";
        fileName = this.RdlcReport.ReportInfo.ReportName;
        if (ev.ExportType == 0) {
          linkSource = 'data:application/pdf;base64,' + response["ReportFile"];
          fileName = fileName + ".pdf";
        } else if (ev.ExportType == 1) {
          linkSource = 'data:application/xls;base64,' + response["ReportFile"];
          fileName = fileName + ".xls";
        } else if (ev.ExportType == 2) {
          linkSource = 'data:application/xlsx;base64,' + response["ReportFile"];
          fileName = fileName + ".xlsx";
        } else if (ev.ExportType == 3) {
          linkSource = 'data:application/doc;base64,' + response["ReportFile"];
          fileName = fileName + ".doc";
        } else if (ev.ExportType == 4) {
          linkSource = 'data:application/docx;base64,' + response["ReportFile"];
          fileName = fileName + ".docx";
        } else {
          linkSource = 'data:application/pdf;base64,' + response["ReportFile"];
          fileName = fileName + ".pdf";
        }

        if (response["ReportFile"] != undefined) {
          if (ev.ExportType != 0) {
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          } else {
            var iframe = "<iframe width='100%' height='100%' src='" + linkSource + "'></iframe>";
            var x = window.open();
            x.document.open();
            x.document.write(iframe);
            x.document.close();
          }
          this.toastr.success(response['message'], 'Success!');
        } else {
          this.toastr.error(response['Message']);
        }
      },
      (error) => {
        console.log(error);
      });
  }

  private DecryptString(chipperText: string, chipperKey: string) {
    if (
      chipperKey == undefined || chipperKey.trim() == '' ||
      chipperText == undefined || chipperText.trim() == ''
    ) return chipperText;
    var chipperKeyArr = CryptoJS.enc.Utf8.parse(chipperKey);
    var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
    var decrypted = CryptoJS.AES.decrypt(chipperText, chipperKeyArr, { iv: iv });
    var plainText = decrypted.toString(CryptoJS.enc.Utf8);
    return plainText;
  }

  test(ev) {
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
