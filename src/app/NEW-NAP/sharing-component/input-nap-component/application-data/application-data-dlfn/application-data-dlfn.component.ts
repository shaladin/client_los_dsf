import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { SalesInfoObj } from 'app/shared/model/SalesInfoObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NapAppCrossObj } from 'app/shared/model/NapAppCrossObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { MouCustDlrFinObj } from 'app/shared/model/moucustdlrfin.model';
import { AppDlrFncng } from 'app/shared/model/AppData/AppDlrFncng.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ResGetListMouByAppAndTypeObj } from 'app/shared/model/Response/MOU/MouCust/ResGetListMouByAppAndTypeObj.model';
import { ResApplicationDataObj } from 'app/shared/model/Response/ApplicationData/ResApplicationDataObj.model';
import { RefPayFreqObj } from 'app/shared/model/RefPayFreqObj.model';
import { RefEmpObj } from 'app/shared/model/RefEmpObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ProdOfferingDObj } from 'app/shared/model/Product/ProdOfferingDObj.model';

@Component({
  selector: 'app-application-data-dlfn',
  templateUrl: './application-data-dlfn.component.html'
})

export class ApplicationDataDlfnComponent implements OnInit {
  @Input() AppId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  mode: string;
  salesAppInfoObj: SalesInfoObj = new SalesInfoObj();
  mouCustDlrFinObj: MouCustDlrFinObj = new MouCustDlrFinObj();
  isSingle: boolean = false;

  ListCrossAppObj: any = {};

  inputLookupObj: InputLookupObj; 
  arrAddCrit: Array<CriteriaObj>;
  employeeIdentifier;
  salesRecommendationItems = [];
  isInputLookupObj;
  inputLookupEconomicSectorObj;
  SalesAppInfoForm = this.fb.group({
    MouCustId: [''],
    TopBased: [''],
    SalesNotes: [''],
    SalesOfficerNo: [''],
    SalesHeadNo: [''],
    SalesHeadName: [''],
    SalesOfficerName: [''],
    MrInstTypeCode: [''],
    TopDays: ['', [Validators.pattern("^[0-9]+$")]],
    Tenor: ['', [Validators.pattern("^[0-9]+$")]],
    NumOfInst: [1],
    MrInstSchemeCode: [''],
    IsDisclosed: [false],
    MrAppSourceCode: [''],
    MrWopCode: [''],
    PayFreqCode: [''],
    CharaCredit: [''],
    PrevAgrNo: [''],
    WayRestructure: [''],
    MrSlikSecEcoCode: [''],
    CustBankAcc: ['']
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

  allInScheme: any;
  allInType: Array<KeyValueObj>;
  allWOP: Array<KeyValueObj>;
  allAppSource: Array<KeyValueObj>;
  allPaidby: Array<KeyValueObj>;
  allRecourseType: Array<KeyValueObj>;
  allCalcMethod: Array<KeyValueObj>;
  allIntrstType: Array<KeyValueObj>;
  allMouCust: Array<ResGetListMouByAppAndTypeObj>;
  allTopBased: Array<KeyValueObj>;
  resultData: ResApplicationDataObj;
  allPayFreq: RefPayFreqObj;
  allInSalesOffice: Array<RefEmpObj>;
  allWayRestructure: Array<KeyValueObj>;
  allCharacteristicCredit: Array<KeyValueObj>;
  responseApp: AppObj;
  responseProd: ProdOfferingDObj;
  isInit: boolean = true;

  listCustBankAcc: any;
  selectedBankAcc: any;
  GetBankInfo: any;
  appCustId: number;
  TopIntrstRatePrcnt: number;
  IntrstRatePrcnt: number;
  IsMouSelect: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private modalService: NgbModal) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
  }

  async ngOnInit() {

    this.ListCrossAppObj["appId"] = this.AppId;
    this.ListCrossAppObj["result"] = [];

    console.log("APP DATA DF")
    this.isInputLookupObj = false;
    this.loadData();
    this.GetCrossInfoData();
    this.SalesAppInfoForm.controls.NumOfInst.disable();
  }

