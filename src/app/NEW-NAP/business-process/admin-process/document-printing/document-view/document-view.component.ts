import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { UCSearchComponent } from '@adins/ucsearch';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AgrmntDocObj } from 'app/shared/model/AgrmntDocObj.Model';
import { AgrmntDocPrintObj } from 'app/shared/model/AgrmntDocPrintObj.Model';
import { RdlcReportObj } from 'app/shared/model/Report/RdlcReportObj.model';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss'],
  providers: [NGXToastrService]
})
export class DocumentViewComponent implements OnInit {
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;

  AggrementId: any;
  inputViewObj: string;
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
  token = localStorage.getItem("Token");

  constructor(private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params['AgrmntId'] != null) {
        this.AgrmntId = params['AgrmntId'];
      }
    });

  }
  ngOnInit() {
    this.inputViewObj = "./assets/ucviewgeneric/viewDocument.json";

    this.GetListAgrmntDocByAgrmntId();

    this.listSelectedId = new Array();
    this.tempListId = new Array();
    this.tempData = new Array();
    this.arrCrit = new Array();

    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.losUrl + AdInsConstant.GetPagingObjectBySQL;
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
    console.log(this.resultData);
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
    this.http.post(AdInsConstant.GetListAgrmntDocByAgrmntId, obj).subscribe(
      (response) => {
        console.log(response);
        this.AgrmntDocObj = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  SaveAgrmntDocPrint(event) {
    this.agrmntDocObj = new AgrmntDocObj();
    this.agrmntDocPrintObj = new AgrmntDocPrintObj();
    this.agrmntDocPrintObj.RowVersion = "";
    this.agrmntDocPrintObj.AgrmntDocId = event;

    console.log(event);
    this.addUrl = AdInsConstant.AddAgrmntDocPrint;
    this.http.post(this.addUrl, this.agrmntDocPrintObj).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
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

    console.log(this.RdlcReport);

    let Obj = {
      RequestObject: this.RdlcReport
    };
    //TEMUAN STEVEN INI URL GK BOLEH DI HARDCODE GINI
    this.http.post("http://r3app-server.ad-ins.com/FOUNDATION_R3/Report/GenerateReportSync", Obj).subscribe(
      (response) => {
        let linkSource: string = 'data:application/pdf;base64,' + response["ReturnObject"];
        let fileName: string = item.AgrmntDocName + ".pdf";
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;

        if (response["ReturnObject"] != undefined) {
          downloadLink.click();
          this.toastr.successMessage(response['message']);
        } else {
          this.toastr.errorMessage(response['Message']);
        }
      },
      (error) => {
        console.log(error);
      });
  }

  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){
      var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=0&prodOfferingCode=" + ev.ViewObj.ProdOfferingCode + "&prodOfferingVersion=" + ev.ViewObj.ProdOfferingVersion + "&Token=" + this.token;
      // this.router.navigate([]).then(result => { window.open(link, '_blank'); });
      window.open( link, "_blank");
    }
  }
}
