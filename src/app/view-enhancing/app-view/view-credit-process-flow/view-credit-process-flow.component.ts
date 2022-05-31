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
  selector: 'app-view-credit-process-flow',
  templateUrl: './view-credit-process-flow.component.html'
})
export class ViewCreditProcessFlowComponent implements OnInit {

  @Input() AppNo: string;
  @Input() BizTemplateCode: string;
  inputGridViewCreditObj: InputGridObj;

  RequestTaskModelObj: RequestTaskModelObj;
  RequestTaskModelObjForAdm: RequestTaskModelObj;

  ReqByIdObj: GenericObj = new GenericObj();
  AppId: number;
  AgrmntNo: Array<string> = new Array<string>();
  AgrmntWorkflowData: { [AgrmntNo: string]: InputGridObj } = {}
  TransactionAgrNumbers: Array<string> = new Array<string>();
  processKeyApp: string = "";
  processKeyAgrmnt: string = "";
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      /* istanbul ignore else */
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
    });
  }

  ngOnInit() {
    this.processKeyApp = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
    this.processKeyAgrmnt = String.Format(CommonConstant.WF_CRP_AFT_ACT, this.BizTemplateCode);

    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputGridViewCreditObj = new InputGridObj();
    this.inputGridViewCreditObj.pagingJson = "./assets/ucgridview/app-view/gridViewCreditProcessFlow.json";

    this.RequestTaskModelObj = new RequestTaskModelObj();
    this.RequestTaskModelObjForAdm = new RequestTaskModelObj();
    let x = new Array<string>();
    x.push(this.AppNo);

    this.RequestTaskModelObj.TransactionNumbers = x;
    this.RequestTaskModelObj.ProcessKey = this.processKeyApp;
    this.http.post(URLConstant.GetTaskHistoryByListTransactionNoAndWfCode, this.RequestTaskModelObj).subscribe(
      (response) => {
        this.inputGridViewCreditObj.resultData = {
          Data: ""
        }
        this.inputGridViewCreditObj.resultData["Data"] = new Array();
        this.inputGridViewCreditObj.resultData.Data = response
      }
    );

    this.ReqByIdObj.Id = this.AppId;

    this.http.post(URLConstant.GetListAgrmntByAppId, this.ReqByIdObj).subscribe(
      (response) => {
        let listAgrmntObj: Array<AgrmntObj> = response["ReturnObject"];
        this.TransactionAgrNumbers = listAgrmntObj.map(w => w.AgrmntNo);

        this.RequestTaskModelObjForAdm.TransactionNumbers = this.TransactionAgrNumbers;
        this.RequestTaskModelObjForAdm.ProcessKey = this.processKeyAgrmnt;

        this.http.post(URLConstant.GetTaskHistoryByListTransactionNoAndWfCode, this.RequestTaskModelObjForAdm).subscribe(
          (response : Array<TaskModelHistObj>) => {
            if(response.length > 0){
              for (let i = 0; i < listAgrmntObj.length; i++) {
                let agrTaskHist = response.filter(f=>f.TrxNo = listAgrmntObj[i].AgrmntNo);
  
                this.AgrmntWorkflowData[listAgrmntObj[i].AgrmntNo] = new InputGridObj();
                this.AgrmntWorkflowData[listAgrmntObj[i].AgrmntNo].pagingJson = "./assets/ucgridview/app-view/gridViewAdministrationProcessFlow.json";
                this.AgrmntWorkflowData[listAgrmntObj[i].AgrmntNo].resultData = {
                  Data: ""
                }
  
                this.AgrmntWorkflowData[listAgrmntObj[i].AgrmntNo].resultData["Data"] = new Array();
                this.AgrmntWorkflowData[listAgrmntObj[i].AgrmntNo].resultData["Data"] = agrTaskHist;
  
              }
            }
          }
        );
      }
    );
  }
}
