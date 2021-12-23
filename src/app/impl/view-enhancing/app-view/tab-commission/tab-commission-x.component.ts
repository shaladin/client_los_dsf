import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';

@Component({
  selector: 'app-tab-commission-x',
  templateUrl: './tab-commission-x.component.html'
})
export class TabCommissionXComponent implements OnInit {

  @Input() appId: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder) { }

  ListSupplData;
  ListSupplEmpData;
  ListReferantorData;
  SupplData: object = {};
  SupplEmpData: object = {};
  ReferantorData: object = {};
  SummaryData;
  initData() {
    this.ListSupplData = new Array();
    this.ListSupplEmpData = new Array();
    this.ListReferantorData = new Array();
    this.SummaryData = {
      totalCommAmt: 0,
      totalCommAfterTaxAmt: 0,
      totalTaxAmt: 0,
      totalVatAmt: 0,
      totalDisburmentAmt: 0,
      totalExpenseAmt: 0
    };
  }

  async ngOnInit() {
    this.initData();
    this.GetCalcMethod();
    await this.GetCommissionData();
  }

  DictCalcMethod: { [id: string]: string } = {};
  GetCalcMethod() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeTaxCalcMethod }).subscribe(
      (response) => {
        let listRefMaster: Array<KeyValueObj> = response[CommonConstant.ReturnObj];
        if (listRefMaster.length > 0) {
          for (let index = 0; index < listRefMaster.length; index++) {
            const element = listRefMaster[index];
            this.DictCalcMethod[element.Key] = element.Value;
          }
        }
      }
    );
  }

  async GetCommissionData() {
    var obj: object = { Id: this.appId };
    var url: string = URLConstant.GetAppCommissionDataDetailByAppId;

    await this.http.post(url, obj).toPromise().then(
      (response) => {
        var tempResponse = response[CommonConstant.ReturnObj];
        for (var i = 0; i < tempResponse.length; i++) {
          var tempObj = tempResponse[i];
          tempObj.ListappCommissionDObj.sort((a, b) => a.SeqNo - b.SeqNo);

          if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplier)
            this.ListSupplData.push(tempObj);
          if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp)
            this.ListSupplEmpData.push(tempObj);
          if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeReferantor)
            this.ListReferantorData.push(tempObj);


          if(tempObj.MrTaxCalcMethodCode == "NETT"){
            this.SummaryData.totalCommAmt += tempObj.TotalCommissionAmt;
          }
          else{
            this.SummaryData.totalCommAmt += tempObj.TotalCommissionAfterTaxAmt;
          }
          
          this.SummaryData.totalCommAfterTaxAmt += tempObj.TotalCommissionAfterTaxAmt;
          this.SummaryData.totalTaxAmt += (tempObj.TaxAmt + tempObj.PenaltyAmt);
          this.SummaryData.totalVatAmt += tempObj.VatAmt;
          this.SummaryData.totalDisburmentAmt += tempObj.TotalDisburseAmt;
          this.SummaryData.totalExpenseAmt += tempObj.TotalExpenseAmt;
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
      })
  }
}
