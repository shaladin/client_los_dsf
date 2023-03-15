import {Component, OnInit} from '@angular/core';
import {environment} from 'environments/environment';
import {URLConstant} from 'app/shared/constant/URLConstant';
import {URLConstantX} from 'app/impl/shared/constant/URLConstantX';
import {UcUploadObj} from 'app/shared/model/uc-upload-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-cessie-monitoring-dsf',
  templateUrl: './cessie-monitoring-dsf.component.html',
  styleUrls: ['./cessie-monitoring-dsf.component.css']
})
export class CessieMonitoringDsfComponent implements OnInit {

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
    // Self Custom CR Add Reference Payment Batch 2
    this.uploadObj.url = URLConstantDsf.UploadFileV2;
    // Self Custom CR Add Reference Payment Batch 2
    console.log(this.uploadObj)
  }

}
