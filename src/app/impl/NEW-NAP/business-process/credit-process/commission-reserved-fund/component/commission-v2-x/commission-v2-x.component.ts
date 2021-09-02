import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AppCommissionDObjX } from 'app/impl/shared/model/AppCommissionDObjX.Model';
import { AppCommissionHObjX } from 'app/impl/shared/model/AppCommissionHObjX.Model';
import { AppCommSupplEmpObjX } from 'app/impl/shared/model/AppCommSupplEmpObjX.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppAssetDetailObj } from 'app/shared/model/AppAsset/AppAssetDetailObj.Model';
import { AppCommissionHObj } from 'app/shared/model/AppCommissionHObj.Model';
import { ReqGetAppCommissionRuleObj } from 'app/shared/model/AppCommissionRsvFund/ReqGetAppCommissionRuleObj.Model';
import { ReqTaxObj } from 'app/shared/model/AppCommissionRsvFund/ReqTaxObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { ResultRefundObj } from 'app/shared/model/AppFinData/ResultRefund.Model';
import { AppReservedFundObj } from 'app/shared/model/AppReservedFundObj.model';
import { NapAppReferantorModel } from 'app/shared/model/NapAppReferantor.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { RuleCommissionObj } from 'app/shared/model/RuleCommission/RuleCommissionObj.Model';
import { ResponseTaxObj } from 'app/shared/model/Tax/ResponseTax.Model';
import { ResponseTaxDetailObj } from 'app/shared/model/Tax/ResponseTaxDetail.Model';
import { TaxTrxDObj } from 'app/shared/model/Tax/TaxTrxD.Model';
import { FormCommissionGenerateXComponent } from './form-commission-generate-x/form-commission-generate-x.component';

@Component({
  selector: 'app-commission-v2-x',
  templateUrl: './commission-v2-x.component.html',
  styleUrls: ['./commission-v2-x.component.css']
})
export class CommissionV2XComponent implements OnInit {

  @ViewChild('Form1') FormAdd1: FormCommissionGenerateXComponent;
  @ViewChild('Form2') FormAdd2: FormCommissionGenerateXComponent;
  @ViewChild('Form3') FormAdd3: FormCommissionGenerateXComponent;
  @Input() ReturnHandlingHObj: ReturnHandlingHObj;
  @Input() showCancel: boolean = true;
  @Input() maxAllocAmt: number = 0;
  @Input() totalExpenseAmt: number = 0;
  @Input() totalRsvFundAmt: number = 0;
  @Input() DictMaxIncomeForm: object = {};
  @Input() BizTemplateCode: string;
  @Input() LobCode: string = "";
  
