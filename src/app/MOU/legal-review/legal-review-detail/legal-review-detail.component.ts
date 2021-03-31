import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MouCustLglReviewObj } from 'app/shared/model/MouCustLglReviewObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustTcComponent } from 'app/MOU/mou-customer-request/mou-cust-tc/mou-cust-tc.component';
import { environment } from 'environments/environment';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResponseSysConfigResultObj } from 'app/shared/model/Response/ResponseSysConfigResultObj.Model';
import { promise } from 'selenium-webdriver';

@Component({
  selector: 'app-legal-review-detail',
  templateUrl: './legal-review-detail.component.html',
  providers: [NGXToastrService]
})
export class LegalReviewDetailComponent implements OnInit {

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
  SysConfigResultObj : ResponseSysConfigResultObj = new ResponseSysConfigResultObj();
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
    await this.http.post<ResponseSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
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
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_LEGAL_RVW_PAGING],{});

        });
      this.mouTc.Save();
    }
  }
}
