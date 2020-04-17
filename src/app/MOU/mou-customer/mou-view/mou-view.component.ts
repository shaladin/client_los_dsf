import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';

@Component({
  selector: 'app-mou-view',
  templateUrl: './mou-view.component.html',
})
export class MouViewComponent implements OnInit {
 @Input() inputMouCustId;
  
  getMouCustByIdUrl : any;
  MouCustId : any;
  mouCustObj : any;
  resultData : any;
  MrMouTypeCode : any;
  constructor(private http: HttpClient, private route: ActivatedRoute) { 
    this.getMouCustByIdUrl = AdInsConstant.GetMouCustById;
    this.route.queryParams.subscribe(params => {
      if (params["MouCustId"] != null)
        this.MouCustId = params["MouCustId"];
      else
       this.MouCustId = this.inputMouCustId;
    });
   
  }
  viewMouHeader: any;
  ngOnInit() {
    this.viewMouHeader = "./assets/ucviewgeneric/viewMouHeader.json";
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
     
    this.http.post(this.getMouCustByIdUrl, this.mouCustObj).subscribe(
      (response) => {
        this.resultData = response;
        this.MrMouTypeCode = this.resultData['MrMouTypeCode']; 
      },
      (error) =>{
        console.log(error);
      }
    );
  }
  isDetail: any;
  isFee: any;
  isCollateral: any;
  isTC: any;
  isDocument: any;
  isSurvey: any;
  isApprovalHistory: any;
  isLegalReview: any;
  EnterTab(type) {
    if (type == "detail") {
      this.isDetail = true;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
    }
    else if (type == "fee") {
      this.isDetail =false;
      this.isFee = true;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
    }
    else if (type == "collateral") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = true;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
    }
    else if (type == "TC") {
      this.isDetail = true;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = true;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
    }
    else if (type == "document") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = true;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
    }
    else if (type == "survey") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = true;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
    }
    else if (type == "approvalHistory") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = true;
      this.isLegalReview = false;
    }
    else if (type == "legalReview") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = true;
    }
  }
}