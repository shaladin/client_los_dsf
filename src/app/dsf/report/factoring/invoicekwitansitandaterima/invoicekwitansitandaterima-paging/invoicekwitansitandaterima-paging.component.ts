import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { RdlcReportObj, ReportParamObj } from 'app/shared/model/library/RdlcReportObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-invoicekwitansitandaterima-paging',
  templateUrl: './invoicekwitansitandaterima-paging.component.html',
  styleUrls: ['./invoicekwitansitandaterima-paging.component.css'],
  providers: [NGXToastrService]
})
export class InvoicekwitansitandaterimaPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  RdlcReport: RdlcReportObj = new RdlcReportObj();
  
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private cookieService: CookieService) {}

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCessie.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCessie.json";
  }

  GetCallback(ev: any) {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.RdlcReport.RequestingUsername = currentUserContext.UserName;
    this.RdlcReport.ReportInfo.ReportName = "Report Invoice Kwitansi TandaTerima";
    this.RdlcReport.ReportInfo.ReportTemplateCode = "FACT_INVOICEKWITANSITANDATERIMA";
    this.RdlcReport.ReportInfo.ReportParameters = new Array<ReportParamObj>();
    this.RdlcReport.ReportInfo.ExportFormat = 0;

    let reportParamObj: ReportParamObj = new ReportParamObj();
    reportParamObj.paramKey = "CessieNo";
    reportParamObj.paramValue = "06/CS-KTB/05/21";
    reportParamObj.paramAssignment = 1;
    this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj);
    
    this.http.post(URLConstant.GenerateReportR3, this.RdlcReport).subscribe(
      (response) => {
        let linkSource: string = 'data:application/pdf;base64,' + response["ReportFile"];
        let fileName: string =  "Invoice_Tanda_Terima"+"06/CS-KTB/05/21"+ ".pdf";
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
