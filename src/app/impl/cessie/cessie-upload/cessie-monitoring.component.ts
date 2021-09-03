import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-cessie-monitoring',
  templateUrl: './cessie-monitoring.component.html',
  styles: []
})
export class CessieMonitoringComponent implements OnInit {
  uploadObj: Object;

  constructor() { }

  ngOnInit() {
    this.uploadObj = {
      title: 'Upload Cessie Factoring', // Title Paging dan Upload Page
      subsectionId: 'UcUploadFile', // Ga perlu diubah
      formatsAllowed: '.txt', // File yang bisa di upload
      UploadTypeCode: 'UPL_CESSIE', // UploadTypeCode berdasarkan keperluan
      ErrorDownloadUrl: URLConstant.GetLeadMonitoringByUploadMonitoringNoAndTrxType, // URL untuk Download Error File
      TemplateUrl: URLConstant.DownloadTemplate, // URL untuk Download Template File
      TemplateName: 'Upload_Cessie_Template', // Nama Excel Template File
      FileErrorName: "Upload_Cessie_ErrorDownload", // Nama Excel Download Error File
      // SheetName: 'TemplateGan',
      environmentUrl: environment.losUrl + '/v1',
      apiQryPaging: URLConstant.GetPagingObjectBySQL,
      pagingJson: "./assets/ucpaging/searchCessieMonitoring.json",
      ddlEnvironments: [
        {
          name: "UL.UPLOAD_STATUS",
          environment: environment.FoundationR3Url + "/v1"
        },
        {
          name: "UL.ORI_OFFICE_CODE",
          environment: environment.FoundationR3Url + "/v1"
        }
      ],
      url: URLConstantX.UploadFileV2,
      isDownloadTmplt : false
    }
    console.log(this.uploadObj)
  }
}
