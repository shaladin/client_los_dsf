import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCommissionHObj } from 'app/shared/model/AppCommissionHObj.Model';
import { FormAddDynamicComponent } from './form-add-dynamic/form-add-dynamic.component';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { AppCommissionDObj } from 'app/shared/model/AppCommissionDObj.Model';
import { AppAssetDetailObj } from 'app/shared/model/AppAsset/AppAssetDetailObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { AppFeeObj } from 'app/shared/model/AppFeeObj.Model';
import { RuleCommissionObj } from 'app/shared/model/RuleCommission/RuleCommissionObj.Model';
import { NapAppReferantorModel } from 'app/shared/model/NapAppReferantor.Model';
import { ResultRefundObj } from 'app/shared/model/AppFinData/ResultRefund.Model';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: []
})
export class CommissionComponent implements OnInit {

  @ViewChild('Form1') FormAdd1: FormAddDynamicComponent;
  @ViewChild('Form2') FormAdd2: FormAddDynamicComponent;
  @ViewChild('Form3') FormAdd3: FormAddDynamicComponent;
  @Input() AppId;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
  ) {
    // this.route.queryParams.subscribe(params => {
    //   this.AppId = params["AppId"];
    // });
  }

  viewIncomeInfoObj;
  tempViewIncomeInfoObj;
  FormGetObj: any = {};
  FormInputObjSupplier: any = {};
  FormInputObjSupplierEmpl: any = {};
  FormInputObjReferantor: any = {};
  DictSupplierCode: any = {};
  OnForm1;
  OnForm2;
  OnForm3;
  Summary;
  isAutoGenerate: boolean = true;
  async ngOnInit() {
    this.OnForm1 = false;
    this.OnForm2 = false;
    this.OnForm3 = false;
    this.isFinishGetAppReferantorData = false;
    this.isFinishGetAppFeeData = false;
    this.isFinishGetAppData = false;
    this.isAutoGenerate = true;

    this.viewIncomeInfoObj = {
      UppingRate: 0,
      InsuranceIncome: 0,
      LifeInsuranceIncome: 0,
      MaxAllocatedAmount: 0,
      RemainingAllocatedAmount: 0,
      InterestIncome: 0,
      ReservedFundAllocatedAmount: 0,
      ExpenseAmount: 0,
      Other: []
    };

    this.Summary = {
      TotalCommisionAmount: 0,
      TotalTaxAmmount: 0,
      TotalVATAmount: 0,
      GrossYield: 0
    }

    await this.GetAppData();
    this.GetAppFeeData();
    this.GetContentName(AdInsConstant.ContentSupplier);
    this.GetContentName(AdInsConstant.ContentReferantor);
  }

  GetInfoCommission() {
    var objApi = {
      AppId: this.AppId,
      RowVersion: "",
    };
    this.http.post(AdInsConstant.GetAppCommissionDataForEditByAppId, objApi).subscribe(
      (response) => {
        console.log("response edit comm");
        console.log(response);
        var tempObj: Array<AppCommissionHObj> = response[AdInsConstant.ReturnObj];
        if (tempObj.length > 0) {
          // console.log("edit data");
          this.isAutoGenerate = false;
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplier);
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(AdInsConstant.ContentReferantor);

          setTimeout(() => {
            // console.log("TimeOut");
            var FormAdd1Idx = 0;
            var FormAdd2Idx = 0;
            var FormAdd3Idx = 0;
            var totalExpenseAmt = 0;
            for (var i = 0; i < tempObj.length; i++) {
              var obj = tempObj[i];
              console.log(obj);
              totalExpenseAmt += obj.TotalExpenseAmt;
              if (obj.MrCommissionRecipientTypeCode == AdInsConstant.CommissionReceipientTypeCodeSupplier) {
                this.FormAdd1.AddNewDataForm();
                this.FormAdd1.GenerateExistingContentName(obj, FormAdd1Idx);
                this.FormInputObjSupplier["isDataInputed"] = true;
                FormAdd1Idx++;
              } else if (obj.MrCommissionRecipientTypeCode == AdInsConstant.CommissionReceipientTypeCodeSupplierEmp) {
                this.FormAdd2.AddNewDataForm();
                this.FormAdd2.GenerateExistingContentName(obj, FormAdd2Idx);
                this.FormInputObjSupplierEmpl["isDataInputed"] = true;
                FormAdd2Idx++;
              } else if (obj.MrCommissionRecipientTypeCode == AdInsConstant.CommissionReceipientTypeCodeReferantor) {
                this.FormAdd3.AddNewDataForm();
                this.FormAdd3.GenerateExistingContentName(obj, FormAdd3Idx);
                this.FormInputObjReferantor["isDataInputed"] = true;
                FormAdd3Idx++;
              }
            }
            this.viewIncomeInfoObj.ExpenseAmount = totalExpenseAmt;
            this.viewIncomeInfoObj.RemainingAllocatedAmount = this.viewIncomeInfoObj.MaxAllocatedAmount - this.viewIncomeInfoObj.ExpenseAmount - this.viewIncomeInfoObj.ReservedFundAllocatedAmount;
            // console.log(this.viewIncomeInfoObj);
          }, 1000);

        } else {
          // console.log("new data");
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplier);
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(AdInsConstant.ContentReferantor);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isFinishGetAppReferantorData;
  isFinishGetAppFeeData;
  isFinishGetAppData;
  ResultAppData: AppObj;
  async GetAppData() {
    var obj = {
      // AppId: this.AppId,
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post<AppObj>(AdInsConstant.GetAppById, obj).toPromise().then(
      (response) => {
        // console.log(response);
        this.ResultAppData = response;
        this.isFinishGetAppData = true;
        // console.log("Result app data");
        // console.log(this.ResultAppData);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ListResultRefundIncomeInfo: Array<ResultRefundObj>;
  TotalHalfListResultRefundIncomeInfo: number = 0;
  GetIncomeInfoObj() {
    var app = new AppObj();
    app = this.ResultAppData;
    var obj = {
      AppId: this.AppId,
      LobCode: this.ResultAppData.LobCode,
      AdminFee: this.AdminFee,
      ProvisionFee: this.ProvisionFee,
      UppingAdminFee: this.UppingAdminFee,
      UppingProvisionFee: this.UppingProvisionFee,
      appObj: app
    };
    this.http.post<AppFinDataObj>(AdInsConstant.GetAppFinDataWithRuleByAppId, obj).subscribe(
      (response) => {
        console.log(response);
        this.ListResultRefundIncomeInfo = response.ResultRefundRsvFundObjs;
        this.TotalHalfListResultRefundIncomeInfo=Math.floor(this.ListResultRefundIncomeInfo.length / 2);
        console.log(this.ListResultRefundIncomeInfo);
        this.viewIncomeInfoObj.UppingRate = response.DiffRateAmt,
        this.viewIncomeInfoObj.InsuranceIncome = response.TotalInsCustAmt - response.TotalInsInscoAmt,
        this.viewIncomeInfoObj.LifeInsuranceIncome = response.TotalLifeInsCustAmt - response.TotalLifeInsInscoAmt,
        this.viewIncomeInfoObj.MaxAllocatedAmount = response.MaxAllocatedRefundAmt,
        this.viewIncomeInfoObj.ReservedFundAllocatedAmount = response.ReservedFundAllocatedAmt,
        this.viewIncomeInfoObj.RemainingAllocatedAmount = response.MaxAllocatedRefundAmt - response.ExpenseAmount - response.ReservedFundAllocatedAmt,
        this.viewIncomeInfoObj.InterestIncome = response.TotalInterestAmt;
        this.viewIncomeInfoObj.ExpenseAmount = response.ExpenseAmount;
        this.GetRuleDataForForm();
        // this.GetAppFeeData();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  AdminFee;
  ProvisionFee;
  UppingAdminFee;
  UppingProvisionFee;
  GetAppFeeData() {
    var obj = {
      // AppId: this.AppId,
      AppId: this.AppId,
      RowVersion: ""
    };
    this.http.post(AdInsConstant.GetListAppFeeByAppId, obj).subscribe(
      (response) => {
        console.log("response app fee data");
        console.log(response);
        var listData: Array<AppFeeObj> = response[AdInsConstant.ReturnObj];
        for (var i = 0; i < listData.length; i++) {
          var otherObj = {
            FeeTypeName: listData[i].FeeTypeName,
            AppFeeAmt: listData[i].AppFeeAmt,
          };
          this.viewIncomeInfoObj.Other.push(otherObj);
          if (listData[i].MrFeeTypeCode == AdInsConstant.MrFeeTypeCodeAdmin) {
            this.AdminFee = listData[i].AppFeeAmt;
            this.UppingAdminFee = listData[i].SellFeeAmt - listData[i].AppFeeAmt;
            // console.log("admin fee");
            // console.log(this.AdminFee);
            // console.log(this.UppingProvisionFee);
          } else if (listData[i].MrFeeTypeCode == AdInsConstant.MrFeeTypeCodeProvision) {
            this.ProvisionFee = listData[i].AppFeeAmt;
            this.UppingProvisionFee = listData[i].SellFeeAmt - listData[i].AppFeeAmt;
            // console.log("provision fee");
            // console.log(this.ProvisionFee);
            // console.log(this.UppingProvisionFee);
          }
        }
        this.isFinishGetAppFeeData = true;
        this.GetIncomeInfoObj();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // GetRuleSetName() {
  //   if (this.isFinishGetAppReferantorData && this.isFinishGetAppFeeData && this.isFinishGetAppData) {
  //     var url = AdInsConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode;
  //     var obj = {
  //       ProdOfferingCode: this.ResultAppData.ProdOfferingCode,
  //       RefProdCompntCode: "COMMISSION_SCHM",
  //       ProdOfferingVersion: this.ResultAppData.ProdOfferingVersion
  //     }
  //     this.http.post(url, obj).subscribe(
  //       (response) => {
  //         console.log("Response Prod Offering D");
  //         console.log(response);
  //         this.GetIncomeInfoObj();
  //         this.GetRuleDataForForm(response["CompntValue"]);
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  //   }
  // }

  GetRuleDataForForm() {
    var obj = { AppId: this.AppId };
    this.http.post(AdInsConstant.GetAppCommissionRule, obj).subscribe(
      (response) => {
        console.log("Cek Rule");
        console.log(response);
        // console.log(response["length"]);

        if (response["length"] != 0) {
          for (var i = 0; i < response["length"]; i++) {
            var temp: RuleCommissionObj = response[i][AdInsConstant.ReturnObj].RuleDataObjects;
            // console.log(temp);
            if(this.ContentObjSupplier.length > 0){
              this.SaveRuleData(temp["ResultSupplier"], AdInsConstant.ContentSupplier, this.ContentObjSupplier[i].Key);
              this.SaveRuleData(temp["ResultSupplierEmp"], AdInsConstant.ContentSupplierEmp, this.ContentObjSupplier[i].Key);
            }
          }
          if (response[0][AdInsConstant.ReturnObj].RuleDataObjects["ResultReferantor"] != null)
            this.SaveRuleData(response[0][AdInsConstant.ReturnObj].RuleDataObjects["ResultReferantor"], AdInsConstant.ContentReferantor, "");  
        }
        this.GetInfoCommission();

      },
      (error) => {
        console.log(error);
      }
    );
  }

  isAllocationFromDesc: any = {};
  RuleSupplierData: any = {};
  RuleSupplierEmpData: any = {};
  RuleReferantorData = new Array();
  private async SaveRuleData(obj, dataTo, content) {
    // console.log(dataTo);
    // console.log(obj);
    var len = obj.AllocationFrom.length;
    var tempObj;
    var tempJobPosition = "";
    var listTempObj = new Array();
    var tempSuppEmpData: any = {};
    if (dataTo == AdInsConstant.ContentSupplier) {
      for (var i = 0; i < len; i++) {
        tempObj = {
          AllocationFrom: obj.AllocationFrom[i],
          AllocationFromDesc: obj.AllocationFromDesc[obj.AllocationFrom[i]],
          AllocationFromSeq: obj.AllocationFromSeq[obj.AllocationFrom[i]],
          MaxAllocationAmount: obj.MaxAllocationAmount[i],
          AllocationAmount: obj.AllocationAmount[i],
          AllocationBehaviour: obj.AllocationBehaviour[i]
        };
        listTempObj.push(tempObj);
        this.RuleSupplierData[content] = listTempObj;
      }
    } else if (dataTo == AdInsConstant.ContentSupplierEmp) {
      for (var i = 0; i < len; i++) {
        if (tempJobPosition != obj.JobPositionCode[i]) {
          listTempObj = new Array();
          tempJobPosition = obj.JobPositionCode[i];
        }
        tempObj = {
          AllocationFrom: obj.AllocationFrom[i],
          AllocationFromDesc: obj.AllocationFromDesc[obj.AllocationFrom[i]],
          AllocationFromSeq: obj.AllocationFromSeq[obj.AllocationFrom[i]],
          MaxAllocationAmount: obj.MaxAllocationAmount[i],
          AllocationAmount: obj.AllocationAmount[i],
          AllocationBehaviour: obj.AllocationBehaviour[i]
        };
        listTempObj.push(tempObj);
        tempSuppEmpData[obj.JobPositionCode[i]] = listTempObj;
        this.RuleSupplierEmpData[content] = tempSuppEmpData;
      }
    } else if (dataTo == AdInsConstant.ContentReferantor) {
      for (var i = 0; i < len; i++) {
        tempObj = {
          AllocationFrom: obj.AllocationFrom[i],
          AllocationFromDesc: obj.AllocationFromDesc[obj.AllocationFrom[i]],
          AllocationFromSeq: obj.AllocationFromSeq[obj.AllocationFrom[i]],
          MaxAllocationAmount: obj.MaxAllocationAmount[i],
          AllocationAmount: obj.AllocationAmount[i],
          AllocationBehaviour: obj.AllocationBehaviour[i]
        };
        listTempObj.push(tempObj);
      }
      this.RuleReferantorData.push(listTempObj);
    }

  }

  ContentObjSupplier = new Array();
  ContentObjSupplierEmp = new Array();
  ContentObjReferantor = new Array();
  ResultAppReferantor;
  GetContentName(content) {
    var obj;
    if (content == AdInsConstant.ContentSupplier) {
      obj = {
        AppId: this.AppId,
        RowVersion: ""
      };
      // console.log("response list appAsset & appAssetSupplEmp");
      this.http.post<AppAssetDetailObj>(AdInsConstant.GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppId, obj).subscribe(
        (response) => {
          // console.log(response);
          if (response.ListAppAssetObj.length != 0) {
            this.GetDDLContent(response.ListAppAssetObj, AdInsConstant.ContentSupplier);
            this.GetDDLContent(response.ListAppAssetSupplEmpObj, AdInsConstant.ContentSupplierEmp);
          }
          // this.GetContentName(AdInsConstant.ContentSupplierEmp);
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (content == AdInsConstant.ContentSupplierEmp) {
      // obj = {
      //   AppAssetId: this.AppAssetIdList,
      //   RowVersion: ""
      // };
      // this.http.post(AdInsConstant.GetListAppAssetSupplEmpByListAppAssetId, obj).subscribe(
      //   (response) => {
      //     // console.log(response);
      //     this.GetDDLContent(response[AdInsConstant.ReturnObj], AdInsConstant.ContentSupplierEmp);
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
    } else if (content == AdInsConstant.ContentReferantor) {
      obj = {
        AppId: this.AppId,
        RowVersion: ""
      };
      this.http.post<NapAppReferantorModel>(AdInsConstant.GetAppReferantorByAppId, obj).subscribe(
        (response) => {
          // console.log(response);
          this.ResultAppReferantor = response;
          this.isFinishGetAppReferantorData = true;
          // console.log("Result app ref");
          // console.log(this.ResultAppReferantor);
          this.GetDDLContent(response, AdInsConstant.ContentReferantor);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  AppAssetIdList = new Array();
  GetDDLContent(ReturnObject, content: string) {
    // console.log(ReturnObject);
    if (content == AdInsConstant.ContentReferantor) {
      if(ReturnObject.AppId==null) return;
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
        if (content == AdInsConstant.ContentSupplier) {
          KVPObj = {
            Key: ReturnObject[i].SupplCode,
            Value: ReturnObject[i].SupplName
          };
          // console.log(this.DictSupplierCode);
          // console.log(this.DictSupplierCode[ReturnObject[i].SupplCode]);
          this.DictSupplierCode[ReturnObject[i].SupplCode] = ReturnObject[i].SupplName;
          this.ContentObjSupplier.push(KVPObj);
          this.AppAssetIdList.push(ReturnObject[i].AppAssetId);
        } else if (content == AdInsConstant.ContentSupplierEmp) {
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

  GetFormAddDynamicObj(content) {
    if (content == AdInsConstant.ContentSupplier) {
      this.FormInputObjSupplier["title"] = AdInsConstant.TitleSupplier;
      this.FormInputObjSupplier["content"] = AdInsConstant.ContentSupplier;
      this.FormInputObjSupplier["labelName"] = AdInsConstant.LabelSupplier;
      this.FormInputObjSupplier["AppId"] = this.AppId;
      this.FormInputObjSupplier["contentObj"] = this.ContentObjSupplier;
      this.FormInputObjSupplier["ruleObj"] = this.RuleSupplierData;
      this.FormInputObjSupplier["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplier["isCalculated"] = false;
      this.FormInputObjSupplier["isDataInputed"] = false;
      this.OnForm1 = true;
      console.log(this.FormInputObjSupplier);
    } else if (content == AdInsConstant.ContentSupplierEmp) {
      this.FormInputObjSupplierEmpl["title"] = AdInsConstant.TitleSupplierEmp;
      this.FormInputObjSupplierEmpl["content"] = AdInsConstant.ContentSupplierEmp;
      this.FormInputObjSupplierEmpl["labelName"] = AdInsConstant.LabelSupplierEmp;
      this.FormInputObjSupplierEmpl["AppId"] = this.AppId;
      this.FormInputObjSupplierEmpl["contentObj"] = this.ContentObjSupplierEmp;
      this.FormInputObjSupplierEmpl["ruleObj"] = this.RuleSupplierEmpData;
      this.FormInputObjSupplierEmpl["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplierEmpl["isCalculated"] = false;
      this.FormInputObjSupplierEmpl["isDataInputed"] = false;
      this.FormInputObjSupplierEmpl["dictSuppl"] = this.DictSupplierCode;
      this.OnForm2 = true;
      console.log(this.FormInputObjSupplierEmpl);
    } else if (content == AdInsConstant.ContentReferantor) {
      this.FormInputObjReferantor["title"] = AdInsConstant.TitleReferantor;
      this.FormInputObjReferantor["content"] = AdInsConstant.ContentReferantor;
      this.FormInputObjReferantor["labelName"] = AdInsConstant.LabelReferantor;
      this.FormInputObjReferantor["AppId"] = this.AppId;
      this.FormInputObjReferantor["contentObj"] = this.ContentObjReferantor;
      this.FormInputObjReferantor["ruleObj"] = this.RuleReferantorData;
      this.FormInputObjReferantor["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjReferantor["isCalculated"] = false;
      this.FormInputObjReferantor["isDataInputed"] = false;
      this.OnForm3 = true;
      console.log(this.FormInputObjReferantor);
    }
  }

  GetData(ev, data) {
    // console.log(ev);
    this.FormGetObj[data] = ev.formObj;
    // console.log(this.FormGetObj);
    if (ev.message == AdInsConstant.MessageCalculate) {
      if (this.FormGetObj[AdInsConstant.ContentSupplier] && data == AdInsConstant.ContentSupplier) {
        this.CalculateEachData(this.FormGetObj[AdInsConstant.ContentSupplier]);
        this.isCalcSuppl = true;
      }
      if (this.FormGetObj[AdInsConstant.ContentSupplierEmp] && data == AdInsConstant.ContentSupplierEmp) {
        this.CalculateEachData(this.FormGetObj[AdInsConstant.ContentSupplierEmp]);
        this.isCalcSupplEmp = true;
      }
      if (this.FormGetObj[AdInsConstant.ContentReferantor] && data == AdInsConstant.ContentReferantor) {
        this.CalculateEachData(this.FormGetObj[AdInsConstant.ContentReferantor]);
        this.isCalcReferantor = true;
      }
      
      if (this.isCalcSuppl && this.isCalcSupplEmp && this.isCalcReferantor) {  
        this.CalculateGrossYield(this.viewIncomeInfoObj.ExpenseAmount);
      }
    }
  }

  CalculateGrossYield(expenseAmt: number) {
    console.log("Calc GrossYield");
    var obj = {
      AppId: this.AppId,
      TotalExpenseAmt: expenseAmt
    };
    console.log(obj);
    this.http.post(AdInsConstant.CalCulateGrossYield, obj).subscribe(
      (response) => {
        console.log(response);
        this.Summary.GrossYield = response["GrossYield"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isCalcTotal: boolean = false;
  isCalcSuppl: boolean = true;
  isCalcSupplEmp: boolean = true;
  isCalcReferantor: boolean = true;
  CalculateTotal() {
    this.isCalcTotal = true;
    this.Summary = {
      TotalCommisionAmount: 0,
      TotalTaxAmmount: 0,
      TotalVATAmount: 0,
      GrossYield: 0
    };
    this.viewIncomeInfoObj.ExpenseAmount = 0;
    if (this.FormGetObj[AdInsConstant.ContentSupplier] != undefined && this.FormGetObj[AdInsConstant.ContentSupplier].value.arr.length != 0) {
      this.isCalcSuppl = false;
      this.FormAdd1.CalculateTax(this.ResultAppData.CurrCode, this.ResultAppData.AppNo, this.ResultAppData.OriOfficeCode, this.AppId);
    }else{
      this.FormInputObjSupplier["isCalculated"] = true;
    }
    if (this.FormGetObj[AdInsConstant.ContentSupplierEmp] != undefined && this.FormGetObj[AdInsConstant.ContentSupplierEmp].value.arr.length != 0) {
      this.isCalcSupplEmp = false;
      this.FormAdd2.CalculateTax(this.ResultAppData.CurrCode, this.ResultAppData.AppNo, this.ResultAppData.OriOfficeCode, this.AppId);
    }else{
      this.FormInputObjSupplierEmpl["isCalculated"] = true;
    }
    if (this.FormGetObj[AdInsConstant.ContentReferantor] != undefined && this.FormGetObj[AdInsConstant.ContentReferantor].value.arr.length != 0) {
      this.isCalcReferantor = false;
      this.FormAdd3.CalculateTax(this.ResultAppData.CurrCode, this.ResultAppData.AppNo, this.ResultAppData.OriOfficeCode, this.AppId);
    }else{
      this.FormInputObjReferantor["isCalculated"] = true;
    }   

    if (this.isCalcSuppl && this.isCalcSupplEmp && this.isCalcReferantor) {  
      this.CalculateGrossYield(this.viewIncomeInfoObj.ExpenseAmount);
    }
  }

  CalculateEachData(FormObj) {
    // console.log(FormObj);
    var arr = FormObj.get('arr') as FormArray;
    var len = arr["controls"].length;
    var tempTotalCommisionAmount = 0;
    var tempTotalTaxAmmount = 0;
    var tempTotalVATAmount = 0;
    var tempTotalExpenseAmount = 0;
    for (var i = 0; i < len; i++) {
      var temp = arr["controls"][i].value;
      tempTotalCommisionAmount += temp.TotalCommisionAmount;
      tempTotalTaxAmmount += temp.TotalTaxAmount;
      tempTotalVATAmount += temp.TotalVATAmount;
      tempTotalExpenseAmount += temp.TotalExpenseAmount;
    }
    this.Summary.TotalCommisionAmount += tempTotalCommisionAmount;
    this.Summary.TotalTaxAmmount += tempTotalTaxAmmount;
    this.Summary.TotalVATAmount += tempTotalVATAmount;
    // this.Summary.GrossYield = arr["controls"][0].value.GrossYield;
    this.viewIncomeInfoObj.ExpenseAmount += tempTotalExpenseAmount;
    // console.log(tempTotalExpenseAmount);
    // console.log(this.viewIncomeInfoObj);
    this.viewIncomeInfoObj.RemainingAllocatedAmount = this.viewIncomeInfoObj.MaxAllocatedAmount - this.viewIncomeInfoObj.ExpenseAmount - this.viewIncomeInfoObj.ReservedFundAllocatedAmount;
      
  }

  listAppCommissionHObj;
  private DataFilterAppCommH(FormObj, CommReceipientTypeCode) {
    // console.log(FormObj);
    var arr = FormObj.get('arr') as FormArray;
    var len = arr["controls"].length;
    // console.log(arr);
    // console.log(len);
    for (var i = 0; i < len; i++) {
      var tempAppCommHObj = new AppCommissionHObj();
      var temp = arr["controls"][i].value;
      // console.log("Data at " + i);
      // console.log(temp);
      if (temp.ContentName == "") continue;
      tempAppCommHObj = this.PatchTempDataValue(temp, CommReceipientTypeCode);

      // console.log(tempAppCommHObj);
      this.listAppCommissionHObj.push(tempAppCommHObj);
    }
  }

  private PatchTempDataValue(obj, CommReceipientTypeCode) {
    var temp = new AppCommissionHObj();
    if (obj.AppCommissionHId != 0) temp.AppCommissionHId = obj.AppCommissionHId;
    temp.AppId = this.AppId;
    temp.BankAccNo = obj.BankAccountNo;
    temp.BankAccName = obj.BankAccountName;
    temp.BankCode = obj.BankCode;
    temp.BankName = obj.BankName;
    temp.BankBranch = obj.BankBranch;
    temp.TaxAmt = obj.TotalTaxAmount;
    temp.VatAmt = obj.TotalVATAmount;
    temp.PenaltyAmt = obj.TotalPenaltyAmount;
    temp.TotalCommissionAfterTaxAmt = obj.TotalCommisionAmount - (obj.TotalTaxAmount + obj.TotalVATAmount);
    temp.TotalCommissionAmt = obj.TotalCommisionAmount;
    temp.TotalExpenseAmt = obj.TotalExpenseAmount;
    temp.TotalDisburseAmt = obj.TotalDisburseAmount;
    temp.MrCommissionRecipientTypeCode = CommReceipientTypeCode;
    temp.CommissionRecipientRefNo = obj.ContentName;
    temp.MrTaxKindCode = obj.MrIdTypeCode;
    temp.MrTaxCalcMethodCode = obj.MrTaxCalcMethodCode;
    temp.TaxpayerNo = obj.TaxpayerNo;
    temp.RowVersion = obj.RowVersion;
    if (CommReceipientTypeCode == AdInsConstant.CommissionReceipientTypeCodeSupplierEmp) {
      temp.ReservedField1 = obj.SupplCode;
      temp.ReservedField2 = obj.MrSupplEmpPositionCodeDesc;
    }
    temp.ListappCommissionDObj = this.DataFilterAppCommD(obj);
    return temp;
  }

  private DataFilterAppCommD(obj) {
    // console.log(obj);
    var listAppCommissionDObj = new Array();
    var temp = obj.ListAllocated;
    for (var i = 0; i < temp.length; i++) {
      var tempObj = temp[i];
      var tempAppCommissionDObj = new AppCommissionDObj();
      if (tempObj.AppCommissionDId != 0) {
        tempAppCommissionDObj.AppCommissionHId = tempObj.AppCommissionHId;
        tempAppCommissionDObj.AppCommissionDId = tempObj.AppCommissionDId;
      }
      tempAppCommissionDObj.MrCommissionSourceCode = tempObj.AllocationFrom;
      tempAppCommissionDObj.CommissionAmt = tempObj.AllocationAmount;
      tempAppCommissionDObj.TaxAmt = tempObj.TaxAmt;
      tempAppCommissionDObj.VatAmt = tempObj.VatAmt;
      tempAppCommissionDObj.PenaltyAmt = tempObj.PenaltyAmt;
      tempAppCommissionDObj.CommissionAmtAfterTax = tempObj.AllocationAmount - (tempObj.TaxAmt + tempObj.VatAmt);
      tempAppCommissionDObj.RowVersion = tempObj.RowVersion;
      listAppCommissionDObj.push(tempAppCommissionDObj);
    }
    return listAppCommissionDObj;
  }

  isCalculated;
  SaveData() {
    // console.log(this.FormInputObjSupplier["isCalculated"]);
    // console.log(this.FormInputObjSupplierEmpl["isCalculated"]);
    // console.log(this.FormInputObjReferantor["isCalculated"]);
    // console.log(this.FormInputObjSupplier["isDataInputed"]);
    // console.log(this.FormInputObjSupplierEmpl["isDataInputed"]);
    // console.log(this.FormInputObjReferantor["isDataInputed"]);
    // console.log(this.isCalcTotal);
    if ((!this.FormInputObjSupplier["isCalculated"] && this.FormInputObjSupplier["isDataInputed"]) || (!this.FormInputObjSupplierEmpl["isCalculated"] && this.FormInputObjSupplierEmpl["isDataInputed"]) || (!this.FormInputObjReferantor["isCalculated"] && this.FormInputObjReferantor["isDataInputed"]) || !this.isCalcTotal) {
      this.toastr.warningMessage("Must Calculate First");
      return;
    }
    if (this.Summary.TotalCommisionAmount > this.viewIncomeInfoObj.MaxAllocatedAmount) {
      this.toastr.warningMessage("Total Commision Amount cannot more than Max Allocated Amount");
      return;
    }
    this.listAppCommissionHObj = new Array();
    if (this.FormGetObj != null) {
      if (this.FormGetObj[AdInsConstant.ContentSupplier] && this.FormGetObj[AdInsConstant.ContentSupplier].value.arr.length > 0) {
        this.DataFilterAppCommH(this.FormGetObj[AdInsConstant.ContentSupplier], AdInsConstant.CommissionReceipientTypeCodeSupplier);
      }
      if (this.FormGetObj[AdInsConstant.ContentSupplierEmp] && this.FormGetObj[AdInsConstant.ContentSupplierEmp].value.arr.length > 0) {
        this.DataFilterAppCommH(this.FormGetObj[AdInsConstant.ContentSupplierEmp], AdInsConstant.CommissionReceipientTypeCodeSupplierEmp);
      }
      if (this.FormGetObj[AdInsConstant.ContentReferantor] && this.FormGetObj[AdInsConstant.ContentReferantor].value.arr.length > 0) {
        this.DataFilterAppCommH(this.FormGetObj[AdInsConstant.ContentReferantor], AdInsConstant.CommissionReceipientTypeCodeReferantor);
      }

      // console.log(this.listAppCommissionHObj);
      var obj = {
        AppId: this.AppId,
        GrossYield: this.Summary.GrossYield,
        ListAppCommissionHObj: this.listAppCommissionHObj,
        RowVersion: ""
      };
      console.log(obj);
      this.http.post(AdInsConstant.AddOrEditAppCommissionData, obj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputTab.emit();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  
  Cancel(){
    this.outputCancel.emit();
  }
}
