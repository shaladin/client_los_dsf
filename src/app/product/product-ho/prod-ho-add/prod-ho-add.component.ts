import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqProductObj } from 'app/shared/model/Request/Product/ReqProductObj.model';
import { ResProductObj } from 'app/shared/model/Response/Product/ResProductObj.Model';
import { ResGetProductHObj } from 'app/shared/model/Response/Product/ResGetProdObj.model';

@Component({
  selector: 'app-prod-ho-add',
  templateUrl: './prod-ho-add.component.html'
})
export class ProdHoAddComponent implements OnInit {
  ProdHId: number;
  mode: string = 'add';
  source: string = '';
  ProdHObj: ResGetProductHObj = new ResGetProductHObj();
  ReqProductObj: ReqProductObj = new ReqProductObj();
  BusinessDt: Date;
  StartActiveDt: Date;

  RefProductHOForm = this.fb.group({
    ProdCode: ['', Validators.required],
    ProdName: ['', Validators.required],
    ProdDescr: ['', Validators.required],
    StartDt: ['', Validators.required],
    EndDt: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdHId"] != null) {
        this.ProdHId = params["ProdHId"];
      }
      if (params["mode"] != null) {
        this.mode = params["mode"];
      }
      if (params["source"] != null) {
        this.source = params["source"];
      }
    })
  }

  ngOnInit() {
    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.BusinessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.StartActiveDt = new Date(context[CommonConstant.BUSINESS_DT]);

    if (this.mode == "edit") {
      this.RefProductHOForm.controls.ProdCode.disable();
      this.http.post(URLConstant.GetProductMainInfo, { Id: this.ProdHId }).subscribe(
        (response: ResGetProductHObj) => {
          this.ProdHObj = response;
          this.RefProductHOForm.patchValue({
            ProdCode: this.ProdHObj.ProdCode,
            ProdName: this.ProdHObj.ProdName,
            ProdDescr: this.ProdHObj.ProdDescr,
            StartDt: formatDate(this.ProdHObj.StartDt, 'yyyy-MM-dd', 'en-US'),
            EndDt: formatDate(this.ProdHObj.EndDt, 'yyyy-MM-dd', 'en-US')
          });
          this.updateMinDtForEndDt();
        }
      );
    }
  }

  updateMinDtForEndDt() {
    this.StartActiveDt = this.RefProductHOForm.controls.StartDt.value;
    if (this.RefProductHOForm.controls.EndDt.value < this.StartActiveDt) {
      this.RefProductHOForm.controls.EndDt.setValue("");
    }
  }

  ValidateDate() {
    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let businessDate = new Date(context[CommonConstant.BUSINESS_DT]);
    let startDate = new Date(this.RefProductHOForm.get("StartDt").value);
    let endDate = new Date(this.RefProductHOForm.get("EndDt").value);

    if (startDate > endDate) {
      this.toastr.warningMessage("Start Date Must be Less than End Date");
      return false;
    }

    if (endDate <= businessDate) {
      this.toastr.warningMessage("End Date Must be Greater than Business Date");
      return false;
    }
    return true;
  }

  SaveForm() {
    this.ReqProductObj = this.RefProductHOForm.value;
    if (!this.ValidateDate()) {
      return false;
    }
    
    if (this.mode == "edit") {
      this.ReqProductObj.ProdId = this.ProdHObj.ProdId;
      this.ReqProductObj.ProdCode = this.ProdHObj.ProdCode;
      this.ReqProductObj.RowVersion = this.ProdHObj.RowVersion;
      this.http.post(URLConstant.EditProduct, this.ReqProductObj).subscribe(
        (response: ResProductObj) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_ADD_DETAIL], { "ProdHId": response.DraftProdHId, "ProdId": response.ProdId, "mode": this.mode, "source": this.source });
        }
      );
    } else {
      this.http.post(URLConstant.AddProduct, this.ReqProductObj).subscribe(
        (response: ResProductObj) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_ADD_DETAIL], { "ProdHId": response.DraftProdHId, "ProdId": response.ProdId, "mode": this.mode, "source": this.source });
        }
      );
    }
  }

  Cancel() {
    this.BackToPaging();
  }

  BackToPaging() {
    if (this.source == "return") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_RTN_PAGING], {});
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_PAGING], {});
    }
  }
}
