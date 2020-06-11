import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-test-upload',
  templateUrl: './test-upload.component.html'
})
export class TestUploadComponent implements OnInit {
  uploadObj: any;
  constructor() { }

  ngOnInit() {
    this.uploadObj = {
      title: 'Test Upload File', // Title Paging dan Upload Page
      subsectionId: 'UcUploadFile', // Ga perlu diubah
      formatsAllowed: '.txt, .xls, .xlsx, .csv', // File yang bisa di upload
      UploadTypeCode: 'UPL_TEST', // UploadTypeCode berdasarkan keperluan
      ErrorDownloadUrl: AdInsConstant.GetUploadAssetMasterByUploadMonitoringNoAndTrxType, // URL untuk Download Error File
      TemplateUrl: AdInsConstant.DownloadTemplate, // URL untuk Download Template File
      TemplateName: 'TestTemplate', // Nama Excel Template File
      FileErrorName: "ErrorDownload", // Nama Excel Download Error File
      // SheetName: 'TemplateGan',

      environmentUrl: environment.FoundationR3Url,
      apiQryPaging: AdInsConstant.GetPagingObjectBySQL,
      pagingJson: "./assets/search/searchTestUpload.json",
      url: AdInsConstant.UploadFile
    }
  }

}
