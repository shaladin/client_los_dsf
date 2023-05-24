import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { Router, ActivatedRoute } from '@angular/router';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { GenericObj } from 'app/shared/model/Generic/generic-obj.model';
import { String } from 'typescript-string-operations';
import { TaskModelHistObj } from 'app/shared/model/Workflow/task-model-hist-obj.model';

@Component({
  selector: 'app-view-lead-process-flow',
  templateUrl: './view-lead-process-flow.component.html'
})
export class ViewLeadProcessFlowComponent implements OnInit {

  @Input() LeadNo: string;
  inputGridViewLeadObj: InputGridObj;

  RequestTaskModelObj: RequestTaskModelObj;
  RequestTaskModelObjForAdm: RequestTaskModelObj;

  ReqByIdObj: GenericObj = new GenericObj();
  AppId: number;
  AgrmntNo: Array<string> = new Array<string>();
  AgrmntWorkflowData: { [AgrmntNo: string]: InputGridObj } = {}
  TransactionAgrNumbers: Array<string> = new Array<string>();
  processKeyApp: string = "";
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      /* istanbul ignore else */
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
    });
  }

  ngOnInit() {
    this.processKeyApp = CommonConstant.WF_CODE_SIMPLE_LEAD;
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputGridViewLeadObj = new InputGridObj();
    this.inputGridViewLeadObj.pagingJson = "./assets/ucgridview/app-view/gridViewLeadProcessFlow.json";

    this.RequestTaskModelObj = new RequestTaskModelObj();
    this.RequestTaskModelObjForAdm = new RequestTaskModelObj();
    let x = new Array<string>();
    x.push(this.LeadNo);

    this.RequestTaskModelObj.TransactionNumbers = x;
    this.RequestTaskModelObj.ProcessKey = this.processKeyApp;
    this.http.post(URLConstant.GetTaskHistoryByListTransactionNoAndWfCode, this.RequestTaskModelObj).subscribe(
      (response) => {
        this.inputGridViewLeadObj.resultData = {
          Data: ""
        }
        this.inputGridViewLeadObj.resultData["Data"] = new Array();
        this.inputGridViewLeadObj.resultData.Data = response
      }
    );
  }
}
