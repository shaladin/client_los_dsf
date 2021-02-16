import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { RFAInfoObj } from 'app/shared/model/Approval/RFAInfoObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { first } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';


@Component({
  selector: 'app-mou-review-general',
  templateUrl: './mou-review-general.component.html',
  providers: [NGXToastrService]
})
export class MouReviewGeneralComponent implements OnInit {
  rfaInfoObj: RFAInfoObj = new RFAInfoObj();
  mouCustObj: MouCustObj = new MouCustObj();
  keyValueObj: KeyValueObj;
  MouCustId: number;
  WfTaskListId: any;
  MouType: string = CommonConstant.GENERAL;
  PlafondAmt: number;
  listApprover: any;
  listRecommendationObj: any;
  MrCustTypeCode: any;
  link: any;
  resultData: any;
  mouCustObject: MouCustObj = new MouCustObj();
  listReason: any;
  ScoreResult: number;
  InputObj: UcInputRFAObj;
  IsReady: boolean;
  ApprovalCreateOutput: any;
  UploadViewlink: string;
  Uploadlink: string;
  Viewlink: string;
  dmsObj: DMSObj;

  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) { 
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  MouReviewDataForm = this.fb.group({
    ListApprover: [''],
    Reason: [''],
    Notes: [''],
    ApvRecommendation: this.fb.array([])
  })

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
    this.mouCustObject.MouCustId = this.MouCustId;    
    await this.http.post(URLConstant.GetMouCustById, this.mouCustObject).toPromise().then(
      (response: MouCustObj) => {
        this.resultData = response;
        let currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
        this.dmsObj = new DMSObj();
        this.dmsObj.User = currentUserContext.UserName;
        this.dmsObj.Role = currentUserContext.RoleCode;
        this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['CustNo']));
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.resultData.MouCustNo));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
  
      }
    );

    var apvObj = { SchemeCode: 'MOUC_GEN_APV' }
    this.http.post(URLConstant.GetApprovedBy, apvObj).subscribe(
      (response) => {
        this.listApprover = response;

        this.MouReviewDataForm.patchValue({
          ListApprover: this.listApprover[0].Key,
        })
      })

    // var listRec = this.MouReviewDataForm.get("ApvRecommendation") as FormArray;
    // var apvRecommendObj = { SchemeCode: 'MOUC_GEN_APV' }
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

    await this.http.post(URLConstant.GetListActiveRefReason, { RefReasonTypeCode: CommonConstant.REF_REASON_MOU_GENERAL }).toPromise().then(
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
      "TypeCode": "MOUC_GEN_APV_TYPE",
      "Attributes": Attributes,
    };
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.EnvUrl = environment.FoundationR3Url;
    this.InputObj.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
    this.InputObj.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
    this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
    this.InputObj.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
    this.InputObj.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
    this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
    this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_MOU_APV_GENERAL;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_MOU_APV_GENERAL;
    this.InputObj.Reason = this.listReason;
    this.InputObj.TrxNo = this.resultData["MouCustNo"]
    this.IsReady = true;
  }
}
