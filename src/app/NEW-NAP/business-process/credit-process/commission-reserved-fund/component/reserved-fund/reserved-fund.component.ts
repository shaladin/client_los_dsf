import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppReservedFundObj } from 'app/shared/model/app-reserved-fund-obj.model';
import { AllAppReservedFundObj } from 'app/shared/model/all-app-reserved-fund-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { ReturnHandlingHObj } from 'app/shared/model/return-handling/return-handling-h-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ResultRefundObj } from 'app/shared/model/app-fin-data/result-refund.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AppFeeObj } from 'app/shared/model/app-fee-obj.model';
import { AppCommissionHObj } from 'app/shared/model/app-commission-h-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { ReqReturnHandlingCommRsvFundObj } from 'app/shared/model/app-commission-rsv-fund/req-return-handling-comm-rsv-fund-obj.model';
import { environment } from 'environments/environment';

@Component({
  selector: "reserved-fund",
  templateUrl: "./reserved-fund.component.html",
  providers: [NGXToastrService]
})
export class ReservedFundComponent implements OnInit {
  RsvForm = this.fb.group({
    ReservedFundObjs: this.fb.array([])
  });

  @Input() ReturnHandlingHObj: ReturnHandlingHObj;
  @Input() showCancel: boolean = true;
  @Input() maxAllocAmt: number = 0;
  @Input() totalExpenseAmt: number = 0;
  @Input() totalRsvFundAmt: number = 0;
  @Input() DictMaxIncomeForm: object = {};
  @Input() ListResultRefundIncomeInfo: Array<ResultRefundObj>;
  @Input() BizTemplateCode: string;
  @Output() outputTab: EventEmitter<AllAppReservedFundObj> = new EventEmitter();
  @Output() outputDictRemaining: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Output() outputUpdateRemainingAlloc: EventEmitter<number> = new EventEmitter();

  appReservedFundObjs: Array<AppReservedFundObj>;
  allAppReservedFundObj: AllAppReservedFundObj = new AllAppReservedFundObj();
  isCalculated: boolean = false;
  // uppingRate: number;
  // insuranceIncome: number;
  // lifeInsuranceIncome: any;
  appFeeObj: Array<AppFeeObj>;
  ruleObj: any;
  calcGrossYieldObj: any;
  // maxAllocatedAmt: any;
  remainingAllocatedAmt: number;
  // totalRsvFundAmt: number = 0;
  totalRsvFundAmtWhenSave: number;
  grossYield: number;
  show: boolean = false;
  maxAllocatedRefundAmt: number = 0;
  // totalExpenseAmt: number = 0;
  isReturnOn: boolean = false;
  DDLData: { [id: string]: Array<KeyValueObj> } = {};
  readonly DDLReason: string = CommonConstant.RefReasonTypeCodeReturnHandlingGeneral;
  readonly DDLTask: string = CommonConstant.ReturnTask;


