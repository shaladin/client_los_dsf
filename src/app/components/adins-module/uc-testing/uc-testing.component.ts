import { Component, OnInit, ElementRef, Input, Renderer2, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { InputReportObj } from 'app/shared/model/Report/InputReportObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { InputSearchObj } from 'app/shared/model/InputSearchObj.Model';

@Component({
  selector: 'app-uc-testing',
  templateUrl: './uc-testing.component.html',
  styleUrls: ['./uc-testing.component.scss'],
})
export class UcTestingComponent implements OnInit {

  @Input() ReportInput: InputReportObj = new InputReportObj();
  inputObj: InputSearchObj = new InputSearchObj();
  RdlcReport: RdlcReportObj = new RdlcReportObj();
  Configuration: any;
  UserContext: any;
  CritLength: number = 0;
  isReport: boolean = true;

  constructor(private toastr: ToastrService, private http: HttpClient, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document, private cookieService: CookieService) { }

  ngOnInit() {
    console.log("ucreport");
    this.inputObj = new InputSearchObj();
    this.inputObj._url = this.ReportInput.JsonPath;
    this.inputObj.enviromentUrl = this.ReportInput.EnvironmentUrl;
    this.inputObj.apiQryPaging = this.ReportInput.ApiReportPath;

    this.initiateForm();
  }

  initiateForm() {
    this.getJSON(this.ReportInput.JsonPath).subscribe(data => {

      this.inputObj.title = data.title;
      this.Configuration = data;
      this.CritLength = data.component.length;

      this.UserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
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
      for (let i = 0; i < this.CritLength; i++) {
        var component = ev.ElRef.nativeElement[i];
        if (component.value != "") {
          let reportParamObj: ReportParamObj = new ReportParamObj();
          reportParamObj.paramKey = this.Configuration.component[i].name;
          reportParamObj.paramValue = component.value;
          reportParamObj.paramAssignment = this.Configuration.component[i].paramAssignment;
          this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj);
        }
      }
    }

    this.http.post(this.ReportInput.EnvironmentUrl + this.ReportInput.ApiReportPath, this.RdlcReport).subscribe(
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
}

export class RdlcReportObj {
  ReportInfo: ReportInfoObj;
  RequestingUsername: string;
  RowVersion: string;


  constructor() {
    this.ReportInfo = new ReportInfoObj();
    this.RequestingUsername = "";
    this.RowVersion = "";
  }

}

export class ReportInfoObj {
  ReportName: string;
  ReportTemplateCode: string;
  ReportTemplatePath: string;
  ExportFormat: number;
  ReportParameters: Array<ReportParamObj>;
  SubReports: Array<any>;

  constructor() {
    this.ReportName = "";
    this.ReportTemplateCode = "";
    this.ReportTemplatePath = "";
    this.ExportFormat = 0;
    this.ReportParameters = new Array<ReportParamObj>();
    this.SubReports = new Array<any>();
  }

}

export class ReportParamObj {
  paramKey: string;
  paramValue: string;
  paramAssignment: number;
  constructor() {
    this.paramKey = "";
    this.paramValue = "";
    this.paramAssignment = 0;
  }
}

export class KeyValueReportObj {
  key: number;
  value: string;

  constructor() {
    this.key = 0;
    this.value = "";
  }
}

export class RequestCriteriaReportObj {
  includeCount: boolean;
  includeData: boolean;
  pageNo: number;
  rowPerPage: number;
  orderBy: any;
  criteria: CriteriaReportObj[];
  isLoading: boolean;
  queryString: any;

  constructor() {
    this.includeCount = true;
    this.includeData = true;
    this.isLoading = true;
    this.queryString = '';
  }
}

export class CriteriaReportObj {
  propName: string;
  restriction: string;
  value: string;
  low: number;
  high: number;
  DataType: string;
  listValue: Array<any>;

  constructor() {
    this.low = 0;
    this.high = 0;
    this.DataType = 'Text';
  }
}