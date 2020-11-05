import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { AppAssetAccessoryObj } from 'app/shared/model/AppAssetAccessoryObj.model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { AppInsuranceObj } from 'app/shared/model/AppInsuranceObj.Model';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';
import { InsuranceDataObj } from 'app/shared/model/InsuranceDataObj.Model';
import { InsuranceDataInsRateRuleObj } from 'app/shared/model/InsuranceDataInsRateRuleObj.Model';
import { ResultInsRateRuleObj } from 'app/shared/model/ResultInsRateRuleObj.Model';
import { RequestCalcInsObj } from 'app/shared/model/RequestCalcInsObj.Model';
import { CalcInsMainCvgObj } from 'app/shared/model/CalcInsMainCvgObj.Model';
import { CalcInsAddCvgObj } from 'app/shared/model/CalcInsAddCvgObj.Model';
import { ResultCalcInsObj } from 'app/shared/model/ResultCalcInsObj.Model';
import { AppInsMainCvgObj } from 'app/shared/model/AppInsMainCvgObj.Model';
import { AppInsAddCvgObj } from 'app/shared/model/AppInsAddCvgObj.Model';
import { ResultSubsidySchmRuleObj } from 'app/shared/model//SubsidySchm/ResultSubsidySchmRuleObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { AppCollateralAccessoryObj } from 'app/shared/model/AppCollateralAccessoryObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InsRateAddCvgRuleObj } from 'app/shared/model/InsRateAddCvgRuleObj.Model';


@Component({
  selector: 'app-insurance-data',
  templateUrl: './insurance-data.component.html',
  styleUrls: ['./insurance-data.component.css']
})

export class InsuranceDataComponent implements OnInit {

  @Input() appId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  appAssetId: number = 0;
  appCollateralId: number = 0;
  totalAssetPriceAmt: number;
  defaultInsAssetRegion: string;
  IsMultiAsset: string = "false";

  appObj: NapAppModel;
  appAssetObj: AppAssetObj;
  appAssetAccessoryObjs: Array<AppAssetAccessoryObj>;
  appFinDataObj: AppFinDataObj;
  appInsuranceObj: AppInsuranceObj;
  appInsObjObj: AppInsObjObj;
  appInsMainCvgObj: Array<AppInsMainCvgObj>;
  appCollateralObj: AppCollateralObj;
  appCollateralAccessoryObjs: Array<AppCollateralAccessoryObj>;
  ruleObj: ResultInsRateRuleObj;
  subsidyRuleObj: ResultSubsidySchmRuleObj;
  calcInsObj: ResultCalcInsObj;
  saveObj: InsuranceDataObj;

  minInsLength: number = 1;
  maxInsLength: number = 9999;

