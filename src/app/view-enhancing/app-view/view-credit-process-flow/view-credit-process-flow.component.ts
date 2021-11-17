import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { Router, ActivatedRoute } from '@angular/router';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { forEach } from 'core-js/core/array';

@Component({
  selector: 'app-view-credit-process-flow',
  templateUrl: './view-credit-process-flow.component.html'
})
export class ViewCreditProcessFlowComponent implements OnInit {

  @Input() AppNo: string;
  @Input() BizTemplateCode: string;
  inputGridViewCreditObj: InputGridObj;
  inputGridViewAdministrationObj: InputGridObj;
  inputGridViewAgrmnt: InputGridObj;

  RequestTaskModelObj: RequestTaskModelObj;
  RequestTaskModelObjForAdm: RequestTaskModelObj;

  ReqByIdObj: GenericObj = new GenericObj();
  AppId: number;
  AgrmntNo: Array<string>  = new Array<string>();

  listAgrmntObj: Array<AgrmntObj> = new Array<AgrmntObj>();
  listAgrmntNo: Array<string> = new Array<string>();

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
    this.inputGridViewAdministrationObj = new InputGridObj();
    this.inputGridViewAgrmnt = new InputGridObj();
    this.inputGridViewCreditObj.pagingJson = "./assets/ucgridview/app-view/gridViewCreditProcessFlow.json";
    this.inputGridViewAdministrationObj.pagingJson = "./assets/ucgridview/app-view/gridViewAdministrationProcessFlow.json";
    console.log(this.AppNo);
    console.log(this.AppId);

    this.RequestTaskModelObj = new RequestTaskModelObj();
    this.RequestTaskModelObjForAdm = new RequestTaskModelObj();
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

    //this.RequestTaskModelObjForAdm.TransactionNo = this.AgrmntNo;

    // this.http.post(URLConstant.GetTaskHistoryByTransactionNo, this.RequestTaskModelObjForAdm).subscribe(
    //   (response) => {
    //     this.inputGridViewAdministrationObj.resultData = {
    //       Data: ""
    //     }
    //     this.inputGridViewAdministrationObj.resultData["Data"] = new Array();
    //     this.inputGridViewAdministrationObj.resultData.Data = response
    //   }
    // );

    this.ReqByIdObj.Id = this.AppId;

    this.http.post(URLConstant.GetListAgrmntByAppId, this.ReqByIdObj).subscribe(
      (response) => {
        console.log(response);
        this.listAgrmntObj = response["ReturnObject"];

        for(let i=0; i < this.listAgrmntObj.length; i++)
        {
          this.listAgrmntNo.push(this.listAgrmntObj[i]["AgrmntNo"])
        }

        console.log(this.listAgrmntNo);        
        
        for(let j=0; j < this.listAgrmntNo.length; j++)
        {          
          this.RequestTaskModelObjForAdm.TransactionNo = this.listAgrmntNo[j];
          //this.AgrmntNo = this.listAgrmntNo[j];

          this.AgrmntNo.push(this.listAgrmntNo[j])
          console.log("Agrmnt No : " + this.AgrmntNo);

          this.http.post(URLConstant.GetListTaskHistoryByAgrmntNo, this.RequestTaskModelObjForAdm).subscribe(
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
    );

    console.log(this.listAgrmntObj);

  }
}
