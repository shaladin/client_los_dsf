import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppAssetDetailObj } from 'app/shared/model/app-asset/app-asset-detail-obj.model';
import { NapAppReferantorModel } from 'app/shared/model/nap-app-referantor.model';
import { RuleCommissionObj } from 'app/shared/model/rule-commission/rule-commission-obj.model';
import { AppCommissionHObj } from 'app/shared/model/app-commission-h-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { FormCommissionGenerateComponent } from './form-commission-generate/form-commission-generate.component';
import { ResponseTaxDetailObj } from 'app/shared/model/tax/response-tax-detail.model';
import { ResponseTaxObj } from 'app/shared/model/tax/response-tax.model';
import { TaxTrxDObj } from 'app/shared/model/tax/tax-trx-d.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppCommissionDObj } from 'app/shared/model/app-commission-d-obj.model';
import { ResultRefundObj } from 'app/shared/model/app-fin-data/result-refund.model';
import { ReqGetAppCommissionRuleObj } from 'app/shared/model/app-commission-rsv-fund/req-get-app-commission-rule-obj.model';
import { ReqTaxV2Obj, VendorEmpTaxObj, VendorTaxObj } from 'app/shared/model/app-commission-rsv-fund/req-tax-obj.model';
import { AppReservedFundObj } from 'app/shared/model/app-reserved-fund-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { ReqReturnHandlingCommRsvFundObj } from 'app/shared/model/app-commission-rsv-fund/req-return-handling-comm-rsv-fund-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ReturnHandlingHObj } from 'app/shared/model/return-handling/return-handling-h-obj.model';
import { environment } from 'environments/environment';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { AppObj } from 'app/shared/model/app/app.model';
import { ResGetRefTaxOfficeDetailObj } from 'app/shared/model/Response/commission/res-get-ref-tax-office-detail-obj.model';

@Component({
  selector: 'app-commission-v2',
  templateUrl: './commission-v2.component.html',
  styleUrls: ['./commission-v2.component.scss']
})
export class CommissionV2Component implements OnInit {

