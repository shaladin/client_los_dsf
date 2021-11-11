import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcUploadObj } from 'app/shared/model/uc-upload-obj.model';

@Component({
  selector: 'app-simple-lead-monitoring',
  templateUrl: './simple-lead-monitoring.component.html',
  styleUrls: ['./simple-lead-monitoring.component.scss']
})
export class SimpleLeadMonitoringComponent implements OnInit {
  uploadObj: UcUploadObj = new UcUploadObj;
  constructor() { }

  ngOnInit() {
    this.uploadObj.title = "Upload Simple Lead";
    this.uploadObj.subsectionId = "UcUploadFile";
    this.uploadObj.UploadTypeCode = "UPL_SMPL_LEAD";
    this.uploadObj.ErrorDownloadUrl = URLConstant.GetLeadMonitoringByUploadMonitoringNoAndTrxType;
    this.uploadObj.TemplateName = "Upload_Simple_Lead_Template";
    this.uploadObj.FileErrorName = "Upload_Simple_Lead_ErrorDownload";
    this.uploadObj.pagingJson = "./assets/ucpaging/searchSimpleLeadMonitoring.json";
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