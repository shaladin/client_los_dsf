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
import { ReqProdOfferingDeactivationObj } from 'app/shared/model/Request/Product/ReqProdOfferingDeactivationObj.model';
import { GenericKeyValueListObj } from 'app/shared/model/Generic/GenericKeyValueListObj.model';
import { ResGetListProdOfferingBranchMbrObj, ResProdOfferingBranchOfficeMbrObj } from 'app/shared/model/Response/Product/ResGetProdOfferingBranchMbrObj.model';
import { environment } from 'environments/environment';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-prod-offering-deact-detail',
  templateUrl: './prod-offering-deact-detail.component.html'
})
export class ProdOfferingDeactDetailComponent implements OnInit {
  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) { 
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }

  prodOfferingHId: number;
  resultData: any;
  allRefReasonMethod: any;
  prodOfferingId: number;
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: boolean;
  ApprovalCreateOutput: any;
  GenericByIdObj: GenericObj = new GenericObj();
  OfficeList: Array<ResProdOfferingBranchOfficeMbrObj> = new Array<ResProdOfferingBranchOfficeMbrObj>();
  ProdOfferingHDeactObj: ReqProdOfferingDeactivationObj = new ReqProdOfferingDeactivationObj();
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
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

    this.GenericByIdObj.Id = this.prodOfferingHId;
    this.http.post<ResGetListProdOfferingBranchMbrObj>(URLConstant.GetListProdOfferingBranchOfficeMbrByProdHIdAndApp, this.GenericByIdObj).subscribe(
      response => {
        if (response.ReturnObject.length > 0) {
          this.OfficeList = response.ReturnObject;
        }
      }
    );
    this.initInputApprovalObj();
  }

  initInputApprovalObj() {
    var Attributes = [{}]
    var TypeCode = {
      "TypeCode": CommonConstant.PRD_OFR_DEACT_APV_TYPE,
      "Attributes": Attributes,
    };
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRD_OFR_DEACT_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_OFR_DEACT_SCHM;
    this.InputObj.Reason = this.allRefReasonMethod;

    this.GenericByIdObj.Id = this.prodOfferingId;
    this.http.post(URLConstant.GetProdOfferingByProdOfferingId, this.GenericByIdObj).subscribe(
      (response : GenericObj) => {
        this.InputObj.TrxNo = response.Code;
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output();
    this.ProdOfferingHDeactObj = this.ProdOfferingHDeactForm.value;
    this.ProdOfferingHDeactObj.EffectiveDate = this.ProdOfferingHDeactForm.controls.EffectiveDate.value;
    this.ProdOfferingHDeactObj.Reason = this.ApprovalCreateOutput.ReasonCode;
    this.ProdOfferingHDeactObj.Notes = this.ApprovalCreateOutput.Notes;
    this.ProdOfferingHDeactObj.ProdOfferingHId = this.prodOfferingHId;
    this.ProdOfferingHDeactObj.RequestRFAObj = this.ApprovalCreateOutput;
    this.http.post(URLConstant.RequestOfferingDeactivation, this.ProdOfferingHDeactObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_OFFERING_DEACTIVATE], {});
      }
    );

  }
}
