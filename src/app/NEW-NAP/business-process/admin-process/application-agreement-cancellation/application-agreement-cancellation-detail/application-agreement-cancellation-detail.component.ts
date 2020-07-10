import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAgrmntCancelObj } from 'app/shared/model/AppAgrmntCancelObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-application-agreement-cancellation-detail',
  templateUrl: './application-agreement-cancellation-detail.component.html'
})
export class ApplicationAgreementCancellationDetailComponent implements OnInit {

  viewObj: string;
  AppId: any;
  AgrmntId: any;
  AppAgrmntCancelObj: any;
  token: any = localStorage.getItem("Token");
  MainInfoForm = this.fb.group({
    ReasonCode: ['', Validators.required],
    CancelNotes: ['', Validators.required]
  });
  itemReasonCode: any;
  ReasonCode: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.AgrmntId = params["AgrmntId"];
    });
    if (this.AgrmntId == "AgrmntId") {
      this.AgrmntId = -1;
    }
  }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewApplicationAgreementCancellation.json";

    var refReasonObj = {
      RefReasonTypeCode: CommonConstant.RefReasonTypeCodeAppAgrCncl
    }
    this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).subscribe(
      (response) => {
        this.itemReasonCode = response["ReturnObject"];
        this.MainInfoForm.patchValue({
          ReasonCode: this.itemReasonCode[0].Key
        });
      }
    );
  }

  SaveForm() {
    this.AppAgrmntCancelObj = new AppAgrmntCancelObj();
    this.AppAgrmntCancelObj = this.MainInfoForm.value;
    this.AppAgrmntCancelObj.AppId = this.AppId;
    this.AppAgrmntCancelObj.AgrmntId = this.AgrmntId;
    this.AppAgrmntCancelObj.CancelByRefNo = "null";
    this.AppAgrmntCancelObj.RowVersion = "";

    this.http.post(URLConstant.AddAppAgrmntCancel, this.AppAgrmntCancelObj).subscribe((response) => {
      this.toastr.successMessage(response['message']);
      this.router.navigateByUrl("/Nap/AdminProcess/AgreementCancellation/Paging");
    },
      (error) => {
        console.log(error);
      });
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion, this.token);
    }
  }
}
