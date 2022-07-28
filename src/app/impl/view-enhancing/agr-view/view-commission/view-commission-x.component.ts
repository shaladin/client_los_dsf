import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ResAppCommIncomeObjX } from 'app/impl/shared/model/AppFinData/ResAppCommIncomeObjX.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-view-commission-agrmnt-x',
  templateUrl: './view-commission-x.component.html'
})
export class ViewCommissionXComponent implements OnInit {

  @Input() agrmntId: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  ListSupplData;
  ListSupplEmpData;
  ListReferantorData;
  SupplData: object = {};
  SupplEmpData: object = {};
  ReferantorData: object = {};

  // START UATDSFCF-911
  TotalSupplier;
  TotalSupplierEmp;
  TotalReferantor;

  ListResultRefundIncomeInfo: Array<ResAppCommIncomeObjX> = new Array<ResAppCommIncomeObjX>();
  MaxAllocatedAmount = 0;
  // END UATDSFCF-911

  async initData() {
    this.ListSupplData = new Array();
    this.ListSupplEmpData = new Array();
    this.ListReferantorData = new Array();
    // START UATDSFCF-911
    // - Total Commission dipisah per supplier, supplier emp, dan referantor
    this.TotalSupplier = {
      totalCommAmt: 0,
      totalCommAfterTaxAmt: 0,
      totalTaxAmt: 0,
      totalVatAmt: 0,
      totalDisburmentAmt: 0,
      totalExpenseAmt: 0
    };
    this.TotalSupplierEmp = {
      totalCommAmt: 0,
      totalCommAfterTaxAmt: 0,
      totalTaxAmt: 0,
      totalVatAmt: 0,
      totalDisburmentAmt: 0,
      totalExpenseAmt: 0
    };
    this.TotalReferantor = {
      totalCommAmt: 0,
      totalCommAfterTaxAmt: 0,
      totalTaxAmt: 0,
      totalVatAmt: 0,
      totalDisburmentAmt: 0,
      totalExpenseAmt: 0
    };

    // - Penambahan informasi Income Information
    await this.http.post(URLConstantX.GetCommIncomeInfoByAgrIdX, { Id: this.agrmntId }).toPromise().then(
      (response) => {
        this.ListResultRefundIncomeInfo = response[CommonConstant.ReturnObj]
        this.MaxAllocatedAmount = this.ListResultRefundIncomeInfo.reduce((total, x) => total + x.CommissionCompntAmt, 0 )
      })
    // END UATDSFCF-911
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

  // START UATDSFCF-911 - Total Commission dipisah per supplier, supplier emp, dan referantor
  addSummary(tempObj, summaryObj){
    tempObj.AgrmntCommDObjs.sort((a, b) => a.SeqNo - b.SeqNo);
    if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplier)
      this.ListSupplData.push(tempObj);
    if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp)
      this.ListSupplEmpData.push(tempObj);
    if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeReferantor)
      this.ListReferantorData.push(tempObj);

    summaryObj.totalCommAmt += tempObj.TotalCommissionAmt;
    summaryObj.totalCommAfterTaxAmt += tempObj.TotalCommissionAfterTaxAmt;
    summaryObj.totalTaxAmt += (tempObj.TaxAmt + tempObj.PenaltyAmt);
    summaryObj.totalVatAmt += tempObj.VatAmt;
    summaryObj.totalDisburmentAmt += tempObj.TotalDisburseAmt;
    summaryObj.totalExpenseAmt += tempObj.TotalExpenseAmt;
  }

  async GetCommissionData() {
    await this.http.post(URLConstant.GetListAgrmntCommissionWithDetailByAgrmntId, { Id: this.agrmntId }).toPromise().then(
      (response) => {
        let tempResponse = response[CommonConstant.ReturnObj];
        for (var i = 0; i < tempResponse.length; i++) {
          let tempObj = tempResponse[i];
          switch (tempObj['MrCommissionRecipientTypeCode']) {
            case  CommonConstant.CommissionReceipientTypeCodeSupplier:
              this.addSummary(tempObj, this.TotalSupplier)
              break;
            case  CommonConstant.CommissionReceipientTypeCodeSupplierEmp:
              this.addSummary(tempObj, this.TotalSupplierEmp)
              break;
            case  CommonConstant.CommissionReceipientTypeCodeReferantor:
              this.addSummary(tempObj, this.TotalReferantor)
              break;
          }
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
  // END UATDSFCF-911 - Total Commission dipisah per supplier, supplier emp, dan referantor
}
