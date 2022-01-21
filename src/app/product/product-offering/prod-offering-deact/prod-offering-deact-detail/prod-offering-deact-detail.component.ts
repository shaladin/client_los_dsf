import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqProdOfferingDeactivationObj } from 'app/shared/model/request/product/req-prod-offering-deactivation-obj.model';
import { GenericKeyValueListObj } from 'app/shared/model/generic/generic-key-value-list-obj.model';
import { ResGetListProdOfferingBranchMbrObj, ResProdOfferingBranchOfficeMbrObj } from 'app/shared/model/response/product/res-get-prod-offering-branch-mbr-obj.model';
import { environment } from 'environments/environment';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';

@Component({
  selector: 'app-prod-offering-deact-detail',
  templateUrl: './prod-offering-deact-detail.component.html'
})
export class ProdOfferingDeactDetailComponent implements OnInit {
  private CreateComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) { 
      // initially setter gets called with undefined
      this.CreateComponent = content;
    }
  }

  IsReady: boolean;
  ProdOfferingHId: number;
  ProdOfferingId: number;
  ApprovalCreateOutput: any;
  GenericByIdObj: GenericObj = new GenericObj();
  ViewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  AllRefReasonMethod: Array<KeyValueObj> = new Array<KeyValueObj>();
  OfficeList: Array<ResProdOfferingBranchOfficeMbrObj> = new Array<ResProdOfferingBranchOfficeMbrObj>();
  ProdOfferingHDeactObj: ReqProdOfferingDeactivationObj = new ReqProdOfferingDeactivationObj();
  RFAInfo: Object = new Object();
  readonly CancelLink: string = NavigationConstant.PRODUCT_OFFERING_DEACTIVATE;
  
  ProdOfferingHDeactForm = this.fb.group({
    EffectiveDate: ['', Validators.required]
  });

  constructor(private router: Router, 
              private route: ActivatedRoute, 
              private http: HttpClient, 
              private toastr: NGXToastrService, 
              private fb: FormBuilder, 
              private cookieService: CookieService) {

    this.route.queryParams.subscribe(params => {
      if (params["ProdOfferingHId"] != null) {
        this.ProdOfferingHId = params["ProdOfferingHId"];
      }
      if (params["ProdOfferingId"] != null) {
        this.ProdOfferingId = params["ProdOfferingId"];
      }
    });
  }

  async ngOnInit() {
    this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductOfferingMainInformation.json";

    let obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeProdDeactivate };
    await this.http.post(URLConstant.GetListActiveRefReason, obj).toPromise().then(
      (response : GenericKeyValueListObj) => {
        if (response.ReturnObject.length > 0) {
          this.AllRefReasonMethod = response.ReturnObject;
          this.ProdOfferingHDeactForm.patchValue({ Reason: response.ReturnObject[0]['Key'] });
        }
      });

    this.GenericByIdObj.Id = this.ProdOfferingHId;
    await this.http.post<ResGetListProdOfferingBranchMbrObj>(URLConstant.GetListProdOfferingBranchOfficeMbrByProdHIdAndApp, this.GenericByIdObj).toPromise().then(
      response => {
        if (response.ReturnObject.length > 0) {
          this.OfficeList = response.ReturnObject;
        }
      }
    );
    this.initInputApprovalObj();
  }

  initInputApprovalObj() {
    let Attributes = [{}]
    let TypeCode = {
      "TypeCode": CommonConstant.PRD_OFR_DEACT_APV_TYPE,
      "Attributes": Attributes,
    };
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRD_OFR_DEACT_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_OFR_DEACT_SCHM;
    this.InputObj.Reason = this.AllRefReasonMethod;

    this.GenericByIdObj.Id = this.ProdOfferingId;
    this.http.post(URLConstant.GetProdOfferingByProdOfferingId, this.GenericByIdObj).subscribe(
      (response) => {
        this.InputObj.TrxNo = response["ProdOfferingCode"];
        this.InputObj.OfficeCode = response["OfficeCode"];
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.RFAInfo = {RFAInfo: this.ProdOfferingHDeactForm.controls.RFAInfo.value};
    this.ProdOfferingHDeactObj = this.ProdOfferingHDeactForm.value;
    this.ProdOfferingHDeactObj.EffectiveDate = this.ProdOfferingHDeactForm.controls.EffectiveDate.value;
    this.ProdOfferingHDeactObj.Reason = this.RFAInfo["RFAInfo"].Reason;
    this.ProdOfferingHDeactObj.Notes = this.RFAInfo["RFAInfo"].Notes;
    this.ProdOfferingHDeactObj.ProdOfferingHId = this.ProdOfferingHId;
    this.ProdOfferingHDeactObj.RequestRFAObj = this.RFAInfo;

    let urlPost = environment.isCore? URLConstant.RequestOfferingDeactivationV2 : URLConstant.RequestOfferingDeactivation;
    this.http.post(urlPost, this.ProdOfferingHDeactObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_OFFERING_DEACTIVATE], {});
      }
    );
  }
}
