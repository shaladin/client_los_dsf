export class RdlcReportObj {
    RequestUserId: number;
    RequesterEmail: string;
    ReportProcessorSelector: string;
    ExportFormat: string;
    ReportName: string;
    ExportFile: string;
    MainReportParameter: MainReportObj;
    MainReportInfoDetail: MainReportDetailObj;
    ReportTemplate: string;

    constructor() {
        this.RequestUserId = 0;
        this.RequesterEmail = "";
        this.ReportProcessorSelector = "RdlcReportProcessor";
        this.ExportFormat = "";
        this.ReportName = "";
        this.ExportFile = "";
        this.MainReportParameter = new MainReportObj();
        this.MainReportInfoDetail = new MainReportDetailObj();
        this.ReportTemplate = "";
    }

}

export class MainReportObj {
    FilterBy: string;

    constructor() {
        this.FilterBy = "";
    }
}

export class MainReportDetailObj {
    ReportDataProviderName: string;
    ReportDataProviderParameter: Object;
    ReportTemplateName: string;

    constructor() {
        this.ReportDataProviderName = "DefaultDataRDLCProvider";
        this.ReportDataProviderParameter = new Object();
        this.ReportTemplateName = "";
    }

}