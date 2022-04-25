import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ResAppCommIncomeObjX } from 'app/impl/shared/model/AppFinData/ResAppCommIncomeObjX.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';

@Component({
  selector: 'app-edit-comm-after-approval-component-view-detail',
  templateUrl: './edit-comm-after-approval-component-view-detail.component.html',
  styleUrls: ['./edit-comm-after-approval-component-view-detail.component.css']
})
export class EditCommAfterApprovalComponentViewDetailComponent implements OnInit {

  @Input() TrxId: number;
  @Input() ConditionOld: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder) { 
    
     }
  
  ConditionString:string="";

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

  ListResultRefundIncomeInfo: Array<ResAppCommIncomeObjX>=[new ResAppCommIncomeObjX];
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
    //old
    if(this.ConditionOld){
      
      await this.http.post(URLConstantX.GetListEditCommOldByTrxId, { Id: this.TrxId }).toPromise().then(
        (response) => {
          this.ListResultRefundIncomeInfo = response[CommonConstant.ReturnObj]
          this.MaxAllocatedAmount = this.ListResultRefundIncomeInfo.reduce((total, x) => total + x.CommissionCompntAmt, 0 )
        })
    }
    else if (!this.ConditionOld){
      await this.http.post(URLConstantX.GetListEditCommNewByTrxId, { Id: this.TrxId }).toPromise().then(
        (response) => {
          this.ListResultRefundIncomeInfo = response[CommonConstant.ReturnObj]
          this.MaxAllocatedAmount = this.ListResultRefundIncomeInfo.reduce((total, x) => total + x.CommissionCompntAmt, 0 )
        })
    }
    //new
     
    // END UATDSFCF-911

  }

  async ngOnInit() {
    if (this.ConditionOld){
      this.ConditionString="Old"
    }
    else if (!this.ConditionOld){
      this.ConditionString="New"
    }
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
    tempObj.ListappCommissionDObj.sort((a, b) => a.SeqNo - b.SeqNo);
    if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplier)
      this.ListSupplData.push(tempObj);
    if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp)
      this.ListSupplEmpData.push(tempObj);
    if (tempObj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeReferantor)
      this.ListReferantorData.push(tempObj);


    if(tempObj.MrTaxCalcMethodCode == "NETT"){
      summaryObj.totalCommAmt += tempObj.TotalCommissionAmt;
    }
    else{
      summaryObj.totalCommAmt += tempObj.TotalCommissionAfterTaxAmt;
    }

    summaryObj.totalCommAfterTaxAmt += tempObj.TotalCommissionAfterTaxAmt;
    summaryObj.totalTaxAmt += (tempObj.TaxAmt + tempObj.PenaltyAmt);
    summaryObj.totalVatAmt += tempObj.VatAmt;
    summaryObj.totalDisburmentAmt += tempObj.TotalDisburseAmt;
    summaryObj.totalExpenseAmt += tempObj.TotalExpenseAmt;
  }

  async GetCommissionData() {

    if(this.ConditionOld){
      await this.http.post(URLConstantX.GetEditCommOldDataDetailByTrxId, { Id: this.TrxId }).toPromise().then(
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
    else if (!this.ConditionOld){
      await this.http.post(URLConstantX.GetEditCommNewDataDetailByTrxId, { Id: this.TrxId }).toPromise().then(
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
    
  }

}
