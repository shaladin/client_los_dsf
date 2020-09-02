import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { SalesInfoObj } from 'app/shared/model/SalesInfoObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustFctrObj } from 'app/shared/model/MouCustFctrObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-application-data-factoring',
  templateUrl: './application-data-factoring.component.html'
})
export class ApplicationDataFactoringComponent implements OnInit {
  @Input() AppId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  mode: string;
  salesAppInfoObj: SalesInfoObj = new SalesInfoObj();
  mouCustFctrObj: MouCustFctrObj = new MouCustFctrObj();

  inputPagingObj;
  inputLookupObj;
  arrAddCrit;
  employeeIdentifier;
  salesRecommendationItems = [];
  isInputLookupObj;

  SalesAppInfoForm = this.fb.group({
    MouCustId: ['', Validators.required],
    TopBased: ['', Validators.required],
    MrSalesRecommendCode: ['', Validators.required],
    SalesNotes: [''],
    SalesOfficerNo: ['', Validators.required],
    SalesHeadNo: [''],
    SalesHeadName: [''],
    SalesOfficerName: [''],
    MrInstTypeCode: ['', Validators.required],
    TopDays: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    Tenor: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    NumOfInst: ['', Validators.required],
    MrInstSchemeCode: ['', Validators.required],
    IsDisclosed: [false, Validators.required],
    PaidBy: ['', Validators.required],
    RecourseType: ['', Validators.required],
    MrAppSourceCode: ['', Validators.required],
    MrWopCode: ['', Validators.required],
    PayFreqCode: ['', Validators.required],
    MrSingleInstCalcMthdCode: ['', Validators.required],
    InterestType: ['', Validators.required]
  })

