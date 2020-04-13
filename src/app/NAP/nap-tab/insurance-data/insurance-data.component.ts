import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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

@Component({
  selector: 'app-insurance-data',
  templateUrl: './insurance-data.component.html',
  styleUrls: ['./insurance-data.component.scss']
})

export class InsuranceDataComponent implements OnInit {

  @Input() AppId: number;
  @Output() callbackSubmit: EventEmitter<any> = new EventEmitter();


  appAssetId: number;
  totalAssetPriceAmt: number;

  appObj: NapAppModel;
  appAssetObj: AppAssetObj;
  appAssetAccessoryObjs: Array<AppAssetAccessoryObj>;
  appFinDataObj: any;
  appInsuranceObj: AppInsuranceObj;
  appInsObjObj: AppInsObjObj;
  appInsMainCvgObj: Array<AppInsMainCvgObj>;
  ruleObj: ResultInsRateRuleObj;
  calcInsObj: ResultCalcInsObj;
  saveObj: InsuranceDataObj;

  minInsLength: number = 1;
  maxInsLength: number = 9999;

  insuredByObj: any;
  inscoBranchObj: any;
  paidByObj: any;
  insMainCvgTypeObj: any;
  insMainCvgTypeRuleObj = [{
    Key: "",
    Value: ""
  }];
  insAddCvgTypeObj: any;
  insAddCvgTypeRuleObj: [{
    Key: "",
    Value: ""
  }];
  insAssetCoverPeriodObj: any;
  insAssetRegionObj: any;
  defaultInsMainCvgType: string;

