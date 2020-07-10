import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-tab-commission',
  templateUrl: './tab-commission.component.html'
})
export class TabCommissionComponent implements OnInit {

  @Input() appId: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder) { }

  ListSupplData;
  ListSupplEmpData;
  ListReferantorData;
  SupplData: any = {};
  SupplEmpData: any = {};
  ReferantorData: any = {};
  SummaryData;
  initData() {
    this.ListSupplData = new Array();
    this.ListSupplEmpData = new Array();
    this.ListReferantorData = new Array();
    this.SummaryData = {
      totalCommAmt: 0,
      totalTaxAmt: 0,
      totalVatAmt: 0,
    };
  }

  async ngOnInit() {
    this.initData();
    await this.GetCommissionData();
  }

  async GetCommissionData() {
    var obj: object = { AppId: this.appId };
    var url: string = URLConstant.GetAppCommissionDataDetailByAppId;

    await this.http.post(url, obj).toPromise().then(
      (response) => {
        console.log(response);
        var tempResponse = response[CommonConstant.ReturnObj];
        // console.log(tempResponse);
        for (var i = 0; i < tempResponse.length; i++) {
          var tempObj = tempResponse[i];
          // console.log(tempObj);
          tempObj.ListappCommissionDObj.sort((a, b) => a.SeqNo - b.SeqNo);

          if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplier)
            this.ListSupplData.push(tempObj);
          if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp)
            this.ListSupplEmpData.push(tempObj);
          if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeReferantor)
            this.ListReferantorData.push(tempObj);

          this.SummaryData.totalCommAmt += tempObj.TotalCommissionAmt;
          this.SummaryData.totalTaxAmt += tempObj.TaxAmt;
          this.SummaryData.totalVatAmt += tempObj.VatAmt;
        }

        this.SupplData["title"] = CommonConstant.TitleSupplier;
        this.SupplData["content"] = CommonConstant.ContentSupplier;
        this.SupplData["listData"] = this.ListSupplData;
        this.SupplEmpData["title"] = CommonConstant.TitleSupplierEmp;
        this.SupplEmpData["content"] = CommonConstant.ContentSupplierEmp;
        this.SupplEmpData["listData"] = this.ListSupplEmpData;
        this.ReferantorData["title"] = CommonConstant.TitleReferantor;
        this.ReferantorData["content"] = CommonConstant.ContentReferantor;
        this.ReferantorData["listData"] = this.ListReferantorData;
        // console.log(this.SummaryData); 
        // console.log(this.SupplData);
        // console.log(this.SupplEmpData);
        // console.log(this.ReferantorData);
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
