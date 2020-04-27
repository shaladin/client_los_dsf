import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-test-upload',
  templateUrl: './test-upload.component.html'
})
export class TestUploadComponent implements OnInit {
  uploadObj: any;
  uploadUrl: any;
  constructor() { }

  ngOnInit() {
    this.uploadUrl = AdInsConstant.UploadFile
    this.uploadObj = {
      title: 'Test Upload File',
      subsectionId: 'UcUploadFile',
      formatsAllowed: '.txt, .xls, .xlsx, .csv',
      UploadTypeCode: 'UPL_ASM',
      TemplateUrl: AdInsConstant.DownloadTemplate,
      FileName: 'TestTemplateUrl',

      environmentUrl: environment.FoundationR3Url,
      apiQryPaging: AdInsConstant.GetPagingObjectBySQL,
      pagingJson: "./assets/search/searchTestUpload.json",
      url: this.uploadUrl
    }
  }

}
