import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-simple-lead-monitoring',
  templateUrl: './simple-lead-monitoring.component.html',
  styleUrls: ['./simple-lead-monitoring.component.scss']
})
export class SimpleLeadMonitoringComponent implements OnInit {
  uploadObj: Object;

  constructor() { }

  ngOnInit() {
    this.uploadObj = {
      title: 'Upload Simple Lead', // Title Paging dan Upload Page
      subsectionId: 'UcUploadFile', // Ga perlu diubah
      formatsAllowed: '.xls, .xlsx', // File yang bisa di upload
      UploadTypeCode: 'UPL_SMPL_LEAD', // UploadTypeCode berdasarkan keperluan
      ErrorDownloadUrl: URLConstant.GetLeadMonitoringByUploadMonitoringNoAndTrxType, // URL untuk Download Error File
      TemplateUrl: URLConstant.DownloadTemplate, // URL untuk Download Template File
      TemplateName: 'Upload_Simple_Lead_Template', // Nama Excel Template File
      FileErrorName: "Upload_Simple_Lead_ErrorDownload", // Nama Excel Download Error File
      // SheetName: 'TemplateGan',
      environmentUrl: environment.losUrl,
      apiQryPaging: URLConstant.GetPagingObjectBySQL,
      pagingJson: "./assets/ucpaging/searchSimpleLeadMonitoring.json",
      ddlEnvironments: [
        {
          name: "UL.UPLOAD_STATUS",
          environment: environment.FoundationR3Url
        },
        {
          name: "UL.ORI_OFFICE_CODE",
          environment: environment.FoundationR3Url
        }
      ],
      url: URLConstant.UploadFile
    }
  }

}