  FormReturnObj  =this.fb.group({
    ReturnTo: [''],
    Reason: [''],
    Notes: ['']
  });

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["WfTaskListId"] != null) {
        this.allAppReservedFundObj.WfTaskIdListId = params["WfTaskListId"];
      }
    });
  }

  async ngOnInit() {
    var appObj = {
      Id: this.ReturnHandlingHObj.AppId
    };
    await this.GetAppCommissionData(appObj);
    this.GetAppRsvFundRule(appObj);
    // this.GetAppFinData(appObj);
    // this.GetMaxAllocAmt(appObj);
    this.GetAppFee(appObj);
    this.GetAppCust(appObj);
    await this.bindDDLReasonReturn();
    await this.bindTaskObj();
  }

  SaveForm() {
    if (this.isCalculated == false) {
      this.toastr.warningMessage(ExceptionConstant.PLEASE_CALCULATE_FIRST);
    }
    else {
      this.calculating()
      if (this.totalRsvFundAmtWhenSave != this.totalRsvFundAmt)
      {
        this.toastr.warningMessage(ExceptionConstant.PLEASE_CALCULATE_AGAIN);
      }
      else if (this.remainingAllocatedAmt < 0) {
        this.toastr.warningMessage(ExceptionConstant.TOTAL_RESERVED_FUND_AMOUNT_MUST_LEST_THAN + "Remaining Allocated Amount");
      }
      else if (this.maxAllocAmt < this.totalRsvFundAmt) {
        this.toastr.warningMessage(ExceptionConstant.TOTAL_RESERVED_FUND_AMOUNT_MUST_LEST_THAN + "Max Allocated Amount");
      }
      else {
        var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
        this.setAppReservedFundData();

        let AddEditAppReservedFundUrl = environment.isCore ? URLConstant.AddEditAppReservedFundV2 : URLConstant.AddEditAppReservedFund;
        this.http.post(AddEditAppReservedFundUrl, this.allAppReservedFundObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.allAppReservedFundObj.ReturnHandlingHId != 0 || this.allAppReservedFundObj.ReturnHandlingHId != undefined) {
              this.outputTab.emit(this.allAppReservedFundObj);
            } else {
              AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING],{ "BizTemplateCode": lobCode});
            }
          }
        );
      }
    }
  }

  setAppReservedFundData() {
    this.allAppReservedFundObj.AppId = this.ReturnHandlingHObj.AppId;
    this.allAppReservedFundObj.ReturnHandlingHId = this.ReturnHandlingHObj.ReturnHandlingHId;
    this.allAppReservedFundObj.WfTaskIdListId = this.ReturnHandlingHObj.WfTaskListId;
    this.allAppReservedFundObj.GrossYield = this.grossYield;
    this.allAppReservedFundObj.TotalReservedFundAmt = this.totalRsvFundAmt;
    this.allAppReservedFundObj.RequestAppReservedFundObjs = new Array<AppReservedFundObj>();
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var appReservedFundObj = new AppReservedFundObj();
      appReservedFundObj.AppId = this.ReturnHandlingHObj.AppId;
      appReservedFundObj.MrReservedFundSourceCode = this.RsvForm.controls["ReservedFundObjs"].value[i].MrReservedFundSourceCode;
      appReservedFundObj.MrReservedFundCode = this.RsvForm.controls["ReservedFundObjs"].value[i].MrReservedFundCode;
      appReservedFundObj.ReservedFundAmt = this.RsvForm.controls["ReservedFundObjs"].value[i].ReservedFundAmt;
      appReservedFundObj.StdReservedFundAmt = this.RsvForm.controls["ReservedFundObjs"].value[i].StdReservedFundAmt;
      if(this.DictMaxIncomeForm[appReservedFundObj.MrReservedFundSourceCode] != undefined){
        appReservedFundObj.RefundAmt = this.DictMaxIncomeForm[appReservedFundObj.MrReservedFundSourceCode].RefundAmount;
      }else{
        appReservedFundObj.RefundAmt = 0;
      }
      appReservedFundObj.Behaviour = this.RsvForm.controls["ReservedFundObjs"].value[i].Behaviour;
      this.allAppReservedFundObj.RequestAppReservedFundObjs.push(appReservedFundObj);
    }
  }

  // GetAppFinData(appObj) {
  //   this.http.post(URLConstant.GetIncomeInfoRsvFund, appObj).subscribe(
  //     (response) => {
  //       this.uppingRate = response["DiffRateAmt"];
  //       this.insuranceIncome = response["TotalInsCustAmt"] - response["TotalInsInscoAmt"];
  //       this.lifeInsuranceIncome = response["TotalLifeInsCustAmt"] - response["TotalLifeInsInscoAmt"];
  //       this.maxAllocatedRefundAmt = response["MaxAllocatedRefundAmt"];
  //       this.totalExpenseAmt = response["TotalExpenseAmt"];
  //       this.totalRsvFundAmt = response["ReservedFundAllocatedAmt"];
  //       this.calculatedRemainingAmt();
  //     }
  //   );
  // }

  calculatedRemainingAmt() {
    this.remainingAllocatedAmt = this.maxAllocAmt - this.totalExpenseAmt - this.totalRsvFundAmt;
    if (0 > this.remainingAllocatedAmt) {
      this.toastr.warningMessage(ExceptionConstant.TOTAL_RESERVED_FUND_AMOUNT_MUST_LEST_THAN + "Remaining Allocated Amount");
      return false;
    } 
    this.outputUpdateRemainingAlloc.emit(this.totalRsvFundAmt);
    return true;
  }

  DictRemainingIncomeForm: object = {};
  async GetAppCommissionData(appObj) {
    for (let index = 0; index < this.ListResultRefundIncomeInfo.length; index++) {
      const element = this.ListResultRefundIncomeInfo[index];
      let TempObj = new ResultRefundObj();
      TempObj.RefundAllocationFrom = element.RefundAllocationFrom;
      TempObj.RefundAllocationFromDesc = element.RefundAllocationFromDesc;
      TempObj.RefundAmount = element.RefundAmount;
      this.DictRemainingIncomeForm[element.RefundAllocationFrom] = TempObj;
    }
    await this.http.post(URLConstant.GetAppCommissionDataForEditByAppId, appObj).toPromise().then(
      (response) => {
        let tempObj: Array<AppCommissionHObj> = response[CommonConstant.ReturnObj];
        // console.log(tempObj);
        for (let index = 0; index < tempObj.length; index++) {
          const element = tempObj[index];
          // console.log(element);
          for (let index2 = 0; index2 < element.AppCommissionDs.length; index2++) {
            const element2 = element.AppCommissionDs[index2];
            // console.log(element2);
            if(this.DictRemainingIncomeForm[element2.MrCommissionSourceCode]){
              this.DictRemainingIncomeForm[element2.MrCommissionSourceCode].RefundAmount-=element2.CommissionAmt;
            }
          }
        }
        // console.log(this.DictRemainingIncomeForm);
        this.outputDictRemaining.emit(this.DictRemainingIncomeForm);
      }
    );
  }

  GetAppFee(appObj) {
    this.http.post(URLConstant.GetListAppFeeByAppId, appObj).subscribe(
      (response) => {
        this.appFeeObj = response[CommonConstant.ReturnObj];

      }
    );
  }


  GetAppCust(appObj) {
    this.http.post<AppCustObj>(URLConstant.GetAppCustByAppId, appObj).subscribe(
      (response) => {
        if (response.MrCustTypeCode == CommonConstant.CustTypeCompany) {
          this.allAppReservedFundObj.IsPersonal = false
        }
      }
    )
  }

  // GetMaxAllocAmt(appObj) {
  //   this.http.post(this.getMaxAllocAmtRsvFundUrl, appObj).subscribe(
  //     (response) => {
  //       this.maxAllocatedAmt = response["MaxRefundAmount"];
  //     }
  //   );
  // }

  GetAppRsvFundRule(appObj) {
    this.http.post(URLConstant.CreateRsvFundRule, appObj).subscribe(
      (response) => {
        this.ruleObj = response[CommonConstant.ReturnObj];
        this.appReservedFundObjs = new Array<AppReservedFundObj>();
        for (let i = 0; i < this.ruleObj.length; i++) {
          var appReservedFundObj = new AppReservedFundObj();
          appReservedFundObj.AppId = this.ReturnHandlingHObj.AppId;
          appReservedFundObj.MrReservedFundSourceCode = this.ruleObj[i].AllocationFrom;
          appReservedFundObj.MrReservedFundCode = this.ruleObj[i].AllocationTo;
          appReservedFundObj.ReservedFundAmt = this.ruleObj[i].AllocationAmount;
          appReservedFundObj.StdReservedFundAmt = this.ruleObj[i].AllocationStdAmount;
          appReservedFundObj.Behaviour = this.ruleObj[i].AllocationBehaviour;
          appReservedFundObj.MrReservedFundSourceName = this.ruleObj[i].AllocationFromName;
          this.appReservedFundObjs.push(appReservedFundObj);
          //this.RsvForm.controls['ReservedFundObjs']['controls'][i]['controls'].ReservedFundAmt = this.ruleObj[i].AllocationAmount;

        }
        for (let j = 0; j < this.appReservedFundObjs.length; j++) {
          var listAppRsvFunds = this.RsvForm.controls["ReservedFundObjs"] as FormArray;
          let maxAmt = 0;
          let allocAmt = 0;
          if (this.DictRemainingIncomeForm[this.appReservedFundObjs[j].MrReservedFundSourceCode] != undefined) {
            if (this.DictRemainingIncomeForm[this.appReservedFundObjs[j].MrReservedFundSourceCode].RefundAmount > 0){
              maxAmt = this.DictRemainingIncomeForm[this.appReservedFundObjs[j].MrReservedFundSourceCode].RefundAmount;
              allocAmt = this.appReservedFundObjs[j].ReservedFundAmt;
            }
            else{
              maxAmt = 0;
              allocAmt = 0;
            }
          }
          listAppRsvFunds.push(this.addGroup(this.appReservedFundObjs[j], j, maxAmt, allocAmt));
        }
      }
    );
  }

  addGroup(appReservedFundObjs, i, maxAmt: number, allocAmt: number) {
    return this.fb.group({
      No: [i],
      MrReservedFundSourceCode: [appReservedFundObjs.MrReservedFundSourceCode],
      MrReservedFundCode: [appReservedFundObjs.MrReservedFundCode],
      ReservedFundAmt: [allocAmt, [Validators.required, Validators.max(maxAmt)]],
      MaxAmt: [maxAmt],
      StdReservedFundAmt: [appReservedFundObjs.StdReservedFundAmt],
      Behaviour: [appReservedFundObjs.Behaviour],
      MrReservedFundSourceName: [appReservedFundObjs.MrReservedFundSourceName]
    })

  }

  calculated() {
    this.totalRsvFundAmt = 0;
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var temp: number = +this.RsvForm.controls["ReservedFundObjs"].value[i].ReservedFundAmt;
      //temp = this.RsvForm.controls["ReservedFundAmt" + i].value.replace(/\D/g, "");
      this.totalRsvFundAmt = this.totalRsvFundAmt + temp;
    }
    var grossyieldObj = {
      AppId: this.ReturnHandlingHObj.AppId,
      TotalReserveFundAmt: this.totalRsvFundAmt
    };

    if(this.calculatedRemainingAmt()){
      this.http.post(URLConstant.CalculateGrossYieldRsvFund, grossyieldObj).subscribe(
        (response) => {
          this.calcGrossYieldObj = response;
          this.grossYield = this.calcGrossYieldObj.GrossYieldPrcnt;
  
        }
      );
      this.isCalculated = true;
    }
  }

  calculating() {
    this.totalRsvFundAmtWhenSave = 0;
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var temp: number = +this.RsvForm.controls["ReservedFundObjs"].value[i].ReservedFundAmt;
      //temp = this.RsvForm.controls["ReservedFundAmt" + i].value.replace(/\D/g, "");
      this.totalRsvFundAmtWhenSave = this.totalRsvFundAmtWhenSave + temp;
    }
  }

  test() {
    this.setAppReservedFundData();
  }

  InputChanged() {
    this.isCalculated = false;
  }
  
  Cancel(){
    this.outputCancel.emit();
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
    var mrCustTypeCode;

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

  SaveReturnForm(){
    var reqReturnHandlingCommRsvFundObj = new ReqReturnHandlingCommRsvFundObj();
    reqReturnHandlingCommRsvFundObj.AppId = this.ReturnHandlingHObj.AppId;
    reqReturnHandlingCommRsvFundObj.WfTaskListId = this.ReturnHandlingHObj.WfTaskListId;
    reqReturnHandlingCommRsvFundObj.ReturnTo = this.FormReturnObj.value.ReturnTo;
    reqReturnHandlingCommRsvFundObj.Reason = this.FormReturnObj.value.Reason;
    reqReturnHandlingCommRsvFundObj.Notes = this.FormReturnObj.value.Notes;

    let SubmitReturnHandlingCommRsvFundUrl = environment.isCore ? URLConstant.SubmitReturnHandlingCommRsvFundV2 : URLConstant.SubmitReturnHandlingCommRsvFund;
    this.http.post(SubmitReturnHandlingCommRsvFundUrl, reqReturnHandlingCommRsvFundObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING],{ "BizTemplateCode": this.BizTemplateCode});
      });
  }
}
