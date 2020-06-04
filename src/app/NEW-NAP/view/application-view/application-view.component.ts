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
  
  BizTemplateCode : string;
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

  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.BizTemplateCode = params["BizTemplateCode"];
    })
  }

  ngOnInit() {
    this.arrValue.push(this.AppId);
    this.GetAppCust();
    if(this.BizTemplateCode==AdInsConstant.FCTR)
    {
      this.IsCollateral = false;
      this.IsGuarantor = false;
      this.IsReferantor = false;
      this.IsCommission = false;
      this.IsReservedFund = false;
      this.IsPhoneVerification = false;
      this.IsAsset = false;
      this.IsMultiAsset = false;
  
    }
    else if(this.BizTemplateCode==AdInsConstant.CFRFN4W){
      this.IsAsset = false;
      this.IsMultiCollateral = false;
      this.IsInvoice = false;
      this.IsMultiAsset = false;
      this.IsMultiInsurance = false;
    }
    else if(this.BizTemplateCode==AdInsConstant.CF4W){
      this.IsCollateral = false;
      this.IsMultiCollateral = false;
      this.IsInvoice = false;
      this.IsMultiAsset = false;
      this.IsMultiInsurance = false;
    }
    else if(this.BizTemplateCode==AdInsConstant.FL4W)
    {
      this.IsAsset = false;
      this.IsCollateral = false;
      this.IsMultiCollateral = false;
      this.IsInvoice = false;
      this.IsInsurance = false;
    }
  }

  GetAppCust() {
    var appObj = {
      AppId: this.AppId,
    };
    this.http.post(AdInsConstant.GetAppCustByAppId, appObj).subscribe(
      (response) => {
        this.AppCustObj = response;
        console.log(response);
        this.CustType = this.AppCustObj.MrCustTypeCode;
      }
    );
  }

}
