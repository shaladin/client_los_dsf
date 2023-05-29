import { KeyValueObj } from '@adins/uc-attribute/lib/model/key-value-obj.model';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { CrdRvwAppObj } from 'app/shared/model/credit-review/crd-rvw-app-obj.model';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { DeviationResultObj } from 'app/shared/model/deviation-result-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { ScoringResultHObj } from 'app/shared/model/scoring-result-h-obj.model';
import { ResultAttrObj } from 'app/shared/model/type-result/result-attr-obj.model';
import { TypeResultObj } from 'app/shared/model/type-result/type-result-obj.model';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-crd-rvw-view',
  templateUrl: './crd-rvw-view.component.html'
})
export class CrdRvwViewComponent implements OnInit {
  AppId: number = 0;
  BizTemplateCode: string = "";

  readonly CustTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly CustTypeCompany: string = CommonConstant.CustTypeCompany;
  isReturnOn: boolean = false;
  
  crdRvwAppObj: CrdRvwAppObj = new CrdRvwAppObj();
  IsViewReady: boolean = true;

  prodOfferingCode: string = "";
  prodOfferingVersion: string = "";
  OriOfficeCode: string;

  custNo: string;
  dmsObj: DMSObj;
  isDmsReady: boolean = false;
  usingDmsAdins: string;

  IsReady: boolean = false;
  IsView: boolean = false;

