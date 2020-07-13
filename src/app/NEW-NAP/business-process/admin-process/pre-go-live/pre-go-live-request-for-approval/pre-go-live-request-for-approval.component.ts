import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-sharing-pre-go-live-request-for-approval',
  templateUrl: './pre-go-live-request-for-approval.component.html'
})
export class PreGoLiveRequestForApprovalComponent implements OnInit {
  viewObj: string;
  AppId: any;
  itemApprovedBy: any;
  AgrmntNo: any;
  itemReason: any;

  MainInfoForm = this.fb.group({
    Reason: ['', Validators.required],
    ApprovedBy: ['', Validators.required],
    Notes: ['', Validators.required]
  })
  RFAPreGoLive: any;
  TaskListId: any;
  AgrmntId: any;
  token: any = localStorage.getItem(CommonConstant.TOKEN);

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.AgrmntId = params["AgrmntId"];
      this.AgrmntNo = params["AgrmntNo"];
      this.TaskListId = params["TaskListId"];
    });
  }

  ngOnInit() {
    var schmCodeObj = {
      SchmCode: "PRE_GLV_APV_CF",
      RowVersion: ""
    }
    this.http.post(URLConstant.GetListApprovedByForPreGoLive, schmCodeObj).subscribe(
      (response) => {
        this.itemApprovedBy = response[CommonConstant.ReturnObj];
        this.MainInfoForm.patchValue({
          ApprovedBy: this.itemApprovedBy[0].Key
        });
      }
    );
    this.LoadRefReason();
    this.viewObj = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLiveApproval.json";
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion, this.token);
    }
    if (ev.Key == "customer") {
      var link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + ev.ViewObj.AppCustId;
      window.open(link, "_blank");
    }
  }

  LoadRefReason() {
    var refReasonObj = {
      RefReasonTypeCode: CommonConstant.RefReasonTypeCodePreGlvApv
    }
    this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).subscribe(
      (response) => {
        this.itemReason = response[CommonConstant.ReturnObj];
        this.MainInfoForm.patchValue({
          Reason: this.itemReason[0].Value
        });
      }
    );
  }
  SaveForm() {
    this.RFAPreGoLive = new RFAPreGoLiveObj();
    this.RFAPreGoLive.TransactionNo = this.AgrmntNo;
    this.RFAPreGoLive.Notes = this.MainInfoForm.controls.Notes.value;
    this.RFAPreGoLive.ApprovedBy = this.MainInfoForm.controls.ApprovedBy.value;
    this.RFAPreGoLive.Reason = this.MainInfoForm.controls.Reason.value;
    this.RFAPreGoLive.TaskListId = this.TaskListId;
    this.RFAPreGoLive.RowVersion = "";

    this.http.post(URLConstant.CreateRFAPreGoLive, this.RFAPreGoLive).subscribe((response) => {
      this.router.navigateByUrl('/Nap/AdminProcess/PreGoLive/Paging?BizTemplateCode=' + localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE));
    },
      (error) => {
        console.log(error);
      });
  }

  Cancel() {
    this.router.navigateByUrl('/Nap/AdminProcess/PreGoLive/Detail?AgrmntId=' + this.AgrmntId + '&AppId=' + this.AppId + '&TaskListId=' + this.TaskListId + '&AgrmntNo=' + this.AgrmntNo);
  }

}
