import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from '../../../../environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/Ucapprovalcreate';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ProdHDeactivateObj } from 'app/shared/model/Request/Product/ProdHDeactivateObj.model';
import { ProdOfferingVersionObj } from 'app/shared/model/Request/Product/ProdOfferingVersionObj.model';

@Component({
  selector: 'app-prod-ho-deact-detail',
  templateUrl: './prod-ho-deact-detail.component.html'
})
export class ProdHoDeactDetailComponent implements OnInit {

  prodId: number;
  prodHId: number;
  prodHDeactivateObj: ProdHDeactivateObj;
  resultData: any;
  apiUrl: string;
  requestDeactURL: string;
  ProdOfferingObj: any;
  arrCrit: any;
  getValueReasonModel: any;
  allRefReasonMethod: any;
  prodOfferVerUrl: string;
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

    this.requestDeactURL = URLConstant.RequestDeactivationNew;
    this.getValueReasonModel = URLConstant.GetListActiveRefReason;
    this.prodOfferVerUrl = URLConstant.GetListProdOfferingVersionByProdId;

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
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewProductMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.FoundationR3Url;

    var obj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeProdDeactivate };
    await this.http.post(this.getValueReasonModel, obj).toPromise().then(
      (response) => {
        this.allRefReasonMethod = response[CommonConstant.ReturnObj]; 
        if (this.allRefReasonMethod.length > 0) {
          this.ProdHDeactForm.patchValue({ Reason: response[CommonConstant.ReturnObj][0]['Key'] });
        }
      });

    this.ProdOfferingObj = new ProdOfferingVersionObj();
    this.ProdOfferingObj.ProdId = this.prodId;
    this.ProdOfferingObj.ProdOfferingStat = 'ACT';
    this.http.post(this.prodOfferVerUrl, this.ProdOfferingObj).subscribe(
      response => {
        this.ProdOfferVer = response[CommonConstant.ReturnObj];
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
      (response) => {
        this.InputObj.TrxNo = response["ProdCode"];
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output(); 
    this.prodHDeactivateObj = new ProdHDeactivateObj();
    this.prodHDeactivateObj.EffectiveDate = this.ProdHDeactForm.controls.EffectiveDate.value;
    this.prodHDeactivateObj.Reason = this.ApprovalCreateOutput.ReasonCode;
    this.prodHDeactivateObj.Notes = this.ApprovalCreateOutput.Notes;
    this.prodHDeactivateObj.ProdHId = this.prodHId;
    this.prodHDeactivateObj.RowVersion = [];
    this.prodHDeactivateObj.RequestRFAObj = this.ApprovalCreateOutput;
    this.http.post(this.requestDeactURL, this.prodHDeactivateObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_DEACTIVATE],{ });
      }
    );
  }
}
