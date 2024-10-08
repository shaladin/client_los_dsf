import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { ReqSuperset } from 'app/shared/model/request/superset/req-superset.model';
import { ResGeneralSettingObj } from 'app/shared/model/response/general-setting/res-general-setting-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-dashboard-superset',
  templateUrl: './dashboard-superset.component.html'
})
export class DashboardSupersetComponent implements OnInit {
  inRoleCode: string = "";
  url: string = "";
  dashboard: string ="";
  param: string ="";
  tokenSuperset: string = "";
  ReqSuperset: ReqSuperset = new ReqSuperset();
  generalSettingObj: GenericListByCodeObj = new GenericListByCodeObj();
  returnGeneralSettingObj: Array<ResGeneralSettingObj> = new Array<ResGeneralSettingObj>();
  gsCode: string = "";
  user: string ="";
  officeCode: string = "";
  businessDt: string = "";

  isCMO : boolean = false;
  isCMH : boolean= false;
  isBM : boolean= false;
  isAM : boolean= false;
  isBOD : boolean= false;
  isReady: boolean = false;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  async ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.user = context[CommonConstant.USER_NAME];
    this.inRoleCode = context[CommonConstant.ROLE_CODE];
    this.officeCode = context[CommonConstant.OFFICE_CODE];
    
    var datePipe = new DatePipe("en-US");
    this.businessDt = datePipe.transform(context[CommonConstant.BUSINESS_DT_STR], "yyyy-MM-dd").toString();

    this.checkRole();

    if(this.gsCode != ""){
      await this.getGeneralSetting();
      await this.hitSuperset();
      this.url = environment.Superset + "login/?token=" + this.tokenSuperset + this.dashboard + this.param; 
      this.isReady = true;
    }
  }

  checkRole(){
    if(this.inRoleCode == 'CMO'){
      this.gsCode = "DASHBOARD_CMO";
      this.param = "/?usr=" + this.user + "+offcode=" + this.officeCode + "+businessdt=" + this.businessDt;
      this.isCMO = true;
    }
    else if (this.inRoleCode == 'CMH'){
      this.gsCode = "DASHBOARD_CMO_SPV";
      this.param = "/?usr=" + this.user + "+offcode=" + this.officeCode + "+businessdt=" + this.businessDt;
      this.isCMH = true;
    }
    else if (this.inRoleCode == 'BM'){
      this.gsCode = "DASHBOARD_BM";
      this.param = "/?usr=-+offcode=" + this.officeCode + "+businessdt=" + this.businessDt;
      this.isBM = true;
    }
    else if (this.inRoleCode == 'AM'){
      this.gsCode = "DASHBOARD_RM";
      this.param = "/?usr=-+offcode=" + this.officeCode + "+businessdt=" + this.businessDt;
      this.isAM = true;
    }
    else if (this.inRoleCode == 'BOD'){
      this.gsCode = "DASHBOARD_DM";
      this.param = "/?usrcode=mktDirector" + "+businessdt=" + this.businessDt;
      this.isBOD = true;
    }
  }

  async hitSuperset(){
    await this.http.post(URLConstant.HitSuperset, this.ReqSuperset).toPromise().then(
      (response) => {
        if(response != null){
          this.tokenSuperset = response["access_token"];
        }
      });
  }

  async getGeneralSetting(){
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeDashboardUsr);
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeDashboardPwd);
    this.generalSettingObj.Codes.push(this.gsCode);

    await this.http.post(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).toPromise().then(
      (response) => {
        if(response != null){
          this.returnGeneralSettingObj = response['ResGetListGeneralSettingObj'];
          this.ReqSuperset.username = this.returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeDashboardUsr).GsValue;
          this.ReqSuperset.password = this.returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeDashboardPwd).GsValue;
          this.dashboard = "&dbrdid=" + this.returnGeneralSettingObj.find(x => x.GsCode == this.gsCode).GsValue;
        }
      });
  }
}
