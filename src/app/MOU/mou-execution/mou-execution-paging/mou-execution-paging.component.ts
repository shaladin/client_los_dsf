import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-mou-execution-paging',
  templateUrl: './mou-execution-paging.component.html',
  styleUrls: ['./mou-execution-paging.component.scss']
})
export class MouExecutionPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  constructor(private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouRequestForExec.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouRequestForExec.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MOU.MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
  }
}
