import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

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
      ErrorDownloadUrl: URLConstant.GetUploadAssetMasterByUploadMonitoringNoAndTrxType, // URL untuk Download Error File
      TemplateUrl: URLConstant.DownloadTemplate, // URL untuk Download Template File
      TemplateName: 'TestTemplate', // Nama Excel Template File
      FileErrorName: "ErrorDownload", // Nama Excel Download Error File
      // SheetName: 'TemplateGan',

      environmentUrl: environment.FoundationR3Url + "/v1",
      apiQryPaging: URLConstant.GetPagingObjectBySQL,
      pagingJson: "./assets/search/searchTestUpload.json",
      url: URLConstant.UploadFile
    }
  }

}
