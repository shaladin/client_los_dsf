import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { SalesInfoObj } from 'app/shared/model/SalesInfoObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustFctrObj } from 'app/shared/model/MouCustFctrObj.Model';

@Component({
  selector: 'app-application-data-factoring',
  templateUrl: './application-data-factoring.component.html',
  styleUrls: ['./application-data-factoring.component.scss']
})
export class ApplicationDataFactoringComponent implements OnInit {
  @Input() AppId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  mode: string;
  salesAppInfoObj: SalesInfoObj = new SalesInfoObj();
  mouCustFctrObj: MouCustFctrObj = new MouCustFctrObj();

  SalesAppInfoForm = this.fb.group({
    MouCustId: ['', Validators.required],
    MrSalesRecommendCode: ['', Validators.required],
    SalesNotes: [''],
    SalesOfficerNo: ['', Validators.required],
    SalesHeadNo: [''],
    MrInstTypeCode: ['', Validators.required],
    TopDays: ['', Validators.required],
    Tenor: ['', Validators.required],
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
    this.loadData();
    this.SalesAppInfoForm.controls.NumOfInst.disable();
  }

  setDropdown() {
    this.refMasterInterestType.RefMasterTypeCode = 'INTEREST_TYPE';
    this.refMasterInsScheme.RefMasterTypeCode = 'INST_SCHM';
    this.refMasterInsScheme.ReserveField1 = 'FCTR';
    this.refMasterInsType.RefMasterTypeCode = 'INST_TYPE';
    this.refMasterRecommendation.RefMasterTypeCode = 'SLS_RECOM';
    this.refMasterWOP.RefMasterTypeCode = 'WOP';
    this.refMasterCalcMethod.RefMasterTypeCode = 'SINGLE_INST_CALC_METHOD';
    this.refMasterAppPaidBy.RefMasterTypeCode = 'APP_PAID_BY';
    this.refMasterRecourseType.RefMasterTypeCode = 'RECOURSE_TYPE';
    this.refMasterIntrstType.RefMasterTypeCode = 'INTRSTTYPE';

    var AppObj = {
      AppId: this.resultData.AppId,
      MouType: "FACTORING"
    }
    this.http.post(AdInsConstant.GetListMouByAppIdAndMouType, AppObj).subscribe(
      (response) => {
        this.allMouCust = response;
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MouCustId: this.allMouCust[0].MouCustId
          });
          MouCustId = this.resultData.MouCustId
        } else {
          var MouCustId = this.allMouCust[0].MouCustId
        }
        this.SetPayFreq(MouCustId);
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterIntrstType).subscribe(
      (response) => {
        this.allIntrstType = response['ReturnObject'];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            InterestType: this.allIntrstType[0].Key
          });
        }
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetListActiveRefMasterWithReserveFieldAll, this.refMasterInsScheme).subscribe(
      (response) => {
        this.allInScheme = response['ReturnObject'];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrInstSchemeCode: this.allInScheme[0].Key
          });
        }
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetListRefEmpByGsValueandOfficeId, null).subscribe(
      (response) => {
        this.allInSalesOffice = response['ReturnObject'];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            SalesOfficerNo: this.allInSalesOffice[0].EmpNo
          });
        }
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterInsType).subscribe(
      (response) => {
        this.allInType = response['ReturnObject'];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrInstTypeCode: this.allInType[0].Key
          });
        }
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterRecommendation).subscribe(
      (response) => {
        this.allSlsRecom = response['ReturnObject'];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrSalesRecommendCode: this.allSlsRecom[0].Key
          });
        }
      },
      (error) => {
        console.log(error);
      })

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterWOP).subscribe(
      (response) => {
        this.allWOP = response['ReturnObject'];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrWopCode: this.allWOP[0].Key
          });
        }
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetListKvpActiveRefAppSrc, null).subscribe(
      (response) => {
        this.allAppSource = response['ReturnObject'];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrAppSourceCode: this.allAppSource[0].Key
          });
        }
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterCalcMethod).subscribe(
      (response) => {
        this.allCalcMethod = response['ReturnObject'];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            MrSingleInstCalcMthdCode: this.allCalcMethod[0].Key
          });
        }
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterAppPaidBy).subscribe(
      (response) => {
        this.allPaidby = response['ReturnObject'];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            PaidBy: this.allPaidby[0].Key
          });
        }
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterRecourseType).subscribe(
      (response) => {
        this.CheckInstType();
        this.allRecourseType = response['ReturnObject'];
        if (this.mode != 'edit') {
          this.SalesAppInfoForm.patchValue({
            RecourseType: this.allRecourseType[0].Key
          });
        }
      },
      (error) => {
        console.log(error);
      });
  }

  SetPayFreq(MouCustId: number) {
    var MouObj={
      MouCustId: MouCustId
    }
    this.http.post<MouCustFctrObj>(AdInsConstant.GetMouCustFctrByMouCustId, MouObj).subscribe(
      (response) => {
        this.mouCustFctrObj = response;
        this.http.post(AdInsConstant.GetRefPayFreqByPayFreqCode, this.mouCustFctrObj).subscribe(
          (response) => {
            this.allPayFreq = response;
            if (this.mode != 'edit') {
              this.SalesAppInfoForm.patchValue({
                PayFreqCode: this.allPayFreq.PayFreqCode
              });
            }
          },
          (error) => {
            console.log(error);
          });
      },
      (error) => {
        console.log(error);
      });
  }

  CalculateNumOfInst() {
    var numOfInst;
    numOfInst = this.SalesAppInfoForm.controls.Tenor.value / this.allPayFreq.PayFreqVal;
    this.SalesAppInfoForm.controls.NumOfInst.patchValue(numOfInst);
    this.salesAppInfoObj.NumOfInst = numOfInst;
  }

  CheckInstType() {
    if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == "MULTIPLE") {
      this.SalesAppInfoForm.controls.Tenor.enable();
      this.SalesAppInfoForm.controls.MrInstSchemeCode.enable();
      this.SalesAppInfoForm.controls.TopDays.clearValidators();
    } else if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == "SINGLE") {
      this.SalesAppInfoForm.controls.Tenor.disable();
      this.SalesAppInfoForm.controls.Tenor.patchValue(1);
      this.SalesAppInfoForm.controls.TopDays.setValidators(Validators.required);
      this.SalesAppInfoForm.controls.MrInstSchemeCode.disable();
      this.SalesAppInfoForm.controls.NumOfInst.patchValue(1);
    }

    this.SalesAppInfoForm.controls.TopDays.updateValueAndValidity();
  }

  loadData() {
    var obj = {
      AppId: this.AppId
    }

    this.http.post(AdInsConstant.GetApplicationDataByAppId, obj).subscribe(
      (response) => {
        this.resultData = response;
        this.salesAppInfoObj.AppRowVersion = this.resultData.AppRowVersion;
        this.salesAppInfoObj.AppFinDataRowVersion = this.resultData.AppFinDataRowVersion;
        this.salesAppInfoObj.AppFctrRowVersion = this.resultData.AppFctrRowVersion;

        if (this.resultData.AppFinDataId == null && this.resultData.AppFctrId == null) {
          this.mode = "add";
        } else if (this.resultData.AppFinDataId != null && this.resultData.AppFctrId != null) {
          this.mode = "edit";
        }

        this.setDropdown();

        this.SalesAppInfoForm.patchValue({
          MrSalesRecommendCode: this.resultData.MrSalesRecommendCode,
          MouCustId: this.resultData.MouCustId,
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
          MrSingleInstCalcMthdCode: this.resultData.MrSingleInstCalcMthdCode,
          InterestType: this.resultData.InterestType
        })
      },
      (error) => {
        console.log(error);
      }
    );
  }

  SaveForm(): void {
    this.salesAppInfoObj = this.SalesAppInfoForm.value;
    this.salesAppInfoObj.AppId = this.AppId;

    if (this.salesAppInfoObj.MrInstTypeCode == "SINGLE") {
      this.salesAppInfoObj.MrInstSchemeCode = "EP";
    } else {
      this.salesAppInfoObj.MrInstSchemeCode = this.SalesAppInfoForm.controls.MrInstSchemeCode.value;
      this.salesAppInfoObj.NumOfInst = this.SalesAppInfoForm.controls.NumOfInst.value;
    }

    if (this.mode == "add") {
      this.http.post(AdInsConstant.SaveApplicationData, this.salesAppInfoObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputTab.emit();
        },
        (error) => {
          console.log(error);
        });
    } else {
      this.salesAppInfoObj.AppRowVersion = this.resultData.AppRowVersion;
      this.salesAppInfoObj.AppFctrRowVersion = this.resultData.AppFctrRowVersion;
      this.salesAppInfoObj.AppFinDataRowVersion = this.resultData.AppFinDataRowVersion;
      this.http.post(AdInsConstant.EditApplicationData, this.salesAppInfoObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputTab.emit();
        },
        (error) => {
          console.log(error);
        });
    }

  }

}
