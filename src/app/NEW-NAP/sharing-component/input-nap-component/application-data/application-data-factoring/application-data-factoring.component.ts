import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { SalesInfoObj } from 'app/shared/model/SalesInfoObj.Model';
import { PayFreqObj } from 'app/shared/model/PayFreqObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-application-data-factoring',
  templateUrl: './application-data-factoring.component.html',
  styleUrls: ['./application-data-factoring.component.scss']
})
export class ApplicationDataFactoringComponent implements OnInit {
  @Input() AppId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  
  SalesAppInfoForm = this.fb.group({
    AppId: [''],
    SrvyOrderNo: [''],
    MrSalesRecommendCode: ['', Validators.required],
    SalesNotes: [''],
    SalesOfficerNo: ['', Validators.required],
    SalesHeadNo: [''],
    MrInstTypeCode: ['', Validators.required],
    TopDays: ['', Validators.required],
    Tenor: [''],
    NumOfInst: ['', Validators.required],
    MrInstSchemeCode: ['', Validators.required],
    IsDisclosed: [false, Validators.required],
    PaidBy: ['', Validators.required],
    RecourseType: ['', Validators.required],
    MrAppSourceCode: ['', Validators.required],
    MrWopCode: ['', Validators.required],
    PayFreqCode: ['', Validators.required],
    MrSingleInstCalcMthdCode: ['', Validators.required]
  })

  refMasterInterestType: RefMasterObj;
  refMasterInsScheme: RefMasterObj;
  refMasterInsType: RefMasterObj;
  refMasterRecommendation: any;
  refMasterWOP: RefMasterObj;
  refMasterAppSource: RefMasterObj;
  refMasterCalcMethod: RefMasterObj;
  refMasterAppPaidBy: RefMasterObj;
  refMasterRecourseType: RefMasterObj;
  allInterestType: any;
  allInScheme: any;
  allInType: any;
  allSlsRecom: any;
  allWOP: any;
  allAppSource: any;
  allPaidby: any;
  allRecourseType: any;
  allCalcMethod: any;
  salesAppInfoObj: SalesInfoObj;

