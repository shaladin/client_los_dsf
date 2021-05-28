import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { UCSearchComponent } from '@adins/ucsearch';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AgrmntDocObj } from 'app/shared/model/AgrmntDocObj.Model';
import { AgrmntDocPrintObj } from 'app/shared/model/AgrmntDocPrintObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { map, mergeMap } from 'rxjs/operators';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { forkJoin } from 'rxjs';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AgrmntSignerObj } from 'app/shared/model/AgrmntSignerObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { RdlcReportObj, ReportParamObj } from 'app/shared/model/library/RdlcReportObj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  providers: [NGXToastrService]
})
export class DocumentViewComponent implements OnInit {
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;

  AggrementId: any;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  inputObj: any;
  AgrmntDocObj: Object;
  listSelectedId: any[];
  tempListId: any[];
  tempData: any[];
  arrCrit: any[];
  pageNow: number;
  pageSize: number;
  apiUrl: string;
  resultData: any;
  orderByKey: any;
  orderByValue: boolean;
  totalData: any;
  AgrmntId: number;
  addUrl: any;
  editUrl: string;
  agrmntDocObj: AgrmntDocObj;
  agrmntDocPrintObj: AgrmntDocPrintObj;
  getUrl: string;
  RdlcReport: RdlcReportObj = new RdlcReportObj();
  BizTemplateCode: string;
  isDocSignerAvailable: boolean;

  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_NAP_DOC_PRINT_PAGING;
  constructor(private http: HttpClient, private route: ActivatedRoute, private toastr: NGXToastrService, private cookieService: CookieService) {
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
      this.viewGenericObj.ddlEnvironments = [
        {
          name: "ApplicationNo",
          environment: environment.losR3Web
        },
        {
          name: "AggrementNo",
          environment: environment.losR3Web
        },
        {
          name: "MouCustNo",
          environment: environment.losR3Web
        },
      ];
    }


    this.GetListAgrmntDocByAgrmntId();

    this.listSelectedId = new Array();
    this.tempListId = new Array();
    this.tempData = new Array();
    this.arrCrit = new Array();

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
        else if (this.BizTemplateCode == CommonConstant.FCTR || this.BizTemplateCode == CommonConstant.CFRFN4W || this.BizTemplateCode == CommonConstant.CFNA) {
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
    var obj = {
      Id: this.AgrmntId,
    }
    this.http.post(URLConstant.GetListAgrmntDocByAgrmntId, obj).subscribe(
      (response) => {
        this.AgrmntDocObj = response;
      });
  }

  SaveAgrmntDocPrint(agrmntDocId) {
    this.agrmntDocObj = new AgrmntDocObj();
    this.agrmntDocPrintObj = new AgrmntDocPrintObj();
    this.agrmntDocPrintObj.RowVersion = "";
    this.agrmntDocPrintObj.AgrmntDocId = agrmntDocId;

    this.addUrl = URLConstant.AddAgrmntDocPrint;
    this.http.post(this.addUrl, this.agrmntDocPrintObj).subscribe(
      () => {
        this.GetListAgrmntDocByAgrmntId();
      });
  }

  Print(item) {
    try {
      if (this.isDocSignerAvailable) {
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        this.RdlcReport.RequestingUsername = currentUserContext.UserName;
        this.RdlcReport.ReportInfo.ReportName = item.AgrmntDocName;
        this.RdlcReport.ReportInfo.ReportTemplateCode = item.RptTmpltCode;
        this.RdlcReport.ReportInfo.ReportParameters = new Array<ReportParamObj>();
        this.RdlcReport.ReportInfo.ExportFormat = 0;

        let reportParamObj: ReportParamObj = new ReportParamObj();
        reportParamObj.paramKey = "AgrmntId";
        reportParamObj.paramValue = this.AgrmntId.toString();
        reportParamObj.paramAssignment = 1;
        this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj);

        // this.RdlcReport.MainReportInfoDetail.ReportDataProviderParameter["RptTmpltCode"] = item.RptTmpltCode;

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
            } else {
              this.toastr.warningMessage(response['message']);
            }
          });
      }
      else {
        this.toastr.warningMessage(ExceptionConstant.NO_SIGNER_AVAILABLE);
      }
    } catch (error) {
      this.toastr.warningMessage(error);
    }
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }
}
