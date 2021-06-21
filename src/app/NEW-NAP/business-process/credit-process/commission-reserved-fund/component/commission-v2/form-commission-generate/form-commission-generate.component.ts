import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, NgForm, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ResponseTaxDetailObj } from 'app/shared/model/Tax/ResponseTaxDetail.Model';
import { ResponseTaxObj } from 'app/shared/model/Tax/ResponseTax.Model';
import { TaxTrxDObj } from 'app/shared/model/Tax/TaxTrxD.Model';
import { VendorBankAccObj } from 'app/shared/model/VendorBankAcc.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCommissionHObj } from 'app/shared/model/AppCommissionHObj.Model';
import { AppCommissionDObj } from 'app/shared/model/AppCommissionDObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ReqGetListBankByVendorEmpNoAndCodeObj } from 'app/shared/model/Request/Vendor/ReqVendorEmp.model';

@Component({
  selector: 'app-form-commission-generate',
  templateUrl: './form-commission-generate.component.html',
  styleUrls: ['./form-commission-generate.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class FormCommissionGenerateComponent implements OnInit {


  @Output('update') DataEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() FormInputObj: object = {};
  @Input() DictMaxIncomeForm: object = {};
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,) { }

  arr: FormArray;
  DDLContentName: Array<any>;
  tempDDLContentName: Array<any>;
  lenDDLContentName: number = 0;
  totalDDLContentData: number = 0;
  AllocationType: string = "Amount";
  initData() {
    this.parentForm.addControl(this.identifier, this.fb.array([]));
    this.arr = this.parentForm.get(this.identifier) as FormArray;
    this.GetDDLContentName();
  }

  ngOnInit() {
    this.initData();
    this.GenerateAuto();
  }

  GenerateAuto() {
    if (this.FormInputObj["isAutoGenerate"]) {
      let tempTotalData = this.lenDDLContentName;
      for (var i = 0; i < tempTotalData; i++) {
        this.AddNewDataForm();
        this.NewAutoData();
      }
    }
  }

  NewAutoData() {
    let idxDDLContent = 0;
    let indexFormObj = this.parentForm.value[this.identifier].length - 1;
    var obj;
    var code;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      obj = {
        Key: this.DDLContentName[idxDDLContent].Key,
        Value: this.DDLContentName[idxDDLContent].Value,
        MrSupplEmpPositionCode: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode,
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idxDDLContent].SupplCode,
      };
      code = this.DDLContentName[idxDDLContent].SupplCode;
    } else {
      obj = {
        Key: this.DDLContentName[idxDDLContent].Key,
        Value: this.DDLContentName[idxDDLContent].Value,
      };
      code = this.DDLContentName[idxDDLContent].Key;

    }

    var temp = this.GetTempRuleObj(code, this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode);
    if (temp == undefined || temp == null) {
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        ContentName: "",
        ContentNameValue: ""
      });
      return this.toastr.warningMessage("There no rule setting for " + code);
    }

    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
      ContentName: this.DDLContentName[idxDDLContent].Key,
      ContentNameValue: this.DDLContentName[idxDDLContent].Value
    });
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp)
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idxDDLContent].SupplCode
      });
    this.GetDDLBankAccount(this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ContentName.value, indexFormObj);
    this.SetRule(code, indexFormObj, this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode);
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idxDDLContent, 1);
    this.PassData();
  }

  AddNewDataForm() {
    var NewDataForm = this.fb.group({
      AppCommissionHId: [0],
      ContentName: ['', Validators.required],
      ContentNameValue: [''],
      MrSupplEmpPositionCodeDesc: [''],
      SupplCode: [''],
      BankAccountNo: ['', Validators.required],
      BankAccountName: [''],
      BankBranch: [''],
      BankCode: [''],
      BankName: [''],
      MrIdTypeCode: [''],
      MrTaxKindCode: [''],
      MrTaxCalcMethodCode: [''],
      TaxpayerNo: [''],
      TotalCommisionAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalExpenseAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalTaxAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalVATAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalPenaltyAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalDisburseAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      RowVersion: [''],
      ListAllocated: this.fb.array([]),
      DropDownList: this.fb.array([])
    }) as FormGroup;
    this.arr.push(NewDataForm);
    this.lenDDLContentName--;
    // if(this.FormInputObj["isAutoGenerate"]){
    // }
  }

  GetDDLContentName() {
    this.DDLContentName = this.FormInputObj["contentObj"];
    this.tempDDLContentName = new Array();
    this.lenDDLContentName = this.DDLContentName.length;
    this.totalDDLContentData = this.DDLContentName.length;
  }

  ChooseContentName(ev, indexFormObj) {
    var idx = ev.target.selectedIndex - 1;

    var obj;
    var code;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      obj = {
        Key: ev.target.selectedOptions[0].value,
        Value: ev.target.selectedOptions[0].text,
        MrSupplEmpPositionCode: this.DDLContentName[idx].MrSupplEmpPositionCode,
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idx].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idx].SupplCode,
      };
      code = this.DDLContentName[idx].SupplCode;
    } else {
      obj = {
        Key: ev.target.selectedOptions[0].value,
        Value: ev.target.selectedOptions[0].text
      };
      code = this.DDLContentName[idx].Key;

    }

    // var idxTemp: number = idx;
    // if (this.FormInputObj["content"] == AdInsConstant.ContentSupplierEmp) {
    //   idxTemp = this.FormInputObj["contentObj"].indexOf(this.FormInputObj["contentObj"].find(x => x.Key == ev.target.selectedOptions[0].value));
    // }
    var temp = this.GetTempRuleObj(code, this.DDLContentName[idx].MrSupplEmpPositionCode);
    if (temp == undefined || temp == null) {
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        ContentName: "",
        ContentNameValue: ""
      });
      return this.toastr.warningMessage("There no rule setting for " + code);
    }

    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
      ContentName: ev.target.selectedOptions[0].value,
      ContentNameValue: ev.target.selectedOptions[0].text
    });
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp)
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idx].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idx].SupplCode
      });
    this.GetDDLBankAccount(this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ContentName.value, indexFormObj);
    this.SetRule(code, indexFormObj, this.DDLContentName[idx].MrSupplEmpPositionCode);
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idx, 1);
    this.PassData();
  }

  SetRule(supplCode: string, formIdx: number, role: string) {
    var ruleObj = this.GetTempRuleObj(supplCode, role);
    var TotalCommisionAmount: number = 0;
    for (var i = 0; i < ruleObj.length; i++) {

      let behaviour: string = ruleObj[i].AllocationBehaviour;
      let maxAllocAmt: number = ruleObj[i].MaxAllocationAmount;
      let allocAmt: number = ruleObj[i].AllocationAmount;
      let percentageAmt: number = 0;
      let maxAllocPercentage: number = 0;
      if (this.DictMaxIncomeForm[ruleObj[i].AllocationFrom] != undefined && this.DictMaxIncomeForm[ruleObj[i].AllocationFrom] != null && this.DictMaxIncomeForm[ruleObj[i].AllocationFrom].RefundAmount > 0) {
        if (ruleObj[i].MaxAllocationAmount > this.DictMaxIncomeForm[ruleObj[i].AllocationFrom].RefundAmount)
          maxAllocAmt = this.DictMaxIncomeForm[ruleObj[i].AllocationFrom].RefundAmount;

        if (maxAllocAmt <= 0) {
          behaviour = CommonConstant.RuleBehaviourLock;
          maxAllocAmt = 0;
        }

        if (allocAmt >= maxAllocAmt)
          allocAmt = maxAllocAmt;

        if (allocAmt <= 0)
          allocAmt = 0;

      } else {
        behaviour = CommonConstant.RuleBehaviourLock;
        maxAllocAmt = 0;
        allocAmt = 0;
      }
      percentageAmt = (allocAmt / this.DictMaxIncomeForm[ruleObj[i].AllocationFrom].RefundAmount) * 100;

      if (isNaN(percentageAmt)) {
        percentageAmt = 0;
      }

      var eachAllocationDetail = this.fb.group({
        AppCommissionDId: [0],
        AppCommissionHId: [0],
        AllocationFromSeq: [ruleObj[i].AllocationFromSeq],
        AllocationFrom: [ruleObj[i].AllocationFrom],
        AllocationFromDesc: [ruleObj[i].AllocationFromDesc],
        MaxAllocationAmount: [maxAllocAmt],
        AllocationAmount: [allocAmt, [Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.max(this.DictMaxIncomeForm[ruleObj[i].AllocationFrom].RefundAmount)]],
        AllocationPercentage: [percentageAmt, [Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.max(100)]],
        AllocationBehaviour: [behaviour],
        TaxAmt: [0],
        VatAmt: [0],
        PenaltyAmt: [0],
        RowVersion: [''],
        TotalListAllocatedDivided: [Math.ceil(ruleObj.length / 2)]
      }) as FormGroup;
      TotalCommisionAmount += allocAmt;
      this.parentForm.controls[this.identifier]["controls"][formIdx].controls.ListAllocated.push(eachAllocationDetail);

      this.UpdateInputType(this.AllocationType);
    }

    // patch total
    this.parentForm.controls[this.identifier]["controls"][formIdx].patchValue({
      TotalCommisionAmount: TotalCommisionAmount,
    });
  }

  GetTempRuleObj(supplCode: string, role: string) {
    var tempObj;
    console.log("GetTempRuleObj: " + this.FormInputObj['content']);
    console.log(this.FormInputObj);
    if (this.FormInputObj['content'] == CommonConstant.ContentSupplier) {
      console.log("Is Supplier Commission..");
      console.log(supplCode);
      tempObj = this.FormInputObj['ruleObj'][supplCode];
    } else if (this.FormInputObj['content'] == CommonConstant.ContentSupplierEmp) {
      tempObj = this.FormInputObj['ruleObj'][supplCode][role];
    } else if (this.FormInputObj['content'] == CommonConstant.ContentReferantor) {
      tempObj = this.FormInputObj['ruleObj'][supplCode];
    }
    return tempObj;
  }

  GetDDLBankAccount(code, idx) {
    var content = this.FormInputObj["content"];
    let idxDefault = 0;
    if (content == CommonConstant.ContentSupplier) {
      this.http.post<VendorBankAccObj>(URLConstant.GetListVendorBankAccByVendorCode, { Code: code }).subscribe(
        (response) => {
          var len = response["ReturnObject"].length;
          for (var i = 0; i < len; i++) {
            if (response["ReturnObject"][i].IsDefault == true) idxDefault = i;
            var eachDDLDetail = this.fb.group({
              Key: response["ReturnObject"][i]["BankAccountNo"],
              Value: response["ReturnObject"][i]["BankAccountName"],
              BankCode: response["ReturnObject"][i]["BankCode"],
              BankName: response["ReturnObject"][i]["BankName"],
              BankBranch: ""
            }) as FormGroup;
            this.parentForm.controls[this.identifier]["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
          if (len == 1) idxDefault = 0;
          this.SetDefaultDDLBankAcc(idx, idxDefault);
        });
    } else if (content == CommonConstant.ContentSupplierEmp) {
      let ReqGetListBankObj: ReqGetListBankByVendorEmpNoAndCodeObj = new ReqGetListBankByVendorEmpNoAndCodeObj();
      ReqGetListBankObj.VendorEmpNo = code;
      ReqGetListBankObj.VendorCode = this.parentForm.value[this.identifier][idx].SupplCode;
      this.http.post<VendorBankAccObj>(URLConstant.GetListBankByVendorEmpNoAndVendorCode, ReqGetListBankObj).subscribe(
        (response) => {
          var len = response["ReturnObject"].length;
          for (var i = 0; i < len; i++) {
            if (response["ReturnObject"][i].IsDefault == true) idxDefault = i;
            var eachDDLDetail = this.fb.group({
              Key: response["ReturnObject"][i]["BankAccountNo"],
              Value: response["ReturnObject"][i]["BankAccountName"],
              BankCode: response["ReturnObject"][i]["BankCode"],
              BankName: response["ReturnObject"][i]["BankName"],
              BankBranch: ""
            }) as FormGroup;
            this.parentForm.controls[this.identifier]["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
          if (len == 1) idxDefault = 0;
          this.SetDefaultDDLBankAcc(idx, idxDefault);
        });
    } else if (content == CommonConstant.ContentReferantor) {
      this.http.post(URLConstant.GetRefBankByBankCodeAsync, { Code: this.FormInputObj["BankData"].BankCode }).toPromise().then(
        (response) => {
          var eachDDLDetail = this.fb.group({
            Key: this.FormInputObj["BankData"].BankAccNo,
            Value: this.FormInputObj["BankData"].BankAccName,
            BankCode: this.FormInputObj["BankData"].BankCode,
            BankName: response["BankName"],
            BankBranch: this.FormInputObj["BankData"].BankBranch
          }) as FormGroup;
          this.parentForm.controls[this.identifier]["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          this.SetDefaultDDLBankAcc(idx, idxDefault);
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }
  }

  SetDefaultDDLBankAcc(idxForm: number, idxDefault: number) {
    var ddlObj = this.parentForm.controls[this.identifier]["controls"][idxForm].controls.DropDownList.value[idxDefault];

    if (ddlObj != undefined || ddlObj != null) {
      console.log(this.parentForm.controls[this.identifier]["controls"][idxForm]);
      this.parentForm.controls[this.identifier]["controls"][idxForm].patchValue({
        BankAccountNo: ddlObj.Key,
        BankAccountName: ddlObj.Value,
        BankBranch: ddlObj.BankBranch,
        BankCode: ddlObj.BankCode,
        BankName: ddlObj.BankName
      });
      return;
    }
    this.toastr.warningMessage("This " + this.FormInputObj['labelName'] + ": " + this.parentForm.controls[this.identifier]["controls"][idxForm].value.ContentNameValue + " has no bank account");
    return;
  }

  DeleteDataForm(idx) {
    if (confirm('Are you sure to delete this record?')) {
      this.FormInputObj["isCalculated"] = false;
      if (this.parentForm.controls[this.identifier]["controls"][idx].controls.AppCommissionHId.value != 0)
        this.DeleteFromDatabase(this.parentForm.controls[this.identifier]["controls"][idx].controls.AppCommissionHId.value);
      var tempContentName = this.parentForm.controls[this.identifier]["controls"][idx].controls.ContentName.value;
      if (tempContentName != "") {
        var i = this.tempDDLContentName.indexOf(this.tempDDLContentName.find(x => x.Key == tempContentName));
        this.DDLContentName.push(this.tempDDLContentName[i]);
        this.tempDDLContentName.splice(i, 1);
      }
      this.lenDDLContentName++;
      if (this.totalDDLContentData == this.lenDDLContentName)
        this.FormInputObj["isDataInputed"] = false;
      this.arr.removeAt(idx);
      this.PassData();
    }
  }

  DeleteFromDatabase(AppCommissionHId) {
    let obj: GenericObj = new GenericObj()
    obj.Id = AppCommissionHId;
    this.http.post(URLConstant.DeleteAppCommissionData, obj).subscribe(
      (response) => {
      });
  }

  ChangeBankAcc(ev, i) {
    if (ev.target.selectedIndex == 0) return;
    var idxDDL = ev.target.selectedIndex - 1;
    var ddlObj = this.parentForm.controls[this.identifier]["controls"][i].controls.DropDownList.value[idxDDL];

    this.parentForm.controls[this.identifier]["controls"][i].patchValue({
      BankAccountNo: ddlObj.Key,
      BankAccountName: ddlObj.Value,
      BankBranch: ddlObj.BankBranch,
      BankCode: ddlObj.BankCode,
      BankName: ddlObj.BankName
    });
  }

  ChangeDataLabel(indexFormObj) {
    this.FormInputObj["isCalculated"] = false;
    var len = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls.length;
    var tempTotal = 0;
    for (var i = 0; i < len; i++) {
      var t: number = +this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount.value;
      tempTotal += t;
    }
    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
      TotalCommisionAmount: tempTotal
    });
    this.ChangeAllocPercentageBasedOnAmt(indexFormObj);
    this.PassData();
  }

  CalcTtlCommAmtAndPassingData(indexFormObj: number) {
    this.FormInputObj["isCalculated"] = false;
    var len = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls.length;
    var tempTotal = 0;
    for (var i = 0; i < len; i++) {
      var t: number = +this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount.value;
      tempTotal += t;
    }
    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
      TotalCommisionAmount: tempTotal
    });
    this.PassData();
  }

  //get percentage when do input amount
  ChangeAllocPercentageBasedOnAmt(indexFormObj: number) {
    this.FormInputObj["isCalculated"] = false;
    var len = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls.length;
    for (var i = 0; i < len; i++) {
      const getAllocationFrom = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationFrom;
      var getpercentage = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationPercentage;
      const getamount = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount;
      var newPercent: number = 0;
      if (getamount.value != null && getamount.value != undefined) {
        let ttlAvailableAmt: number = 0;
        ttlAvailableAmt = this.DictMaxIncomeForm[getAllocationFrom.value].RefundAmount;
        if (ttlAvailableAmt != 0 && ttlAvailableAmt != undefined) {
          newPercent = (getamount.value / ttlAvailableAmt) * 100;
          this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated["controls"][i].patchValue({
            AllocationPercentage: newPercent,
          })
        }
      }
    }
  }

  ChangeAllocAmountBasedOnPercentage(indexFormObj: number) {
    this.FormInputObj["isCalculated"] = false;
    var len = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls.length;
    for (var i = 0; i < len; i++) {
      const getAllocationFrom = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationFrom;
      const getpercentage = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationPercentage;
      // var getamount = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount;
      var newAmt: number = 0;
      if (getpercentage.value != null && getpercentage.value != undefined) {
        var percent: number = getpercentage.value;
        // if(percent != 0 && percent != undefined)
        if (percent != undefined && percent != null) {
          let ttlAvailableAmt: number = 0;

          ttlAvailableAmt = this.DictMaxIncomeForm[getAllocationFrom.value].RefundAmount;
          if (ttlAvailableAmt != 0 && ttlAvailableAmt != undefined) {
            newAmt = (getpercentage.value / 100) * ttlAvailableAmt;
            this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated["controls"][i].patchValue({
              AllocationAmount: newAmt,
            })

            this.CalcTtlCommAmtAndPassingData(indexFormObj);
          }
        }
      }
    }
  }

  PatchDataExisting(appCommObj: any) {
    this.AddNewDataForm();
    let idxDDLContent = this.DDLContentName.findIndex(x => x.Key == appCommObj.CommissionRecipientRefNo);
    let indexFormObj = this.parentForm.value[this.identifier].length - 1;
    var obj;
    var code;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      obj = {
        Key: this.DDLContentName[idxDDLContent].Key,
        Value: this.DDLContentName[idxDDLContent].Value,
        MrSupplEmpPositionCode: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode,
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idxDDLContent].SupplCode,
      };
      code = this.DDLContentName[idxDDLContent].SupplCode;
    } else {
      obj = {
        Key: this.DDLContentName[idxDDLContent].Key,
        Value: this.DDLContentName[idxDDLContent].Value,
      };
      code = this.DDLContentName[idxDDLContent].Key;

    }
    var temp = this.GetTempRuleObj(code, this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode);
    if (temp == undefined || temp == null) {
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        ContentName: "",
        ContentNameValue: ""
      });
      return this.toastr.warningMessage("There no rule setting for " + code);
    }
    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
      AppCommissionHId: appCommObj.AppCommissionHId,
      ContentName: this.DDLContentName[idxDDLContent].Key,
      ContentNameValue: this.DDLContentName[idxDDLContent].Value,
      BankAccountNo: appCommObj.BankAccNo,
      BankAccountName: appCommObj.BankAccName,
      BankBranch: appCommObj.BankBranch,
      BankCode: appCommObj.BankCode,
      BankName: appCommObj.BankName,
      MrIdTypeCode: appCommObj.MrIdTypeCode,
      MrTaxKindCode: appCommObj.MrTaxKindCode,
      MrTaxCalcMethodCode: appCommObj.MrTaxCalcMethodCode,
      TaxpayerNo: appCommObj.TaxpayerNo,
      TotalCommisionAmount: appCommObj.TotalCommissionAmt,
      TotalExpenseAmount: appCommObj.TotalExpenseAmt,
      TotalTaxAmount: appCommObj.TaxAmt,
      TotalVATAmount: appCommObj.VatAmt,
      TotalPenaltyAmount: appCommObj.PenaltyAmt,
      TotalDisburseAmount: appCommObj.TotalDisburseAmt,
      RowVersion: appCommObj.RowVersion,
    });
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp)
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idxDDLContent].SupplCode
      });
    this.GetDDLBankAccount(this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ContentName.value, indexFormObj);
    this.SetRule(code, indexFormObj, this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode);

    for (var i = 0; i < appCommObj.AppCommissionDs.length; i++) {
      let idxFromRuleObj = temp.findIndex(x => x.AllocationFrom == appCommObj.AppCommissionDs[i].MrCommissionSourceCode);
      if (idxFromRuleObj >= 0) {
        var allocAmt = 0;
        if (this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated["value"][idxFromRuleObj].AllocationBehaviour != "LOCK") {
          allocAmt = appCommObj.AppCommissionDs[i].CommissionAmt;
        }
        this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated["controls"][idxFromRuleObj].patchValue({
          AppCommissionDId: appCommObj.AppCommissionDs[i].AppCommissionDId,
          AppCommissionHId: appCommObj.AppCommissionDs[i].AppCommissionHId,
          AllocationAmount: allocAmt,
          TaxAmt: appCommObj.AppCommissionDs[i].TaxAmt,
          VatAmt: appCommObj.AppCommissionDs[i].VatAmt,
          PenaltyAmt: appCommObj.AppCommissionDs[i].PenaltyAmt,
          RowVersion: appCommObj.AppCommissionDs[i].RowVersion,
        })
      }
    }
    this.ReCalcListAllocated(indexFormObj);
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idxDDLContent, 1);
    this.ChangeAllocPercentageBasedOnAmt(indexFormObj);
  }

  ReCalcListAllocated(indexFormObj: number) {
    let totalCommAmt = 0;
    for (var i = 0; i < this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.value.length; i++) {
      totalCommAmt += this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.value[i].AllocationAmount;
    }

    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
      TotalCommisionAmount: totalCommAmt,
    });
  }

  PassData() {
    this.DataEmit.emit();
  }

  UpdateInputType(type: any) {
    let indexFormObj = this.parentForm.value[this.identifier].length - 1;
    if (indexFormObj > -1) {
      let MaxIdxComponent = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated["controls"].length;
      for (var i = 0; i < MaxIdxComponent; i++) {
        var AllocationBehaviour = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated["controls"][i].controls.AllocationBehaviour.value;
        var index = this.parentForm.controls[this.identifier]["controls"].length;
        if (AllocationBehaviour != "LOCK") {
          this.AllocationType = type;
          if (type == "Amount") {
            if (index > 0) {
              for (var j = 0; j < index; j++) {
                this.parentForm.controls[this.identifier]["controls"][j].controls.ListAllocated["controls"][i].controls.AllocationAmount.enable();
                this.parentForm.controls[this.identifier]["controls"][j].controls.ListAllocated["controls"][i].controls.AllocationPercentage.disable();
              }
            }
          } else {
            if (index > 0) {
              for (var k = 0; k < index; k++) {
                this.parentForm.controls[this.identifier]["controls"][k].controls.ListAllocated["controls"][i].controls.AllocationAmount.disable();
                this.parentForm.controls[this.identifier]["controls"][k].controls.ListAllocated["controls"][i].controls.AllocationPercentage.enable();
              }
            }
          }
        }
      }
    }
  }
}
