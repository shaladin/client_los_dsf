import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-po-extension-detail',
  templateUrl: './po-extension-detail.component.html'
})
export class PoExtensionDetailComponent implements OnInit {
  AppId: number;
  PurchaseOrderHId: number;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  BizTemplateCode: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.PurchaseOrderHId = params["PurchaseOrderHId"];
      this.BizTemplateCode = params["BizTemplateCode"];
    });
  }

  POExtForm = this.fb.group({
    PurchaseOrderExpiredDt: ['']
  });

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewPOExtensionInfo.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "AgrmntNo",
        environment: environment.losR3Web
      },
      {
        name: "PurchaseOrderNo",
        environment: environment.losR3Web
      },
    ];
  }

  SaveForm() {
    var obj = {
      AppId: this.AppId,
      PurchaseOrderHId: this.PurchaseOrderHId,
      PurchaseOrderExpiredDt: this.POExtForm.controls.PurchaseOrderExpiredDt.value
    }
    this.http.post(URLConstant.SubmitNewExpDate, obj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Nap/AddProcess/POExtension/Paging"]);
      },
      error => {
        console.log(error);
      }
    );
  }

  Back() {
    this.router.navigate(['/Nap/AddProcess/POExtension/Paging'], { queryParams: { BizTemplateCode: this.BizTemplateCode } });
  }
}
