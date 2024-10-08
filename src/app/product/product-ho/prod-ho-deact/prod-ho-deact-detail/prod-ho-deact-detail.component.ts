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
import { ReqProductDeactivationObj } from 'app/shared/model/request/product/req-product-deactivation-obj.model';
import { environment } from 'environments/environment';
import { ReqProdOfferingVersionObj } from 'app/shared/model/request/product/req-get-prod-offering-obj.model';
import { GenericKeyValueListObj } from 'app/shared/model/generic/generic-key-value-list-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ResProdOfferingVersionObj } from 'app/shared/model/response/product/res-prod-offering-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { ProdOfferingObj } from 'app/shared/model/product/prod-offering-obj.model';

@Component({
  selector: 'app-prod-ho-deact-detail',
  templateUrl: './prod-ho-deact-detail.component.html'
})
export class ProdHoDeactDetailComponent implements OnInit {
  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) { 
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  ProdId: number;
  ProdHId: number;
  ProdOfferVer: Array<ProdOfferingObj>;
  IsReady: boolean;
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  ReqProdDeactObj: ReqProductDeactivationObj = new ReqProductDeactivationObj();
  ReqProdOffVersionObj: ReqProdOfferingVersionObj = new ReqProdOfferingVersionObj();
  AllRefReasonMethod: Array<KeyValueObj> = new Array<KeyValueObj>();
  ViewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  RFAInfo: Object = new Object();

  ProdHDeactForm = this.fb.group({
    EffectiveDate: ['', Validators.required]
  });
  
  ApprovalCreateOutput: any;

  readonly CancelLink: string = NavigationConstant.PRODUCT_HO_DEACTIVATE;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdHId"] != null) {
        this.ProdHId = params["ProdHId"];
      }
      if (params["ProdId"] != null) {
        this.ProdId = params["ProdId"];
      }
    });
  }

  async ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (context[CommonConstant.MR_OFFICE_TYPE_CODE] != CommonConstant.HeadOffice) {
      this.router.navigate([NavigationConstant.PROD_HO_UNAUTHORIZED], { queryParams: {}, skipLocationChange: false });
    }
    
    this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformation.json";

    let tempReq: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeProdDeactivate };
    await this.http.post(URLConstant.GetListActiveRefReason, tempReq).toPromise().then(
      (response : GenericKeyValueListObj) => {
        this.AllRefReasonMethod = response.ReturnObject; 
        if (this.AllRefReasonMethod.length > 0) {
          this.ProdHDeactForm.patchValue({ Reason: this.AllRefReasonMethod[0]['Key'] });
        }
      });

    this.ReqProdOffVersionObj.ProdId = this.ProdId;
    this.ReqProdOffVersionObj.ProdOfferingStat = CommonConstant.PROD_OFF_STAT_ACT;
    this.http.post<ResProdOfferingVersionObj>(URLConstant.GetListProdOfferingVersionByProdId, this.ReqProdOffVersionObj).subscribe(
      response => {
        this.ProdOfferVer = response.ReturnObject;
      }
    );
      this.initInputApprovalObj();
  }

  initInputApprovalObj(){      
    let Attributes = [{}] 
    let TypeCode = {
      "TypeCode" : CommonConstant.PRD_HO_DEACT_APV_TYPE,
      "Attributes" : Attributes,
    };
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRD_HO_DEACT_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_HO_DEACT_SCHM;
    this.InputObj.Reason = this.AllRefReasonMethod;
    
    this.http.post(URLConstant.GetProductById, {Id : this.ProdId}).subscribe(
      (response: GenericObj) => {
        this.InputObj.TrxNo = response.Code;
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.RFAInfo = {RFAInfo: this.ProdHDeactForm.controls.RFAInfo.value};
    this.ReqProdDeactObj.EffectiveDate = this.ProdHDeactForm.controls.EffectiveDate.value;
    this.ReqProdDeactObj.Reason = this.RFAInfo["RFAInfo"].Reason;
    this.ReqProdDeactObj.Notes = this.RFAInfo["RFAInfo"].Notes;
    this.ReqProdDeactObj.ProdHId = this.ProdHId;
    this.ReqProdDeactObj.RequestRFAObj = this.RFAInfo;

    let RequestDeactivationUrl = environment.isCore ? URLConstant.RequestDeactivationV2 : URLConstant.RequestDeactivation;
    this.http.post(RequestDeactivationUrl, this.ReqProdDeactObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_DEACTIVATE],{ });
      }
    );
  }
}
