import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-lead-monitoring',
  templateUrl: './lead-monitoring.component.html',
  styles: []
})
export class LeadMonitoringComponent implements OnInit {
  uploadObj: Object;

  constructor() { }

  ngOnInit() {
    this.uploadObj = {
      title: 'Upload Lead', // Title Paging dan Upload Page
      subsectionId: 'UcUploadFile', // Ga perlu diubah
      formatsAllowed: '.xls, .xlsx', // File yang bisa di upload
      UploadTypeCode: 'UPL_LEAD', // UploadTypeCode berdasarkan keperluan
      ErrorDownloadUrl: URLConstant.GetLeadMonitoringByUploadMonitoringNoAndTrxType, // URL untuk Download Error File
      TemplateUrl: URLConstant.DownloadTemplate, // URL untuk Download Template File
      TemplateName: 'Upload_Lead_Template', // Nama Excel Template File
      FileErrorName: "Upload_Lead_ErrorDownload", // Nama Excel Download Error File
      // SheetName: 'TemplateGan',
      environmentUrl: environment.losUrl,
      apiQryPaging: URLConstant.GetPagingObjectBySQL,
      pagingJson: "./assets/ucpaging/searchLeadMonitoring.json",
      url: URLConstant.UploadFile
    }
  }

}
