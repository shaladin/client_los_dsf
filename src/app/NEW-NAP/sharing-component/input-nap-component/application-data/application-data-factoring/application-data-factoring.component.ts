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
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  mode: string;
  salesAppInfoObj: SalesInfoObj = new SalesInfoObj();
  mouCustFctrObj: MouCustFctrObj = new MouCustFctrObj();

  inputPagingObj;
  inputLookupObj;
  arrAddCrit;
  employeeIdentifier;
  salesRecommendationItems = [];
  isInputLookupObj;
  inputLookupEconomicSectorObj;
  SalesAppInfoForm = this.fb.group({
    MouCustId: ['', Validators.required],
    TopBased: ['', Validators.required],
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
    InterestType: ['', Validators.required],
    CharaCredit: ['', [Validators.required, Validators.maxLength(50)]],
    PrevAgrNo: [''],
    WayRestructure: [''],
    MrSlikSecEcoCode: [''],
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
  refMasterWayOfRestructure: RefMasterObj = new RefMasterObj();
  refMasterCharacteristicCredit: RefMasterObj = new RefMasterObj();
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
  allWayRestructure: any;
  allCharacteristicCredit: any;
  responseApp: any;
  responseProd: any;
  isInit: boolean = true;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
  }

  async ngOnInit() {
    console.log("APP DATA FCTRING")
    this.isInputLookupObj = false;
    this.loadData();
    this.SalesAppInfoForm.controls.NumOfInst.disable();
    this.SalesAppInfoForm.controls.MrSingleInstCalcMthdCode.disable();
  }

  async setDropdown() {
    this.refMasterInterestType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInterestTypeFactoring;
    this.refMasterInsScheme.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInstSchm;
    this.refMasterInsScheme.ReserveField1 = CommonConstant.FCTR;
    this.refMasterInsType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInstType;
    this.refMasterRecommendation.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeSlsRecom;
    this.refMasterWOP.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeWOP;
    this.refMasterCalcMethod.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeSingleInstCalcMethod;
    this.refMasterAppPaidBy.RefMasterTypeCode = CommonConstant.RefMasterTypeCodePaidBy;
    this.refMasterRecourseType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeRecourseType;
    this.refMasterIntrstType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInterestTypeGeneral;
    this.refMasterTOPType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeTopCalcBased;
    this.refMasterCharacteristicCredit.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCharacteristicCredit
    this.refMasterWayOfRestructure.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeWayOfRestructure;
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
          if (this.responseProd.MrProdBehaviourCode == CommonConstant.ProductBehaviourDefault) {
            this.SalesAppInfoForm.patchValue({
              InterestType: this.allIntrstType[0].Key
            });
          } else {
            this.SalesAppInfoForm.controls.InterestType.disable();
            this.SalesAppInfoForm.patchValue({
              InterestType: this.responseProd.CompntValue
            });
          }
        } else {
          if (this.responseProd.MrProdBehaviourCode == CommonConstant.ProductBehaviourLock) {
            this.SalesAppInfoForm.controls.InterestType.disable();
          }
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
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterWayOfRestructure).subscribe(
      (response) => {
        this.allWayRestructure = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            WayRestructure: this.allWayRestructure[0].Key
          });
        }
      });
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterCharacteristicCredit).subscribe(
      (response) => {
        this.allCharacteristicCredit = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            CharaCredit: this.allCharacteristicCredit[0].Key
          });
        }
      });

    await this.CheckInstType();

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
            RecourseType: this.mouCustFctrObj.MrRecourseTypeCode,
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
            RecourseType: this.mouCustFctrObj.MrRecourseTypeCode,
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

            if (this.resultData.AppFinDataId == 0 && this.resultData.AppFctrId == 0 && this.isInit == true) {
              this.mode = "add";
            } else if (this.resultData.AppFinDataId != 0 && this.resultData.AppFctrId != 0 && this.isInit == true) {
              this.mode = "edit";
              this.SalesAppInfoForm.patchValue({
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
                InterestType: this.resultData.InterestType,
                CharaCredit: this.resultData.CharaCredit,
                PrevAgrNo: this.resultData.PrevAgrNo,
                WayRestructure: this.resultData.WayRestructure,
                MrSlikSecEcoCode: this.resultData.MrSlikSecEcoCode
              });
              this.CalculateNumOfInst(false, this.SalesAppInfoForm.controls.Tenor.value);
    this.CheckInstType();

            }
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
            this.isInit = false; 
            this.makeNewLookupCriteria();

          });
      });
    for (let i = 0; i < this.allMouCust.length; i++) {
      if (this.allMouCust[i].MouCustId == MouCustId) {
        this.CheckInstType();
        this.SalesAppInfoForm.patchValue({
          MrInstTypeCode: this.allMouCust[i].MrInstTypeCode
        })
      }
    }
    this.SalesAppInfoForm.controls.MrInstTypeCode.disable();


  }

  CalculateNumOfInst(IsFirstBind: boolean, tenor: number) {
    if (this.mouCustFctrObj.MouCustFctrId != 0) {
      if(this.mouCustFctrObj.MrInstTypeCode == CommonConstant.InstTypeMultiple){
        if (!IsFirstBind  && tenor > this.mouCustFctrObj.TenorTo || tenor < this.mouCustFctrObj.TenorFrom) {
          this.toastr.warningMessage("Tenor must be between " + this.mouCustFctrObj.TenorFrom + " and " + this.mouCustFctrObj.TenorTo);
          this.SalesAppInfoForm.controls.Tenor.invalid;
          return;
        }
      }
    }

    var numOfInst;
    if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeMultiple) {
      numOfInst = this.SalesAppInfoForm.controls.Tenor.value / this.allPayFreq.PayFreqVal;
      this.SalesAppInfoForm.controls.NumOfInst.patchValue(numOfInst);
      this.salesAppInfoObj.NumOfInst = numOfInst;
    } else {
      this.SalesAppInfoForm.controls.NumOfInst.patchValue(1);
    }
  }

  async CheckInstType() {
    if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeMultiple) {
      this.SalesAppInfoForm.controls.TopDays.disable();
      this.SalesAppInfoForm.controls.TopBased.disable();
      this.SalesAppInfoForm.controls.MrInstSchemeCode.disable();
      this.SalesAppInfoForm.controls.PaidBy.disable();
      this.SalesAppInfoForm.controls.MrWopCode.disable();
      this.SalesAppInfoForm.controls.RecourseType.disable();
      this.SalesAppInfoForm.controls.IsDisclosed.disable();
      this.SalesAppInfoForm.controls.Tenor.enable();
      if(this.mode != "edit"){
      this.SalesAppInfoForm.controls.Tenor.setValue("");
      }
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
      if (this.mode != "edit") {
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
  getLookupEconomicSector(ev) {
    this.SalesAppInfoForm.patchValue({
      MrSlikSecEcoCode: ev.MasterCode
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

    this.inputLookupEconomicSectorObj = new InputLookupObj();
    this.inputLookupEconomicSectorObj.urlJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";
    this.inputLookupEconomicSectorObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupEconomicSectorObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupEconomicSectorObj.pagingJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";
    this.inputLookupEconomicSectorObj.genericJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";
    this.inputLookupEconomicSectorObj.nameSelect = this.resultData["MrSlikSecEcoDescr"];
    this.inputLookupEconomicSectorObj.jsonSelect = { Descr: this.resultData["MrSlikSecEcoDescr"] };
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

  async loadData() {
    var obj = {
      AppId: this.AppId
    }

    await this.http.post(URLConstant.GetAppById, obj).toPromise().then(
      (response) => {
        this.responseApp = response
      });
    var prodObj = {
      ProdOfferingCode: this.responseApp.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefMasterTypeCodeInterestTypeGeneral,
      ProdOfferingVersion: this.responseApp.ProdOfferingVersion
    }
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, prodObj).toPromise().then(
      (response) => {
        this.responseProd = response;
      });


    await this.http.post(URLConstant.GetApplicationDataByAppId, obj).toPromise().then(
      (response) => {
        this.resultData = response;
        this.salesAppInfoObj.AppRowVersion = this.resultData.AppRowVersion;
        this.salesAppInfoObj.AppFinDataRowVersion = this.resultData.AppFinDataRowVersion;
        this.salesAppInfoObj.AppFctrRowVersion = this.resultData.AppFctrRowVersion;

        this.setDropdown();

      });
  }

  Cancel(){
    this.outputCancel.emit();
  }
  
  SaveForm(): void {
    if (this.SalesAppInfoForm.value.CharaCredit != CommonConstant.CharacteristicOfCreditTypeCredit) {
      this.SalesAppInfoForm.patchValue({
        PrevAgrNo: null,
        WayRestructure: null
      });
    }
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
  ChangeCharacteristicOfCredit() {
    if (this.SalesAppInfoForm.value.CharaCredit == CommonConstant.CharacteristicOfCreditTypeCredit) {
      this.SalesAppInfoForm.controls.WayRestructure.setValidators(Validators.required);
    } else {
      this.SalesAppInfoForm.controls.WayRestructure.clearValidators();
    }
    this.SalesAppInfoForm.controls.WayRestructure.updateValueAndValidity();
  }

}
