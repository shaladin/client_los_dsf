import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mou-view',
  templateUrl: './mou-view.component.html',
  styleUrls: ['./mou-view.component.scss']
})
export class MouViewComponent implements OnInit {

  constructor() { 
    
  }
  viewMouGeneralHeader: any;
  ngOnInit() {
    this.viewMouGeneralHeader = "./assets/ucviewgeneric/viewMouGeneralHeader.json";
  }
  isDetail: any;
  isFee: any;
  isCollateral: any;
  isTC: any;
  isDocument: any;
  isSurvey: any;
  isApprovalHistory: any;
  isMainData: any;
  EnterTab(type) {
    if (type == "detail") {
      this.isDetail = true;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isMainData = false;
    }
    else if (type == "fee") {
      this.isDetail =false;
      this.isFee = true;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isMainData = false;
    }
    else if (type == "collateral") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = true;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isMainData = false;
    }
    else if (type == "TC") {
      this.isDetail = true;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = true;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isMainData = false;
    }
    else if (type == "document") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = true;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isMainData = false;
    }
    else if (type == "survey") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = true;
      this.isApprovalHistory = false;
      this.isMainData = false;
    }
    else if (type == "approvalHistory") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = true;
      this.isMainData = false;
    }
    else if (type == "mainData") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isMainData = true;
    }
  }
}