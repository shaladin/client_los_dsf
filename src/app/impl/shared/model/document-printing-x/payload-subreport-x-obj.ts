import { ReportParamObj } from "app/shared/model/library/rdlc-report-obj.model"

export class PayloadSubreportXObj {
    ReportName: string;
    ReportTemplateCode: string;
    ExportFormat: number;
    ReportParameters: Array<ReportParamObj>;
    SubReports: Array<any>;
}