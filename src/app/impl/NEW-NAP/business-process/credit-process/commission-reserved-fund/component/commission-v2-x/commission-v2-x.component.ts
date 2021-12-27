import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { FormCommissionGenerateXComponent } from './form-commission-generate-x/form-commission-generate-x.component';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppCommissionDObjX } from 'app/impl/shared/model/AppCommissionDObjX.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { environment } from 'environments/environment';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AppCommissionHObjX } from 'app/impl/shared/model/AppCommissionHObjX.Model';
import { AppCommSupplEmpObjX } from 'app/impl/shared/model/AppCommSupplEmpObjX.model';
import { ReturnHandlingHObj } from 'app/shared/model/return-handling/return-handling-h-obj.model';
import { ResultRefundObj } from 'app/shared/model/app-fin-data/result-refund.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { AppReservedFundObj } from 'app/shared/model/app-reserved-fund-obj.model';
import { AppAssetDetailObj } from 'app/shared/model/app-asset/app-asset-detail-obj.model';
import { NapAppReferantorModel } from 'app/shared/model/nap-app-referantor.model';
import { ReqGetAppCommissionRuleObj } from 'app/shared/model/app-commission-rsv-fund/req-get-app-commission-rule-obj.model';
import { RuleCommissionObj } from 'app/shared/model/rule-commission/rule-commission-obj.model';
import { AppCommissionHObj } from 'app/shared/model/app-commission-h-obj.model';
import { ReqTaxObj } from 'app/shared/model/app-commission-rsv-fund/req-tax-obj.model';
import { ResponseTaxDetailObj } from 'app/shared/model/tax/response-tax-detail.model';
import { ResponseTaxObj } from 'app/shared/model/tax/response-tax.model';
import { TaxTrxDObj } from 'app/shared/model/tax/tax-trx-d.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { ReqReturnHandlingCommRsvFundObj } from 'app/shared/model/app-commission-rsv-fund/req-return-handling-comm-rsv-fund-obj.model';
import { getLocaleNumberFormat, formatNumber } from '@angular/common';

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
  @Input() maxAllocRefundAmt: number = 0;

  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputDictRemaining: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Output() outputUpdateRemainingAlloc: EventEmitter<any> = new EventEmitter();
  @Output() outputCommCondition: EventEmitter<boolean> = new EventEmitter();
  AppId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService, ) { }

  Summary = {
    TotalCommisionAmount: 0,
    TotalCommissionAfterTaxAmt: 0,
    TotalDisburseAmount: 0,
    TotalTaxAmmount: 0,
    TotalVATAmount: 0,
    GrossYield: 0
  };
  RemainingAllocAmt: number = 0;
  ActRemainingAlloc: number = 0;
  IsCalculated: boolean = false;

  ListAppCommHObj: Array<AppCommissionHObjX> = new Array();
  totalSupplier: number = 0;
  totalSupplierEmp: number = 0;
  totalReferantor: number = 0;
  AppIsPersonal: boolean = true;
  lockAppCommTab: boolean = false;
  SectionPosition: boolean = false;

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

  listPrioritySuppl: Array<string> = new Array();
  listPrioritySupplEmp: Array<string> = new Array();
  listPriorityReferantor: Array<string> = new Array();
  ListSupplEmpPos: Array<RefMasterObj> = new Array<RefMasterObj>();

  isReturnOn: boolean = false;
  DDLData: { [id: string]: Array<KeyValueObj> } = {};
  readonly DDLReason: string = CommonConstant.RefReasonTypeCodeReturnHandlingGeneral;
  readonly DDLTask: string = CommonConstant.ReturnTask;


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
      this.FormInputObjSupplier["AppId"] = this.AppId;
      this.FormInputObjSupplier["contentObj"] = this.ContentObjSupplier;
      this.FormInputObjSupplier["ruleObj"] = this.RuleSupplierData;
      this.FormInputObjSupplier["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplier["isCalculated"] = false;
      this.FormInputObjSupplier["isDataInputed"] = false;
      this.FormInputObjSupplier["ddl"] = this.ContentObjSupplier;
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
      this.FormInputObjSupplierEmp["ddl"] = this.ContentObjSupplierEmpDDL;
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
      this.FormInputObjReferantor["ddl"] = this.ContentObjReferantor;
      this.OnForm3 = true;
    }
  }

  async ngOnInit() {
    this.AppId = this.ReturnHandlingHObj.AppId;
    this.RemainingAllocAmt = this.maxAllocAmt - this.totalExpenseAmt - this.totalRsvFundAmt;
    this.GetCalcMethod();
    this.ActRemainingAlloc = this.maxAllocAmt - this.totalRsvFundAmt;

    await this.GetListAppReservedFundByAppId();
    await this.GetListAllocatePriority();
    await this.GetAppCust();
    await this.EmpPositionSectValidate();
    await this.GetContentData();
    await this.GetRuleDataForForm();
    await this.GetExistingAppCommData();
    await this.bindDDLReasonReturn();
    await this.bindTaskObj();
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
  async GetListAllocatePriority() {
    await this.http.post(URLConstantX.GetAppRsvFundPriorityRule, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.listPrioritySuppl = response["ListPrioritySupplier"];
        this.listPrioritySupplEmp = response["ListPrioritySupplEmp"];
        this.listPriorityReferantor = response["ListPriorityReferantor"];
      }
    );
  }

  async GetAppCust() {
    await this.http.post<AppCustObj>(URLConstant.GetAppCustByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {
        if (response.MrCustTypeCode == CommonConstant.CustTypeCompany) {
          this.AppIsPersonal = false
        }
      }
    )
  }

  async EmpPositionSectValidate() {
    // let validateInsurance: boolean = false;
    // for (let i = 0; i < this.ListResultRefundIncomeInfo.length; i++) {
    //   if (this.ListResultRefundIncomeInfo[i].RefundAllocationFrom == CommonConstantX.AllocationFronInsuranceIncomeCode && this.ListResultRefundIncomeInfo[i].RefundAmount > 0) {
    //     validateInsurance = true;
    //     break;
    //   }
    //   else if (this.ListResultRefundIncomeInfo[i].RefundAllocationFrom == CommonConstantX.AllocationFronInsuranceIncomeCode && this.ListResultRefundIncomeInfo[i].RefundAmount == 0) {
    //     break;
    //   }
    // }

    //if (validateInsurance) {
      await this.http.post(URLConstantX.GetAppAssetByAppIdConditionNewBrandMitsubishi, { Id: this.AppId }).toPromise().then(
        (response) => {
          if (response[CommonConstant.ReturnObj].length > 0) {
            this.SectionPosition = true;
          }
        }
      );
    //}

    if (this.SectionPosition) {
      let tempReq = { RefMasterTypeCode: CommonConstantX.RefMasterTypeCodeSbePositionMnl, MappingCode: null };
      await this.http.post(URLConstant.GetListActiveRefMaster, tempReq).toPromise().then(
        (response) => {
          this.ListSupplEmpPos = response[CommonConstant.ReturnObj];
        }
      );
    }
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
    await this.http.post(URLConstant.GetListAppReservedFundByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {
        let tempObj: Array<AppReservedFundObj> = response[CommonConstant.ReturnObj];
        for (let index = 0; index < tempObj.length; index++) {
          const element = tempObj[index];
          if (this.DictRemainingIncomeForm[element.MrReservedFundSourceCode]) {
            this.DictRemainingIncomeForm[element.MrReservedFundSourceCode].RefundAmount -= element.ReservedFundAmt;
          }
        }
        if (tempObj.length == 0) {
          this.lockAppCommTab = true;
        }
        this.outputCommCondition.emit(this.lockAppCommTab);
        let x = {
          TotalAllocAmt: 0,
          ExpenseAmount: 0
        }
        this.outputUpdateRemainingAlloc.emit(x);
        this.outputDictRemaining.emit(this.DictRemainingIncomeForm);
      }
    )
  }

  async GetContentData() {
    let obj;
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
        console.log(response);
      });

    await this.http.post<AppAssetDetailObj>(URLConstant.GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppIdV2, obj).toPromise().then(
      (response) => {
        if (response.ListAppAssetObj.length != 0) {
          response.ListAppAssetSupplEmpObj.sort((a, b) => (
            a.SupplEmpName.localeCompare(b.SupplEmpName)
          ));
          this.GetDDLContent(response.ListAppAssetSupplEmpObj, CommonConstantX.COM_DDL_SUPPL_EMP);
        }
        console.log(response);
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

  //GetDDl
  ContentObjSupplier = new Array();
  ContentObjSupplierEmp = new Array();
  ContentObjReferantor = new Array();
  DictSupplierCode: object = {};
  ContentObjSupplierEmpDDL = new Array();
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
        else if (content == CommonConstantX.COM_DDL_SUPPL_EMP) {
          KVPObj = {
            Key: ReturnObject[i].SupplEmpNo,
            Value: ReturnObject[i].SupplEmpName,
            MrSupplEmpPositionCode: ReturnObject[i].MrSupplEmpPositionCode,
            MrSupplEmpPositionCodeDesc: ReturnObject[i].MrSupplEmpPositionCodeDesc,
            SupplCode: ReturnObject[i].SupplCode
          };
          this.ContentObjSupplierEmpDDL.push(KVPObj);
        }
      }
    }
  }

  RuleSupplierData: object = {};
  RuleSupplierEmpData: object = {};
  RuleReferantorData: object = {};
  async GetRuleDataForForm() {
    let obj: ReqGetAppCommissionRuleObj = { AppId: this.AppId, BizTemplateCode: this.BizTemplateCode };
    await this.http.post(URLConstantX.GetAppCommissionRule, obj).toPromise().then(
      (response) => {
        let ResponseObj = response[CommonConstant.ReturnObj];
        // override hide suppl & suppl emp jika CFRFN4W ignore rule
        console.log("meow meow");
        if (this.BizTemplateCode == CommonConstant.CFRFN4W || this.BizTemplateCode == CommonConstant.CFNA || this.LobCode == CommonConstantX.SLB) {
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
          MaxAllocationAmount: tempObj.MaxAllocationAmount[i]
        };
        listTempObj.push(temp);
      };
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
          MaxAllocationAmount: tempObj.MaxAllocationAmount[i]
        };
        listTempObj.push(temp);
        DictJobPosition[tempObj.JobPositionCode[i]] = listTempObj;
      }

      // sort
      // for (let i = 0; i < listJobPosition.length; i++) {
      //   listTempObj = DictJobPosition[listJobPosition[i]];
      //   listTempObj.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
      // }
      this.RuleSupplierEmpData[supplCode] = DictJobPosition;
    }
    if (contentType == CommonConstant.ContentReferantor) {
      for (let i = 0; i < tempObj.AllocationFrom.length; i++) {
        let temp = {
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
    let objApi = { Id: this.AppId };
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

  //dari html
  GetData() {
    this.IsCalculated = false;
  }

  DictTempRemainingIncomeForm: Object = {}
  TotalInput : number = 0;
  async NewCalculateTotal() {
    this.totalAlloc = 0;
    console.log("CALCULATE NEW");
    this.DictTempRemainingIncomeForm = new Object();

    for (let dict in this.DictRemainingIncomeForm) {
      let TempObj = new ResultRefundObj();
      TempObj.RefundAllocationFrom = this.DictRemainingIncomeForm[dict].RefundAllocationFrom;
      TempObj.RefundAllocationFromDesc = this.DictRemainingIncomeForm[dict].RefundAllocationFromDesc;
      TempObj.RefundAmount = this.DictRemainingIncomeForm[dict].RefundAmount;
      this.DictTempRemainingIncomeForm[dict] = TempObj;
    }

    this.totalSupplier = 0;
    this.totalSupplierEmp = 0;
    this.totalReferantor = 0;
    this.TotalInput = 0;
    this.Summary.TotalCommisionAmount = 0;
    this.Summary.TotalTaxAmmount = 0;
    this.Summary.TotalVATAmount = 0;
    this.Summary.GrossYield = 0;
    this.totalExpenseAmt = 0;
    let listVendorCode: Array<string> = new Array<string>();
    let listVendorEmpNo: Array<string> = new Array<string>();
    let listTrxAmt: Array<Array<number>> = new Array<Array<number>>();
    this.ListAppCommHObj = new Array();
    if (this.AllocateDataWithPriority(this.identifierSupplier, listVendorCode, listVendorEmpNo, listTrxAmt)) return;
    if (this.AllocateDataWithPriority(this.identifierSupplierEmp, listVendorCode, listVendorEmpNo, listTrxAmt)) return;
    if (this.AllocateDataWithPriority(this.identifierReferantor, listVendorCode, listVendorEmpNo, listTrxAmt)) return;


    let obj: ReqTaxObj = {
      AppId: this.AppId,
      VendorCode: listVendorCode,
      VendorEmpNo: listVendorEmpNo,
      TrxAmt: listTrxAmt,
      TrxTypeCode: CommonConstant.TrxTypeCodeAppCom,
      ExchangeRateAmt: CommonConstant.ExchangeRateAmt,
      IsSave: false,
    };
    //await listTrxAmt.forEach(a=> a.forEach(b=>this.TotalInput += b));
    
    if(this.TotalInput>this.maxAllocAmt){
      return this.toastr.warningMessage("Total Input Commission (" + formatNumber(this.TotalInput, 'en-US', '.2') + ") Exceeded Remaining Allocation Amount (" + formatNumber(this.maxAllocAmt, 'en-US', '.2') + ")");
    }

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
        this.RemainingAllocAmt = this.maxAllocAmt - this.totalAlloc - this.totalRsvFundAmt;
        console.log("nyan cat");
        if (0 > this.RemainingAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Remaining Allocated Amount");
        if (this.totalExpenseAmt > this.maxAllocRefundAmt) return this.toastr.warningMessage("Total Expense (" + formatNumber(this.totalExpenseAmt, 'en-US', '.2') + ") Exceeded Total Max Refund Amount (" + formatNumber(this.maxAllocRefundAmt, 'en-US', '.2') + ")");
        this.IsCalculated = true;
        let x = {
          TotalAllocAmt: this.totalAlloc,
          ExpenseAmount: this.totalExpenseAmt
        }
        this.outputUpdateRemainingAlloc.emit(x);
      },
      (error) => {
        this.IsCalculated = false;
      }
    );

  }

  mapTaxData(identifier: string, TaxDetailData: ResponseTaxDetailObj, idxStart: number, idxEnd: number) {
    let recipientType: string;
    if (identifier == this.identifierSupplier) recipientType = CommonConstant.CommissionReceipientTypeCodeSupplier
    if (identifier == this.identifierSupplierEmp) recipientType = CommonConstant.CommissionReceipientTypeCodeSupplierEmp
    if (identifier == this.identifierReferantor) recipientType = CommonConstant.CommissionReceipientTypeCodeReferantor


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

        this.ListAppCommHObj[idxStart].ListappCommissionDObj[j].TaxAmt = taxAmt;
        this.ListAppCommHObj[idxStart].ListappCommissionDObj[j].VatAmt = vatAmt;
        this.ListAppCommHObj[idxStart].ListappCommissionDObj[j].PenaltyAmt = totalPenaltyDAmount;
        //this.ListAppCommHObj[idxStart].ListappCommissionDObj[j].CommissionAmtAfterTax -= (taxAmt + vatAmt);
        this.ListAppCommHObj[idxStart].ListappCommissionDObj[j].AllocationAmount = AllocationAmount;
        this.ListAppCommHObj[idxStart].ListappCommissionDObj[j].CommissionAmtAfterTax = commissionAmtAfterTax;

        // this.CommissionForm.controls[identifier]["controls"][i].controls.ListAllocated.controls[j].patchValue({
        //   TaxAmt: taxAmt,
        //   VatAmt: vatAmt,
        //   AllocationAmount: AllocationAmount,
        //   PenaltyAmt: totalPenaltyDAmount,
        //   CommissionAmtAfterTax: commissionAmtAfterTax
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
      //this.ListAppCommHObj[idxStart].TotalCommissionAfterTaxAmt -= (totalTaxAmount + totalVATAmount);
      this.ListAppCommHObj[idxStart].TotalCommissionAmt = totalAllocationAmount;
      this.ListAppCommHObj[idxStart].TotalCommissionAfterTaxAmt = totalCommissionAmtAfterTax;

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
      //this.Summary.TotalTaxAmmount += totalTaxAmount;
      this.Summary.TotalVATAmount += totalVATAmount;
      this.totalExpenseAmt += totalExpenseAmount;
      idxStart++;
    }
    return idxStart;
  }

  SaveForm() {
    if (!this.IsCalculated) return this.toastr.warningMessage(ExceptionConstant.MUST_CALCUCATE_FIRST);
    // if (this.Summary.TotalCommisionAmount > this.maxAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Max Allocated Amount");
    // if (0 > this.RemainingAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Remaining Allocated Amount");

    if (0 > this.RemainingAllocAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Remaining Allocated Amount");
    if (this.totalExpenseAmt > this.maxAllocRefundAmt) return this.toastr.warningMessage("Total Expense (" + formatNumber(this.totalExpenseAmt, 'en-US', '.2') + ") Exceeded Total Max Refund Amount (" + formatNumber(this.maxAllocRefundAmt, 'en-US', '.2') + ")");
    
    let listAppCommissionHAddObj: Array<AppCommissionHObjX> = new Array<AppCommissionHObjX>();
    let listAppCommissionHEditObj: Array<AppCommissionHObjX> = new Array<AppCommissionHObjX>();
    for (let i = 0; i < this.ListAppCommHObj.length; i++) {
      if (this.ListAppCommHObj[i].TotalCommissionAfterTaxAmt == null || isNaN(this.ListAppCommHObj[i].TotalCommissionAfterTaxAmt)) {
        this.ListAppCommHObj[i].TotalCommissionAfterTaxAmt = 0;
      }
      //if (this.ListAppCommHObj[i].AppCommissionHId == 0) {
        listAppCommissionHAddObj.push(this.ListAppCommHObj[i]);
      //}
      // else {
      //   listAppCommissionHEditObj.push(this.ListAppCommHObj[i]);
      // }
    }

    let obj = {
      AppId: this.AppId,
      GrossYield: this.Summary.GrossYield,
      ReturnHandlingHId: this.ReturnHandlingHObj.ReturnHandlingHId,
      WfTaskIdListId: this.ReturnHandlingHObj.WfTaskListId,
      IsPersonal: this.AppIsPersonal,
      ListAppCommissionHAddObj: listAppCommissionHAddObj,
      ListAppCommissionHEditObj: listAppCommissionHEditObj
    };
    let lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    let AddEditUrl = environment.isCore ? URLConstantX.AddEditAppCommissionDataV2 : URLConstantX.AddEditAppCommissionData;

    this.http.post(AddEditUrl, obj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        if (this.ReturnHandlingHObj.ReturnHandlingHId != 0 || this.ReturnHandlingHObj.ReturnHandlingHId != undefined) {
          this.outputTab.emit(this.ReturnHandlingHObj.ReturnHandlingHId);
        } else {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING], { "BizTemplateCode": lobCode });
        }
        // this.outputTab.emit();
      });

  }

  totalAlloc: number = 0;
  AllocateDataWithPriority(identifier: string, listVendorCode: Array<string>, listVendorEmpNo: Array<string>, listTrxAmt: Array<Array<number>>) {
    const tempDataList = this.CommissionForm.get(identifier) as FormArray;
    if (tempDataList != null) {
      for (let i = 0; i < tempDataList.length; i++) {
        const tempData = tempDataList.get(i.toString()) as FormGroup;
        let tempAppComm = new AppCommissionHObjX();

        const ContentName = tempData.get("ContentName").value;
        if (ContentName != "") {
          //MAP H DATA
          tempAppComm = this.MapFormDataToAppCommHList(tempData, identifier);

          //MAP D DATA
          let totalCommAmt: number = 0;
          const tempListAllocated = tempData.get("ListAllocated") as FormArray;
          let idx = 0;
          const tempListAllocIdxAt = tempListAllocated.get(idx.toString()) as FormGroup;
          const AllocAmt = tempListAllocIdxAt.get("AllocationAmount").value;
          this.TotalInput = this.TotalInput+AllocAmt;
          let tempListTrxAmt: Array<number> = this.allocateValue(AllocAmt, tempAppComm.ListappCommissionDObj, identifier);
          totalCommAmt = AllocAmt;
          this.totalAlloc = this.totalAlloc + totalCommAmt;
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
          if (identifier == this.identifierSupplierEmp) {
            const tempListSupplEmp = tempData.get("ListEmpPosition") as FormArray;
            for (let z = 0; z < tempListSupplEmp.length; z++) {
              const tempListSupplEmpIdx = tempListSupplEmp.get(z.toString()) as FormGroup;
              if (tempListSupplEmpIdx.get("PositionSelect").value) {
                let tempEmp = new AppCommSupplEmpObjX();
                // tempEmp.SeqNo = tempListSupplEmpIdx.get("SeqNo").value;
                tempEmp.SeqNo = tempAppComm.ListAppCommSupplEmpObj.length + 1;
                tempEmp.MrSbePositionMnl = tempListSupplEmpIdx.get("MasterCode").value;
                tempAppComm.ListAppCommSupplEmpObj.push(tempEmp);
              }

            }
            this.totalSupplierEmp += 1;
          }
          this.ListAppCommHObj.push(tempAppComm);

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
    }
    return false;
  }

  MapFormDataToAppCommHList(FormHData: FormGroup, identifier: string) {
    let CommReceipientTypeCode: string;
    if (identifier == this.identifierSupplier) CommReceipientTypeCode = CommonConstant.CommissionReceipientTypeCodeSupplier
    if (identifier == this.identifierSupplierEmp) CommReceipientTypeCode = CommonConstant.CommissionReceipientTypeCodeSupplierEmp
    if (identifier == this.identifierReferantor) CommReceipientTypeCode = CommonConstant.CommissionReceipientTypeCodeReferantor


    let temp = new AppCommissionHObjX();
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
    temp.TotalCommissionAfterTaxAmt = FormHData.get("TotalCommissionAfterTaxAmt").value;
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

  allocateValue(allocAmt: number, tempListAppCommD: Array<AppCommissionDObjX>, identifier: string) {
    let tempListTrxAmt = new Array<number>();
    let listPriority = new Array<string>();
    if (identifier == CommonConstant.CommissionIdentifierSupplier) listPriority = this.listPrioritySuppl;
    else if (identifier == CommonConstant.CommissionIdentifierSupplierEmp) listPriority = this.listPrioritySupplEmp;
    else if (identifier == CommonConstant.CommissionIdentifierReferantor) listPriority = this.listPriorityReferantor;

    for (let i = 0; i < listPriority.length; i++) {
      if (allocAmt == 0) break;
      if(this.DictTempRemainingIncomeForm[listPriority[i]] == null){
        continue;
      }
      if (this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount > 0) {
        let tempDObj = new AppCommissionDObjX();
        if (this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount < allocAmt) {
          allocAmt = allocAmt - this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount;

          tempListTrxAmt.push(this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount);
          tempDObj.MrCommissionSourceCode = listPriority[i],
            tempDObj.CommissionAmt = this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount,
            tempDObj.RefundAmt = this.DictMaxIncomeForm[listPriority[i]].RefundAmount,
            tempDObj.CommissionAmtAfterTax = this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount;

          tempListAppCommD.push(tempDObj);

          this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount = 0;
        }
        else if (this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount >= allocAmt) {
          this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount = this.DictTempRemainingIncomeForm[listPriority[i]].RefundAmount - allocAmt

          tempListTrxAmt.push(allocAmt);
          tempDObj.MrCommissionSourceCode = listPriority[i],
            tempDObj.CommissionAmt = allocAmt,
            tempDObj.RefundAmt = this.DictMaxIncomeForm[listPriority[i]].RefundAmount,
            tempDObj.CommissionAmtAfterTax = allocAmt;

          tempListAppCommD.push(tempDObj);
          allocAmt = 0;
          break;
        }
      }
    }
    return tempListTrxAmt;
  }

  Cancel() {
    this.outputCancel.emit();
  }
  inputTypeChange() {
    if (!this.HideForm1 && !this.HideForm2) {
      this.FormAdd1.UpdateInputType();
      this.FormAdd2.UpdateInputType();
    }
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

    const refMasterObj: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: refMasterTypeCode, MappingCode: mrCustTypeCode };
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, refMasterObj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLTask] = response[CommonConstant.ReturnObj];

        if (this.BizTemplateCode == CommonConstant.CF4W || this.BizTemplateCode == CommonConstant.FL4W) {
          this.DDLData[this.DDLTask] = this.DDLData[this.DDLTask].filter(x => x.Key == CommonConstant.ReturnHandlingEditApp || x.Key == CommonConstant.ReturnHandlingAddSurvey);
        } else {
          this.DDLData[this.DDLTask] = this.DDLData[this.DDLTask].filter(x => x.Key == CommonConstant.ReturnHandlingEditApp);
        }
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

  ChangeEmpPos(idx: number) {
    let ListIdx = idx;
    for (let i = 0; i < this.ListAppCommHObj.length; i++) {
      if (this.ListAppCommHObj[i].MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp) {
        if (ListIdx != 0) {
          ListIdx--;
        }
        else {
          this.ListAppCommHObj[i].ListAppCommSupplEmpObj = new Array<AppCommSupplEmpObjX>();
          const tempDataList = this.CommissionForm.get(this.identifierSupplierEmp) as FormArray;
          const tempData = tempDataList.get(idx.toString()) as FormGroup;
          const tempListSupplEmp = tempData.get("ListEmpPosition") as FormArray;

          for (let z = 0; z < tempListSupplEmp.length; z++) {
            const tempListSupplEmpIdx = tempListSupplEmp.get(z.toString()) as FormGroup;
            if (tempListSupplEmpIdx.get("PositionSelect").value) {
              let tempEmp = new AppCommSupplEmpObjX();
              // tempEmp.SeqNo = tempListSupplEmpIdx.get("SeqNo").value;
              tempEmp.SeqNo = this.ListAppCommHObj[i].ListAppCommSupplEmpObj.length + 1;
              tempEmp.MrSbePositionMnl = tempListSupplEmpIdx.get("MasterCode").value;
              this.ListAppCommHObj[i].ListAppCommSupplEmpObj.push(tempEmp);
            }

          }

        }
      }
    }
  }

}
