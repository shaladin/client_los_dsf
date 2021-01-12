import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { RFAInfoObj } from 'app/shared/model/Approval/RFAInfoObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { first } from 'rxjs/operators';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model'; 
import { UcapprovalcreateComponent } from '@adins/Ucapprovalcreate';
@Component({
  selector: 'app-mou-review-factoring',
  templateUrl: './mou-review-factoring.component.html',
  providers: [NGXToastrService]
})
export class MouReviewFactoringComponent implements OnInit {
  rfaInfoObj: RFAInfoObj = new RFAInfoObj();
  mouCustObj: MouCustObj = new MouCustObj();
  mouCustObject: MouCustObj = new MouCustObj();
  keyValueObj: KeyValueObj;
  MouCustId: number;
  WfTaskListId: any;
  MouType: string = "FACTORING";
  PlafondAmt: number;
  listApprover: any;
  listRecommendationObj: any;
  MrCustTypeCode: string;
  link: any;
  resultData: any;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  listReason: any;
  ScoreResult: number;
  InputObj: UcInputRFAObj;
  IsReady: boolean;
  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) { 
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  ApprovalCreateOutput: any;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];
      this.WfTaskListId = params["WfTaskListId"];
    })
  }

 async ngOnInit() {
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeaderFactoring.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    this.mouCustObject.MouCustId = this.MouCustId;
    await this.http.post(URLConstant.GetMouCustById, this.mouCustObject).toPromise().then(
      (response: MouCustObj) => {
        this.resultData = response;
      }
    );

    var apvObj = { SchemeCode: 'MOUC_FCTR_APV' }
    this.http.post(URLConstant.GetApprovedBy, apvObj).subscribe(
      (response) => {
        this.listApprover = response;

        this.MouReviewDataForm.patchValue({
          ListApprover: this.listApprover[0].Key
        })
      })

    // var listRec = this.MouReviewDataForm.get("ApvRecommendation") as FormArray;
    // var apvRecommendObj = { SchemeCode: 'MOUC_FCTR_APV' }
    // this.http.post(URLConstant.GetRecommendations, apvRecommendObj).subscribe(
    //   (response) => {
    //     this.listRecommendationObj = response;
    //     for (let i = 0; i < this.listRecommendationObj["length"]; i++) {
    //       var ApvRecommendation = this.fb.group({
    //         RefRecommendationId: this.listRecommendationObj[i].RefRecommendationId,
    //         RecommendationCode: this.listRecommendationObj[i].RecommendationCode,
    //         RecommendationName: this.listRecommendationObj[i].RecommendationName,
    //         RecommendationValue: ['', Validators.required]
    //       }) as FormGroup;
    //       listRec.push(ApvRecommendation);
    //     }
    //     // this.ApvRecommendation = ApvRecommendation;
    //   })

    var mouCustObj = { MouCustId: this.MouCustId };
    await this.http.post(URLConstant.GetMouCustById, mouCustObj).toPromise().then(
      (response) => {
        this.PlafondAmt = response['PlafondAmt'];
      })
    this.http.post(URLConstant.GetMouCustById, mouCustObj).subscribe(
      (response) => {
        this.MrCustTypeCode = response['MrCustTypeCode'];
      });

   await this.http.post(URLConstant.GetListActiveRefReason, { RefReasonTypeCode: CommonConstant.REF_REASON_MOU_FACTORING }).toPromise().then(
      (response) => {
        this.listReason = response[CommonConstant.ReturnObj];
        this.MouReviewDataForm.patchValue({
          Reason: this.listReason[0].Key
        });
      }
    );

    await this.http.post(URLConstant.GetMouCustScoreByMouCustId, { MouCustId: this.MouCustId}).toPromise().then(
      (response) => {
        this.ScoreResult = response["ScoreResult"];
      }
    );
    this.initInputApprovalObj();
  }

  MouReviewDataForm = this.fb.group({
    ListApprover: [''],
    Reason: [''],
    Notes: [''],
    ApvRecommendation: this.fb.array([])
  })

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  Submit() {
    this.ApprovalCreateOutput = this.createComponent.output();  
    if(this.ApprovalCreateOutput!=undefined){

    this.mouCustObj.MouCustId = this.MouCustId;
    this.PlafondAmt = this.PlafondAmt;
 

  
    var submitMouReviewObj = {
      WfTaskListId: this.WfTaskListId,
      MouCust: this.mouCustObj, 
      PlafondAmt: this.PlafondAmt,
      RequestRFAObj:this.ApprovalCreateOutput
    } 
    this.http.post(URLConstant.SubmitMouReviewNew, submitMouReviewObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,["/Mou/Cust/ReviewPaging"],{});
      })
    }
  }

  Return() {
    var mouObj = { MouCustId: this.MouCustId, WfTaskListId: this.WfTaskListId }
    this.http.post(URLConstant.ReturnMouReview, mouObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,["/Mou/Cust/ReviewPaging"],{});
      })
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }

  initInputApprovalObj(){  
    this.InputObj = new UcInputRFAObj();
    var Attributes = []
    var attribute1= { 
      "AttributeName" : "Approval Amount",
      "AttributeValue": this.PlafondAmt
    };
     var attribute2= {
      "AttributeName" : "Scoring",
      "AttributeValue": this.ScoreResult
    }; 
    Attributes.push(attribute1);
    Attributes.push(attribute2); 
    
    var TypeCode = {
      "TypeCode": "MOUC_FCTR_APV_TYPE",
      "Attributes": Attributes,
    };
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.EnvUrl = environment.FoundationR3Url;
    this.InputObj.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
    this.InputObj.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
    this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
    this.InputObj.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
    this.InputObj.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
    this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
    this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_MOU_APV_FACTORING;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_MOU_APV_FACTORING;
    this.InputObj.Reason = this.listReason;
    this.InputObj.TrxNo = this.resultData["MouCustNo"]
    this.IsReady = true;
  }

}
