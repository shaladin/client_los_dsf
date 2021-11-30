import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormArray, ValidatorFn } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { SalesInfoObj } from 'app/shared/model/sales-info-obj.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustFctrObj } from 'app/shared/model/mou-cust-fctr-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/request/product/req-get-prod-offering-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ResGetListMouByAppAndTypeObj } from 'app/shared/model/response/mou/mou-cust/res-get-list-mou-by-app-and-type-obj.model';
import { RefPayFreqObj } from 'app/shared/model/ref-pay-freq-obj.model';
import { RefEmpObj } from 'app/shared/model/ref-emp-obj.model';
import { AppObj } from 'app/shared/model/app/app.model';
import { ProdOfferingDObj } from 'app/shared/model/product/prod-offering-d-obj.model';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { AppDataObj } from 'app/shared/model/app-data-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { NapModule } from 'app/NEW-NAP/nap.module';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { GenerateAppAttrContentObj } from 'app/shared/model/app-attr-content/generate-app-attr-content-obj.model';
import { AppAttrContentObj } from 'app/shared/model/app-attr-content/app-attr-content-obj.model';

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

  inputLookupObj: InputLookupObj;
  arrAddCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  employeeIdentifier;
  isInputLookupObj: boolean;
  inputLookupEconomicSectorObj: InputLookupObj; 
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
    CustBankAcc: [''],
    AppAttrContentObjs: this.fb.array([])
  })
  slikSecDescr: string = "";
  defaultSlikSecEcoCode: string;
  refMasterInterestType: RefMasterObj = new RefMasterObj();
  refMasterInsScheme: ReqRefMasterByTypeCodeAndMappingCodeObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
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

  allInScheme: Array<KeyValueObj>;
  allInType: Array<KeyValueObj>;
  allWOP: Array<KeyValueObj>;
  allAppSource: Array<KeyValueObj>;
  allPaidby: Array<KeyValueObj>;
  allRecourseType: Array<KeyValueObj>;
  allCalcMethod: Array<KeyValueObj>;
  allIntrstType: Array<KeyValueObj>;
  allMouCust: Array<ResGetListMouByAppAndTypeObj>;
  allTopBased: Array<KeyValueObj>;
  resultData: AppDataObj;
  allPayFreq: RefPayFreqObj;
  allInSalesOffice: Array<RefEmpObj>;
  allWayRestructure: Array<KeyValueObj>;
  allCharacteristicCredit: Array<KeyValueObj>;
  responseApp: AppObj;
  responseProd: ProdOfferingDObj;
  listCustBankAcc: Array<AppCustBankAccObj>;
  selectedBankAcc: any;
  GetBankInfo: any;
  appCustId: number;
  isAppAttrContentReady: boolean = false;
  GenerateAppAttrContentObjs: Array<GenerateAppAttrContentObj> = new Array<GenerateAppAttrContentObj>();
  ListAttrAnswer = [];
  ListInputLookUpObj = new Array();
  tempLookup = {};
  readonly AttrInputTypeText = CommonConstant.AttrInputTypeText;
  readonly AttrInputTypeDate = CommonConstant.AttrInputTypeDate;
  readonly AttrInputTypeNum = CommonConstant.AttrInputTypeNum;
  readonly AttrInputTypeNumPerc = CommonConstant.AttrInputTypeNumPerc;
  readonly AttrInputTypeList = CommonConstant.AttrInputTypeList;
  readonly AttrInputTypeTextArea = CommonConstant.AttrInputTypeTextArea;
  readonly AttrInputTypeRefMaster = CommonConstant.AttrInputTypeRefMaster;


  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
  }

  async ngOnInit() {
    this.defaultSlikSecEcoCode = CommonConstant.DefaultSlikSecEcoCode;
    this.isInputLookupObj = false;
    await this.loadData();
    this.SalesAppInfoForm.controls.NumOfInst.disable();
    this.SalesAppInfoForm.controls.MrSingleInstCalcMthdCode.disable();
    this.GetListAppCustBankAcc();
  }

  async setDropdown() {
    this.refMasterInterestType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInterestTypeFactoring;
    this.refMasterInsScheme.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInstSchm;
    this.refMasterInsScheme.MappingCode = CommonConstant.FCTR;
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
        this.allMouCust = response[CommonConstant.ReturnObj];
        var MouCustId;
        if(this.resultData.AppFinDataId != 0 && this.resultData.AppFctrId != 0 ){
          this.mode = "edit";
        }
        else{
          this.mode = "add";
        }
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

    this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, this.refMasterInsScheme).subscribe(
      (response) => {
        this.allInScheme = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrInstSchemeCode: this.allInScheme[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetListRefEmpByGsValueandOfficeId, null).subscribe(
      (response: GenericListObj) => {
        this.allInSalesOffice = response.ReturnObject;
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            SalesOfficerNo: this.allInSalesOffice[0].empNo,
            SalesOfficerName: this.allInSalesOffice[0].empName,
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
            CharaCredit: this.allCharacteristicCredit[1].Key,
            MrSlikSecEcoCode: this.defaultSlikSecEcoCode
          });
        }
      });

    await this.CheckInstType();

  }
  
  async SetPayFreq(MouCustId: number, isCriteriaMake: boolean = true, isInit: boolean = true) {
    await this.http.post<MouCustFctrObj>(URLConstant.GetMouCustFctrByMouCustId, { Id: MouCustId }).toPromise().then(
      (response) => {
        this.mouCustFctrObj = response;
        if (this.mouCustFctrObj.MrInstTypeCode == CommonConstant.InstTypeMultiple) {
          this.SalesAppInfoForm.patchValue({
            MrInstTypeCode: this.mouCustFctrObj.MrInstTypeCode,
            MrInstSchemeCode: this.mouCustFctrObj.MrInstSchmCode,
            IsDisclosed: this.mouCustFctrObj.IsDisclosed,
            PaidBy: this.mouCustFctrObj.MrPaidByCode,
            RecourseType: this.mouCustFctrObj.MrRecourseTypeCode,
            MrWopCode: this.mouCustFctrObj.WopCode,
            PayFreqCode: this.mouCustFctrObj.PayFreqCode,
          });
          console.log(this.mouCustFctrObj);
          console.log("TestObj");
        } else if (this.mouCustFctrObj.MrInstTypeCode == CommonConstant.InstTypeSingle) {
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


        this.http.post(URLConstant.GetRefPayFreqByPayFreqCode, { Code: this.mouCustFctrObj.PayFreqCode }).subscribe(
          (response: RefPayFreqObj) => {
            this.allPayFreq = response;
            var PayFreqCode = null;

            if (this.resultData.AppFinDataId == 0 && this.resultData.AppFctrId == 0 && isInit == true) {
              this.mode = "add";
            } else if (this.resultData.AppFinDataId != 0 && this.resultData.AppFctrId != 0 && isInit == true) {
              this.mode = "edit";
              this.http.post(URLConstant.GetRefPayFreqByPayFreqCode, { Code: this.resultData.PayFreqCode }).subscribe(
                (response: RefPayFreqObj) => {
                  this.allPayFreq = response;
                });
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
              this.CalculateNumOfInst();
              this.CheckInstType();

              if (this.SalesAppInfoForm.controls.MrWopCode.value == 'AUTOCOLLECTION') {
                this.GetBankAccCust();
                this.setBankAcc(this.SalesAppInfoForm.controls.MrWopCode.value)
              }
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
            //this.isInit = false;
            if (isCriteriaMake) this.makeNewLookupCriteria();

          });
      });
    for (let i = 0; i < this.allMouCust.length; i++) {
      if (this.allMouCust[i].MouCustId == MouCustId) {
        this.SalesAppInfoForm.patchValue({
          MrInstTypeCode: this.allMouCust[i].MrInstTypeCode
        })
        this.CheckInstType();
      }
    }
    this.SalesAppInfoForm.controls.MrInstTypeCode.disable();


  }

  CalculateNumOfInst() {
    var numOfInst;
    if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeMultiple) {
      numOfInst = this.SalesAppInfoForm.controls.Tenor.value / this.allPayFreq.PayFreqVal;
      this.SalesAppInfoForm.controls.NumOfInst.patchValue(numOfInst);
      this.salesAppInfoObj.NumOfInst = numOfInst;
    } else {
      this.SalesAppInfoForm.controls.NumOfInst.patchValue(1);
    }
  }

  CheckingTenor(IsFirstBind: boolean, tenor: number){
    console.log("awawada");
    if (this.mouCustFctrObj.MouCustFctrId != 0) {
      if (this.mouCustFctrObj.MrInstTypeCode == CommonConstant.InstTypeMultiple) {
        if (!IsFirstBind && tenor > this.mouCustFctrObj.TenorTo || tenor < this.mouCustFctrObj.TenorFrom) {
          return false;
        }
      }
    }
    return true;
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
      if (this.mode != "edit") {
        this.SalesAppInfoForm.controls.Tenor.setValue("");
        this.SalesAppInfoForm.controls.NumOfInst.setValue("");
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
      this.SalesAppInfoForm.controls.Tenor.setValue(1);
      this.SalesAppInfoForm.controls.NumOfInst.setValue(1);

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
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.jsonSelect = this.resultData;
    this.inputLookupObj.addCritInput = this.arrAddCrit;

    this.inputLookupEconomicSectorObj = new InputLookupObj();
    this.inputLookupEconomicSectorObj.urlJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";
    this.inputLookupEconomicSectorObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupEconomicSectorObj.pagingJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";
    this.inputLookupEconomicSectorObj.genericJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";

    if (this.resultData["MrSlikSecEcoDescr"] != null && this.resultData["MrSlikSecEcoDescr"] != "") {
      this.inputLookupEconomicSectorObj.nameSelect = this.resultData["MrSlikSecEcoDescr"];
      this.inputLookupEconomicSectorObj.jsonSelect = { Descr: this.resultData["MrSlikSecEcoDescr"] };
    }
    else {
      let reqSecObj: ReqRefMasterByTypeCodeAndMasterCodeObj = new ReqRefMasterByTypeCodeAndMasterCodeObj();
      reqSecObj.MasterCode = this.defaultSlikSecEcoCode;
      reqSecObj.RefMasterTypeCode = "SLIK_SEC_ECO";
      this.http.post(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, reqSecObj).subscribe(
        (response: KeyValueObj) => {
          console.log(response);
          this.slikSecDescr = response.Value;
          this.inputLookupEconomicSectorObj.nameSelect = response.Value;
          this.inputLookupEconomicSectorObj.jsonSelect = { Descr: response.Value };
        });
    }
    this.isInputLookupObj = true;

  }

  async makeNewLookupCriteria() {
    this.arrAddCrit = new Array<CriteriaObj>();

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

    var addCrit4 = new CriteriaObj();
    addCrit4.DataType = "text";
    addCrit4.propName = "ro.OFFICE_CODE";
    addCrit4.restriction = AdInsConstant.RestrictionIn;
    addCrit4.listValue = [this.resultData.OriOfficeCode];
    this.arrAddCrit.push(addCrit4);

    await this.GetGSValueSalesOfficer();
    this.makeLookUpObj();
  }

  async GetGSValueSalesOfficer() {
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeFilterAppDataSalesOfficerCode }).toPromise().then(
      async (response) => {
        let FilterBy = response.GsValue;
        await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeAppDataOfficer }).toPromise().then(
          (response) => {
            let addCrit3 = new CriteriaObj();
            addCrit3.DataType = "text";
            addCrit3.propName = FilterBy == "ROLE" ? "rr.ROLE_CODE" : "rbt.JOB_TITLE_CODE";
            addCrit3.restriction = AdInsConstant.RestrictionIn;
            addCrit3.listValue = response.GsValue.split(',');
            this.arrAddCrit.push(addCrit3);
          }
        );
      });
  }

  async loadData() {
    await this.http.post(URLConstant.GetAppById, {Id: this.AppId}).toPromise().then(
      (response: AppObj) => {
        this.responseApp = response
      }); 
    var prodObj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    prodObj.ProdOfferingCode = this.responseApp.ProdOfferingCode;
    prodObj.RefProdCompntCode = CommonConstant.RefMasterTypeCodeInterestTypeGeneral;
    prodObj.ProdOfferingVersion = this.responseApp.ProdOfferingVersion;

    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, prodObj).toPromise().then(
      (response: ProdOfferingDObj) => {
        this.responseProd = response;
      });


    await this.http.post(URLConstant.GetApplicationDataByAppId, { Id: this.AppId }).toPromise().then(
      (response: any) => {
        this.resultData = response;
        this.salesAppInfoObj.AppRowVersion = this.resultData.AppRowVersion;
        this.salesAppInfoObj.AppFinDataRowVersion = this.resultData.AppFinDataRowVersion;
        this.salesAppInfoObj.AppFctrRowVersion = this.resultData.AppFctrRowVersion;

        this.setDropdown();

      });
      this.GenerateAppAttrContent();
  }

  GenerateAppAttrContent() {
    this.isAppAttrContentReady = false;
    var GenObj =
    {
      AppId: this.AppId,
      AttrGroup: CommonConstant.AttrGroupApplicationData + "_" + CommonConstant.FCTR,
    };
    this.http.post(URLConstant.GenerateAppAttrContent, GenObj).subscribe(
      (response) => {
        this.GenerateAppAttrContentObjs = response['GenerateAppAttrContentObjs'];

        this.GenerateAppAttrContentForm();
        this.isAppAttrContentReady = true;
      });
  }

  GenerateAppAttrContentForm() {
    if (this.GenerateAppAttrContentObjs != null) {
      this.ListAttrAnswer = [];
      for (let i = 0; i < this.GenerateAppAttrContentObjs.length; i++) {
        this.ListAttrAnswer.push([]);
        if (this.GenerateAppAttrContentObjs[i].AttrQuestionValue != null) {
          this.ListAttrAnswer[i].push(this.GenerateAppAttrContentObjs[i].AttrQuestionValue);
        }
        else {
          this.ListAttrAnswer[i].push("");
        }
      }
      var listAppAssetAttrs = this.SalesAppInfoForm.controls["AppAttrContentObjs"] as FormArray;
      while (listAppAssetAttrs.length !== 0) {
        listAppAssetAttrs.removeAt(0);
      }
      for (let i = 0; i < this.GenerateAppAttrContentObjs.length; i++) {
        listAppAssetAttrs.push(this.addGroupAppAttrContent(this.GenerateAppAttrContentObjs[i], i));
      }
      this.ListInputLookUpObj.push(this.tempLookup);
    }
  }

  addGroupAppAttrContent(generateAppAttrContentObj: GenerateAppAttrContentObj, i: number) {
    let ListValidator: Array<ValidatorFn> = this.setAppAttrContentValidators(generateAppAttrContentObj);

    return this.setFbGroupAppAttrContent(generateAppAttrContentObj, i, ListValidator);
  }

  private setAppAttrContentValidators(generateAppAttrContentObj: GenerateAppAttrContentObj) {
    let ListValidator: Array<ValidatorFn> = new Array<ValidatorFn>();

    if(generateAppAttrContentObj.IsMandatory == true){
      ListValidator.push(Validators.required);
    }
    if (generateAppAttrContentObj.AttrLength != null && generateAppAttrContentObj.AttrLength != 0) {
      ListValidator.push(Validators.maxLength(generateAppAttrContentObj.AttrLength));
    }
    if(generateAppAttrContentObj.PatternValue != null && generateAppAttrContentObj.PatternValue != ""){
      ListValidator.push(Validators.pattern(generateAppAttrContentObj.PatternValue));
    }

    return ListValidator;
  }

  private setFbGroupAppAttrContent(generateAppAttrContentObj: GenerateAppAttrContentObj, i: number, ListValidator: Array<ValidatorFn>) {

    let tempFB = this.fb.group({
      No: [i],
      RefAttrCode: [generateAppAttrContentObj.RefAttrCode],
      RefAttrName: [generateAppAttrContentObj.RefAttrName],
      AttrInputType: [generateAppAttrContentObj.AttrInputType],
      AttrValue: [generateAppAttrContentObj.AttrValue],
      IsMandatory: [generateAppAttrContentObj.IsMandatory]
    });
    if (ListValidator.length > 0) {
      tempFB.get("AttrValue").setValidators(ListValidator);
    }

    if (generateAppAttrContentObj.AttrInputType == this.AttrInputTypeRefMaster) {
      this.tempLookup[generateAppAttrContentObj.RefAttrCode] = new InputLookupObj();
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].urlJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].urlEnviPaging = environment.FoundationR3Url + "/v1";
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].pagingJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].genericJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].title = generateAppAttrContentObj.RefAttrName;
      if (generateAppAttrContentObj.IsMandatory == true) {
        this.tempLookup[generateAppAttrContentObj.RefAttrCode].isRequired = true;
      }
      else {
        this.tempLookup[generateAppAttrContentObj.RefAttrCode].isRequired = false;
      }
      if (generateAppAttrContentObj.AttrValue != null && generateAppAttrContentObj.AttrValue != "") {
        let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
          RefMasterTypeCode: generateAppAttrContentObj.RefAttrValue,
          MasterCode: generateAppAttrContentObj.AttrValue
        };
        this.http.post(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
          (response: KeyValueObj) => {
            this.tempLookup[generateAppAttrContentObj.RefAttrCode].jsonSelect = { Descr: response.Value }
          });
      }
    
      var arrAddCrit = new Array();
      var critAssetObj = new CriteriaObj();
      critAssetObj.DataType = 'text';
      critAssetObj.restriction = AdInsConstant.RestrictionEq;
      critAssetObj.propName = 'REF_MASTER_TYPE_CODE';
      critAssetObj.value = generateAppAttrContentObj.RefAttrValue;
      arrAddCrit.push(critAssetObj);
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].addCritInput = arrAddCrit;
    }

    return tempFB;
  }

  SetAttrValueRm(e, i){
    this.SalesAppInfoForm.controls['AppAttrContentObjs']['controls'][i].patchValue({
      AttrValue: e.MasterCode
    });
  }

  Cancel() {
    this.outputCancel.emit();
  }

  async SaveForm() {
    let MouCustObj = {
      "MouCustId": this.SalesAppInfoForm.controls.MouCustId.value
    }
    let IsInValid;
    await this.http.post(URLConstant.CheckIsMouFreeze, MouCustObj).toPromise().then(
      (response) => {
        IsInValid = response["IsFreeze"]
      });
    if (IsInValid) {
      this.toastr.warningMessage(ExceptionConstant.MOU_FREEZE_STATE);
      return
    }
    if (this.SalesAppInfoForm.value.CharaCredit != CommonConstant.CharacteristicOfCreditTypeCredit) {
      this.SalesAppInfoForm.patchValue({
        PrevAgrNo: null,
        WayRestructure: null
      });
    }
    if (this.CheckingTenor(false, this.SalesAppInfoForm.controls.Tenor.value) == false) {
      this.toastr.warningMessage("Tenor must be between " + this.mouCustFctrObj.TenorFrom + " and " + this.mouCustFctrObj.TenorTo);
      return;
    }


    this.salesAppInfoObj = this.SalesAppInfoForm.getRawValue();
    this.salesAppInfoObj.AppId = this.AppId;
    this.salesAppInfoObj.MouCustId = this.SalesAppInfoForm.controls.MouCustId.value;
    this.salesAppInfoObj.AppAttrContentObjs = this.getAppAttrContentObj();

    if (this.salesAppInfoObj.MrInstTypeCode == "SINGLE") {
      this.salesAppInfoObj.MrInstSchemeCode = "EP";
      this.salesAppInfoObj.Tenor = 1;
      this.salesAppInfoObj.NumOfInst = this.salesAppInfoObj.Tenor;
    } else {
      this.salesAppInfoObj.MrInstSchemeCode = this.SalesAppInfoForm.controls.MrInstSchemeCode.value;
      this.salesAppInfoObj.NumOfInst = this.SalesAppInfoForm.controls.NumOfInst.value;
    }
    if (this.SalesAppInfoForm.controls.MrWopCode.value == 'AUTOCOLLECTION') {
      this.SaveAppOtherInfo();
    }

    if (this.mode == "add") {
      this.http.post(URLConstant.SaveApplicationDataFctr, this.salesAppInfoObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputTab.emit();
        });
    } else {
      this.salesAppInfoObj.AppRowVersion = this.resultData.AppRowVersion;
      this.salesAppInfoObj.AppFctrRowVersion = this.resultData.AppFctrRowVersion;
      this.salesAppInfoObj.AppFinDataRowVersion = this.resultData.AppFinDataRowVersion;
      this.http.post(URLConstant.EditApplicationDataFctr, this.salesAppInfoObj).subscribe(
        (response) => {
          if (response["StatusCode"] == 200) {
            this.toastr.successMessage(response["message"]);
            this.outputTab.emit();
          } else {
            this.toastr.warningMessage(response["message"]);
          }
        });
    }

  }

  getAppAttrContentObj(){
    var appAttrContentObjs = new Array<AppAttrContentObj>();
    if (this.GenerateAppAttrContentObjs != null) {
      for (let i = 0; i < this.SalesAppInfoForm.controls["AppAttrContentObjs"].value.length; i++) {
        var appAttrContentObj = new AppAttrContentObj();
        appAttrContentObj.AppId = this.AppId;
        appAttrContentObj.RefAttrCode = this.SalesAppInfoForm.controls["AppAttrContentObjs"].value[i].RefAttrCode;
        appAttrContentObj.AttrValue = this.SalesAppInfoForm.controls["AppAttrContentObjs"].value[i].AttrValue;

        appAttrContentObjs.push(appAttrContentObj);      
      }
    }

    return appAttrContentObjs;
  }

  ChangeCharacteristicOfCredit() {
    if (this.SalesAppInfoForm.value.CharaCredit == CommonConstant.CharacteristicOfCreditTypeCredit) {
      this.SalesAppInfoForm.controls.WayRestructure.setValidators(Validators.required);
    } else {
      this.SalesAppInfoForm.controls.WayRestructure.clearValidators();
    }
    this.SalesAppInfoForm.controls.WayRestructure.updateValueAndValidity();
  }

  GetListAppCustBankAcc() {
    this.http.post<AppCustObj>(URLConstant.GetAppCustByAppId, {AppId: this.AppId}).subscribe(
      (responseAppCust) => {
        this.appCustId = responseAppCust["AppCustId"]
        this.http.post<any>(URLConstant.GetListAppCustBankAccByAppCustId, { Id: this.appCustId }).subscribe(
          (response) => {
            this.listCustBankAcc = response.AppCustBankAccObjs;
          });
      });
  }

  GetBankAccCust() {
    this.http.post(URLConstant.GetAppOtherInfoByAppId, { AppId: this.AppId }).subscribe(
      (responseAoi) => {
        var objectForAppCustBankAcc = {
          BankCode: responseAoi["BankCode"],
          BankAccNo: responseAoi["BankAccNo"],
          AppCustId: this.appCustId
        }
        this.http.post(URLConstant.GetAppCustBankAccByBankAccNoAndBankCodeAndAppCustId, objectForAppCustBankAcc).subscribe(
          (response) => {
            this.SalesAppInfoForm.patchValue({
              CustBankAcc: response["AppCustBankAccId"]
            });
            this.GetBankInfo = {
              "BankCode": response["BankCode"],
              "BankBranch": response["BankBranch"],
              "AppId": this.AppId,
              "BankAccNo": response["BankAccNo"],
              "BankAccName": response["BankAccName"]
            };
          });
      });
  }

  selectedBank(event) {
    if (this.SalesAppInfoForm.controls.MrWopCode.value == 'AUTOCOLLECTION') {
      this.SalesAppInfoForm.controls['CustBankAcc'].setValidators([Validators.required]);
      this.SalesAppInfoForm.controls["CustBankAcc"].updateValueAndValidity()
      this.selectedBankAcc = this.listCustBankAcc.find(x => x.AppCustBankAccId == event);
      this.GetBankInfo = {
        "BankCode": this.selectedBankAcc.BankCode,
        "BankBranch": this.selectedBankAcc.BankBranch,
        "AppId": this.AppId,
        "BankAccNo": this.selectedBankAcc.BankAccNo,
        "BankAccName": this.selectedBankAcc.BankAccName,
        "AdditionalInterestPaidBy": ""
      };
    }
    else {
      this.SalesAppInfoForm.controls['CustBankAcc'].clearValidators();
      this.SalesAppInfoForm.controls["CustBankAcc"].updateValueAndValidity()
    }
  }

  SaveAppOtherInfo() {
    if (this.GetBankInfo != undefined && this.GetBankInfo != ""  && this.GetBankInfo.BankAccName != null && this.GetBankInfo.BankAccNo != null && this.GetBankInfo.BankBranch != null && this.GetBankInfo.BankCode != null && this.GetBankInfo.AppId != 0) {
      this.http.post(URLConstant.AddAppOtherInfo, this.GetBankInfo).subscribe(
        error => {
          console.log(error);
        }
      )
    }else{
      this.GetBankInfo = {
        "BankCode": "",
        "BankBranch": "",
        "AppId": this.AppId,
        "BankAccNo": "",
        "BankAccName": "",
      };
      this.http.post(URLConstant.AddAppOtherInfo, this.GetBankInfo).subscribe(
        (response) => {
          response;
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  setBankAcc(event) {
    if (event == 'AUTOCOLLECTION') {
      this.SalesAppInfoForm.controls['CustBankAcc'].setValidators([Validators.required]);
      this.SalesAppInfoForm.controls["CustBankAcc"].updateValueAndValidity()
    }
    else {
      this.SalesAppInfoForm.controls['CustBankAcc'].clearValidators();
      this.SalesAppInfoForm.controls["CustBankAcc"].updateValueAndValidity()
    }
    this.SalesAppInfoForm.controls.CustBankAcc.updateValueAndValidity();
  }
}
