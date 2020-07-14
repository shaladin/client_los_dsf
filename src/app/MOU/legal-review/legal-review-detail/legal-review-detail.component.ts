import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MouCustLglReviewObj } from 'app/shared/model/MouCustLglReviewObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustTcComponent } from 'app/MOU/mou-customer-request/mou-cust-tc/mou-cust-tc.component';
import { environment } from 'environments/environment';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'app-legal-review-detail',
  templateUrl: './legal-review-detail.component.html',
  providers: [NGXToastrService]
})
export class LegalReviewDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  MouCustId: number;
  WfTaskListId: any;
  GetListActiveRefMasterUrl: string = URLConstant.GetListActiveRefMaster;
  AddEditRangeMouCustLglReview: string = URLConstant.AddEditRangeMouCustLglReview;
  responseObj: any;
  responseRefMasterObj: any;
  GetMouCustTcForMouLglByCustMouIdUrl: string = URLConstant.GetMouCustTcForMouLglByCustMouId;
  GetMouCustLglReviewByMouCustIdUrl: string = URLConstant.GetMouCustLglReviewByMouCustId;
  EditRangeMouCustLglReviewUrl: string = URLConstant.EditRangeMouCustLglReview;
  responseMouTcObj: any;
  items: FormArray;
  termConditions: FormArray;
  link: any;
  mouCustObj: any;
  resultData: any;
  LegalForm = this.fb.group(
    {
      items: this.fb.array([]),
      termConditions: this.fb.array([])
    }
  );
  GetRefMasterByRefMasterTypeCodeUrl: string = URLConstant.GetRefMasterByRefMasterTypeCode;
  EditListMouCustTc: string = URLConstant.EditListMouCustTc;
  @ViewChild("MouTc") public mouTc: MouCustTcComponent;
  responseMouObj: Array<any> = new Array<any>();
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: NGXToastrService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) this.MouCustId = params['MouCustId'];
      if (params['WfTaskListId'] != null) this.WfTaskListId = params['WfTaskListId'];
    });
  }

  ngOnInit() {
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }

    this.items = this.LegalForm.get('items') as FormArray;
    this.termConditions = this.LegalForm.get('termConditions') as FormArray;
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.http.post(URLConstant.GetMouCustById, this.mouCustObj).subscribe(
      (response: MouCustObj) => {
        this.resultData = response;
      }
    );
    var mouObj = { "MouCustId": this.MouCustId };
    this.http.post(this.GetMouCustLglReviewByMouCustIdUrl, mouObj).subscribe(
      response => {
        this.responseMouObj = response['ReturnObject'];

        var refLglReviewObj = { "RefMasterTypeCode": CommonConstant.RefMasterTypeLegalReview };
        this.http.post(this.GetListActiveRefMasterUrl, refLglReviewObj).subscribe(
          (response) => {
            var lengthDataReturnObj = response[CommonConstant.ReturnObj].length;
            this.responseRefMasterObj = response[CommonConstant.ReturnObj];
            for (var i = 0; i < lengthDataReturnObj; i++) {
              var eachDataDetail = this.fb.group({
                ReviewComponentName: [response[CommonConstant.ReturnObj][i].Descr],
                ReviewComponentValue: [response[CommonConstant.ReturnObj][i].MasterCode],
                RowVersion: [this.SearchLegalReview(response[CommonConstant.ReturnObj][i].MasterCode, true)],
                values: [this.SearchLegalReview(response[CommonConstant.ReturnObj][i].MasterCode, false), [Validators.required]]
              }) as FormGroup;
              this.items.push(eachDataDetail);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    );


  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    console.log(wfClaimObj);
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  SearchLegalReview(key, isRowVersion) {
    if (this.responseMouObj.length > 0) {
      for (var i = 0; i < this.responseMouObj.length; i++) {
        if (this.responseMouObj[i]['MrLglReviewCode'] == key) {
          if (isRowVersion) {
            return this.responseMouObj[i]['RowVersion'];
          }
          else {
            return this.responseMouObj[i]['LglReviewResult'];
          }
        }
      }
    }
    return '';
  }

  SaveData(formObj: any, isSubmit: boolean) {
    if (this.LegalForm.valid) {
      var mouObj = new MouCustLglReviewObj();
      for (let index = 0; index < this.responseRefMasterObj.length; index++) {
        var tempMouObj = {
          MouCustId: this.MouCustId,
          MrLglReviewCode: formObj.value.items[index].ReviewComponentValue,
          LglReviewResult: formObj.value.items[index].values,
          RowVersion: formObj.value.items[index].RowVersion
        }
        mouObj.MouCustLglReviewObjs.push(tempMouObj);
      }
      mouObj.WfTaskListId = this.WfTaskListId;
      mouObj.IsSubmit = isSubmit;
      this.http.post(this.AddEditRangeMouCustLglReview, mouObj).subscribe(
        response => {
          this.toastr.successMessage(response['message']);
          this.router.navigate(["/Mou/CustomerLegalReview/Paging"]);
        },
        error => {
          console.log(error);
        }
      );
      this.mouTc.Save();
    }

  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
