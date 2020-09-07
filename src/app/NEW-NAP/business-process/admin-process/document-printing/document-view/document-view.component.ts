import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { UCSearchComponent } from '@adins/ucsearch';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AgrmntDocObj } from 'app/shared/model/AgrmntDocObj.Model';
import { AgrmntDocPrintObj } from 'app/shared/model/AgrmntDocPrintObj.Model';
import { RdlcReportObj } from 'app/shared/model/Report/RdlcReportObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

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

  constructor(private http: HttpClient,
    private route: ActivatedRoute, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params['AgrmntId'] != null) {
        this.AgrmntId = params['AgrmntId'];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });

  }
  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewDocument.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
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

    this.GetListAgrmntDocByAgrmntId();

    this.listSelectedId = new Array();
    this.tempListId = new Array();
    this.tempData = new Array();
    this.arrCrit = new Array();

    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.losUrl + URLConstant.GetPagingObjectBySQL;
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
      AgrmntId: this.AgrmntId,
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
    this.RdlcReport.ExportFormat = "JPDF";
    this.RdlcReport.ExportFile = "JPDF";
    this.RdlcReport.MainReportParameter = null;
    this.RdlcReport.ReportName = item.AgrmntDocName;
    this.RdlcReport.ReportTemplate = item.RptTmpltCode;
    this.RdlcReport.MainReportInfoDetail.ReportTemplateName = item.RptTmpltCode;
    this.RdlcReport.MainReportInfoDetail.ReportDataProviderParameter["AgrmntId"] = +this.AgrmntId;
    // this.RdlcReport.MainReportInfoDetail.ReportDataProviderParameter["RptTmpltCode"] = item.RptTmpltCode;

    this.http.post(URLConstant.GenerateReportSync, { RequestObject: this.RdlcReport }).subscribe(
      (response) => {
        let linkSource: string = 'data:application/pdf;base64,' + response[CommonConstant.ReturnObj];
        let fileName: string = item.AgrmntDocName + ".pdf";
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;

        if (response[CommonConstant.ReturnObj] != undefined) {
          downloadLink.click();
          this.SaveAgrmntDocPrint(item.AgrmntDocId);
          this.toastr.successMessage(response['message']);

        } else {
          this.toastr.errorMessage(response['message']);
        }
      });
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") { 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);  
    }
  }
}
