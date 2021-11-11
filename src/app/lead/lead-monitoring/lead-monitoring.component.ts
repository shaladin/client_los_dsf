import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcUploadObj } from 'app/shared/model/uc-upload-obj.model';

@Component({
  selector: 'app-lead-monitoring',
  templateUrl: './lead-monitoring.component.html',
  styles: []
})
export class LeadMonitoringComponent implements OnInit {
  uploadObj: UcUploadObj = new UcUploadObj();
  constructor() { }

  ngOnInit() {
    this.uploadObj.title = "Upload Lead";
    this.uploadObj.subsectionId = "UcUploadFile";
    this.uploadObj.UploadTypeCode = "UPL_LEAD";
    this.uploadObj.ErrorDownloadUrl = URLConstant.GetLeadMonitoringByUploadMonitoringNoAndTrxType;
    this.uploadObj.TemplateName = "Upload_Lead_Template";
    this.uploadObj.FileErrorName = "Upload_Lead_ErrorDownload";
    this.uploadObj.pagingJson = "./assets/ucpaging/searchLeadMonitoring.json";
    if (!environment.isCore) {
      this.uploadObj.formatsAllowed = ".xls, .xlsx";
      this.uploadObj.url = URLConstant.UploadFile;
    }
    else {
      this.uploadObj.formatsAllowed = ".xls, .xlsx, .txt, .TXT";
      this.uploadObj.url = URLConstant.UploadFileV2;
    }
  }
}