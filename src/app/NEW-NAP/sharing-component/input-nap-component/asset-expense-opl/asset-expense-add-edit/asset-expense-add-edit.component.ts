import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { AppAssetAccessoryObj } from 'app/shared/model/AppAssetAccessoryObj.model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { AppInsuranceObj } from 'app/shared/model/AppInsuranceObj.Model';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';
import { InsuranceDataInsRateRuleObj } from 'app/shared/model/InsuranceDataInsRateRuleObj.Model';
import { AppInsMainCvgObj } from 'app/shared/model/AppInsMainCvgObj.Model';
import { ResultSubsidySchmRuleObj } from 'app/shared/model//SubsidySchm/ResultSubsidySchmRuleObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { AppCollateralAccessoryObj } from 'app/shared/model/AppCollateralAccessoryObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InsRateAddCvgRuleObj } from 'app/shared/model/InsRateAddCvgRuleObj.Model';
import { InputLookupObj } from '../../../../../shared/model/InputLookupObj.Model';
import { environment } from '../../../../../../environments/environment';
import { GeneralSettingObj } from '../../../../../shared/model/GeneralSettingObj.Model';
import { AppAssetExpenseDataObj } from '../../../../../shared/model/AppAssetExpense/AppAssetExpenseDataObj.Model';
import { AppAssetMaintDObj } from '../../../../../shared/model/AppAssetExpense/AppAssetMaintDObj.Model';
import { AppAssetOthExpenseOplObj } from '../../../../../shared/model/AppAssetExpense/AppAssetOthExpenseOplObj.Model';
import { AppAssetFeeOplObj } from '../../../../../shared/model/AppAssetExpense/AppAssetFeeOplObj.Model';
import { ResultAssetInsRuleObj } from '../../../../../shared/model/InsuranceOpl/ResultAssetInsRuleObj.Model';
import { InsFeeObj } from '../../../../../shared/model/InsuranceOpl/InsFeeObj.Model';
import { ResultCalcInsObj } from '../../../../../shared/model/InsuranceOpl/ResultCalcInsObj.Model';
import { RequestCalcInsObj } from '../../../../../shared/model/InsuranceOpl/RequestCalcInsObj.Model';
import { CalcInsMainCvgObj } from '../../../../../shared/model/InsuranceOpl/CalcInsMainCvgObj.Model';
import { CalcInsAddCvgObj } from '../../../../../shared/model/InsuranceOpl/CalcInsAddCvgObj.Model';
import { AppAssetInsMainCvgOplObj } from '../../../../../shared/model/AppAssetExpense/AppAssetInsMainCvgOplObj.Model';
import { AppAssetInsFeeOplObj } from '../../../../../shared/model/AppAssetExpense/AppAssetInsFeeOplObj.Model';
import { AppAssetInsAddCvgOplObj } from '../../../../../shared/model/AppAssetExpense/AppAssetInsAddCvgOplObj.Model';
import { AdInsHelper } from '../../../../../shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { UcDropdownListCallbackObj, UcDropdownListConstant, UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { InsAddCvgObj } from 'app/shared/model/InsuranceOpl/InsAddCvgObj.Model';

@Component({
  selector: 'app-asset-expense-add-edit',
  templateUrl: './asset-expense-add-edit.component.html'
})

