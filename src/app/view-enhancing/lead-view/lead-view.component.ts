import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-lead-view',
  templateUrl: './lead-view.component.html'
})

export class LeadViewComponent implements OnInit {
  ReqByIdObj: GenericObj = new GenericObj();
  LeadId: number;
  SrvyOrderId: number = 0;
  LeadNo: string = "";
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  isDmsReady: boolean = false;
  dmsObj: DMSObj;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();

  constructor(private http: HttpClient, private cookieService: CookieService, private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
    });
  }

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewLeadHeader.json";
    await this.getLeadNo();
    await this.InitDms();
  }

  async getLeadNo(){
    this.ReqByIdObj.Id = this.LeadId;
    await this.http.post(URLConstant.GetLeadByLeadId, this.ReqByIdObj).toPromise().then(
      response => {
        this.LeadNo = response["LeadNo"];      
      });
  }

  async InitDms() {
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms }).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });
    await this.http.post(URLConstant.GetLeadByLeadId, { Id: this.LeadId }).toPromise().then(
      (response) => {
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        if (this.SysConfigResultObj.ConfigValue == '1') {
          this.dmsObj = new DMSObj();
          this.dmsObj.User = currentUserContext.UserName;
          this.dmsObj.Role = currentUserContext.RoleCode;
          this.dmsObj.ViewCode = CommonConstant.DmsViewCodeLead;
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response["LeadNo"]));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsLeadId, response["LeadNo"]));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
          this.isDmsReady = true;
        }
      });
  }
}
