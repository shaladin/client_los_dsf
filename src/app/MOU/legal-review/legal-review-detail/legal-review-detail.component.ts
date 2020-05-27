import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MouCustLglReviewObj } from 'app/shared/model/MouCustLglReviewObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustTcComponent } from 'app/MOU/mou-customer-request/mou-cust-tc/mou-cust-tc.component';

@Component({
  selector: 'app-legal-review-detail',
  templateUrl: './legal-review-detail.component.html',
  providers: [NGXToastrService]
})
export class LegalReviewDetailComponent implements OnInit {
  viewObj: string;
  MouCustId: number;
  WfTaskListId: any;
  GetListActiveRefMasterUrl: string = AdInsConstant.GetListActiveRefMaster;
  AddEditRangeMouCustLglReview: string = AdInsConstant.AddEditRangeMouCustLglReview;
  responseObj: any;
  responseRefMasterObj: any;
  GetMouCustTcForMouLglByCustMouIdUrl: string = AdInsConstant.GetMouCustTcForMouLglByCustMouId;
  GetMouCustLglReviewByMouCustIdUrl: string = AdInsConstant.GetMouCustLglReviewByMouCustId;
  EditRangeMouCustLglReviewUrl: string = AdInsConstant.EditRangeMouCustLglReview;
  responseMouTcObj: any;
  items: FormArray;
  termConditions : FormArray;
  LegalForm = this.fb.group(
    {
      items: this.fb.array([]),
      termConditions : this.fb.array([])
    }
  );
  GetRefMasterByRefMasterTypeCodeUrl: string = AdInsConstant.GetRefMasterByRefMasterTypeCode;
  EditListMouCustTc: string = AdInsConstant.EditListMouCustTc;
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
    this.claimTask();
    this.items = this.LegalForm.get('items') as FormArray;
    this.termConditions = this.LegalForm.get('termConditions') as FormArray;
    this.viewObj = "./assets/ucviewgeneric/viewMouHeader.json";
    var mouObj = { "MouCustId": this.MouCustId };
    this.http.post(this.GetMouCustLglReviewByMouCustIdUrl, mouObj).subscribe(
      response =>{
        this.responseMouObj = response['ReturnObject'];

        var refLglReviewObj = { "RefMasterTypeCode": "LGL_REVIEW" };
        this.http.post(this.GetListActiveRefMasterUrl, refLglReviewObj).subscribe(
          (response) => {
            var lengthDataReturnObj = response["ReturnObject"].length;
            this.responseRefMasterObj = response["ReturnObject"];
            for (var i = 0; i < lengthDataReturnObj; i++) {
              var eachDataDetail = this.fb.group({
                ReviewComponentName: [response["ReturnObject"][i].Descr],
                ReviewComponentValue: [response["ReturnObject"][i].MasterCode],
                RowVersion : [this.SearchLegalReview(response["ReturnObject"][i].MasterCode, true)],
                values: [this.SearchLegalReview(response["ReturnObject"][i].MasterCode, false)]
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

  async claimTask()
  {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext["UserName"]};
    console.log(wfClaimObj);
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  SearchLegalReview(key, isRowVersion){
    if(this.responseMouObj.length > 0){
      for(var i=0;i<this.responseMouObj.length;i++){
        if(this.responseMouObj[i]['MrLglReviewCode'] == key){
          if(isRowVersion){
            return this.responseMouObj[i]['RowVersion'];
          }
          else{
            return this.responseMouObj[i]['LglReviewResult'];
          }
        }
      }
    }
    return '';
  }
  
  SaveData(formObj: any, isSubmit : boolean) {
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
