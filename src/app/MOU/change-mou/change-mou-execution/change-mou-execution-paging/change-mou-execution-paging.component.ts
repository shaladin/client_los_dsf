import { Component, OnInit } from "@angular/core";
import { environment } from "environments/environment";
import { UcPagingObj } from "app/shared/model/uc-paging-obj.model";

@Component({
  selector: "app-change-mou-execution-paging",
  templateUrl: "./change-mou-execution-paging.component.html",
  styleUrls: [],
})
export class ChangeMouExecutionPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() {}

  ngOnInit() {
    this.inputPagingObj._url =
      "./assets/ucpaging/mou/searchChangeMouExec.json";
    this.inputPagingObj.pagingJson =
      "./assets/ucpaging/mou/searchChangeMouExec.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MOU.MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1",
      },
    ];
  }
}
