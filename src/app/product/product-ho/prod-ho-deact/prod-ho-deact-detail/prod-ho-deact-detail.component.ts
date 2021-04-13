import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqProductDeactivationObj } from 'app/shared/model/Request/Product/ReqProductDeactivationObj.model';
import { environment } from 'environments/environment';
import { ReqProdOfferingVersionObj } from 'app/shared/model/Request/Product/ReqGetProdOfferingObj.model';
import { GenericKeyValueListObj } from 'app/shared/model/Generic/GenericKeyValueListObj.model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ResProdOfferingVersionObj } from 'app/shared/model/Response/Product/ResProdOfferingObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

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
  prodId: number;
  prodHId: number;
  ProdOfferVer: any;
  IsReady: boolean;
  InputObj: UcInputRFAObj;
  ReqProdDeactObj: ReqProductDeactivationObj = new ReqProductDeactivationObj();
  ReqProdOffVersionObj: ReqProdOfferingVersionObj = new ReqProdOfferingVersionObj();
  allRefReasonMethod: Array<KeyValueObj> = new Array<KeyValueObj>();
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  ProdHDeactForm = this.fb.group({
    EffectiveDate: ['', Validators.required]
  });
  
  ApprovalCreateOutput: any;

  readonly CancelLink: string = NavigationConstant.PRODUCT_HO_DEACTIVATE;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["prodHId"] != null) {
        this.prodHId = params["prodHId"];
      }
      if (params["prodId"] != null) {
        this.prodId = params["prodId"];
      }
    });
  }

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;

    await this.http.post(URLConstant.GetListActiveRefReason, { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeProdDeactivate }).toPromise().then(
      (response : GenericKeyValueListObj) => {
        this.allRefReasonMethod = response.ReturnObject; 
        if (this.allRefReasonMethod.length > 0) {
          this.ProdHDeactForm.patchValue({ Reason: this.allRefReasonMethod[0]['Key'] });
        }
      });

    this.ReqProdOffVersionObj.ProdId = this.prodId;
    this.ReqProdOffVersionObj.ProdOfferingStat = CommonConstant.PROD_OFF_STAT_ACT;
    this.http.post<ResProdOfferingVersionObj>(URLConstant.GetListProdOfferingVersionByProdId, this.ReqProdOffVersionObj).subscribe(
      response => {
        this.ProdOfferVer = response.ReturnObject;
      }
    );
      this.initInputApprovalObj();

  }
  initInputApprovalObj(){  
    this.InputObj = new UcInputRFAObj();
    
    var Attributes = [{}] 
    var TypeCode = {
      "TypeCode" : CommonConstant.PRD_HO_DEACT_APV_TYPE,
      "Attributes" : Attributes,
    };
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
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
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRD_HO_DEACT_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_HO_DEACT_SCHM;
    this.InputObj.Reason = this.allRefReasonMethod;
    
    this.http.post(URLConstant.GetProductById, {Id : this.prodId}).subscribe(
      (response: GenericObj) => {
        this.InputObj.TrxNo = response.Code;
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output(); 
    this.ReqProdDeactObj.EffectiveDate = this.ProdHDeactForm.controls.EffectiveDate.value;
    this.ReqProdDeactObj.Reason = this.ApprovalCreateOutput.ReasonCode;
    this.ReqProdDeactObj.Notes = this.ApprovalCreateOutput.Notes;
    this.ReqProdDeactObj.ProdHId = this.prodHId;
    this.ReqProdDeactObj.RequestRFAObj = this.ApprovalCreateOutput;
    this.http.post(URLConstant.RequestDeactivationNew, this.ReqProdDeactObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_DEACTIVATE],{ });
      }
    );
  }
}