  @Input() ListResultRefundIncomeInfo: Array<ResultRefundObj>;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputDictRemaining: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Output() outputUpdateRemainingAlloc: EventEmitter<any> = new EventEmitter();
  @Output() outputCommCondition:EventEmitter<boolean> = new EventEmitter();
  AppId: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,) { }

  Summary = {
    TotalCommisionAmount: 0,
    TotalTaxAmmount: 0,
    TotalVATAmount: 0,
    GrossYield: 0
  };
  RemainingAllocAmt: number = 0;
  ActRemainingAlloc:number = 0;
  IsCalculated: boolean = false;

  ListAppCommHObj: Array<AppCommissionHObjX> = new Array();
  totalSupplier:number = 0;
  totalSupplierEmp:number = 0;
  totalReferantor:number = 0;
  AppIsPersonal: boolean = true;
  lockAppCommTab: boolean=false;
  SectionPosition:boolean=false;

  readonly AllocTypeAmt = CommonConstant.AllocTypeAmt;
  readonly AllocTypePerc = CommonConstant.AllocTypePerc;

  identifierSupplier: string = CommonConstant.CommissionIdentifierSupplier;
  identifierSupplierEmp: string = CommonConstant.CommissionIdentifierSupplierEmp;
  identifierReferantor: string = CommonConstant.CommissionIdentifierReferantor;
  FormInputObjSupplier: object = {};
  FormInputObjSupplierEmp: object = {};
  FormInputObjReferantor: object = {};
  CommissionForm = this.fb.group({
    AllocType: this.AllocTypeAmt
  });

  OnForm1: boolean = false;
  OnForm2: boolean = false;
  OnForm3: boolean = false;
  HideForm1: boolean = false;
  HideForm2: boolean = false;
  HideForm3: boolean = false;
  listPrioritySuppl: Array<string> = new Array();
  listPrioritySupplEmp: Array<string> = new Array();
  listPriorityReferantor: Array<string> = new Array();
  ListSupplEmpPos: Array<RefMasterObj> = new Array<RefMasterObj>();

  async ngOnInit() {
    this.AppId = this.ReturnHandlingHObj.AppId;
    this.RemainingAllocAmt = this.maxAllocAmt - this.totalExpenseAmt - this.totalRsvFundAmt;
    this.ActRemainingAlloc = this.maxAllocAmt - this.totalRsvFundAmt;
    
    await this.GetListAppReservedFundByAppId();
    await this.GetListAllocatePriority();
    await this.GetAppCust();
    await this.EmpPositionSectValidate();
    await this.GetContentData();
    await this.GetRuleDataForForm();
    await this.GetExistingAppCommData();

  }

  async GetListAllocatePriority(){
    await this.http.post(URLConstantX.GetAppRsvFundPriorityRule, {Id: this.AppId}).toPromise().then(
      (response) => {
        this.listPrioritySuppl = response["ReturnObject"]["ListPrioritySupplier"];
        this.listPrioritySupplEmp = response["ReturnObject"]["ListPrioritySupplEmp"];
        this.listPriorityReferantor = response["ReturnObject"]["ListPriorityReferantor"];
      }
    );
  }

  async GetAppCust() {
    await this.http.post<AppCustObj>(URLConstant.GetAppCustByAppId, {Id: this.AppId}).toPromise().then(
      (response) => {
        if (response.MrCustTypeCode == CommonConstant.CustTypeCompany) {
          this.AppIsPersonal = false
        }
      }
    )
  }

  async EmpPositionSectValidate()
  {
    let validateInsurance: boolean = false;
    for(let i=0;i<this.ListResultRefundIncomeInfo.length;i++)
    {
      if(this.ListResultRefundIncomeInfo[i].RefundAllocationFrom == CommonConstantX.AllocationFronInsuranceIncomeCode && this.ListResultRefundIncomeInfo[i].RefundAmount > 0)
      {
        validateInsurance = true;
        break;
      }
      else if(this.ListResultRefundIncomeInfo[i].RefundAllocationFrom == CommonConstantX.AllocationFronInsuranceIncomeCode && this.ListResultRefundIncomeInfo[i].RefundAmount == 0)
      {
        break;
      }
    }

    if(validateInsurance)
    {
      await this.http.post(URLConstantX.GetAppAssetByAppIdConditionNewBrandMitsubishi, {Id: this.AppId}).toPromise().then(
        (response) => {
          if(response[CommonConstant.ReturnObj].length > 0)
          {
            this.SectionPosition = true;
          }
        }
      );
    }

    if(this.SectionPosition)
    {
      let tempReq = { RefMasterTypeCode: CommonConstantX.RefMasterTypeCodeSbePositionMnl, MappingCode: null };
      await this.http.post(URLConstant.GetListActiveRefMaster, tempReq).toPromise().then(
        (response) => {
          this.ListSupplEmpPos = response[CommonConstant.ReturnObj];
        }
      );
    }
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
        let tempObj: Array<AppReservedFundObj> = response[CommonConstant.ReturnObj];
        for (let index = 0; index < tempObj.length; index++) {
          const element = tempObj[index];
          if(this.DictRemainingIncomeForm[element.MrReservedFundSourceCode]){
            this.DictRemainingIncomeForm[element.MrReservedFundSourceCode].RefundAmount-=element.ReservedFundAmt;
          }          
        }
        if(tempObj.length == 0)
        {
          this.lockAppCommTab = true;
        }
        this.outputCommCondition.emit(this.lockAppCommTab);
        this.outputUpdateRemainingAlloc.emit(0);
        this.outputDictRemaining.emit(this.DictRemainingIncomeForm);
      }
    )
  }

  async GetContentData() {
    var obj;
    obj = {
      Id: this.AppId,
      RowVersion: ""
    };
    await this.http.post<AppAssetDetailObj>(URLConstant.GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppId, obj).toPromise().then(
      (response) => {
        if (response.ListAppAssetObj.length != 0) {
          this.GetDDLContent(response.ListAppAssetObj, CommonConstant.ContentSupplier);
          this.GetDDLContent(response.ListAppAssetSupplEmpObj, CommonConstant.ContentSupplierEmp);
        }
      });

    obj = {
      Id: this.AppId,
      RowVersion: ""
    };
    await this.http.post<NapAppReferantorModel>(URLConstant.GetAppReferantorByAppId, obj).toPromise().then(
      (response) => {
        this.GetDDLContent(response, CommonConstant.ContentReferantor);
      });
  }

  RuleSupplierData: object = {};
  RuleSupplierEmpData: object = {};
  RuleReferantorData: object = {};
  async GetRuleDataForForm() {
    let obj: ReqGetAppCommissionRuleObj = { AppId: this.AppId, BizTemplateCode: this.BizTemplateCode };
    await this.http.post(URLConstantX.GetAppCommissionRule, obj).toPromise().then(
      (response) => {
        var ResponseObj = response[CommonConstant.ReturnObj];

        // override hide suppl & suppl emp jika CFRFN4W ignore rule
        if(this.BizTemplateCode == CommonConstant.CFRFN4W || this.BizTemplateCode == CommonConstant.CFNA || this.LobCode == CommonConstantX.SLB)
        {
          ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplier = null;
          ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplierEmp = null;
          this.HideForm1 = true;
          this.HideForm2 = true;
        }
        if (ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplier != null || ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplierEmp) { // For CFNA
          for (var i = 0; i < ResponseObj["length"]; i++) {
            var temp: RuleCommissionObj = ResponseObj[i][CommonConstant.ReturnObj].RuleDataObjects;
            this.BindRuleData(temp.ResultSupplier, CommonConstant.ContentSupplier, this.ContentObjSupplier[i].Key);
            this.BindRuleData(temp.ResultSupplierEmp, CommonConstant.ContentSupplierEmp, this.ContentObjSupplier[i].Key);
          }
        }
        if (ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultReferantor != null)
          this.BindRuleData(ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultReferantor, CommonConstant.ContentReferantor, this.ContentObjReferantor[0].Key);
      }
    );
  }

  //GetDDl
  ContentObjSupplier = new Array();
  ContentObjSupplierEmp = new Array();
  ContentObjReferantor = new Array();
  DictSupplierCode: object = {};
  GetDDLContent(ReturnObject, content: string) {
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
          this.DictSupplierCode[ReturnObject[i].SupplCode] = ReturnObject[i].SupplName;
          this.ContentObjSupplier.push(KVPObj);
        } else if (content == CommonConstant.ContentSupplierEmp) {
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

  BindRuleData(tempObj: any, contentType: string, supplCode: string) {
    var listTempObj = new Array();
    if (contentType == CommonConstant.ContentSupplier) {
      for (var i = 0; i < tempObj.AllocationFrom.length; i++) {
        var temp = {
          AllocationAmount: tempObj.AllocationAmount[i],
          AllocationBehaviour: tempObj.AllocationBehaviour[i],
          AllocationFrom: tempObj.AllocationFrom[i],
          MaxAllocationAmount: tempObj.MaxAllocationAmount[i]
        };
        listTempObj.push(temp);
      };
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
          MaxAllocationAmount: tempObj.MaxAllocationAmount[i]
        };
        listTempObj.push(temp);
        DictJobPosition[tempObj.JobPositionCode[i]] = listTempObj;
      }

      // sort 
      // for (var i = 0; i < listJobPosition.length; i++) {
      //   listTempObj = DictJobPosition[listJobPosition[i]];
      //   listTempObj.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
      // }
      this.RuleSupplierEmpData[supplCode] = DictJobPosition;
    }
    if (contentType == CommonConstant.ContentReferantor) {
      for (var i = 0; i < tempObj.AllocationFrom.length; i++) {
        var temp = {
          AllocationAmount: tempObj.AllocationAmount[i],
          AllocationBehaviour: tempObj.AllocationBehaviour[i],
          AllocationFrom: tempObj.AllocationFrom[i],
          MaxAllocationAmount: tempObj.MaxAllocationAmount[i]
        };
        listTempObj.push(temp);
      };
      this.RuleReferantorData[supplCode] = listTempObj;
    }
  }

  isAutoGenerate: boolean = true;
  async GetExistingAppCommData() {
    var objApi = { Id: this.AppId };
    await this.http.post(URLConstant.GetAppCommissionDataForEditByAppId, objApi).toPromise().then(
      (response) => {
        var tempObj: Array<AppCommissionHObj> = response[CommonConstant.ReturnObj];
        if (tempObj.length > 0) {
          this.isAutoGenerate = false;
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplier);
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(CommonConstant.ContentReferantor);
          setTimeout(() => {
            for (let index = 0; index < tempObj.length; index++) {
              let tempObjAt = tempObj[index];
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
          }, 1000);


        } else {
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplier);
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(CommonConstant.ContentReferantor);
        }
      });
  }

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
    }
  }

  //dari html
  GetData() {
    this.IsCalculated = false;
  }

  DictTempRemainingIncomeForm: Object = {}
  async NewCalculateTotal(){
    console.log("CALCULATE NEW");
    this.DictTempRemainingIncomeForm = new Object();
    
    for(var dict in this.DictRemainingIncomeForm)
    {
        let TempObj = new ResultRefundObj();
        TempObj.RefundAllocationFrom = this.DictRemainingIncomeForm[dict].RefundAllocationFrom;
        TempObj.RefundAllocationFromDesc = this.DictRemainingIncomeForm[dict].RefundAllocationFromDesc;
        TempObj.RefundAmount = this.DictRemainingIncomeForm[dict].RefundAmount;
        this.DictTempRemainingIncomeForm[dict] = TempObj;
    }
 
    this.totalSupplier = 0;
    this.totalSupplierEmp = 0;
    this.totalReferantor = 0;

    this.Summary.TotalCommisionAmount = 0;
    this.Summary.TotalTaxAmmount = 0;
    this.Summary.TotalVATAmount = 0;
    this.Summary.GrossYield = 0;
    this.totalExpenseAmt = 0;
    var listVendorCode: Array<string> = new Array<string>();
    var listVendorEmpNo: Array<string> = new Array<string>();
    var listTrxAmt: Array<Array<number>> = new Array<Array<number>>();
    this.ListAppCommHObj = new Array();

    if(this.AllocateDataWithPriority(this.identifierSupplier, listVendorCode, listVendorEmpNo, listTrxAmt)) return;
    if(this.AllocateDataWithPriority(this.identifierSupplierEmp, listVendorCode, listVendorEmpNo, listTrxAmt)) return;
    if(this.AllocateDataWithPriority(this.identifierReferantor, listVendorCode, listVendorEmpNo, listTrxAmt)) return;
    

    if(listVendorCode.length > 0)
    {
      let obj: ReqTaxObj = {
        AppId: this.AppId,
        VendorCode: listVendorCode,
        VendorEmpNo: listVendorEmpNo,
        TrxAmt: listTrxAmt,
        TrxTypeCode: CommonConstant.TrxTypeCodeAppCom,
        ExchangeRateAmt: CommonConstant.ExchangeRateAmt,
        IsSave: false,
      };

      await this.http.post<ResponseTaxDetailObj>(URLConstantX.GetAppCommissionTaxAndCalcGrossYieldX, obj).toPromise().then(
        (response) => {
          let idxStart = 0;
          let totalSupplData = this.totalSupplier;
          let totalSupplEmpData = this.totalSupplierEmp;
          let totalReferantorData = this.totalReferantor;
          idxStart = this.mapTaxData(this.identifierSupplier, response, idxStart, totalSupplData);
          idxStart = this.mapTaxData(this.identifierSupplierEmp, response, idxStart, totalSupplEmpData);
          idxStart = this.mapTaxData(this.identifierReferantor, response, idxStart, totalReferantorData);
          this.Summary.GrossYield = response.GrossYield;
          this.RemainingAllocAmt = this.maxAllocAmt - this.totalExpenseAmt - this.totalRsvFundAmt;
          if (0 > this.RemainingAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Remaining Allocated Amount");
          this.IsCalculated = true;
          this.outputUpdateRemainingAlloc.emit(this.totalExpenseAmt);
        },
        (error) => {
          this.IsCalculated = false;
        }
      );
    }
  }

  mapTaxData(identifier: string, TaxDetailData: ResponseTaxDetailObj, idxStart: number, idxEnd: number)
  {
    var recipientType: string;
    if (identifier == this.identifierSupplier) recipientType=  CommonConstant.CommissionReceipientTypeCodeSupplier
    if (identifier == this.identifierSupplierEmp) recipientType=  CommonConstant.CommissionReceipientTypeCodeSupplierEmp
    if (identifier == this.identifierReferantor) recipientType= CommonConstant.CommissionReceipientTypeCodeReferantor


    for (var i = 0; i < idxEnd; i++) 
    {
      let totalTaxAmount = 0;
      let totalVATAmount = 0;
      let totalExpenseAmount = 0;
      let totalPenaltyAmt = 0;
      let totalDisburseAmount = 0;
      let tempRespTaxObj: ResponseTaxObj = TaxDetailData.ResponseTaxObjs[idxStart]; 
      for (var j = 0; j < tempRespTaxObj.ReturnObject.length; j++)                    
      {
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

        this.ListAppCommHObj[idxStart].ListappCommissionDObj[j].TaxAmt = taxAmt;
        this.ListAppCommHObj[idxStart].ListappCommissionDObj[j].VatAmt = vatAmt;
        this.ListAppCommHObj[idxStart].ListappCommissionDObj[j].PenaltyAmt = totalPenaltyDAmount;
        this.ListAppCommHObj[idxStart].ListappCommissionDObj[j].CommissionAmtAfterTax -= (taxAmt + vatAmt);

        // this.CommissionForm.controls[identifier]["controls"][i].controls.ListAllocated.controls[j].patchValue({
        //   TaxAmt: taxAmt,
        //   VatAmt: vatAmt,
        //   PenaltyAmt: totalPenaltyDAmount,
        // });
      }
      this.ListAppCommHObj[idxStart].MrTaxKindCode = tempRespTaxObj.MrTaxKindCode;
      this.ListAppCommHObj[idxStart].MrTaxCalcMethodCode = tempRespTaxObj.MrTaxCalcMethodCode;
      this.ListAppCommHObj[idxStart].TaxpayerNo = tempRespTaxObj.TaxpayerNo;
      this.ListAppCommHObj[idxStart].TaxAmt = totalTaxAmount;
      this.ListAppCommHObj[idxStart].VatAmt = totalVATAmount;
      this.ListAppCommHObj[idxStart].TotalExpenseAmt = totalExpenseAmount;
      this.ListAppCommHObj[idxStart].PenaltyAmt = totalPenaltyAmt;
      this.ListAppCommHObj[idxStart].TotalDisburseAmt = totalDisburseAmount;
      this.ListAppCommHObj[idxStart].TotalCommissionAfterTaxAmt -= (totalTaxAmount + totalVATAmount);

      this.CommissionForm.controls[identifier]["controls"][i].patchValue({
        MrIdTypeCode: tempRespTaxObj.MrIdTypeCode,
        MrTaxKindCode: tempRespTaxObj.MrTaxKindCode,
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


  AllocateDataWithPriority(identifier:string, listVendorCode: Array<string>, listVendorEmpNo: Array<string>, listTrxAmt: Array<Array<number>>)
  {
    const tempDataList = this.CommissionForm.get(identifier) as FormArray;
    for (var i = 0; i < tempDataList.length; i++) {
      const tempData = tempDataList.get(i.toString()) as FormGroup;
      var tempAppComm = new AppCommissionHObjX();

      const ContentName = tempData.get("ContentName").value;
      if (ContentName != "") {
        //MAP H DATA
        tempAppComm = this.MapFormDataToAppCommHList(tempData, identifier);
        
        //MAP D DATA
        var totalCommAmt: number = 0;
        const tempListAllocated = tempData.get("ListAllocated") as FormArray;
        var idx=0;
          const tempListAllocIdxAt = tempListAllocated.get(idx.toString()) as FormGroup;
          const AllocAmt = tempListAllocIdxAt.get("AllocationAmount").value;

          var tempListTrxAmt: Array<number> = this.allocateValue(AllocAmt, tempAppComm.ListappCommissionDObj, identifier);
          totalCommAmt = AllocAmt;      
        
        if (totalCommAmt == 0) {
          this.IsCalculated = false;
          this.toastr.warningMessage("Please Allocate Commission Amount for " + ContentName);
          return true;
        }
        listTrxAmt.push(tempListTrxAmt);

        if (identifier == this.identifierSupplierEmp) {
          const SupplCode = tempData.get("SupplCode").value;
          listVendorCode.push(SupplCode);
          listVendorEmpNo.push(ContentName);

        } else {
          listVendorCode.push(ContentName);
          listVendorEmpNo.push("-");
        }

        if (identifier == this.identifierSupplier) this.totalSupplier += 1;
        if (identifier == this.identifierReferantor) this.totalReferantor += 1;
        if (identifier == this.identifierSupplierEmp) 
        {
          const tempListSupplEmp = tempData.get("ListEmpPosition") as FormArray;
          for(let z=0;z<tempListSupplEmp.length;z++)
          {
            const tempListSupplEmpIdx = tempListSupplEmp.get(z.toString()) as FormGroup;
            if(tempListSupplEmpIdx.get("PositionSelect").value)
            {
              var tempEmp = new AppCommSupplEmpObjX();
              // tempEmp.SeqNo = tempListSupplEmpIdx.get("SeqNo").value;
              tempEmp.SeqNo = tempAppComm.ListAppCommSupplEmpObj.length+1;
              tempEmp.MrSbePositionMnl = tempListSupplEmpIdx.get("MasterCode").value;
              tempAppComm.ListAppCommSupplEmpObj.push(tempEmp);
            }

          }
          this.totalSupplierEmp += 1;
        }
        this.ListAppCommHObj.push(tempAppComm);
        
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

  MapFormDataToAppCommHList(FormHData: FormGroup, identifier:string)
  {
    var CommReceipientTypeCode:string;
    if (identifier == this.identifierSupplier) CommReceipientTypeCode=  CommonConstant.CommissionReceipientTypeCodeSupplier
    if (identifier == this.identifierSupplierEmp) CommReceipientTypeCode=  CommonConstant.CommissionReceipientTypeCodeSupplierEmp
    if (identifier == this.identifierReferantor) CommReceipientTypeCode= CommonConstant.CommissionReceipientTypeCodeReferantor


    var temp = new AppCommissionHObjX();
    if (FormHData.get("AppCommissionHId").value != 0) temp.AppCommissionHId = FormHData.get("AppCommissionHId").value;
    temp.AppId = this.AppId;
    temp.BankAccNo = FormHData.get("BankAccountNo").value;
    temp.BankAccName = FormHData.get("BankAccountName").value;
    temp.BankCode = FormHData.get("BankCode").value;
    temp.BankName = FormHData.get("BankName").value;
    temp.BankBranch = FormHData.get("BankBranch").value;
    temp.TaxAmt = FormHData.get("TotalTaxAmount").value;
    temp.VatAmt = FormHData.get("TotalVATAmount").value;
    temp.PenaltyAmt = FormHData.get("TotalPenaltyAmount").value;
    temp.TotalCommissionAfterTaxAmt = FormHData.get("TotalCommisionAmount").value;
    temp.TotalCommissionAmt = FormHData.get("TotalCommisionAmount").value;
    temp.TotalExpenseAmt = FormHData.get("TotalExpenseAmount").value;
    temp.TotalDisburseAmt = FormHData.get("TotalDisburseAmount").value;
    temp.MrCommissionRecipientTypeCode = CommReceipientTypeCode;
    temp.CommissionRecipientRefNo = FormHData.get("ContentName").value;
    temp.MrTaxKindCode = FormHData.get("MrTaxKindCode").value;
    temp.MrTaxCalcMethodCode = FormHData.get("MrTaxCalcMethodCode").value;
    temp.TaxpayerNo = FormHData.get("TaxpayerNo").value;
    temp.RowVersion = FormHData.get("RowVersion").value;
    if (CommReceipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp) {
      temp.ReservedField1 = FormHData.get("SupplCode").value;
      temp.ReservedField2 = FormHData.get("MrSupplEmpPositionCodeDesc").value;
    }
    return temp;
  }


  allocateValue(allocAmt: number, tempListAppCommD: Array<AppCommissionDObjX>, identifier:string)
  {
    var tempListTrxAmt = new Array<number>();
    let listPriority = new Array<string>();
    if(identifier == CommonConstant.CommissionIdentifierSupplier) listPriority = this.listPrioritySuppl;
    else if(identifier == CommonConstant.CommissionIdentifierSupplierEmp) listPriority = this.listPrioritySupplEmp;
    else if(identifier == CommonConstant.CommissionIdentifierReferantor) listPriority = this.listPriorityReferantor;

    for(var i=0;i<listPriority.length;i++)
    {
      if(allocAmt == 0)break;

      if(this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount > 0)
      {
        var tempDObj = new AppCommissionDObjX();
        if(this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount < allocAmt)
        {
          allocAmt = allocAmt - this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount;

          tempListTrxAmt.push(this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount);
          tempDObj.MrCommissionSourceCode= listPriority[i],
          tempDObj.CommissionAmt= this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount,
          tempDObj.RefundAmt= this.DictMaxIncomeForm[listPriority[i]].RefundAmount,
          tempDObj.CommissionAmtAfterTax = this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount;

          tempListAppCommD.push(tempDObj);

          this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount = 0;
        }
        else if(this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount >= allocAmt)
        {
          this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount = this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount - allocAmt

          tempListTrxAmt.push(allocAmt);
          tempDObj.MrCommissionSourceCode= listPriority[i],
          tempDObj.CommissionAmt= allocAmt,
          tempDObj.RefundAmt= this.DictMaxIncomeForm[listPriority[i]].RefundAmount,
          tempDObj.CommissionAmtAfterTax = allocAmt;

          tempListAppCommD.push(tempDObj);
          allocAmt = 0;
          break;
        }
      }
    }
    return tempListTrxAmt;
  }


  SaveForm() {
    if (!this.IsCalculated || this.ListAppCommHObj.length == 0) return this.toastr.warningMessage(ExceptionConstant.MUST_CALCUCATE_FIRST);
    if (this.Summary.TotalCommisionAmount > this.maxAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Max Allocated Amount");
    if (0 > this.RemainingAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Remaining Allocated Amount");

    let listAppCommissionHAddObj: Array<AppCommissionHObjX> = new Array<AppCommissionHObjX>();
    let listAppCommissionHEditObj: Array<AppCommissionHObjX> = new Array<AppCommissionHObjX>();
    for(let i=0; i<this.ListAppCommHObj.length;i++)
    {
      if(this.ListAppCommHObj[i].AppCommissionHId == 0)
      {
        listAppCommissionHAddObj.push(this.ListAppCommHObj[i]);
      }
      else
      {
        listAppCommissionHEditObj.push(this.ListAppCommHObj[i]);
      }
    }

    var obj = {
      AppId: this.AppId,
      GrossYield: this.Summary.GrossYield,
      ReturnHandlingHId: this.ReturnHandlingHObj.ReturnHandlingHId,
      WfTaskIdListId: this.ReturnHandlingHObj.WfTaskListId,
      IsPersonal: this.AppIsPersonal,
      ListAppCommissionHAddObj: listAppCommissionHAddObj,
      ListAppCommissionHEditObj: listAppCommissionHEditObj
    };
    var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);

    this.http.post(URLConstantX.AddEditAppCommissionData, obj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        if (this.ReturnHandlingHObj.ReturnHandlingHId != 0 || this.ReturnHandlingHObj.ReturnHandlingHId != undefined) {
          this.outputTab.emit(this.ReturnHandlingHObj.ReturnHandlingHId);
        } else {
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING],{ "BizTemplateCode": lobCode});
        }
        // this.outputTab.emit();
      });
  }

  Cancel() {
    this.outputCancel.emit();
  }
  inputTypeChange() {
    this.FormAdd1.UpdateInputType();
    this.FormAdd2.UpdateInputType();
    this.FormAdd3.UpdateInputType();
  }

  ChangeEmpPos(idx:number)
  {
    var ListIdx = idx;
    for(let i=0;i<this.ListAppCommHObj.length;i++)
    {
      if(this.ListAppCommHObj[i].MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp)
      {
        if(ListIdx != 0)
        {
          ListIdx--;
        }
        else
        {         
          this.ListAppCommHObj[i].ListAppCommSupplEmpObj = new Array<AppCommSupplEmpObjX>();
          const tempDataList = this.CommissionForm.get(this.identifierSupplierEmp) as FormArray;
          const tempData = tempDataList.get(idx.toString()) as FormGroup;
          const tempListSupplEmp = tempData.get("ListEmpPosition") as FormArray;

          for(let z=0;z<tempListSupplEmp.length;z++)
          {
            const tempListSupplEmpIdx = tempListSupplEmp.get(z.toString()) as FormGroup;
            if(tempListSupplEmpIdx.get("PositionSelect").value)
            {
              var tempEmp = new AppCommSupplEmpObjX();
              // tempEmp.SeqNo = tempListSupplEmpIdx.get("SeqNo").value;
              tempEmp.SeqNo = this.ListAppCommHObj[i].ListAppCommSupplEmpObj.length+1;
              tempEmp.MrSbePositionMnl = tempListSupplEmpIdx.get("MasterCode").value;
              this.ListAppCommHObj[i].ListAppCommSupplEmpObj.push(tempEmp);
            }
      
          }
   
        }
      }
    }
  }

}
