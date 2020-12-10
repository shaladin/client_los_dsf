import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from '../AdInsHelper';
import { DMSKeyObj } from '../model/DMS/DMSKeyObj.Model';
import { DMSObj } from '../model/DMS/DMSObj.model';

@Component({
  selector: 'app-dms-iframe',
  templateUrl: './dms-iframe.component.html'
})
export class DmsIframeComponent implements OnInit {
  urlLink: string;
  appName: string = "CONFINS";
  @Input() dmsObj: DMSObj;
  @Input() rootServer: string;
  @Input() dmsKeyObj: DMSKeyObj;
  noParamGiven: boolean = true;
  constructor() { }
  custNo: string;
  ngOnInit() {
    if (this.dmsObj != undefined && this.dmsObj != null && this.dmsKeyObj != undefined && this.dmsKeyObj != null && this.rootServer != "" && this.rootServer != undefined) {
      this.urlLink = this.dmsUrl();
      this.noParamGiven = false;
    }
  }

  dmsUrl() {
    let ObjFinalForm = "js=" + JSON.stringify(this.dmsObj) + "&cftsv=" + formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US').toString();
    let prm = AdInsHelper.Encrypt128CBC(ObjFinalForm, this.dmsKeyObj.k, this.dmsKeyObj.iv);
    prm = encodeURIComponent(prm);
    return this.rootServer + "?app=" + this.appName + "&prm=" + prm;
  }
}