  async setDropdown() {
    this.GetListAppCustBankAcc();
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
      MouType: CommonConstant.FINANCING
    }
    await this.http.post(URLConstant.GetListMouByAppIdAndMouTypeDF, AppObj).subscribe(
      (response: any) => {
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
        this.makeNewLookupCriteria();

      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterIntrstType).subscribe(
      (response) => {
        this.allIntrstType = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          if (this.responseProd.MrProdBehaviourCode == CommonConstant.ProductBehaviourDefault) {
            this.SalesAppInfoForm.patchValue({
            });
          } else {
            this.SalesAppInfoForm.patchValue({
            });
          }
        } else {
          if (this.responseProd.MrProdBehaviourCode == CommonConstant.ProductBehaviourLock) {
          }
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterTOPType).subscribe(
      (response) => {
        this.allTopBased = response[CommonConstant.ReturnObj];
        if (this.resultData.AppFinDataId == 0 && this.isInit == true) {
          this.SalesAppInfoForm.patchValue({
            TopBased: this.allTopBased[0].Key
          });
        } else {
          this.http.post(URLConstant.GetAppDlrFinByAppId, { Id: this.AppId }).subscribe(
            (responseEdit) => {
              this.SalesAppInfoForm.patchValue({
                TopBased: responseEdit["TopBased"]
              });
            });
        }
      });



    this.http.post(URLConstant.GetListRefEmpByGsValueandOfficeId, null).subscribe(
      (response) => {
        this.allInSalesOffice = response[CommonConstant.ReturnObj];
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
        this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterInsScheme).subscribe(
          (response) => {
            this.allInScheme = response[CommonConstant.ReturnObj];
            if (this.mode != 'edit') {
              this.SalesAppInfoForm.patchValue({
                MrInstSchemeCode: this.allInScheme[0].Key
              });
            }
          });
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrInstTypeCode: this.allInType[0].Key
          });
          if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeSingle) {
            this.isSingle = true;
            this.SalesAppInfoForm.patchValue({
              MrInstSchemeCode: CommonConstant.InstSchmRegularFix
            });
          }
          else { this.isSingle = false; }
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
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterAppPaidBy).subscribe(
      (response) => {
        this.allPaidby = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterRecourseType).subscribe(
      (response) => {
        this.allRecourseType = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
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


  async SetPayFreq(MouCustId: number) {
    await this.http.post<MouCustDlrFinObj>(URLConstant.GetMouCustDlrFindById, { Id: MouCustId }).subscribe(
      (response) => {
        this.mouCustDlrFinObj = response;
        if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeMultiple) {
          this.isSingle = false;
          this.SalesAppInfoForm.patchValue({
            MrInstTypeCode: this.mouCustDlrFinObj.MrInstTypeCode,
            MrWopCode: this.mouCustDlrFinObj.WopCode,
            PayFreqCode: this.mouCustDlrFinObj.PayFreqCode,
          });
        } else if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeSingle) {
          this.isSingle = true;
          this.SalesAppInfoForm.patchValue({
            MrInstTypeCode: this.mouCustDlrFinObj.MrInstTypeCode,
            TopDays: this.mouCustDlrFinObj.TopDays,
            MrInstSchemeCode: CommonConstant.InstSchmRegularFix,
            MrWopCode: this.mouCustDlrFinObj.WopCode,
            PayFreqCode: this.mouCustDlrFinObj.PayFreqCode,
          });
        }
        this.IsMouSelect = true;
        this.TopIntrstRatePrcnt = this.mouCustDlrFinObj.TopInterestRatePrcnt;
        this.IntrstRatePrcnt = this.mouCustDlrFinObj.InterestRatePrcnt;

        this.http.post(URLConstant.GetRefPayFreqByPayFreqCode, this.mouCustDlrFinObj).subscribe(
          (response: any) => {
            this.allPayFreq = response;
            var PayFreqCode = null;

            if (this.resultData.AppFinDataId == 0 && this.isInit == true) {
              this.mode = "add";
              if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeSingle) {
                this.isSingle = true;
              }
              else if (this.SalesAppInfoForm.controls.MrInstTypeCode.value != CommonConstant.InstTypeSingle) {
                this.isSingle = false;
              }
            } else if (this.resultData.AppFinDataId != 0 && this.isInit == true) {
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
                Tenor: this.resultData.Tenor,
                NumOfInst: this.resultData.NumOfInst,
                MrInstSchemeCode: this.resultData.MrInstSchemeCode,
                IsDisclosed: this.resultData.IsDisclosed,
                MrAppSourceCode: this.resultData.MrAppSourceCode,
                MrWopCode: this.resultData.MrWopCode,
                PayFreqCode: this.resultData.PayFreqCode,
                CharaCredit: this.resultData.CharaCredit,
                PrevAgrNo: this.resultData.PrevAgrNo,
                WayRestructure: this.resultData.WayRestructure,
                MrSlikSecEcoCode: this.resultData.MrSlikSecEcoCode
              });
              this.CalculateNumOfInst(false, this.SalesAppInfoForm.controls.Tenor.value);
              this.CheckInstType();

              if (this.SalesAppInfoForm.controls.MrWopCode.value == 'AUTOCOLLECTION') {
                this.GetBankAccCust();
                this.setBankAcc(this.SalesAppInfoForm.controls.MrWopCode.value)

              }
              if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeSingle) {
                this.isSingle = true;
              }
              else if (this.SalesAppInfoForm.controls.MrInstTypeCode.value != CommonConstant.InstTypeSingle) {
                this.isSingle = false;
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
            this.isInit = false;

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

  CalculateNumOfInst(IsFirstBind: boolean, tenor: number) {
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
      this.isSingle = false;
      this.SalesAppInfoForm.controls.TopDays.disable();
      this.SalesAppInfoForm.controls.TopBased.disable();
      this.SalesAppInfoForm.controls.MrInstSchemeCode.disable();
      this.SalesAppInfoForm.controls.MrWopCode.disable();
      this.SalesAppInfoForm.controls.IsDisclosed.disable();
      this.SalesAppInfoForm.controls.Tenor.enable();
      if (this.mode != "edit") {
        this.SalesAppInfoForm.controls.Tenor.setValue("");
      }
    } else if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeSingle) {
      this.isSingle = true;
      this.SalesAppInfoForm.controls.TopBased.enable();
      this.SalesAppInfoForm.controls.MrInstSchemeCode.disable();
      this.SalesAppInfoForm.controls.MrWopCode.disable();
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
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.jsonSelect = { SalesOfficerName: this.resultData.SalesOfficerName };
    this.inputLookupObj.nameSelect = this.resultData.SalesOfficerName;
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

    this.makeLookUpObj();
  }

  async loadData() {
    var obj = {
      AppId: this.AppId
    }

    await this.http.post(URLConstant.GetAppById, obj).toPromise().then(
      (response: any) => {
        this.responseApp = response
      });
    var prodObj = {
      ProdOfferingCode: this.responseApp.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefMasterTypeCodeInterestTypeGeneral,
      ProdOfferingVersion: this.responseApp.ProdOfferingVersion
    }
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, prodObj).toPromise().then(
      (response: any) => {
        this.responseProd = response;
      });


    await this.http.post(URLConstant.GetApplicationDataByAppId, obj).toPromise().then(
      (response: any) => {
        this.resultData = response;
        this.salesAppInfoObj.AppRowVersion = this.resultData.AppRowVersion;
        this.salesAppInfoObj.AppFinDataRowVersion = this.resultData.AppFinDataRowVersion;
        this.setDropdown();

      });
  }

  Cancel() {
    this.outputCancel.emit();
  }

  SaveForm(): void {
    this.salesAppInfoObj.MouCustId = this.SalesAppInfoForm.controls.MouCustId.value;
    if (this.salesAppInfoObj.MouCustId == 0 || this.salesAppInfoObj.MouCustId == null || this.salesAppInfoObj.MouCustId == undefined) {
      this.toastr.errorMessage(ExceptionConstant.NO_MOU);
      return
    }

    if (this.SalesAppInfoForm.value.CharaCredit != CommonConstant.CharacteristicOfCreditTypeCredit) {
      this.SalesAppInfoForm.patchValue({
        PrevAgrNo: null,
        WayRestructure: null
      });
    }
    var tempListAppCrossObj = this.GetListAppCrossValue();

    this.salesAppInfoObj = this.SalesAppInfoForm.getRawValue();
    this.salesAppInfoObj.AppId = this.AppId;

    this.salesAppInfoObj.listAppCrossObj = tempListAppCrossObj;

    if (this.salesAppInfoObj.MrInstTypeCode == CommonConstant.InstTypeSingle) {
      this.salesAppInfoObj.MrInstSchemeCode = "EP";
      this.salesAppInfoObj.Tenor = 1;
      this.salesAppInfoObj.NumOfInst = this.salesAppInfoObj.Tenor;
      this.isSingle = true;
    } else {
      this.salesAppInfoObj.MrInstSchemeCode = this.SalesAppInfoForm.controls.MrInstSchemeCode.value;
      this.salesAppInfoObj.NumOfInst = this.SalesAppInfoForm.controls.NumOfInst.value;
      this.isSingle = false;
    }
    this.salesAppInfoObj.AppDlrFncngObj = new AppDlrFncng();
    this.salesAppInfoObj.AppDlrFncngObj.TopBased = this.SalesAppInfoForm.controls.TopBased.value;

    this.http.post(URLConstant.GetMouCustDlrFindById, { Id: this.salesAppInfoObj.MouCustId }).subscribe(
      (responseMouCustDlrFncng) => {
        this.salesAppInfoObj.AppDlrFncngObj.MouCustDlrFncngId = responseMouCustDlrFncng["MouCustDlrFncngId"];

        if (this.SalesAppInfoForm.controls.MrWopCode.value == 'AUTOCOLLECTION') {
          this.SaveAppOtherInfo();
        }

        if (this.mode == "add") {
          this.http.post(URLConstant.SaveApplicationDataDF, this.salesAppInfoObj).subscribe(
            (response) => {
              if (response["StatusCode"] == 200) {
                this.toastr.successMessage(response["message"]);
                this.outputTab.emit();
              } else {
                this.toastr.warningMessage(response["message"]);
              }
            });
        } else {
          this.salesAppInfoObj.AppRowVersion = this.resultData.AppRowVersion;
          this.salesAppInfoObj.AppFinDataRowVersion = this.resultData.AppFinDataRowVersion;
          this.http.post(URLConstant.EditApplicationDataDF, this.salesAppInfoObj).subscribe(
            (response) => {
              if (response["StatusCode"] == 200) {
                this.toastr.successMessage(response["message"]);
                this.outputTab.emit();
              } else {
                this.toastr.warningMessage(response["message"]);
              }
            });
        }
      });
  }

  ChangeCharacteristicOfCredit() {
    if (this.SalesAppInfoForm.value.CharaCredit == CommonConstant.CharacteristicOfCreditTypeCredit) {
    } else {
      this.SalesAppInfoForm.controls.WayRestructure.clearValidators();
    }
    this.SalesAppInfoForm.controls.WayRestructure.updateValueAndValidity();
  }
  
  AddTemp(contentCrossApp) {
    this.Open(contentCrossApp);
  }

  closeResult;
  Open(contentCrossApp) {
    this.modalService.open(contentCrossApp).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  resultCrossApp: Array<NapAppCrossObj> = new Array<NapAppCrossObj>();
  GetDataTemp(ev) {
    for (let i of ev) {
      var tempCrossApp = new NapAppCrossObj();
      tempCrossApp.CrossAgrmntNo = i.AgrmntNo;
      tempCrossApp.CrossAppNo = i.AppNo;
      tempCrossApp.CustName = i.CustName;
      tempCrossApp.ContractStat = i.AgrmntStat;
      tempCrossApp.MaturityDt;
      this.resultCrossApp.push(tempCrossApp);
      this.ListCrossAppObj["result"].push(i.AgrmntNo);
    }
  }

  DeleteCrossApp(idx) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      if (this.resultCrossApp[idx].AppCrossId != null) {
        var obj = new NapAppCrossObj();
        obj = this.resultCrossApp[idx];
        this.http.post(URLConstant.DeleteAppCross, obj).subscribe(
          (response) => {
          }
        )
      }
      this.resultCrossApp.splice(idx, 1);
      this.ListCrossAppObj["result"].splice(idx, 1);
    }
  }

  //#region  BANK ACC
  GetListAppCustBankAcc() {
    var objAppCust = {
      AppId: this.AppId
    }
    this.http.post<any>(URLConstant.GetAppCustByAppId, objAppCust).subscribe(
      (responseAppCust) => {
        var obj = {
          AppCustId: responseAppCust["AppCustId"]
        };
        this.appCustId = responseAppCust["AppCustId"]
        this.http.post<any>(URLConstant.GetListAppCustBankAccByAppCustId, obj).subscribe(
          (response) => {
            this.listCustBankAcc = response.AppCustBankAccObjs;
          });
      });
  }

  GetBankAccCust() {
    var obj = {
      AppId: this.AppId
    };
    this.http.post(URLConstant.GetAppOtherInfoByAppId, obj).subscribe(
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
      this.SalesAppInfoForm.controls["CustBankAcc"].setValidators([Validators.required]);
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
      this.SalesAppInfoForm.controls["CustBankAcc"].clearValidators();
      this.SalesAppInfoForm.controls["CustBankAcc"].updateValueAndValidity()
    }
  }

  SaveAppOtherInfo() {
    if (this.GetBankInfo != undefined && this.GetBankInfo != "" && this.GetBankInfo.BankAccName != null && this.GetBankInfo.BankAccNo != null && this.GetBankInfo.BankBranch != null && this.GetBankInfo.BankCode != null && this.GetBankInfo.AppId != 0) {
      this.http.post<any>(URLConstant.AddAppOtherInfo, this.GetBankInfo).subscribe(
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
      this.http.post<any>(URLConstant.AddAppOtherInfo, this.GetBankInfo).subscribe(
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
      this.SalesAppInfoForm.controls["CustBankAcc"].setValidators([Validators.required]);
      this.SalesAppInfoForm.controls["CustBankAcc"].updateValueAndValidity()
    }
    else {
      this.SalesAppInfoForm.controls["CustBankAcc"].clearValidators();
      this.SalesAppInfoForm.controls["CustBankAcc"].updateValueAndValidity()
    }
    this.SalesAppInfoForm.controls.CustBankAcc.updateValueAndValidity();
  }
  //#endregion

  GetCrossInfoData() {
    var obj = {
      AppId: this.AppId,
      RowVersion: ""
    }
    this.http.post(URLConstant.GetListAppCross, obj).subscribe(
      (response) => {
        this.resultCrossApp = response[CommonConstant.ReturnObj];
        for (var i = 0; i < this.resultCrossApp.length; i++) {
          this.ListCrossAppObj["result"].push(this.resultCrossApp[i].CrossAgrmntNo);
        }
      });
  }

  GetListAppCrossValue() {
    var arr = [];
    for (var i = 0; i < this.resultCrossApp.length; i++) {
      var temp = new NapAppCrossObj();
      temp.AppId = this.AppId;
      temp.CrossAgrmntNo = this.resultCrossApp[i].CrossAgrmntNo;
      temp.CrossAppNo = this.resultCrossApp[i].CrossAppNo;
      temp.CustName = this.resultCrossApp[i].CustName;
      temp.MaturityDt = this.resultCrossApp[i].MaturityDt;
      temp.ContractStat = this.resultCrossApp[i].ContractStat;
      arr.push(temp);
    }
    return arr;
  }
}
