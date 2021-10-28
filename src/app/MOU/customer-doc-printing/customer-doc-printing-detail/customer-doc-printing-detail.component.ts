import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { MouCustDocPrintForViewObj } from 'app/shared/model/MouCustDocPrintForViewObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CookieService } from 'ngx-cookie';
import { RdlcReportObj, ReportParamObj } from 'app/shared/model/library/RdlcReportObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-customer-doc-printing-detail',
  templateUrl: './customer-doc-printing-detail.component.html',
})
export class CustomerDocPrintingDetailComponent implements OnInit {
  
  MouCustId: number;
  responseObj: Array<MouCustDocPrintForViewObj> = new Array<MouCustDocPrintForViewObj>();
  mouCustObj: MouCustObj;
  RdlcReport: RdlcReportObj = new RdlcReportObj();
  MrMouTypeCode: string;
  readonly CancelLink: string = NavigationConstant.MOU_CUST_DOC_PAGING;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: NGXToastrService,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
      }
      if (params['MrMouTypeCode'] != null) {
        this.MrMouTypeCode = params['MrMouTypeCode'];
      }
    });
  }

  ngOnInit(): void {
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.GetListMouCustDocByMouCustId();
  }

  GetListMouCustDocByMouCustId(){
    let reqByIdObj: GenericObj = new GenericObj();
    reqByIdObj.Id = this.MouCustId;
    this.http.post(URLConstant.GetListMouCustDocByMouCustId, reqByIdObj).subscribe(
      response => {
        this.responseObj = response[CommonConstant.ReturnObj];
      },
      () => {
        this.router.navigateByUrl('Error');
      }
    );
  }

  Print(item) {
    try {
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.RdlcReport.RequestingUsername = currentUserContext.UserName;
      this.RdlcReport.ReportInfo.ReportName = item.MouDocName;
      this.RdlcReport.ReportInfo.ReportTemplateCode = item.RptTmpltCode;
      this.RdlcReport.ReportInfo.ReportParameters = new Array<ReportParamObj>();
      this.RdlcReport.ReportInfo.ExportFormat = 0;

      let reportParamObj: ReportParamObj = new ReportParamObj();
      reportParamObj.paramKey = "MouCustId";
      reportParamObj.paramValue = this.MouCustId.toString();
      reportParamObj.paramAssignment = 1;
      this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj);

      // this.RdlcReport.MainReportInfoDetail.ReportDataProviderParameter["RptTmpltCode"] = item.RptTmpltCode;

      this.http.post(URLConstant.GenerateReportR3, this.RdlcReport).subscribe(
        (response) => {
          let linkSource: string = 'data:application/pdf;base64,' + response["ReportFile"];
          let fileName: string = item.MouDocName + ".pdf";
          const downloadLink = document.createElement("a");
          downloadLink.href = linkSource;
          downloadLink.download = fileName;

          if (response["ReportFile"] != undefined) {
            downloadLink.click();
            this.SaveAgrmntDocPrint(item.MouCustDocId);
            this.toastr.successMessage(response['message']);
          }
          else {
            this.toastr.warningMessage(response['message']);
          }
        }
      );
    }
    catch (error) {
      this.toastr.warningMessage(error);
    }
  }

  SaveAgrmntDocPrint(mouCustDocId) {
    let reqByIdObj: GenericObj = new GenericObj();
    reqByIdObj.Id = mouCustDocId
    this.http.post(URLConstant.AddMouCustDocPrint, reqByIdObj).subscribe(
      () => {
        this.GetListMouCustDocByMouCustId();
      });
  }
}
