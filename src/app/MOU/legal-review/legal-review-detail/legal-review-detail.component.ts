import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustTcComponent } from 'app/MOU/mou-customer-request/mou-cust-tc/mou-cust-tc.component';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { ReqListMouCustLglReviewObj } from 'app/shared/model/Request/MOU/ReqListMouCustLglReviewObj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { MouCustLglReviewObj } from 'app/shared/model/MouCustLglReviewObj.Model';

@Component({
  selector: 'app-legal-review-detail',
  templateUrl: './legal-review-detail.component.html',
  providers: [NGXToastrService]
})

export class LegalReviewDetailComponent implements OnInit {

  MouCustId: number;
  WfTaskListId: number;
  responseRefMasterObj: Array<KeyValueObj>;
  items: FormArray;
  isItemsReady: boolean = false;
  termConditions: FormArray;
  mouCustObj: MouCustObj;
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
    private toastr: NGXToastrService, private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) this.MouCustId = params['MouCustId'];
      if (params['WfTaskListId'] != null) this.WfTaskListId = params['WfTaskListId'];
    });
  }

  async ngOnInit() : Promise<void> {
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });

    this.items = this.LegalForm.get('items') as FormArray;
    this.termConditions = this.LegalForm.get('termConditions') as FormArray;
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;    
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
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
        }
      }
    );
    var mouObj = { "Id": this.MouCustId };
    this.http.post(URLConstant.GetMouCustLglReviewByMouCustId, mouObj).subscribe(
      response => {
        this.responseMouObj = response['ReturnObject'];

        var refLglReviewObj: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeLegalReview, MappingCode: null };
        this.http.post(URLConstant.GetListActiveRefMaster, refLglReviewObj).subscribe(
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
            this.isItemsReady = true;
          }
        );
      }
    );
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
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
      var mouObj = new ReqListMouCustLglReviewObj();
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
      this.http.post(URLConstant.AddRangeMouCustLglReview, mouObj).subscribe(
        response => {
          this.toastr.successMessage(response['message']);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_LEGAL_RVW_PAGING],{});

        });
      this.mouTc.Save();
    }
  }
}
