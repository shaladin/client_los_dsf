import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { MatTabChangeEvent } from '@angular/material';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: []
})
export class ApplicationViewComponent implements OnInit {
  AppId: number;
  arrValue = [];
  CustType: string = "";
  AppCustObj: any;
  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;
  IsCustomer : boolean = true;
  IsGuarantor : boolean = true;
  IsReferantor : boolean = true;
  IsApplication : boolean = true;
  IsInvoice : boolean = true;
  IsAsset : boolean = true;
  IsMultiAsset : boolean = true;
  IsInsurance : boolean = true;
  IsMultiInsurance : boolean = true;
  IsLifeInsurance : boolean = true;
  IsFinancial : boolean = true;
  IsTC : boolean = true;
  IsCommission : boolean = true;
  IsReservedFund : boolean = true;
  IsPhoneVerification : boolean = true;
  IsFraudDetectionResult : boolean = true;
  IsAnalysisResult : boolean = true;
  IsCollateral : boolean = true;
  IsMultiCollateral : boolean = true;
  IsApprovalHist: boolean = true;
  IsFraudDetectionMulti: boolean = true;
  bizTemplateCode : string = "";
  appNo: string;
  constructor(private route: ActivatedRoute, private http: HttpClient,  private componentFactoryResolver: ComponentFactoryResolver) { 
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  ngOnInit() {
    this.arrValue.push(this.AppId);
    this.GetApp();
    this.viewAppMainInfo.ReloadUcViewGeneric();
  }

  GetApp() {
    var appObj = {
      AppId: this.AppId,
    };
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response) => {
        this.appNo = response['AppNo'];
        this.bizTemplateCode = response["BizTemplateCode"];
        this.CustType = response["MrCustTypeCode"];

        if(this.bizTemplateCode == CommonConstant.FCTR)
        {
          this.IsCollateral = false;
          this.IsGuarantor = false;
          this.IsReferantor = false;
          this.IsCommission = false;
          this.IsReservedFund = false;
          this.IsPhoneVerification = false;
          this.IsAsset = false;
          this.IsMultiAsset = false;
          this.IsFraudDetectionMulti = false;
          this.IsInsurance = false;
      
        }
        else if(this.bizTemplateCode == CommonConstant.CFRFN4W){
          this.IsAsset = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsFraudDetectionMulti = false;
        }
        else if(this.bizTemplateCode == CommonConstant.CF4W){
          this.IsCollateral = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsFraudDetectionMulti = false;
        }
        else if(this.bizTemplateCode == CommonConstant.FL4W)
        {
          this.IsAsset = false;
          this.IsCollateral = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsInsurance = false;
        }
        else if(this.bizTemplateCode == CommonConstant.CFNA){
          this.IsAsset = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsFraudDetectionMulti = false;
          this.IsCollateral = false;
        }
      }
    );
  }
  tabChangeEvent( tabChangeEvent : MatTabChangeEvent){
    if(tabChangeEvent.index == 0){
      this.GetApp();
    }

    this.viewAppMainInfo.ReloadUcViewGeneric();
  }
}
