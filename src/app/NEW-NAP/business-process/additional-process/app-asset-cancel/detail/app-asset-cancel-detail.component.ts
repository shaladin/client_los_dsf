import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppAgrmntCancelObj } from 'app/shared/model/AppAgrmntCancelObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-asset-cancel-detail',
  templateUrl: './app-asset-cancel-detail.component.html'
})
export class AppAssetCancelDetailComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppAssetId: any;
  AppAgrmntCancelObj: any;
  MainInfoForm = this.fb.group({
    ReasonCode: ['', Validators.required],
    CancelNotes: ['', Validators.required],
    PoReasonCode: [''],
    PoCancelNotes: ['']
  });
  itemReasonCode: any;
  ReasonCode: any;
  BizTemplateCode: string = "";

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppAssetId = params["AppAssetId"];
    });
  }

  ngOnInit() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/opl/view-asset-opl-main-info.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;



    var refReasonObj = {
      RefReasonTypeCode: CommonConstant.RefReasonTypeCodeAppAgrCncl
    }
    this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).subscribe(
      (response) => {
        this.itemReasonCode = response[CommonConstant.ReturnObj];
        this.MainInfoForm.patchValue({
          ReasonCode: this.itemReasonCode[0].Key
        });
      }
    );
  }

  SaveForm() {
    var saveObj = {
      AppAssetId: this.AppAssetId,
      ReasonCode: this.MainInfoForm.controls.ReasonCode.value,
      CancelNotes: this.MainInfoForm.controls.CancelNotes.value,
      PoReasonCode: this.MainInfoForm.controls.PoReasonCode.value,
      PoCancelNotes: this.MainInfoForm.controls.PoCancelNotes.value,
    };
    this.http.post(URLConstant.AddAppAssetCancel, saveObj).subscribe((response) => {
      this.toastr.successMessage(response['message']);
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_ASSET_CAN_PAGING], { BizTemplateCode: this.BizTemplateCode });
    });
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }
}
