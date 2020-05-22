import { Component, OnInit, Input } from '@angular/core';
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

  SalesAppInfoForm = this.fb.group({
    AppId: [''],
    SrvyOrderNo: ['', Validators.required],
    MrSalesRecommendCode: ['', Validators.required],
    SalesNotes: ['', Validators.required],
    SalesOfficerNo: ['', Validators.required],
    SalesHeadNo: ['', Validators.required],
    MrInstTypeCode: ['', Validators.required],
    TopDays: [''],
    Tenor: [''],
    NumOfInst: ['', Validators.required],
    MrInstSchemeCode: ['', Validators.required],
    IsDisclosed: false,
    PaidBy: ['', Validators.required],
    RecourseType: ['', Validators.required],
    MrAppSourceCode: ['', Validators.required],
    MrWopCode: ['', Validators.required],
    PayFreqCode: ['', Validators.required],
    MrSingleInstCalcMthdCode: ['', Validators.required]
  })
  //refMasterObj: RefMasterObj;
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

  constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
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
    this.httpClient.post(AdInsConstant.GetAppByIds, obj).subscribe(
      (response) => {
        this.resultData = response;
        console.log(this.resultData);
        this.payfreq = new PayFreqObj();
        this.payfreq.ProdOfferingCode = this.resultData.ProdOfferingCode;
        this.payfreq.RefProdCompntCode = "PAYFREQ";

        this.httpClient.post(AdInsConstant.GetPayFreqByProdOfferingCodeandRefProdCompntCode, this.payfreq).subscribe(
          (response) => {
            console.log(response);
            this.allPayFreq = response['ReturnObject'];
            console.log(this.allPayFreq);
            this.SalesAppInfoForm.patchValue({
              PayFreqCode: this.allPayFreq[0].PayFreqCode
            });
          },
          (error) => {
            console.log(error);
          });

      })

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




    this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterInsScheme).subscribe(
      (response) => {
        console.log(response);
        this.allInScheme = response['ReturnObject'];
        console.log(this.allInScheme);
        this.SalesAppInfoForm.patchValue({
          MrInstSchemeCode: this.allInScheme[1].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetListRefEmpByGsValueandOfficeId, null).subscribe(
      (response) => {
        console.log(response);
        this.allInSalesOffice = response['ReturnObject'];
        console.log(this.allInSalesOffice);
        this.SalesAppInfoForm.patchValue({
          SalesOfficerNo: this.allInSalesOffice[0].EmpNo
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterInsType).subscribe(
      (response) => {
        console.log(response);
        this.allInType = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MrInstTypeCode: this.allInType[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterRecommendation).subscribe(
      (response) => {
        console.log(response);
        this.allSlsRecom = response['ReturnObject'];
        console.log(this.allSlsRecom);
        this.SalesAppInfoForm.patchValue({
          MrSalesRecommendCode: this.allSlsRecom[0].Key
        });
      },
      (error) => {
        console.log(error);
      })

    this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterWOP).subscribe(
      (response) => {
        console.log(response);
        this.allWOP = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MrWopCode: this.allWOP[0].Key
        });
      },
      (error) => {
        console.log(error);
      });
    this.httpClient.post(AdInsConstant.GetListKvpActiveRefAppSrc, null).subscribe(
      (response) => {
        console.log(response);
        this.allAppSource = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MrAppSourceCode: this.allAppSource[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterCalcMethod).subscribe(
      (response) => {
        console.log(response);
        this.allCalcMethod = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MrSingleInstCalcMthdCode: this.allCalcMethod[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterAppPaidBy).subscribe(
      (response) => {
        console.log(response);
        this.allPaidby = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          PaidBy: this.allPaidby[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterRecourseType).subscribe(
      (response) => {
        console.log(response);
        this.allRecourseType = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          RecourseType: this.allRecourseType[0].Key
        });
      },
      (error) => {
        console.log(error);
      });


  }

  SaveForm(): void {

    console.log(this.AppId);
  
    this.salesAppInfoObj = new SalesInfoObj();
    this.salesAppInfoObj.AppId = this.AppId;
    this.salesAppInfoObj = this.SalesAppInfoForm.value;

    console.log(this.salesAppInfoObj);
    if (this.SalesAppInfoForm.controls.MrInstTypeCode.value == 'SINGLE') {
      this.salesAppInfoObj.Tenor = 1;
    }
    if (this.SalesAppInfoForm.controls.MrInstSchemeCode.value == 'Even Principle') {
      this.salesAppInfoObj.MrInstSchemeCode = 'EP';
    }
    if (this.SalesAppInfoForm.controls.MrInstSchemeCode.value == 'Regular Fixed') {
      this.salesAppInfoObj.MrInstSchemeCode = 'RF';
    }
    console.log(this.salesAppInfoObj);

    this.httpClient.post(AdInsConstant.SaveApp, this.salesAppInfoObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
       // this.router.navigateByUrl('/Office/OfficeArea');
      },
      (error) => {
        console.log(error);
      });
  }

}
