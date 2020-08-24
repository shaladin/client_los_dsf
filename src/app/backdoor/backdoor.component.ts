import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { formatDate } from '@angular/common';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-backdoor',
  templateUrl: './backdoor.component.html',
  styleUrls: []
})
export class BackdoorComponent implements OnInit {

  noParamGiven: boolean = true;
  link: string;
  mouCustObj: MouCustObj = new MouCustObj();
  k: string;
  iv: string;

  constructor(
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(
      (param: ParamMap) => {
        if (param["MOU_NO"] != undefined && param["CUST_NO"] != undefined && param["KEY"] != undefined && param["IV"] != undefined) {
          this.noParamGiven = false;
          this.mouCustObj.CustNo = param["CUST_NO"];
          this.mouCustObj.MouCustNo = param["MOU_NO"];
          this.k = param["KEY"];
          this.iv = param["IV"];
        }
      }
    )
  }

  ngOnInit() {
    console.log("BDSDFS");
    this.link = this.DMSIntegrationURL(this.mouCustObj);
  }

  DMSIntegrationURL(mouCustObj: MouCustObj) {
    if (mouCustObj != undefined) {
      let Obj: DMSObj = new DMSObj();
      Obj.User = "Admin";
      Obj.Role = "SUPUSR";
      Obj.ViewCode = "ConfinsMou";
      Obj.MetadataParent.push(new DMSLabelValueObj("No Customer", mouCustObj.CustNo));
      Obj.MetadataObject.push(new DMSLabelValueObj("Mou Id", mouCustObj.MouCustNo));
      let ObjFinalForm = "js=" + JSON.stringify(Obj) + "&cftsv=" + formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US').toString();
      let prm = AdInsHelper.Encrypt128CBC(ObjFinalForm, this.k, this.iv);
      prm = encodeURIComponent(prm);
      console.log("Final Form : " + ObjFinalForm);
      console.log("http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx?app=CONFINS&prm=" + prm);
      return "http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx?app=CONFINS&prm=" + prm;
    }
  }
}