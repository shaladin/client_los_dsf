import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { UCSearchComponent } from '@adins/ucsearch';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AgrmntDocObj } from 'app/shared/model/agrmnt-doc-obj.model';
import { AgrmntDocPrintObj } from 'app/shared/model/agrmnt-doc-print-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { map, mergeMap } from 'rxjs/operators';
import { AgrmntObj } from 'app/shared/model/agrmnt/agrmnt.model';
import { forkJoin } from 'rxjs';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { AgrmntSignerObj } from 'app/shared/model/agrmnt-signer-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { RdlcReportObj, ReportParamObj } from 'app/shared/model/library/rdlc-report-obj.model';
import { CookieService } from 'ngx-cookie';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { AgrmntDocForPrintingObj } from 'app/shared/model/agrmnt-doc-for-printing-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { SubreportXObj } from 'app/impl/shared/model/document-printing-x/subreport-x-obj';
import { PayloadSubreportXObj } from 'app/impl/shared/model/document-printing-x/payload-subreport-x-obj';

@Component({
  selector: 'app-document-view-x',
  templateUrl: './document-view-x.component.html',
  providers: [NGXToastrService]
})
export class DocumentViewXComponent implements OnInit {
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AgrmntDocObj: Array<AgrmntDocForPrintingObj>;
  pageNow: number;
  pageSize: number;
  apiUrl: string;
  resultData: any;
  orderByKey: any;
  orderByValue: boolean;
  totalData: number;
  AgrmntId: number;
  editUrl: string;
  agrmntDocObj: AgrmntDocObj;
  agrmntDocPrintObj: AgrmntDocPrintObj;
  getUrl: string;
  RdlcReport: RdlcReportObj = new RdlcReportObj();
  BizTemplateCode: string;
  isDocSignerAvailable: boolean;

  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_NAP_DOC_PRINT_PAGING;
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params['AgrmntId'] != null) {
        this.AgrmntId = params['AgrmntId'];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
    this.isDocSignerAvailable = false;
  }

  ngOnInit() {
    if (this.BizTemplateCode == CommonConstant.OPL) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppOPLMainInformationAgrmnt.json";
    }
    else {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewDocument.json";
    }

    this.GetListAgrmntDocByAgrmntId();


    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.losUrl + URLConstant.GetPagingObjectBySQL;

    this.http.post(URLConstant.GetAgrmntByAgrmntId, { Id: this.AgrmntId }).pipe(
      map((response) => {
        return response;
      }),
      mergeMap((response: AgrmntObj) => {
        let getAppCust = this.http.post(URLConstant.GetAppCustByAppId, { Id: response.AppId });
        let getAgrmntSigner = this.http.post(URLConstant.GetAgrmntSignerByAgrmntId, { Id: this.AgrmntId });
        return forkJoin([getAppCust, getAgrmntSigner]);
      })
    ).toPromise().then(
      (response) => {
        const appCust = response[0] as AppCustObj;
        const agrmntSigner = response[1] as AgrmntSignerObj;
        if (this.BizTemplateCode == CommonConstant.CF4W || this.BizTemplateCode == CommonConstant.FL4W || this.BizTemplateCode == CommonConstant.OPL) {
          if (appCust.MrCustTypeCode == CommonConstant.CustTypePersonal) {
            if (agrmntSigner.AppCustPersonalId && agrmntSigner.AppCustPersonalId > 0 && agrmntSigner.MfEmpNo1 && agrmntSigner.SupplBranchEmpNo) {
              this.isDocSignerAvailable = true;
            }
          }
          else if (appCust.MrCustTypeCode == CommonConstant.CustTypeCompany) {
            if (agrmntSigner.AppCustCompanyMgmntShrholder1Id && agrmntSigner.AppCustCompanyMgmntShrholder1Id > 0 && agrmntSigner.MfEmpNo1 && agrmntSigner.SupplBranchEmpNo) {
              this.isDocSignerAvailable = true;
            }
          }
        }
        else if (this.BizTemplateCode == CommonConstant.FCTR || this.BizTemplateCode == CommonConstant.CFRFN4W || this.BizTemplateCode == CommonConstant.CFNA || this.BizTemplateCode == CommonConstant.DF) {
          if (appCust.MrCustTypeCode == CommonConstant.CustTypePersonal) {
            if (agrmntSigner.AppCustPersonalId && agrmntSigner.AppCustPersonalId > 0 && agrmntSigner.MfEmpNo1) {
              this.isDocSignerAvailable = true;
            }
          }
          else if (appCust.MrCustTypeCode == CommonConstant.CustTypeCompany) {
            if (agrmntSigner.AppCustCompanyMgmntShrholder1Id && agrmntSigner.AppCustCompanyMgmntShrholder1Id > 0 && agrmntSigner.MfEmpNo1) {
              this.isDocSignerAvailable = true;
            }
          }
        }
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  searchPagination(event: number) {
    this.pageNow = event;
    let order = null;
    if (this.orderByKey != null) {
      order = {
        key: this.orderByKey,
        value: this.orderByValue
      }
    }
    this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order)
  }

  getResult(event) {
    this.resultData = event.response;
    this.totalData = event.response.Count;
    this.UCGridFooter.pageNow = event.pageNow;
    this.UCGridFooter.totalData = this.totalData;
    this.UCGridFooter.resultData = this.resultData;
  }

  onSelect(event) {
    this.pageNow = event.pageNow;
    this.pageSize = event.pageSize;
    this.totalData = event.Count;
    this.searchPagination(this.pageNow);
  }

  GetListAgrmntDocByAgrmntId() {
    var obj = { Id: this.AgrmntId }
    this.http.post(URLConstant.GetListAgrmntDocByAgrmntId, obj).subscribe(
      (response) => {
        this.AgrmntDocObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  SaveAgrmntDocPrint(agrmntDocId) {
    this.agrmntDocObj = new AgrmntDocObj();
    this.agrmntDocPrintObj = new AgrmntDocPrintObj();
    this.agrmntDocPrintObj.RowVersion = "";
    this.agrmntDocPrintObj.AgrmntDocId = agrmntDocId;

    this.http.post(URLConstant.AddAgrmntDocPrint, this.agrmntDocPrintObj).subscribe(
      () => {
        this.GetListAgrmntDocByAgrmntId();
      });
  }

  async Print(item) {
    try {
      if (this.isDocSignerAvailable) {
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        this.RdlcReport.RequestingUsername = currentUserContext.UserName;
        this.RdlcReport.ReportInfo.ReportName = item.AgrmntDocName;
        this.RdlcReport.ReportInfo.ReportTemplateCode = item.RptTmpltCode;
        this.RdlcReport.ReportInfo.ReportParameters = new Array<ReportParamObj>();
        this.RdlcReport.ReportInfo.ExportFormat = item.ExportFormat;

        let reportParamObj: ReportParamObj = new ReportParamObj();
        reportParamObj.paramKey = "agrmntId";
        reportParamObj.paramValue = this.AgrmntId.toString();
        reportParamObj.paramAssignment = 1;
        reportParamObj.paramDescr = "";
        this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj);
        this.RdlcReport.ReportInfo.SubReports = new Array();

        if (environment.isCore) {
          let arrSubreportObj: Array<SubreportXObj> = new Array();
          let reqObj = {
            code: CommonConstantX.GSCodeConfigPayloadRptSubrpt
          }
          await this.http.post(URLConstant.GetGeneralSettingByCode, reqObj).toPromise().then(
            (response: { GsCode: string, GsName: string, GsValue: string, GsDescr: string }) => {
              arrSubreportObj = this.ConvertStringToObject(response.GsValue)
            }
          );

          this.RdlcReport.ReportInfo.SubReports = new Array();
          for (let i = 0; i < arrSubreportObj.length; i++) {
            if (this.RdlcReport.ReportInfo.ReportTemplateCode === arrSubreportObj[i].ReportTemplateCode) {
              const subreportTemplateCode = arrSubreportObj[i].SubreportTemplateCode
              for (let x = 0; x < subreportTemplateCode.length; x++) {
                let subreport: PayloadSubreportXObj = {
                  ReportName: this.RdlcReport.ReportInfo.ReportName,
                  ReportTemplateCode: subreportTemplateCode[x],
                  ExportFormat: 0,
                  ReportParameters: [reportParamObj],
                  SubReports: []
                }
                this.RdlcReport.ReportInfo.SubReports.push(subreport);
              }
            }
          }
        }

        this.http.post(URLConstant.GenerateReportR3, this.RdlcReport).subscribe(
          (response) => {
            let linkSource: string = 'data:application/pdf;base64,' + response["ReportFile"];
            let fileName: string = item.AgrmntDocName + ".pdf";
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = fileName;

            if (response["ReportFile"] != undefined) {
              downloadLink.click();
              this.SaveAgrmntDocPrint(item.AgrmntDocId);
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
      else {
        this.toastr.warningMessage(ExceptionConstant.NO_SIGNER_AVAILABLE);
      }

    }
    catch (error) {
      this.toastr.warningMessage(error);
    }
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

  ConvertStringToObject(str: string): Array<SubreportXObj> {
    let arrSubReports: Array<SubreportXObj> = new Array();
    let arrSemicolon: Array<string> = str.split(';');
    for (let i = 0; i < arrSemicolon.length; i++) {
      const arrColon = arrSemicolon[i].split(':');
      arrSubReports.push({ ReportTemplateCode: arrColon[0], SubreportTemplateCode: arrColon[1].split(',') });
    }
    return arrSubReports;
  }
}