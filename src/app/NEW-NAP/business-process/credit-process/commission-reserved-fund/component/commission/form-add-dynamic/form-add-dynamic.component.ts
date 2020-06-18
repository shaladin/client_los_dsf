import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-form-add-dynamic',
  templateUrl: './form-add-dynamic.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})

export class FormAddDynamicComponent implements OnInit {

  @Output('update') DataEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() FormInputObj;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService  ) { }

  FormObj = this.fb.group({
    arr: this.fb.array([])
  });

  arr;
  DDLContentName = new Array();
  DDLBankAccount = new Array();
  UserAccess;
  ngOnInit() {
    // console.log("User Access");
    // console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.UserAccess = JSON.parse(localStorage.getItem("UserAccess"));
    this.arr = this.FormObj.get('arr') as FormArray;
    // console.log(this.FormInputObj);
    this.GetDDLContentName();
    // console.log(this.FormInputObj["ruleObj"]);
    this.GenerateAutoAtStart();
  }

  GenerateAutoAtStart(){
    if(this.FormInputObj["isAutoGenerate"]){
      this.FormInputObj["isDataInputed"] = true;
      console.log("Auto Genereate");
      var len = this.DDLContentName.length;
      console.log(len);
      for(var i=len-1;i>=0;i--){
        // console.log("Genereate");
        var j = len - i -1;
        this.AddNewDataForm();
        this.GenerateContentName(i, j);

      }
      this.PassData(AdInsConstant.MessagePassData);
    }
  }

  lenDDLContentName = 0;
  totalDDLContentData = 0;
  tempDDLContentName;
  GetDDLContentName(){
    this.DDLContentName = this.FormInputObj["contentObj"];
    // console.log("DDL Content " + this.FormInputObj["content"]);
    // console.log(this.DDLContentName);
    this.tempDDLContentName = new Array();
    this.lenDDLContentName = this.DDLContentName.length;
    this.totalDDLContentData = this.DDLContentName.length;
  }

  GetDDLBankAccount(code, idx){
    var content = this.FormInputObj["content"];
    // console.log("Obj Code");
    // console.log(code);
    var url;
    var obj;
    if(content == AdInsConstant.ContentSupplier){
      url = AdInsConstant.GetListVendorBankAccByVendorCode;
      obj = {
        VendorCode: code,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) =>{
          // console.log("response bank");
          // console.log(response);
          var len = response["ReturnObject"].length;
          for(var i=0;i<len;i++){
            var eachDDLDetail = this.fb.group({
              Key: response["ReturnObject"][i]["BankAccountNo"],
              Value: response["ReturnObject"][i]["BankAccountName"],
              BankCode: response["ReturnObject"][i]["BankCode"],
              BankBranch: ""
            }) as FormGroup;
            this.FormObj.controls.arr["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
          // console.log(this.FormObj);
        },
        (error) => {
          console.log(error);
        }
      );
    }else if(content == AdInsConstant.ContentSupplierEmp){
      url = AdInsConstant.GetListBankByVendorEmpNoAndVendorCode;
      obj = {
        VendorEmpNo: code,
        VendorCode: this.FormObj.value.arr[idx].SupplCode,
      };
      this.http.post(url, obj).subscribe(
        (response) =>{
          // console.log("response bank");
          // console.log(response);
          var len = response["ReturnObject"].length;
          for(var i=0;i<len;i++){
            var eachDDLDetail = this.fb.group({
              Key: response["ReturnObject"][i]["BankAccountNo"],
              Value: response["ReturnObject"][i]["BankAccountName"],
              BankCode: response["ReturnObject"][i]["BankCode"],
              BankBranch: ""
            }) as FormGroup;
            this.FormObj.controls.arr["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
          // console.log(this.FormObj);
        },
        (error) => {
          console.log(error);
        }
      );
    }else if(content == AdInsConstant.ContentReferantor){
      var eachDDLDetail = this.fb.group({
        Key: this.FormInputObj["BankData"].BankAccNo,
        Value: this.FormInputObj["BankData"].BankAccName,
        BankCode: this.FormInputObj["BankData"].BankCode,
        BankBranch: this.FormInputObj["BankData"].BankBranch
      }) as FormGroup;
      this.FormObj.controls.arr["controls"][idx].controls.DropDownList.push(eachDDLDetail);
      // console.log(this.FormObj);
    }
  }

  AddNewDataForm(){
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
      MrIdTypeCode: [''],
      MrTaxCalcMethodCode: [''],
      TaxpayerNo: [''],
      GrossYield: [0],
      TotalCommisionAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalTaxAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalVATAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalPenaltyAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      RowVersion: [''],
      ListAllocated: this.fb.array([]),
      DropDownList: this.fb.array([])
    }) as FormGroup;
    this.arr.push(NewDataForm);
    // console.log(this.FormObj);
    this.lenDDLContentName--;
    // if(this.FormInputObj["isAutoGenerate"]){
    // }
  }

  DeleteFromDatabase(AppCommissionHId){
    var url = AdInsConstant.DeleteAppCommissionData;
    var obj = {
      AppCommissionHId: AppCommissionHId,
      RowVersion: ""
    };
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  DeleteDataForm(idx){
    // console.log(idx);
    if (confirm('Are you sure to delete this record?')) {
      this.FormInputObj["isCalculated"] = false;
      if(this.FormObj.controls.arr["controls"][idx].controls.AppCommissionHId.value != 0)
        this.DeleteFromDatabase(this.FormObj.controls.arr["controls"][idx].controls.AppCommissionHId.value);
      var tempContentName = this.FormObj.controls.arr["controls"][idx].controls.ContentName.value;
      if(tempContentName != ""){
        var i = this.tempDDLContentName.indexOf(this.tempDDLContentName.find(x => x.Key == tempContentName));
        this.DDLContentName.push(this.tempDDLContentName[i]);
        this.tempDDLContentName.splice(i,1);
      }
      this.lenDDLContentName++;
      // console.log(this.tempDDLContentName);
      // console.log(this.DDLContentName);
      if(this.totalDDLContentData == this.lenDDLContentName) 
        this.FormInputObj["isDataInputed"] = false;
      this.arr.removeAt(idx);
      this.PassData(AdInsConstant.MessageDel);

    }
  }

  CheckData(){
    console.log("User Access");
    console.log(JSON.parse(localStorage.getItem("UserAccess")));
    console.log(this.FormObj);
  }

  CalculateTax(CurrCode, AppNo, OriOfficeCode, AppId){
    this.FormInputObj["isCalculated"] = true;
    var len = this.arr.controls.length;
    if(len == 0) return;
    var vendorCode = new Array();
    var vendorEmpNo = new Array();
    var trxAmt = new Array();
    for(var i = len-1; i >= 0; i--){
      if(this.arr.controls[i].controls.ContentName.value != ""){

        var lenAllocated = this.arr.controls[i].controls.ListAllocated.controls.length;
        var tempTrxAmt = new Array();
        let totalCommAmt = 0;
        for(var j=0;j<lenAllocated;j++){
          totalCommAmt += this.arr.controls[i].controls.ListAllocated.controls[j].controls.AllocationAmount.value;
          tempTrxAmt.push(this.arr.controls[i].controls.ListAllocated.controls[j].controls.AllocationAmount.value);
        }
        // console.log(totalCommAmt);
        if (totalCommAmt == 0){
          this.FormInputObj["isCalculated"] = false;
          return this.toastr.errorMessage("Please Allocate at least 1 item for " + this.arr.controls[i].controls.ContentName.value);
        }
          
        trxAmt.push(tempTrxAmt);
        if(this.FormInputObj["content"] == AdInsConstant.ContentSupplierEmp){
          let idxTempDDDLContentName = this.tempDDLContentName.indexOf(this.tempDDLContentName.find(x => x.Key == this.arr.controls[i].controls.ContentName.value));
          vendorCode.push(this.tempDDLContentName[idxTempDDDLContentName].SupplCode);
          vendorEmpNo.push(this.arr.controls[i].controls.ContentName.value);
        }else{
          vendorCode.push(this.arr.controls[i].controls.ContentName.value);
        }
        
      }else{
        return this.toastr.errorMessage("Please Choose " + this.FormInputObj['labelName'] + " Name at Data " + (i+1) );
      }
    }
    if(vendorCode.length > 0){
      var obj = {
        AppId: AppId,
        UserName: this.UserAccess.UserName,
        Office: this.UserAccess.MrOfficeTypeCode,
        VendorCode: vendorCode,
        VendorEmpNo: vendorEmpNo,
        TrxDt: this.UserAccess.BusinessDt,
        TrxAmt: trxAmt,
        RefNo: AppNo,
        TrxTypeCode: AdInsConstant.TrxTypeCode,
        CurrCode: CurrCode,
        OfficeCode: OriOfficeCode,
        ExchangeRateAmt: AdInsConstant.ExchangeRateAmt, 
        IsSave: false,
        Content: this.FormInputObj["content"],
      };
      console.log(obj);
      this.http.post(AdInsConstant.GetAppCommissionTax, obj).subscribe(
        (response) => {
          console.log("response Tax");
          console.log(this.FormInputObj["content"]);
          console.log(response);
          var temp = response["ReturnObject"];
          len = this.arr.controls.length;
          if(temp.length == len){
            for(var i=0;i<temp.length;i++){
              // console.log(len - i - 1);
              var data = temp[i]["ReturnObject"];
              var totalTaxAmount = 0;
              var totalVATAmount = 0;
              var grandTotalPenalty = 0;
              for(var j=0;j<data.length;j++){
                var taxAmt=0;
                var vatAmt=0;
                var totalPenaltyAmount = 0;
                for(var k=0;k<data[j].length;k++){
                  if(data[j][k].TaxTypeCode == AdInsConstant.TaxTypeCode){
                    totalTaxAmount += data[j][k].TaxAmt;
                    totalPenaltyAmount += data[j][k].PenaltyAmt;
                    taxAmt = data[j][k].TaxAmt;          
                  }else if(data[j][k].TaxTypeCode == AdInsConstant.VATTypeCode){
                    totalVATAmount += data[j][k].TaxAmt;
                    totalPenaltyAmount += data[j][k].PenaltyAmt;
                    vatAmt = data[j][k].TaxAmt;
                  }
                }
                grandTotalPenalty += totalPenaltyAmount;
                this.FormObj.controls.arr["controls"][len -1 - i].controls.ListAllocated.controls[j].patchValue({
                  TaxAmt: taxAmt,
                  VatAmt: vatAmt,
                  PenaltyAmt: totalPenaltyAmount,
                });
              }
              this.FormObj.controls.arr["controls"][len - 1 - i].patchValue({
                MrIdTypeCode: temp[i].MrIdTypeCode,
                MrTaxCalcMethodCode: temp[i].MrTaxCalcMethodCode,
                TaxpayerNo: temp[i].TaxpayerNo,
                TotalTaxAmount: totalTaxAmount,
                TotalVATAmount: totalVATAmount,
                TotalPenaltyAmount: grandTotalPenalty,
                GrossYield: temp[0].GrossYield,
              });
            }
          }
          this.CheckData();
          this.PassData(AdInsConstant.MessageCalculate);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  PassData(message: string){
    // console.log("change data");
    var tempObj={
      formObj: this.FormObj,
      message: message
    };
    this.DataEmit.emit(tempObj);
  }
  
  ChooseContentName(ev, indexFormObj){
    // console.log(ev);
    this.FormInputObj["isCalculated"] = false;
    var idx = ev.target.selectedIndex - 1;
    this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
      ContentName: ev.target.selectedOptions[0].value,
      ContentNameValue: ev.target.selectedOptions[0].text
    });
    if(this.FormInputObj["content"]==AdInsConstant.ContentSupplierEmp)
      this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idx].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idx].SupplCode
      });
    var obj;
    var code;
    if(this.FormInputObj["content"] == AdInsConstant.ContentSupplierEmp){
      obj = {
        Key: ev.target.selectedOptions[0].value,
        Value: ev.target.selectedOptions[0].text,
        MrSupplEmpPositionCode: this.DDLContentName[idx].MrSupplEmpPositionCode,
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idx].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idx].SupplCode,
      };
      code = this.DDLContentName[idx].SupplCode;
    }else{
      obj = {
        Key: ev.target.selectedOptions[0].value,
        Value: ev.target.selectedOptions[0].text
      };
      code = this.DDLContentName[idx].Key;
      
    }
    this.GetDDLBankAccount(this.FormObj.controls.arr["controls"][indexFormObj].controls.ContentName.value, indexFormObj);
    this.SetRule(indexFormObj, code, idx);
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idx,1);
    // console.log(this.tempDDLContentName);
    // console.log(this.DDLContentName);
    console.log(this.FormObj);
    this.PassData("ADD");
  }

  GenerateContentName(indexFormObj,idx){
    console.log(idx);
    this.FormObj.controls.arr["controls"][idx].patchValue({
      ContentName: this.DDLContentName[indexFormObj].Key,
      ContentNameValue: this.DDLContentName[indexFormObj].Value
    });
    if(this.FormInputObj["content"]==AdInsConstant.ContentSupplierEmp)
      this.FormObj.controls.arr["controls"][idx].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[indexFormObj].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[indexFormObj].SupplCode
      });
    var obj;
    var code;
    if(this.FormInputObj["content"] == AdInsConstant.ContentSupplierEmp){
      obj = {
        Key: this.DDLContentName[indexFormObj].Key,
        Value: this.DDLContentName[indexFormObj].Value,
        MrSupplEmpPositionCode: this.DDLContentName[indexFormObj].MrSupplEmpPositionCode,
        MrSupplEmpPositionCodeDesc: this.DDLContentName[indexFormObj].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[indexFormObj].SupplCode,
      };
      code = this.DDLContentName[indexFormObj].SupplCode;
    }else{
      obj = {
        Key: this.DDLContentName[indexFormObj].Key,
        Value: this.DDLContentName[indexFormObj].Value,
      };
      code = this.DDLContentName[indexFormObj].Key;
    }
    this.GetDDLBankAccount(this.FormObj.controls.arr["controls"][idx].controls.ContentName.value, idx);
    this.SetRule(idx, code, indexFormObj);
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(indexFormObj,1);
    // console.log(this.tempDDLContentName);
    // console.log(this.DDLContentName);
  }

  async GenerateExistingContentName(objExist, idx){
    // console.log(objExist);
    var idxDDLContent = this.DDLContentName.indexOf(this.DDLContentName.find(x => x.Key == objExist.CommissionRecipientRefNo));
         
    if(this.FormInputObj["content"]==AdInsConstant.ContentSupplierEmp)
      this.FormObj.controls.arr["controls"][idx].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idxDDLContent].SupplCode
      });

    this.FormObj.controls.arr["controls"][idx].patchValue({
      AppCommissionHId: objExist.AppCommissionHId,
      ContentName: this.DDLContentName[idxDDLContent].Key,
      ContentNameValue: this.DDLContentName[idxDDLContent].Value,
      BankAccountNo: objExist.BankAccNo,
      BankAccountName: objExist.BankAccName,
      BankBranch: objExist.BankBranch,
      BankCode: objExist.BankCode,
      MrIdTypeCode: objExist.MrTaxKindCode,
      MrTaxCalcMethodCode: objExist.MrTaxCalcMethodCode,
      TaxpayerNo: objExist.TaxpayerNo,
      TotalCommisionAmount: objExist.TotalCommissionAmt,
      TotalTaxAmount: objExist.TaxAmt,
      TotalVATAmount: objExist.VatAmt,
      TotalPenaltyAmount: objExist.PenaltyAmt,
      RowVersion: objExist.RowVersion
    });

    var obj;
    var code;
    if(this.FormInputObj["content"] == AdInsConstant.ContentSupplierEmp){
      obj = {
        Key: this.DDLContentName[idxDDLContent].Key,
        Value: this.DDLContentName[idxDDLContent].Value,
        MrSupplEmpPositionCode: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode,
        SupplCode: this.DDLContentName[idxDDLContent].SupplCode,
      };
      code = this.DDLContentName[idxDDLContent].SupplCode;
    }else{
      obj = {
        Key: this.DDLContentName[idxDDLContent].Key,
        Value: this.DDLContentName[idxDDLContent].Value,
      };
      code = this.DDLContentName[idxDDLContent].Key;
    }

    var tempRuleObj = this.GetTempRuleObj(code, idxDDLContent);
    // console.log(tempRuleObj);
    this.GetDDLBankAccount(this.FormObj.controls.arr["controls"][idx].controls.ContentName.value, idx);

    for(var i=0;i<objExist.AppCommissionD.length;i++){
      var idxRuleObj = tempRuleObj.indexOf(tempRuleObj.find(x => x.AllocationFrom == objExist.AppCommissionD[i].MrCommissionSourceCode));
      // console.log(tempRuleObj[idxRuleObj]);

      let behaviour: string = tempRuleObj[idxRuleObj].AllocationBehaviour;
      let maxAllocAmt: number = tempRuleObj[idxRuleObj].MaxAllocationAmount;
      if (maxAllocAmt <= 0) {
        behaviour = "LOCK";
        maxAllocAmt = 0;
      }

      let allocAmt: number = objExist.AppCommissionD[i].CommissionAmt;
      if (allocAmt <= 0)
        allocAmt = 0;

      var eachAllocationDetail = this.fb.group({
        AppCommissionDId: [objExist.AppCommissionD[i].AppCommissionDId],
        AppCommissionHId: [objExist.AppCommissionD[i].AppCommissionHId],
        AllocationFromSeq: [tempRuleObj[idxRuleObj].AllocationFromSeq],
        AllocationFrom: [objExist.AppCommissionD[i].MrCommissionSourceCode],
        AllocationFromDesc: [tempRuleObj[idxRuleObj].AllocationFromDesc],
        MaxAllocationAmount: [maxAllocAmt],
        AllocationAmount: [allocAmt, [Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.max(maxAllocAmt)]],
        AllocationBehaviour: [behaviour],
        TaxAmt: [objExist.AppCommissionD[i].TaxAmt],
        VatAmt: [objExist.AppCommissionD[i].VatAmt],
        PenaltyAmt: [objExist.AppCommissionD[i].PenaltyAmt],
        RowVersion: [objExist.AppCommissionD[i].RowVersion],
        TotalListAllocatedDivided: [Math.ceil(objExist.AppCommissionD.length / 2)]
      }) as FormGroup;
      this.FormObj.controls.arr["controls"][idx].controls.ListAllocated.push(eachAllocationDetail);
    }
    await this.SortDataAllocation(idx, code);
    
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idxDDLContent,1);
    console.log(this.DDLContentName);
    this.PassData(AdInsConstant.MessagePassData);
  }

  SortDataAllocationV2(indexFormObj, ruleObj){
    // sort
    var arrListAllocated = this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.value;
    arrListAllocated.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
    this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.patchValue(arrListAllocated);
    
    var tempRuleObj = ruleObj;
    for(var i=0;i<this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls.length;i++){
      var idxRuleObj = tempRuleObj.indexOf(tempRuleObj.find(x => x.AllocationFrom == this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationFrom.value));
      this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount.setValidators([Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.max(tempRuleObj[idxRuleObj].MaxAllocationAmount)]);
    }
    this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.updateValueAndValidity();
  }

  SortDataAllocation(indexFormObj, code){
    // sort
    var arrListAllocated = this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.value;
    arrListAllocated.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
    this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.patchValue(arrListAllocated);
    
    var tempRuleObj = this.GetTempRuleObj(code, indexFormObj);
    for(var i=0;i<this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls.length;i++){
      var idxRuleObj = tempRuleObj.indexOf(tempRuleObj.find(x => x.AllocationFrom == this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationFrom.value));
      this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount.setValidators([Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.max(tempRuleObj[idxRuleObj].MaxAllocationAmount)]);
    }
    this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.updateValueAndValidity();
  }

  GetTempRuleObj(code, idx){
    var temp;
    if (this.FormInputObj["content"] == AdInsConstant.ContentSupplier) {
      temp = this.FormInputObj["ruleObj"][code];
      // console.log("Rule Suppl");   
    } else if (this.FormInputObj["content"] == AdInsConstant.ContentSupplierEmp) {
      // console.log(idx);
      var behaviour = this.FormInputObj["contentObj"][idx].MrSupplEmpPositionCode;
      // console.log("behaviour");
      // console.log(behaviour);
      // console.log(code);
      temp = this.FormInputObj["ruleObj"][code][behaviour];
      // console.log("Rule Suppl Emp");
    } else if (this.FormInputObj["content"] == AdInsConstant.ContentReferantor) {
      temp = this.FormInputObj["ruleObj"][0];
      // console.log("Rule Referantor");
    }
    return temp;
  }

  SetRule(indexFormObj, code, idx){
    var temp =this.GetTempRuleObj(code, idx);
    var TotalCommisionAmount = 0;
    for(var i=0;i<temp.length;i++){

      let behaviour: string = temp[i].AllocationBehaviour;
      let maxAllocAmt: number = temp[i].MaxAllocationAmount;
      if (maxAllocAmt <= 0) {
        behaviour = "LOCK";
        maxAllocAmt = 0;
      }

      let allocAmt: number = temp[i].AllocationAmount;
      if (allocAmt <= 0)
        allocAmt = 0;

      var eachAllocationDetail = this.fb.group({
        AppCommissionDId: [0],
        AppCommissionHId: [0],
        AllocationFromSeq: [temp[i].AllocationFromSeq],
        AllocationFrom: [temp[i].AllocationFrom],
        AllocationFromDesc: [temp[i].AllocationFromDesc],
        MaxAllocationAmount: [maxAllocAmt],
        AllocationAmount: [allocAmt, [Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.max(maxAllocAmt)]],
        AllocationBehaviour: [behaviour],
        TaxAmt: [0],
        VatAmt: [0],
        PenaltyAmt: [0],
        RowVersion: [''],
        TotalListAllocatedDivided: [Math.ceil(temp.length / 2)]
      }) as FormGroup;
      TotalCommisionAmount += temp[i].AllocationAmount;
      this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.push(eachAllocationDetail);

    }
    this.SortDataAllocationV2(indexFormObj, temp);
    
    // patch total
    this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
      TotalCommisionAmount: TotalCommisionAmount,
    });
    // console.log(this.FormObj);
  }

  ChangeDataLabel(indexFormObj){
    // console.log(indexFormObj);
    this.FormInputObj["isCalculated"] = false; 
    var len = this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls.length;
    var tempTotal = 0;
    for(var i = 0; i < len; i++){
      var t: number = +this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount.value;
      tempTotal += t;
    }
    this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
      TotalCommisionAmount: tempTotal
    });
    this.PassData(AdInsConstant.MessagePassData);
  }

  ChangeBankAcc(ev, i){
    if(ev.target.selectedIndex == 0) return;
    // console.log(ev);
    var idxDDL = ev.target.selectedIndex - 1;
    var ddlObj = this.FormObj.controls.arr["controls"][i].controls.DropDownList.value[idxDDL];
    // console.log(ddlObj);
    
    this.FormObj.controls.arr["controls"][i].patchValue({
      BankAccountNo: ddlObj.Key,
      BankAccountName: ddlObj.Value,
      BankBranch: ddlObj.BankBranch,
      BankCode: ddlObj.BankCode
    });
    
    this.PassData(AdInsConstant.MessagePassData);
  }
}