export class AssetExpenseAddEditComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() showCancel: boolean = true;
  @Output() backToPaging: EventEmitter<any> = new EventEmitter();
  appCollateralId: number = 0;
  totalAssetPriceAmt: number;
  defaultInsAssetRegion: string;
  IsMultiAsset: string = "false";
  isCanBeAddedMaintenance: boolean = true;
  InputLookupServiceObj: any;
  InputLookupServiceObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  dictServiceLookup: { [key: string]: any; } = {};
  items: FormArray;
  InputLookupSparePartObj: any;
  InputLookupSparePartObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  dictSparePartLookup: { [key: string]: any; } = {};

  dictOtherExpense: { [key: string]: any; } = {};
  dictFee: { [key: string]: any; } = {};

  appObj: NapAppModel;
  appAssetObj: AppAssetObj;
  appAssetAccessoryObjs: Array<AppAssetAccessoryObj>;
  appFinDataObj: AppFinDataObj;
  appInsuranceObj: AppInsuranceObj;
  appInsObjObj: AppInsObjObj;
  appInsMainCvgObj: Array<AppInsMainCvgObj>;
  appCollateralObj: AppCollateralObj;
  appCollateralAccessoryObjs: Array<AppCollateralAccessoryObj>;
  ruleObj: ResultAssetInsRuleObj;
  subsidyRuleObj: ResultSubsidySchmRuleObj;
  calcInsObj: ResultCalcInsObj;
  saveObj: AppAssetExpenseDataObj;
  tpl: Array<InsAddCvgObj> = new Array<InsAddCvgObj>();
  minInsLength: number = 1;
  maxInsLength: number = 9999;
  isCanSave: boolean = true;
  insuredByObj: Array<KeyValueObj>;
  paidByObj: Array<KeyValueObj>;
  packageTypeRuleObj: any;
  packageDetailObj: any;
  insMainCvgTypeObj: Array<KeyValueObj>;
  otherExpenseObj: Array<KeyValueObj>;
  feeObj: Array<KeyValueObj>;
  inpFeeObj: Array<KeyValueObj>;
  insMainCvgTypeRuleObj = [{
    Key: "",
    Value: ""
  }];
  addDdl: [{
    Key: "",
    Value: ""
  }];
  insAddCvgTypeObj: any;
  insAddCvgTypeRuleObj: [{
    Key: "",
    Value: ""
  }];
  groupedAddCvgType: Array<string>;
  groupedAddCvgTypeDDL: Array<string>;
  ddlInsAssetCoverPeriodObj: UcDropdownListObj = new UcDropdownListObj();
  ddlInsAssetRegionObj: UcDropdownListObj = new UcDropdownListObj();
  ddlInscoBranchObj: UcDropdownListObj = new UcDropdownListObj();
  ddlInsMainCvgTypeRuleObj: UcDropdownListObj = new UcDropdownListObj();
  ddlTplSumInsuredAmtObj: UcDropdownListObj = new UcDropdownListObj();
  isDdlinsMainCvgTypeRuleReady: boolean = false;
  isDdlInscoBranchReady: boolean = false;
  payPeriodToInscoObj: Array<KeyValueObj>;
  defaultInsMainCvgType: string;
  tplAmtObjs: Array<KeyValueObj> = new Array<KeyValueObj>();
  insRateAddCvgRuleTplObjs: Array<InsRateAddCvgRuleObj>;
  showGenerate: boolean = false;
  isGenerate: boolean = false;
  isCalculate: boolean = false;
  businessDt: Date = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
  isLookupDisable: boolean = false;
  maintBehaCode: string = "";
  InsuranceDataForm = this.fb.group({
    InsAssetCoveredBy: ['CO', [Validators.required, Validators.maxLength(50)]],
    InsAssetPaidBy: ['CO', [Validators.required, Validators.maxLength(50)]],
    InsAssetPaidByName: ['Multifinance'],
    InsAssetCoverPeriod: ['', [Validators.required, Validators.maxLength(50)]],
    InscoBranchCode: ['', [Validators.required, Validators.maxLength(100)]],
    InscoBranchName: [''],
    CustInscoBranchName: ['', [Validators.maxLength(100)]],
    InsPolicyNo: ['', Validators.maxLength(50)],
    InsPolicyName: ['', Validators.maxLength(100)],
    CustCoverStartDt: ['', Validators.required],
    EndDt: ['', Validators.required],
    Notes: ['', Validators.maxLength(4000)],
    CustNotes: ['', Validators.maxLength(4000)],
    InsMainCvgType: [''],
    InsAddCvgTypes: new FormArray([]),
    InsLength: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
    InsAssetRegion: ['', [Validators.required, Validators.maxLength(50)]],
    AppInsMainCvgs: new FormArray([]),
    TotalCustFeeAmt: [0],
    TotalCustMainPremiAmt: [0],
    TotalCustAddPremiAmt: [0],
    TotalInscoMainPremiAmt: [0],
    TotalInscoAddPremiAmt: [0],
    InscoAdminFeeAmt: [0],
    CustAdminFeeAmt: [0],
    CustStampDutyFeeAmt: [0],
    InscoStampDutyFeeAmt: [0],
    TotalInsInscoAmt: [0],
    CvgAmt: [0, Validators.required],
    CustCvgAmt: [0, Validators.required],
    TotalCustDiscAmt: [0],
    InsCpltzAmt: [0],
    PayPeriodToInsco: [''],
    IsFullCapitalizedAmount: [false],
    items: this.fb.array([]),
    ServiceObjs: this.fb.array([]),
    SparePartObjs: this.fb.array([]),
    OtherExpenseObjs: this.fb.array([]),
    FeeObjs: this.fb.array([]),
    PackageType: [''],
    FeeInputType: [''],
    TotalServiceAmt: [0],
    TotalSparepartAmt: [0],
    TotalOthExpenseAmt: [0],
    TotalFeeBfrVATAmt: [0],
    TotalVATAmt: [0],
    TotalFeeCptlzAmt: [0],
    TotalAssetExpense: [0],
    InsDiscAmt: [0],
    SumInsuredTplAmt: ['']
  });
  isMainPackageReady: boolean = false;
  isTpl: boolean = false;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppAssetId"] != null) this.AppAssetId = params["AppAssetId"];
    })
  }
  async ngOnInit(): Promise<void> {
    //this.InsuranceDataForm.removeControl("ServiceObjs");
    //this.InsuranceDataForm.addControl("ServiceObjs", this.fb.array([]));
    this.ddlInsMainCvgTypeRuleObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
    this.ddlInsMainCvgTypeRuleObj.isSelectOutput = true;
    this.ddlTplSumInsuredAmtObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
    this.items = this.InsuranceDataForm.get('items') as FormArray;
    this.bindInsAssetCoverPeriodObj();
    this.bindInsAssetRegionObj();
    await this.getMainPackage();
    await this.addFee();
    await this.getOtherExpense();
    await this.getOtherExpenseFromRule();
    await this.getInputFeeExpense();
    await this.bindInsMainCvgTypeObj();
    await this.bindInsAddCvgTypeObj();
    await this.bindInsuredByObj();
    await this.bindPaidByObj();
    await this.getInsuranceData();
    this.bindInscoBranchObj();
    await this.bindPayPeriodToInscoObj();
    this.setValidator(CommonConstant.InsuredByCompany);
  }

  SaveForm() {
    if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCompany) {
      var insDiscAmt = this.InsuranceDataForm.controls.InsDiscAmt.value;
      var totalPremi = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value + this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value + this.InsuranceDataForm.controls.TotalCustFeeAmt.value;
      if (this.isGenerate == false) {
        this.toastr.warningMessage(ExceptionConstant.CLICK_GENERATE_INSURANCE);
        return;
      }
      if (this.isCalculate == false) {
        this.toastr.warningMessage(ExceptionConstant.CLICK_CALCULATE_INSURANCE);
        return;
      }
      if (insDiscAmt > totalPremi) {
        this.toastr.warningMessage(ExceptionConstant.DISCOUNT_AMOUNT_CANNOT_HIGHER_THAN + "Total Premi.");
        return;
      }
    }
    this.setSaveObj();
    if (this.isCanSave) {
      this.http.post(URLConstant.SubmitAssetExpense, this.saveObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.backToPaging.emit();
        });
    }
  }

  Cancel() {
    this.backToPaging.emit();
  }

  setSaveObj() {
    this.isCanSave = true;
    this.saveObj = new AppAssetExpenseDataObj();
    this.saveObj.AppAssetId = this.AppAssetId;
    this.saveObj.AppAssetMaintHObj.AppAssetId = this.AppAssetId;
    this.saveObj.AppAssetMaintHObj.MrMaintPackageCode = this.InsuranceDataForm.controls.PackageType.value;
    this.saveObj.AppAssetMaintHObj.TotalServiceAmt = this.InsuranceDataForm.controls.TotalServiceAmt.value;
    this.saveObj.AppAssetMaintHObj.TotalSparepartAmt = this.InsuranceDataForm.controls.TotalSparepartAmt.value;
    this.saveObj.AppAssetMaintHObj.AppAssetMaintBehaviourCode = this.maintBehaCode;
    this.saveObj.AppAssetMaintHObj.IsAddable = this.isCanBeAddedMaintenance;
    //Maintenance
    for (let i = 0; i < this.InsuranceDataForm.controls["ServiceObjs"]["controls"].length; i++) {
      var mainpackageservice = new AppAssetMaintDObj();
      var x = this.InsuranceDataForm["controls"]["ServiceObjs"]["controls"].filter(x => x["controls"]["ServiceCode"].value == this.InsuranceDataForm["controls"]["ServiceObjs"]["controls"][i]["controls"]["ServiceCode"].value)
      if (x.length > 1) {
        this.toastr.warningMessage("Cant Input Same Service");
        this.isCanSave = false;
        return;
      }
      mainpackageservice.MrServiceCode = this.InsuranceDataForm["controls"]["ServiceObjs"]["controls"][i]["controls"]["ServiceCode"].value;
      mainpackageservice.FeeAmt = this.InsuranceDataForm["controls"]["ServiceObjs"]["controls"][i]["controls"]["ServiceAmt"].value;
      this.saveObj.AppAssetMaintHObj.ServiceObjs.push(mainpackageservice);
    }
    for (let i = 0; i < this.InsuranceDataForm.controls["SparePartObjs"]["controls"].length; i++) {
      var mainpackageservice = new AppAssetMaintDObj();
      var y = this.InsuranceDataForm["controls"]["SparePartObjs"]["controls"].filter(x => x["controls"]["SparePartCode"].value == this.InsuranceDataForm["controls"]["SparePartObjs"]["controls"][i]["controls"]["SparePartCode"].value)
      if (y.length > 1) {
        this.toastr.warningMessage("Cant Input Same Sparepart");
        this.isCanSave = false;
        return;
      }
      mainpackageservice.MrSparepartCode = this.InsuranceDataForm["controls"]["SparePartObjs"]["controls"][i]["controls"]["SparePartCode"].value;
      mainpackageservice.FeeAmt = this.InsuranceDataForm["controls"]["SparePartObjs"]["controls"][i]["controls"]["SparePartAmt"].value;
      this.saveObj.AppAssetMaintHObj.SparepartObjs.push(mainpackageservice);
    }
    //Other Expense
    for (let i = 0; i < this.InsuranceDataForm.controls["OtherExpenseObjs"]["controls"].length; i++) {
      var othExpense = new AppAssetOthExpenseOplObj();
      var z = this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"].filter(x => x["controls"]["OthExpenseCode"].value == this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseCode"].value)
      if (z.length > 1) {
        this.toastr.warningMessage("Cant Input Same Other Expense");
        this.isCanSave = false;
        return;
      }
      othExpense.AppAssetId = this.AppAssetId;
      othExpense.MrOthExpenseTypeOplCode = this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseCode"].value;
      othExpense.OthExpenseAmt = this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseAmt"].value;
      othExpense.OthExpBehaviourCode = this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["BehaviourCode"].value;
      othExpense.IsAddable = this.isExpenseCanAdd;

      this.saveObj.AppAssetOthExpenseOplObjs.push(othExpense);
    }
    //Fee
    for (let i = 0; i < this.InsuranceDataForm.controls["FeeObjs"]["controls"].length; i++) {
      var fee = new AppAssetFeeOplObj();
      fee.AppAssetId = this.AppAssetId;
      fee.FeeCode = this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeCode"].value;
      if (this.InsuranceDataForm["controls"]["FeeInputType"].value == "VAT") {
        fee.FeeAmt = this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeAmt"].value / 1.1;
      }
      else {
        fee.FeeAmt = this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeAmt"].value;
      }
      fee.VatAmt = this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["VATAmt"].value;
      fee.CapitalizedAmt = this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["CptlzAmt"].value;
      fee.FeeBehaviourCode = this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeBehaviour"].value;
      fee.FeeCapBehaviourCode = this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["CptlzBehaviour"].value;
      this.saveObj.AppAssetFeeOplObjs.push(fee);
    }

    this.saveObj.AppAssetInsOplObj.InsAssetPaidBy = this.InsuranceDataForm.controls.InsAssetPaidBy.value;
    this.saveObj.AppAssetInsOplObj.InscoBranchCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    this.saveObj.AppAssetInsOplObj.MrInsCoverPeriodCode = this.InsuranceDataForm.controls.InsAssetCoverPeriod.value;
    this.saveObj.AppAssetInsOplObj.InsLength = this.InsuranceDataForm.controls.InsLength.value;
    this.saveObj.AppAssetInsOplObj.CvgAmt = this.InsuranceDataForm.controls.CvgAmt.value;
    this.saveObj.AppAssetInsOplObj.Notes = this.InsuranceDataForm.controls.Notes.value;
    this.saveObj.AppAssetInsOplObj.InsAssetRegion = this.InsuranceDataForm.controls.InsAssetRegion.value;
    this.saveObj.AppAssetInsOplObj.TotalCustMainPremiAmt = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value;
    this.saveObj.AppAssetInsOplObj.TotalCustAddPremiAmt = this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value;
    this.saveObj.AppAssetInsOplObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
    this.saveObj.AppAssetInsOplObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
    this.saveObj.AppAssetInsOplObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
    this.saveObj.AppAssetInsOplObj.TotalInsCustAmt = this.saveObj.AppAssetInsOplObj.TotalCustMainPremiAmt + this.saveObj.AppAssetInsOplObj.TotalCustAddPremiAmt + this.InsuranceDataForm.controls.TotalCustFeeAmt.value - this.saveObj.AppAssetInsOplObj.TotalCustDiscAmt;
    this.saveObj.AppAssetInsOplObj.InsDiscAmt = this.InsuranceDataForm.controls.InsDiscAmt.value;

    var addedTenor = 0;

    for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
      var insCoverage = new AppAssetInsMainCvgOplObj();
      insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
      insCoverage.Tenor = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
      insCoverage.MrMainCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;

      addedTenor += insCoverage.Tenor;

      insCoverage.SumInsuredPrcnt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredPrcnt.value;
      insCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredAmt.value;
      insCoverage.CustMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiRate.value;
      insCoverage.InscoMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiRate.value;
      insCoverage.CustMainPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiAmt.value;
      insCoverage.InscoMainPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiAmt.value;
      insCoverage.TotalCustAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].TotalCustAddPremiAmt.value;
      insCoverage.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].TotalInscoAddPremiAmt.value;
      insCoverage.TotalInsInscoAmt = insCoverage.InscoMainPremiAmt + insCoverage.TotalInscoAddPremiAmt;

      for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
        if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true) {
          var addCoverage = new AppAssetInsAddCvgOplObj();

          addCoverage.MrAddCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
          addCoverage.SumInsuredPrcnt = insCoverage.SumInsuredPrcnt;

          if(addCoverage.MrAddCvgTypeCode == CommonConstant.MrAddCvgTypeCodeTpl){
            addCoverage.SumInsuredAmt = +this.InsuranceDataForm.controls.SumInsuredTplAmt.value;
          }else{
            addCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SumInsuredAmt.value;
          }

          if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value == CommonConstant.PremiumTypeAmt) {
            addCoverage.InscoAddPremiRate = 0;
            addCoverage.CustAddPremiPrcnt = 0;
          }else if(addCoverage.MrAddCvgTypeCode == CommonConstant.MrAddCvgTypeCodeTpl){
            var addCvgTplObj = this.tpl.find(x => x.SumInsuredAmt == addCoverage.SumInsuredAmt);

            addCoverage.InscoAddPremiRate = addCvgTplObj.PremiToInsco;
            addCoverage.CustAddPremiPrcnt = addCvgTplObj.PremiToCust;
          }else{
            addCoverage.InscoAddPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiRate.value;
            addCoverage.CustAddPremiPrcnt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiRate.value;
          }

          addCoverage.InscoAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiAmt.value;
          addCoverage.CustAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiAmt.value;
          insCoverage.AppAssetInsAddCvgOplObjs.push(addCoverage);
        }
      }
      this.saveObj.AppAssetInsOplObj.AppAssetInsMainCvgOplObjs.push(insCoverage);
    }

    for (let i = 0; i < this.InsuranceDataForm.controls["items"]["controls"].length; i++) {
      var insFee = new AppAssetInsFeeOplObj();
      insFee.MrInsFeeTypeCode = this.InsuranceDataForm.controls["items"]["controls"][i]["controls"].Code.value;
      insFee.FeeAmt = this.InsuranceDataForm.controls["items"]["controls"][i]["controls"].Value.value;
      insFee.CustFeeAmt = 0;
      this.saveObj.AppAssetInsOplObj.TotalInscoFeeAmt = this.saveObj.AppAssetInsOplObj.TotalInscoFeeAmt + insFee.FeeAmt;
      this.saveObj.AppAssetInsOplObj.TotalCustFeeAmt = this.saveObj.AppAssetInsOplObj.TotalCustFeeAmt + insFee.FeeAmt;
      this.saveObj.AppAssetInsOplObj.AppAssetInsFeeOplObjs.push(insFee);
    }
    this.saveObj.AppAssetInsOplObj.TotalInsInscoAmt = this.saveObj.AppAssetInsOplObj.TotalInscoMainPremiAmt + this.saveObj.AppAssetInsOplObj.TotalInscoAddPremiAmt + this.saveObj.AppAssetInsOplObj.TotalInscoFeeAmt - this.saveObj.AppAssetInsOplObj.InsDiscAmt;
  }

  async CalculateInsurance() {
    this.ApplyToCoverage();
    if (this.isGenerate == true) {
      var reqObj = new RequestCalcInsObj();
      for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
        var insCoverage = new CalcInsMainCvgObj();

        insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
        insCoverage.Month = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
        insCoverage.CoverageAmt = this.InsuranceDataForm.controls.CvgAmt.value;
        insCoverage.SumInsured = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredPrcnt.value;
        insCoverage.Rate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiRate.value;
        insCoverage.MainCoverageTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;
        insCoverage.RateToInsco = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiRate.value;

        for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
          if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true) {
            var addCoverage = new CalcInsAddCvgObj();

            addCoverage.BaseCalculation = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].BaseCalculation.value;
            addCoverage.SumInsured = insCoverage.SumInsured;
            addCoverage.RateType = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value;
            addCoverage.AddCoverageTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;

            if(addCoverage.AddCoverageTypeCode == CommonConstant.MrAddCvgTypeCodeTpl){
              var sumInsuredAmt = +this.InsuranceDataForm.controls.SumInsuredTplAmt.value;
              var addCvgTplObj = this.tpl.find(x => x.SumInsuredAmt == sumInsuredAmt);
              addCoverage.Rate = addCvgTplObj.PremiToCust;
              addCoverage.RateToInsco = addCvgTplObj.PremiToInsco;
            }else{
              addCoverage.Rate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiRate.value;
              addCoverage.RateToInsco = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiRate.value;
            }

            insCoverage.AddInsCoverage.push(addCoverage);
          }
        }
        reqObj.InsCoverage.push(insCoverage);
      }
      reqObj.AdminFee = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;
      reqObj.StampDutyFee = + this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
      reqObj.InscoBranchCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
      //reqObj.ProdOfferingCode = this.appObj.ProdOfferingCode;
      //reqObj.ProdOfferingVersion = this.appObj.ProdOfferingVersion;
      reqObj.ListFee = new Array<number>();
      for (var i = 0; i < this.items.length; i++) {
        if (this.items.controls[i] != null) {
          reqObj.ListFee.push(this.items.controls[i]["controls"]["Value"].value);
        }
      }

      reqObj.AppAssetId = this.AppAssetId;

      await this.http.post(URLConstant.CalculateAssetInsurance, reqObj).toPromise().then(
        (response) => {
          this.calcInsObj = response["Result"];
          //this.subsidyRuleObj = response["ResultSubsidy"];
          var custDiscAmt = 0;
          if (this.InsuranceDataForm.controls.InsAssetPaidBy.value == CommonConstant.InsuredByCompany) {
            custDiscAmt = this.calcInsObj.TotalMainPremiAmt + this.calcInsObj.TotalAdditionalPremiAmt + this.calcInsObj.TotalFeeAmt;
            this.InsuranceDataForm.patchValue({
              InsCpltzAmt: 0
            });
          }
          //else if (this.subsidyRuleObj != null) {
          //  if (this.subsidyRuleObj.SubsidyValue != null) {
          //    for (let i = 0; i < this.subsidyRuleObj.SubsidyValue.length; i++) {
          //      //if (this.subsidyRuleObj.SubsidyFromType[i] == "INS" && this.subsidyRuleObj.SubsidyFromValue[i] == this.InsuranceDataForm.controls.InscoBranchCode.value) {
          //      custDiscAmt += this.subsidyRuleObj.SubsidyValue[i];
          //      //}
          //    }
          //  }
          //}

          this.InsuranceDataForm.patchValue({
            TotalInsInscoAmt: this.calcInsObj.TotalFeeAmt + this.calcInsObj.TotalMainPremiToInscoAmt + this.calcInsObj.TotalAdditionalPremiToInscoAmt,
            TotalCustFeeAmt: this.calcInsObj.TotalFeeAmt,
            TotalCustMainPremiAmt: this.calcInsObj.TotalMainPremiAmt,
            TotalCustAddPremiAmt: this.calcInsObj.TotalAdditionalPremiAmt,
            TotalInscoMainPremiAmt: this.calcInsObj.TotalMainPremiToInscoAmt,
            TotalInscoAddPremiAmt: this.calcInsObj.TotalAdditionalPremiToInscoAmt,
            TotalCustDiscAmt: custDiscAmt
          });

          for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
            this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
              CustMainPremiRate: this.calcInsObj.InsCoverage[i].Rate,
              InscoMainPremiRate: this.calcInsObj.InsCoverage[i].RateToInsco,
              SumInsuredAmt: this.calcInsObj.InsCoverage[i].SumInsuredAmt,
              CustMainPremiAmt: this.calcInsObj.InsCoverage[i].MainPremiAmt,
              InscoMainPremiAmt: this.calcInsObj.InsCoverage[i].MainPremiToInscoAmt,
              TotalInscoAddPremiAmt: this.calcInsObj.InsCoverage[i].AdditionalPremiToInscoAmt,
              TotalCustAddPremiAmt: this.calcInsObj.InsCoverage[i].AdditionalPremiAmt,
            });

            for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
              var currAddCvgType = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;

              if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true) {
                var currAddCvg = this.calcInsObj.InsCoverage[i].AddInsCoverage.find(x => x.AddCoverageTypeCode == currAddCvgType);

                var sumInsuredAmt = currAddCvg.SumInsuredAmt;
                if (currAddCvgType == CommonConstant.MrAddCvgTypeCodeTpl) {
                  sumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SumInsuredAmt.value;
                }

                this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
                  CustAddPremiRate: currAddCvg.Rate,
                  InscoAddPremiRate: currAddCvg.RateToInsco,
                  SumInsuredAmt: sumInsuredAmt,
                  CustAddPremiAmt: currAddCvg.AddPremiAmt,
                  InscoAddPremiAmt: currAddCvg.AddPremiToInscoAmt
                });
              } else {
                var sumInsuredAmt = 0;
                if (currAddCvgType == CommonConstant.MrAddCvgTypeCodeTpl) {
                  sumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SumInsuredAmt.value;
                }
                this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
                  SumInsuredAmt: sumInsuredAmt,
                  CustAddPremiAmt: 0,
                  InscoAddPremiAmt: 0
                });
              }
            }
            reqObj.InsCoverage.push(insCoverage);
          }
          this.isCalculate = true;
          this.calculateAssetExpense();
        }
      );
      this.BindCapitalize();
    }
    else {
      this.toastr.warningMessage("Please click Generate Insurance.");
    }
  }

  async GenerateInsurance(appInsMainCvgObj: Array<AppAssetInsMainCvgOplObj>) {
    if (appInsMainCvgObj == undefined) {
      if (this.InsuranceDataForm.controls.InscoBranchCode.value == "") {
        this.toastr.warningMessage("Please choose Insco Branch.");
        return;
      }
      if (this.InsuranceDataForm.controls.InsAssetPaidBy.value == "") {
        this.toastr.warningMessage("Please choose Paid By.");
        return;
      }
      if (this.InsuranceDataForm.controls.InsAssetRegion.value == "") {
        this.toastr.warningMessage("Please choose Region.");
        return;
      }
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == "") {
        this.toastr.warningMessage("Please choose Cover Period.");
        return;
      }
      if (this.InsuranceDataForm.controls.InsLength.value == "") {
        this.toastr.warningMessage("Please input Insurance Length.");
        return;
      }
      if (this.InsuranceDataForm.controls.InsLength.value < this.minInsLength) {
        this.toastr.warningMessage("Insurance Length must be higher than " + (this.minInsLength - 1).toString());
        return;
      }
      if (this.InsuranceDataForm.controls.InsLength.value > this.maxInsLength) {
        this.toastr.warningMessage("Insurance Length must be lower than " + (this.maxInsLength + 1).toString());
        return;
      }
      if (this.InsuranceDataForm.controls.CvgAmt.value < 1) {
        this.toastr.warningMessage("Coverage Amount cant be 0 or less");
        return;
      }
      // this.InsuranceDataForm.controls.InscoBranchCode.markAsTouched();
      // this.InsuranceDataForm.controls.InsAssetPaidBy.markAsTouched();
      // this.InsuranceDataForm.controls.InsAssetRegion.markAsTouched();
      // this.InsuranceDataForm.controls.InsAssetCoverPeriod.markAsTouched();
      // this.InsuranceDataForm.controls.CvgAmt.markAsTouched();
      // this.InsuranceDataForm.controls.InsLength.markAsTouched();
      // if(!this.InsuranceDataForm.valid){
      //   return;
      // }
    }
    var reqObj = new InsuranceDataInsRateRuleObj();
    reqObj.InscoCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    reqObj.RegionCode = this.InsuranceDataForm.controls.InsAssetRegion.value;
    reqObj.AppAssetId = this.AppAssetId;

    await this.http.post<ResultAssetInsRuleObj>(URLConstant.ExecuteInsRateRuleOpl, reqObj).toPromise().then(
      (response) => {
        this.ruleObj = response;
        if (this.ruleObj.Result == null || this.ruleObj.Result.InsAssetCategory == "") {
          this.toastr.warningMessage("Please setting rule first.");
          return;
        }
        this.tplAmtObjs = new Array<KeyValueObj>();
        this.tpl = this.ruleObj.InsRateAddCvgRuleObjs.filter(x => x.AdditionalCoverageType == "TPL");
        for (let i = 0; i < this.tpl.length; i++) {
          var tplAmtObj = new KeyValueObj();
          tplAmtObj.Key = this.tpl[i].SumInsuredAmt.toString();
          tplAmtObj.Value = (Math.round(this.tpl[i].SumInsuredAmt * 100) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          this.tplAmtObjs.push(tplAmtObj);
        }

        this.GenerateInsFee(this.ruleObj.InsRateFeeRuleObjs);
        if (appInsMainCvgObj != undefined) {
          this.bindInsMainCvgTypeRuleObj(appInsMainCvgObj[0].MrMainCvgTypeCode);
          this.addCheckbox(appInsMainCvgObj[0].AppAssetInsAddCvgOplObjs);
          var addCvgTpl = appInsMainCvgObj[0].AppAssetInsAddCvgOplObjs.find(x => x.MrAddCvgTypeCode == CommonConstant.MrAddCvgTypeCodeTpl);
          var tplAmt = 0;

          if(addCvgTpl != null && addCvgTpl != undefined){
            tplAmt = addCvgTpl.SumInsuredAmt;
          }

          this.CheckIsUseTpl(tplAmt);
          //this.bindInsAddCvgTypeRuleObj(appInsMainCvgObj);
          this.GenerateMainAndAddCvgTableFromDB(appInsMainCvgObj);
        }
        else {
          this.bindInsMainCvgTypeRuleObj("");
          this.addCheckbox(undefined);
          //this.bindInsAddCvgTypeRuleObj(undefined);
          this.GenerateMainAndAddCvgTable();
        }
        this.isGenerate = true;
        this.showGenerate = true;
      }
    );
    this.BindCapitalize();
  }
  feeTypeObj: Array<KeyValueObj>;
  GenerateInsFee(ListFee: Array<InsFeeObj>) {
    while (this.items.length) {
      this.items.removeAt(0);
    }
    for (let j = 0; j < ListFee.length; j++) {
      //var index = this.feeTypeObj.findIndex(x => x.Key == ListFee[j].InsFeeType);
      let eachDataDetail = this.fb.group({
        Value: [ListFee[j].InsFeeAmt, [Validators.required]],
        Code: [ListFee[j].InsFeeType]
      }) as FormGroup;
      this.items.push(eachDataDetail);

    }
  }

  GenerateMainAndAddCvgTable() {
    var ManufYearDiff = this.businessDt.getFullYear() - this.appAssetObj.ManufacturingYear;
    if (ManufYearDiff < 0) {
      ManufYearDiff = 0;
    }
    var yearCount = this.InsuranceDataForm.controls.InsLength.value;
    var noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);

    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);

    var month: number = 12;

    for (let i = 0; i < noOfYear; i++) {
      var obj = { Tenor: 0, SumInsuredPrcnt: 0, CustMainPremiRate: 0, InscoMainPremiRate: 0 };

      if (yearCount - 12 >= 0) {
        month = 12;
      } else {
        month = yearCount;
      }

      obj.Tenor = month;
      obj.SumInsuredPrcnt = this.ruleObj.Result.SumInsuredPercentage[i];
      var index = this.ruleObj.InsRateMainCvgRuleObjs.findIndex(x => x.MainCoverageType == this.InsuranceDataForm.controls.InsMainCvgType.value);
      obj.CustMainPremiRate = this.ruleObj.InsRateMainCvgRuleObjs[index].RateToCust;
      obj.InscoMainPremiRate = this.ruleObj.InsRateMainCvgRuleObjs[index].RateToInsco;
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroup(i, obj, ManufYearDiff, this.defaultInsMainCvgType));
      ManufYearDiff++;
      yearCount -= 12;
    }
  }

  GenerateMainAndAddCvgTableFromDB(appInsMainCvgObj: Array<AppAssetInsMainCvgOplObj>) {
    var ManufYearDiff = this.businessDt.getFullYear() - this.appAssetObj.ManufacturingYear;
    if (ManufYearDiff < 0) {
      ManufYearDiff = 0;
    }
    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);
    for (let i = 0; i < appInsMainCvgObj.length; i++) {
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroupFromDB(appInsMainCvgObj[i], ManufYearDiff));
      ManufYearDiff++;
    }
  }
  grpAddCvg: Array<string> = new Array<string>();
  bindInsAddCvgTypeRuleObj(mainCvg) {
  
    var ManufYearDiff = this.businessDt.getFullYear() - this.appAssetObj.ManufacturingYear;
    var noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);

    (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray) = this.fb.array([]);
    this.insAddCvgTypeRuleObj = [{ Key: "", Value: "" }];
    for (let i = 0; i < this.ruleObj.InsRateAddCvgRuleObjs.length; i++) {
      this.grpAddCvg.push(this.ruleObj.InsRateAddCvgRuleObjs[i].AdditionalCoverageType);
    }
    var addCvgLoading = this.ruleObj.InsRateAddCvgRuleObjs.filter(x => x.AdditionalCoverageType == CommonConstant.MrAddCvgTypeCodeLoading);
    var minAssetAgeFrom = Math.min.apply(null, addCvgLoading.map(item => item.AssetAgeFrom));
    this.groupedAddCvgType = Array.from(new Set(this.grpAddCvg));
    this.groupedAddCvgType.forEach((o) => {
      if (o == CommonConstant.MrAddCvgTypeCodeLoading) {
        var isLoadingExist = this.insAddCvgTypeRuleObj.find(x => x.Key == CommonConstant.MrAddCvgTypeCodeLoading);
        if (!isLoadingExist && ManufYearDiff + noOfYear >= minAssetAgeFrom) {          
          var item = this.insAddCvgTypeObj.find(x => x.Key == o);
          this.insAddCvgTypeRuleObj.push(item);
        }
      }
      else {
        var item = this.insAddCvgTypeObj.find(x => x.Key == o);
        this.insAddCvgTypeRuleObj.push(item);
      }
    });
    this.insAddCvgTypeRuleObj.splice(0, 1);
    //if (appInsMainCvgObj == undefined) {

    //}
    //else {
    //  this.addCheckbox(appInsMainCvgObj[0].AppAssetInsAddCvgOplObjs);
    //}
    this.bindAddCheckbox(mainCvg);
  }

  grpAddCvgCheckBox: Array<string> = new Array<string>();
  bindAddCheckbox(mainCvg) {
    var ManufYearDiff = this.businessDt.getFullYear() - this.appAssetObj.ManufacturingYear;
    var noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
    
    (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray) = this.fb.array([]);
    this.grpAddCvgCheckBox = new Array<string>();
    this.groupedAddCvgTypeDDL = new Array<string>();
    this.addDdl = [{ Key: "", Value: "" }];
    var filtered = this.ruleObj.InsRateAddCvgRuleObjs.filter(f => f.MainCoverageType == mainCvg);
    for (let i = 0; i < filtered.length; i++) {
      this.grpAddCvgCheckBox.push(filtered[i].AdditionalCoverageType);
    }
    var addCvgLoading = this.ruleObj.InsRateAddCvgRuleObjs.filter(x => x.AdditionalCoverageType == CommonConstant.MrAddCvgTypeCodeLoading);
    var minAssetAgeFrom = Math.min.apply(null, addCvgLoading.map(item => item.AssetAgeFrom));
    this.groupedAddCvgTypeDDL = Array.from(new Set(this.grpAddCvgCheckBox));
    this.groupedAddCvgTypeDDL.forEach((o) => {
      if (o == CommonConstant.MrAddCvgTypeCodeLoading) {
        var isLoadingExist = this.addDdl.find(x => x.Key == CommonConstant.MrAddCvgTypeCodeLoading);
        if (!isLoadingExist && ManufYearDiff + noOfYear >= minAssetAgeFrom) {
          var item = this.insAddCvgTypeObj.find(x => x.Key == o);
          this.addDdl.push(item);
        }
      }
      else {
        var item = this.insAddCvgTypeObj.find(x => x.Key == o);
        this.addDdl.push(item);
      }
    });
    this.addDdl.splice(0, 1);
  }
  bindInsMainCvgTypeRuleObj(maincvg: string) {
    this.insMainCvgTypeRuleObj = [{ Key: "", Value: "" }];
    this.ruleObj.InsRateMainCvgRuleObjs.forEach((o, i) => {
      if (i == 0) {
        this.defaultInsMainCvgType = o.MainCoverageType
      }

      var item = this.insMainCvgTypeObj.find(x => x.Key == o.MainCoverageType);
      this.insMainCvgTypeRuleObj.push(item);
    });
    this.insMainCvgTypeRuleObj.splice(0, 1);
    if (maincvg != "") {
      this.InsuranceDataForm.patchValue({
        InsMainCvgType: maincvg
      });
      this.bindInsAddCvgTypeRuleObj(maincvg);
    }
    else {
      this.InsuranceDataForm.patchValue({
        InsMainCvgType: this.defaultInsMainCvgType
      });
      this.bindInsAddCvgTypeRuleObj(this.defaultInsMainCvgType);
    }
  }

  addGroup(i, obj, ManufYearDiff, mainCvg) {
    var group = this.fb.group({
      YearNo: i + 1,
      Tenor: obj.Tenor,
      SumInsuredPrcnt: obj.SumInsuredPrcnt,
      SumInsuredAmt: 0,
      MrMainCvgTypeCode: mainCvg,
      CustMainPremiRate: obj.CustMainPremiRate,
      CustMainPremiAmt: 0,
      InscoMainPremiRate: obj.InscoMainPremiRate,
      InscoMainPremiAmt: 0,
      TotalInscoAddPremiAmt: 0,
      TotalCustAddPremiAmt: 0,
      ManufYearDiff: ManufYearDiff,
      AppInsAddCvgs: new FormArray([])
    });

    this.insAddCvgTypeRuleObj.forEach((o) => {
      var defaultSumInsuredAmt = 0;
      var filtered = this.ruleObj.InsRateAddCvgRuleObjs.filter(f => f.MainCoverageType == mainCvg);

      var index = filtered.findIndex(x => x.AdditionalCoverageType == o.Key);

      if (index != -1) {
        var premiumType = filtered[index].PremiumType;
        var custAddPremiRate = 0;
        var inscoAddPremiRate = 0;

        if (premiumType == CommonConstant.PremiumTypeAmt) {
          custAddPremiRate = filtered[index].PremiToCust;
          inscoAddPremiRate = filtered[index].PremiToInsco;
        }

        if (premiumType == CommonConstant.PremiumTypePrcnt) {
          custAddPremiRate = filtered[index].RateToCust;
          inscoAddPremiRate = filtered[index].RateToInsco;
        }

        if (o.Key == CommonConstant.MrAddCvgTypeCodeTpl) {
          var tempTpl = filtered.filter(x => x.AdditionalCoverageType == "TPL");
          defaultSumInsuredAmt = tempTpl[0].SumInsuredAmt;
          custAddPremiRate = tempTpl[0].PremiToCust;
          inscoAddPremiRate = tempTpl[0].PremiToInsco;
        }

        var checkboxValue = false;
        if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) {
          for (let i = 0; i < filtered.length; i++) {
            if (filtered[i].AdditionalCoverageType == CommonConstant.MrAddCvgTypeCodeLoading) {
              var assetAgeMin = filtered[i].AssetAgeFrom ? filtered[i].AssetAgeFrom : 0;
              var assetAgeMax = filtered[i].AssetAgeTo ? filtered[i].AssetAgeTo : 0;
              if (ManufYearDiff+1 >= assetAgeMin && ManufYearDiff+1 <= assetAgeMax) {
                const control = this.fb.group({
                  MrAddCvgTypeCode: o.Key,
                  AddCvgTypeName: o.Value,
                  Value: checkboxValue,
                  SumInsuredPercentage: obj.SumInsuredPrcnt,
                  SumInsuredAmt: defaultSumInsuredAmt,
                  PremiumType: premiumType,
                  // CustAddPremiRate: custAddPremiRate,
                  CustAddPremiRate: filtered[i].RateToCust,
                  CustAddPremiAmt: 0,
                  // BaseCalculation: this.ruleObj.BaseCalc[index],
                  BaseCalculation: filtered[i].BaseCalc,
                  // InscoAddPremiRate: inscoAddPremiRate,
                  InscoAddPremiRate: filtered[i].RateToInsco,
                  InscoAddPremiAmt: 0,
                });
                (group.controls.AppInsAddCvgs as FormArray).push(control);
              }
            }
          }

          // if (ManufYearDiff <= 5)
          //   checkboxValue = false;
          // else
          //   checkboxValue = true;
        }
        else {
          const control = this.fb.group({
            MrAddCvgTypeCode: o.Key,
            AddCvgTypeName: o.Value,
            Value: checkboxValue,
            SumInsuredPercentage: obj.SumInsuredPrcnt,
            SumInsuredAmt: defaultSumInsuredAmt,
            PremiumType: premiumType,
            CustAddPremiRate: custAddPremiRate,
            CustAddPremiAmt: 0,
            BaseCalculation: filtered[index].BaseCalc,
            InscoAddPremiRate: inscoAddPremiRate,
            InscoAddPremiAmt: 0
          });
          (group.controls.AppInsAddCvgs as FormArray).push(control);
        }
      }
    });
    return group;
  }

  addGroupFromDB(insMainCvg: AppAssetInsMainCvgOplObj, ManufYearDiff) {
    var group = this.fb.group({
      YearNo: insMainCvg.YearNo,
      Tenor: insMainCvg.Tenor,
      SumInsuredPrcnt: insMainCvg.SumInsuredPrcnt,
      SumInsuredAmt: insMainCvg.SumInsuredAmt,
      MrMainCvgTypeCode: insMainCvg.MrMainCvgTypeCode,
      CustMainPremiRate: insMainCvg.CustMainPremiRate,
      CustMainPremiAmt: insMainCvg.CustMainPremiAmt,
      InscoMainPremiRate: insMainCvg.InscoMainPremiRate,
      InscoMainPremiAmt: insMainCvg.InscoMainPremiAmt,
      TotalInscoAddPremiAmt: insMainCvg.TotalInscoAddPremiAmt,
      TotalCustAddPremiAmt: insMainCvg.TotalCustAddPremiAmt,
      ManufYearDiff: ManufYearDiff,
      AppInsAddCvgs: new FormArray([])
    });

    this.insAddCvgTypeRuleObj.forEach((o) => {
      var check;
      if (insMainCvg.AppAssetInsAddCvgOplObjs == undefined) {
        check = undefined;
      } else {
        check = insMainCvg.AppAssetInsAddCvgOplObjs.find(x => x.MrAddCvgTypeCode == o.Key);
      }
      var defaultSumInsuredAmt = 0;
      var index = this.ruleObj.InsRateAddCvgRuleObjs.findIndex(x => x.AdditionalCoverageType == o.Key);
      var premiumType = this.ruleObj.InsRateAddCvgRuleObjs[index].PremiumType;
      var custAddPremiRate = 0;
      var inscoAddPremiRate = 0;

      if (premiumType == CommonConstant.PremiumTypeAmt) {
        custAddPremiRate = check == undefined ? this.ruleObj.InsRateAddCvgRuleObjs[index].PremiToCust : check.CustAddPremiAmt;
        inscoAddPremiRate = check == undefined ? this.ruleObj.InsRateAddCvgRuleObjs[index].PremiToInsco : check.InscoAddPremiAmt;
      }

      if (premiumType == CommonConstant.PremiumTypePrcnt) {
        custAddPremiRate = check == undefined ? this.ruleObj.InsRateAddCvgRuleObjs[index].RateToCust : check.CustAddPremiRate;
        inscoAddPremiRate = check == undefined ? this.ruleObj.InsRateAddCvgRuleObjs[index].RateToInsco : check.InscoAddPremiRate;
      }

      if (o.Key == CommonConstant.MrAddCvgTypeCodeTpl) {
        var tempTpl = this.ruleObj.InsRateAddCvgRuleObjs.filter(x => x.AdditionalCoverageType == "TPL");
        defaultSumInsuredAmt = tempTpl[0].SumInsuredAmt;
        custAddPremiRate = check == undefined ? tempTpl[0].PremiToCust : check.CustAddPremiAmt;
        inscoAddPremiRate = check == undefined ? tempTpl[0].PremiToInsco : check.InscoAddPremiAmt;
      }

      if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) {
        for (let i = 0; i < this.ruleObj.InsRateAddCvgRuleObjs.length; i++) {
          if (this.ruleObj.InsRateAddCvgRuleObjs[i].AdditionalCoverageType == CommonConstant.MrAddCvgTypeCodeLoading) {
            var assetAgeMin = this.ruleObj.InsRateAddCvgRuleObjs[i].AssetAgeFrom ? this.ruleObj.InsRateAddCvgRuleObjs[i].AssetAgeFrom : 0;
            var assetAgeMax = this.ruleObj.InsRateAddCvgRuleObjs[i].AssetAgeTo ? this.ruleObj.InsRateAddCvgRuleObjs[i].AssetAgeTo : 0;
            if (ManufYearDiff + 1 >= assetAgeMin && ManufYearDiff + 1 <= assetAgeMax) {
              const control = this.fb.group({
                MrAddCvgTypeCode: o.Key,
                AddCvgTypeName: o.Value,
                Value: check == undefined ? false : true,
                SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
                SumInsuredAmt: check == undefined ? defaultSumInsuredAmt : check.SumInsuredAmt,
                PremiumType: premiumType,
                CustAddPremiRate: custAddPremiRate,
                CustAddPremiAmt: check == undefined ? 0 : check.CustAddPremiAmt,
                BaseCalculation: this.ruleObj.InsRateAddCvgRuleObjs[index].BaseCalc,
                InscoAddPremiRate: inscoAddPremiRate,
                InscoAddPremiAmt: check == undefined ? 0 : check.InscoAddPremiAmt
              });
              (group.controls.AppInsAddCvgs as FormArray).push(control);
            }
          }
        }
      }
      else {
        const control = this.fb.group({
          MrAddCvgTypeCode: o.Key,
          AddCvgTypeName: o.Value,
          Value: check == undefined ? false : true,
          SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
          SumInsuredAmt: check == undefined ? defaultSumInsuredAmt : check.SumInsuredAmt,
          PremiumType: premiumType,
          CustAddPremiRate: custAddPremiRate,
          CustAddPremiAmt: check == undefined ? 0 : check.CustAddPremiAmt,
          BaseCalculation: this.ruleObj.InsRateAddCvgRuleObjs[index].BaseCalc,
          InscoAddPremiRate: inscoAddPremiRate,
          InscoAddPremiAmt: check == undefined ? 0 : check.InscoAddPremiAmt,
        });
        (group.controls.AppInsAddCvgs as FormArray).push(control);
      }
    });
    return group;
  }

  MainCvgTypeDetailChanged(event, i) {
    this.setRate(event.target.value, i);
    this.isCalculate = false;
    this.ReGenerateAddCvgTable(event.target.value, i);
  }

  ReGenerateAddCvgTable(mainCvg, i) {
    (this.InsuranceDataForm.controls.AppInsMainCvgs['controls'][i]['controls']['AppInsAddCvgs'] as FormArray) = this.fb.array([]);
    this.resetAddtional(i, mainCvg);
  }

  resetAddtional(i, mainCvg) {

    this.insAddCvgTypeRuleObj.forEach((o) => {
      var defaultSumInsuredAmt = 0;
      var filtered = this.ruleObj.InsRateAddCvgRuleObjs.filter(f => f.MainCoverageType == mainCvg);

      var index = filtered.findIndex(x => x.AdditionalCoverageType == o.Key);

      if (index != -1) {
        var premiumType = filtered[index].PremiumType;
        var custAddPremiRate = 0;
        var inscoAddPremiRate = 0;

        if (premiumType == CommonConstant.PremiumTypeAmt) {
          custAddPremiRate = filtered[index].PremiToCust;
          inscoAddPremiRate = filtered[index].PremiToInsco;
        }

        if (premiumType == CommonConstant.PremiumTypePrcnt) {
          custAddPremiRate = filtered[index].RateToCust;
          inscoAddPremiRate = filtered[index].RateToInsco;
        }

        if (o.Key == CommonConstant.MrAddCvgTypeCodeTpl) {

          var tempTpl = filtered.filter(x => x.AdditionalCoverageType == "TPL");
          defaultSumInsuredAmt = tempTpl[0].SumInsuredAmt;
          custAddPremiRate = tempTpl[0].PremiToCust;
          inscoAddPremiRate = tempTpl[0].PremiToInsco;
        }
        var checkboxValue = false;
        if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) {
          for (let j = 0; j < filtered.length; j++) {
            if (filtered[j].AdditionalCoverageType == CommonConstant.MrAddCvgTypeCodeLoading) {
              var assetAgeMin = filtered[j].AssetAgeFrom;
              var assetAgeMax = filtered[j].AssetAgeTo;
              if (this.InsuranceDataForm.controls.AppInsMainCvgs['controls'][i]['controls']['ManufYearDiff'].value + 1 >= assetAgeMin && this.InsuranceDataForm.controls.AppInsMainCvgs['controls'][i]['controls']['ManufYearDiff'].value + 1 <= assetAgeMax) {
                const control = this.fb.group({
                  MrAddCvgTypeCode: o.Key,
                  AddCvgTypeName: o.Value,
                  Value: checkboxValue,
                  SumInsuredPercentage: this.InsuranceDataForm.controls.AppInsMainCvgs['controls'][i]['controls']['SumInsuredPrcnt'].value,
                  SumInsuredAmt: defaultSumInsuredAmt,
                  PremiumType: premiumType,
                  // CustAddPremiRate: custAddPremiRate,
                  CustAddPremiRate: filtered[j].RateToCust,
                  CustAddPremiAmt: 0,
                  // BaseCalculation: this.ruleObj.BaseCalc[index],
                  BaseCalculation: filtered[j].BaseCalc,
                  // InscoAddPremiRate: inscoAddPremiRate,
                  InscoAddPremiRate: filtered[j].RateToInsco,
                  InscoAddPremiAmt: 0,
                });
                (this.InsuranceDataForm.controls.AppInsMainCvgs['controls'][i]['controls']['AppInsAddCvgs'] as FormArray).push(control);
                //(group.controls.AppInsAddCvgs as FormArray).push(control);
              }
            }
          }

          // if (ManufYearDiff <= 5)
          //   checkboxValue = false;
          // else
          //   checkboxValue = true;
        }
        else {
          const control = this.fb.group({
            MrAddCvgTypeCode: o.Key,
            AddCvgTypeName: o.Value,
            Value: checkboxValue,
            SumInsuredPercentage: this.InsuranceDataForm.controls.AppInsMainCvgs['controls'][i]['controls']['SumInsuredPrcnt'].value,
            SumInsuredAmt: defaultSumInsuredAmt,
            PremiumType: premiumType,
            CustAddPremiRate: custAddPremiRate,
            CustAddPremiAmt: 0,
            BaseCalculation: filtered[index].BaseCalc,
            InscoAddPremiRate: inscoAddPremiRate,
            InscoAddPremiAmt: 0
          });
          (this.InsuranceDataForm.controls.AppInsMainCvgs['controls'][i]['controls']['AppInsAddCvgs'] as FormArray).push(control);
          //(group.controls.AppInsAddCvgs as FormArray).push(control);
        }
      }
    });
  }

  changeMainCvgddl(event: UcDropdownListCallbackObj) {
    this.bindAddCheckbox(event.selectedValue);
    this.addCheckbox(undefined);
    this.CheckIsUseTpl();
  }

  CheckIsUseTpl(tplAmt: number = 0) {
    const formTplChecked = this.InsuranceDataForm.controls.InsAddCvgTypes["controls"].filter(x => x.value.Key == CommonConstant.MrAddCvgTypeCodeTpl && x.value.Value == true);
    this.isTpl = false;

    if(formTplChecked.length > 0){
      this.isTpl = true;
    }

    if(tplAmt > 0){
      this.InsuranceDataForm.patchValue({
        SumInsuredTplAmt: tplAmt
      });
    }
  }

  setRate(mainCoverageType, i) {
    var index = this.ruleObj.InsRateMainCvgRuleObjs.findIndex(x => x.MainCoverageType == mainCoverageType);
    this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
      CustMainPremiRate: this.ruleObj.InsRateMainCvgRuleObjs[index].RateToCust,
      InscoMainPremiRate: this.ruleObj.InsRateMainCvgRuleObjs[index].RateToInsco
    });
    for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
      var currAddCvgType = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
      var indexAdd = this.ruleObj.InsRateAddCvgRuleObjs.findIndex(x => x.AdditionalCoverageType == currAddCvgType);

      var premiumType = this.ruleObj.InsRateAddCvgRuleObjs[indexAdd].PremiumType;
      var custAddPremiRate = 0;
      var inscoAddPremiRate = 0;

      if (premiumType == CommonConstant.PremiumTypeAmt) {
        custAddPremiRate = this.ruleObj.InsRateAddCvgRuleObjs[indexAdd].PremiToCust;
        inscoAddPremiRate = this.ruleObj.InsRateAddCvgRuleObjs[indexAdd].PremiToInsco;
      }

      if (premiumType == CommonConstant.PremiumTypePrcnt) {
        custAddPremiRate = this.ruleObj.InsRateAddCvgRuleObjs[indexAdd].RateToCust;
        inscoAddPremiRate = this.ruleObj.InsRateAddCvgRuleObjs[indexAdd].RateToInsco;
      }

      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
        CustAddPremiRate: custAddPremiRate,
        InscoAddPremiRate: inscoAddPremiRate,
      });
    }
  }

  SumInsuredAmtAddCvgChanged() {
    this.isCalculate = false;
  }

  ApplyToCoverage() {
    for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
        MrMainCvgTypeCode: this.InsuranceDataForm.controls.InsMainCvgType.value
      });
      this.setRate(this.InsuranceDataForm.controls.InsMainCvgType.value, i);
      this.ReGenerateAddCvgTable(this.InsuranceDataForm.controls.InsMainCvgType.value, i);
      const formAddCvgChecked = this.InsuranceDataForm.controls.InsAddCvgTypes["controls"].filter(x => x.value.Value == true);

      for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
        var check = formAddCvgChecked.find(x => x.value.Key == this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].AddCvgTypeName.value);

        if (check != undefined) {
          this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
            Value: check.value.Value
          });
        } else {
          this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
            Value: false
          });
        }
      }
    }
  }

  setGenerateCalculateValidation(){
    this.isGenerate = false;
    this.isCalculate = false;
  }

  InsAssetPaidByChanged(event) {
    this.setPaidByInput(event.target.value);
    this.setGenerateCalculateValidation();
  }

  EndDt_FocusOut() {
    this.setInsLength();
  }

  setInsLength() {
    if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == CommonConstant.CoverPeriodFullTenor) {
        var tenor = this.appObj.Tenor;
        tenor = this.setTenorCustCompany(tenor);
        this.InsuranceDataForm.patchValue({
          InsLength: tenor
        });
      }
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == CommonConstant.CoverPeriodPartialTenor) {
        this.setInsLengthValidator(CommonConstant.CoverPeriodPartialTenor);
      }
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == CommonConstant.CoverPeriodOverTenor) {
        this.setInsLengthValidator(CommonConstant.CoverPeriodOverTenor);
      }
    }
    if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCompany) {
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == CommonConstant.CoverPeriodFullTenor) {
        this.InsuranceDataForm.patchValue({
          InsLength: this.appObj.Tenor
        });
      }
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == CommonConstant.CoverPeriodPartialTenor) {
        this.setInsLengthValidator(CommonConstant.CoverPeriodPartialTenor);
      }
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == CommonConstant.CoverPeriodOverTenor) {
        this.setInsLengthValidator(CommonConstant.CoverPeriodOverTenor);
      }
    }

  }

  setPaidByInput(paidBy) {
    if (paidBy == CommonConstant.InsPaidByAtCost) {
      this.InsuranceDataForm.controls.TotalCustDiscAmt.disable();
      this.InsuranceDataForm.controls.IsFullCapitalizedAmount.disable();
      this.InsuranceDataForm.controls.InsCpltzAmt.disable();
    } else {
      this.InsuranceDataForm.controls.TotalCustDiscAmt.enable();
      this.InsuranceDataForm.controls.IsFullCapitalizedAmount.enable();
      this.InsuranceDataForm.controls.InsCpltzAmt.enable();
      this.BindCapitalize();
      this.IsFullCapitalizedAmount();
    }
  }

  setTenorCustCompany(tenor) {
    var months;
    var endDt = new Date(this.InsuranceDataForm.controls.EndDt.value);

    //Calculate the differences between the start and end dates
    var yearsDifference = endDt.getFullYear() - this.businessDt.getFullYear();
    var monthsDifference = endDt.getMonth() - this.businessDt.getMonth();
    var daysDifference = endDt.getDate() - this.businessDt.getDate();

    var monthCorrection = 0;
    if (daysDifference > 0) {
      monthCorrection = 1;
    }

    months = (yearsDifference * 12 + monthsDifference + monthCorrection);

    tenor = tenor - months;
    return tenor;
  }

  setInsLengthDefaultValue(coverPeriod) {
    if (coverPeriod == CommonConstant.CoverPeriodAnnually) {
      this.InsuranceDataForm.patchValue({
        InsLength: 12
      });
    }

    if (coverPeriod == CommonConstant.CoverPeriodFullTenor) {
      var tenor = this.appObj.Tenor;
      if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
        tenor = this.setTenorCustCompany(tenor);
      }
      this.InsuranceDataForm.patchValue({
        InsLength: tenor
      });
    }

    if (coverPeriod == CommonConstant.CoverPeriodPartialTenor) {
      this.InsuranceDataForm.patchValue({
        InsLength: 1
      });
    }

    if (coverPeriod == CommonConstant.CoverPeriodOverTenor) {
      this.InsuranceDataForm.patchValue({
        InsLength: this.appObj.Tenor + 1
      });
    }

    //this.setInsLengthValidator(coverPeriod);
  }

  setInsLengthValidator(coverPeriod) {
    if (coverPeriod == CommonConstant.CoverPeriodAnnually) {
      this.minInsLength = 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.disable();
    }

    if (coverPeriod == CommonConstant.CoverPeriodFullTenor) {
      this.minInsLength = 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.disable();
    }

    if (coverPeriod == CommonConstant.CoverPeriodPartialTenor) {
      var tenor = this.appObj.Tenor;
      if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
        tenor = this.setTenorCustCompany(tenor);
      }
      this.minInsLength = 1;
      this.maxInsLength = tenor - 1;
      this.InsuranceDataForm.controls.InsLength.enable();
      this.InsuranceDataForm.controls.InsLength.setValidators([Validators.required, Validators.min(this.minInsLength), Validators.max(this.maxInsLength)]);
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
    }

    if (coverPeriod == CommonConstant.CoverPeriodOverTenor) {
      var tenor = this.appObj.Tenor;
      if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
        tenor = this.setTenorCustCompany(tenor);
      }
      this.minInsLength = tenor + 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.enable();
      this.InsuranceDataForm.controls.InsLength.setValidators([Validators.required, Validators.min(this.minInsLength), Validators.max(this.maxInsLength)]);
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
    }
  }

  InscoBranchCodeChanged(event:UcDropdownListCallbackObj) {
    if (event.selectedObj != undefined) {
      this.InsuranceDataForm.patchValue({
        InscoBranchName: event.selectedObj.Value
      });
    } else {
      this.InsuranceDataForm.patchValue({
        InscoBranchName: ""
      });
    }
    this.isGenerate = false;
    this.isCalculate = false;
  }

  InsuredByChanged(event) {
    //this.setInsLength();
    this.setValidator(event.target.value);
  }

  setValidator(insuredBy) {
    if (insuredBy == CommonConstant.InsuredByOffSystem) {
      this.InsuranceDataForm.controls.CustInscoBranchName.clearValidators();
      this.InsuranceDataForm.controls.CustInscoBranchName.updateValueAndValidity()
      this.InsuranceDataForm.controls.InscoBranchCode.clearValidators();
      this.InsuranceDataForm.controls.InscoBranchCode.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyNo.clearValidators();
      this.InsuranceDataForm.controls.InsPolicyNo.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyName.clearValidators();
      this.InsuranceDataForm.controls.InsPolicyName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCoverStartDt.clearValidators();
      this.InsuranceDataForm.controls.CustCoverStartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.clearValidators();
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.Notes.clearValidators();
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustNotes.clearValidators();
      this.InsuranceDataForm.controls.CustNotes.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetPaidBy.clearValidators();
      this.InsuranceDataForm.controls.InsAssetPaidBy.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.clearValidators();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsLength.clearValidators();
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.clearValidators();
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCvgAmt.clearValidators();
      this.InsuranceDataForm.controls.CustCvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.CvgAmt.clearValidators();
      this.InsuranceDataForm.controls.CvgAmt.updateValueAndValidity();
    }

    if (insuredBy == CommonConstant.InsuredByCustomer) {
      this.InsuranceDataForm.controls.CustInscoBranchName.setValidators([Validators.required, Validators.maxLength(100)]);
      this.InsuranceDataForm.controls.CustInscoBranchName.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyNo.setValidators(Validators.maxLength(50));
      this.InsuranceDataForm.controls.InsPolicyNo.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyName.setValidators(Validators.maxLength(100));
      this.InsuranceDataForm.controls.InsPolicyName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCoverStartDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CustCoverStartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustNotes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.CustNotes.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCvgAmt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CustCvgAmt.updateValueAndValidity();

      this.InsuranceDataForm.controls.InsAssetPaidBy.clearValidators();
      this.InsuranceDataForm.controls.InsAssetPaidBy.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.clearValidators();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsLength.clearValidators();
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.clearValidators();
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
      this.InsuranceDataForm.controls.InscoBranchCode.clearValidators();
      this.InsuranceDataForm.controls.InscoBranchCode.updateValueAndValidity();
      this.InsuranceDataForm.controls.Notes.clearValidators();
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.InsuranceDataForm.controls.CvgAmt.clearValidators();
      this.InsuranceDataForm.controls.CvgAmt.updateValueAndValidity();
    }

    if (insuredBy == CommonConstant.InsuredByCompany) {
      this.InsuranceDataForm.controls.InsAssetPaidBy.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetPaidBy.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      //this.setInsLengthValidator(this.InsuranceDataForm.controls.InsAssetCoverPeriod.value);
      this.InsuranceDataForm.controls.Notes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
      this.InsuranceDataForm.controls.CvgAmt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.InscoBranchCode.setValidators([Validators.required, Validators.maxLength(100)]);
      this.InsuranceDataForm.controls.InscoBranchCode.updateValueAndValidity();

      this.InsuranceDataForm.controls.InsPolicyNo.clearValidators();
      this.InsuranceDataForm.controls.InsPolicyNo.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyName.clearValidators();
      this.InsuranceDataForm.controls.InsPolicyName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCoverStartDt.clearValidators();
      this.InsuranceDataForm.controls.CustCoverStartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.clearValidators();
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustInscoBranchName.clearValidators();
      this.InsuranceDataForm.controls.CustInscoBranchName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustNotes.clearValidators();
      this.InsuranceDataForm.controls.CustNotes.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCvgAmt.clearValidators();
      this.InsuranceDataForm.controls.CustCvgAmt.updateValueAndValidity();
    }

    if (insuredBy == CommonConstant.InsuredByCustomerCompany) {
      this.InsuranceDataForm.controls.InsAssetPaidBy.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetPaidBy.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      //this.setInsLengthValidator(this.InsuranceDataForm.controls.InsAssetCoverPeriod.value);
      this.InsuranceDataForm.controls.Notes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustInscoBranchName.setValidators([Validators.required, Validators.maxLength(100)]);
      this.InsuranceDataForm.controls.CustInscoBranchName.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyNo.setValidators(Validators.maxLength(50));
      this.InsuranceDataForm.controls.InsPolicyNo.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyName.setValidators(Validators.maxLength(100));
      this.InsuranceDataForm.controls.InsPolicyName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCoverStartDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CustCoverStartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustNotes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.CustNotes.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCvgAmt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CustCvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.CvgAmt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.InscoBranchCode.setValidators([Validators.required, Validators.maxLength(100)]);
      this.InsuranceDataForm.controls.InscoBranchCode.updateValueAndValidity();
    }
  }

  setDateWithoutTimezone(inputDate) {
    var date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);
    var userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset);
  }
  isInsDataExist: boolean = false;
  async getInsuranceData() {
    var reqObj = { Id: this.AppAssetId }
    await this.http.post(URLConstant.GetAssetExpenseDataByAppAssetId, reqObj).toPromise().then(
      (response) => {
        this.appObj = response["AppObj"];
        this.isDdlInscoBranchReady = true;
        this.InsuranceDataForm.patchValue({
          InsLength: this.appObj.Tenor
        });
        this.appAssetObj = response["AppAssetObj"];
        if (response["AppAssetMaintHObj"] != null) {
          this.InsuranceDataForm.patchValue({
            PackageType: response["AppAssetMaintHObj"].MrMaintPackageCode
          });
          this.isCanBeAddedMaintenance = response["AppAssetMaintHObj"].IsAddable;
          this.maintBehaCode = response["AppAssetMaintHObj"].AppAssetMaintBehaviourCode;
          this.InsuranceDataForm.controls["SparePartObjs"] = this.fb.array([]);
          this.InputLookupSparePartObjs = new Array<InputLookupObj>();
          this.InsuranceDataForm.controls["ServiceObjs"] = this.fb.array([]);
          this.InputLookupServiceObjs = new Array<InputLookupObj>();
          var mainLock = false;
          if (this.maintBehaCode == "LOCK") {
            mainLock = true;
          }
          for (let i = 0; i < response["AppAssetMaintHObj"].SparepartObjs.length; i++) {
            var packsparepart = {
              SparePartCode: response["AppAssetMaintHObj"].SparepartObjs[i].MrSparepartCode,
              SparePartName: response["AppAssetMaintHObj"].SparepartObjs[i].MrSparepartName,
              SparePartAmt: response["AppAssetMaintHObj"].SparepartObjs[i].FeeAmt,
              IsLock: mainLock
            }
            this.addSparePart(packsparepart);
          }
          for (let i = 0; i < response["AppAssetMaintHObj"].ServiceObjs.length; i++) {
            var packservice = {
              ServiceCode: response["AppAssetMaintHObj"].ServiceObjs[i].MrServiceCode,
              ServiceName: response["AppAssetMaintHObj"].ServiceObjs[i].MrServiceName,
              ServiceAmt: response["AppAssetMaintHObj"].ServiceObjs[i].FeeAmt,
              IsLock: mainLock
            }
            this.addService(packservice);
          }
          this.calculateService();
          this.calculateSparepart();
          if (this.maintBehaCode == "LOCK") {
            for (let i = 0; i < this.InsuranceDataForm.controls["SparePartObjs"]["controls"].length; i++) {
              this.InsuranceDataForm["controls"]["SparePartObjs"]["controls"][i]["controls"]["SparePartAmt"].disable();
              this.InputLookupSparePartObjs[i].isDisable = true;
            }
            for (let i = 0; i < this.InsuranceDataForm.controls["ServiceObjs"]["controls"].length; i++) {
              this.InsuranceDataForm["controls"]["ServiceObjs"]["controls"][i]["controls"]["ServiceAmt"].disable();
              this.InputLookupServiceObjs[i].isDisable = true;
            }
            //this.isLookupDisable = true;
          }
          else {
            for (let i = 0; i < this.InsuranceDataForm.controls["SparePartObjs"]["controls"].length; i++) {
              this.InsuranceDataForm["controls"]["SparePartObjs"]["controls"][i]["controls"]["SparePartAmt"].enable();
              this.InputLookupSparePartObjs[i].isDisable = false;
            }
            for (let i = 0; i < this.InsuranceDataForm.controls["ServiceObjs"]["controls"].length; i++) {
              this.InsuranceDataForm["controls"]["ServiceObjs"]["controls"][i]["controls"]["ServiceAmt"].enable();
              this.InputLookupServiceObjs[i].isDisable = false;
            }
          }
        }
        if (response["AppAssetOthExpenseOplObjs"].length > 0) {
          this.isExpenseCanAdd = response["AppAssetOthExpenseOplObjs"][0].IsAddable;
          this.InsuranceDataForm.controls["OtherExpenseObjs"] = this.fb.array([]);
          for (let i = 0; i < response["AppAssetOthExpenseOplObjs"].length; i++) {
            var expenseLock = false;
            if (response["AppAssetOthExpenseOplObjs"][i].OthExpBehaviourCode == "LOCK") {
              expenseLock = true;
            }
            var x = {
              OthExpenseCode: response["AppAssetOthExpenseOplObjs"][i].MrOthExpenseTypeOplCode,
              OthExpenseName: response["AppAssetOthExpenseOplObjs"][i].MrOthExpenseTypeOplName,
              OthExpenseAmt: response["AppAssetOthExpenseOplObjs"][i].OthExpenseAmt,
              IsLock: expenseLock,
              BehaviourCode: response["AppAssetOthExpenseOplObjs"][i].OthExpBehaviourCode
            };
            this.addOtherExpense(x);
            if (response["AppAssetOthExpenseOplObjs"][i].OthExpBehaviourCode == "LOCK") {
              this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseAmt"].disable();
              this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseCode"].disable();
            }
            else {
              this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseAmt"].enable();
              this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseCode"].enable();
            }
          }
          this.isExpenseCanAdd = true;
          this.calculateExpense();
        }
        if (response["AppAssetFeeOplObjs"].length > 0) {
          this.InsuranceDataForm.controls["FeeObjs"] = this.fb.array([]);
          for (let i = 0; i < response["AppAssetFeeOplObjs"].length; i++) {
            if (this.InsuranceDataForm["controls"]["FeeInputType"].value == "VAT") {
              var fee = {
                FeeTypeCode: response["AppAssetFeeOplObjs"][i].FeeCode,
                FeeTypeName: response["AppAssetFeeOplObjs"][i].FeeName,
                FeeTypeAmt: response["AppAssetFeeOplObjs"][i].FeeAmt + response["AppAssetFeeOplObjs"][i].VatAmt,
                CptlzAmt: response["AppAssetFeeOplObjs"][i].CapitalizedAmt,
                i: i,
                FeeBehaviour: response["AppAssetFeeOplObjs"][i].FeeBehaviourCode,
                CptlzBehaviour: response["AppAssetFeeOplObjs"][i].FeeCapBehaviourCode,
              };
              this.addFeeIfExist(fee);
            }
            else {
              var fee = {
                FeeTypeCode: response["AppAssetFeeOplObjs"][i].FeeCode,
                FeeTypeName: response["AppAssetFeeOplObjs"][i].FeeName,
                FeeTypeAmt: response["AppAssetFeeOplObjs"][i].FeeAmt,
                CptlzAmt: response["AppAssetFeeOplObjs"][i].CapitalizedAmt,
                i: i,
                FeeBehaviour: response["AppAssetFeeOplObjs"][i].FeeBehaviourCode,
                CptlzBehaviour: response["AppAssetFeeOplObjs"][i].FeeCapBehaviourCode,
              };
              this.addFeeIfExist(fee);
            }
            if (response["AppAssetFeeOplObjs"][i].FeeBehaviourCode == "LOCK") {
              this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeAmt"].disable();
            }
            if (response["AppAssetFeeOplObjs"][i].FeeCapBehaviourCode == "LOCK") {
              this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["CptlzAmt"].disable();
            }
            this.calculateFee();
            this.calculateVAT();
            this.calculateCptlz();
          }
        }
        if (this.appAssetObj != undefined) {
          this.InsuranceDataForm.patchValue({
            CvgAmt: this.appAssetObj.AssetPriceAmt
          });
        }
        if (response["AppAssetInsOplObj"] != null) {
          this.isInsDataExist = true;
          this.InsuranceDataForm.patchValue({
            InscoBranchCode: response["AppAssetInsOplObj"].InscoBranchCode,
            InsAssetRegion: response["AppAssetInsOplObj"].InsAssetRegion,
            InsAssetCoverPeriod: response["AppAssetInsOplObj"].MrInsCoverPeriodCode,
            CvgAmt: response["AppAssetInsOplObj"].CvgAmt,
            InsLength: response["AppAssetInsOplObj"].InsLength,
            TotalInscoMainPremiAmt: response["AppAssetInsOplObj"].TotalInscoMainPremiAmt,
            TotalInscoAddPremiAmt: response["AppAssetInsOplObj"].TotalInscoAddPremiAmt,
            TotalCustFeeAmt: response["AppAssetInsOplObj"].TotalInscoFeeAmt,
            TotalInsInscoAmt: response["AppAssetInsOplObj"].TotalInsInscoAmt + response["AppAssetInsOplObj"].InsDiscAmt,
            Notes: response["AppAssetInsOplObj"].Notes,
            InsDiscAmt: response["AppAssetInsOplObj"].InsDiscAmt
          });
          this.GenerateInsurance(response["AppAssetInsOplObj"].AppAssetInsMainCvgOplObjs);
        }
      });
  }

  async bindAppInsAndAppInsObj(insuredBy) {
    //if (this.appInsuranceObj != null && this.appInsObjObj != null) {
    //  if (insuredBy == CommonConstant.InsuredByOffSystem) {
    //    this.InsuranceDataForm.patchValue({
    //      InsAssetCoveredBy: insuredBy
    //    });
    //  }

    //  if (insuredBy == CommonConstant.InsuredByCustomer) {
    //    this.InsuranceDataForm.patchValue({
    //      InsAssetCoveredBy: insuredBy,
    //      CustInscoBranchName: this.appInsObjObj.CustInscoBranchName,
    //      InsPolicyNo: this.appInsObjObj.InsPolicyNo,
    //      InsPolicyName: this.appInsObjObj.InsPolicyName,
    //      CustCoverStartDt: formatDate(this.appInsObjObj.CustCoverStartDt, 'yyyy-MM-dd', 'en-US'),
    //      EndDt: formatDate(this.appInsObjObj.EndDt, 'yyyy-MM-dd', 'en-US'),
    //      CustNotes: this.appInsObjObj.CustNotes,
    //      CustCvgAmt: this.appInsObjObj.CustCvgAmt
    //    });
    //  }

    //  if (insuredBy == CommonConstant.InsuredByCompany) {
    //    this.InsuranceDataForm.patchValue({
    //      InsAssetCoveredBy: insuredBy,
    //      InscoBranchCode: this.appInsObjObj.InscoBranchCode,
    //      InscoBranchName: this.appInsObjObj.InscoBranchName,
    //      InsAssetPaidBy: this.appInsObjObj.InsAssetPaidBy,
    //      InsAssetCoverPeriod: this.appInsObjObj.InsAssetCoverPeriod,
    //      InsAssetRegion: this.appInsObjObj.InsAssetRegion,
    //      InsLength: this.appInsObjObj.InsLength,
    //      Notes: this.appInsObjObj.Notes,
    //      TotalCustMainPremiAmt: this.appInsObjObj.TotalCustMainPremiAmt,
    //      TotalCustAddPremiAmt: this.appInsObjObj.TotalCustAddPremiAmt,
    //      TotalInscoMainPremiAmt: this.appInsObjObj.TotalInscoMainPremiAmt,
    //      TotalInscoAddPremiAmt: this.appInsObjObj.TotalInscoAddPremiAmt,
    //      InsCpltzAmt: this.appInsObjObj.InsCpltzAmt,
    //      InscoAdminFeeAmt: this.appInsObjObj.InscoAdminFeeAmt,
    //      CustAdminFeeAmt: this.appInsObjObj.CustAdminFeeAmt,
    //      CustStampDutyFeeAmt: this.appInsObjObj.CustStampDutyFee,
    //      CvgAmt: this.appInsObjObj.CvgAmt,
    //      TotalCustFeeAmt: this.appInsObjObj.CustAdminFeeAmt + this.appInsObjObj.CustStampDutyFee,
    //      TotalInscoFeeAmt: this.appInsObjObj.InscoAdminFeeAmt + this.appInsObjObj.InscoStampDutyFee,
    //      TotalCustDiscAmt: this.appInsObjObj.TotalCustDiscAmt,
    //      PayPeriodToInsco: this.appInsObjObj.PayPeriodToInsco
    //    });
    //    this.setPaidByInput(this.appInsObjObj.InsAssetPaidBy);
    //    this.setInsLengthValidator(this.appInsObjObj.InsAssetCoverPeriod);
    //    await this.GenerateInsurance(this.appInsMainCvgObj);
    //  }

    //  if (insuredBy == CommonConstant.InsuredByCustomerCompany) {
    //    this.InsuranceDataForm.patchValue({
    //      InsAssetCoveredBy: insuredBy,
    //      InscoBranchCode: this.appInsObjObj.InscoBranchCode,
    //      InscoBranchName: this.appInsObjObj.InscoBranchName,
    //      InsAssetPaidBy: this.appInsObjObj.InsAssetPaidBy,
    //      InsAssetCoverPeriod: this.appInsObjObj.InsAssetCoverPeriod,
    //      InsAssetRegion: this.appInsObjObj.InsAssetRegion,
    //      InsLength: this.appInsObjObj.InsLength,
    //      Notes: this.appInsObjObj.Notes,
    //      TotalCustMainPremiAmt: this.appInsObjObj.TotalCustMainPremiAmt,
    //      TotalCustAddPremiAmt: this.appInsObjObj.TotalCustAddPremiAmt,
    //      TotalInscoMainPremiAmt: this.appInsObjObj.TotalInscoMainPremiAmt,
    //      TotalInscoAddPremiAmt: this.appInsObjObj.TotalInscoAddPremiAmt,
    //      InsCpltzAmt: this.appInsObjObj.InsCpltzAmt,
    //      InscoAdminFeeAmt: this.appInsObjObj.InscoAdminFeeAmt,
    //      CustAdminFeeAmt: this.appInsObjObj.CustAdminFeeAmt,
    //      CustStampDutyFeeAmt: this.appInsObjObj.CustStampDutyFee,
    //      CustInscoBranchName: this.appInsObjObj.CustInscoBranchName,
    //      InsPolicyNo: this.appInsObjObj.InsPolicyNo,
    //      InsPolicyName: this.appInsObjObj.InsPolicyName,
    //      CustCoverStartDt: formatDate(this.appInsObjObj.CustCoverStartDt, 'yyyy-MM-dd', 'en-US'),
    //      EndDt: formatDate(this.appInsObjObj.StartDt, 'yyyy-MM-dd', 'en-US'),
    //      CustNotes: this.appInsObjObj.CustNotes,
    //      CustCvgAmt: this.appInsObjObj.CustCvgAmt,
    //      CvgAmt: this.appInsObjObj.CvgAmt,
    //      TotalCustFeeAmt: this.appInsObjObj.CustAdminFeeAmt + this.appInsObjObj.CustStampDutyFee,
    //      TotalInscoFeeAmt: this.appInsObjObj.InscoAdminFeeAmt + this.appInsObjObj.InscoStampDutyFee,
    //      TotalCustDiscAmt: this.appInsObjObj.TotalCustDiscAmt,
    //      PayPeriodToInsco: this.appInsObjObj.PayPeriodToInsco
    //    });
    //    this.setPaidByInput(this.appInsObjObj.InsAssetPaidBy);
    //    this.setInsLengthValidator(this.appInsObjObj.InsAssetCoverPeriod);
    //    await this.GenerateInsurance(this.appInsMainCvgObj);
    //  }

    //  this.setValidator(insuredBy);

    //  if (this.InsuranceDataForm["controls"]["InsCpltzAmt"].value == this.InsuranceDataForm["controls"]["TotalCustMainPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustAddPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustFeeAmt"].value - this.InsuranceDataForm["controls"]["TotalCustDiscAmt"].value) {
    //    this.InsuranceDataForm["controls"]["InsCpltzAmt"].disable();
    //    this.InsuranceDataForm.patchValue({
    //      IsFullCapitalizedAmount: true
    //    });
    //  }
    //}
  }

  async bindInsuredByObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsuredBy };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insuredByObj = response[CommonConstant.ReturnObj];
        // if(this.insuredByObj.length > 0){
        //   this.InsuranceDataForm.patchValue({
        //     InsAssetCoveredBy: this.insuredByObj[0].Key
        //   });
        //   this.setValidator(this.insuredByObj[0].Key);
        // }
      }
    );
  }

  async bindPaidByObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsPaidBy };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.paidByObj = response[CommonConstant.ReturnObj];
        // if(this.paidByObj.length > 0){
        //   this.InsuranceDataForm.patchValue({
        //     InsAssetPaidBy: this.paidByObj[0].Key
        //   });
        // }
      }
    );
  }

  async bindInsMainCvgTypeObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsMainCvgType };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insMainCvgTypeObj = response[CommonConstant.ReturnObj];
        // if(this.insMainCvgTypeObj.length > 0){
        //   this.InsuranceDataForm.patchValue({
        //     InsMainCvgType: this.insMainCvgTypeObj[0].Key
        //   });
        //   this.defaultInsMainCvgType = this.insMainCvgTypeObj[0].Key;
        // }
      }
    );
  }

  async bindInsAddCvgTypeObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsAddCvgType };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAddCvgTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  addCheckbox(additional: Array<AppAssetInsAddCvgOplObj>) {
    if (additional != undefined) {
      var ManufYearDiff = this.businessDt.getFullYear() - this.appAssetObj.ManufacturingYear;
      var noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
      var addCvgLoading = this.ruleObj.InsRateAddCvgRuleObjs.filter(x => x.AdditionalCoverageType == CommonConstant.MrAddCvgTypeCodeLoading);
      var minAssetAgeFrom = Math.min.apply(null, addCvgLoading.map(item => item.AssetAgeFrom));

      this.addDdl.forEach((o) => {
        var checkboxValue;
        if(o.Key == CommonConstant.MrAddCvgTypeCodeLoading && ManufYearDiff + noOfYear >= minAssetAgeFrom){
          checkboxValue = true;
        }
        else if (additional.length > 0) {
          var x = additional.find(x => x.MrAddCvgTypeCode == o.Key.toString());
          if (x != null) {
            checkboxValue = true;
          }
          else {
            checkboxValue = false;
          }
        }
        else {
          checkboxValue = false;
        }
        const control = this.fb.group({
          Key: o.Value,
          Value: checkboxValue
        });
        (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray).push(control);
      });
    }
    else {
      this.addDdl.forEach((o) => {

        var checkboxValue;
        if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading)
          checkboxValue = true;
        else
          checkboxValue = false;

        const control = this.fb.group({
          Key: o.Value,
          Value: checkboxValue
        });
        (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray).push(control);
      });
    }

  }

  bindInsAssetCoverPeriodObj() {
    var ListMapCodes = new Array<string>();
    ListMapCodes.push(CommonConstant.OPL);
    this.ddlInsAssetCoverPeriodObj.apiUrl = URLConstant.GetListActiveRefMasterByRefMasterCodeAndMappingCodes;
    this.ddlInsAssetCoverPeriodObj.requestObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsCoverPeriod, MappingCode: ListMapCodes };
    this.ddlInsAssetCoverPeriodObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
    this.ddlInsAssetCoverPeriodObj.isSelectOutput = true;
  }

  async bindInsAssetRegionObj() {
    if (this.isInsDataExist == false) {
      this.http.post(URLConstant.GetAssetRegionFromRuleByAppAssetId, { Id: this.AppAssetId }).subscribe(
        response => {
          var res = response["AssetRegion"];
          this.InsuranceDataForm.patchValue({
            InsAssetRegion: res
          });
        }
      );
    }
    this.ddlInsAssetRegionObj.apiUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.ddlInsAssetRegionObj.requestObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetInsRegion };
    this.ddlInsAssetRegionObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
    this.ddlInsAssetRegionObj.isSelectOutput = true;
  }

  bindInscoBranchObj() {
    this.ddlInscoBranchObj.apiUrl = URLConstant.GetListKeyValueActiveVendorByCategoryCodeAndOfficeCode;
    this.ddlInscoBranchObj.requestObj = { MrVendorCategory: CommonConstant.VendorCategoryAssetInscoBranch, OfficeCode: this.appObj.OriOfficeCode };
    this.ddlInscoBranchObj.isSelectOutput = true;
  }

  async bindPayPeriodToInscoObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodePayPeriodToInsco };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.payPeriodToInscoObj = response[CommonConstant.ReturnObj];
        if (this.payPeriodToInscoObj.length > 0 && this.isInsDataExist == false) {
          this.InsuranceDataForm.patchValue({
            PayPeriodToInsco: this.payPeriodToInscoObj[0].Key
          });
        }
      }
    );
  }

  IsFullCapitalizedAmount() {
    if (this.InsuranceDataForm["controls"]["IsFullCapitalizedAmount"].value == true) {
      this.InsuranceDataForm.patchValue({
        InsCpltzAmt: this.InsuranceDataForm["controls"]["TotalCustMainPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustAddPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustFeeAmt"].value - this.InsuranceDataForm["controls"]["TotalCustDiscAmt"].value
      });
      this.InsuranceDataForm["controls"]["InsCpltzAmt"].disable();
    } else {
      this.InsuranceDataForm["controls"]["InsCpltzAmt"].enable();
    }
  }
  BindCapitalize() {
    if (this.InsuranceDataForm["controls"]["IsFullCapitalizedAmount"].value == true) {
      this.InsuranceDataForm.patchValue({
        InsCpltzAmt: this.InsuranceDataForm["controls"]["TotalCustMainPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustAddPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustFeeAmt"].value - this.InsuranceDataForm["controls"]["TotalCustDiscAmt"].value
      });
    }
  }


  async getMainPackage() {
    var packageObj = { Id: this.AppAssetId };
    await this.http.post(URLConstant.GetMaintenancePackageByAppAssetId, packageObj).toPromise().then(
      (response) => {
        this.packageTypeRuleObj = response["MaintenancePackageObjs"];
        this.packageDetailObj = response["MaintenancePackageDetailObjs"];
        if (this.packageTypeRuleObj.length > 0) {
          this.InsuranceDataForm.patchValue({
            PackageType: this.packageTypeRuleObj[0].MaintenancePackageCode
          });
          this.isMainPackageReady = true;
          this.changeMainPackage();
        }
      }
    );
  }

  async changeMainPackage() {
    //for (let i = 0; i < this.InsuranceDataForm.controls["SparePartObjs"]["controls"].length; i++) {
    //  this.deleteSparePartWithoutConfirm(i);
    //}
    this.InsuranceDataForm.controls["SparePartObjs"] = this.fb.array([]);
    this.InputLookupSparePartObjs = new Array<InputLookupObj>();
    //for (let j = 0; j < this.InsuranceDataForm.controls["ServiceObjs"]["controls"].length; j++) {
    //  this.deleteServiceWithoutConfirm(j);
    //}
    this.InsuranceDataForm.controls["ServiceObjs"] = this.fb.array([]);
    this.InputLookupServiceObjs = new Array<InputLookupObj>();
    //this.dictServiceLookup = { [key: string]: any; } = { };
    //var packageObj = { AppAssetId: this.AppAssetId, MaintenancePackageCode: this.InsuranceDataForm["controls"]["PackageType"].value };
    var x = this.packageTypeRuleObj.find(x => x.MaintenancePackageCode == this.InsuranceDataForm["controls"]["PackageType"].value);
    this.maintBehaCode = x.Behaviour;
    var isLock = false;
    if (x.Behaviour == "LOCK") {
      isLock = true;
    }
    var z = this.packageDetailObj.filter(x => x.MaintPackageCode == this.InsuranceDataForm["controls"]["PackageType"].value);

    for (let i = 0; i < z.length; i++) {
      if (z[i].MaintenanceType == "Sparepart") {
        var packsparepart = {
          SparePartCode: z[i].MaintenanceItem,
          SparePartName: z[i].MaintenanceItemName,
          SparePartAmt: z[i].MaintenanceAmt,
          IsLock: isLock
        }
        this.addSparePart(packsparepart);
      }
      else if (z[i].MaintenanceType == "Service") {
        var packservice = {
          ServiceCode: z[i].MaintenanceItem,
          ServiceName: z[i].MaintenanceItemName,
          ServiceAmt: z[i].MaintenanceAmt,
          IsLock: isLock
        }
        this.addService(packservice);
      }
    }
    this.disableEnableMaintenanceInput()
    this.calculateService();
    this.calculateSparepart();
  }

  disableEnableMaintenanceInput() {
    var x = this.packageTypeRuleObj.find(x => x.MaintenancePackageCode == this.InsuranceDataForm["controls"]["PackageType"].value);
    if (x.CanBeAdded == "YES") {
      this.isCanBeAddedMaintenance = true;
    }
    else {
      this.isCanBeAddedMaintenance = false;
    }
    if (x.Behaviour == "LOCK") {
      for (let i = 0; i < this.InsuranceDataForm.controls["SparePartObjs"]["controls"].length; i++) {
        this.InsuranceDataForm["controls"]["SparePartObjs"]["controls"][i]["controls"]["SparePartAmt"].disable();
        this.InputLookupSparePartObjs[i].isDisable = true;
      }
      for (let i = 0; i < this.InsuranceDataForm.controls["ServiceObjs"]["controls"].length; i++) {
        this.InsuranceDataForm["controls"]["ServiceObjs"]["controls"][i]["controls"]["ServiceAmt"].disable();
        this.InputLookupServiceObjs[i].isDisable = true;
      }
      //this.isLookupDisable = true;
    }
    else {
      for (let i = 0; i < this.InsuranceDataForm.controls["SparePartObjs"]["controls"].length; i++) {
        this.InsuranceDataForm["controls"]["SparePartObjs"]["controls"][i]["controls"]["SparePartAmt"].enable();
        this.InputLookupSparePartObjs[i].isDisable = false;
      }
      for (let i = 0; i < this.InsuranceDataForm.controls["ServiceObjs"]["controls"].length; i++) {
        this.InsuranceDataForm["controls"]["ServiceObjs"]["controls"][i]["controls"]["ServiceAmt"].enable();
        this.InputLookupServiceObjs[i].isDisable = false;
      }
      //this.isLookupDisable = false;
    }
  }

  initLookupService() {
    let arrAddCrit = new Array();

    this.InputLookupServiceObj = new InputLookupObj();
    this.InputLookupServiceObj.urlJson = "./assets/uclookup/NAP/lookupServiceExpense.json";
    this.InputLookupServiceObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupServiceObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupServiceObj.pagingJson = "./assets/uclookup/NAP/lookupServiceExpense.json";
    this.InputLookupServiceObj.genericJson = "./assets/uclookup/NAP/lookupServiceExpense.json";
    this.InputLookupServiceObj.addCritInput = arrAddCrit;

    return this.InputLookupServiceObj;
  }

  addService(x) {
    var serviceObj = this.InsuranceDataForm.controls["ServiceObjs"] as FormArray;
    var length = this.InsuranceDataForm.controls["ServiceObjs"]["controls"].length;
    var max = 0;
    if (length > 0) {
      max = this.InsuranceDataForm["controls"]["ServiceObjs"]["controls"][length - 1]["controls"]["No"].value;
    }
    if (x == undefined) {
      serviceObj.push(this.addGroupService(undefined, max + 1));
    }
    else {
      serviceObj.push(this.addGroupService(x, max + 1));
    }

    var InputLookupServiceObj = this.initLookupService();
    this.InputLookupServiceObjs.push(InputLookupServiceObj);

    this.dictServiceLookup[max + 1] = InputLookupServiceObj;

    if (x != undefined) {
      this.dictServiceLookup[max + 1].nameSelect = x.ServiceName;
      this.dictServiceLookup[max + 1].jsonSelect = x;
      this.InputLookupServiceObjs[max].jsonSelect = x;
      this.InputLookupServiceObjs[max].nameSelect = x.ServiceName;
    }
  }

  addGroupService(appAssetServiceObj, i) {
    if (appAssetServiceObj == undefined) {
      return this.fb.group({
        No: [i],
        ServiceCode: ['', [Validators.required, Validators.maxLength(50)]],
        ServiceName: ['', [Validators.maxLength(100)]],
        ServiceAmt: ['', Validators.required],
        IsLock: [false]
      })
    } else {
      return this.fb.group({
        No: [i],
        ServiceCode: [appAssetServiceObj.ServiceCode, [Validators.required, Validators.maxLength(50)]],
        ServiceName: [appAssetServiceObj.ServiceName, [Validators.maxLength(100)]],
        ServiceAmt: [appAssetServiceObj.ServiceAmt, Validators.required],
        IsLock: [appAssetServiceObj.IsLock]
      })

    }
  }

  SetService(i, event) {
    this.InsuranceDataForm.controls["ServiceObjs"]["controls"][i].patchValue({
      ServiceName: event.ServiceName,
      ServiceCode: event.ServiceCode
    });
  }

  deleteService(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var appServiceObjs = this.InsuranceDataForm.controls["ServiceObjs"] as FormArray;
      var no = appServiceObjs.controls[i]["controls"]["No"].value;
      appServiceObjs.removeAt(i);
      this.InputLookupServiceObjs.splice(i, 1);
      this.InsuranceDataForm.removeControl("lookupServiceObj" + no);
      this.calculateService();
    }
  }

  deleteServiceWithoutConfirm(i) {
    var appServiceObjs = this.InsuranceDataForm.controls["ServiceObjs"] as FormArray;
    var no = appServiceObjs.controls[i]["controls"]["No"].value;
    appServiceObjs.removeAt(i);
    this.InputLookupServiceObjs.splice(i, 1);
    this.InsuranceDataForm.removeControl("lookupServiceObj" + no);

  }


  initLookupSparePart() {
    let arrAddCrit = new Array();

    this.InputLookupSparePartObj = new InputLookupObj();
    this.InputLookupSparePartObj.urlJson = "./assets/uclookup/NAP/lookupSparePartExpense.json";
    this.InputLookupSparePartObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupSparePartObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupSparePartObj.pagingJson = "./assets/uclookup/NAP/lookupSparePartExpense.json";
    this.InputLookupSparePartObj.genericJson = "./assets/uclookup/NAP/lookupSparePartExpense.json";
    this.InputLookupSparePartObj.addCritInput = arrAddCrit;

    return this.InputLookupSparePartObj;
  }

  addSparePart(x) {
    var sparePartObj = this.InsuranceDataForm.controls["SparePartObjs"] as FormArray;
    var length = this.InsuranceDataForm.controls["SparePartObjs"]["controls"].length;
    var max = 0;
    if (length > 0) {
      max = this.InsuranceDataForm["controls"]["SparePartObjs"]["controls"][length - 1]["controls"]["No"].value;
    }
    if (x == undefined) {
      sparePartObj.push(this.addGroupSparePart(undefined, max + 1));
    }
    else {
      sparePartObj.push(this.addGroupSparePart(x, max + 1));
    }

    var InputLookupSparePartObj = this.initLookupSparePart();
    this.InputLookupSparePartObjs.push(InputLookupSparePartObj);

    this.dictSparePartLookup[max + 1] = InputLookupSparePartObj;

    if (x != undefined) {
      this.dictSparePartLookup[max + 1].nameSelect = x.SparePartName;
      this.dictSparePartLookup[max + 1].jsonSelect = x;
      this.InputLookupSparePartObjs[max].jsonSelect = x;
      this.InputLookupSparePartObjs[max].nameSelect = x.SparePartName;
    }
  }

  addGroupSparePart(appAssetSparePartObj, i) {
    if (appAssetSparePartObj == undefined) {
      return this.fb.group({
        No: [i],
        SparePartCode: ['', [Validators.required, Validators.maxLength(50)]],
        SparePartName: ['', [Validators.maxLength(100)]],
        SparePartAmt: ['', Validators.required],
        IsLock: [false]
      })
    } else {
      return this.fb.group({
        No: [i],
        SparePartCode: [appAssetSparePartObj.SparePartCode, [Validators.required, Validators.maxLength(50)]],
        SparePartName: [appAssetSparePartObj.SparePartName, [Validators.maxLength(100)]],
        SparePartAmt: [appAssetSparePartObj.SparePartAmt, Validators.required],
        IsLock: [appAssetSparePartObj.IsLock]
      })
    }
  }

  SetSparePart(i, event) {
    this.InsuranceDataForm.controls["SparePartObjs"]["controls"][i].patchValue({
      SparePartName: event.SparePartName,
      SparePartCode: event.SparePartCode
    });
  }

  deleteSparePart(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var appSparePartObjs = this.InsuranceDataForm.controls["SparePartObjs"] as FormArray;
      var no = appSparePartObjs.controls[i]["controls"]["No"].value;
      appSparePartObjs.removeAt(i);
      this.InputLookupSparePartObjs.splice(i, 1);
      this.InsuranceDataForm.removeControl("lookupSparePartObj" + no);
      this.calculateSparepart();
    }
  }

  deleteSparePartWithoutConfirm(i) {

    var appSparePartObjs = this.InsuranceDataForm.controls["SparePartObjs"] as FormArray;
    var no = appSparePartObjs.controls[i]["controls"]["No"].value;
    appSparePartObjs.removeAt(i);
    this.InputLookupSparePartObjs.splice(i, 1);
    this.InsuranceDataForm.removeControl("lookupSparePartObj" + no);

  }
  isExpenseCanAdd: boolean = true;
  async getOtherExpenseFromRule() {
    var obj = { Id: this.AppAssetId };
    await this.http.post(URLConstant.GetOtherExpenseByAppAssetId, obj).toPromise().then(
      (response) => {
        var expenseObj = response
        if (expenseObj["EXPENSECanBeAdded"] == "YES") {
          this.isExpenseCanAdd = true;
        }
        else {
          this.isExpenseCanAdd = false;
        }
        for (let i = 0; i < expenseObj["ExpenseTypes"].length; i++) {
          var isLock = false;
          if (expenseObj["Behaviour"][i] == "LOCK") {
            isLock = true;
          }
          var x = {
            OthExpenseCode: expenseObj["ExpenseTypes"][i],
            OthExpenseName: expenseObj["ExpenseTypesName"][i],
            OthExpenseAmt: expenseObj["ExpenseAmt"][i],
            IsLock: isLock,
            BehaviourCode: expenseObj["Behaviour"][i]
          };
          this.addOtherExpense(x);
          if (expenseObj["Behaviour"][i] == "LOCK") {
            this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseAmt"].disable();
            this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseCode"].disable();
          }
          else {
            this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseAmt"].enable();
            this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseCode"].enable();
          }
        }
        this.calculateExpense();
      }
    );
  }

  async getOtherExpense() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeOtherExpenseOpl };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.otherExpenseObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  addOtherExpense(x) {
    var otherExpenseObj = this.InsuranceDataForm.controls["OtherExpenseObjs"] as FormArray;
    var length = this.InsuranceDataForm.controls["OtherExpenseObjs"]["controls"].length;
    var max = 0;
    if (length > 0) {
      max = this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][length - 1]["controls"]["No"].value;
    }
    if (x != undefined) {
      otherExpenseObj.push(this.addGroupOtherExpense(x, max + 1));
    }
    else {
      otherExpenseObj.push(this.addGroupOtherExpense(undefined, max + 1));
    }


    var otherExpObj = this.otherExpenseObj;

    this.dictOtherExpense[max + 1] = otherExpObj;
  }

  addGroupOtherExpense(appAssetOtherExpenseObj, i) {
    if (appAssetOtherExpenseObj == undefined) {
      return this.fb.group({
        No: [i],
        OthExpenseCode: ['', [Validators.required, Validators.maxLength(50)]],
        OthExpenseName: ['', [Validators.maxLength(100)]],
        OthExpenseAmt: ['', Validators.required],
        IsLock: [false],
        BehaviourCode: ['DEFAULT']
      })
    } else {
      return this.fb.group({
        No: [i],
        OthExpenseCode: [appAssetOtherExpenseObj.OthExpenseCode, [Validators.required, Validators.maxLength(50)]],
        OthExpenseName: [appAssetOtherExpenseObj.OthExpenseName, [Validators.maxLength(100)]],
        OthExpenseAmt: [appAssetOtherExpenseObj.OthExpenseAmt, Validators.required],
        IsLock: [appAssetOtherExpenseObj.IsLock],
        BehaviourCode: [appAssetOtherExpenseObj.BehaviourCode]
      })
    }
  }

  deleteOtherExpense(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var appSparePartObjs = this.InsuranceDataForm.controls["OtherExpenseObjs"] as FormArray;
      appSparePartObjs.removeAt(i);
      this.calculateExpense();
    }
  }


  async getFeeExpense() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeFeeTypeOpl };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.feeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async getInputFeeExpense() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInpFeeTypeOpl };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.inpFeeObj = response[CommonConstant.ReturnObj];
        this.GetGSValueInputFeeType();

      }
    );
  }

  async GetGSValueInputFeeType() {
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeInputOPLFeeType }).toPromise().then(
      (response) => {
        this.InsuranceDataForm.patchValue({
          FeeInputType: response.GsValue
        });
        this.changeInputFee();
        this.GetGSValueInputFeeTypeBehaviour();
      });
  }
  isInputTypeLock: boolean = false;
  async GetGSValueInputFeeTypeBehaviour() {
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeInputOPLFeeBehaviour }).toPromise().then(
      (response) => {
        if (response.GsValue == "LOCK") {
          this.isInputTypeLock = true;
        }
        else {
          this.isInputTypeLock = false;;
        }
      });
  }
  isIncludeVAT: boolean = false;
  changeInputFee() {
    if (this.InsuranceDataForm.controls.FeeInputType.value == "VAT") {
      this.isIncludeVAT = true;
    }
    else {
      this.isIncludeVAT = false;
    }
    for (let i = 0; i < this.InsuranceDataForm.controls["FeeObjs"]["controls"].length; i++) {
      this.calculateChangeVAT(i)

    }
  }

  async addFee() {
    var feeObj = this.InsuranceDataForm.controls["FeeObjs"] as FormArray;
    var length = this.InsuranceDataForm.value["FeeObjs"].length;

    var obj = { Id: this.AppAssetId };
    await this.http.post(URLConstant.GetFeeExpenseByAppAssetId, obj).toPromise().then(
      (response) => {
        var res = response;
        for (let i = 0; i < res["FeeTypes"].length; i++) {
          feeObj.push(this.addfeeinput(res["FeeTypes"][i], res["FeeTypesName"][i], res["FeeAmt"][i], res["FeeCapitalizedAmt"][i], i + 1, res["BehaviourFee"][i], res["BehaviourFeeCapitalized"][i]));
          if (res["BehaviourFee"][i] == "LOCK") {
            this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeAmt"].disable();
          }
          if (res["BehaviourFeeCapitalized"][i] == "LOCK") {
            this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["CptlzAmt"].disable();
          }
        }
        this.calculateFee();
        this.calculateVAT();
        this.calculateCptlz();
      }
    );

    var fee = this.feeObj;
    var max = 0;
    if (length > 0) {
      max = this.InsuranceDataForm.value["FeeObjs"][length - 1].No;
    }
    this.dictFee[max + 1] = fee;
  }

  async addFeeIfExist(x) {
    var feeObj = this.InsuranceDataForm.controls["FeeObjs"] as FormArray;
    var length = this.InsuranceDataForm.value["FeeObjs"].length;

    feeObj.push(this.addfeeinput(x.FeeTypeCode, x.FeeTypeName, x.FeeTypeAmt, x.CptlzAmt, x.i + 1, x.FeeBehaviour, x.CptlzBehaviour));

    var fee = this.feeObj;
    var max = 0;
    if (length > 0) {
      max = this.InsuranceDataForm.value["FeeObjs"][length - 1].No;
    }
    this.dictFee[max + 1] = fee;
  }

  addfeeinput(code, name, feeAmt, feeCptlz, i, FeeBeha, CptlBeha) {
    if (this.InsuranceDataForm["controls"]["FeeInputType"].value == "VAT") {
      return this.fb.group({
        No: [i],
        FeeTypeCode: [code, [Validators.required, Validators.maxLength(50)]],
        FeeTypeName: [name, [Validators.maxLength(100)]],
        FeeTypeAmt: [feeAmt, Validators.required],
        VATAmt: [feeAmt - (feeAmt / 1.1), Validators.required],
        CptlzAmt: [feeCptlz, Validators.required],
        FeeBehaviour: [FeeBeha],
        CptlzBehaviour: [CptlBeha]
      })
    }
    else {
      return this.fb.group({
        No: [i],
        FeeTypeCode: [code, [Validators.required, Validators.maxLength(50)]],
        FeeTypeName: [name, [Validators.maxLength(100)]],
        FeeTypeAmt: [feeAmt, Validators.required],
        VATAmt: [feeAmt * 0.1, Validators.required],
        CptlzAmt: [feeCptlz, Validators.required],
        FeeBehaviour: [FeeBeha],
        CptlzBehaviour: [CptlBeha]
      })
    }
  }
  calculateAssetExpense() {
    this.InsuranceDataForm.patchValue({
      TotalAssetExpense: this.InsuranceDataForm["controls"]["TotalInsInscoAmt"].value + this.InsuranceDataForm["controls"]["TotalServiceAmt"].value + this.InsuranceDataForm["controls"]["TotalSparepartAmt"].value + this.InsuranceDataForm["controls"]["TotalOthExpenseAmt"].value + this.InsuranceDataForm["controls"]["TotalFeeCptlzAmt"].value
    });
  }
  calculateService() {
    this.InsuranceDataForm.patchValue({
      TotalServiceAmt: 0
    });
    for (let i = 0; i < this.InsuranceDataForm.controls["ServiceObjs"]["controls"].length; i++) {
      this.InsuranceDataForm.patchValue({
        TotalServiceAmt: this.InsuranceDataForm["controls"]["TotalServiceAmt"].value + this.InsuranceDataForm["controls"]["ServiceObjs"]["controls"][i]["controls"]["ServiceAmt"].value
      });
    }
    this.calculateAssetExpense();
  }

  calculateSparepart() {
    this.InsuranceDataForm.patchValue({
      TotalSparepartAmt: 0
    });
    for (let i = 0; i < this.InsuranceDataForm.controls["SparePartObjs"]["controls"].length; i++) {
      this.InsuranceDataForm.patchValue({
        TotalSparepartAmt: this.InsuranceDataForm["controls"]["TotalSparepartAmt"].value + this.InsuranceDataForm["controls"]["SparePartObjs"]["controls"][i]["controls"]["SparePartAmt"].value
      });
    }
    this.calculateAssetExpense();
  }

  calculateExpense() {
    this.InsuranceDataForm.patchValue({
      TotalOthExpenseAmt: 0
    });
    for (let i = 0; i < this.InsuranceDataForm.controls["OtherExpenseObjs"]["controls"].length; i++) {
      this.InsuranceDataForm.patchValue({
        TotalOthExpenseAmt: this.InsuranceDataForm["controls"]["TotalOthExpenseAmt"].value + this.InsuranceDataForm["controls"]["OtherExpenseObjs"]["controls"][i]["controls"]["OthExpenseAmt"].value
      });
    }
    this.calculateAssetExpense();
  }

  calculateChangeVAT(i) {
    if (this.InsuranceDataForm["controls"]["FeeInputType"].value == "VAT") {
      this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i].patchValue({
        VATAmt: this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeAmt"].value - (this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeAmt"].value / 1.1),
        CptlzAmt: this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeAmt"].value / 1.1
      });
    }
    else {
      this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i].patchValue({
        VATAmt: this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeAmt"].value * 0.1,
        CptlzAmt: this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeAmt"].value
      });
    }
    this.calculateFee();
    this.calculateCptlz();
  }

  calculateFee() {
    this.InsuranceDataForm.patchValue({
      TotalFeeBfrVATAmt: 0
    });
    if (this.InsuranceDataForm["controls"]["FeeInputType"].value == "VAT") {
      for (let i = 0; i < this.InsuranceDataForm.controls["FeeObjs"]["controls"].length; i++) {
        this.InsuranceDataForm.patchValue({
          TotalFeeBfrVATAmt: this.InsuranceDataForm["controls"]["TotalFeeBfrVATAmt"].value + this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeAmt"].value / 1.1
        });
      }
    }
    else {
      for (let i = 0; i < this.InsuranceDataForm.controls["FeeObjs"]["controls"].length; i++) {
        this.InsuranceDataForm.patchValue({
          TotalFeeBfrVATAmt: this.InsuranceDataForm["controls"]["TotalFeeBfrVATAmt"].value + this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["FeeTypeAmt"].value
        });
      }
    }
  }

  calculateVAT() {
    this.InsuranceDataForm.patchValue({
      TotalVATAmt: 0
    });
    for (let i = 0; i < this.InsuranceDataForm.controls["FeeObjs"]["controls"].length; i++) {
      this.InsuranceDataForm.patchValue({
        TotalVATAmt: this.InsuranceDataForm["controls"]["TotalVATAmt"].value + this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["VATAmt"].value
      });
    }
  }

  calculateCptlz() {
    this.InsuranceDataForm.patchValue({
      TotalFeeCptlzAmt: 0
    });
    for (let i = 0; i < this.InsuranceDataForm.controls["FeeObjs"]["controls"].length; i++) {
      this.InsuranceDataForm.patchValue({
        TotalFeeCptlzAmt: this.InsuranceDataForm["controls"]["TotalFeeCptlzAmt"].value + this.InsuranceDataForm["controls"]["FeeObjs"]["controls"][i]["controls"]["CptlzAmt"].value
      });
    }
    this.calculateAssetExpense();
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.InsuranceDataForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
  }
}