  showGenerate: boolean = false;
  isGenerate: boolean = false;
  isCalculate: boolean = false;

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
    InsLength: ['', [Validators.required, Validators.min(0),Validators.max(99)]],
    InsAssetRegion: ['', [Validators.required, Validators.maxLength(50)]],
    AppInsMainCvgs: new FormArray([]),
    TotalCustMainPremiAmt: [0],
    TotalCustAddPremiAmt: [0],
    TotalInscoMainPremiAmt: [0],
    TotalInscoAddPremiAmt: [0],
    InscoAdminFeeAmt: [0],
    CustAdminFeeAmt: [0],
    CvgAmt: [0, Validators.required],
    CustCvgAmt: [0, Validators.required],
    TotalCustDiscAmt: [0],
    InsCpltzAmt: [0]
  });

  constructor(private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute){
      this.route.queryParams.subscribe(params => {
        this.AppId = params["AppId"] ? params["AppId"] : this.AppId;
      })
  }
  async ngOnInit() : Promise<void>{
    await this.getInsuranceData();
    await this.bindInsuredByObj();
    await this.bindPaidByObj();
    await this.bindInsMainCvgTypeObj();
    await this.bindInsAddCvgTypeObj();
    await this.bindInsAssetCoverPeriodObj();
    await this.bindInsAssetRegionObj();
    await this.bindInscoBranchObj();
    if(this.appInsuranceObj != null){
      await this.bindAppInsAndAppInsObj(this.appInsObjObj.InsAssetCoveredBy);
    }    
  }

  SaveForm(){
    var insuredBy = this.InsuranceDataForm.controls.InsAssetCoveredBy.value;

    if(insuredBy == AdInsConstant.InsuredByCompany || insuredBy == AdInsConstant.InsuredByCustomerCompany){
      if(this.isGenerate == false){
        this.toastr.errorMessage("Please click Generate Insurance");
        return;
      }
      if(this.isCalculate == false){
        this.toastr.errorMessage("Please click Calculate Insurance");
        return;
      }
    }
    this.setSaveObj(insuredBy);
    this.http.post(AdInsConstant.AddEditInsuranceData, this.saveObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.callbackSubmit.emit();
      },
      (error) => {
        console.log(error);
      }
    );

  }

  setSaveObj(insuredBy){
    this.saveObj = new InsuranceDataObj();
    this.saveObj.AppId = this.AppId;
    this.saveObj.AppInsuranceObj.AppId = this.AppId;
    this.saveObj.AppInsObjObj.AppId = this.AppId;
    this.saveObj.AppInsObjObj.AppAssetId = this.appAssetId;
    this.saveObj.AppInsObjObj.InsAssetCoveredBy = insuredBy;
    this.saveObj.AppInsObjObj.InsSeqNo = 1;

    if(insuredBy == AdInsConstant.InsuredByOffSystem){   
      this.saveObj.AppInsObjObj.InsAssetPaidBy = AdInsConstant.InsPaidByCustomer;
    }

    if(insuredBy == AdInsConstant.InsuredByCustomer){
      this.saveObj.AppInsObjObj.InsAssetPaidBy = AdInsConstant.InsPaidByCustomer;
      this.saveObj.AppInsObjObj.CustInscoBranchName = this.InsuranceDataForm.controls.CustInscoBranchName.value;
      this.saveObj.AppInsObjObj.InsPolicyNo = this.InsuranceDataForm.controls.InsPolicyNo.value;
      this.saveObj.AppInsObjObj.InsPolicyName = this.InsuranceDataForm.controls.InsPolicyName.value;
      this.saveObj.AppInsObjObj.CustCvgAmt = this.InsuranceDataForm.controls.CustCvgAmt.value;
      this.saveObj.AppInsObjObj.CustCoverStartDt = this.InsuranceDataForm.controls.CustCoverStartDt.value;
      this.saveObj.AppInsObjObj.EndDt = this.InsuranceDataForm.controls.EndDt.value;
      this.saveObj.AppInsObjObj.CustNotes = this.InsuranceDataForm.controls.CustNotes.value;
    }

    if(insuredBy == AdInsConstant.InsuredByCompany){
      this.saveObj.AppInsObjObj.InsAssetPaidBy = this.InsuranceDataForm.controls.InsAssetPaidBy.value;
      this.saveObj.AppInsObjObj.InscoBranchCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
      this.saveObj.AppInsObjObj.InscoBranchName = this.InsuranceDataForm.controls.InscoBranchName.value;
      this.saveObj.AppInsObjObj.InsAssetCoverPeriod = this.InsuranceDataForm.controls.InsAssetCoverPeriod.value;
      this.saveObj.AppInsObjObj.InsLength = this.InsuranceDataForm.controls.InsLength.value;
      this.saveObj.AppInsObjObj.CvgAmt = this.InsuranceDataForm.controls.CvgAmt.value;
      this.saveObj.AppInsObjObj.Notes = this.InsuranceDataForm.controls.Notes.value;
      this.saveObj.AppInsObjObj.InsAssetRegion = this.InsuranceDataForm.controls.InsAssetRegion.value;
      this.saveObj.AppInsObjObj.InsCpltzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      this.saveObj.AppInsObjObj.CustAdminFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;;
      this.saveObj.AppInsObjObj.InscoAdminFeeAmt = this.InsuranceDataForm.controls.InscoAdminFeeAmt.value;
      this.saveObj.AppInsObjObj.TotalCustMainPremiAmt = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustAddPremiAmt = this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsObjObj.TotalInsCustAmt = this.saveObj.AppInsObjObj.TotalCustMainPremiAmt + this.saveObj.AppInsObjObj.TotalCustAddPremiAmt + this.saveObj.AppInsObjObj.CustAdminFeeAmt - this.saveObj.AppInsObjObj.TotalCustDiscAmt;
      this.saveObj.AppInsObjObj.TotalInsInscoAmt = this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt + this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt + this.saveObj.AppInsObjObj.InscoAdminFeeAmt - this.saveObj.AppInsObjObj.TotalInscoDiscAmt;     
      this.saveObj.AppInsObjObj.StartDt = new Date(localStorage.getItem("BusinessDateRaw"));
      this.saveObj.AppInsObjObj.EndDt = new Date(localStorage.getItem("BusinessDateRaw"));   
      this.saveObj.AppInsObjObj.EndDt.setMonth(this.saveObj.AppInsObjObj.EndDt.getMonth() + this.saveObj.AppInsObjObj.InsLength);

      var addedTenor = 0;

      for(let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++){
        var insCoverage = new AppInsMainCvgObj();
        insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
        insCoverage.Tenor = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
        insCoverage.MrMainCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;

        insCoverage.StartDt = new Date(localStorage.getItem("BusinessDateRaw"));
        insCoverage.StartDt.setMonth(insCoverage.StartDt.getMonth() + addedTenor);
        insCoverage.EndDt = new Date(localStorage.getItem("BusinessDateRaw"));
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

        for(let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++){
          if(this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true){
            var addCoverage = new AppInsAddCvgObj();
  
            addCoverage.MrAddCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
            addCoverage.SumInsuredPrcnt = insCoverage.SumInsuredPrcnt;
            addCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SumInsuredAmt.value;
            if(this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value == AdInsConstant.PremiumTypeAmt){
              addCoverage.StdAddPremiRate = 0;
              addCoverage.InscoAddPremiRate = 0;
              addCoverage.CustAddPremiRate = 0;
            }else{
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
      this.saveObj.AppInsuranceObj.TotalCustFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustPremiAmt = this.saveObj.AppInsuranceObj.TotalCustMainPremiAmt + this.saveObj.AppInsuranceObj.TotalCustAddPremiAmt + this.saveObj.AppInsuranceObj.TotalCustFeeAmt - this.saveObj.AppInsuranceObj.TotalCustDiscAmt;
      this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoFeeAmt = this.InsuranceDataForm.controls.InscoAdminFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoDiscAmt = 0;
      this.saveObj.AppInsuranceObj.TotalInscoPremiAmt = this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoFeeAmt - this.saveObj.AppInsuranceObj.TotalInscoDiscAmt;
      this.saveObj.AppInsuranceObj.TotalInsCptlzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      this.saveObj.AppInsuranceObj.TotalPremiPaidByCustAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInsCptlzAmt;
      this.saveObj.AppInsuranceObj.TotalInsIncomeAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInscoPremiAmt;
    }

    if(insuredBy == AdInsConstant.InsuredByCustomerCompany){
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
      this.saveObj.AppInsObjObj.TotalCustMainPremiAmt = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustAddPremiAmt = this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsObjObj.TotalInsCustAmt = this.saveObj.AppInsObjObj.TotalCustMainPremiAmt + this.saveObj.AppInsObjObj.TotalCustAddPremiAmt + this.saveObj.AppInsObjObj.CustAdminFeeAmt - this.saveObj.AppInsObjObj.TotalCustDiscAmt;
      this.saveObj.AppInsObjObj.TotalInsInscoAmt = this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt + this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt + this.saveObj.AppInsObjObj.InscoAdminFeeAmt - this.saveObj.AppInsObjObj.TotalInscoDiscAmt;     
      this.saveObj.AppInsObjObj.StartDt = new Date(localStorage.getItem("BusinessDateRaw"));
      this.saveObj.AppInsObjObj.EndDt = new Date(localStorage.getItem("BusinessDateRaw"));   
      this.saveObj.AppInsObjObj.EndDt.setMonth(this.saveObj.AppInsObjObj.EndDt.getMonth() + this.saveObj.AppInsObjObj.InsLength);
      this.saveObj.AppInsObjObj.CustInscoBranchName = this.InsuranceDataForm.controls.CustInscoBranchName.value;
      this.saveObj.AppInsObjObj.InsPolicyNo = this.InsuranceDataForm.controls.InsPolicyNo.value;
      this.saveObj.AppInsObjObj.InsPolicyName = this.InsuranceDataForm.controls.InsPolicyName.value;
      this.saveObj.AppInsObjObj.CustCvgAmt = this.InsuranceDataForm.controls.CustCvgAmt.value;
      this.saveObj.AppInsObjObj.CustCoverStartDt = this.InsuranceDataForm.controls.CustCoverStartDt.value;
      this.saveObj.AppInsObjObj.StartDt = new Date(this.InsuranceDataForm.controls.EndDt.value);
      this.saveObj.AppInsObjObj.EndDt = new Date(this.InsuranceDataForm.controls.EndDt.value);
      this.saveObj.AppInsObjObj.EndDt.setMonth(this.saveObj.AppInsObjObj.EndDt.getMonth() + this.saveObj.AppInsObjObj.InsLength);
      this.saveObj.AppInsObjObj.CustNotes = this.InsuranceDataForm.controls.CustNotes.value;
      var addedTenor = 0;

      for(let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++){
        var insCoverage = new AppInsMainCvgObj();
        insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
        insCoverage.Tenor = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
        insCoverage.MrMainCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;

        insCoverage.StartDt = new Date(this.saveObj.AppInsObjObj.EndDt);
        insCoverage.StartDt.setMonth(insCoverage.StartDt.getMonth() + addedTenor);
        insCoverage.EndDt = new Date(this.saveObj.AppInsObjObj.EndDt);
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

        for(let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++){
          if(this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true){
            var addCoverage = new AppInsAddCvgObj();
  
            addCoverage.MrAddCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
            addCoverage.SumInsuredPrcnt = insCoverage.SumInsuredPrcnt;
            addCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SumInsuredAmt.value;
            if(this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value == AdInsConstant.PremiumTypeAmt){
              addCoverage.StdAddPremiRate = 0;
              addCoverage.InscoAddPremiRate = 0;
              addCoverage.CustAddPremiRate = 0;
            }else{
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
      this.saveObj.AppInsuranceObj.TotalCustFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustPremiAmt = this.saveObj.AppInsuranceObj.TotalCustMainPremiAmt + this.saveObj.AppInsuranceObj.TotalCustAddPremiAmt + this.saveObj.AppInsuranceObj.TotalCustFeeAmt - this.saveObj.AppInsuranceObj.TotalCustDiscAmt;
      this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoFeeAmt = this.InsuranceDataForm.controls.InscoAdminFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoDiscAmt = 0;
      this.saveObj.AppInsuranceObj.TotalInscoPremiAmt = this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoFeeAmt - this.saveObj.AppInsuranceObj.TotalInscoDiscAmt;
      this.saveObj.AppInsuranceObj.TotalInsCptlzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      this.saveObj.AppInsuranceObj.TotalPremiPaidByCustAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInsCptlzAmt;
      this.saveObj.AppInsuranceObj.TotalInsIncomeAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInscoPremiAmt;
    }

    if(this.appInsuranceObj != undefined){
      this.saveObj.AppInsuranceObj.RowVersion = this.appInsuranceObj.RowVersion;
    }

    if(this.appInsObjObj != undefined){
      this.saveObj.AppInsObjObj.RowVersion = this.appInsObjObj.RowVersion;
    }
  }

  async CalculateInsurance(){
    var reqObj = new RequestCalcInsObj();
    for(let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++){
      var insCoverage = new CalcInsMainCvgObj();

      insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
      insCoverage.Month = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
      insCoverage.CoverageAmt = this.InsuranceDataForm.controls.CvgAmt.value;;
      insCoverage.SumInsured = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredPrcnt.value;
      insCoverage.Rate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiRate.value;
      insCoverage.MainCoverageTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;
      insCoverage.RateToInsco = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiRate.value;

      for(let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++){
        if(this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true){
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

    await this.http.post(AdInsConstant.CalculateInsurance, reqObj).toPromise().then(
      (response) => {
        console.log(response);
        this.calcInsObj = response["Result"];

        this.InsuranceDataForm.patchValue({
          CustAdminFeeAmt: this.calcInsObj.TotalFeeAmt,
          TotalCustMainPremiAmt: this.calcInsObj.TotalMainPremiAmt,
          TotalCustAddPremiAmt: this.calcInsObj.TotalAdditionalPremiAmt,
          TotalInscoMainPremiAmt: this.calcInsObj.TotalMainPremiToInscoAmt,
          TotalInscoAddPremiAmt: this.calcInsObj.TotalAdditionalPremiToInscoAmt,
        });

        for(let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++){
          this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
            SumInsuredAmt: this.calcInsObj.InsCoverage[i].SumInsuredAmt,
            CustMainPremiAmt: this.calcInsObj.InsCoverage[i].MainPremiAmt,
            InscoMainPremiAmt: this.calcInsObj.InsCoverage[i].MainPremiToInscoAmt,
            TotalInscoAddPremiAmt: this.calcInsObj.InsCoverage[i].AdditionalPremiToInscoAmt,
            TotalCustAddPremiAmt: this.calcInsObj.InsCoverage[i].AdditionalPremiAmt,
          });
    
          for(let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++){
            if(this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true){
              var currAddCvgType = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
              var currAddCvg = this.calcInsObj.InsCoverage[i].AddInsCoverage.find(x => x.AddCoverageTypeCode == currAddCvgType);
              this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
                SumInsuredAmt: currAddCvg.SumInsuredAmt,
                CustAddPremiAmt: currAddCvg.AddPremiAmt,
                InscoAddPremiAmt: currAddCvg.AddPremiToInscoAmt
              });
            }else{
              this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
                SumInsuredAmt: 0,
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

  }

  async GenerateInsurance(appInsMainCvgObj: Array<AppInsMainCvgObj>){
    var reqObj = new InsuranceDataInsRateRuleObj();
    reqObj.InscoCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    reqObj.AssetCategory = this.appAssetObj.AssetCategoryCode;
    reqObj.AssetCondition = this.appAssetObj.MrAssetConditionCode;
    reqObj.AssetPriceAmount = this.totalAssetPriceAmt;
    reqObj.RegionCode = this.InsuranceDataForm.controls.InsAssetRegion.value;
    reqObj.ProdOfferingCode = this.appObj.ProdOfferingCode;
    reqObj.ProdOfferingVersion = this.appObj.ProdOfferingVersion;

    await this.http.post(AdInsConstant.ExecuteInsRateRule, reqObj).toPromise().then(
      (response) => {
        this.ruleObj = response["Result"];
        this.InsuranceDataForm.patchValue({
          CustAdminFeeAmt: this.ruleObj.AdminFeeToCust,
          InscoAdminFeeAmt: this.ruleObj.AdminFeeFromInsco
        });
        this.bindInsMainCvgTypeRuleObj();
        this.bindInsAddCvgTypeRuleObj();
        if(appInsMainCvgObj == undefined){
          this.GenerateMainAndAddCvgTable();
          this.isGenerate = true;
        }else{
          this.GenerateMainAndAddCvgTableFromDB(appInsMainCvgObj);
        }
        this.showGenerate = true;
      }
    );

  }

  GenerateMainAndAddCvgTable(){
    var yearCount = this.InsuranceDataForm.controls.InsLength.value;
    var noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);

    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);

    var month: number = 12;

    for(let i = 0; i < noOfYear; i++){
      var obj = {Tenor: 0, SumInsuredPrcnt: 0, CustMainPremiRate: 0, InscoMainPremiRate: 0, StdMainPremiRate: 0};

      if(yearCount - 12 >= 0){
        month = 12;
      }else{
        month = yearCount;
      }

      obj.Tenor = month;
      obj.SumInsuredPrcnt = this.ruleObj.SumInsuredPercentage[i];
      var index = this.ruleObj.MainCoverageType.findIndex(x => x == this.InsuranceDataForm.controls.InsMainCvgType.value);
      obj.CustMainPremiRate = this.ruleObj.MainRateToCust[index];
      obj.InscoMainPremiRate = this.ruleObj.MainRateToInsco[index];
      obj.StdMainPremiRate = this.ruleObj.BaseRatePercentage[index];
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroup(i, obj));
      yearCount -= 12;
    }   
  }

  GenerateMainAndAddCvgTableFromDB(appInsMainCvgObj: Array<AppInsMainCvgObj>){
    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);
    for(let i = 0; i < appInsMainCvgObj.length; i++){
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroupFromDB(appInsMainCvgObj[i]));
    }   
  }

  bindInsAddCvgTypeRuleObj(){
    (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray) = this.fb.array([]);
    this.insAddCvgTypeRuleObj = [{Key: "", Value: ""}];
    this.ruleObj.AdditionalCoverageType.forEach((o, i) => {
      var item = this.insAddCvgTypeObj.find(x => x.Key == o);
      this.insAddCvgTypeRuleObj.push(item);
    });
    this.insAddCvgTypeRuleObj.splice(0, 1);
    this.addCheckbox();
  }

  bindInsMainCvgTypeRuleObj(){
    this.insMainCvgTypeRuleObj = [{Key: "", Value: ""}];
    this.ruleObj.MainCoverageType.forEach((o, i) => {
      if(i == 0){
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

  addGroup(i, obj){
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

    this.insAddCvgTypeRuleObj.forEach((o, i) => {
      var index = this.ruleObj.AdditionalCoverageType.findIndex(x => x == o.Key);
      var premiumType = this.ruleObj.PremiumType[index];
      var custAddPremiRate = 0;
      var inscoAddPremiRate = 0;

      if(premiumType == AdInsConstant.PremiumTypeAmt){
        custAddPremiRate = this.ruleObj.PremiToCust[index];
        inscoAddPremiRate = this.ruleObj.PremiToInsco[index];
      }

      if(premiumType == AdInsConstant.PremiumTypePrcnt){
        custAddPremiRate = this.ruleObj.RateToCust[index];
        inscoAddPremiRate = this.ruleObj.RateToInsco[index];
      }

      const control = this.fb.group({
        MrAddCvgTypeCode: o.Key,
        AddCvgTypeName: o.Value,
        Value: false,
        SumInsuredPercentage: obj.SumInsuredPercentage,
        SumInsuredAmt: 0,
        PremiumType: premiumType,
        CustAddPremiRate: custAddPremiRate,
        CustAddPremiAmt: 0,
        BaseCalculation: this.ruleObj.BaseCalc[index],
        InscoAddPremiRate: inscoAddPremiRate,
        InscoAddPremiAmt: 0,
        StdAddPremiRate: this.ruleObj.BaseRate[index]
      });
      (group.controls.AppInsAddCvgs as FormArray).push(control);
    });
    return group;
  }

  addGroupFromDB(insMainCvg: AppInsMainCvgObj){
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

    this.insAddCvgTypeRuleObj.forEach((o, i) => {
      var check;
      if(insMainCvg.AppInsAddCvgObjs == undefined){
        check = undefined;
      }else{
        check = insMainCvg.AppInsAddCvgObjs.find(x => x.MrAddCvgTypeCode == o.Key);
      }
      var index = this.ruleObj.AdditionalCoverageType.findIndex(x => x == o.Key);
      var premiumType = this.ruleObj.PremiumType[index];
      var custAddPremiRate = 0;
      var inscoAddPremiRate = 0;

      if(premiumType == AdInsConstant.PremiumTypeAmt){
        custAddPremiRate = check == undefined ? this.ruleObj.PremiToCust[index] : check.CustAddPremiAmt;
        inscoAddPremiRate = check == undefined ? this.ruleObj.PremiToInsco[index] : check.InscoAddPremiAmt;
      }

      if(premiumType == AdInsConstant.PremiumTypePrcnt){
        custAddPremiRate = check == undefined ? this.ruleObj.RateToCust[index] : check.CustAddPremiRate;
        inscoAddPremiRate = check == undefined ? this.ruleObj.RateToInsco[index] : check.InscoAddPremiRate;
      }

      const control = this.fb.group({
        MrAddCvgTypeCode: o.Key,
        AddCvgTypeName: o.Value,
        Value: check == undefined ? false : true,
        SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
        SumInsuredAmt: check == undefined ? 0 : check.SumInsuredAmt,
        PremiumType: premiumType,
        CustAddPremiRate: custAddPremiRate,
        CustAddPremiAmt: check == undefined ? 0 : check.CustAddPremiAmt,
        BaseCalculation: this.ruleObj.BaseCalc[index],
        InscoAddPremiRate: inscoAddPremiRate,
        InscoAddPremiAmt: check == undefined ? 0 : check.InscoAddPremiAmt,
        StdAddPremiRate: this.ruleObj.BaseRate[index]
      });
      (group.controls.AppInsAddCvgs as FormArray).push(control);
    });
    return group;
  }

  MainCvgTypeDetailChanged(event, i){
    this.setRate(event.target.value, i);
    this.isCalculate = false;
  }

  IsAddCvgChanged(event){
    this.isCalculate = false;
  }

  setRate(mainCoverageType, i){
    var index = this.ruleObj.MainCoverageType.findIndex(x => x == mainCoverageType);
    this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
      CustMainPremiRate: this.ruleObj.MainRateToCust[index],
      InscoMainPremiRate: this.ruleObj.MainRateToInsco[index]
    });
  }

  ApplyToCoverage(){
    for(let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++){
      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
        MrMainCvgTypeCode: this.InsuranceDataForm.controls.InsMainCvgType.value
      });
      this.setRate(this.InsuranceDataForm.controls.InsMainCvgType.value, i);
      const formAddCvgChecked = this.InsuranceDataForm.controls.InsAddCvgTypes["controls"].filter(x => x.value.Value == true);

      for(let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++){
        var check = formAddCvgChecked.find(x => x.value.Key == this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].AddCvgTypeName.value);

        if(check != undefined){
          this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
            Value: true
          });
        }else{
          this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
            Value: false
          });
        }
      }
    }

    this.isCalculate = false;
  }

  CvgAmtChanged(event){
    this.isGenerate = false;
  }

  CustAdminFeeAmtChanged(event){
    this.isCalculate = false;
  }

  CoverPeriodChanged(event){
    this.setInsLengthDefaultValue(event.target.value);
    this.isGenerate = false;
  }

  AssetRegionChanged(event){
    this.isGenerate = false;
  }

  InsLengthChanged(event){
    this.isGenerate = false;
  }

  setInsLengthDefaultValue(coverPeriod){
    if(coverPeriod == AdInsConstant.CoverPeriodAnnually){
      this.InsuranceDataForm.patchValue({
        InsLength: 12
      });
    }

    if(coverPeriod == AdInsConstant.CoverPeriodFullTenor){
      this.InsuranceDataForm.patchValue({
        InsLength: this.appObj.Tenor
      });
    }

    if(coverPeriod == AdInsConstant.CoverPeriodPartialTenor){
      this.InsuranceDataForm.patchValue({
        InsLength: 1
      });
    }

    if(coverPeriod == AdInsConstant.CoverPeriodOverTenor){
      this.InsuranceDataForm.patchValue({
        InsLength: this.appObj.Tenor + 1
      });
    }

    this.setInsLengthValidator(coverPeriod);
  }

  setInsLengthValidator(coverPeriod){
    if(coverPeriod == AdInsConstant.CoverPeriodAnnually){
      this.minInsLength = 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.disable();
    }

    if(coverPeriod == AdInsConstant.CoverPeriodFullTenor){
      this.minInsLength = 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.disable();
    }

    if(coverPeriod == AdInsConstant.CoverPeriodPartialTenor){
      this.minInsLength = 1;
      this.maxInsLength = this.appObj.Tenor - 1;
      this.InsuranceDataForm.controls.InsLength.enable();
      this.InsuranceDataForm.controls.InsLength.setValidators([Validators.required, Validators.min(this.minInsLength),Validators.max(this.maxInsLength)]);
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
    }

    if(coverPeriod == AdInsConstant.CoverPeriodOverTenor){
      this.minInsLength = this.appObj.Tenor + 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.enable();
      this.InsuranceDataForm.controls.InsLength.setValidators([Validators.required, Validators.min(this.minInsLength),Validators.max(this.maxInsLength)]);
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
    }
  }

  InscoBranchCodeChanged(event){
    this.InsuranceDataForm.patchValue({
      InscoBranchName: this.inscoBranchObj.find(x => x.Key == event.target.value).Value
    });
    this.isGenerate = false;
  }

  InsuredByChanged(event){
    this.setValidator(event.target.value);
  }

  setValidator(insuredBy){
    if(insuredBy == AdInsConstant.InsuredByOffSystem){
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

    if(insuredBy == AdInsConstant.InsuredByCustomer){
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

    if(insuredBy == AdInsConstant.InsuredByCompany){
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

    if(insuredBy == AdInsConstant.InsuredByCustomerCompany){
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
      this.InsuranceDataForm.controls.CvgAmt.updateValueAndValidity();    }
  }

  async getInsuranceData(){
    var reqObj = {AppId: this.AppId}
    await this.http.post(AdInsConstant.GetInsuranceDataByAppId, reqObj).toPromise().then(
      (response) => {
        console.log(response);
        this.appObj = response["AppObj"];
        this.appAssetObj = response["AppAssetObj"];
        this.appAssetAccessoryObjs = response["AppAssetAccessoryObjs"];
        this.appFinDataObj = response["AppFinDataObj"];
        this.appInsuranceObj = response["AppInsuranceObj"];
        this.appInsObjObj = response["AppInsObjObj"];
        this.appInsMainCvgObj = response["AppInsMainCvgObjs"];

        var totalAccessoryPriceAmt = 0;

        for(let i=0; i < this.appAssetAccessoryObjs.length; i++){
          totalAccessoryPriceAmt += this.appAssetAccessoryObjs[i].AccessoryPriceAmt; 
        }

        this.totalAssetPriceAmt = this.appAssetObj.AssetPriceAmt + totalAccessoryPriceAmt;

        if(this.appFinDataObj != undefined){
          this.InsuranceDataForm.patchValue({
            CvgAmt: this.totalAssetPriceAmt,
            CustCvgAmt: this.totalAssetPriceAmt
          });
        }

        this.appAssetId = this.appAssetObj.AppAssetId;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async bindAppInsAndAppInsObj(insuredBy){
    if(this.appInsuranceObj != undefined && this.appInsObjObj != undefined){
      if(insuredBy == AdInsConstant.InsuredByOffSystem){
        this.InsuranceDataForm.patchValue({
          InsAssetCoveredBy: insuredBy
        });
      }

      if(insuredBy == AdInsConstant.InsuredByCustomer){
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

      if(insuredBy == AdInsConstant.InsuredByCompany){
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
          CvgAmt: this.appInsObjObj.CvgAmt,
          TotalCustDiscAmt: this.appInsObjObj.TotalCustDiscAmt
        });

        this.setInsLengthValidator(this.appInsObjObj.InsAssetCoverPeriod);
        await this.GenerateInsurance(this.appInsMainCvgObj);
      }

      if(insuredBy == AdInsConstant.InsuredByCustomerCompany){
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
          CustInscoBranchName: this.appInsObjObj.CustInscoBranchName,
          InsPolicyNo: this.appInsObjObj.InsPolicyNo,
          InsPolicyName: this.appInsObjObj.InsPolicyName,
          CustCoverStartDt: formatDate(this.appInsObjObj.CustCoverStartDt, 'yyyy-MM-dd', 'en-US'),
          EndDt: formatDate(this.appInsObjObj.StartDt, 'yyyy-MM-dd', 'en-US'),
          CustNotes: this.appInsObjObj.CustNotes,
          CustCvgAmt: this.appInsObjObj.CustCvgAmt,
          CvgAmt: this.appInsObjObj.CvgAmt,
          TotalCustDiscAmt: this.appInsObjObj.TotalCustDiscAmt
        });

        this.setInsLengthValidator(this.appInsObjObj.InsAssetCoverPeriod);
        await this.GenerateInsurance(this.appInsMainCvgObj);
      }
      this.setValidator(insuredBy);
    }
  }

  async bindInsuredByObj(){
    var refMasterObj = { RefMasterTypeCode: "INSURED_BY"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insuredByObj = response["ReturnObject"];
        if(this.insuredByObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InsAssetCoveredBy: this.insuredByObj[0].Key
          });
          this.setValidator(this.insuredByObj[0].Key);
        }
      }
    );
  }

  async bindPaidByObj(){
    var refMasterObj = { RefMasterTypeCode: "INS_PAID_BY"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.paidByObj = response["ReturnObject"];
        if(this.paidByObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InsAssetPaidBy: this.paidByObj[0].Key
          });
        }
      }
    );
  }

  async bindInsMainCvgTypeObj(){
    var refMasterObj = { RefMasterTypeCode: "INS_MAIN_CVG_TYPE"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insMainCvgTypeObj = response["ReturnObject"];
        if(this.insMainCvgTypeObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InsMainCvgType: this.insMainCvgTypeObj[0].Key
          });
          this.defaultInsMainCvgType = this.insMainCvgTypeObj[0].Key;
        }
      }
    );
  }

  async bindInsAddCvgTypeObj(){
    var refMasterObj = { RefMasterTypeCode: "INS_ADD_CVG_TYPE"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAddCvgTypeObj = response["ReturnObject"];
      }
    );
  }

  addCheckbox(){
    this.insAddCvgTypeRuleObj.forEach((o, i) => {
      const control = this.fb.group({
        Key: o.Value,
        Value: false
      });
      (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray).push(control);
    });
  }

  async bindInsAssetCoverPeriodObj(){
    var refMasterObj = { RefMasterTypeCode: "INS_COVER_PERIOD"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAssetCoverPeriodObj = response["ReturnObject"];
        if(this.insAssetCoverPeriodObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InsAssetCoverPeriod: this.insAssetCoverPeriodObj[0].Key
          });

          this.setInsLengthDefaultValue(this.insAssetCoverPeriodObj[0].Key);
        }
      }
    );
  }

  async bindInsAssetRegionObj(){
    var refMasterObj = { RefMasterTypeCode: "ASSET_INS_REGION"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAssetRegionObj = response["ReturnObject"];
        if(this.insAssetRegionObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InsAssetRegion: this.insAssetRegionObj[0].Key
          });
        }
      }
    );
  }

  async bindInscoBranchObj(){
    var inscoBranchObj = { MrVendorCategory: AdInsConstant.VendorCategoryAssetInscoBranch, OfficeCode: this.appObj.OriOfficeCode};
    await this.http.post(AdInsConstant.GetListKeyValueByCategoryCodeAndOfficeCode, inscoBranchObj).toPromise().then(
      (response) => {
        this.inscoBranchObj = response["ReturnObject"];
        if(this.inscoBranchObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InscoBranchCode: this.inscoBranchObj[0].Key,
            InscoBranchName: this.inscoBranchObj[0].Value
          });
        }
      }
    );
  }

  // test(){
  //   console.log(this.InsuranceDataForm);
  // }

}
