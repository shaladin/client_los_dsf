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