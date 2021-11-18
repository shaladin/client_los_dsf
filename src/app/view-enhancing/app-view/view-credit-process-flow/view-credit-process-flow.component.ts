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
  AgrmntNo: Array<string>  = new Array<string>();
  AgrmntWorkflowData: {[AgrmntNo: string] : InputGridObj} = {}

  constructor(private router: Router,private route: ActivatedRoute,private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      /* istanbul ignore else */
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
    });
   }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.inputGridViewCreditObj = new InputGridObj();
    this.inputGridViewCreditObj.pagingJson = "./assets/ucgridview/app-view/gridViewCreditProcessFlow.json";

    this.RequestTaskModelObj = new RequestTaskModelObj();
    this.RequestTaskModelObjForAdm = new RequestTaskModelObj();
    this.RequestTaskModelObj.TransactionNo = this.AppNo;

    this.http.post(URLConstant.GetTaskHistoryByTransactionNo, this.RequestTaskModelObj).subscribe(
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
        let listAgrmntObj : Array<AgrmntObj> = response["ReturnObject"];

        for(let i=0; i < listAgrmntObj.length; i++)
        {
          this.RequestTaskModelObjForAdm.TransactionNo = listAgrmntObj[i].AgrmntNo;
          

          this.http.post(URLConstant.GetTaskHistoryByTransactionNo, this.RequestTaskModelObjForAdm).subscribe(
            (response) => {
              this.AgrmntWorkflowData[listAgrmntObj[i].AgrmntNo] = new InputGridObj();
              this.AgrmntWorkflowData[listAgrmntObj[i].AgrmntNo].pagingJson = "./assets/ucgridview/app-view/gridViewAdministrationProcessFlow.json";
              console.log(this.AgrmntWorkflowData[listAgrmntObj[i].AgrmntNo]);
              this.AgrmntWorkflowData[listAgrmntObj[i].AgrmntNo].resultData = {
                Data: ""
              }

              this.AgrmntWorkflowData[listAgrmntObj[i].AgrmntNo].resultData["Data"] = new Array();
              this.AgrmntWorkflowData[listAgrmntObj[i].AgrmntNo].resultData["Data"] = response
            }
          );
        }
      }
    );
  }
}
