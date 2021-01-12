import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { RFAPreGoLiveObj } from 'app/shared/model/RFAPreGoLiveObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/Ucapprovalcreate';
@Component({
  selector: 'app-sharing-pre-go-live-request-for-approval',
  templateUrl: './pre-go-live-request-for-approval.component.html'
})
export class PreGoLiveRequestForApprovalComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: any;
  itemApprovedBy: any;
  AgrmntNo: any;
  itemReason: any;

  RFAPreGoLive: any;
  TaskListId: any;
  AgrmntId: any;
  token: any = localStorage.getItem(CommonConstant.TOKEN);
  InputObj: UcInputRFAObj;
  IsReady: boolean;
  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) { 
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  ApprovalCreateOutput: any;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.AgrmntId = params["AgrmntId"];
      this.AgrmntNo = params["AgrmntNo"];
      this.TaskListId = params["TaskListId"];
    });
  }

 async ngOnInit() {
    var schmCodeObj = {
      SchmCode: "PRE_GLV_APV_CF",
      RowVersion: ""
    } 
   
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLiveApproval.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
      {
        name: "AgrmntNo",
        environment: environment.losR3Web
      },
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    await this.LoadRefReason();
    this.initInputApprovalObj();
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
    if (ev.Key == "customer") {
      AdInsHelper.OpenCustomerViewByCustId(ev.ViewObj.AppCustId);
    }
  }

  async LoadRefReason() {
    var refReasonObj = {
      RefReasonTypeCode: CommonConstant.RefReasonTypeCodePreGlvApv
    }
    await this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).toPromise().then(
      (response) => {
        this.itemReason = response[CommonConstant.ReturnObj];
      }
    );
  }
  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output();  
    if(this.ApprovalCreateOutput!=undefined){
      this.RFAPreGoLive = new RFAPreGoLiveObj();
     this.RFAPreGoLive.TaskListId = this.TaskListId;
      this.RFAPreGoLive.RowVersion = "";
      this.RFAPreGoLive.RequestRFAObj = this.ApprovalCreateOutput
         this.http.post(URLConstant.CreateRFAPreGoLiveNew, this.RFAPreGoLive).subscribe((response) => {
      this.router.navigateByUrl('/Nap/AdminProcess/PreGoLive/Paging?BizTemplateCode=' + localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE));
    });
    }  
  }

  Cancel() {
    this.router.navigateByUrl('/Nap/AdminProcess/PreGoLive/Detail?AgrmntId=' + this.AgrmntId + '&AppId=' + this.AppId + '&TaskListId=' + this.TaskListId + '&AgrmntNo=' + this.AgrmntNo);
  }
  initInputApprovalObj(){  
    this.InputObj = new UcInputRFAObj();
    var Attributes = [{}] 
    var TypeCode = {
      "TypeCode" : "PRE_GLV_APV_TYPE",
      "Attributes" : Attributes,
    };
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.EnvUrl = environment.FoundationR3Url;
    this.InputObj.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
    this.InputObj.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
    this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
    this.InputObj.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
    this.InputObj.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
    this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
    this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRE_GO_LIVE_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_PRE_GO_LIVE;
    this.InputObj.Reason = this.itemReason;
    this.InputObj.TrxNo = this.AgrmntNo
    this.IsReady = true;
  }

}
