import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { HttpClient } from '@angular/common/http';
import { ApplicationRef, Component, OnInit, Input  } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCrdRvwDObj } from 'app/shared/model/app-crd-rvw-d-obj.model';
import { AppCrdRvwHObj } from 'app/shared/model/app-crd-rvw-h-obj.model';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';
import { DeviationResultObj } from 'app/shared/model/deviation-result-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { ScoringResultHObj } from 'app/shared/model/scoring-result-h-obj.model';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { TypeResultObj } from 'app/shared/model/type-result/type-result-obj.model';
import { ResultAttrObj } from 'app/shared/model/type-result/result-attr-obj.model';
import { CrdRvwAppObj } from 'app/shared/model/credit-review/crd-rvw-app-obj.model';

@Component({
  selector: 'app-credit-review-cr-detail-history',
  templateUrl: './credit-review-cr-detail-history.component.html'
})
export class CreditReviewCrDetailHistoryComponent implements OnInit {

  @Input() appId: number;
  isReturnOn: boolean = false;
  UserAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  Arr: FormArray;
  BizTemplateCode: string = "";
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: boolean = false;
  IsViewReady: boolean = false;
  RFAInfo: Object = new Object();
  apvSchmCode: string = "";
  OriOfficeCode: string;

  readonly apvBaseUrl = environment.ApprovalR3Url;

  readonly CustTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly CustTypeCompany: string = CommonConstant.CustTypeCompany;

  readonly CaptureStatReq: string = CommonConstant.CaptureStatReq;
  readonly CaptureStatScs: string = CommonConstant.CaptureStatScs;
  readonly CaptureStatFail: string = CommonConstant.CaptureStatFail;

  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;
  FormObj = this.fb.group({
    arr: this.fb.array([]),
    AppvAmt: [''],
    CreditScoring: ['']
  });

  FormReturnObj = this.fb.group({
    Reason: [''],
    Notes: ['']
  });

  crdRvwAppObj: CrdRvwAppObj = new CrdRvwAppObj();
  constructor(
    private route: ActivatedRoute,
    private ref: ApplicationRef,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    public toastr: ToastrService,
    private cookieService: CookieService
  ) {

  }

  readonly bizCfna: string = CommonConstant.CFNA;
  initData() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;
    this.Arr = this.FormObj.get('arr') as FormArray;
  }

  async ngOnInit() {
    this.initData();
    await this.GetAppNo();
    await this.GetApvSchemeFromRefProdCompnt();
    await this.GetListDeviation();
    await this.BindDDLRecommendation();
    await this.BindDDLReasonReturn();
    await this.BindCreditAnalysisItemFormObj();
    await this.BindAppvAmt();
    await this.GetExistingCreditReviewData();
    await this.GetCrdRvwCustInfoByAppId();
    this.initInputApprovalObj();
  }

  getCrdRvwAppObj(ev: CrdRvwAppObj) {
    this.crdRvwAppObj = ev;
  }

  responseListTypeCodes: Array<TypeResultObj> = new Array();
  async GetListDeviation() {
    await this.http.post(URLConstant.GetListDeviationTypeByAppNo, { TrxNo: this.appNo }).toPromise().then(
      (response) => {
        this.responseListTypeCodes = response['ApvTypecodes'];
      });
  }
  //#region Get Local Data
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

  onChangeApprover(ev) {
    this.FormObj.patchValue({
      ApproverDesc: ev.target.selectedOptions[0].text
    });
  }

  onChangeReason(ev) {
    this.FormObj.patchValue({
      ReasonDesc: ev.target.selectedOptions[0].text
    });
  }
  //#endregion

  //#region GET Approval Scheme Code
  prodOfferingCode: string = "";
  prodOfferingVersion: string = "";
  async GetApvSchemeFromRefProdCompnt() {
    let obj = {
      prodOfferingCode: this.prodOfferingCode,
      prodOfferingVersion: this.prodOfferingVersion,
      refProdCompntCode: CommonConstant.REF_PROD_COMPNT_CODE_CRD_APV
    };
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).toPromise().then(
      response => {
        if(response != undefined){
          this.apvSchmCode = response["CompntValue"];
        }
      }
    );
  }
  //#endregion

  //#region Get API Data
  appNo: string = "";
  async GetAppNo() {
    let obj = { Id: this.appId };
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

  //#region DDL Data
  DDLData: { [id: string]: Array<KeyValueObj> } = {};
  readonly DDLRecomendation: string = CommonConstant.RefReasonTypeCodeCrdReview;
  async BindDDLRecommendation() {
    let Obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLRecomendation] = response[CommonConstant.ReturnObj];
      });
  }

  readonly DDLReason: string = CommonConstant.RefReasonTypeCodeReturnHandlingGeneral;
  async BindDDLReasonReturn() {
    let obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeReturnHandlingGeneral };
    await this.http.post(URLConstant.GetListActiveRefReason, obj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLReason] = response[CommonConstant.ReturnObj];
      });
  }
  //#endregion

  ResponseExistCreditReview;
  async GetExistingCreditReviewData() {
    let Obj = { Id: this.appId };
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

  async BindAppvAmt() {
    await this.http.post(URLConstant.GetApvAmountForCrdRvwByAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.FormObj.patchValue({
          AppvAmt: response["Result"]
        });
        this.PlafondAmt = response["Result"];
      });
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

  crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  isShow: boolean = false;
  captureStat: string = "";
  async GetCrdRvwCustInfoByAppId() {
    await this.http.post<CrdRvwCustInfoObj>(URLConstant.GetCrdRvwCustInfoByAppId, { Id: this.appId }).toPromise().then(
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
  //#endregion

  PlafondAmt: number = 0;
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
}
