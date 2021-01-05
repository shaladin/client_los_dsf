import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormCommissionGenerateComponent } from '../commission-v2/form-commission-generate/form-commission-generate.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppAssetDetailObj } from 'app/shared/model/AppAsset/AppAssetDetailObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NapAppReferantorModel } from 'app/shared/model/NapAppReferantor.Model';
import { RuleCommissionObj } from 'app/shared/model/RuleCommission/RuleCommissionObj.Model';
import { AppCommissionHObj } from 'app/shared/model/AppCommissionHObj.Model';
import { ResponseTaxDetailObj } from 'app/shared/model/Tax/ResponseTaxDetail.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ResponseTaxObj } from 'app/shared/model/Tax/ResponseTax.Model';
import { TaxTrxDObj } from 'app/shared/model/Tax/TaxTrxD.Model';
import { AppCommissionDObj } from 'app/shared/model/AppCommissionDObj.Model';
import { ResultRefundObj } from 'app/shared/model/AppFinData/ResultRefund.Model';

@Component({
  selector: 'app-commission-cfna',
  templateUrl: './commission-cfna.component.html',
  styles: []
})
export class CommissionCfnaComponent implements OnInit {
  @ViewChild('Form1') FormAdd1: FormCommissionGenerateComponent;
  @ViewChild('Form2') FormAdd2: FormCommissionGenerateComponent;
  @ViewChild('Form3') FormAdd3: FormCommissionGenerateComponent;
  @Input() AppId: number = 0;
  @Input() showCancel: boolean = true;
  @Input() maxAllocAmt: number = 0;
  @Input() totalExpenseAmt: number = 0;
  @Input() totalRsvFundAmt: number = 0;
  @Input() DictMaxIncomeForm: any = {};
  @Input() BizTemplateCode: string;
  @Input() ListResultRefundIncomeInfo: Array<ResultRefundObj>;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputDictRemaining: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Output() outputUpdateRemainingAlloc: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService
  ) { }

  Summary = {
    TotalCommisionAmount: 0,
    TotalTaxAmmount: 0,
    TotalVATAmount: 0,
    GrossYield: 0
  };
  RemainingAllocAmt: number = 0;
  IsCalculated: boolean = false;

  identifierSupplier: string = CommonConstant.CommissionIdentifierSupplier;
  identifierSupplierEmp: string = CommonConstant.CommissionIdentifierSupplierEmp;
  identifierReferantor: string = CommonConstant.CommissionIdentifierReferantor;
  FormInputObjSupplier: any = {};
  FormInputObjSupplierEmp: any = {};
  FormInputObjReferantor: any = {};
  CommissionForm = this.fb.group({});

  OnForm1: boolean = false;
  OnForm2: boolean = false;
  OnForm3: boolean = false;
  GetFormAddDynamicObj(content) {
    if (content == CommonConstant.ContentSupplier) {
      this.FormInputObjSupplier["title"] = CommonConstant.TitleSupplier;
      this.FormInputObjSupplier["content"] = CommonConstant.ContentSupplier;
      this.FormInputObjSupplier["labelName"] = CommonConstant.LabelSupplier;
      this.FormInputObjSupplier["AppId"] = this.AppId;
      this.FormInputObjSupplier["contentObj"] = this.ContentObjSupplier;
      this.FormInputObjSupplier["ruleObj"] = this.RuleSupplierData;
      this.FormInputObjSupplier["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplier["isCalculated"] = false;
      this.FormInputObjSupplier["isDataInputed"] = false;
      this.OnForm1 = true;
      // console.log(this.FormInputObjSupplier);
    } else if (content == CommonConstant.ContentSupplierEmp) {
      this.FormInputObjSupplierEmp["title"] = CommonConstant.TitleSupplierEmp;
      this.FormInputObjSupplierEmp["content"] = CommonConstant.ContentSupplierEmp;
      this.FormInputObjSupplierEmp["labelName"] = CommonConstant.LabelSupplierEmp;
      this.FormInputObjSupplierEmp["AppId"] = this.AppId;
      this.FormInputObjSupplierEmp["contentObj"] = this.ContentObjSupplierEmp;
      this.FormInputObjSupplierEmp["ruleObj"] = this.RuleSupplierEmpData;
      this.FormInputObjSupplierEmp["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplierEmp["isCalculated"] = false;
      this.FormInputObjSupplierEmp["isDataInputed"] = false;
      this.FormInputObjSupplierEmp["dictSuppl"] = this.DictSupplierCode;
      this.OnForm2 = true;
      // console.log(this.FormInputObjSupplierEmp);
    } else if (content == CommonConstant.ContentReferantor) {
      this.FormInputObjReferantor["title"] = CommonConstant.TitleReferantor;
      this.FormInputObjReferantor["content"] = CommonConstant.ContentReferantor;
      this.FormInputObjReferantor["labelName"] = CommonConstant.LabelReferantor;
      this.FormInputObjReferantor["AppId"] = this.AppId;
      this.FormInputObjReferantor["contentObj"] = this.ContentObjReferantor;
      this.FormInputObjReferantor["ruleObj"] = this.RuleReferantorData;
      this.FormInputObjReferantor["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjReferantor["isCalculated"] = false;
      this.FormInputObjReferantor["isDataInputed"] = false;
      this.OnForm3 = true;
      // console.log(this.FormInputObjReferantor);
    }
  }

  async ngOnInit() {
    this.RemainingAllocAmt = this.maxAllocAmt - this.totalExpenseAmt - this.totalRsvFundAmt;
    await this.GetListAppReservedFundByAppId();
    await this.GetContentData();
    await this.GetRuleDataForForm();
    // console.log(this.CommissionForm);
    // console.log(this.DictMaxIncomeForm);
    await this.GetExistingAppCommData();
    // console.log(this.CommissionForm.value.SupplierReferantor.length);

    // if(Object.keys(this.CommissionForm.value).length === 0 && this.CommissionForm.value.constructor === Object){
    //   if(this.BizTemplateCode == CommonConstant.CFNA){
    //     this.IsCalculated = true;
    //   }
    // }
    console.log("DictMaxIncomeForm: " + JSON.stringify(this.DictMaxIncomeForm));
    console.log("FormInputObjSupplier: " + JSON.stringify(this.FormInputObjSupplier));
  }

  DictRemainingIncomeForm: any = {};
  async GetListAppReservedFundByAppId(){
    for (let index = 0; index < this.ListResultRefundIncomeInfo.length; index++) {
      const element = this.ListResultRefundIncomeInfo[index];
      let TempObj = new ResultRefundObj();
      TempObj.RefundAllocationFrom = element.RefundAllocationFrom;
      TempObj.RefundAllocationFromDesc = element.RefundAllocationFromDesc;
      TempObj.RefundAmount = element.RefundAmount;
      this.DictRemainingIncomeForm[element.RefundAllocationFrom] = TempObj;
    }
    await this.http.post(URLConstant.GetListAppReservedFundByAppId, {AppId: this.AppId}).toPromise().then(
      (response)=>{
        // console.log(response);
        let tempObj: Array<any> = response[CommonConstant.ReturnObj];
        // console.log(tempObj);
        for (let index = 0; index < tempObj.length; index++) {
          const element = tempObj[index];
          // console.log(element);
          if(this.DictRemainingIncomeForm[element.MrReservedFundSourceCode]){
            this.DictRemainingIncomeForm[element.MrReservedFundSourceCode].RefundAmount-=element.ReservedFundAmt;
          }          
        }
        // console.log(this.DictRemainingIncomeForm);
        this.outputDictRemaining.emit(this.DictRemainingIncomeForm);
      }
    )
  }

  async GetContentData() {
    var obj;
    obj = {
      AppId: this.AppId,
      RowVersion: ""
    };
    // await this.http.post(URLConstant.GetAppLoanPurposeVendorAndVendorEmpByAppId, obj).toPromise().then(
    //   (response) => {
    //     console.log("GetContentData: " + JSON.stringify(response));
    //     if (response["AppLoanPurposeVendorObjs"].length != 0) {
    //       this.GetDDLContent(response["AppLoanPurposeVendorObjs"], CommonConstant.ContentSupplier);
    //       // this.GetDDLContent(response.ListAppAssetSupplEmpObj, CommonConstant.ContentSupplierEmp);
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    obj = {
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post<NapAppReferantorModel>(URLConstant.GetAppReferantorByAppId, obj).toPromise().then(
      (response) => {
        // console.log(response);
        this.GetDDLContent(response, CommonConstant.ContentReferantor);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ContentObjSupplier = new Array();
  ContentObjSupplierEmp = new Array();
  ContentObjReferantor = new Array();
  DictSupplierCode: any = {};
  GetDDLContent(ReturnObject, content: string) {
    // console.log(ReturnObject);
    if (content == CommonConstant.ContentReferantor) {
      if (ReturnObject.AppId == null) return;
      var KVPObj;
      KVPObj = {
        Key: ReturnObject.ReferantorCode,
        Value: ReturnObject.ReferantorName
      };
      this.ContentObjReferantor.push(KVPObj);
      this.FormInputObjReferantor["BankData"] = {
        BankCode: ReturnObject.RefBankCode,
        BankName: "",
        BankAccNo: ReturnObject.BankAccNo,
        BankAccName: ReturnObject.BankAccName,
        BankBranch: ReturnObject.BankBranch,
      };
    } else {
      for (var i = 0; i < ReturnObject.length; i++) {
        var KVPObj;
        if (content == CommonConstant.ContentSupplier) {
          KVPObj = {
            Key: ReturnObject[i].SupplCode,
            Value: ReturnObject[i].SupplName
          };
          // console.log(this.DictSupplierCode);
          // console.log(this.DictSupplierCode[ReturnObject[i].SupplCode]);
          this.DictSupplierCode[ReturnObject[i].SupplCode] = ReturnObject[i].SupplName;
          this.ContentObjSupplier.push(KVPObj);
        } else if (content == CommonConstant.ContentSupplierEmp) {
          // console.log(ReturnObject[i]);
          KVPObj = {
            Key: ReturnObject[i].SupplEmpNo,
            Value: ReturnObject[i].SupplEmpName,
            MrSupplEmpPositionCode: ReturnObject[i].MrSupplEmpPositionCode,
            MrSupplEmpPositionCodeDesc: ReturnObject[i].MrSupplEmpPositionCodeDesc,
            SupplCode: ReturnObject[i].SupplCode
          };
          this.ContentObjSupplierEmp.push(KVPObj);
        }
      }
    }
  }

  RuleSupplierData: any = {};
  RuleSupplierEmpData: any = {};
  RuleReferantorData: any = {};
  async GetRuleDataForForm() {
    var obj = { AppId: this.AppId, BizTemplateCode: this.BizTemplateCode };
    await this.http.post(URLConstant.GetAppCommissionRule, obj).toPromise().then(
      (response) => {
        console.log("Cek Rule");
        console.log(response);
        // if (response[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplier != null || response[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplierEmp){ // For CFNA
        //   for (var i = 0; i < response["length"]; i++) {
        //     var temp: RuleCommissionObj = response[i][CommonConstant.ReturnObj].RuleDataObjects;
        //     // console.log(temp);
        //     this.BindRuleData(temp.ResultSupplier, CommonConstant.ContentSupplier, this.ContentObjSupplier[i].Key);
        //     this.BindRuleData(temp.ResultSupplierEmp, CommonConstant.ContentSupplierEmp, this.ContentObjSupplier[i].Key);
        //   }
        // }
        if (response[0][CommonConstant.ReturnObj].RuleDataObjects.ResultReferantor != null)
          this.BindRuleData(response[0][CommonConstant.ReturnObj].RuleDataObjects.ResultReferantor, CommonConstant.ContentReferantor, this.ContentObjReferantor[0].Key);

        // console.log(this.RuleSupplierData);
        // console.log(this.RuleSupplierEmpData);
        // console.log(this.RuleReferantorData);

      },
      (error) => {
        console.log(error);
      }
    );
  }

  BindRuleData(tempObj: any, contentType: string, supplCode: string) {
    console.log("Bind Rule Data");
    console.log(tempObj);
    // console.log(contentType);
    // console.log(supplCode);
    var listTempObj = new Array();
    if (contentType == CommonConstant.ContentSupplier) {
      for (var i = 0; i < tempObj.AllocationFrom.length; i++) {
        var temp = {
          AllocationAmount: tempObj.AllocationAmount[i],
          AllocationBehaviour: tempObj.AllocationBehaviour[i],
          AllocationFrom: tempObj.AllocationFrom[i],
          AllocationFromDesc: tempObj.AllocationFromDesc[tempObj.AllocationFrom[i]],
          AllocationFromSeq: tempObj.AllocationFromSeq[tempObj.AllocationFrom[i]],
          MaxAllocationAmount: tempObj.MaxAllocationAmount[i]
        };
        listTempObj.push(temp);
        console.log("listTempObj: " + JSON.stringify(listTempObj));
      };
      // sort
      listTempObj.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
      this.RuleSupplierData[supplCode] = listTempObj;
    }
    if (contentType == CommonConstant.ContentSupplierEmp) {
      var DictJobPosition: any = {};
      var tempJobPosition: string = "";
      var listJobPosition = new Array();
      for (var i = 0; i < tempObj.AllocationFrom.length; i++) {
        if (tempJobPosition != tempObj.JobPositionCode[i]) {
          listTempObj = new Array();
          tempJobPosition = tempObj.JobPositionCode[i];
          listJobPosition.push(tempJobPosition);
        }
        var temp = {
          AllocationAmount: tempObj.AllocationAmount[i],
          AllocationBehaviour: tempObj.AllocationBehaviour[i],
          AllocationFrom: tempObj.AllocationFrom[i],
          AllocationFromDesc: tempObj.AllocationFromDesc[tempObj.AllocationFrom[i]],
          AllocationFromSeq: tempObj.AllocationFromSeq[tempObj.AllocationFrom[i]],
          MaxAllocationAmount: tempObj.MaxAllocationAmount[i]
        };
        listTempObj.push(temp);
        DictJobPosition[tempObj.JobPositionCode[i]] = listTempObj;
      }

      // sort 
      for (var i = 0; i < listJobPosition.length; i++) {
        listTempObj = DictJobPosition[listJobPosition[i]];
        // console.log(listTempObj);
        listTempObj.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
      }
      this.RuleSupplierEmpData[supplCode] = DictJobPosition;
    }
    if (contentType == CommonConstant.ContentReferantor) {
      for (var i = 0; i < tempObj.AllocationFrom.length; i++) {
        var temp = {
          AllocationAmount: tempObj.AllocationAmount[i],
          AllocationBehaviour: tempObj.AllocationBehaviour[i],
          AllocationFrom: tempObj.AllocationFrom[i],
          AllocationFromDesc: tempObj.AllocationFromDesc[tempObj.AllocationFrom[i]],
          AllocationFromSeq: tempObj.AllocationFromSeq[tempObj.AllocationFrom[i]],
          MaxAllocationAmount: tempObj.MaxAllocationAmount[i]
        };
        listTempObj.push(temp);
      };
      // sort
      listTempObj.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
      this.RuleReferantorData[supplCode] = listTempObj;
    }
  }

  isAutoGenerate: boolean = true;
  async GetExistingAppCommData() {
    var objApi = { AppId: this.AppId };
    await this.http.post(URLConstant.GetAppCommissionDataForEditByAppId, objApi).toPromise().then(
      (response) => {
        console.log("response edit comm");
        console.log(response);
        var tempObj: Array<AppCommissionHObj> = response[CommonConstant.ReturnObj];
        if (tempObj.length > 0) {
          // console.log("edit data");
          this.isAutoGenerate = false;
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplier);
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(CommonConstant.ContentReferantor);
          setTimeout(() => {
            for (let index = 0; index < tempObj.length; index++) {
              let tempObjAt = tempObj[index];
              // console.log(tempObjAt);
              if (tempObjAt.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplier) {
                this.FormAdd1.PatchDataExisting(tempObjAt);
              }
              else if (tempObjAt.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp) {
                this.FormAdd2.PatchDataExisting(tempObjAt);
              }
              else if (tempObjAt.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeReferantor) {
                this.FormAdd3.PatchDataExisting(tempObjAt);
              }
            }
            // console.log(this.CommissionForm);            
          }, 1000);


        } else {
          // console.log("new data");
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplier);
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(CommonConstant.ContentReferantor);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetData() {
    console.log("change data");
    this.IsCalculated = false;
  }

  DictTotalIncomeForm: any = {};
  ListAllocFromForDict: Array<string> = new Array();
  CalculateTotal() {
    console.log("Calc");
    this.Summary.TotalCommisionAmount = 0;
    this.Summary.TotalTaxAmmount = 0;
    this.Summary.TotalVATAmount = 0;
    this.Summary.GrossYield = 0;
    this.totalExpenseAmt = 0;

    for (var i = 0; i < this.ListAllocFromForDict.length; i++) {
      // console.log("test nol semua");
      this.DictTotalIncomeForm[this.ListAllocFromForDict[i]] = 0;
    }

    var listVendorCode: Array<string> = new Array<string>();
    var listVendorEmpNo: Array<string> = new Array<string>();
    var listTrxAmt: Array<Array<number>> = new Array<Array<number>>();
    // if(this.GetCalcTaxData(this.identifierSupplier, listVendorCode, listVendorEmpNo, listTrxAmt)) return;
    // if(this.GetCalcTaxData(this.identifierSupplierEmp, listVendorCode, listVendorEmpNo, listTrxAmt)) return;
    if (this.GetCalcTaxData(this.identifierReferantor, listVendorCode, listVendorEmpNo, listTrxAmt)) return;
    // console.log(listVendorCode);
    // console.log(listVendorEmpNo);
    // console.log(listTrxAmt);

    if (listVendorCode.length > 0) {
      var obj = {
        AppId: this.AppId,
        VendorCode: listVendorCode,
        VendorEmpNo: listVendorEmpNo,
        TrxAmt: listTrxAmt,
        TrxTypeCode: CommonConstant.TrxTypeCodeAppCom,
        ExchangeRateAmt: CommonConstant.ExchangeRateAmt,
        IsSave: false,
      };
      if (this.CekMaxValueIncomeInfo()) return;

      // console.log(obj);
      // console.log(JSON.stringify(obj));

      this.http.post<ResponseTaxDetailObj>(URLConstant.GetAppCommissionTaxAndCalcGrossYield, obj).subscribe(
        (response) => {
          // console.log(response);
          let idxStart = 0;
          // let totalSupplData = this.CommissionForm.value[this.identifierSupplier].length;
          // let totalSupplEmpData = this.CommissionForm.value[this.identifierSupplierEmp].length;
          let totalReferantorData = this.CommissionForm.value[this.identifierReferantor].length;
          // idxStart = this.BindTaxData(this.identifierSupplier, response, idxStart, totalSupplData);
          // idxStart = this.BindTaxData(this.identifierSupplierEmp, response, idxStart, totalSupplEmpData);
          idxStart = this.BindTaxData(this.identifierReferantor, response, idxStart, totalReferantorData);
          // console.log(this.CommissionForm);
          // console.log(this.DictTotalIncomeForm);
          this.Summary.GrossYield = response.GrossYield;
          this.RemainingAllocAmt = this.maxAllocAmt - this.totalExpenseAmt - this.totalRsvFundAmt;
          if (0 > this.RemainingAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Remaining Allocated Amount");
          // console.log(this.RemainingAllocAmt);
          this.IsCalculated = true;
          this.outputUpdateRemainingAlloc.emit(this.totalExpenseAmt);
        },
        (error) => {
          this.IsCalculated = false;
          console.log(error);
        }
      );
    }
  }

  GetCalcTaxData(identifier: string, listVendorCode: Array<string>, listVendorEmpNo: Array<string>, listTrxAmt: Array<Array<number>>) {
    for (var i = 0; i < this.CommissionForm.value[identifier].length; i++) {
      if (this.CommissionForm.value[identifier][i].ContentName != "") {
        var tempListTrxAmt: Array<number> = new Array<number>();
        var totalCommAmt: number = 0;
        for (var j = 0; j < this.CommissionForm.value[identifier][i].ListAllocated.length; j++) {

          if (this.DictTotalIncomeForm[this.CommissionForm.value[identifier][i].ListAllocated[j].AllocationFrom] == undefined) {
            // console.log("kosong");
            this.DictTotalIncomeForm[this.CommissionForm.value[identifier][i].ListAllocated[j].AllocationFrom] = 0;
            this.ListAllocFromForDict.push(this.CommissionForm.value[identifier][i].ListAllocated[j].AllocationFrom);
          }
          this.DictTotalIncomeForm[this.CommissionForm.value[identifier][i].ListAllocated[j].AllocationFrom] += this.CommissionForm.value[identifier][i].ListAllocated[j].AllocationAmount;

          tempListTrxAmt.push(this.CommissionForm.value[identifier][i].ListAllocated[j].AllocationAmount);
          totalCommAmt += this.CommissionForm.value[identifier][i].ListAllocated[j].AllocationAmount;
        }
        listTrxAmt.push(tempListTrxAmt);
        if (totalCommAmt == 0) {
          this.IsCalculated = false;
          this.toastr.warningMessage("Please Allocate at least 1 item for " + this.CommissionForm.value[identifier][i].ContentName);
          return true;
        }

        if (identifier == this.identifierSupplierEmp) {
          listVendorCode.push(this.CommissionForm.value[identifier][i].SupplCode);
          listVendorEmpNo.push(this.CommissionForm.value[identifier][i].ContentName);

        } else {
          listVendorCode.push(this.CommissionForm.value[identifier][i].ContentName);
          listVendorEmpNo.push("-");
        }
      } else {
        this.IsCalculated = false;
        var Label = "";
        if (identifier == this.identifierSupplier) Label = CommonConstant.LabelSupplier;
        if (identifier == this.identifierSupplierEmp) Label = CommonConstant.LabelSupplierEmp;
        if (identifier == this.identifierReferantor) Label = CommonConstant.LabelReferantor;
        this.toastr.warningMessage("Please Choose " + Label + " Name at Data " + (i + 1));
        return true;
      }
    }
    return false;
  }

  BindTaxData(identifier: string, TaxDetailData: ResponseTaxDetailObj, idxStart: number, idxEnd: number) {
    // let totalBindData=this.CommissionForm.value[identifier].length;
    for (var i = 0; i < idxEnd; i++) {
      let totalTaxAmount = 0;
      let totalVATAmount = 0;
      let totalExpenseAmount = 0;
      let totalPenaltyAmt = 0;
      let totalDisburseAmount = 0;
      let tempRespTaxObj: ResponseTaxObj = TaxDetailData.ResponseTaxObjs[idxStart];
      for (var j = 0; j < tempRespTaxObj.ReturnObject.length; j++) {
        let taxAmt = 0;
        let vatAmt = 0;
        let totalPenaltyDAmount = 0;
        totalExpenseAmount += tempRespTaxObj.ReturnObject[j].ExpenseAmt;
        totalDisburseAmount += tempRespTaxObj.ReturnObject[j].DisburseAmt;
        totalPenaltyAmt += tempRespTaxObj.ReturnObject[j].PenaltyAmt;
        var TaxTrxDObjData: Array<TaxTrxDObj> = tempRespTaxObj.ReturnObject[j].TaxTrxD;
        for (var k = 0; k < TaxTrxDObjData.length; k++) {
          totalPenaltyDAmount += TaxTrxDObjData[k].PenaltyAmt;
          if (TaxTrxDObjData[k].TaxTypeCode == CommonConstant.TaxTypeCode) {
            taxAmt += TaxTrxDObjData[k].TaxAmt;
            totalTaxAmount += TaxTrxDObjData[k].TaxAmt;
          } else if (TaxTrxDObjData[k].TaxTypeCode == CommonConstant.VATTypeCode) {
            vatAmt = TaxTrxDObjData[k].TaxAmt;
            totalVATAmount += TaxTrxDObjData[k].TaxAmt;
          }
        }

        this.CommissionForm.controls[identifier]["controls"][i].controls.ListAllocated.controls[j].patchValue({
          TaxAmt: taxAmt,
          VatAmt: vatAmt,
          PenaltyAmt: totalPenaltyDAmount,
        });
      }
      this.CommissionForm.controls[identifier]["controls"][i].patchValue({
        MrIdTypeCode: tempRespTaxObj.MrIdTypeCode,
        MrTaxCalcMethodCode: tempRespTaxObj.MrTaxCalcMethodCode,
        TaxpayerNo: tempRespTaxObj.TaxpayerNo,
        TotalTaxAmount: totalTaxAmount,
        TotalVATAmount: totalVATAmount,
        TotalExpenseAmount: totalExpenseAmount,
        TotalPenaltyAmount: totalPenaltyAmt,
        TotalDisburseAmount: totalDisburseAmount,
      });
      this.Summary.TotalCommisionAmount += this.CommissionForm.value[identifier][i].TotalCommisionAmount;
      this.Summary.TotalTaxAmmount += totalTaxAmount;
      this.Summary.TotalVATAmount += totalVATAmount;
      this.totalExpenseAmt += totalExpenseAmount;
      idxStart++;
    }
    return idxStart;
  }

  SaveForm() {
    console.log("save");
    // console.log(Object.keys(this.CommissionForm.value).length);
    // console.log(Object.keys(this.CommissionForm.value)[0]);
    for (var i = 0; i < Object.keys(this.CommissionForm.value).length; i++) {
      if (this.CommissionForm.value[Object.keys(this.CommissionForm.value)[i]].length === 0) {
          this.IsCalculated = true;
      }
    }
    if (!this.IsCalculated) return this.toastr.warningMessage(ExceptionConstant.MUST_CALCUCATE_FIRST);
    if (this.Summary.TotalCommisionAmount > this.maxAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Max Allocated Amount");
    if (0 > this.RemainingAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Remaining Allocated Amount");
    if (this.CekMaxValueIncomeInfo()) return;

    let listAppCommissionHObj: Array<AppCommissionHObj> = new Array<AppCommissionHObj>();
    // this.GetListAppCommObj(this.identifierSupplier, listAppCommissionHObj);
    // this.GetListAppCommObj(this.identifierSupplierEmp, listAppCommissionHObj);
    this.GetListAppCommObj(this.identifierReferantor, listAppCommissionHObj);
    var obj = {
      AppId: this.AppId,
      GrossYield: this.Summary.GrossYield,
      ListAppCommissionHObj: listAppCommissionHObj
    };
    // console.log(obj);
    // console.log(JSON.stringify(obj));
    this.http.post(URLConstant.AddOrEditAppCommissionData, obj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.outputTab.emit();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  CekMaxValueIncomeInfo() {
    console.log("this.DictMaxIncomeForm: " + JSON.stringify(this.DictMaxIncomeForm));
    console.log("this.ListAllocFromForDict: " + JSON.stringify(this.ListAllocFromForDict));
    var flag = false;
    for (var i = 0; i < this.ListAllocFromForDict.length; i++) {
      if (this.DictRemainingIncomeForm[this.ListAllocFromForDict[i]].RefundAmount < this.DictTotalIncomeForm[this.ListAllocFromForDict[i]]) {
        flag = true;
        this.toastr.warningMessage(this.DictRemainingIncomeForm[this.ListAllocFromForDict[i]].RefundAllocationFromDesc + " cannot be more than " + this.DictRemainingIncomeForm[this.ListAllocFromForDict[i]].RefundAmount);
      }
    }
    return flag;
  }

  GetListAppCommObj(identifier: string, listAppCommissionHObj: Array<AppCommissionHObj>) {
    let listData = this.CommissionForm.get(identifier) as FormArray;
    // console.log(listData);
    for (var i = 0; i < listData.value.length; i++) {
      var tempData = new AppCommissionHObj();
      var temp = listData.value[i];
      if (temp.ContentName == "") continue;
      if (identifier == this.identifierSupplier) tempData = this.PatchAppCommHData(temp, CommonConstant.CommissionReceipientTypeCodeSupplier);
      if (identifier == this.identifierSupplierEmp) tempData = this.PatchAppCommHData(temp, CommonConstant.CommissionReceipientTypeCodeSupplierEmp);
      if (identifier == this.identifierReferantor) tempData = this.PatchAppCommHData(temp, CommonConstant.CommissionReceipientTypeCodeReferantor);
      listAppCommissionHObj.push(tempData);
    }
  }

  PatchAppCommHData(AppCommH: any, CommReceipientTypeCode: string) {
    var temp = new AppCommissionHObj();
    if (AppCommH.AppCommissionHId != 0) temp.AppCommissionHId = AppCommH.AppCommissionHId;
    temp.AppId = this.AppId;
    temp.BankAccNo = AppCommH.BankAccountNo;
    temp.BankAccName = AppCommH.BankAccountName;
    temp.BankCode = AppCommH.BankCode;
    temp.BankName = AppCommH.BankName;
    temp.BankBranch = AppCommH.BankBranch;
    temp.TaxAmt = AppCommH.TotalTaxAmount;
    temp.VatAmt = AppCommH.TotalVATAmount;
    temp.PenaltyAmt = AppCommH.TotalPenaltyAmount;
    temp.TotalCommissionAfterTaxAmt = AppCommH.TotalCommisionAmount - (AppCommH.TotalTaxAmount + AppCommH.TotalVATAmount);
    temp.TotalCommissionAmt = AppCommH.TotalCommisionAmount;
    temp.TotalExpenseAmt = AppCommH.TotalExpenseAmount;
    temp.TotalDisburseAmt = AppCommH.TotalDisburseAmount;
    temp.MrCommissionRecipientTypeCode = CommReceipientTypeCode;
    temp.CommissionRecipientRefNo = AppCommH.ContentName;
    temp.MrTaxKindCode = AppCommH.MrIdTypeCode;
    temp.MrTaxCalcMethodCode = AppCommH.MrTaxCalcMethodCode;
    temp.TaxpayerNo = AppCommH.TaxpayerNo;
    temp.RowVersion = AppCommH.RowVersion;
    if (CommReceipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp) {
      temp.ReservedField1 = AppCommH.SupplCode;
      temp.ReservedField2 = AppCommH.MrSupplEmpPositionCodeDesc;
    }
    temp.ListappCommissionDObj = this.PatchAppCommDData(AppCommH);
    return temp;
  }

  PatchAppCommDData(AppCommH: any) {
    var listAppCommissionDObj = new Array();
    var temp = AppCommH.ListAllocated;
    for (var i = 0; i < temp.length; i++) {
      var tempObj = temp[i];
      var tempAppCommissionDObj = new AppCommissionDObj();
      if (tempObj.AppCommissionDId != 0) {
        tempAppCommissionDObj.AppCommissionHId = tempObj.AppCommissionHId;
        tempAppCommissionDObj.AppCommissionDId = tempObj.AppCommissionDId;
      } else {
        tempAppCommissionDObj.AppCommissionDId = 0;
      }
      tempAppCommissionDObj.MrCommissionSourceCode = tempObj.AllocationFrom;
      tempAppCommissionDObj.CommissionAmt = tempObj.AllocationAmount;
      tempAppCommissionDObj.TaxAmt = tempObj.TaxAmt;
      tempAppCommissionDObj.VatAmt = tempObj.VatAmt;
      tempAppCommissionDObj.PenaltyAmt = tempObj.PenaltyAmt;
      tempAppCommissionDObj.RefundAmt = this.DictMaxIncomeForm[tempObj.AllocationFrom].RefundAmount;
      tempAppCommissionDObj.CommissionAmtAfterTax = tempObj.AllocationAmount - (tempObj.TaxAmt + tempObj.VatAmt);
      tempAppCommissionDObj.RowVersion = tempObj.RowVersion;
      listAppCommissionDObj.push(tempAppCommissionDObj);
    }
    return listAppCommissionDObj;
  }

  Cancel() {
    this.outputCancel.emit();
  }

}
