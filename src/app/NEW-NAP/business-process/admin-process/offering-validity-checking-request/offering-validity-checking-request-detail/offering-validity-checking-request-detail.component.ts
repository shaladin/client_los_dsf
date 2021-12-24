import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { FormBuilder } from '@angular/forms';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { TypeResultObj } from 'app/shared/model/type-result/type-result-obj.model';
import { AgrmntObj } from 'app/shared/model/agrmnt/agrmnt.model';
@Component({
  selector: 'app-offering-validity-checking-request-detail',
  templateUrl: './offering-validity-checking-request-detail.component.html'
})
export class OfferingValidityCheckingRequestDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  BizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  ApvReqId: number;
  taskId: string;
  TrxNo: string;
  IsReady: boolean = false;
  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);

  arrValue = [];
  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private toastr: NGXToastrService, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {

      this.TrxNo = params["TrxNo"];
      this.taskId = params["WfTaskListId"];
    });
  }

  FormObj = this.fb.group({});
  async ngOnInit() {
    this.arrValue.push(this.TrxNo);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewOfferingValidityCheckingApproval.json";
    await this.BindDDLReason();
    await this.GetSchemeCode();
  }
  async GetSchemeCode() {
    await this.http.post<AgrmntObj>(URLConstant.GetAgrmntByAgrmntNo, { TrxNo: this.TrxNo }).toPromise().then(
      async (response) => {
        if (!response) return;
        await this.initInputApprovalObj(response.ProdOfferingCode, response.ProdOfferingVersion);
      });

  }
  async initInputApprovalObj(prodOfferingCode: string, prodOfferingVersion: string) {
    let obj = {
      prodOfferingCode: prodOfferingCode,
      prodOfferingVersion: prodOfferingVersion,
      refProdCompntCode: CommonConstant.REF_PROD_COMPNT_CODE_OFF_VLD_APV
    };
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).toPromise().then(
      response => {
        if (!response) return;
        let listTypeCode: Array<TypeResultObj> = new Array();
        let TypeCode: TypeResultObj = {
          TypeCode: "OFF_VLD_APV_CF_TYPE",
          Attributes: [],
        };
        listTypeCode.push(TypeCode);

        this.InputObj.ApvTypecodes = listTypeCode;
        this.InputObj.CategoryCode = CommonConstant.CAT_CODE_OFF_VLD_APV;
        this.InputObj.SchemeCode = response["CompntValue"];
        this.InputObj.Reason = this.DDLData[this.DDLRecomendation];
        this.InputObj.TrxNo = this.TrxNo;
        this.IsReady = true;
      }
    );
  }

  //#region DDL Data
  DDLData: { [id: string]: Array<KeyValueObj> } = {};
  readonly DDLRecomendation: string = CommonConstant.RefReasonTypeCodeOfferingValidityReqApv;
  async BindDDLReason() {
    let Obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeOfferingValidityReqApv };
    await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLRecomendation] = response[CommonConstant.ReturnObj];
      });
  }

  //#endregion


  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

  SaveForm() {
    let temp = this.FormObj.value;
    let RFAInfo = { RFAInfo: this.FormObj.controls.RFAInfo.value };

    let apiObj = {
      ApprovedById: temp.Approver,
      Reason: temp.ReasonDesc,
      Notes: temp.Notes,
      WfTaskListId: this.taskId,
      RowVersion: "",
      RequestRFAObj: RFAInfo
    };

    this.http.post(URLConstant.RequestApproval, apiObj).subscribe(
      (response) => {
        if (response["StatusCode"] != "200") return;
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_OFFERING_VALIDITY_REQ_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      });
  }
}
