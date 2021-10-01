import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-view-credit-process-flow',
  templateUrl: './view-credit-process-flow.component.html'
})
export class ViewCreditProcessFlowComponent implements OnInit {

  @Input() AppNo: string;
  @Input() BizTemplateCode: string;
  inputGridViewCreditObj: InputGridObj;
  inputGridViewAdministrationObj: InputGridObj;

  RequestTaskModelObj: RequestTaskModelObj;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.inputGridViewCreditObj = new InputGridObj();
    this.inputGridViewAdministrationObj = new InputGridObj();
    this.inputGridViewCreditObj.pagingJson = "./assets/ucgridview/app-view/gridViewCreditProcessFlow.json";
    this.inputGridViewAdministrationObj.pagingJson = "./assets/ucgridview/app-view/gridViewAdministrationProcessFlow.json";

    this.RequestTaskModelObj = new RequestTaskModelObj();
    this.RequestTaskModelObj.TransactionNo = this.AppNo;
    this.RequestTaskModelObj.UserName = UserAccess[CommonConstant.USER_NAME];
    this.RequestTaskModelObj.Finished = true;
    this.RequestTaskModelObj.Unfinished = true;
    this.RequestTaskModelObj.IncludeAssignedTasks = true;

    this.http.post(URLConstant.GetTaskHistoryByTransactionNo, this.RequestTaskModelObj).subscribe(
      (response) => {
        this.inputGridViewCreditObj.resultData = {
          Data: ""
        }
        this.inputGridViewCreditObj.resultData["Data"] = new Array();
        this.inputGridViewCreditObj.resultData.Data = response
      }
    );

    this.http.post(URLConstant.GetTaskHistoryByTransactionNo, this.RequestTaskModelObj).subscribe(
      (response) => {
        this.inputGridViewAdministrationObj.resultData = {
          Data: ""
        }
        this.inputGridViewAdministrationObj.resultData["Data"] = new Array();
        this.inputGridViewAdministrationObj.resultData.Data = response
      }
    );
  }
}
