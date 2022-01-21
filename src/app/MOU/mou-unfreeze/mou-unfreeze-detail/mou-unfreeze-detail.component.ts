import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { ExceptionConstant } from "app/shared/constant/ExceptionConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { MouCustObj } from "app/shared/model/mou-cust-obj.model";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { RFAInfoObj } from "app/shared/model/approval/rfa-info-obj.model";
import { MouFreezeTrxObj } from "app/shared/model/mou-freeze-trx-obj.model";
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { environment } from 'environments/environment';
import { UcInputRFAObj } from "app/shared/model/uc-input-rfa-obj.model";
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CookieService } from "ngx-cookie";
import { KeyValueObj } from "app/shared/model/key-value/key-value-obj.model";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { AdInsHelperService } from "app/shared/services/AdInsHelper.service";

@Component({
  selector: "app-mou-unfreeze-detail",
  templateUrl: "./mou-unfreeze-detail.component.html",
})
export class MouUnfreezeDetailComponent implements OnInit {
  MouCustId: number;
  mode: string;
  businessDt: Date;
  FreezeUnfreezeForm: FormGroup;
  cbIsFreeze: boolean;
  result: MouCustObj;
  IsFreezeOld: boolean;
  listReason: Array<KeyValueObj>;
  rfaInfoObj: RFAInfoObj = new RFAInfoObj();
  mouFreezeTrxObj: MouFreezeTrxObj = new MouFreezeTrxObj();
  ReqByUserId: String;
  OriOfficeCode: string;
  selected: String;
  selectedReasonCode: String;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  RFAInfo: any;
  InputObj: UcInputRFAObj;
  IsReady: Boolean = false;
  MouTypeCode:string ="";

  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private cookieService: CookieService,
    private adInsHelperService: AdInsHelperService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params["MouCustId"] != 0) {
        this.MouCustId = params["MouCustId"];
      }
      if (params["mode"] != null) {
        this.mode = params["mode"];
      }
    });
  }

  async ngOnInit() {
    this.FreezeUnfreezeForm = this.fb.group({
      MouCustId: [""],
      IsFreeze: false,
    });
    this.viewGenericObj.viewInput =
      "./assets/ucviewgeneric/viewMouHeader.json";
    await this.getApv();

    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
    this.ReqByUserId = currentUserContext[CommonConstant.USER_NAME];
    await this.http
      .post(URLConstant.GetMouCustById, { Id: this.MouCustId })
      .toPromise().then((response: MouCustObj) => {
        this.result = response;
        this.FreezeUnfreezeForm.patchValue({
          IsFreeze: this.result.IsFreeze,
          MouCustId: this.MouCustId,
        });
        this.IsFreezeOld = this.result.IsFreeze;
        this.MouTypeCode = this.result.MrMouTypeCode;
        this.OriOfficeCode = this.result.OriOfficeCode;
      });
    this.initInputApprovalObj();
  }

  async getApv() {

    await this.http.post(URLConstant.GetListActiveRefReason, {
      RefReasonTypeCode: CommonConstant.RefMasterTypeCodeMOUFreezeUnfreeze,
    }).toPromise().then((response) => {
      this.listReason = response[CommonConstant.ReturnObj];

    });
  }

  SaveForm() {

    if (this.IsFreezeOld == this.FreezeUnfreezeForm.controls['IsFreeze'].value) {
      this.toastr.warningMessage(ExceptionConstant.NO_DATA_EDITED);
      return;
    }

    this.RFAInfo = { RFAInfo: this.FreezeUnfreezeForm.controls.RFAInfo.value };


    if (this.RFAInfo != undefined) {

      var ReqValue = this.FreezeUnfreezeForm.value;
      this.mouFreezeTrxObj.MouCustId = ReqValue.MouCustId;
      this.mouFreezeTrxObj.IsFreeze = ReqValue.IsFreeze;
      this.mouFreezeTrxObj.Status = CommonConstant.MOU_FRZ_REQ;
      this.mouFreezeTrxObj.ReqByRefUserCode = this.ReqByUserId;
      this.mouFreezeTrxObj.ReqDt = this.businessDt;
      this.mouFreezeTrxObj.Notes = ReqValue.Notes;
      this.mouFreezeTrxObj.RefReasonCode = this.RFAInfo.RFAInfo.ReasonCode;
      var sendObj = {
        RequestMouFreezeTrxObj: this.mouFreezeTrxObj,
        OfficeCode: this.OriOfficeCode,
        RequestRFAObj: this.RFAInfo
      };

      let SubmitMouFreezeUnfreezeUrl = environment.isCore ? URLConstant.SubmitMouFreezeUnfreezeV2 : URLConstant.SubmitMouFreezeUnfreeze;
      this.http
        .post(SubmitMouFreezeUnfreezeUrl, sendObj)
        .subscribe((response) => {
          this.toastr.successMessage(response["message"]);
          this.router.navigate([NavigationConstant.MOU_FREEZE_PAGING]);
        });
    }
  }
  initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj(this.cookieService);
    let Attributes = [{}]
    let TypeCode = {
      "TypeCode": CommonConstant.APV_TYPE_MOU_FRZ_UNFRZ_APV_TYPE,
      "Attributes": Attributes,
    }
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = this.OriOfficeCode;
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_MOU_FREEZE_UNFREEZE;
    this.InputObj.Reason = this.listReason;
    this.InputObj.TrxNo = " ";

    if(this.MouTypeCode == CommonConstant.MOU_TYPE_FACTORING)
    {
      this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_MOU_FRZ_UNFRZ_FCTR;
    }
    else if (this.MouTypeCode == CommonConstant.MOU_TYPE_DLFN)
    {
      this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_MOU_FRZ_UNFRZ_DLFN;
    }
    else{
      this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_MOU_FRZ_UNFRZ;
    }

    this.IsReady = true;
  }
  IsFreezeChange() { }


  GetCallback(ev) {
    if (ev.Key == "customer") {
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: ev.ViewObj.CustNo }).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }

}
