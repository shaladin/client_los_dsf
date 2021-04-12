import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from '../../../../../environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqProdOfferingHDeactivationObj } from 'app/shared/model/Request/Product/ReqProdOfferingDeactivationObj.model';
import { GenericKeyValueListObj } from 'app/shared/model/Generic/GenericKeyValueListObj.model';
import { ResGetListProdOfferingBranchMbrObj, ResProdOfferingBranchOfficeMbrObj } from 'app/shared/model/Response/Product/ResGetProdOfferingBranchMbrObj.model';

@Component({
  selector: 'app-prod-offering-deact-detail',
  templateUrl: './prod-offering-deact-detail.component.html'
})
export class ProdOfferingDeactDetailComponent implements OnInit {
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) { 
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }

  prodOfferingHId: number;
  prodOfferingHDeactivateObj: any;
  resultData: any;
  allRefReasonMethod: any;
  OfficeList: Array<ResProdOfferingBranchOfficeMbrObj> = new Array<ResProdOfferingBranchOfficeMbrObj>();
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  prodOfferingId: number;
  InputObj: UcInputRFAObj;
  IsReady: boolean;
  private createComponent: UcapprovalcreateComponent;
  ApprovalCreateOutput: any;

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
      if (params["prodOfferingHId"] != null) {
        this.prodOfferingHId = params["prodOfferingHId"];
      }
      if (params["prodOfferingId"] != null) {
        this.prodOfferingId = params["prodOfferingId"];
      }
    });
  }

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductOfferingMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;

    var obj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeProdDeactivate };
    await this.http.post(URLConstant.GetListActiveRefReason, obj).toPromise().then(
      (response : GenericKeyValueListObj) => {
        if (response.ReturnObject.length > 0) {
          this.allRefReasonMethod = response.ReturnObject;
          this.ProdOfferingHDeactForm.patchValue({ Reason: response.ReturnObject[0]['Key'] });
        }
      });

    this.http.post<ResGetListProdOfferingBranchMbrObj>(URLConstant.GetListProdOfferingBranchOfficeMbrByProdHIdAndApp, {Id: this.prodOfferingHId}).subscribe(
      response => {
        if (response.ReturnObject.length > 0) {
          this.OfficeList = response.ReturnObject;
        }
      }
    );
    this.initInputApprovalObj();
  }

  initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj();

    var Attributes = [{}]
    var TypeCode = {
      "TypeCode": CommonConstant.PRD_OFR_DEACT_APV_TYPE,
      "Attributes": Attributes,
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
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRD_OFR_DEACT_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_OFR_DEACT_SCHM;
    this.InputObj.Reason = this.allRefReasonMethod;

    this.http.post(URLConstant.GetProdOfferingByProdOfferingId, {Id : this.prodOfferingId}).subscribe(
      (response) => {
        this.InputObj.TrxNo = response["ProdOfferingCode"];
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output();
    this.prodOfferingHDeactivateObj = new ReqProdOfferingHDeactivationObj();
    this.prodOfferingHDeactivateObj = this.ProdOfferingHDeactForm.value;
    this.prodOfferingHDeactivateObj.EffectiveDate = this.ProdOfferingHDeactForm.controls.EffectiveDate.value;
    this.prodOfferingHDeactivateObj.Reason = this.ApprovalCreateOutput.ReasonCode;
    this.prodOfferingHDeactivateObj.Notes = this.ApprovalCreateOutput.Notes;
    this.prodOfferingHDeactivateObj.ProdOfferingHId = this.prodOfferingHId;
    this.prodOfferingHDeactivateObj.RowVersion = "";
    this.prodOfferingHDeactivateObj.RequestRFAObj = this.ApprovalCreateOutput;
    this.http.post(URLConstant.RequestOfferingDeactivationNew, this.prodOfferingHDeactivateObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_OFFERING_DEACTIVATE], {});
      }
    );

  }
}
