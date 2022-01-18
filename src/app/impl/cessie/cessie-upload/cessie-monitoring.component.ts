import {Component, OnInit} from '@angular/core';
import {environment} from 'environments/environment';
import {URLConstant} from 'app/shared/constant/URLConstant';
import {URLConstantX} from 'app/impl/shared/constant/URLConstantX';
import {UcUploadObj} from 'app/shared/model/uc-upload-obj.model';

@Component({
  selector: 'app-cessie-monitoring',
  templateUrl: './cessie-monitoring.component.html',
  styles: []
})
export class CessieMonitoringComponent implements OnInit {
  uploadObj: UcUploadObj = new UcUploadObj();

  constructor() {
  }

  ngOnInit() {
    this.uploadObj.title = 'Upload Cessie Factoring';
    this.uploadObj.UploadTypeCode = 'UPL_CESSIE';
    this.uploadObj.ErrorDownloadUrl = URLConstant.GetLeadMonitoringByUploadMonitoringNoAndTrxType;
    this.uploadObj.TemplateName = 'Upload_Cessie_Template';
    this.uploadObj.FileErrorName = 'Upload_Cessie_ErrorDownload';
    this.uploadObj.pagingJson = './assets/ucpaging/searchCessieMonitoring.json';
    this.uploadObj.ddlEnvironments = [
      {
        name: 'UL.UPLOAD_STATUS',
        environment: environment.FoundationR3Url + '/v1'
      },
      {
        name: 'UL.ORI_OFFICE_CODE',
        environment: environment.FoundationR3Url + '/v1'
      }
    ]
    this.uploadObj.formatsAllowed = '.txt';
    this.uploadObj.url = URLConstantX.UploadFileV2;
    console.log(this.uploadObj)
  }
}
