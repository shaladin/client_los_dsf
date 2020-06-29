import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from '../../../shared/AdInstConstant';

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

  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  ngOnInit() {
    console.log("APP BESARAN")
    this.arrValue.push(this.AppId);
    this.GetApp();
  }

  GetApp() {
    var appObj = {
      AppId: this.AppId,
    };
    this.http.post(AdInsConstant.GetAppById, appObj).subscribe(
      (response) => {
        var bizTemplateCode = response["BizTemplateCode"];
        this.CustType = response["MrCustTypeCode"];

        if(bizTemplateCode == AdInsConstant.FCTR)
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
      
        }
        else if(bizTemplateCode == AdInsConstant.CFRFN4W){
          this.IsAsset = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsFraudDetectionMulti = false;
        }
        else if(bizTemplateCode == AdInsConstant.CF4W){
          this.IsCollateral = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsFraudDetectionMulti = false;
        }
        else if(bizTemplateCode == AdInsConstant.FL4W)
        {
          this.IsAsset = false;
          this.IsCollateral = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsInsurance = false;
        }
      }
    );
  }

}
