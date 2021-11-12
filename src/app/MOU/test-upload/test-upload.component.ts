import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcUploadObj } from 'app/shared/model/uc-upload-obj.model';

@Component({
  selector: 'app-test-upload',
  templateUrl: './test-upload.component.html'
})
export class TestUploadComponent implements OnInit {
  uploadObj: UcUploadObj = new UcUploadObj;
  constructor() { }

  ngOnInit() {
    this.uploadObj.title = "Test Upload File";
    this.uploadObj.UploadTypeCode = "UPL_TEST";
    this.uploadObj.ErrorDownloadUrl = URLConstant.GetUploadAssetMasterByUploadMonitoringNoAndTrxType;
    this.uploadObj.TemplateName = "TestTemplate";
    this.uploadObj.FileErrorName = "ErrorDownload";
    this.uploadObj.pagingJson = "./assets/ucpaging/searchTestUpload.json";
    if (!environment.isCore) {
      this.uploadObj.formatsAllowed = ".xls, .xlsx";
      this.uploadObj.url = URLConstant.UploadFile;
    }
  }
}