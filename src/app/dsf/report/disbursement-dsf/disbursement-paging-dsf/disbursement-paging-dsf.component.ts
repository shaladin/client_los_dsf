import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { RdlcReportObj, ReportParamObj } from 'app/shared/model/library/rdlc-report-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';

@Component({
  selector: 'app-disbursement-paging-dsf',
  templateUrl: './disbursement-paging-dsf.component.html',
  styleUrls: ['./disbursement-paging-dsf.component.css'],
  providers: [NGXToastrService]
})
export class DisbursementPagingDsfComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  RdlcReport: RdlcReportObj = new RdlcReportObj();
  
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private cookieService: CookieService) {}

  ngOnInit() {
    this.inputPagingObj._url = "./assets/dsf/ucpaging/searchCessieDisbursementDsf.json";
    this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/searchCessieDisbursementDsf.json";
  }

  GetCallback(ev: any) {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.RdlcReport.RequestingUsername = currentUserContext.UserName;
    this.RdlcReport.ReportInfo.ReportName = "Report Disbursement Order";
    this.RdlcReport.ReportInfo.ReportTemplateCode = "DISB_REPORT";
    this.RdlcReport.ReportInfo.ReportParameters = new Array<ReportParamObj>();
    this.RdlcReport.ReportInfo.ExportFormat = 0;

    let reportParamObj: ReportParamObj = new ReportParamObj();
    reportParamObj.paramKey = "CessieNo";
    reportParamObj.paramValue = ev.RowObj.CESSIE_NO;
    reportParamObj.paramAssignment = 1;
    this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj);
    
    this.http.post(URLConstant.GenerateReportR3, this.RdlcReport).subscribe(
      (response) => {
        let linkSource: string = 'data:application/pdf;base64,' + response["ReportFile"];
        let fileName: string =  "Report_Disbursement_Order"+ev.RowObj.CESSIE_NO+ ".pdf";
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;

        if (response["ReportFile"] != undefined) {
          downloadLink.click();
          //this.SaveAgrmntDocPrint(item.AgrmntDocId);
          this.toastr.successMessage(response['message']);

          // var iframe = "<iframe width='100%' height='100%' src='" + linkSource + "'></iframe>";
          // var x = window.open();
          // x.document.open();
          // x.document.write(iframe);
          // x.document.close();
        }
        else {
          this.toastr.warningMessage(response['message']);
        }
      }
    );
    
  }

}