  refMasterInterestType: RefMasterObj = new RefMasterObj();
  refMasterInsScheme: RefMasterObj = new RefMasterObj();
  refMasterInsType: RefMasterObj = new RefMasterObj();
  refMasterRecommendation: RefMasterObj = new RefMasterObj();
  refMasterWOP: RefMasterObj = new RefMasterObj();
  refMasterAppSource: RefMasterObj = new RefMasterObj();
  refMasterCalcMethod: RefMasterObj = new RefMasterObj();
  refMasterAppPaidBy: RefMasterObj = new RefMasterObj();
  refMasterRecourseType: RefMasterObj = new RefMasterObj();
  refMasterIntrstType: RefMasterObj = new RefMasterObj();
  refMasterTOPType: RefMasterObj = new RefMasterObj();
  allInterestType: any;
  allInScheme: any;
  allInType: any;
  allSlsRecom: any;
  allWOP: any;
  allAppSource: any;
  allPaidby: any;
  allRecourseType: any;
  allCalcMethod: any;
  allIntrstType: any;
  allMouCust: any;
  allTopBased: any;
  resultData: any;
  allPayFreq: any;
  allInSalesOffice: any;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
  }

  ngOnInit() {
    console.log("APP DATA FCTRING")
    this.isInputLookupObj = false;
    this.loadData();
    this.SalesAppInfoForm.controls.NumOfInst.disable();
    this.SalesAppInfoForm.controls.MrSingleInstCalcMthdCode.disable();
  }

  setDropdown() {
    this.refMasterInterestType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInterestTypeFactoring;
    this.refMasterInsScheme.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInstSchm;
    this.refMasterInsScheme.ReserveField1 = CommonConstant.FCTR;
    this.refMasterInsType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInstType;
    this.refMasterRecommendation.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeSlsRecom;
    this.refMasterWOP.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeWOP;
    this.refMasterCalcMethod.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeSingleInstCalcMethod;
    this.refMasterAppPaidBy.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAppPaidBy;
    this.refMasterRecourseType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeRecourseType;
    this.refMasterIntrstType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInterestTypeGeneral;
    this.refMasterTOPType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeTopCalcBased;

    var AppObj = {
      AppId: this.resultData.AppId,
      MouType: CommonConstant.FACTORING
    }
    this.http.post(URLConstant.GetListMouByAppIdAndMouType, AppObj).subscribe(
      (response) => {
        this.allMouCust = response;
        var MouCustId;
        if (this.mode == 'edit') {
          MouCustId = this.resultData.MouCustId
          this.SalesAppInfoForm.patchValue({
            MouCustId: MouCustId
          });
        }
        if (MouCustId == null) {
          MouCustId = this.allMouCust[0].MouCustId;
          this.SalesAppInfoForm.patchValue({
            MouCustId: MouCustId
          });
        }
        this.SetPayFreq(MouCustId);
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterIntrstType).subscribe(
      (response) => {
        this.allIntrstType = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            InterestType: this.allIntrstType[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterTOPType).subscribe(
      (response) => {
        this.allTopBased = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            TopBased: this.allTopBased[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetListActiveRefMasterWithReserveFieldAll, this.refMasterInsScheme).subscribe(
      (response) => {
        this.allInScheme = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrInstSchemeCode: this.allInScheme[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetListRefEmpByGsValueandOfficeId, null).subscribe(
      (response) => {
        this.allInSalesOffice = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            SalesOfficerNo: this.allInSalesOffice[0].EmpNo,
            SalesOfficerName: this.allInSalesOffice[0].EmpName,
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterInsType).subscribe(
      (response) => {
        this.allInType = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrInstTypeCode: this.allInType[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterRecommendation).subscribe(
      (response) => {
        this.allSlsRecom = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrSalesRecommendCode: this.allSlsRecom[0].Key
          });
        }
      })

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterWOP).subscribe(
      (response) => {
        this.allWOP = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrWopCode: this.allWOP[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetListKvpActiveRefAppSrc, null).subscribe(
      (response) => {
        this.allAppSource = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrAppSourceCode: this.allAppSource[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterCalcMethod).subscribe(
      (response) => {
        this.allCalcMethod = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrSingleInstCalcMthdCode: this.allCalcMethod[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterAppPaidBy).subscribe(
      (response) => {
        this.allPaidby = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            PaidBy: this.allPaidby[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterRecourseType).subscribe(
      (response) => {
        this.allRecourseType = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            RecourseType: this.allRecourseType[0].Key
          });
        }
      });

    this.CheckInstType();
  } 
  SetPayFreq(MouCustId: number) {
    var MouObj = {
      MouCustId: MouCustId
    }
    this.http.post<MouCustFctrObj>(URLConstant.GetMouCustFctrByMouCustId, MouObj).subscribe(
      (response) => {
        this.mouCustFctrObj = response;
        if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeMultiple) { 
          this.SalesAppInfoForm.patchValue({  
            MrInstTypeCode: this.mouCustFctrObj.MrInstTypeCode,  
            MrInstSchemeCode: this.mouCustFctrObj.MrInstSchmCode,
            IsDisclosed: this.mouCustFctrObj.IsDisclosed,
            PaidBy: this.mouCustFctrObj.MrPaidByCode,
            RecourseType: this.mouCustFctrObj.MrRecourseTypeCode , 
            MrWopCode: this.mouCustFctrObj.WopCode,  
            PayFreqCode: this.mouCustFctrObj.PayFreqCode, 
          });
        } else if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeSingle) { 
          this.SalesAppInfoForm.patchValue({  
            MrInstTypeCode: this.mouCustFctrObj.MrInstTypeCode,
            TopDays: this.mouCustFctrObj.TopDays,  
            MrInstSchemeCode: this.mouCustFctrObj.MrInstSchmCode,
            IsDisclosed: this.mouCustFctrObj.IsDisclosed,
            PaidBy: this.mouCustFctrObj.MrPaidByCode,
            RecourseType: this.mouCustFctrObj.MrRecourseTypeCode , 
            MrWopCode: this.mouCustFctrObj.WopCode, 
            MrSingleInstCalcMthdCode: this.mouCustFctrObj.SingleInstCalcMthd,
            PayFreqCode: this.mouCustFctrObj.PayFreqCode, 
            TopBased: this.allTopBased[0].Key
          });
        }

       
        this.http.post(URLConstant.GetRefPayFreqByPayFreqCode, this.mouCustFctrObj).subscribe(
          (response) => {
            this.allPayFreq = response;
            var PayFreqCode = null;
            if (this.mode == 'edit') {
              PayFreqCode = this.resultData.PayFreqCode
              this.SalesAppInfoForm.patchValue({
                PayFreqCode: PayFreqCode
              });
            }
            if (PayFreqCode == null) {
              PayFreqCode = "MONTHLY"
              this.SalesAppInfoForm.patchValue({
                PayFreqCode: PayFreqCode
              });
            }
          });
      });
    for (let i = 0; i < this.allMouCust.length; i++) {
      if(this.allMouCust[i].MouCustId == MouCustId){
        this.CheckInstType();
        this.SalesAppInfoForm.patchValue({
          MrInstTypeCode : this.allMouCust[i].MrInstTypeCode
        }) 
      }
    }
    this.SalesAppInfoForm.controls.MrInstTypeCode.disable();
    this.CheckInstType();
  }

  CalculateNumOfInst(IsFirstBind: boolean, tenor: number) {
    if(!IsFirstBind && tenor > this.mouCustFctrObj.TenorTo || tenor < this.mouCustFctrObj.TenorFrom){
        this.toastr.warningMessage("Tenor must be between " + this.mouCustFctrObj.TenorFrom + " and " + this.mouCustFctrObj.TenorTo);
        this.SalesAppInfoForm.controls.Tenor.invalid;
        return;
    }

    var numOfInst;
    if(this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeMultiple){
      numOfInst = this.SalesAppInfoForm.controls.Tenor.value / this.allPayFreq.PayFreqVal;
      this.SalesAppInfoForm.controls.NumOfInst.patchValue(numOfInst);
      this.salesAppInfoObj.NumOfInst = numOfInst;
    }else{
      this.SalesAppInfoForm.controls.NumOfInst.patchValue(1);
    }
  }

  CheckInstType() {
    if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeMultiple) {  
      this.SalesAppInfoForm.controls.TopDays.disable();
      this.SalesAppInfoForm.controls.TopBased.disable();
      this.SalesAppInfoForm.controls.MrInstSchemeCode.disable();  
      this.SalesAppInfoForm.controls.PaidBy.disable(); 
      this.SalesAppInfoForm.controls.MrWopCode.disable(); 
      this.SalesAppInfoForm.controls.RecourseType.disable();  
      this.SalesAppInfoForm.controls.IsDisclosed.disable();  
      this.SalesAppInfoForm.controls.Tenor.enable();  
      this.SalesAppInfoForm.controls.Tenor.setValue("");  
    } else if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeSingle) { 
      this.SalesAppInfoForm.controls.TopBased.enable();
      this.SalesAppInfoForm.controls.TopBased.setValidators([Validators.required]);
      this.SalesAppInfoForm.controls.TopDays.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.SalesAppInfoForm.controls.MrInstSchemeCode.disable();  
      this.SalesAppInfoForm.controls.PaidBy.disable(); 
      this.SalesAppInfoForm.controls.MrWopCode.disable(); 
      this.SalesAppInfoForm.controls.RecourseType.disable();    
      this.SalesAppInfoForm.controls.TopDays.disable();   
      this.SalesAppInfoForm.controls.IsDisclosed.disable();   
      this.SalesAppInfoForm.controls.Tenor.disable();  
      if(this.mode != "edit"){
        this.SalesAppInfoForm.controls.Tenor.setValue(1);  
      }
    }
    this.SalesAppInfoForm.updateValueAndValidity();
  }

  getLookupEmployeeResponse(ev) {
    this.SalesAppInfoForm.patchValue({
      SalesOfficerNo: ev.SalesOfficerNo,
      SalesOfficerName: ev.SalesOfficerName,
      SalesHeadNo: ev.SalesHeadNo,
      SalesHeadName: ev.SalesHeadName

    });
  }
  makeLookUpObj() {
    // Lookup obj
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.jsonSelect = this.resultData;
    //this.inputLookupObj.nameSelect = this.NapAppModelForm.controls.SalesOfficerName.value;
    this.inputLookupObj.addCritInput = this.arrAddCrit;
    this.isInputLookupObj = true;
  }

  makeNewLookupCriteria() {
    this.arrAddCrit = new Array();

    var addCrit1 = new CriteriaObj();
    addCrit1.DataType = "bit";
    addCrit1.propName = "re.IS_ACTIVE";
    addCrit1.restriction = AdInsConstant.RestrictionEq;
    addCrit1.value = "1";
    this.arrAddCrit.push(addCrit1);

    var addCrit2 = new CriteriaObj();
    addCrit2.DataType = "bit";
    addCrit2.propName = "ru.IS_ACTIVE";
    addCrit2.restriction = AdInsConstant.RestrictionEq;
    addCrit2.value = "1";
    this.arrAddCrit.push(addCrit2);

    var addCrit3 = new CriteriaObj();
    addCrit3.DataType = "text";
    addCrit3.propName = "rbt.JOB_TITLE_CODE";
    addCrit3.restriction = AdInsConstant.RestrictionIn;
    addCrit3.listValue = [CommonConstant.SALES_JOB_CODE];
    this.arrAddCrit.push(addCrit3);

    var addCrit4 = new CriteriaObj();
    addCrit4.DataType = "text";
    addCrit4.propName = "ro.OFFICE_CODE";
    addCrit4.restriction = AdInsConstant.RestrictionIn;
    addCrit4.listValue = [this.resultData.OriOfficeCode];
    this.arrAddCrit.push(addCrit4);

    //this.inputLookupObj.addCritInput = this.arrAddCrit;
    this.makeLookUpObj();
  }

  loadData() {
    var obj = {
      AppId: this.AppId
    }

    this.http.post(URLConstant.GetApplicationDataByAppId, obj).subscribe(
      (response) => {
        this.resultData = response;
        this.salesAppInfoObj.AppRowVersion = this.resultData.AppRowVersion;
        this.salesAppInfoObj.AppFinDataRowVersion = this.resultData.AppFinDataRowVersion;
        this.salesAppInfoObj.AppFctrRowVersion = this.resultData.AppFctrRowVersion;

        this.setDropdown();

        if (this.resultData.AppFinDataId == 0 && this.resultData.AppFctrId == 0) {
          this.mode = "add";
          this.SalesAppInfoForm.patchValue({
            MrSalesRecommendCode: this.resultData.MrSalesRecommendCode,
            MouCustId: this.resultData.MouCustId,
            SalesNotes: this.resultData.SalesNotes,
            SalesOfficerNo: this.resultData.SalesOfficerNo,
            SalesOfficerName: this.resultData.SalesOfficerName,
            SalesHeadName: this.resultData.SalesHeadName,
            SalesHeadNo: this.resultData.SalesHeadNo,
            MrInstTypeCode: this.resultData.MrInstTypeCode,
            TopDays: this.resultData.TopDays,
            TopBased: this.resultData.TopBased,
            Tenor: this.resultData.Tenor,
            NumOfInst: this.resultData.NumOfInst,
            IsDisclosed: this.resultData.IsDisclosed,
            PaidBy: this.resultData.PaidBy,
            RecourseType: this.resultData.RecourseType,
            MrAppSourceCode: this.resultData.MrAppSourceCode,
            MrWopCode: this.resultData.MrWopCode,
            MrSingleInstCalcMthdCode: this.resultData.MrSingleInstCalcMthdCode
          });
          this.CalculateNumOfInst(true, this.SalesAppInfoForm.controls.Tenor.value);
        } else if (this.resultData.AppFinDataId != 0 && this.resultData.AppFctrId != 0) {
          this.mode = "edit";
          this.SalesAppInfoForm.patchValue({
            MrSalesRecommendCode: this.resultData.MrSalesRecommendCode,
            MouCustId: this.resultData.MouCustId,
            SalesNotes: this.resultData.SalesNotes,
            SalesOfficerNo: this.resultData.SalesOfficerNo,
            SalesOfficerName: this.resultData.SalesOfficerName,
            SalesHeadName: this.resultData.SalesHeadName,
            SalesHeadNo: this.resultData.SalesHeadNo,
            MrInstTypeCode: this.resultData.MrInstTypeCode,
            TopDays: this.resultData.TopDays,
            TopBased: this.resultData.TopBased,
            Tenor: this.resultData.Tenor,
            NumOfInst: this.resultData.NumOfInst,
            MrInstSchemeCode: this.resultData.MrInstSchemeCode,
            IsDisclosed: this.resultData.IsDisclosed,
            PaidBy: this.resultData.PaidBy,
            RecourseType: this.resultData.RecourseType,
            MrAppSourceCode: this.resultData.MrAppSourceCode,
            MrWopCode: this.resultData.MrWopCode,
            PayFreqCode: this.resultData.PayFreqCode,
            MrSingleInstCalcMthdCode: this.resultData.MrSingleInstCalcMthdCode,
            InterestType: this.resultData.InterestType
          });
          this.CalculateNumOfInst(false, this.SalesAppInfoForm.controls.Tenor.value);
        }
        this.makeNewLookupCriteria();
      });
  }
  SaveForm(): void {
    this.salesAppInfoObj = this.SalesAppInfoForm.getRawValue();
    this.salesAppInfoObj.AppId = this.AppId;
    this.salesAppInfoObj.MouCustId = this.SalesAppInfoForm.controls.MouCustId.value;

    if (this.salesAppInfoObj.MrInstTypeCode == "SINGLE") {
      this.salesAppInfoObj.MrInstSchemeCode = "EP"; 
      this.salesAppInfoObj.Tenor = 1;
      this.salesAppInfoObj.NumOfInst = this.salesAppInfoObj.Tenor;
    } else {
      this.salesAppInfoObj.MrInstSchemeCode = this.SalesAppInfoForm.controls.MrInstSchemeCode.value;
      this.salesAppInfoObj.NumOfInst = this.SalesAppInfoForm.controls.NumOfInst.value;
    }

    if (this.mode == "add") {
      this.http.post(URLConstant.SaveApplicationData, this.salesAppInfoObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputTab.emit();
        });
    } else {
      this.salesAppInfoObj.AppRowVersion = this.resultData.AppRowVersion;
      this.salesAppInfoObj.AppFctrRowVersion = this.resultData.AppFctrRowVersion;
      this.salesAppInfoObj.AppFinDataRowVersion = this.resultData.AppFinDataRowVersion;
      this.http.post(URLConstant.EditApplicationData, this.salesAppInfoObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputTab.emit();
        });
    }

  }

}
