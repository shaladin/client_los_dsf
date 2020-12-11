import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { formatDate } from '@angular/common';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CustObj } from 'app/shared/model/CustObj.Model';
import { DMSKeyObj } from 'app/shared/model/DMS/DMSKeyObj.Model';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
@Component({
  selector: 'app-backdoor',
  templateUrl: './backdoor.component.html',
  styleUrls: []
})
export class BackdoorComponent implements OnInit {

  noParamGiven: boolean = true;
  link: string;
  custObj: CustObj = new CustObj();
  k: string;
  iv: string;
  UploadViewlink: string;
  Uploadlink: string;
  Viewlink: string;
  dmsObj: DMSObj;
  dmsKeyObj : DMSKeyObj;
  rootServer: string;

  constructor(
    private route: ActivatedRoute,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(
      (param: ParamMap) => {
        if (param["CUST_NO"] != undefined && param["KEY"] != undefined && param["IV"] != undefined) {
          this.noParamGiven = false;
          this.custObj.CustNo = param["CUST_NO"];
          this.k = param["KEY"];
          this.iv = param["IV"];
        }
      }
    )
  }

  ngOnInit() {
    // this.UploadViewlink = this.DMSURL(this.custObj,"Upload,View");
    // this.Uploadlink = this.DMSURL(this.custObj,"Upload");
    let testtt = this.cookieService.get(CommonConstant.USER_ACCESS);
    console.log(testtt);
    this.dmsObj = new DMSObj();
    this.dmsObj.User = "Admin";
    this.dmsObj.Role = "SUPUSR";
    this.dmsObj.ViewCode = CommonConstant.DmsViewCodeCust;
    this.dmsObj.MetadataParent = null;
    this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custObj.CustNo));
    this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUpload));

    this.dmsKeyObj = new DMSKeyObj();
    this.dmsKeyObj.k = CommonConstant.DmsKey;
    this.dmsKeyObj.iv = CommonConstant.DmsIV;
    this.rootServer = environment.DMSUrl;
  }

  // DMSURL(custObj: CustObj, permission : string) {
  //   if (custObj != undefined) {

  //     let ObjFinalForm = "js=" + JSON.stringify(Obj) + "&cftsv=" + formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US').toString();
  //     let prm = AdInsHelper.Encrypt128CBC(ObjFinalForm, this.k, this.iv);
  //     prm = encodeURIComponent(prm);
  //     console.log("Final Form : " + ObjFinalForm);
  //     console.log("http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx?app=CONFINS&prm=" + prm);
  //     return "http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx?app=CONFINS&prm=" + prm;
  //   }
  // }
}