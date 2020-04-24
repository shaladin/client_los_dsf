import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-test-upload',
  templateUrl: './test-upload.component.html',
  styleUrls: ['./test-upload.component.scss']
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

      enviromentUrl: environment.FoundationR3Url,
      apiQryPaging: AdInsConstant.GetPagingObjectBySQL,
      searchUploadName: 'searchTestUpload',
      pagingJson: "./assets/search/searchTestUpload.json",
      url: this.uploadUrl
    }
  }

}