  Arr: FormArray;
  FormObj = this.fb.group({
    arr: this.fb.array([]),
    AppvAmt: [''],
    CreditScoring: ['']
  });
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cookieService: CookieService,
    private ref: ApplicationRef,
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
      if (params["IsView"] != null) {
        this.IsView = params["IsView"];
      }
    });
  }

  async ngOnInit() {
    this.initData();
    await this.GetAppNo();
    await this.GetCrdRvwCustInfoByAppId();
    await this.InitDms();
    await this.BindCreditAnalysisItemFormObj();
    await this.GetExistingCreditReviewData();
    this.initInputApprovalObj();
  }

  initData() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;
    this.Arr = this.FormObj.get('arr') as FormArray;
  }

  crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  isShow: boolean = false;
  captureStat: string = "";
  async GetCrdRvwCustInfoByAppId() {
    await this.http.post<CrdRvwCustInfoObj>(URLConstant.GetCrdRvwCustInfoByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.crdRvwCustInfoObj = response;
        this.isShow = true;
      }
    );

    let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCaptureStat,
      MasterCode: this.crdRvwCustInfoObj.CaptureStat
    };
    await this.http.post<KeyValueObj>(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
      (response) => {
        this.captureStat = response.Value;
      }
    );
  }

  getCrdRvwAppObj(ev: CrdRvwAppObj) {
    this.crdRvwAppObj = ev;
  }

  appNo: string = "";
  async GetAppNo() {
    let obj = { Id: this.AppId };
    await this.http.post<NapAppModel>(URLConstant.GetAppById, obj).toPromise().then(
      async (response) => {
        if (response != undefined) {
          this.appNo = response.AppNo;
          this.prodOfferingCode = response.ProdOfferingCode;
          this.prodOfferingVersion = response.ProdOfferingVersion;
          this.OriOfficeCode = response.OriOfficeCode;
          await this.GetCreditScoring(response.AppNo);
        }
      });
  }

  async GetCreditScoring(appNo: string) {
    let obj = { ScoringResultH: { TrxNo: appNo } };
    await this.http.post(URLConstant.GetLatestScoringResultHByTrxSourceNo, obj).toPromise().then(
      (response) => {
        if (response["ScoringResultHObj"] != null) {
          let ScoringResult: ScoringResultHObj = response["ScoringResultHObj"];
          this.FormObj.patchValue({
            CreditScoring: ScoringResult.ScoringValue
          });
        } else {
          this.FormObj.patchValue({
            CreditScoring: "-"
          });
        }
      });
  }

  async InitDms() {
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.SYS_CONFIG_USING_DMS_ADINS }).toPromise().then(
      (response) => {
        this.usingDmsAdins = response["ConfigValue"];
      },
      (error) => {
        this.isDmsReady = false;
      }
    );

    if (this.usingDmsAdins == '1') {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
    
      this.dmsObj.ViewCode = "APP";
      this.dmsObj.UsingDmsAdIns = this.usingDmsAdins;
      this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideViewDownload));

      let reqAppId = { Id: this.AppId };
      this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsOfficeCode, this.OriOfficeCode));
      this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
      this.http.post(URLConstant.GetAppCustByAppId, reqAppId).subscribe(
        (response) => {
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response['CustNo']));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsCustName, response['CustName']));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsDealerName, "DEALER"));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsExpiredDate, formatDate(new Date(), 'dd/MM/yyyy', 'en-US').toString()));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsTimestamp, formatDate(new Date(), 'MM/dd/yyyy HH:mm:ss', 'en-US').toString()));

          this.isDmsReady = true;
        }
      );
    }
    else if (this.usingDmsAdins == '2') {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
      var appObj = { Id: this.AppId };
      
      await this.http.post(URLConstant.GetAppCustByAppId, appObj).subscribe(
        (response: AppCustObj) => {
          this.custNo = response.CustNo;

          if (this.custNo != null && this.custNo != '') {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
          }
          else {
            this.dmsObj.MetadataParent = null;
          }
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideViewDownload));
          
          this.isDmsReady = true;
        }
      );
    }
    else {
      this.isDmsReady = false;
    }
  }

  ManualDeviationData: Array<DeviationResultObj> = new Array<DeviationResultObj>();
  BindManualDeviationData(ev) {
    this.IsReady = false;
    this.ref.tick();
    this.ManualDeviationData = ev;
    let manualDevList = []
    if (this.ManualDeviationData.length > 0) {
      for (let i = 0; i < this.ManualDeviationData.length; i++) {

        var Attributes = []
        var attribute1 = {
          "AttributeName": "APPROVAL AT",
          "AttributeValue": this.ManualDeviationData[this.ManualDeviationData.length - 1].ApvAt
        };
        Attributes.push(attribute1);

        let TypeCode = {
          "TypeCode": this.ManualDeviationData[this.ManualDeviationData.length - 1].MrDeviationType,
          "Attributes": Attributes,
        };

        manualDevList.push(TypeCode);
      }
    }
    this.initInputApprovalObj(manualDevList);
  }

  responseListTypeCodes: Array<TypeResultObj> = new Array();
  async GetListDeviation() {
    await this.http.post(URLConstant.GetListDeviationTypeByAppNo, { TrxNo: this.appNo }).toPromise().then(
      (response) => {
        this.responseListTypeCodes = response['ApvTypecodes'];
      });
  }

  PlafondAmt: number = 0;
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  apvSchmCode: string = "";
  UserAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  DDLData: { [id: string]: Array<KeyValueObj> } = {};

  readonly DDLRecomendation: string = CommonConstant.RefReasonTypeCodeCrdReview;
  async BindDDLRecommendation() {
    let Obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLRecomendation] = response[CommonConstant.ReturnObj];
      });
  }
  
  initInputApprovalObj(manualDevList = null) {
    var Attributes: Array<ResultAttrObj> = new Array();
    var attribute1: ResultAttrObj = {
      AttributeName: "Approval Amount",
      AttributeValue: this.PlafondAmt.toString()
    };
    Attributes.push(attribute1);

    var listTypeCode: Array<TypeResultObj> = new Array();
    var TypeCode: TypeResultObj = {
      TypeCode: "CRD_APV_CF_TYPE",
      Attributes: Attributes,
    };
    listTypeCode.push(TypeCode);

    if (this.responseListTypeCodes.length > 0) {
      listTypeCode = listTypeCode.concat(this.responseListTypeCodes);
    }
    if (manualDevList != null) {
      listTypeCode = listTypeCode.concat(manualDevList);
    }
    this.InputObj.ApvTypecodes = listTypeCode;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_CRD_APV;
    this.InputObj.SchemeCode = this.apvSchmCode;
    this.InputObj.Reason = this.DDLData[this.DDLRecomendation];
    this.InputObj.TrxNo = this.appNo;
    this.InputObj.RequestedBy = this.UserAccess.UserName;
    this.InputObj.OfficeCode = this.OriOfficeCode;
    this.InputObj.OfficeCodes.push(this.OriOfficeCode);
    this.IsReady = true;
  }

  async BindCreditAnalysisItemFormObj() {
    let refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCrdRvwAnalysisItem };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        let temp = response[CommonConstant.ReturnObj];
        for (let i = 0; i < temp.length; i++) {
          let NewDataForm = this.fb.group({
            QuestionCode: temp[i].Key,
            Question: temp[i].Value,
            Answer: ["", Validators.required]
          }) as FormGroup;
          this.Arr.push(NewDataForm);
        }
      });
  }

  ResponseExistCreditReview;
  async GetExistingCreditReviewData() {
    let Obj = { Id: this.AppId };
    await this.http.post(URLConstant.GetAppCrdRvwById, Obj).toPromise().then(
      (response) => {
        this.ResponseExistCreditReview = response["appCrdRvwHObj"];
        if (this.ResponseExistCreditReview.appCrdRvwDObjs != null) {
          for (let i = 0; i < this.ResponseExistCreditReview.appCrdRvwDObjs.length; i++) {
            let idx = this.Arr.value.indexOf(this.Arr.value.find(x => x.QuestionCode == this.ResponseExistCreditReview.appCrdRvwDObjs[i].MrAnalysisItemCode));
            this.Arr.controls[idx].patchValue({
              Answer: this.ResponseExistCreditReview.appCrdRvwDObjs[i].AnalysisResult
            });
          }
        }
      });
  }
}
