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
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';

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
  ProdOfferVer: any;
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
    this.http.post(URLConstant.RequestDeactivation, this.ReqProdDeactObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_DEACTIVATE],{ });
      }
    );
  }
}
