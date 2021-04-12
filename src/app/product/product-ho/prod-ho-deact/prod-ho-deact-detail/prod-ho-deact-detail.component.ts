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
import { ReqProdDeactObj } from 'app/shared/model/Request/Product/ReqProdDeactObj.model';
import { environment } from 'environments/environment';
import { ReqProdOffVersionObj } from 'app/shared/model/Request/Product/ReqGetProdOfferingObj.model';
import { ResGetProductHObj } from 'app/shared/model/Response/Product/ResGetProdObj.model';
import { GenericKeyValueListObj } from 'app/shared/model/Generic/GenericKeyValueListObj.model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ResProdOffVersionObj } from 'app/shared/model/Response/Product/ResProdOfferingObj.model';

@Component({
  selector: 'app-prod-ho-deact-detail',
  templateUrl: './prod-ho-deact-detail.component.html'
})
export class ProdHoDeactDetailComponent implements OnInit {

  prodId: number;
  prodHId: number;
  prodHDeactivateObj: ReqProdDeactObj;
  ReqProdOffVersionObj: ReqProdOffVersionObj;
  allRefReasonMethod: Array<KeyValueObj>;
  ProdOfferVer: any;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  InputObj: UcInputRFAObj;
  IsReady: boolean;
  ProdHDeactForm = this.fb.group({
    EffectiveDate: ['', Validators.required]
  });
  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) { 
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
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

    this.ReqProdOffVersionObj = new ReqProdOffVersionObj();
    this.ReqProdOffVersionObj.ProdId = this.prodId;
    this.ReqProdOffVersionObj.ProdOfferingStat = 'ACT';
    this.http.post<ResProdOffVersionObj>(URLConstant.GetListProdOfferingVersionByProdId, this.ReqProdOffVersionObj).subscribe(
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
      (response: ResGetProductHObj) => {
        this.InputObj.TrxNo = response.ProdCode;
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output(); 
    this.prodHDeactivateObj = new ReqProdDeactObj();
    this.prodHDeactivateObj.EffectiveDate = this.ProdHDeactForm.controls.EffectiveDate.value;
    this.prodHDeactivateObj.Reason = this.ApprovalCreateOutput.ReasonCode;
    this.prodHDeactivateObj.Notes = this.ApprovalCreateOutput.Notes;
    this.prodHDeactivateObj.ProdHId = this.prodHId;
    this.prodHDeactivateObj.RequestRFAObj = this.ApprovalCreateOutput;
    this.http.post(URLConstant.RequestDeactivationNew, this.prodHDeactivateObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_DEACTIVATE],{ });
      }
    );
  }
}
