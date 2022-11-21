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
import { ReceiptDsfObj } from 'app/dsf/model/ReceiptDsfObj.Model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { RdlcReportObj, ReportParamObj } from 'app/shared/model/library/rdlc-report-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';

@Component({
  selector: 'app-suratkonfirmasipersetujuan-v2',
  templateUrl: './suratkonfirmasipersetujuan-v2.component.html',
  styleUrls: ['./suratkonfirmasipersetujuan-v2.component.css'],
  providers: [NGXToastrService]
})
export class SuratkonfirmasipersetujuanV2Component implements OnInit {

  
  inputPagingObj: UcPagingObj = new UcPagingObj();
  RdlcReport: RdlcReportObj = new RdlcReportObj();
  receiptDsfObj: ReceiptDsfObj;
  resultData: any;
  SKPCode: any;
  
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private cookieService: CookieService) {}

  ngOnInit() {
    this.inputPagingObj._url = "./assets/dsf/ucpaging/searchConfirmationAgreeReport.json";
    this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/searchConfirmationAgreeReport.json";
  }

  GetCallback(ev: any) {
    let userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.receiptDsfObj = new ReceiptDsfObj();
    this.receiptDsfObj.OfficeCode = userContext.OfficeCode;
    
    this.http.post(URLConstantDsf.GenerateSKPCode, this.receiptDsfObj).subscribe(
      (response) => {
        this.resultData = response;
        this.SKPCode = this.resultData.SKPCode;
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        this.RdlcReport.RequestingUsername = currentUserContext.UserName;
        this.RdlcReport.ReportInfo.ReportName = "Report Surat Konfirmasi Persetujuan v2";
        this.RdlcReport.ReportInfo.ReportTemplateCode = "SURAT_KONFIRMASI_PERSETUJUAN_V2";
        this.RdlcReport.ReportInfo.ReportParameters = new Array<ReportParamObj>();
        this.RdlcReport.ReportInfo.ExportFormat = 0;
        
        let reportParamObj: ReportParamObj = new ReportParamObj();
        reportParamObj.paramKey = "AppNo";
        reportParamObj.paramValue = ev.RowObj.AppNo;
        reportParamObj.paramAssignment = 1;
        this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj);
        
        let reportParamObj2: ReportParamObj = new ReportParamObj();
        reportParamObj2.paramKey = "SKPCode";
        reportParamObj2.paramValue = this.SKPCode;
        reportParamObj2.paramAssignment = 1;
        this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj2);
        
        let reportParamObj3: ReportParamObj = new ReportParamObj();
        reportParamObj3.paramKey = "AgrNo";
        if(ev.RowObj.AgrmntNo != null)
        {
          reportParamObj3.paramValue = ev.RowObj.AgrmntNo;
        }
        else
        {
          reportParamObj3.paramValue = "";
        }        
        reportParamObj3.paramAssignment = 1;
        this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj3);
        
        this.http.post(URLConstant.GenerateReportR3, this.RdlcReport).subscribe(
          (response) => {
            let linkSource: string = 'data:application/pdf;base64,' + response["ReportFile"];
            let fileName: string =  "Surat_Konfirmasi_Persetujuan_v2_"+ev.RowObj.AppNo+ ".pdf";
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
    });
 
  }

}
