import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcUploadObj } from 'app/shared/model/uc-upload-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-generate-potential-ro-monitoring-dsf',
  templateUrl: './generate-potential-ro-monitoring-dsf.component.html'
})
export class GeneratePotentialRoMonitoringDsfComponent implements OnInit {

  uploadObj: UcUploadObj = new UcUploadObj();
  constructor() { }

  ngOnInit() {
    this.uploadObj.title = "Upload Potential RO";
    this.uploadObj.UploadTypeCode = "UPL_POTENTIAL_RO_DSF";
    this.uploadObj.ErrorDownloadUrl = URLConstantDsf.GetPotentialROMonitoringByUploadMonitoringNoAndTrxType;
    this.uploadObj.TemplateName = "Upload_PotentialRO_Template";
    this.uploadObj.FileErrorName = "Upload_PotentialRO_ErrorDownload";
    this.uploadObj.pagingJson = "./assets/dsf/ucpaging/searchPotentialROMonitoringDsf.json";
    this.uploadObj.formatsAllowed = ".xls, .xlsx";
    this.uploadObj.maxSize = 2;
    if (!environment.isCore) {
      this.uploadObj.formatsAllowed = ".xls, .xlsx";
      this.uploadObj.url = URLConstantX.UploadFileV2;
    }
  }
}
