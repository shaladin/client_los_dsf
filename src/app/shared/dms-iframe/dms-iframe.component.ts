import { formatDate } from '@angular/common';
import { Component, Input,EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsHelper } from '../AdInsHelper';
import { CommonConstant } from '../constant/CommonConstant';
import { DMSObj } from '../model/DMS/DMSObj.model';

@Component({
  selector: 'app-dms-iframe',
  templateUrl: './dms-iframe.component.html'
})
export class DmsIframeComponent implements OnInit {
  urlLink: string;
  appName: string = "CONFINS";

  @Input() showButton: boolean = false;
  @Input() dmsObj: DMSObj;
  rootServer: string;
  dmsKey: string;
  dmsIv: string;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  
  noParamGiven: boolean = true;
  constructor() { }
  custNo: string;
  ngOnInit() {
    this.rootServer = environment.DMSUrl;
    this.dmsKey = CommonConstant.DmsKey;
    this.dmsIv = CommonConstant.DmsIV;
    if (this.dmsObj != undefined && this.dmsObj != null) {
      this.urlLink = this.dmsUrl();
      this.noParamGiven = false;
    }
  }

  dmsUrl() {
    let ObjFinalForm = "js=" + JSON.stringify(this.dmsObj) + "&cftsv=" + formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en-US').toString();
    let prm = AdInsHelper.Encrypt128CBC(ObjFinalForm, this.dmsKey, this.dmsIv);
    prm = encodeURIComponent(prm);
    return this.rootServer + "?app=" + this.appName + "&prm=" + prm;
  }

  Cancel(){
    this.outputCancel.emit();
  }
  Save(){
    this.outputTab.emit();
  }
}
