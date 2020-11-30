import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { formatDate } from '@angular/common';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CustObj } from 'app/shared/model/CustObj.Model';

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

  constructor(
    private route: ActivatedRoute) {
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
    this.UploadViewlink = this.DMSURL(this.custObj,"Upload,View");
    this.Uploadlink = this.DMSURL(this.custObj,"Upload");
    this.Viewlink  = this.DMSURL(this.custObj,"View");
  }

  DMSURL(custObj: CustObj, permission : string) {
    if (custObj != undefined) {
      let Obj: DMSObj = new DMSObj();
      Obj.User = "Admin";
      Obj.Role = "SUPUSR";
      Obj.ViewCode = "ConfinsCust";
      Obj.MetadataParent = null;
      Obj.MetadataObject.push(new DMSLabelValueObj("No Customer", custObj.CustNo));
      Obj.Option.push(new DMSLabelValueObj("OverideSecurity", permission));
      let ObjFinalForm = "js=" + JSON.stringify(Obj) + "&cftsv=" + formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US').toString();
      let prm = AdInsHelper.Encrypt128CBC(ObjFinalForm, this.k, this.iv);
      prm = encodeURIComponent(prm);
      console.log("Final Form : " + ObjFinalForm);
      console.log("http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx?app=CONFINS&prm=" + prm);
      return "http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx?app=CONFINS&prm=" + prm;
    }
  }
}