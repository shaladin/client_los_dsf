import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from "ng-chartist";
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ThingsToDoIntegrationObj, ThingsToDoIntegrationV2Obj, UcThingsToDoObj } from 'app/shared/model/library/UcThingsToDoObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: []
})
export class DashBoardComponent implements OnInit {
  Item: UcThingsToDoObj = new UcThingsToDoObj();

  ReqByCodeObj: GenericObj = new GenericObj();
  ListRole: Array<string> = [];

  username: string;
  url: string;
  officeCode: string;
  roleCode: string;
  checkRole: boolean = false;

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.username = context[CommonConstant.USER_NAME];
    this.url = environment.DashboardURL;
    this.officeCode = context[CommonConstant.OFFICE_CODE];
    this.roleCode = context[CommonConstant.ROLE_CODE];
    this.Item.Url = environment.isCore ? AdInsConstant.GetThingsToDoByRoleV2 : AdInsConstant.GetThingsToDoByRole;
    this.Item.RequestObj.ModuleCode = CommonConstant.LOAN_ORIGINATION;

    let integrationObj;
    let integrationObj2;

    this.getRoleFromGeneralSetting();

    if(environment.isCore){
      integrationObj = new ThingsToDoIntegrationV2Obj();
      integrationObj.BaseUrl = AdInsConstant.GetThingsToDoCamunda;
      integrationObj.ApiPath = "";
      integrationObj.RequestObj.OfficeCode = "";
      integrationObj.RequestObj.UserName = this.username;
      integrationObj.RequestObj.OfficeRoleCodes = [this.roleCode, this.roleCode + "-" + this.officeCode, this.officeCode];
      
      integrationObj2 = new ThingsToDoIntegrationV2Obj();
      integrationObj2.BaseUrl = AdInsConstant.GetListApvTaskListByUsernameAndRoleCodeForThingsToDo;
      integrationObj2.ApiPath = "";
      integrationObj2.RequestObj.OfficeCode = "";
      integrationObj2.RequestObj.UserName = this.username;
      integrationObj2.RequestObj.RoleCode = this.roleCode;
      this.Item.RequestObj.IntegrationObj.push(integrationObj2);
    }else{
      integrationObj = new ThingsToDoIntegrationObj();
      integrationObj.RequestObj.Office = "";
      integrationObj.RequestObj.Role = this.roleCode;
      integrationObj.RequestObj.UserName = this.username;
      
    }
    this.Item.RequestObj.IntegrationObj.push(integrationObj);


  }

  async getRoleFromGeneralSetting(){
    this.ReqByCodeObj.Code = CommonConstant.GSCodeRoleDashboardLosOperational;
    await this.http.post(URLConstant.GetGeneralSettingByCode, this.ReqByCodeObj).toPromise().then(
      (response) => {
        if(response["GsValue"] != null){
          this.ListRole = response["GsValue"].split('|');
        }
      });
    this.checkRole = true;
  }

}
