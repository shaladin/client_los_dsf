import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustTcComponent } from 'app/MOU/mou-customer-request/mou-cust-tc/mou-cust-tc.component';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { MouCustLglReviewObj } from 'app/shared/model/mou-cust-lgl-review-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { ReqListMouCustLglReviewObj } from 'app/shared/model/request/mou/req-list-mou-cust-lgl-review-obj.model';

@Component({
  selector: 'app-legal-review-detail-x',
  templateUrl: './legal-review-detail-x.component.html',
  providers: [NGXToastrService]
})

export class LegalReviewDetailXComponent implements OnInit {

  MouCustId: number = 0;
  WfTaskListId: any;
  responseRefMasterObj: Array<KeyValueObj>;
  items: FormArray;
  isItemsReady: boolean = false;
  termConditions: FormArray;
  resultData: MouCustObj;
  SysConfigResultObj : ResSysConfigResultObj = new ResSysConfigResultObj();
  LegalForm = this.fb.group(
    {
      items: this.fb.array([]),
      termConditions: this.fb.array([])
    }
  );
  @ViewChild("MouTc") public mouTc: MouCustTcComponent;
  responseMouObj: Array<MouCustLglReviewObj> = new Array<MouCustLglReviewObj>();
  UploadViewlink: string;
  Uploadlink: string;
  Viewlink: string;
  dmsObj: DMSObj;

  readonly CancelLink: string = NavigationConstant.MOU_CUST_LEGAL_RVW_PAGING;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: NGXToastrService, 
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) this.MouCustId = params['MouCustId'];
      if (params['WfTaskListId'] != null) this.WfTaskListId = params['WfTaskListId'];
    });
  }

  async ngOnInit() : Promise<void> {
    this.claimTask();
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });

    this.items = this.LegalForm.get('items') as FormArray;
    this.termConditions = this.LegalForm.get('termConditions') as FormArray;
    this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
      (response: MouCustObj) => {
        this.resultData = response;
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        if(this.SysConfigResultObj.ConfigValue == '1'){
          this.dmsObj = new DMSObj();
          this.dmsObj.User = currentUserContext.UserName;
          this.dmsObj.Role = currentUserContext.RoleCode;
          this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['CustNo']));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.resultData.MouCustNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
        }
      }
    );
    let mouObj = { "Id": this.MouCustId };
    this.http.post(URLConstant.GetMouCustLglReviewByMouCustId, mouObj).subscribe(
      response => {
        this.responseMouObj = response['ReturnObject'];

        let refLglReviewObj: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeLegalReview, MappingCode: null };
        this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refLglReviewObj).subscribe(
          (response) => {
            let lengthDataReturnObj = response[CommonConstant.ReturnObj].length;
            this.responseRefMasterObj = response[CommonConstant.ReturnObj];
            for (let i = 0; i < lengthDataReturnObj; i++) {
              let eachDataDetail = this.fb.group({
                ReviewComponentName: [response[CommonConstant.ReturnObj][i].Value],
                ReviewComponentValue: [response[CommonConstant.ReturnObj][i].Key],
                RowVersion: [this.SearchLegalReview(response[CommonConstant.ReturnObj][i].Key, true)],
                values: [this.SearchLegalReview(response[CommonConstant.ReturnObj][i].Key, false), [Validators.required]]
              }) as FormGroup;
              this.items.push(eachDataDetail);
            }
            this.isItemsReady = true;
          }
        );
      }
    );
  }

  SearchLegalReview(key, isRowVersion) {
    if (this.responseMouObj.length > 0) {
      for (let i = 0; i < this.responseMouObj.length; i++) {
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

  SaveData(formObj: FormGroup, isSubmit: boolean) {
    if (this.LegalForm.valid) {
      let addMouLglRvwUrl = environment.isCore ? URLConstant.AddRangeMouCustLglReviewV2 : URLConstant.AddRangeMouCustLglReview;
      let mouLglRvwObj = new ReqListMouCustLglReviewObj();
      for (let index = 0; index < this.responseRefMasterObj.length; index++) {
        let tempMouObj = {
          MouCustId: this.MouCustId,
          MrLglReviewCode: formObj.value.items[index].ReviewComponentValue,
          LglReviewResult: formObj.value.items[index].values,
          RowVersion: formObj.value.items[index].RowVersion
        }
        mouLglRvwObj.MouCustLglReviewObjs.push(tempMouObj);
      }
      mouLglRvwObj.WfTaskListId = this.WfTaskListId;
      mouLglRvwObj.IsSubmit = isSubmit;
      this.http.post(addMouLglRvwUrl, mouLglRvwObj).subscribe(
        response => {
          this.toastr.successMessage(response['message']);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_LEGAL_RVW_PAGING],{ MrMouTypeCode : this.resultData.MrMouTypeCode});

        });
      this.mouTc.Save();
    }
  }

  claimTask() {
    if(environment.isCore){	
      if(this.WfTaskListId != "" && this.WfTaskListId != undefined){	
        this.claimTaskService.ClaimTaskV2(this.WfTaskListId);	
      }	
    }	
    else if (this.WfTaskListId > 0) {	
        this.claimTaskService.ClaimTask(this.WfTaskListId);	
    }	
  }
}
