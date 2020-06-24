import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-agreement-view-container',
  templateUrl: './agreement-view-container.component.html',
  styleUrls: []
})
export class AgreementViewContainerComponent implements OnInit {

  arrValue = [];
  AgrmntId;
  BizTemplateCode: string;
  ResponseAppDetailData;
  IsReady: boolean = false;
  IsCustomer: boolean = true;
  IsAsset: boolean = true;
  IsDocument: boolean = true;
  IsInsurance: boolean = true;
  IsAgreementCard: boolean = true;
  IsCommission: boolean = true;
  IsPurchaseOrder: boolean = true;
  IsCustomerCard: boolean = true;
  IsDeviation: boolean = true;
  IsLoanData: boolean = true;
  IsCollateral: boolean = true;
  IsDeliveryOrder: boolean = true;
  IsSummary: boolean = true;

  IsInsuranceFL4W: boolean = true;
  IsLifeInsurance: boolean = true;
  IsFinancial: boolean = true;
  IsTC: boolean = true;
  IsReservedFund: boolean = true;
  IsInvoiceData: boolean = true;
  IsComplainHandling: boolean = true;
  IsAdditionalService: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  async ngOnInit() {
    console.log(this.AgrmntId);
    this.arrValue.push(this.AgrmntId);
    await this.GetAgrmnt();
    await this.GetAppAndAppCustDetailByAgrmntId();
  }

  async GetAppAndAppCustDetailByAgrmntId() {
    var obj = { agrmntId: this.AgrmntId };
    await this.http.post(AdInsConstant.GetAppAndAppCustDetailByAgrmntId, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.ResponseAppDetailData = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async GetAgrmnt() {
    var agrmntObj = {
      AgrmntId: this.AgrmntId,
    };
    this.http.post(AdInsConstant.GetAgrmntByAgrmntId, agrmntObj).subscribe(
      (response) => {
        var bizTemplateCode = response["BizTemplateCode"];

        if (bizTemplateCode == AdInsConstant.FCTR) {
          this.IsCollateral = false;
          this.IsCommission = false;
          this.IsAsset = false;
          this.IsInsuranceFL4W = false;
          this.IsLifeInsurance = false;
          this.IsFinancial = false;
          this.IsTC = false;
          this.IsReservedFund = false;
        }
        else if (bizTemplateCode == AdInsConstant.CFRFN4W) {
          this.IsAsset = false;
          this.IsCollateral = false;
          this.IsLoanData = false;
          this.IsInsuranceFL4W = false;
          this.IsLifeInsurance = false;
          this.IsFinancial = false;
          this.IsTC = false;
          this.IsReservedFund = false;
        }
        else if (bizTemplateCode == AdInsConstant.CF4W) {
          this.IsCollateral = false;
          this.IsInsuranceFL4W = false;
          this.IsLifeInsurance = false;
          this.IsFinancial = false;
          this.IsTC = false;
          this.IsReservedFund = false;
        }
        else if (bizTemplateCode == AdInsConstant.FL4W) {
          this.IsAsset = false;
          this.IsInsurance = false;
          this.IsCustomerCard = false;
          this.IsDeviation = false;
          this.IsLoanData = false;
          this.IsInvoiceData = false;
          this.IsComplainHandling = false;
          this.IsAdditionalService = false;
        }
        this.IsReady = true;
      });
  }
}
