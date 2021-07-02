import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormCommissionGenerateComponent } from '../commission-v2/form-commission-generate/form-commission-generate.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
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
import { ReqGetAppCommissionRuleObj } from 'app/shared/model/AppCommissionRsvFund/ReqGetAppCommissionRuleObj.Model';
import { ReqTaxObj } from 'app/shared/model/AppCommissionRsvFund/ReqTaxObj.Model';
import { AppReservedFundObj } from 'app/shared/model/AppReservedFundObj.model';

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
  @Input() DictMaxIncomeForm: object = {};
  @Input() BizTemplateCode: string;
  @Input() ListResultRefundIncomeInfo: Array<ResultRefundObj>;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputDictRemaining: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Output() outputUpdateRemainingAlloc: EventEmitter<number> = new EventEmitter();

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
  FormInputObjSupplier: object = {};
  FormInputObjSupplierEmp: object = {};
  FormInputObjReferantor: object = {};
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

  DictRemainingIncomeForm: object = {};
  async GetListAppReservedFundByAppId(){
    for (let index = 0; index < this.ListResultRefundIncomeInfo.length; index++) {
      const element = this.ListResultRefundIncomeInfo[index];
      let TempObj = new ResultRefundObj();
      TempObj.RefundAllocationFrom = element.RefundAllocationFrom;
      TempObj.RefundAllocationFromDesc = element.RefundAllocationFromDesc;
      TempObj.RefundAmount = element.RefundAmount;
      this.DictRemainingIncomeForm[element.RefundAllocationFrom] = TempObj;
    }
    await this.http.post(URLConstant.GetListAppReservedFundByAppId, {Id: this.AppId}).toPromise().then(
      (response)=>{
        // console.log(response);
        let tempObj: Array<AppReservedFundObj> = response[CommonConstant.ReturnObj];
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
    //obj = {
    //  AppId: this.AppId,
    //  RowVersion: ""
    //};
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
      Id: this.AppId,
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
  DictSupplierCode: object = {};
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

  RuleSupplierData: object = {};
  RuleSupplierEmpData: object = {};
  RuleReferantorData: object = {};
  async GetRuleDataForForm() {
    let obj: ReqGetAppCommissionRuleObj = { AppId: this.AppId, BizTemplateCode: this.BizTemplateCode };
    await this.http.post(URLConstant.GetAppCommissionRule, obj).toPromise().then(
      (response) => {
        var ResponseObj = response[CommonConstant.ReturnObj];
        // if (response[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplier != null || response[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplierEmp){ // For CFNA
        //   for (var i = 0; i < response["length"]; i++) {
        //     var temp: RuleCommissionObj = response[i][CommonConstant.ReturnObj].RuleDataObjects;
        //     // console.log(temp);
        //     this.BindRuleData(temp.ResultSupplier, CommonConstant.ContentSupplier, this.ContentObjSupplier[i].Key);
        //     this.BindRuleData(temp.ResultSupplierEmp, CommonConstant.ContentSupplierEmp, this.ContentObjSupplier[i].Key);
        //   }
        // }
        if (ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultReferantor != null)
          this.BindRuleData(ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultReferantor, CommonConstant.ContentReferantor, this.ContentObjReferantor[0].Key);
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
      var DictJobPosition: object = {};
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
    var objApi = { Id: this.AppId };
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

  DictTotalIncomeForm: object = {};
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
      let obj: ReqTaxObj = {
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
    const tempDataList = this.CommissionForm.get(identifier) as FormArray;
    for (var i = 0; i < tempDataList.length; i++) {
      const tempData = tempDataList.get(i.toString()) as FormGroup;
      const ContentName = tempData.get("ContentName").value;
      if (ContentName != "") {
        var tempListTrxAmt: Array<number> = new Array<number>();
        var totalCommAmt: number = 0;
        const tempListAllocated = tempData.get("ListAllocated") as FormArray;
        for (var j = 0; j < tempListAllocated.length; j++) {
          const tempListAllocIdxAt = tempListAllocated.get(j.toString()) as FormGroup;
          const AllocFrom = tempListAllocIdxAt.get("AllocationFrom").value;
          const AllocAmt = tempListAllocIdxAt.get("AllocationAmount").value;
          if (this.DictTotalIncomeForm[AllocFrom] == undefined) {
            this.DictTotalIncomeForm[AllocFrom] = 0;
            this.ListAllocFromForDict.push(AllocFrom);
          }
          this.DictTotalIncomeForm[AllocFrom] += AllocAmt;

          tempListTrxAmt.push(AllocAmt);
          totalCommAmt += AllocAmt;
        }
        listTrxAmt.push(tempListTrxAmt);
        if (totalCommAmt == 0) {
          this.IsCalculated = false;
          this.toastr.warningMessage("Please Allocate at least 1 item for " + ContentName);
          return true;
        }

        if (identifier == this.identifierSupplierEmp) {
          const SupplCode = tempData.get("SupplCode").value;
          listVendorCode.push(SupplCode);
          listVendorEmpNo.push(ContentName);

        } else {
          listVendorCode.push(ContentName);
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

    let listAppCommissionHAddObj: Array<AppCommissionHObj> = new Array<AppCommissionHObj>();
    let listAppCommissionHEditObj: Array<AppCommissionHObj> = new Array<AppCommissionHObj>();
    // this.GetListAppCommObj(this.identifierSupplier, listAppCommissionHObj);
    // this.GetListAppCommObj(this.identifierSupplierEmp, listAppCommissionHObj);
    this.GetListAppCommObj(this.identifierReferantor, listAppCommissionHAddObj, listAppCommissionHEditObj);
    var obj = {
      AppId: this.AppId,
      GrossYield: this.Summary.GrossYield,
      ListAppCommissionHAddObj: listAppCommissionHAddObj,
      ListAppCommissionHEditObj: listAppCommissionHEditObj
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

  GetListAppCommObj(identifier: string, listAppCommissionHAddObj: Array<AppCommissionHObj>, listAppCommissionHEditObj: Array<AppCommissionHObj>) {
    const listData = this.CommissionForm.get(identifier) as FormArray;
    for (var i = 0; i < listData.length; i++) {
      var tempData = new AppCommissionHObj();
      const temp = listData.get(i.toString()) as FormGroup;
      if (temp.get("ContentName").value == "") continue;
      if (identifier == this.identifierSupplier) tempData = this.PatchAppCommHData(temp, CommonConstant.CommissionReceipientTypeCodeSupplier);
      if (identifier == this.identifierSupplierEmp) tempData = this.PatchAppCommHData(temp, CommonConstant.CommissionReceipientTypeCodeSupplierEmp);
      if (identifier == this.identifierReferantor) tempData = this.PatchAppCommHData(temp, CommonConstant.CommissionReceipientTypeCodeReferantor);
      if (tempData.AppCommissionHId == 0) {
        listAppCommissionHAddObj.push(tempData);
        continue;
      }
      listAppCommissionHEditObj.push(tempData);
    }
  }

  PatchAppCommHData(AppCommH: FormGroup, CommReceipientTypeCode: string) {
    console.log(AppCommH);
    var temp = new AppCommissionHObj();
    if (AppCommH.get("AppCommissionHId").value != 0) temp.AppCommissionHId = AppCommH.get("AppCommissionHId").value;
    temp.AppId = this.AppId;
    temp.BankAccNo = AppCommH.get("BankAccountNo").value;
    temp.BankAccName = AppCommH.get("BankAccountName").value;
    temp.BankCode = AppCommH.get("BankCode").value;
    temp.BankName = AppCommH.get("BankName").value;
    temp.BankBranch = AppCommH.get("BankBranch").value;
    temp.TaxAmt = AppCommH.get("TotalTaxAmount").value;
    temp.VatAmt = AppCommH.get("TotalVATAmount").value;
    temp.PenaltyAmt = AppCommH.get("TotalPenaltyAmount").value;
    temp.TotalCommissionAfterTaxAmt = AppCommH.get("TotalCommisionAmount").value - (AppCommH.get("TotalTaxAmount").value + AppCommH.get("TotalVATAmount").value);
    temp.TotalCommissionAmt = AppCommH.get("TotalCommisionAmount").value;
    temp.TotalExpenseAmt = AppCommH.get("TotalExpenseAmount").value;
    temp.TotalDisburseAmt = AppCommH.get("TotalDisburseAmount").value;
    temp.MrCommissionRecipientTypeCode = CommReceipientTypeCode;
    temp.CommissionRecipientRefNo = AppCommH.get("ContentName").value;
    temp.MrTaxKindCode = AppCommH.get("MrTaxKindCode").value;
    temp.MrTaxCalcMethodCode = AppCommH.get("MrTaxCalcMethodCode").value;
    temp.TaxpayerNo = AppCommH.get("TaxpayerNo").value;
    temp.RowVersion = AppCommH.get("RowVersion").value;
    if (CommReceipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp) {
      temp.ReservedField1 = AppCommH.get("SupplCode").value;
      temp.ReservedField2 = AppCommH.get("MrSupplEmpPositionCodeDesc").value;
    }
    temp.ListappCommissionDObj = this.PatchAppCommDData(AppCommH);
    return temp;
  }

  PatchAppCommDData(AppCommH: FormGroup) {
    var listAppCommissionDObj = new Array();
    const temp = AppCommH.get("ListAllocated") as FormArray;
    for (var i = 0; i < temp.length; i++) {
      const tempObj = temp.get(i.toString()) as FormGroup;
      var tempAppCommissionDObj = new AppCommissionDObj();
      if (tempObj.get("AppCommissionDId").value != 0) {
        tempAppCommissionDObj.AppCommissionHId = tempObj.get("AppCommissionHId").value;
        tempAppCommissionDObj.AppCommissionDId = tempObj.get("AppCommissionDId").value;
      } else {
        tempAppCommissionDObj.AppCommissionDId = 0;
      }
      tempAppCommissionDObj.MrCommissionSourceCode = tempObj.get("AllocationFrom").value;
      tempAppCommissionDObj.CommissionAmt = tempObj.get("AllocationAmount").value;
      tempAppCommissionDObj.TaxAmt = tempObj.get("TaxAmt").value;
      tempAppCommissionDObj.VatAmt = tempObj.get("VatAmt").value;
      tempAppCommissionDObj.PenaltyAmt = tempObj.get("PenaltyAmt").value;
      tempAppCommissionDObj.RefundAmt = this.DictMaxIncomeForm[tempObj.get("AllocationFrom").value].RefundAmount;
      tempAppCommissionDObj.CommissionAmtAfterTax = tempObj.get("AllocationAmount").value - (tempObj.get("TaxAmt").value + tempObj.get("VatAmt").value);
      tempAppCommissionDObj.RowVersion = tempObj.get("RowVersion").value;
      listAppCommissionDObj.push(tempAppCommissionDObj);
    }
    return listAppCommissionDObj;
  }

  Cancel() {
    this.outputCancel.emit();
  }

}
