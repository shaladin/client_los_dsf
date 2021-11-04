import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { SalesInfoObj } from 'app/shared/model/sales-info-obj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NapAppCrossObj } from 'app/shared/model/nap-app-cross-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { MouCustDlrFinObj } from 'app/shared/model/mou-cust-dlr-fin.model';
import { AppDlrFncng } from 'app/shared/model/app-data/app-dlr-fncng.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ResGetListMouByAppAndTypeObj } from 'app/shared/model/response/mou/mou-cust/res-get-list-mou-by-app-and-type-obj.model';
import { ResApplicationDataObj } from 'app/shared/model/response/application-data/res-application-data-obj.model';
import { RefPayFreqObj } from 'app/shared/model/ref-pay-freq-obj.model';
import { RefEmpObj } from 'app/shared/model/ref-emp-obj.model';
import { AppObj } from 'app/shared/model/apps/apps.model';
import { ProdOfferingDObj } from 'app/shared/model/product/prod-offering-d-obj.model';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';

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
  isInputLookupObj: boolean;

  SalesAppInfoForm = this.fb.group({
    MouCustId: [''],
    TopBased: [''],
    SalesNotes: [''],
    SalesOfficerNo: [''],
    SalesHeadNo: [''],
    SalesHeadName: [''],
    SalesOfficerName: [''],
    MrInstTypeCode: [''],
    TopDays: ['', [Validators.pattern('^[0-9]+$')]],
    Tenor: ['', [Validators.pattern('^[0-9]+$')]],
    NumOfInst: [1],
    MrInstSchemeCode: [''],
    IsDisclosed: [false],
    MrAppSourceCode: [''],
    MrWopCode: [''],
    PayFreqCode: [''],
    CharaCredit: [''],
    PrevAgrNo: [''],
    WayRestructure: [''],
    CustBankAcc: [''],
    IntrstRatePrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
    TopIntrstRatePrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]]
  })

  refMasterInterestType: RefMasterObj = new RefMasterObj();
  refMasterInsScheme: RefMasterObj = new RefMasterObj();
  refMasterInsType: RefMasterObj = new RefMasterObj();
  refMasterRecommendation: RefMasterObj = new RefMasterObj();
  refMasterWOP: RefMasterObj = new RefMasterObj();
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
  resultData: ResApplicationDataObj;
  listPayFreq: Array<RefPayFreqObj>;
  payFreqObj: RefPayFreqObj;
  listAllActivePayFreq: Array<RefPayFreqObj>;
  allInSalesOffice: Array<RefEmpObj>;
  allWayRestructure: Array<KeyValueObj>;
  allCharacteristicCredit: Array<KeyValueObj>;
  responseApp: AppObj;
  responseProd: ProdOfferingDObj;

  listCustBankAcc: Array<AppCustBankAccObj>;
  selectedBankAcc: any;
  GetBankInfo: any;
  appCustId: number;
  IsMouSelect: boolean = false;
  wopCodeAutoDebit: string = CommonConstant.WopAutoDebit;

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  MaxEffDt: Date;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
  }

  async ngOnInit() {
    this.ListCrossAppObj['appId'] = this.AppId;
    this.ListCrossAppObj['result'] = [];

    this.isInputLookupObj = false;

    await this.http.post(URLConstant.GetListRefPayFreqForMou, null).toPromise().then(
      (response: any) => {
        this.listAllActivePayFreq = response[CommonConstant.ReturnObj];
      });

    await this.loadData();
    this.GetCrossInfoData();
    this.SalesAppInfoForm.controls.NumOfInst.disable();

    if (this.mode == 'edit') {
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
        IntrstRatePrcnt: this.resultData.InterestRatePrcnt,
        TopIntrstRatePrcnt: this.resultData.TopInterestRatePrcnt
      });
    }

    if (this.SalesAppInfoForm.controls['MrWopCode'].value == this.wopCodeAutoDebit) {
      this.GetBankAccCust();
      this.setBankAcc(this.SalesAppInfoForm.controls['MrWopCode'].value)
    }
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

    await this.http.post(URLConstant.GetListMouByAppIdAndMouTypeDF, {
      AppId: this.resultData.AppId,
      MouType: CommonConstant.FINANCING
    }).toPromise().then(
      async (response: any) => {
        this.allMouCust = response[CommonConstant.ReturnObj];
        let MouCustId = this.mode == 'edit' ? this.resultData.MouCustId : this.allMouCust[0].MouCustId;

        this.SalesAppInfoForm.patchValue({
          MouCustId: MouCustId
        });

        await this.SetPayFreq(MouCustId, true);
        await this.makeNewLookupCriteria();
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterTOPType).subscribe(
      (response) => {
        this.allTopBased = response[CommonConstant.ReturnObj];
        if (this.mode == 'edit') {
          this.SalesAppInfoForm.patchValue({
            TopBased: this.allTopBased[0].Key
          });
        } else {
          this.http.post(URLConstant.GetAppDlrFinByAppId, { Id: this.AppId }).subscribe(
            (responseEdit) => {
              this.SalesAppInfoForm.patchValue({
                TopBased: responseEdit['TopBased']
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

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterInsType).toPromise().then(
      (response) => {
        this.allInType = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit' && !this.mouCustDlrFinObj) {
          this.SalesAppInfoForm.patchValue({
            MrInstTypeCode: this.allInType[0].Key,
            MrInstSchemeCode: CommonConstant.InstSchmEvenPrincipal
          });
          this.isSingle = this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeSingle;
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

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterIntrstType).subscribe(
      (response) => {
        this.allIntrstType = response[CommonConstant.ReturnObj];
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterInsScheme).subscribe(
      (response) => {
        this.allInScheme = response[CommonConstant.ReturnObj];
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterCalcMethod).subscribe(
      (response) => {
        this.allCalcMethod = response[CommonConstant.ReturnObj];
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterAppPaidBy).subscribe(
      (response) => {
        this.allPaidby = response[CommonConstant.ReturnObj];
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterRecourseType).subscribe(
      (response) => {
        this.allRecourseType = response[CommonConstant.ReturnObj];
      });

    await this.CheckInstType();
  }


  async SetPayFreq(MouCustId: number, isInit: boolean) {
    await this.http.post<MouCustDlrFinObj>(URLConstant.GetMouCustDlrFindById, { Id: MouCustId }).toPromise().then(
      async (response) => {
        this.mouCustDlrFinObj = response;
        this.IsMouSelect = true;

        this.isSingle = this.mouCustDlrFinObj.MrInstTypeCode != CommonConstant.InstTypeMultiple;
      });

    let payFreqCode;
    if (!this.isSingle) {
      const listPayFreqCode = this.mouCustDlrFinObj.PayFreqCode.split(';');
      this.listPayFreq = this.listAllActivePayFreq.filter(x => listPayFreqCode.includes(x.PayFreqCode));

      if (this.listPayFreq.length == 1) {
        payFreqCode = this.listPayFreq[0].PayFreqCode;
        this.SalesAppInfoForm.controls.PayFreqCode.disable();
      } else {
        payFreqCode = '';
        this.SalesAppInfoForm.controls.PayFreqCode.enable();
      }
    } else {
      payFreqCode = this.mouCustDlrFinObj.PayFreqCode
    }
    if (!isInit || this.mode == 'add') {
      this.SalesAppInfoForm.patchValue({
        TopDays: this.mouCustDlrFinObj.TopDays,
        PayFreqCode: payFreqCode,
        MrInstSchemeCode: CommonConstant.InstSchmRegularFix,
        MrInstTypeCode: this.mouCustDlrFinObj.MrInstTypeCode,
        MrWopCode: this.mouCustDlrFinObj.WopCode,
        IntrstRatePrcnt: this.mouCustDlrFinObj.InterestRatePrcnt,
        TopIntrstRatePrcnt: this.mouCustDlrFinObj.TopInterestRatePrcnt
      });
    } else {
      this.SalesAppInfoForm.patchValue({
        MrInstSchemeCode: CommonConstant.InstSchmRegularFix,
        MrInstTypeCode: this.mouCustDlrFinObj.MrInstTypeCode,
        MrWopCode: this.mouCustDlrFinObj.WopCode,
      });
    }

    this.changePaymentFreq();
    this.CheckInstType();

    this.SalesAppInfoForm.controls.MrInstTypeCode.disable();
  }

  changePaymentFreq() {
    const obj = { Code: this.SalesAppInfoForm.controls.PayFreqCode.value };
    this.http.post<RefPayFreqObj>(URLConstant.GetRefPayFreqByPayFreqCode, obj).subscribe(
      (response) => {
        this.payFreqObj = response;
        this.CalculateNumOfInst();
      }
    )
  }

  CalculateNumOfInst() {
    if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeMultiple) {
      let numOfInst;

      if (this.payFreqObj.PayFreqVal == null) {
        numOfInst = 0;
      } else {
        numOfInst = this.SalesAppInfoForm.controls.Tenor.value / this.payFreqObj.PayFreqVal;
      }

      this.SalesAppInfoForm.controls.NumOfInst.patchValue(numOfInst);
      this.salesAppInfoObj.NumOfInst = numOfInst;
    } else {
      this.SalesAppInfoForm.controls.NumOfInst.patchValue(1);
    }
  }

  CheckInstType() {
    if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == CommonConstant.InstTypeMultiple) {
      this.isSingle = false;
      this.SalesAppInfoForm.controls.Tenor.enable();
      this.SalesAppInfoForm.controls['TopDays'].clearValidators();
      this.SalesAppInfoForm.controls['TopDays'].updateValueAndValidity();
      if (this.mode != 'edit') {
        this.SalesAppInfoForm.controls.Tenor.setValue('');
      }
    } else {
      this.isSingle = true;
      this.SalesAppInfoForm.controls['TopDays'].setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);
      this.SalesAppInfoForm.controls['TopDays'].updateValueAndValidity();

      if (this.mode != 'edit') {
        this.SalesAppInfoForm.controls.Tenor.setValue(1);
      }
    }

    this.SalesAppInfoForm.controls.MrInstSchemeCode.disable();
    this.SalesAppInfoForm.controls.MrWopCode.disable();
    this.SalesAppInfoForm.controls.IsDisclosed.disable();

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
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = './assets/uclookup/NAP/lookupEmp.json';
    this.inputLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupObj.pagingJson = './assets/uclookup/NAP/lookupEmp.json';
    this.inputLookupObj.genericJson = './assets/uclookup/NAP/lookupEmp.json';
    this.inputLookupObj.jsonSelect = { SalesOfficerName: this.resultData.SalesOfficerName };
    this.inputLookupObj.nameSelect = this.resultData.SalesOfficerName;
    this.inputLookupObj.addCritInput = this.arrAddCrit;

    this.isInputLookupObj = true;
  }

  async makeNewLookupCriteria() {
    this.arrAddCrit = new Array<CriteriaObj>();

    const addCrit1 = new CriteriaObj();
    addCrit1.DataType = 'bit';
    addCrit1.propName = 're.IS_ACTIVE';
    addCrit1.restriction = AdInsConstant.RestrictionEq;
    addCrit1.value = '1';
    this.arrAddCrit.push(addCrit1);

    const addCrit2 = new CriteriaObj();
    addCrit2.DataType = 'bit';
    addCrit2.propName = 'ru.IS_ACTIVE';
    addCrit2.restriction = AdInsConstant.RestrictionEq;
    addCrit2.value = '1';
    this.arrAddCrit.push(addCrit2);

    const addCrit4 = new CriteriaObj();
    addCrit4.DataType = 'text';
    addCrit4.propName = 'ro.OFFICE_CODE';
    addCrit4.restriction = AdInsConstant.RestrictionIn;
    addCrit4.listValue = [this.resultData.OriOfficeCode];
    this.arrAddCrit.push(addCrit4);

    await this.GetGSValueSalesOfficer();

    this.makeLookUpObj();
  }

  async GetGSValueSalesOfficer() {
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeAppDataOfficer }).toPromise().then(
      (response) => {
        let addCrit3 = new CriteriaObj();
        addCrit3.DataType = "text";
        addCrit3.propName = "rbt.JOB_TITLE_CODE";
        addCrit3.restriction = AdInsConstant.RestrictionIn;
        addCrit3.listValue = [response.GsValue];
        this.arrAddCrit.push(addCrit3);
      }
    );
  }

  async loadData() {
    const obj = {
      Id: this.AppId
    }

    await this.http.post(URLConstant.GetAppById, obj).toPromise().then(
      (response: any) => {
        this.responseApp = response
      });

    const prodObj = {
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

        if (this.resultData.AppFinDataId != 0) {
          this.mode = 'edit';
        } else {
          this.mode = 'add';
        }
      });
    if (this.mode == 'edit') {
      if (this.resultData.PayFreqCode == null) {
        this.resultData.PayFreqCode = ''
      }

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
        IntrstRatePrcnt: this.resultData.InterestRatePrcnt,
        TopIntrstRatePrcnt: this.resultData.TopInterestRatePrcnt
      });
    }
    await this.setDropdown();
  }

  Cancel() {
    this.outputCancel.emit();
  }

  async SaveForm(): Promise<void> {
    this.salesAppInfoObj.MouCustId = this.SalesAppInfoForm.controls.MouCustId.value;
    if (this.salesAppInfoObj.MouCustId == 0 || this.salesAppInfoObj.MouCustId == null) {
      this.toastr.errorMessage(ExceptionConstant.NO_MOU);
      return
    }

    if (this.mouCustDlrFinObj.MrInstTypeCode == CommonConstant.InstTypeMultiple) {
      if (this.SalesAppInfoForm.controls.PayFreqCode.value == null || this.SalesAppInfoForm.controls.PayFreqCode.value == '') {
        this.toastr.errorMessage('Please select a Payment Frequency first');
        return
      }

      if (this.SalesAppInfoForm.controls.Tenor.value % this.payFreqObj.PayFreqVal != 0) {
        this.toastr.errorMessage('Tenor Needs to be multiple of ' + this.payFreqObj.PayFreqVal);
        return
      }
    }

    await this.http.post(URLConstant.GetMouCustById, { Id: this.SalesAppInfoForm.controls.MouCustId.value }).toPromise().then(
      async (result: MouCustObj) => {
        const endDt = new Date(result.EndDt);
        this.MaxEffDt = new Date(result.EndDt);
        let Tenor = this.SalesAppInfoForm.controls.Tenor.value;
        //DF selalu arrear
        this.MaxEffDt.setMonth(endDt.getMonth() - Tenor)
        if (this.MaxEffDt.getDate() != endDt.getDate()) { //untuk perhitungan bulan kabisat / tgl 31 ke tgl 30
          this.MaxEffDt.setDate(0);
        }

      }
    );
    const businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    if (businessDt.getTime() > this.MaxEffDt.getTime()) {
      this.toastr.warningMessage('Tenor Exceeded MOU Expired Date');
      return;
    }

    if (this.SalesAppInfoForm.value.CharaCredit != CommonConstant.CharacteristicOfCreditTypeCredit) {
      this.SalesAppInfoForm.patchValue({
        PrevAgrNo: null,
        WayRestructure: null
      });
    }

    this.salesAppInfoObj = this.SalesAppInfoForm.getRawValue();
    this.salesAppInfoObj.AppId = this.AppId;

    this.salesAppInfoObj.listAppCrossObj = this.GetListAppCrossValue();

    if (this.salesAppInfoObj.MrInstTypeCode == CommonConstant.InstTypeSingle) {
      this.salesAppInfoObj.MrInstSchemeCode = CommonConstant.InstSchmEvenPrincipal;
      this.salesAppInfoObj.NumOfInst = 1;
      this.isSingle = true;
    } else {
      this.salesAppInfoObj.MrInstSchemeCode = CommonConstant.InstSchmEvenPrincipal;
      this.salesAppInfoObj.NumOfInst = this.SalesAppInfoForm.controls.NumOfInst.value;
      this.isSingle = false;
    }
    this.salesAppInfoObj.AppDlrFncngObj = new AppDlrFncng();
    this.salesAppInfoObj.AppDlrFncngObj.TopBased = this.SalesAppInfoForm.controls.TopBased.value;
    this.salesAppInfoObj.AppDlrFncngObj.TopDays = this.SalesAppInfoForm.controls.TopDays.value;
    this.salesAppInfoObj.AppDlrFncngObj.TopInterestRatePrcnt = this.SalesAppInfoForm.controls.TopIntrstRatePrcnt.value;
    this.salesAppInfoObj.AppDlrFncngObj.InterestRatePrcnt = this.SalesAppInfoForm.controls.IntrstRatePrcnt.value;
    this.http.post(URLConstant.GetMouCustDlrFindById, { Id: this.salesAppInfoObj.MouCustId }).subscribe(
      (responseMouCustDlrFncng) => {
        this.salesAppInfoObj.AppDlrFncngObj.MouCustDlrFncngId = responseMouCustDlrFncng['MouCustDlrFncngId'];

        if (this.SalesAppInfoForm.controls.MrWopCode.value == this.wopCodeAutoDebit) {
          this.SaveAppOtherInfo();
        }

        if (this.mode == 'add') {
          this.http.post(URLConstant.SaveApplicationDataDF, this.salesAppInfoObj).subscribe(
            (response) => {
              if (response['StatusCode'] == 200) {
                this.toastr.successMessage(response['message']);
                this.outputTab.emit();
              } else {
                this.toastr.warningMessage(response['message']);
              }
            });
        } else {
          this.salesAppInfoObj.AppRowVersion = this.resultData.AppRowVersion;
          this.salesAppInfoObj.AppFinDataRowVersion = this.resultData.AppFinDataRowVersion;
          this.http.post(URLConstant.EditApplicationDataDF, this.salesAppInfoObj).subscribe(
            (response) => {
              if (response['StatusCode'] == 200) {
                this.toastr.successMessage(response['message']);
                this.outputTab.emit();
              } else {
                this.toastr.warningMessage(response['message']);
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

  closeResult: string;

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
      let tempCrossApp = new NapAppCrossObj();
      tempCrossApp.CrossAgrmntNo = i.AgrmntNo;
      tempCrossApp.CrossAppNo = i.AppNo;
      tempCrossApp.CustName = i.CustName;
      tempCrossApp.ContractStat = i.AgrmntStat;
      this.resultCrossApp.push(tempCrossApp);
      this.ListCrossAppObj['result'].push(i.AgrmntNo);
    }
  }

  DeleteCrossApp(idx) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      if (this.resultCrossApp[idx].AppCrossId != null) {
        const obj: NapAppCrossObj = this.resultCrossApp[idx];
        this.http.post(URLConstant.DeleteAppCross, obj).subscribe(
          (response) => {
          }
        )
      }
      this.resultCrossApp.splice(idx, 1);
      this.ListCrossAppObj['result'].splice(idx, 1);
    }
  }

  //#region  BANK ACC
  GetListAppCustBankAcc() {
    this.http.post<any>(URLConstant.GetAppCustByAppId, { Id: this.AppId }).subscribe(
      (responseAppCust) => {
        this.appCustId = responseAppCust['AppCustId']
        const obj = {
          Id: this.appCustId
        };

        this.http.post<any>(URLConstant.GetListAppCustBankAccByAppCustId, obj).subscribe(
          (response) => {
            let Responses = response['ReturnObject'];
            this.listCustBankAcc = Responses.AppCustBankAccObjs;
          });
      });
  }

  GetBankAccCust() {
    this.http.post(URLConstant.GetAppOtherInfoByAppId, { AppId: this.AppId }).subscribe(
      (responseAoi) => {
        const objectForAppCustBankAcc = {
          BankCode: responseAoi['BankCode'],
          BankAccNo: responseAoi['BankAccNo'],
          AppCustId: this.appCustId
        }
        this.http.post(URLConstant.GetAppCustBankAccByBankAccNoAndBankCodeAndAppCustId, objectForAppCustBankAcc).subscribe(
          (response: any) => {
            this.SalesAppInfoForm.patchValue({
              CustBankAcc: response['AppCustBankAccId']
            });
            this.GetBankInfo = {
              BankCode: response['BankCode'],
              BankBranch: response['BankBranch'],
              AppId: this.AppId,
              BankAccNo: response['BankAccNo'],
              BankAccName: response['BankAccName']
            };
          });
      });
  }

  selectedBank(event) {
    if (this.SalesAppInfoForm.controls.MrWopCode.value == this.wopCodeAutoDebit) {
      this.SalesAppInfoForm.controls['CustBankAcc'].setValidators([Validators.required]);
      this.SalesAppInfoForm.controls['CustBankAcc'].updateValueAndValidity()
      this.selectedBankAcc = this.listCustBankAcc.find(x => x.AppCustBankAccId == event);
      this.GetBankInfo = {
        BankCode: this.selectedBankAcc.BankCode,
        BankBranch: this.selectedBankAcc.BankBranch,
        AppId: this.AppId,
        BankAccNo: this.selectedBankAcc.BankAccNo,
        BankAccName: this.selectedBankAcc.BankAccName,
        AdditionalInterestPaidBy: ''
      };
    } else {
      this.SalesAppInfoForm.controls['CustBankAcc'].clearValidators();
      this.SalesAppInfoForm.controls['CustBankAcc'].updateValueAndValidity()
    }
  }

  SaveAppOtherInfo() {
    if (this.GetBankInfo != undefined && this.GetBankInfo != '' && this.GetBankInfo.BankAccName != null && this.GetBankInfo.BankAccNo != null && this.GetBankInfo.BankBranch != null && this.GetBankInfo.BankCode != null && this.GetBankInfo.AppId != 0) {
      this.http.post<any>(URLConstant.AddAppOtherInfo, this.GetBankInfo).subscribe(
        error => {
          console.log(error);
        }
      )
    } else {
      this.GetBankInfo = {
        BankCode: '',
        BankBranch: '',
        AppId: this.AppId,
        BankAccNo: '',
        BankAccName: '',
      };
      this.http.post<any>(URLConstant.AddAppOtherInfo, this.GetBankInfo).subscribe(
        (response) => {
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  setBankAcc(event) {
    if (event == this.wopCodeAutoDebit) {
      this.SalesAppInfoForm.controls['CustBankAcc'].setValidators([Validators.required]);
    } else {
      this.SalesAppInfoForm.controls['CustBankAcc'].clearValidators();
    }
    this.SalesAppInfoForm.controls.CustBankAcc.updateValueAndValidity();
  }

  //#endregion

  GetCrossInfoData() {
    this.http.post(URLConstant.GetListAppCross, { Id: this.AppId }).subscribe(
      (response) => {
        this.resultCrossApp = response[CommonConstant.ReturnObj];
        for (let i = 0; i < this.resultCrossApp.length; i++) {
          this.ListCrossAppObj['result'].push(this.resultCrossApp[i].CrossAgrmntNo);
        }
      });
  }

  GetListAppCrossValue() {
    let arr = [];
    for (let i = 0; i < this.resultCrossApp.length; i++) {
      let temp = new NapAppCrossObj();
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