  listMultiple: Array<any> = ['Even Principle', 'Regular Fixed'];
  listSingle: Array<any> = ['Even Principle'];
  payfreq: PayFreqObj;
  resultData: any;
  allPayFreq: any;
  allInSalesOffice: any;
  MrInstTypeCode: string;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
  }

  ngOnInit() {

    this.SalesAppInfoForm.patchValue({
      AppId: this.AppId
    })
    var obj = {
      AppId: this.AppId
    }

    this.loadData();

    // this.http.post(AdInsConstant.GetAppByIds, obj).subscribe(
    //   (response) => {
    //     this.resultData = response;
    //     this.payfreq = new PayFreqObj();
    //     this.payfreq.ProdOfferingCode = this.resultData.ProdOfferingCode;
    //     this.payfreq.RefProdCompntCode = "PAYFREQ";
    //   })

    this.refMasterInterestType = new RefMasterObj();
    this.refMasterInterestType.RefMasterTypeCode = 'INTEREST_TYPE';
    this.refMasterInsScheme = new RefMasterObj();
    this.refMasterInsScheme.RefMasterTypeCode = 'INST_SCHM';
    this.refMasterInsType = new RefMasterObj();
    this.refMasterInsType.RefMasterTypeCode = 'INST_TYPE';
    this.refMasterRecommendation = new RefMasterObj();
    this.refMasterRecommendation.refMasterTypeCode = 'SLS_RECOM';
    this.refMasterWOP = new RefMasterObj();
    this.refMasterWOP.RefMasterTypeCode = 'WOP';
    this.refMasterCalcMethod = new RefMasterObj();
    this.refMasterCalcMethod.RefMasterTypeCode = 'SINGLE_INST_CALC_METHOD';
    this.refMasterAppPaidBy = new RefMasterObj();
    this.refMasterAppPaidBy.RefMasterTypeCode = 'APP_PAID_BY';
    this.refMasterRecourseType = new RefMasterObj();
    this.refMasterRecourseType.RefMasterTypeCode = 'RECOURSE_TYPE';




    this.http.post(AdInsConstant.GetPayFreqByProdOfferingCodeandRefProdCompntCode, this.payfreq).subscribe(
      (response) => {
        this.allPayFreq = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          PayFreqCode: this.allPayFreq[0].PayFreqCode
        });
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterInsScheme).subscribe(
      (response) => {
        this.allInScheme = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MrInstSchemeCode: this.allInScheme[1].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetListRefEmpByGsValueandOfficeId, null).subscribe(
      (response) => {
        this.allInSalesOffice = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          SalesOfficerNo: this.allInSalesOffice[0].EmpNo
        });
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterInsType).subscribe(
      (response) => {
        this.allInType = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MrInstTypeCode: this.allInType[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterRecommendation).subscribe(
      (response) => {
        this.allSlsRecom = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MrSalesRecommendCode: this.allSlsRecom[0].Key
        });
      },
      (error) => {
        console.log(error);
      })

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterWOP).subscribe(
      (response) => {
        this.allWOP = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MrWopCode: this.allWOP[0].Key
        });
      },
      (error) => {
        console.log(error);
      });
    this.http.post(AdInsConstant.GetListKvpActiveRefAppSrc, null).subscribe(
      (response) => {
        this.allAppSource = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MrAppSourceCode: this.allAppSource[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterCalcMethod).subscribe(
      (response) => {
        this.allCalcMethod = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MrSingleInstCalcMthdCode: this.allCalcMethod[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterAppPaidBy).subscribe(
      (response) => {
        this.allPaidby = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          PaidBy: this.allPaidby[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterRecourseType).subscribe(
      (response) => {
        this.allRecourseType = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          RecourseType: this.allRecourseType[0].Key
        });
      },
      (error) => {
        console.log(error);
      });


  }

  CheckInstType(){
    if(this.SalesAppInfoForm.controls.MrInstTypeCode.value == "MULTIPLE"){
      
      this.SalesAppInfoForm.controls.Tenor.setValidators([Validators.required]);
      this.SalesAppInfoForm.controls.PayFreqCode.setValidators([Validators.required]);
      this.SalesAppInfoForm.controls.MRSingleInstCalcMthdCode.clearValidators();
      this.SalesAppInfoForm.controls.TOPDays.clearValidators();
    }else{
      this.SalesAppInfoForm.controls.Tenor.clearValidators();
      this.SalesAppInfoForm.controls.PayFreqCode.clearValidators();
      this.SalesAppInfoForm.controls.MRSingleInstCalcMthdCode.setValidators([Validators.required]);
      this.SalesAppInfoForm.controls.TOPDays.setValidators([Validators.required]);
    }

    this.SalesAppInfoForm.controls.Tenor.updateValueAndValidity();
    this.SalesAppInfoForm.controls.PayFreqCode.updateValueAndValidity();
    this.SalesAppInfoForm.controls.MRSingleInstCalcMthdCode.updateValueAndValidity();
    this.SalesAppInfoForm.controls.TOPDays.updateValueAndValidity();
  }

  loadData() {
    var obj = {
      AppId: this.AppId
    }
    this.http.post(AdInsConstant.GetApplicationDataByAppId, obj).subscribe(
      (response) => {
        this.resultData = response;
        this.SalesAppInfoForm.patchValue({
          SrvyOrderNo: this.resultData.SrvyOrderNo,
          MrSalesRecommendCode: this.resultData.MrSalesRecommendCode,
          SalesNotes: this.resultData.SalesNotes,
          SalesOfficerNo: this.resultData.SalesOfficerNo,
          SalesHeadNo: this.resultData.SalesHeadNo,
          MrInstTypeCode: this.resultData.MrInstTypeCode,
          TopDays: this.resultData.TopDays,
          Tenor: this.resultData.Tenor,
          NumOfInst: this.resultData.NumOfInst,
          MrInstSchemeCode: this.resultData.MrInstSchemeCode,
          IsDisclosed: this.resultData.IsDisclosed,
          PaidBy: this.resultData.PaidBy,
          RecourseType: this.resultData.RecourseType,
          MrAppSourceCode: this.resultData.MrAppSourceCode,
          MrWopCode: this.resultData.MrWopCode,
          PayFreqCode: this.resultData.PayFreqCode,
          MrSingleInstCalcMthdCode: this.resultData.MrSingleInstCalcMthdCode
        })
      },
      (error) => {
        console.log(error);
      }
    );
  }

  SaveForm(): void {
    this.salesAppInfoObj = new SalesInfoObj();
    this.salesAppInfoObj.AppId = this.AppId;
    this.salesAppInfoObj = this.SalesAppInfoForm.value;

    if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == 'SINGLE') {
      this.salesAppInfoObj.Tenor = 1;
    }
    if (this.SalesAppInfoForm.controls.MrInstSchemeCode.value == 'Even Principle') {
      this.salesAppInfoObj.MrInstSchemeCode = 'EP';
    }
    if (this.SalesAppInfoForm.controls.MrInstSchemeCode.value == 'Regular Fixed') {
      this.salesAppInfoObj.MrInstSchemeCode = 'RF';
    }

    this.http.post(AdInsConstant.SaveApp, this.salesAppInfoObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.outputTab.emit();
      },
      (error) => {
        console.log(error);
      });
  }

}
