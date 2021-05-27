export class RdlcReportObjv2 {
    ReportInfo: ReportInfoObjv2;
    RequestingUsername: string;
    RowVersion: string;
  
    constructor() {
      this.ReportInfo = new ReportInfoObjv2();
      this.RequestingUsername = "";
      this.RowVersion = "";
    }
}

export class ReportInfoObjv2 {
  ReportName: string;
  ReportTemplateCode: string;
  ReportTemplatePath: string;
  ExportFormat: number;
  ReportParameters: Array<ReportParamObjv2>;
  SubReports: Array<any>;

  constructor() {
    this.ReportName = "";
    this.ReportTemplateCode = "";
    this.ReportTemplatePath = "";
    this.ExportFormat = 0;
    this.ReportParameters = new Array<ReportParamObjv2>();
    this.SubReports = new Array<any>();
  }
}

export class ReportParamObjv2 {
  paramKey: string;
  paramValue: string;
  paramAssignment: number;
  constructor() {
    this.paramKey = "";
    this.paramValue = "";
    this.paramAssignment = 0;
  }
}