  @ViewChild('Form1') FormAdd1: FormCommissionGenerateComponent;
  @ViewChild('Form2') FormAdd2: FormCommissionGenerateComponent;
  @ViewChild('Form3') FormAdd3: FormCommissionGenerateComponent;
  @Input() ReturnHandlingHObj: ReturnHandlingHObj;
  @Input() showCancel: boolean = true;
  @Input() maxAllocAmt: number = 0;
  @Input() totalExpenseAmt: number = 0;
  @Input() totalRsvFundAmt: number = 0;
  @Input() DictMaxIncomeForm: object = {};
  @Input() BizTemplateCode: string;
  @Input() NapObj: AppObj;
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
    private toastr: NGXToastrService,) { }

  Summary = {
    TotalCommisionAmount: 0,
    TotalCommissionAfterTaxAmt: 0,
    TotalDisburseAmount: 0,
    TotalTaxAmmount: 0,
    TotalVATAmount: 0,
    GrossYield: 0,
    totalExpenseAmount: 0
  };
  RemainingAllocAmt: number = 0;
  IsCalculated: boolean = false;

  readonly AllocTypeAmt = CommonConstant.AllocTypeAmt;
  readonly AllocTypePerc = CommonConstant.AllocTypePerc;

  readonly identifierSupplier: string = CommonConstant.CommissionIdentifierSupplier;
  readonly identifierSupplierEmp: string = CommonConstant.CommissionIdentifierSupplierEmp;
  readonly identifierReferantor: string = CommonConstant.CommissionIdentifierReferantor;
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

  isReturnOn: boolean = false;
  DDLData: { [id: string]: Array<KeyValueObj> } = {};
  readonly DDLReason: string = CommonConstant.RefReasonTypeCodeReturnHandlingGeneral;
  readonly DDLTask: string = CommonConstant.ReturnTask;
  taxOfficeCode: string = "";

  FormReturnObj = this.fb.group({
    ReturnTo: [''],
    Reason: [''],
    Notes: ['']
  });


  GetFormAddDynamicObj(content) {
    if (content == CommonConstant.ContentSupplier) {
      this.FormInputObjSupplier["title"] = CommonConstant.TitleSupplier;
      this.FormInputObjSupplier["content"] = CommonConstant.ContentSupplier;
      this.FormInputObjSupplier["labelName"] = CommonConstant.LabelSupplier;
      this.FormInputObjSupplier["AppId"] = this.ReturnHandlingHObj.AppId;
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
      this.FormInputObjSupplierEmp["AppId"] = this.ReturnHandlingHObj.AppId;
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
      this.FormInputObjReferantor["AppId"] = this.ReturnHandlingHObj.AppId;
      this.FormInputObjReferantor["contentObj"] = this.ContentObjReferantor;
      this.FormInputObjReferantor["ruleObj"] = this.RuleReferantorData;
      this.FormInputObjReferantor["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjReferantor["isCalculated"] = false;
      this.FormInputObjReferantor["isDataInputed"] = false;
      this.OnForm3 = true;
    }
  }

  async ngOnInit() {
    this.RemainingAllocAmt = this.maxAllocAmt - this.totalExpenseAmt - this.totalRsvFundAmt;
    this.GetCalcMethod();
    await this.GetListAppReservedFundByAppId();
    await this.GetContentData();
    await this.GetRuleDataForForm();
    await this.GetExistingAppCommData();
    await this.bindDDLReasonReturn();
    await this.bindTaskObj();
    this.GetTaxOffice();
    // if (Object.keys(this.CommissionForm.value).length === 0 && this.CommissionForm.value.constructor === Object) {
    //   if (this.BizTemplateCode == CommonConstant.CFNA) {
    //     this.IsCalculated = true;
    //   }
    // }
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
  DictRemainingIncomeForm: object = {};
  async GetListAppReservedFundByAppId() {
    for (let index = 0; index < this.ListResultRefundIncomeInfo.length; index++) {
      const element = this.ListResultRefundIncomeInfo[index];
      let TempObj = new ResultRefundObj();
      TempObj.RefundAllocationFrom = element.RefundAllocationFrom;
      TempObj.RefundAllocationFromDesc = element.RefundAllocationFromDesc;
      TempObj.RefundAmount = element.RefundAmount;
      this.DictRemainingIncomeForm[element.RefundAllocationFrom] = TempObj;
    }
    await this.http.post(URLConstant.GetListAppReservedFundByAppId, { Id: this.ReturnHandlingHObj.AppId }).toPromise().then(
      (response) => {
        // console.log(response);
        let tempObj: Array<AppReservedFundObj> = response[CommonConstant.ReturnObj];
        // console.log(tempObj);
        for (let index = 0; index < tempObj.length; index++) {
          const element = tempObj[index];
          // console.log(element);
          if (this.DictRemainingIncomeForm[element.MrReservedFundSourceCode]) {
            this.DictRemainingIncomeForm[element.MrReservedFundSourceCode].RefundAmount -= element.ReservedFundAmt;
          }
        }
        // console.log(this.DictRemainingIncomeForm);
        this.outputDictRemaining.emit(this.DictRemainingIncomeForm);
      }
    )
  }

  async GetContentData() {
    let obj;
    obj = {
      Id: this.ReturnHandlingHObj.AppId,
      RowVersion: ""
    };
    await this.http.post<AppAssetDetailObj>(URLConstant.GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppIdV2, obj).toPromise().then(
      (response) => {
        if (response.ListAppAssetObj.length != 0) {
          this.GetDDLContent(response.ListAppAssetObj, CommonConstant.ContentSupplier);
          this.GetDDLContent(response.ListAppAssetSupplEmpObj, CommonConstant.ContentSupplierEmp);
        }
        // this.GetContentName(AdInsConstant.ContentSupplierEmp);
      });

    obj = {
      Id: this.ReturnHandlingHObj.AppId,
      RowVersion: ""
    };
    await this.http.post<NapAppReferantorModel>(URLConstant.GetAppReferantorByAppId, obj).toPromise().then(
      (response) => {
        this.GetDDLContent(response, CommonConstant.ContentReferantor);
      });

  }

  ContentObjSupplier = new Array();
  ContentObjSupplierEmp = new Array();
  ContentObjReferantor = new Array();
  DictSupplierCode: object = {};
  GetDDLContent(ReturnObject, content: string) {
    if (content == CommonConstant.ContentReferantor) {
      if (ReturnObject.AppId == null) return;
      let KVPObj;
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
      for (let i = 0; i < ReturnObject.length; i++) {
        let KVPObj;
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

  RuleSupplierData: object = {};
  RuleSupplierEmpData: object = {};
  RuleReferantorData: object = {};
  async GetRuleDataForForm() {
    let obj: ReqGetAppCommissionRuleObj = { AppId: this.ReturnHandlingHObj.AppId, BizTemplateCode: this.BizTemplateCode };
    await this.http.post(URLConstant.GetAppCommissionRule, obj).toPromise().then(
      (response) => {
        let ResponseObj = response[CommonConstant.ReturnObj];
        // override hide suppl & suppl emp jika CFRFN4W ignore rule
        if (this.BizTemplateCode == CommonConstant.CFRFN4W || this.BizTemplateCode == CommonConstant.CFNA) {
          ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplier = null;
          ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplierEmp = null;
          this.HideForm1 = true;
          this.HideForm2 = true;
        }
        if (ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplier != null || ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultSupplierEmp) { // For CFNA
          for (let i = 0; i < ResponseObj["length"]; i++) {
            let temp: RuleCommissionObj = ResponseObj[i][CommonConstant.ReturnObj].RuleDataObjects;
            this.BindRuleData(temp.ResultSupplier, CommonConstant.ContentSupplier, this.ContentObjSupplier[i].Key);
            this.BindRuleData(temp.ResultSupplierEmp, CommonConstant.ContentSupplierEmp, this.ContentObjSupplier[i].Key);
          }
        }
        if (ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultReferantor != null)
          this.BindRuleData(ResponseObj[0][CommonConstant.ReturnObj].RuleDataObjects.ResultReferantor, CommonConstant.ContentReferantor, this.ContentObjReferantor[0].Key);
      }
    );
  }

  BindRuleData(tempObj: any, contentType: string, supplCode: string) {
    let listTempObj = new Array();
    if (contentType == CommonConstant.ContentSupplier) {
      for (let i = 0; i < tempObj.AllocationFrom.length; i++) {
        let temp = {
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
      this.RuleSupplierData[supplCode] = listTempObj;
    }
    if (contentType == CommonConstant.ContentSupplierEmp) {
      let DictJobPosition: object = {};
      let tempJobPosition: string = "";
      let listJobPosition = new Array();
      for (let i = 0; i < tempObj.AllocationFrom.length; i++) {
        if (tempJobPosition != tempObj.JobPositionCode[i]) {
          listTempObj = new Array();
          tempJobPosition = tempObj.JobPositionCode[i];
          listJobPosition.push(tempJobPosition);
        }
        let temp = {
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
      for (let i = 0; i < listJobPosition.length; i++) {
        listTempObj = DictJobPosition[listJobPosition[i]];
        listTempObj.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
      }
      this.RuleSupplierEmpData[supplCode] = DictJobPosition;
    }
    if (contentType == CommonConstant.ContentReferantor) {
      for (let i = 0; i < tempObj.AllocationFrom.length; i++) {
        let temp = {
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
    let objApi = { Id: this.ReturnHandlingHObj.AppId };
    await this.http.post(URLConstant.GetAppCommissionDataForEditByAppId, objApi).toPromise().then(
      (response) => {
        let tempObj: Array<AppCommissionHObj> = response[CommonConstant.ReturnObj];
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

  GetData() {
    this.IsCalculated = false;
  }

  DictTotalIncomeForm: object = {};
  ListAllocFromForDict: Array<string> = new Array();
  CalculateTotal() {
    console.log("CALCULATE ME");
    this.Summary.TotalCommisionAmount = 0;
    this.Summary.TotalCommissionAfterTaxAmt = 0;
    this.Summary.TotalDisburseAmount = 0;
    this.Summary.totalExpenseAmount = 0;
    this.Summary.TotalTaxAmmount = 0;
    this.Summary.TotalVATAmount = 0;
    this.Summary.GrossYield = 0;
    this.totalExpenseAmt = 0;
    this.Summary.totalExpenseAmount = 0;
    for (let i = 0; i < this.ListAllocFromForDict.length; i++) {
      this.DictTotalIncomeForm[this.ListAllocFromForDict[i]] = 0;
    }

    // let listVendorCode: Array<string> = new Array<string>();
    // let listVendorEmpNo: Array<string> = new Array<string>();
    // let listTrxAmt: Array<Array<number>> = new Array<Array<number>>();
    // if (this.GetCalcTaxData(this.identifierSupplier, listVendorCode, listVendorEmpNo, listTrxAmt)) return;
    // if (this.GetCalcTaxData(this.identifierSupplierEmp, listVendorCode, listVendorEmpNo, listTrxAmt)) return;
    // if (this.GetCalcTaxData(this.identifierReferantor, listVendorCode, listVendorEmpNo, listTrxAmt)) return;
    const listVendorTax: Array<VendorTaxObj> = this.GetCalcVendorTaxDataV2(this.identifierSupplier);
    const listVendorEmpTax: Array<VendorEmpTaxObj> = this.GetCalcVendorEmpTaxDataV2(this.identifierSupplierEmp);
    const listReferantorTax: Array<VendorTaxObj> = this.GetCalcVendorTaxDataV2(this.identifierReferantor);

    let obj: ReqTaxV2Obj = {
      AppId: this.ReturnHandlingHObj.AppId,
      VendorTaxs: listVendorTax,
      VendorEmpTaxs: listVendorEmpTax,
      ReferantorTaxs: listReferantorTax,
      TrxTypeCode: CommonConstant.TrxTypeCodeAppCom,
      ExchangeRateAmt: CommonConstant.ExchangeRateAmt,
      IsSave: false,
      TaxOfficeCode: this.taxOfficeCode
    };
    if (this.CekMaxValueIncomeInfo()) return;

    this.http.post<ResponseTaxDetailObj>(URLConstant.GetAppCommissionTaxAndCalcGrossYieldV2_1, obj).subscribe(
      (response) => {
        let idxStart = 0;
        let totalSupplData = this.CommissionForm.value[this.identifierSupplier].length;
        let totalSupplEmpData = this.CommissionForm.value[this.identifierSupplierEmp].length;
        let totalReferantorData = this.CommissionForm.value[this.identifierReferantor].length;
        idxStart = this.BindTaxData(this.identifierSupplier, response, idxStart, totalSupplData);
        idxStart = this.BindTaxData(this.identifierSupplierEmp, response, idxStart, totalSupplEmpData);
        idxStart = this.BindTaxData(this.identifierReferantor, response, idxStart, totalReferantorData);
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

  GetCalcTaxData(identifier: string, listVendorCode: Array<string>, listVendorEmpNo: Array<string>, listTrxAmt: Array<Array<number>>) {
    const tempDataList = this.CommissionForm.get(identifier) as FormArray;
    for (let i = 0; i < tempDataList.length; i++) {
      const tempData = tempDataList.get(i.toString()) as FormGroup;
      const ContentName = tempData.get("ContentName").value;
      if (ContentName != "") {
        let tempListTrxAmt: Array<number> = new Array<number>();
        let totalCommAmt: number = 0;
        const tempListAllocated = tempData.get("ListAllocated") as FormArray;
        for (let j = 0; j < tempListAllocated.length; j++) {
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
        let Label = "";
        if (identifier == this.identifierSupplier) Label = CommonConstant.LabelSupplier;
        if (identifier == this.identifierSupplierEmp) Label = CommonConstant.LabelSupplierEmp;
        if (identifier == this.identifierReferantor) Label = CommonConstant.LabelReferantor;
        this.toastr.warningMessage("Please Choose " + Label + " Name at Data " + (i + 1));
        return true;
      }
    }
    return false;
  }

  private GetCalcVendorTaxDataV2(identifier: string): Array<VendorTaxObj> {
    let listVendorTax: Array<VendorTaxObj> = new Array();
    const tempDataList = this.CommissionForm.get(identifier) as FormArray;
    for (let i = 0; i < tempDataList.length; i++) {
      const tempData = tempDataList.get(i.toString()) as FormGroup;
      listVendorTax.push(this.SetVendorTaxObj(identifier, tempData, i));
    }
    return listVendorTax;
  }
  private GetCalcVendorEmpTaxDataV2(identifier: string): Array<VendorEmpTaxObj> {
    let listVendorTax: Array<VendorEmpTaxObj> = new Array();
    const tempDataList = this.CommissionForm.get(identifier) as FormArray;
    for (let i = 0; i < tempDataList.length; i++) {
      const tempData = tempDataList.get(i.toString()) as FormGroup;
      listVendorTax.push(this.SetVendorEmpTaxObj(identifier, tempData, i));
    }
    return listVendorTax;
  }

  private SetVendorTaxObj(identifier: string, tempData: FormGroup, idx: number): VendorTaxObj {
    let VendorTax: VendorTaxObj = new VendorTaxObj();
    const ContentName = tempData.get("ContentName").value;
    this.CheckDataChosen(ContentName, identifier, idx);
    const tempListAllocated = tempData.get("ListAllocated") as FormArray;
    VendorTax.TrxAmt = this.SetVendorTaxTrxAmt(tempListAllocated, ContentName);
    VendorTax.VendorCode = ContentName;
    return VendorTax;
  }

  private SetVendorEmpTaxObj(identifier: string, tempData: FormGroup, idx: number): VendorEmpTaxObj {
    let VendorTax: VendorEmpTaxObj = new VendorEmpTaxObj();
    const ContentName = tempData.get("ContentName").value;
    this.CheckDataChosen(ContentName, identifier, idx);
    const tempListAllocated = tempData.get("ListAllocated") as FormArray;
    VendorTax.TrxAmt = this.SetVendorTaxTrxAmt(tempListAllocated, ContentName);
    const SupplCode = tempData.get("SupplCode").value;
    VendorTax.VendorCode = SupplCode;
    VendorTax.VendorEmpNo = ContentName;
    return VendorTax;
  }

  private CheckDataChosen(ContentName: string, identifier: string, idx: number) {
    if (ContentName) return;

    this.IsCalculated = false;
    let Label = "";
    if (identifier == this.identifierSupplier) Label = CommonConstant.LabelSupplier;
    if (identifier == this.identifierSupplierEmp) Label = CommonConstant.LabelSupplierEmp;
    if (identifier == this.identifierReferantor) Label = CommonConstant.LabelReferantor;
    throw this.toastr.warningMessage("Please Choose " + Label + " Name at Data " + (idx + 1));
  }

  private SetVendorTaxTrxAmt(tempListAllocated: FormArray, ContentName: string): Array<number> {
    let tempListTrxAmt: Array<number> = new Array<number>();
    let totalCommAmt: number = 0;
    for (let j = 0; j < tempListAllocated.length; j++) {
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
    if (totalCommAmt == 0) {
      this.IsCalculated = false;
      throw this.toastr.warningMessage("Please Allocate at least 1 item for " + ContentName);
    }
    return tempListTrxAmt;
  }

  BindTaxData(identifier: string, TaxDetailData: ResponseTaxDetailObj, idxStart: number, idxEnd: number) {
    // let totalBindData=this.CommissionForm.value[identifier].length;
    for (let i = 0; i < idxEnd; i++) {
      let totalTaxAmount: number = 0;
      let totalVATAmount: number = 0;
      let totalExpenseAmount: number = 0;
      let totalPenaltyAmt: number = 0;
      let totalDisburseAmount: number = 0;
      let totalCommissionAmtAfterTax: number = 0;
      let totalAllocationAmount: number = 0;
      let HoldingTaxWithPenalty: number = 0;
      let tempRespTaxObj: ResponseTaxObj = TaxDetailData.ResponseTaxObjs[idxStart];
      for (let j = 0; j < tempRespTaxObj.ReturnObject.length; j++) {
        let taxAmt = 0;
        let vatAmt = 0;
        let commissionAmtAfterTax = tempRespTaxObj.ReturnObject[j].TotalTrxAmtAfterTaxAmt;
        let AllocationAmount = tempRespTaxObj.ReturnObject[j].TrxAmt;
        let totalPenaltyDAmount = 0;
        totalExpenseAmount += tempRespTaxObj.ReturnObject[j].ExpenseAmt;
        totalDisburseAmount += tempRespTaxObj.ReturnObject[j].DisburseAmt;
        totalPenaltyAmt += tempRespTaxObj.ReturnObject[j].PenaltyAmt;
        totalCommissionAmtAfterTax += commissionAmtAfterTax;
        totalAllocationAmount += AllocationAmount;
        let TaxTrxDObjData: Array<TaxTrxDObj> = tempRespTaxObj.ReturnObject[j].TaxTrxD;
        for (let k = 0; k < TaxTrxDObjData.length; k++) {
          totalPenaltyDAmount += TaxTrxDObjData[k].PenaltyAmt;
          if (TaxTrxDObjData[k].TaxTypeCode == CommonConstant.TaxTypeCode) {
            taxAmt += TaxTrxDObjData[k].TaxAmt;
            totalTaxAmount += TaxTrxDObjData[k].TaxAmt;
            HoldingTaxWithPenalty += (TaxTrxDObjData[k].TaxAmt + TaxTrxDObjData[k].PenaltyAmt);
          } else if (TaxTrxDObjData[k].TaxTypeCode == CommonConstant.VATTypeCode) {
            vatAmt = TaxTrxDObjData[k].TaxAmt;
            totalVATAmount += TaxTrxDObjData[k].TaxAmt;
          }
        }

        this.CommissionForm.controls[identifier]["controls"][i].controls.ListAllocated.controls[j].patchValue({
          TaxAmt: taxAmt,
          VatAmt: vatAmt,
          AllocationAmount: AllocationAmount,
          PenaltyAmt: totalPenaltyDAmount,
          CommissionAmtAfterTax: commissionAmtAfterTax
        });
      }
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
        TotalCommissionAfterTaxAmt: totalCommissionAmtAfterTax,
        TotalCommisionAmount: totalAllocationAmount,
        HoldingTaxWithPenalty: HoldingTaxWithPenalty
      });
      switch (identifier) {
        case this.identifierSupplier:
          this.FormAdd1.ChangeAllocPercentageBasedOnAmt(i);
          break;
        case this.identifierSupplierEmp:
          this.FormAdd2.ChangeAllocPercentageBasedOnAmt(i);
          break;
        case this.identifierReferantor:
          this.FormAdd3.ChangeAllocPercentageBasedOnAmt(i);
          break;
      }
      this.Summary.TotalCommisionAmount += totalAllocationAmount;
      this.Summary.TotalCommissionAfterTaxAmt += totalCommissionAmtAfterTax;
      this.Summary.TotalDisburseAmount += totalDisburseAmount;
      this.Summary.TotalTaxAmmount += (totalTaxAmount + totalPenaltyAmt);
      this.Summary.TotalVATAmount += totalVATAmount;
      this.totalExpenseAmt += totalExpenseAmount;
      idxStart++;
    }
    this.Summary.totalExpenseAmount = this.totalExpenseAmt;
    return idxStart;
  }

  SaveForm() {
    if (!this.IsCalculated) return this.toastr.warningMessage(ExceptionConstant.MUST_CALCUCATE_FIRST);
    if (this.Summary.TotalCommisionAmount > this.maxAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Max Allocated Amount");
    if (0 > this.RemainingAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Remaining Allocated Amount");
    if (this.CekMaxValueIncomeInfo()) return;

    let listAppCommissionHAddObj: Array<AppCommissionHObj> = new Array<AppCommissionHObj>();
    let listAppCommissionHEditObj: Array<AppCommissionHObj> = new Array<AppCommissionHObj>();
    this.GetListAppCommObj(this.identifierSupplier, listAppCommissionHAddObj, listAppCommissionHEditObj);
    this.GetListAppCommObj(this.identifierSupplierEmp, listAppCommissionHAddObj, listAppCommissionHEditObj);
    this.GetListAppCommObj(this.identifierReferantor, listAppCommissionHAddObj, listAppCommissionHEditObj);
    let obj = {
      AppId: this.ReturnHandlingHObj.AppId,
      GrossYield: this.Summary.GrossYield,
      ListAppCommissionHAddObj: listAppCommissionHAddObj
    };
    this.http.post(URLConstant.SubmitAppCommissionDataV2_1, obj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.outputTab.emit();
      });
  }

  CekMaxValueIncomeInfo() {
    let flag = false;
    for (let i = 0; i < this.ListAllocFromForDict.length; i++) {
      if (this.DictRemainingIncomeForm[this.ListAllocFromForDict[i]].RefundAmount < this.DictTotalIncomeForm[this.ListAllocFromForDict[i]]) {
        flag = true;
        this.toastr.warningMessage(this.DictRemainingIncomeForm[this.ListAllocFromForDict[i]].RefundAllocationFromDesc + " cannot be more than " + this.DictRemainingIncomeForm[this.ListAllocFromForDict[i]].RefundAmount);
      }
    }
    return flag;
  }

  GetListAppCommObj(identifier: string, listAppCommissionHAddObj: Array<AppCommissionHObj>, listAppCommissionHEditObj: Array<AppCommissionHObj>) {
    const listData = this.CommissionForm.get(identifier) as FormArray;
    for (let i = 0; i < listData.length; i++) {
      let tempData = new AppCommissionHObj();
      const temp = listData.get(i.toString()) as FormGroup;
      if (temp.get("ContentName").value == "") continue;
      if (identifier == this.identifierSupplier) tempData = this.PatchAppCommHData(temp, CommonConstant.CommissionReceipientTypeCodeSupplier);
      if (identifier == this.identifierSupplierEmp) tempData = this.PatchAppCommHData(temp, CommonConstant.CommissionReceipientTypeCodeSupplierEmp);
      if (identifier == this.identifierReferantor) tempData = this.PatchAppCommHData(temp, CommonConstant.CommissionReceipientTypeCodeReferantor);

      listAppCommissionHAddObj.push(tempData);
    }
  }

  PatchAppCommHData(AppCommH: FormGroup, CommReceipientTypeCode: string) {
    let temp = new AppCommissionHObj();
    if (AppCommH.get("AppCommissionHId").value != 0) temp.AppCommissionHId = AppCommH.get("AppCommissionHId").value;
    temp.AppId = this.ReturnHandlingHObj.AppId;
    temp.BankAccNo = AppCommH.get("BankAccountNo").value;
    temp.BankAccName = AppCommH.get("BankAccountName").value;
    temp.BankCode = AppCommH.get("BankCode").value;
    temp.BankName = AppCommH.get("BankName").value;
    temp.BankBranch = AppCommH.get("BankBranch").value;
    temp.TaxAmt = AppCommH.get("TotalTaxAmount").value;
    temp.VatAmt = AppCommH.get("TotalVATAmount").value;
    temp.PenaltyAmt = AppCommH.get("TotalPenaltyAmount").value;
    temp.TotalCommissionAfterTaxAmt = AppCommH.get("TotalCommissionAfterTaxAmt").value;
    temp.TotalCommissionAmt = AppCommH.get("TotalCommisionAmount").value;
    temp.TotalExpenseAmt = AppCommH.get("TotalExpenseAmount").value;
    temp.TotalDisburseAmt = AppCommH.get("TotalDisburseAmount").value;
    temp.MrCommissionRecipientTypeCode = CommReceipientTypeCode;
    temp.CommissionRecipientRefNo = AppCommH.get("ContentName").value;
    temp.MrTaxKindCode = AppCommH.get("MrTaxKindCode").value;
    temp.MrTaxCalcMethodCode = AppCommH.get("MrTaxCalcMethodCode").value;
    temp.TaxpayerNo = AppCommH.get("TaxpayerNo").value;
    temp.RowVersion = AppCommH.get("RowVersion").value;
    temp.TaxOfficeCode = this.taxOfficeCode;
    if (CommReceipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp) {
      temp.ReservedField1 = AppCommH.get("SupplCode").value;
      temp.ReservedField2 = AppCommH.get("MrSupplEmpPositionCodeDesc").value;
    }
    temp.ListappCommissionDObj = this.PatchAppCommDData(AppCommH);
    return temp;
  }

  PatchAppCommDData(AppCommH: FormGroup) {
    let listAppCommissionDObj = new Array();
    const temp = AppCommH.get("ListAllocated") as FormArray;
    for (let i = 0; i < temp.length; i++) {
      const tempObj = temp.get(i.toString()) as FormGroup;
      let tempAppCommissionDObj = new AppCommissionDObj();
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
      tempAppCommissionDObj.CommissionAmtAfterTax = tempObj.get("CommissionAmtAfterTax").value;
      tempAppCommissionDObj.RowVersion = tempObj.get("RowVersion").value;
      listAppCommissionDObj.push(tempAppCommissionDObj);
    }
    return listAppCommissionDObj;
  }

  Cancel() {
    this.outputCancel.emit();
  }
  inputTypeChange() {
    this.FormAdd1.UpdateInputType();
    this.FormAdd2.UpdateInputType();
    this.FormAdd3.UpdateInputType();
  }

  switchForm() {
    this.FormReturnObj.patchValue({
      ReturnTo: "",
      Reason: "",
      Notes: ""
    });

    if (!this.isReturnOn) {
      this.isReturnOn = true;
      this.FormReturnObj.controls.ReturnTo.setValidators([Validators.required]);
      this.FormReturnObj.controls.Reason.setValidators([Validators.required]);
      this.FormReturnObj.controls.Notes.setValidators([Validators.required]);
    } else {
      this.isReturnOn = false;
      this.FormReturnObj.controls.ReturnTo.clearValidators();
      this.FormReturnObj.controls.Reason.clearValidators();
      this.FormReturnObj.controls.Notes.clearValidators();
    }
    this.FormReturnObj.controls.ReturnTo.updateValueAndValidity();
    this.FormReturnObj.controls.Reason.updateValueAndValidity();
    this.FormReturnObj.controls.Notes.updateValueAndValidity();

  }

  async bindDDLReasonReturn() {
    let obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeReturnHandlingGeneral };
    await this.http.post(URLConstant.GetListActiveRefReason, obj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLReason] = response[CommonConstant.ReturnObj];
      });
  }

  async bindTaskObj() {
    let refMasterTypeCode = '';
    switch (this.BizTemplateCode) {
      case CommonConstant.CF4W:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskCF4W;
        break;
      case CommonConstant.CFNA:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskCFNA;
        break;
      case CommonConstant.CFRFN4W:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskCFRFN4W;
        break;
      case CommonConstant.FL4W:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskFL4W;
        break;
      case CommonConstant.OPL:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskOPL;
        break;
    }
    if (!refMasterTypeCode) return;
    let mrCustTypeCode;

    await this.http.post(URLConstant.GetAppCustByAppId, { Id: this.ReturnHandlingHObj.AppId }).toPromise().then(
      (response: AppCustObj) => {
        mrCustTypeCode = response.MrCustTypeCode;
      }
    );

    let refMasterObj: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: refMasterTypeCode, MappingCode: mrCustTypeCode };
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, refMasterObj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLTask] = response[CommonConstant.ReturnObj];
        this.DDLData[this.DDLTask] = this.DDLData[this.DDLTask].filter(x => x.Key == CommonConstant.ReturnHandlingEditApp);
      }
    );
  }

  SaveReturnForm() {
    let reqReturnHandlingCommRsvFundObj = new ReqReturnHandlingCommRsvFundObj();
    reqReturnHandlingCommRsvFundObj.AppId = this.ReturnHandlingHObj.AppId;
    reqReturnHandlingCommRsvFundObj.WfTaskListId = this.ReturnHandlingHObj.WfTaskListId;
    reqReturnHandlingCommRsvFundObj.ReturnTo = this.FormReturnObj.value.ReturnTo;
    reqReturnHandlingCommRsvFundObj.Reason = this.FormReturnObj.value.Reason;
    reqReturnHandlingCommRsvFundObj.Notes = this.FormReturnObj.value.Notes;

    let SubmitReturnHandlingCommRsvFundUrl = environment.isCore ? URLConstant.SubmitReturnHandlingCommRsvFundV2 : URLConstant.SubmitReturnHandlingCommRsvFund;
    this.http.post(SubmitReturnHandlingCommRsvFundUrl, reqReturnHandlingCommRsvFundObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      });
  }

  GetTaxOffice(){
    let ReqByCodeObj: GenericObj = new GenericObj();
    ReqByCodeObj.Code = this.NapObj.OriOfficeCode;
    this.http.post(URLConstant.GetRefTaxOfficeDetailByRefOfficeCode, ReqByCodeObj).subscribe(
      (response: ResGetRefTaxOfficeDetailObj) => {
          this.taxOfficeCode = response["TaxOfficeCode"];
      });
  }
}