  insuredByObj: Array<KeyValueObj>;
  inscoBranchObj: Array<KeyValueObj>;
  paidByObj: Array<KeyValueObj>;
  insMainCvgTypeObj: Array<KeyValueObj>;
  insMainCvgTypeRuleObj = [{
    Key: "",
    Value: ""
  }];
  insAddCvgTypeObj: any;
  insAddCvgTypeRuleObj: [{
    Key: "",
    Value: ""
  }];
  groupedAddCvgType: Array<string>;
  insAssetCoverPeriodObj: Array<KeyValueObj>;
  insAssetRegionObj: Array<KeyValueObj>;
  payPeriodToInscoObj: Array<KeyValueObj>;
  defaultInsMainCvgType: string;
  sumInsuredAmtObj: Array<string> = new Array<string>();
  insRateAddCvgRuleTplObjs: Array<InsRateAddCvgRuleObj>;
  showGenerate: boolean = false;
  isGenerate: boolean = false;
  isCalculate: boolean = false;
  businessDt: Date = new Date(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));

  InsuranceDataForm = this.fb.group({
    InsAssetCoveredBy: ['', [Validators.required, Validators.maxLength(50)]],
    InsAssetPaidBy: ['', [Validators.required, Validators.maxLength(50)]],
    InsAssetCoverPeriod: ['', [Validators.required, Validators.maxLength(50)]],
    InscoBranchCode: ['', [Validators.required, Validators.maxLength(100)]],
    InscoBranchName: [''],
    CustInscoBranchName: ['', [Validators.required, Validators.maxLength(100)]],
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
    TotalCustFeeAmt : [0],
    TotalCustMainPremiAmt: [0],
    TotalCustAddPremiAmt: [0],
    TotalInscoMainPremiAmt: [0],
    TotalInscoAddPremiAmt: [0],
    InscoAdminFeeAmt: [0],
    CustAdminFeeAmt: [0],
    CustStampDutyFeeAmt : [0],
    InscoStampDutyFeeAmt : [0],
    TotalInscoFeeAmt : [0],
    CvgAmt: [0, Validators.required],
    CustCvgAmt: [0, Validators.required],
    TotalCustDiscAmt: [0],
    InsCpltzAmt: [0],
    PayPeriodToInsco: ['', Validators.required],
    IsFullCapitalizedAmount: [false] 
  });

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) this.appId = params["AppId"];
      if (params["IsMultiAsset"] != null) this.IsMultiAsset = params["IsMultiAsset"];
    })
  }
  async ngOnInit(): Promise<void> {
    await this.getInsuranceData();
    await this.bindInsMainCvgTypeObj();
    await this.bindInsAddCvgTypeObj();
    await this.bindInsuredByObj();
    await this.bindPaidByObj();
    await this.bindInsAssetCoverPeriodObj();
    await this.bindInsAssetRegionObj();
    await this.bindInscoBranchObj();
    await this.bindPayPeriodToInscoObj();
    if (this.appInsObjObj != null) {
      await this.bindAppInsAndAppInsObj(this.appInsObjObj.InsAssetCoveredBy);
    }else{
      this.InsuranceDataForm.patchValue({
        InsAssetRegion: this.defaultInsAssetRegion
      });
    }
  }

  SaveForm() {
    var insuredBy = this.InsuranceDataForm.controls.InsAssetCoveredBy.value;

    if (insuredBy == CommonConstant.InsuredByCompany || insuredBy == CommonConstant.InsuredByCustomerCompany) {
      var custDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      var totalPremiToCust = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value + this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value + this.InsuranceDataForm.controls.TotalCustFeeAmt.value;
      var insCpltzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;

      if (this.isGenerate == false) {
        this.toastr.warningMessage(ExceptionConstant.CLICK_GENERATE_INSURANCE);
        return;
      }
      if (this.isCalculate == false) {
        this.toastr.warningMessage(ExceptionConstant.CLICK_CALCULATE_INSURANCE);
        return;
      }
      if (custDiscAmt > totalPremiToCust) {
        this.toastr.warningMessage(ExceptionConstant.DISCOUNT_AMOUNT_CANNOT_HIGHER_THAN + "Total Premi to Customer.");
        return;
      }
      if (insCpltzAmt > totalPremiToCust - custDiscAmt) {
        this.toastr.warningMessage(ExceptionConstant.CAPITALIZE_AMOUNT_CANNOT_HIGHER_THAN + "Total Premi to Customer after Discount.");
        return;
      }
    }

    if (insuredBy == CommonConstant.InsuredByCustomer || insuredBy == CommonConstant.InsuredByCustomerCompany) {
      var startDt = new Date(this.InsuranceDataForm.controls.CustCoverStartDt.value);
      var endDt = new Date(this.InsuranceDataForm.controls.EndDt.value);

      if (endDt < this.businessDt) {
        this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LOWER_THAN + "Business Date.");
        return;
      }

      if (endDt < startDt) {
        this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LOWER_THAN + "Start Date.");
        return;
      }
    }
    this.setSaveObj(insuredBy);

    if (this.IsMultiAsset = "false") {
      this.http.post(URLConstant.AddEditInsuranceData, this.saveObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.outputTab.emit();
        });
    }
    else {
      this.http.post(URLConstant.AddEditInsuranceDataMultiAsset, this.saveObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.outputTab.emit();
        });
    }
  }

  Cancel() {
    this.outputCancel.emit();
  }

  setSaveObj(insuredBy) {
    var user = JSON.parse(localStorage.getItem("UserAccess"));

    this.saveObj = new InsuranceDataObj();
    this.saveObj.AppId = this.appId;
    this.saveObj.AppInsuranceObj.AppId = this.appId;
    this.saveObj.AppInsObjObj.AppId = this.appId;
    this.saveObj.AppInsObjObj.InsAssetCoveredBy = insuredBy;
    this.saveObj.AppInsObjObj.InsSeqNo = 1;

    if (this.appAssetId != 0) {
      this.saveObj.AppInsObjObj.AppAssetId = this.appAssetId;
    }
    if (this.appCollateralId != 0) {
      this.saveObj.AppInsObjObj.AppCollateralId = this.appCollateralId;
    }

    if (insuredBy == CommonConstant.InsuredByOffSystem) {
      this.saveObj.AppInsObjObj.InsAssetPaidBy = CommonConstant.InsPaidByCustomer;
    }

    if (insuredBy == CommonConstant.InsuredByCustomer) {
      this.saveObj.AppInsObjObj.InsAssetPaidBy = CommonConstant.InsPaidByCustomer;
      this.saveObj.AppInsObjObj.CustInscoBranchName = this.InsuranceDataForm.controls.CustInscoBranchName.value;
      this.saveObj.AppInsObjObj.InsPolicyNo = this.InsuranceDataForm.controls.InsPolicyNo.value;
      this.saveObj.AppInsObjObj.InsPolicyName = this.InsuranceDataForm.controls.InsPolicyName.value;
      this.saveObj.AppInsObjObj.CustCvgAmt = this.InsuranceDataForm.controls.CustCvgAmt.value;
      this.saveObj.AppInsObjObj.CustCoverStartDt = this.InsuranceDataForm.controls.CustCoverStartDt.value;
      this.saveObj.AppInsObjObj.EndDt = this.InsuranceDataForm.controls.EndDt.value;
      this.saveObj.AppInsObjObj.CustNotes = this.InsuranceDataForm.controls.CustNotes.value;
    }

    if (insuredBy == CommonConstant.InsuredByCompany) {
      this.saveObj.AppInsObjObj.InsAssetPaidBy = this.InsuranceDataForm.controls.InsAssetPaidBy.value;
      this.saveObj.AppInsObjObj.InscoBranchCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
      this.saveObj.AppInsObjObj.InscoBranchName = this.InsuranceDataForm.controls.InscoBranchName.value;
      this.saveObj.AppInsObjObj.InsAssetCoverPeriod = this.InsuranceDataForm.controls.InsAssetCoverPeriod.value;
      this.saveObj.AppInsObjObj.InsLength = this.InsuranceDataForm.controls.InsLength.value;
      this.saveObj.AppInsObjObj.CvgAmt = this.InsuranceDataForm.controls.CvgAmt.value;
      this.saveObj.AppInsObjObj.Notes = this.InsuranceDataForm.controls.Notes.value;
      this.saveObj.AppInsObjObj.InsAssetRegion = this.InsuranceDataForm.controls.InsAssetRegion.value;
      this.saveObj.AppInsObjObj.InsCpltzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      this.saveObj.AppInsObjObj.CustAdminFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;
      this.saveObj.AppInsObjObj.InscoAdminFeeAmt = this.InsuranceDataForm.controls.InscoAdminFeeAmt.value;
      this.saveObj.AppInsObjObj.CustStampDutyFee = this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
      this.saveObj.AppInsObjObj.InscoStampDutyFee = this.InsuranceDataForm.controls.InscoStampDutyFeeAmt.value;
      this.saveObj.AppInsObjObj.TotalCustMainPremiAmt = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustAddPremiAmt = this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsObjObj.TotalInsCustAmt = this.saveObj.AppInsObjObj.TotalCustMainPremiAmt + this.saveObj.AppInsObjObj.TotalCustAddPremiAmt + this.InsuranceDataForm.controls.TotalCustFeeAmt.value - this.saveObj.AppInsObjObj.TotalCustDiscAmt;
      this.saveObj.AppInsObjObj.TotalInsInscoAmt = this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt + this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt + this.InsuranceDataForm.controls.TotalInscoFeeAmt.value - this.saveObj.AppInsObjObj.TotalInscoDiscAmt;
      this.saveObj.AppInsObjObj.StartDt = this.setDateWithoutTimezone(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));
      this.saveObj.AppInsObjObj.EndDt = this.setDateWithoutTimezone(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));
      this.saveObj.AppInsObjObj.EndDt.setMonth(this.saveObj.AppInsObjObj.EndDt.getMonth() + this.saveObj.AppInsObjObj.InsLength);
      this.saveObj.AppInsObjObj.PayPeriodToInsco = this.InsuranceDataForm.controls.PayPeriodToInsco.value;

      var addedTenor = 0;

      for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
        var insCoverage = new AppInsMainCvgObj();
        insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
        insCoverage.Tenor = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
        insCoverage.MrMainCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;

        insCoverage.StartDt = this.setDateWithoutTimezone(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));
        insCoverage.StartDt.setMonth(insCoverage.StartDt.getMonth() + addedTenor);
        insCoverage.EndDt = this.setDateWithoutTimezone(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));
        insCoverage.EndDt.setMonth(insCoverage.EndDt.getMonth() + addedTenor + insCoverage.Tenor);

        addedTenor += insCoverage.Tenor;

        insCoverage.IsMainIns = true;
        insCoverage.SumInsuredPrcnt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredPrcnt.value;
        insCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredAmt.value;
        insCoverage.StdMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].StdMainPremiRate.value;
        insCoverage.CustMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiRate.value;
        insCoverage.InscoMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiRate.value;
        insCoverage.CustMainPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiAmt.value;
        insCoverage.InscoMainPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiAmt.value;
        insCoverage.TotalCustAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].TotalCustAddPremiAmt.value;
        insCoverage.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].TotalInscoAddPremiAmt.value;

        for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
          if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true) {
            var addCoverage = new AppInsAddCvgObj();

            addCoverage.MrAddCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
            addCoverage.SumInsuredPrcnt = insCoverage.SumInsuredPrcnt;
            addCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SumInsuredAmt.value;
            if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value == CommonConstant.PremiumTypeAmt) {
              addCoverage.StdAddPremiRate = 0;
              addCoverage.InscoAddPremiRate = 0;
              addCoverage.CustAddPremiRate = 0;
            } else {
              addCoverage.StdAddPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].StdAddPremiRate.value;
              addCoverage.InscoAddPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiRate.value;
              addCoverage.CustAddPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiRate.value;
            }
            addCoverage.InscoAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiAmt.value;
            addCoverage.CustAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiAmt.value;
            insCoverage.AppInsAddCvgObjs.push(addCoverage);
          }
        }
        this.saveObj.AppInsMainCvgObjs.push(insCoverage);
      }

      this.saveObj.AppInsuranceObj.TotalCustMainPremiAmt = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustAddPremiAmt = this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value + this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustPremiAmt = this.saveObj.AppInsuranceObj.TotalCustMainPremiAmt + this.saveObj.AppInsuranceObj.TotalCustAddPremiAmt + this.saveObj.AppInsuranceObj.TotalCustFeeAmt - this.saveObj.AppInsuranceObj.TotalCustDiscAmt;
      this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoFeeAmt = this.InsuranceDataForm.controls.InscoAdminFeeAmt.value + this.InsuranceDataForm.controls.InscoStampDutyFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoDiscAmt = 0;
      this.saveObj.AppInsuranceObj.TotalInscoPremiAmt = this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoFeeAmt - this.saveObj.AppInsuranceObj.TotalInscoDiscAmt;
      this.saveObj.AppInsuranceObj.TotalInsCptlzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      this.saveObj.AppInsuranceObj.TotalPremiPaidByCustAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInsCptlzAmt;
      this.saveObj.AppInsuranceObj.TotalInsIncomeAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInscoPremiAmt;
    }

    if (insuredBy == CommonConstant.InsuredByCustomerCompany) {
      this.saveObj.AppInsObjObj.InsAssetPaidBy = this.InsuranceDataForm.controls.InsAssetPaidBy.value;
      this.saveObj.AppInsObjObj.InscoBranchCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
      this.saveObj.AppInsObjObj.InscoBranchName = this.InsuranceDataForm.controls.InscoBranchName.value;
      this.saveObj.AppInsObjObj.InsAssetCoverPeriod = this.InsuranceDataForm.controls.InsAssetCoverPeriod.value;
      this.saveObj.AppInsObjObj.InsLength = this.InsuranceDataForm.controls.InsLength.value;
      this.saveObj.AppInsObjObj.CvgAmt = this.InsuranceDataForm.controls.CvgAmt.value;;
      this.saveObj.AppInsObjObj.Notes = this.InsuranceDataForm.controls.Notes.value;
      this.saveObj.AppInsObjObj.InsAssetRegion = this.InsuranceDataForm.controls.InsAssetRegion.value;
      this.saveObj.AppInsObjObj.InsCpltzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      this.saveObj.AppInsObjObj.CustAdminFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;
      this.saveObj.AppInsObjObj.InscoAdminFeeAmt = this.InsuranceDataForm.controls.InscoAdminFeeAmt.value;
      this.saveObj.AppInsObjObj.CustStampDutyFee = this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
      this.saveObj.AppInsObjObj.InscoStampDutyFee = this.InsuranceDataForm.controls.InscoStampDutyFeeAmt.value;
      this.saveObj.AppInsObjObj.TotalCustMainPremiAmt = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustAddPremiAmt = this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsObjObj.TotalInsCustAmt = this.saveObj.AppInsObjObj.TotalCustMainPremiAmt + this.saveObj.AppInsObjObj.TotalCustAddPremiAmt + this.InsuranceDataForm.controls.TotalCustFeeAmt.value - this.saveObj.AppInsObjObj.TotalCustDiscAmt;
      this.saveObj.AppInsObjObj.TotalInsInscoAmt = this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt + this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt + this.InsuranceDataForm.controls.TotalInscoFeeAmt.value - this.saveObj.AppInsObjObj.TotalInscoDiscAmt;
      this.saveObj.AppInsObjObj.CustInscoBranchName = this.InsuranceDataForm.controls.CustInscoBranchName.value;
      this.saveObj.AppInsObjObj.InsPolicyNo = this.InsuranceDataForm.controls.InsPolicyNo.value;
      this.saveObj.AppInsObjObj.InsPolicyName = this.InsuranceDataForm.controls.InsPolicyName.value;
      this.saveObj.AppInsObjObj.CustCvgAmt = this.InsuranceDataForm.controls.CustCvgAmt.value;
      this.saveObj.AppInsObjObj.CustCoverStartDt = this.InsuranceDataForm.controls.CustCoverStartDt.value;
      this.saveObj.AppInsObjObj.StartDt = this.setDateWithoutTimezone(this.InsuranceDataForm.controls.EndDt.value);
      this.saveObj.AppInsObjObj.EndDt = this.setDateWithoutTimezone(this.InsuranceDataForm.controls.EndDt.value);
      this.saveObj.AppInsObjObj.EndDt.setMonth(this.saveObj.AppInsObjObj.EndDt.getMonth() + this.saveObj.AppInsObjObj.InsLength);
      this.saveObj.AppInsObjObj.CustNotes = this.InsuranceDataForm.controls.CustNotes.value;
      this.saveObj.AppInsObjObj.PayPeriodToInsco = this.InsuranceDataForm.controls.PayPeriodToInsco.value;

      var addedTenor = 0;

      for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
        var insCoverage = new AppInsMainCvgObj();
        insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
        insCoverage.Tenor = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
        insCoverage.MrMainCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;

        insCoverage.StartDt = this.setDateWithoutTimezone(this.saveObj.AppInsObjObj.StartDt);
        insCoverage.StartDt.setMonth(insCoverage.StartDt.getMonth() + addedTenor);
        insCoverage.EndDt = this.setDateWithoutTimezone(this.saveObj.AppInsObjObj.StartDt);
        insCoverage.EndDt.setMonth(insCoverage.EndDt.getMonth() + addedTenor + insCoverage.Tenor);

        addedTenor += insCoverage.Tenor;

        insCoverage.IsMainIns = true;
        insCoverage.SumInsuredPrcnt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredPrcnt.value;
        insCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredAmt.value;
        insCoverage.StdMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].StdMainPremiRate.value;
        insCoverage.CustMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiRate.value;
        insCoverage.InscoMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiRate.value;
        insCoverage.CustMainPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiAmt.value;
        insCoverage.InscoMainPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiAmt.value;
        insCoverage.TotalCustAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].TotalCustAddPremiAmt.value;
        insCoverage.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].TotalInscoAddPremiAmt.value;

        for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
          if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true) {
            var addCoverage = new AppInsAddCvgObj();

            addCoverage.MrAddCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
            addCoverage.SumInsuredPrcnt = insCoverage.SumInsuredPrcnt;
            addCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SumInsuredAmt.value;
            if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value == CommonConstant.PremiumTypeAmt) {
              addCoverage.StdAddPremiRate = 0;
              addCoverage.InscoAddPremiRate = 0;
              addCoverage.CustAddPremiRate = 0;
            } else {
              addCoverage.StdAddPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].StdAddPremiRate.value;
              addCoverage.InscoAddPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiRate.value;
              addCoverage.CustAddPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiRate.value;
            }
            addCoverage.InscoAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiAmt.value;
            addCoverage.CustAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiAmt.value;
            insCoverage.AppInsAddCvgObjs.push(addCoverage);
          }
        }
        this.saveObj.AppInsMainCvgObjs.push(insCoverage);
      }

      this.saveObj.AppInsuranceObj.TotalCustMainPremiAmt = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustAddPremiAmt = this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value + this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustPremiAmt = this.saveObj.AppInsuranceObj.TotalCustMainPremiAmt + this.saveObj.AppInsuranceObj.TotalCustAddPremiAmt + this.saveObj.AppInsuranceObj.TotalCustFeeAmt - this.saveObj.AppInsuranceObj.TotalCustDiscAmt;
      this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoFeeAmt = this.InsuranceDataForm.controls.InscoAdminFeeAmt.value + this.InsuranceDataForm.controls.InscoStampDutyFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoDiscAmt = 0;
      this.saveObj.AppInsuranceObj.TotalInscoPremiAmt = this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoFeeAmt - this.saveObj.AppInsuranceObj.TotalInscoDiscAmt;
      this.saveObj.AppInsuranceObj.TotalInsCptlzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      this.saveObj.AppInsuranceObj.TotalPremiPaidByCustAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInsCptlzAmt;
      this.saveObj.AppInsuranceObj.TotalInsIncomeAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInscoPremiAmt;
    }

    if (this.appInsuranceObj != undefined) {
      this.saveObj.AppInsuranceObj.RowVersion = this.appInsuranceObj.RowVersion;
    }

    if (this.appInsObjObj != undefined) {
      this.saveObj.AppInsObjObj.RowVersion = this.appInsObjObj.RowVersion;
    }
  }

  async CalculateInsurance() {
    var reqObj = new RequestCalcInsObj();
    for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
      var insCoverage = new CalcInsMainCvgObj();

      insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
      insCoverage.Month = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
      insCoverage.CoverageAmt = this.InsuranceDataForm.controls.CvgAmt.value;;
      insCoverage.SumInsured = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredPrcnt.value;
      insCoverage.Rate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiRate.value;
      insCoverage.MainCoverageTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;
      insCoverage.RateToInsco = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiRate.value;

      for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
        if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true) {
          var addCoverage = new CalcInsAddCvgObj();

          addCoverage.BaseCalculation = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].BaseCalculation.value;
          addCoverage.SumInsured = insCoverage.SumInsured;
          addCoverage.Rate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiRate.value;
          addCoverage.RateType = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value;
          addCoverage.AddCoverageTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
          addCoverage.RateToInsco = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiRate.value;
          insCoverage.AddInsCoverage.push(addCoverage);
        }
      }
      reqObj.InsCoverage.push(insCoverage);
    }
    reqObj.AdminFee = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;
    reqObj.StampDutyFee =  + this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
    reqObj.InscoBranchCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    reqObj.ProdOfferingCode = this.appObj.ProdOfferingCode;
    reqObj.ProdOfferingVersion = this.appObj.ProdOfferingVersion;
    reqObj.AppId = this.appId;
    reqObj.AppAssetId = this.appAssetId;

    await this.http.post(URLConstant.CalculateInsurance, reqObj).toPromise().then(
      (response) => {
        this.calcInsObj = response["Result"];
        this.subsidyRuleObj = response["ResultSubsidy"];
        var custDiscAmt = 0;
        if (this.InsuranceDataForm.controls.InsAssetPaidBy.value == "CO") {
          custDiscAmt = this.calcInsObj.TotalMainPremiAmt + this.calcInsObj.TotalAdditionalPremiAmt + this.calcInsObj.TotalFeeAmt;
          this.InsuranceDataForm.patchValue({
            InsCpltzAmt: 0
          });
        }
        else if (this.subsidyRuleObj != null) {
          if (this.subsidyRuleObj.SubsidyValue != null) {
            for (let i = 0; i < this.subsidyRuleObj.SubsidyValue.length; i++) {
              //if (this.subsidyRuleObj.SubsidyFromType[i] == "INS" && this.subsidyRuleObj.SubsidyFromValue[i] == this.InsuranceDataForm.controls.InscoBranchCode.value) {
              custDiscAmt += this.subsidyRuleObj.SubsidyValue[i];
              //}
            }
          }
        }

        this.InsuranceDataForm.patchValue({
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
              if(currAddCvgType == CommonConstant.MrAddCvgTypeCodeTpl){
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
              if(currAddCvgType == CommonConstant.MrAddCvgTypeCodeTpl){
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
      }
    );
    this.BindCapitalize();
  }

  async GenerateInsurance(appInsMainCvgObj: Array<AppInsMainCvgObj>) {
    if (appInsMainCvgObj == undefined) {
      if (this.InsuranceDataForm.controls.InscoBranchCode.value == "") {
        this.toastr.warningMessage(ExceptionConstant.CHOOSE_INSCO_BRANCH);
        return;
      }
      if (this.InsuranceDataForm.controls.InsAssetPaidBy.value == "") {
        this.toastr.warningMessage(ExceptionConstant.CHOOSE_PAID_BY);
        return;
      }
      if (this.InsuranceDataForm.controls.InsAssetRegion.value == "") {
        this.toastr.warningMessage(ExceptionConstant.CHOOSE_REGION);
        return;
      }
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == "") {
        this.toastr.warningMessage(ExceptionConstant.CHOOSE_COVER_PERIOD);
        return;
      }
      if (this.InsuranceDataForm.controls.InsLength.value == "") {
        this.toastr.warningMessage(ExceptionConstant.INPUT_INSURANCE_LENGTH);
        return;
      }
      if (this.InsuranceDataForm.controls.InsLength.value < this.minInsLength) {
        this.toastr.warningMessage(ExceptionConstant.INSURANCE_LENGTH_MUST_HIGHER_THAN + (this.minInsLength - 1).toString());
        return;
      }
      if (this.InsuranceDataForm.controls.InsLength.value > this.maxInsLength) {
        this.toastr.warningMessage(ExceptionConstant.INSURANCE_LENGTH_MUST_LOWER_THAN + (this.maxInsLength + 1).toString());
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
    reqObj.AssetCategory = this.appCollateralObj.AssetCategoryCode;
    reqObj.AssetCondition = this.appCollateralObj.MrCollateralConditionCode;
    reqObj.AssetPriceAmount = this.totalAssetPriceAmt;
    reqObj.RegionCode = this.InsuranceDataForm.controls.InsAssetRegion.value;
    reqObj.ProdOfferingCode = this.appObj.ProdOfferingCode;
    reqObj.ProdOfferingVersion = this.appObj.ProdOfferingVersion;
    reqObj.AppCollateralId = this.appCollateralObj.AppCollateralId;

    await this.http.post(URLConstant.ExecuteInsRateRule, reqObj).toPromise().then(
      (response) => {
        this.ruleObj = response["Result"];
        this.insRateAddCvgRuleTplObjs = response["InsRateAddCvgRuleTplObjs"];
        if (this.ruleObj.InsAssetCategory == "") {
          this.toastr.warningMessage(ExceptionConstant.SETTING_RULE_FIRST);
          return;
        }
        this.sumInsuredAmtObj = new Array<string>();
        for(let i = 0; i < this.insRateAddCvgRuleTplObjs.length; i++){
          this.sumInsuredAmtObj.push(this.insRateAddCvgRuleTplObjs[i].SumInsuredAmt.toString());
        }

        this.bindInsMainCvgTypeRuleObj();
        this.bindInsAddCvgTypeRuleObj();
        if (appInsMainCvgObj == undefined) {
          this.InsuranceDataForm.patchValue({
            CustAdminFeeAmt: this.ruleObj.AdminFeeToCust,
            InscoAdminFeeAmt: this.ruleObj.AdminFeeFromInsco,
            CustStampDutyFeeAmt : this.ruleObj.CustStampdutyFeeToCust,
            InscoStampDutyFeeAmt : this.ruleObj.InscoStampdutyFeeToCust,
            TotalInscoFeeAmt: this.ruleObj.AdminFeeFromInsco + this.ruleObj.InscoStampdutyFeeToCust
          });
          this.GenerateMainAndAddCvgTable();
          this.isGenerate = true;
        } else {
          this.GenerateMainAndAddCvgTableFromDB(appInsMainCvgObj);
        }
        this.showGenerate = true;
      }
    );
    this.BindCapitalize();
  }

  GenerateMainAndAddCvgTable() {
    var ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    var yearCount = this.InsuranceDataForm.controls.InsLength.value;
    var noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);

    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);

    var month: number = 12;

    for (let i = 0; i < noOfYear; i++) {
      var obj = { Tenor: 0, SumInsuredPrcnt: 0, CustMainPremiRate: 0, InscoMainPremiRate: 0, StdMainPremiRate: 0 };

      if (yearCount - 12 >= 0) {
        month = 12;
      } else {
        month = yearCount;
      }

      obj.Tenor = month;
      obj.SumInsuredPrcnt = this.ruleObj.SumInsuredPercentage[i];
      var index = this.ruleObj.MainCoverageType.findIndex(x => x == this.InsuranceDataForm.controls.InsMainCvgType.value);
      obj.CustMainPremiRate = this.ruleObj.MainRateToCust[index];
      obj.InscoMainPremiRate = this.ruleObj.MainRateToInsco[index];
      obj.StdMainPremiRate = this.ruleObj.BaseRatePercentage[index];
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroup(i, obj, ManufYearDiff));
      ManufYearDiff++;
      yearCount -= 12;
    }
  }

  GenerateMainAndAddCvgTableFromDB(appInsMainCvgObj: Array<AppInsMainCvgObj>) {
    var ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);
    for (let i = 0; i < appInsMainCvgObj.length; i++) {
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroupFromDB(appInsMainCvgObj[i], ManufYearDiff));
      ManufYearDiff++;
    }
  }
  bindInsAddCvgTypeRuleObj() {
    (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray) = this.fb.array([]);
    this.insAddCvgTypeRuleObj = [{ Key: "", Value: "" }];
    this.groupedAddCvgType = Array.from( new Set(this.ruleObj.AdditionalCoverageType));
    this.groupedAddCvgType.forEach((o) => {
      if(o == CommonConstant.MrAddCvgTypeCodeLoading){
        var isLoadingExist = this.insAddCvgTypeRuleObj.find(x => x.Key == CommonConstant.MrAddCvgTypeCodeLoading);
        if(!isLoadingExist){
          var item = this.insAddCvgTypeObj.find(x => x.Key == o);
          this.insAddCvgTypeRuleObj.push(item);
        }
      }
      else{
        var item = this.insAddCvgTypeObj.find(x => x.Key == o);
        this.insAddCvgTypeRuleObj.push(item);
      }
    });
    this.insAddCvgTypeRuleObj.splice(0, 1);
    this.addCheckbox();
  }

  bindInsMainCvgTypeRuleObj() {
    this.insMainCvgTypeRuleObj = [{ Key: "", Value: "" }];
    this.ruleObj.MainCoverageType.forEach((o, i) => {
      if (i == 0) {
        this.defaultInsMainCvgType = o
      }

      var item = this.insMainCvgTypeObj.find(x => x.Key == o);
      this.insMainCvgTypeRuleObj.push(item);
    });
    this.insMainCvgTypeRuleObj.splice(0, 1);
    this.InsuranceDataForm.patchValue({
      InsMainCvgType: this.defaultInsMainCvgType
    });
  }

  addGroup(i, obj, ManufYearDiff) {
    var group = this.fb.group({
      YearNo: i + 1,
      Tenor: obj.Tenor,
      SumInsuredPrcnt: obj.SumInsuredPrcnt,
      SumInsuredAmt: 0,
      MrMainCvgTypeCode: this.defaultInsMainCvgType,
      StdMainPremiRate: obj.StdMainPremiRate,
      CustMainPremiRate: obj.CustMainPremiRate,
      CustMainPremiAmt: 0,
      InscoMainPremiRate: obj.InscoMainPremiRate,
      InscoMainPremiAmt: 0,
      TotalInscoAddPremiAmt: 0,
      TotalCustAddPremiAmt: 0,
      AppInsAddCvgs: new FormArray([])
    });

    this.insAddCvgTypeRuleObj.forEach((o) => {
      var defaultSumInsuredAmt = 0;
      var index = this.ruleObj.AdditionalCoverageType.findIndex(x => x == o.Key);
      var premiumType = this.ruleObj.PremiumType[index];
      var custAddPremiRate = 0;
      var inscoAddPremiRate = 0;

      if (premiumType == CommonConstant.PremiumTypeAmt) {
        custAddPremiRate = this.ruleObj.PremiToCust[index];
        inscoAddPremiRate = this.ruleObj.PremiToInsco[index];
      }

      if (premiumType == CommonConstant.PremiumTypePrcnt) {
        custAddPremiRate = this.ruleObj.RateToCust[index];
        inscoAddPremiRate = this.ruleObj.RateToInsco[index];
      }

      if(o.Key == CommonConstant.MrAddCvgTypeCodeTpl){
        defaultSumInsuredAmt = this.insRateAddCvgRuleTplObjs[0].SumInsuredAmt;
        custAddPremiRate = this.insRateAddCvgRuleTplObjs[0].PremiToCust;
        inscoAddPremiRate = this.insRateAddCvgRuleTplObjs[0].PremiToInsco;
      }

      var checkboxValue = false;
      if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) {
        for (let i = 0; i < this.ruleObj["AdditionalCoverageType"].length; i++) {
          if(this.ruleObj["AdditionalCoverageType"][i] == CommonConstant.MrAddCvgTypeCodeLoading){
            var assetAgeMin = this.ruleObj["AssetAgeFrom"][i] ? parseInt(this.ruleObj["AssetAgeFrom"][i], 10) : 0;
            var assetAgeMax = this.ruleObj["AssetAgeTo"][i] ? parseInt(this.ruleObj["AssetAgeTo"][i], 10) : 0;
            if(ManufYearDiff >= assetAgeMin && ManufYearDiff <= assetAgeMax){
              const control = this.fb.group({
                MrAddCvgTypeCode: o.Key,
                AddCvgTypeName: o.Value,
                Value: checkboxValue,
                SumInsuredPercentage: obj.SumInsuredPercentage,
                SumInsuredAmt: defaultSumInsuredAmt,
                PremiumType: premiumType,
                CustAddPremiRate: custAddPremiRate,
                CustAddPremiAmt: 0,
                BaseCalculation: this.ruleObj.BaseCalc[index],
                InscoAddPremiRate: inscoAddPremiRate,
                InscoAddPremiAmt: 0,
                StdAddPremiRate: this.ruleObj.BaseRate[index]
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
      else{
        const control = this.fb.group({
          MrAddCvgTypeCode: o.Key,
          AddCvgTypeName: o.Value,
          Value: checkboxValue,
          SumInsuredPercentage: obj.SumInsuredPercentage,
          SumInsuredAmt: defaultSumInsuredAmt,
          PremiumType: premiumType,
          CustAddPremiRate: custAddPremiRate,
          CustAddPremiAmt: 0,
          BaseCalculation: this.ruleObj.BaseCalc[index],
          InscoAddPremiRate: inscoAddPremiRate,
          InscoAddPremiAmt: 0,
          StdAddPremiRate: this.ruleObj.BaseRate[index]
        });
        (group.controls.AppInsAddCvgs as FormArray).push(control);
      }
    });
    return group;
  }

  addGroupFromDB(insMainCvg: AppInsMainCvgObj, ManufYearDiff) {
    var group = this.fb.group({
      YearNo: insMainCvg.YearNo,
      Tenor: insMainCvg.Tenor,
      SumInsuredPrcnt: insMainCvg.SumInsuredPrcnt,
      SumInsuredAmt: insMainCvg.SumInsuredAmt,
      MrMainCvgTypeCode: insMainCvg.MrMainCvgTypeCode,
      StdMainPremiRate: insMainCvg.StdMainPremiRate,
      CustMainPremiRate: insMainCvg.CustMainPremiRate,
      CustMainPremiAmt: insMainCvg.CustMainPremiAmt,
      InscoMainPremiRate: insMainCvg.InscoMainPremiRate,
      InscoMainPremiAmt: insMainCvg.InscoMainPremiAmt,
      TotalInscoAddPremiAmt: insMainCvg.TotalInscoAddPremiAmt,
      TotalCustAddPremiAmt: insMainCvg.TotalCustAddPremiAmt,
      AppInsAddCvgs: new FormArray([])
    });

    this.insAddCvgTypeRuleObj.forEach((o) => {
      var check;
      if (insMainCvg.AppInsAddCvgObjs == undefined) {
        check = undefined;
      } else {
        check = insMainCvg.AppInsAddCvgObjs.find(x => x.MrAddCvgTypeCode == o.Key);
      }
      var defaultSumInsuredAmt = 0;
      var index = this.ruleObj.AdditionalCoverageType.findIndex(x => x == o.Key);
      var premiumType = this.ruleObj.PremiumType[index];
      var custAddPremiRate = 0;
      var inscoAddPremiRate = 0;

      if (premiumType == CommonConstant.PremiumTypeAmt) {
        custAddPremiRate = check == undefined ? this.ruleObj.PremiToCust[index] : check.CustAddPremiAmt;
        inscoAddPremiRate = check == undefined ? this.ruleObj.PremiToInsco[index] : check.InscoAddPremiAmt;
      }

      if (premiumType == CommonConstant.PremiumTypePrcnt) {
        custAddPremiRate = check == undefined ? this.ruleObj.RateToCust[index] : check.CustAddPremiRate;
        inscoAddPremiRate = check == undefined ? this.ruleObj.RateToInsco[index] : check.InscoAddPremiRate;
      }

      if(o.Key == CommonConstant.MrAddCvgTypeCodeTpl){
        defaultSumInsuredAmt = this.insRateAddCvgRuleTplObjs[0].SumInsuredAmt;
        custAddPremiRate = check == undefined ? this.insRateAddCvgRuleTplObjs[0].PremiToCust : check.CustAddPremiAmt;
        inscoAddPremiRate = check == undefined ? this.insRateAddCvgRuleTplObjs[0].PremiToInsco : check.InscoAddPremiAmt;
      }

      if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) {
        for (let i = 0; i < this.ruleObj["AdditionalCoverageType"].length; i++) {
          if(this.ruleObj["AdditionalCoverageType"][i] == CommonConstant.MrAddCvgTypeCodeLoading){
            var assetAgeMin = this.ruleObj["AssetAgeFrom"][i] ? parseInt(this.ruleObj["AssetAgeFrom"][i], 10) : 0;
            var assetAgeMax = this.ruleObj["AssetAgeTo"][i] ? parseInt(this.ruleObj["AssetAgeTo"][i], 10) : 0;
            if(ManufYearDiff >= assetAgeMin && ManufYearDiff <= assetAgeMax){
              const control = this.fb.group({
                MrAddCvgTypeCode: o.Key,
                AddCvgTypeName: o.Value,
                Value: check == undefined ? false : true,
                SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
                SumInsuredAmt: check == undefined ? defaultSumInsuredAmt : check.SumInsuredAmt,
                PremiumType: premiumType,
                CustAddPremiRate: custAddPremiRate,
                CustAddPremiAmt: check == undefined ? 0 : check.CustAddPremiAmt,
                BaseCalculation: this.ruleObj.BaseCalc[index],
                InscoAddPremiRate: inscoAddPremiRate,
                InscoAddPremiAmt: check == undefined ? 0 : check.InscoAddPremiAmt,
                StdAddPremiRate: this.ruleObj.BaseRate[index]
              });
              (group.controls.AppInsAddCvgs as FormArray).push(control);
            }
          }
        }
      }
      else{
        const control = this.fb.group({
          MrAddCvgTypeCode: o.Key,
          AddCvgTypeName: o.Value,
          Value: check == undefined ? false : true,
          SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
          SumInsuredAmt: check == undefined ? defaultSumInsuredAmt : check.SumInsuredAmt,
          PremiumType: premiumType,
          CustAddPremiRate: custAddPremiRate,
          CustAddPremiAmt: check == undefined ? 0 : check.CustAddPremiAmt,
          BaseCalculation: this.ruleObj.BaseCalc[index],
          InscoAddPremiRate: inscoAddPremiRate,
          InscoAddPremiAmt: check == undefined ? 0 : check.InscoAddPremiAmt,
          StdAddPremiRate: this.ruleObj.BaseRate[index]
        });
        (group.controls.AppInsAddCvgs as FormArray).push(control);
      }
    });
    return group;
  }

  MainCvgTypeDetailChanged(event, i) {
    this.setRate(event.target.value, i);
    this.isCalculate = false;
  }

  IsAddCvgChanged() {
    this.isCalculate = false;
  }

  setRate(mainCoverageType, i) {
    var index = this.ruleObj.MainCoverageType.findIndex(x => x == mainCoverageType);
    this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
      CustMainPremiRate: this.ruleObj.MainRateToCust[index],
      StdMainPremiRate: this.ruleObj.BaseRatePercentage[index],
      InscoMainPremiRate: this.ruleObj.MainRateToInsco[index]
    });
    for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
      var currAddCvgType = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
      var indexAdd = this.ruleObj.AdditionalCoverageType.findIndex(x => x == currAddCvgType);

      var premiumType = this.ruleObj.PremiumType[indexAdd];
      var custAddPremiRate = 0;
      var inscoAddPremiRate = 0;

      if (premiumType == CommonConstant.PremiumTypeAmt) {
        custAddPremiRate = this.ruleObj.PremiToCust[indexAdd];
        inscoAddPremiRate = this.ruleObj.PremiToInsco[indexAdd];
      }

      if (premiumType == CommonConstant.PremiumTypePrcnt) {
        custAddPremiRate = this.ruleObj.RateToCust[indexAdd];
        inscoAddPremiRate = this.ruleObj.RateToInsco[indexAdd];
      }

      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
        CustAddPremiRate: custAddPremiRate,
        InscoAddPremiRate: inscoAddPremiRate,
        StdAddPremiRate: this.ruleObj.BaseRate[indexAdd]
      });
    }
  }

  SumInsuredAmtAddCvgChanged(event, i, j){
    this.setTplPremiAmt(event.target.value, i, j);
    this.isCalculate = false;
  }

  setTplPremiAmt(sumInsuredAmt, i, j){
    var addCvgTplObj = this.insRateAddCvgRuleTplObjs.find(x => x.SumInsuredAmt == sumInsuredAmt);

    this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
      CustAddPremiRate: addCvgTplObj.PremiToCust,
      InscoAddPremiRate: addCvgTplObj.PremiToInsco,
      StdAddPremiRate: addCvgTplObj.BaseRate
    });
  }

  ApplyToCoverage() {
    var ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
        MrMainCvgTypeCode: this.InsuranceDataForm.controls.InsMainCvgType.value
      });
      this.setRate(this.InsuranceDataForm.controls.InsMainCvgType.value, i);
      const formAddCvgChecked = this.InsuranceDataForm.controls.InsAddCvgTypes["controls"].filter(x => x.value.Value == true);

      for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
        var check = formAddCvgChecked.find(x => x.value.Key == this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].AddCvgTypeName.value);

        if (check != undefined) {
          if (check.value.Key == CommonConstant.AddCvgTypeNameLoading) {
            if (ManufYearDiff <= 5) {
              this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
                Value: false
              });
            }
            else {
              this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
                Value: true
              });
            }
          }
          else {
            this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
              Value: check.value.Value
            });
          };
        } else {
          this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
            Value: false
          });
        }
      }
      ManufYearDiff++;
    }
  }

  CvgAmtChanged() {
    this.isGenerate = false;
  }

  CustAdminFeeAmtChanged() {
    this.isCalculate = false;
  }

  CoverPeriodChanged(event) {
    this.setInsLengthDefaultValue(event.target.value);
    this.isGenerate = false;
  }

  AssetRegionChanged() {
    this.isGenerate = false;
  }

  InsLengthChanged() {
    this.isGenerate = false;
  }

  InsAssetPaidByChanged(event) {
    this.setPaidByInput(event.target.value);
    this.isGenerate = false;
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

    this.setInsLengthValidator(coverPeriod);
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

  InscoBranchCodeChanged(event) {
    if (event.target.value != "") {
      this.InsuranceDataForm.patchValue({
        InscoBranchName: this.inscoBranchObj.find(x => x.Key == event.target.value).Value
      });
    } else {
      this.InsuranceDataForm.patchValue({
        InscoBranchName: ""
      });
    }
    this.isGenerate = false;
  }

  InsuredByChanged(event) {
    this.setInsLength();
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
      this.InsuranceDataForm.controls.PayPeriodToInsco.clearValidators();
      this.InsuranceDataForm.controls.PayPeriodToInsco.updateValueAndValidity();
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
      this.InsuranceDataForm.controls.PayPeriodToInsco.clearValidators();
      this.InsuranceDataForm.controls.PayPeriodToInsco.updateValueAndValidity();
    }

    if (insuredBy == CommonConstant.InsuredByCompany) {
      this.InsuranceDataForm.controls.InsAssetPaidBy.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetPaidBy.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.setInsLengthValidator(this.InsuranceDataForm.controls.InsAssetCoverPeriod.value);
      this.InsuranceDataForm.controls.Notes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
      this.InsuranceDataForm.controls.CvgAmt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.PayPeriodToInsco.setValidators(Validators.required);
      this.InsuranceDataForm.controls.PayPeriodToInsco.updateValueAndValidity();
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
      this.setInsLengthValidator(this.InsuranceDataForm.controls.InsAssetCoverPeriod.value);
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
      this.InsuranceDataForm.controls.PayPeriodToInsco.setValidators(Validators.required);
      this.InsuranceDataForm.controls.PayPeriodToInsco.updateValueAndValidity();
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

  async getInsuranceData() {
    var reqObj = { AppId: this.appId }
    await this.http.post(URLConstant.GetInsuranceDataByAppId, reqObj).toPromise().then(
      (response) => {
        this.appObj = response["AppObj"];
        this.appAssetObj = response["AppAssetObj"];
        this.appAssetAccessoryObjs = response["AppAssetAccessoryObjs"];
        this.appFinDataObj = response["AppFinDataObj"];
        this.appInsuranceObj = response["AppInsuranceObj"];
        this.appInsObjObj = response["AppInsObjObj"];
        this.appInsMainCvgObj = response["AppInsMainCvgObjs"];
        this.appCollateralObj = response["AppCollateralObj"];
        this.appCollateralAccessoryObjs = response["AppCollateralAccessoryObjs"];
        this.defaultInsAssetRegion = response["DefaultInsAssetRegion"];

        if(this.appCollateralAccessoryObjs.length > 0){
          var totalAccessoryPriceAmt = 0;

          for (let i = 0; i < this.appCollateralAccessoryObjs.length; i++) {
            totalAccessoryPriceAmt += this.appCollateralAccessoryObjs[i].AccessoryPriceAmt;
          }
  
          this.totalAssetPriceAmt = this.appCollateralObj.CollateralValueAmt + totalAccessoryPriceAmt;
        }else{
          this.totalAssetPriceAmt = this.appCollateralObj.CollateralValueAmt
        }

        if (this.appFinDataObj != undefined) {
          this.InsuranceDataForm.patchValue({
            CvgAmt: this.appCollateralObj.CollateralValueAmt,
            CustCvgAmt: this.appCollateralObj.CollateralValueAmt
          });
        }
        if (this.appAssetObj != undefined) {
          this.appAssetId = this.appAssetObj.AppAssetId;
        }
        if (this.appCollateralObj != undefined) {
          this.appCollateralId = this.appCollateralObj.AppCollateralId;
        }
      });
  }

  async bindAppInsAndAppInsObj(insuredBy) {
    if (this.appInsuranceObj != null && this.appInsObjObj != null) {
      if (insuredBy == CommonConstant.InsuredByOffSystem) {
        this.InsuranceDataForm.patchValue({
          InsAssetCoveredBy: insuredBy
        });
      }

      if (insuredBy == CommonConstant.InsuredByCustomer) {
        this.InsuranceDataForm.patchValue({
          InsAssetCoveredBy: insuredBy,
          CustInscoBranchName: this.appInsObjObj.CustInscoBranchName,
          InsPolicyNo: this.appInsObjObj.InsPolicyNo,
          InsPolicyName: this.appInsObjObj.InsPolicyName,
          CustCoverStartDt: formatDate(this.appInsObjObj.CustCoverStartDt, 'yyyy-MM-dd', 'en-US'),
          EndDt: formatDate(this.appInsObjObj.EndDt, 'yyyy-MM-dd', 'en-US'),
          CustNotes: this.appInsObjObj.CustNotes,
          CustCvgAmt: this.appInsObjObj.CustCvgAmt
        });
      }

      if (insuredBy == CommonConstant.InsuredByCompany) {
        this.InsuranceDataForm.patchValue({
          InsAssetCoveredBy: insuredBy,
          InscoBranchCode: this.appInsObjObj.InscoBranchCode,
          InscoBranchName: this.appInsObjObj.InscoBranchName,
          InsAssetPaidBy: this.appInsObjObj.InsAssetPaidBy,
          InsAssetCoverPeriod: this.appInsObjObj.InsAssetCoverPeriod,
          InsAssetRegion: this.appInsObjObj.InsAssetRegion,
          InsLength: this.appInsObjObj.InsLength,
          Notes: this.appInsObjObj.Notes,
          TotalCustMainPremiAmt: this.appInsObjObj.TotalCustMainPremiAmt,
          TotalCustAddPremiAmt: this.appInsObjObj.TotalCustAddPremiAmt,
          TotalInscoMainPremiAmt: this.appInsObjObj.TotalInscoMainPremiAmt,
          TotalInscoAddPremiAmt: this.appInsObjObj.TotalInscoAddPremiAmt,
          InsCpltzAmt: this.appInsObjObj.InsCpltzAmt,
          InscoAdminFeeAmt: this.appInsObjObj.InscoAdminFeeAmt,
          CustAdminFeeAmt: this.appInsObjObj.CustAdminFeeAmt,
          CustStampDutyFeeAmt: this.appInsObjObj.CustStampDutyFee,
          CvgAmt: this.appInsObjObj.CvgAmt,
          TotalCustFeeAmt: this.appInsObjObj.CustAdminFeeAmt + this.appInsObjObj.CustStampDutyFee,
          TotalInscoFeeAmt: this.appInsObjObj.InscoAdminFeeAmt + this.appInsObjObj.InscoStampDutyFee,
          TotalCustDiscAmt: this.appInsObjObj.TotalCustDiscAmt,
          PayPeriodToInsco: this.appInsObjObj.PayPeriodToInsco
        });
        this.setPaidByInput(this.appInsObjObj.InsAssetPaidBy);
        this.setInsLengthValidator(this.appInsObjObj.InsAssetCoverPeriod);
        await this.GenerateInsurance(this.appInsMainCvgObj);
      }

      if (insuredBy == CommonConstant.InsuredByCustomerCompany) {
        this.InsuranceDataForm.patchValue({
          InsAssetCoveredBy: insuredBy,
          InscoBranchCode: this.appInsObjObj.InscoBranchCode,
          InscoBranchName: this.appInsObjObj.InscoBranchName,
          InsAssetPaidBy: this.appInsObjObj.InsAssetPaidBy,
          InsAssetCoverPeriod: this.appInsObjObj.InsAssetCoverPeriod,
          InsAssetRegion: this.appInsObjObj.InsAssetRegion,
          InsLength: this.appInsObjObj.InsLength,
          Notes: this.appInsObjObj.Notes,
          TotalCustMainPremiAmt: this.appInsObjObj.TotalCustMainPremiAmt,
          TotalCustAddPremiAmt: this.appInsObjObj.TotalCustAddPremiAmt,
          TotalInscoMainPremiAmt: this.appInsObjObj.TotalInscoMainPremiAmt,
          TotalInscoAddPremiAmt: this.appInsObjObj.TotalInscoAddPremiAmt,
          InsCpltzAmt: this.appInsObjObj.InsCpltzAmt,
          InscoAdminFeeAmt: this.appInsObjObj.InscoAdminFeeAmt,
          CustAdminFeeAmt: this.appInsObjObj.CustAdminFeeAmt,
          CustStampDutyFeeAmt: this.appInsObjObj.CustStampDutyFee,
          CustInscoBranchName: this.appInsObjObj.CustInscoBranchName,
          InsPolicyNo: this.appInsObjObj.InsPolicyNo,
          InsPolicyName: this.appInsObjObj.InsPolicyName,
          CustCoverStartDt: formatDate(this.appInsObjObj.CustCoverStartDt, 'yyyy-MM-dd', 'en-US'),
          EndDt: formatDate(this.appInsObjObj.StartDt, 'yyyy-MM-dd', 'en-US'),
          CustNotes: this.appInsObjObj.CustNotes,
          CustCvgAmt: this.appInsObjObj.CustCvgAmt,
          CvgAmt: this.appInsObjObj.CvgAmt,
          TotalCustFeeAmt: this.appInsObjObj.CustAdminFeeAmt + this.appInsObjObj.CustStampDutyFee,
          TotalInscoFeeAmt: this.appInsObjObj.InscoAdminFeeAmt + this.appInsObjObj.InscoStampDutyFee,
          TotalCustDiscAmt: this.appInsObjObj.TotalCustDiscAmt,
          PayPeriodToInsco: this.appInsObjObj.PayPeriodToInsco
        });
        this.setPaidByInput(this.appInsObjObj.InsAssetPaidBy);
        this.setInsLengthValidator(this.appInsObjObj.InsAssetCoverPeriod);
        await this.GenerateInsurance(this.appInsMainCvgObj);
      }
       
      this.setValidator(insuredBy); 

      if (this.InsuranceDataForm["controls"]["InsCpltzAmt"].value == this.InsuranceDataForm["controls"]["TotalCustMainPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustAddPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustFeeAmt"].value - this.InsuranceDataForm["controls"]["TotalCustDiscAmt"].value) {
        this.InsuranceDataForm["controls"]["InsCpltzAmt"].disable();
        this.InsuranceDataForm.patchValue({
          IsFullCapitalizedAmount: true
        });
      }
    }
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

  addCheckbox() {
    this.insAddCvgTypeRuleObj.forEach((o) => {

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

  async bindInsAssetCoverPeriodObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsCoverPeriod };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAssetCoverPeriodObj = response[CommonConstant.ReturnObj];
        if (this.insAssetCoverPeriodObj.length > 0) {
          let idxTemp = this.insAssetCoverPeriodObj.findIndex(x => x.Key == CommonConstant.CoverPeriodFullTenor);
          this.InsuranceDataForm.patchValue({
            InsAssetCoverPeriod: this.insAssetCoverPeriodObj[idxTemp].Key
          });

          this.setInsLengthDefaultValue(this.insAssetCoverPeriodObj[idxTemp].Key);
        }
      }
    );
  }

  async bindInsAssetRegionObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetInsRegion };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAssetRegionObj = response[CommonConstant.ReturnObj];
        // if(this.insAssetRegionObj.length > 0){
        //   this.InsuranceDataForm.patchValue({
        //     InsAssetRegion: this.insAssetRegionObj[0].Key
        //   });
        // }
      }
    );
  }

  async bindInscoBranchObj() {
    var inscoBranchObj = { MrVendorCategory: CommonConstant.VendorCategoryAssetInscoBranch, OfficeCode: this.appObj.OriOfficeCode };
    await this.http.post(URLConstant.GetListKeyValueByCategoryCodeAndOfficeCode, inscoBranchObj).toPromise().then(
      (response) => {
        this.inscoBranchObj = response[CommonConstant.ReturnObj];
        if(this.inscoBranchObj.length > 0 && this.inscoBranchObj.length == 1){
          this.InsuranceDataForm.patchValue({
            InscoBranchCode: this.inscoBranchObj[0].Key,
            InscoBranchName: this.inscoBranchObj[0].Value
          });
        }
      }
    );
  }

  async bindPayPeriodToInscoObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodePayPeriodToInsco };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.payPeriodToInscoObj = response[CommonConstant.ReturnObj];
        if(this.payPeriodToInscoObj.length > 0){
          this.InsuranceDataForm.patchValue({
            PayPeriodToInsco: this.payPeriodToInscoObj[0].Key
          });
        }
      }
    );
  }

  test(){
  }

  back() {
    this.outputTab.emit();
  }

  IsFullCapitalizedAmount(){
    if(this.InsuranceDataForm["controls"]["IsFullCapitalizedAmount"].value == true ){
      this.InsuranceDataForm.patchValue({
        InsCpltzAmt: this.InsuranceDataForm["controls"]["TotalCustMainPremiAmt"].value  + this.InsuranceDataForm["controls"]["TotalCustAddPremiAmt"].value  + this.InsuranceDataForm["controls"]["TotalCustFeeAmt"].value  - this.InsuranceDataForm["controls"]["TotalCustDiscAmt"].value 
      }); 
      this.InsuranceDataForm["controls"]["InsCpltzAmt"].disable();
    }else{
      this.InsuranceDataForm["controls"]["InsCpltzAmt"].enable();
    }
  }
  BindCapitalize(){
    if(this.InsuranceDataForm["controls"]["IsFullCapitalizedAmount"].value == true ){
      this.InsuranceDataForm.patchValue({
        InsCpltzAmt: this.InsuranceDataForm["controls"]["TotalCustMainPremiAmt"].value  + this.InsuranceDataForm["controls"]["TotalCustAddPremiAmt"].value  + this.InsuranceDataForm["controls"]["TotalCustFeeAmt"].value  - this.InsuranceDataForm["controls"]["TotalCustDiscAmt"].value 
      });  
    }
  }

  
}