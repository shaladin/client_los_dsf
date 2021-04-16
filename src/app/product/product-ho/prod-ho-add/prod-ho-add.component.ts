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
import { ResGetProductHObj } from 'app/shared/model/Response/Product/ResGetProdObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ReqAddProductObj, ReqEditProductObj } from 'app/shared/model/Request/Product/ReqAddEditProductObj.model';
import { ResAddEditProductObj } from 'app/shared/model/Response/Product/ResAddEditProdObj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-prod-ho-add',
  templateUrl: './prod-ho-add.component.html'
})
export class ProdHoAddComponent implements OnInit {
  ProdHId: number;
  Mode: string = 'add';
  Source: string = '';
  BusinessDt: Date;
  StartDt: Date;
  EndDt: Date;
  GenericByIdObj: GenericObj = new GenericObj();
  ResGetProdHObj: ResGetProductHObj = new ResGetProductHObj();
  ReqAddProdObj: ReqAddProductObj = new ReqAddProductObj();
  ReqEditProdObj: ReqEditProductObj = new ReqEditProductObj();

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
        this.Mode = params["mode"];
      }
      if (params["source"] != null) {
        this.Source = params["source"];
      }
    })
  }

  ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.BusinessDt = new Date(context[CommonConstant.BUSINESS_DT]);

    if (this.Mode == "edit") {
      this.RefProductHOForm.controls.ProdCode.disable();
      this.GenericByIdObj.Id = this.ProdHId;
      this.http.post(URLConstant.GetProdHById, this.GenericByIdObj).subscribe(
        (response: ResGetProductHObj) => {
          this.ResGetProdHObj = response;
          this.RefProductHOForm.patchValue({
            ProdCode: this.ResGetProdHObj.ProdCode,
            ProdName: this.ResGetProdHObj.ProdName,
            ProdDescr: this.ResGetProdHObj.ProdDescr,
            StartDt: formatDate(this.ResGetProdHObj.StartDt, 'yyyy-MM-dd', 'en-US'),
            EndDt: formatDate(this.ResGetProdHObj.EndDt, 'yyyy-MM-dd', 'en-US')
          });
          this.updateMinDtForEndDt();
        }
      );
    }
  }

  updateMinDtForEndDt() {
    if (this.RefProductHOForm.controls.EndDt.value < this.RefProductHOForm.controls.StartDt.value) {
      this.RefProductHOForm.controls.EndDt.setValue("");
    }
  }

  ValidateDate() {   
    this.StartDt = new Date(this.RefProductHOForm.get("StartDt").value);
    this.EndDt = new Date(this.RefProductHOForm.get("EndDt").value);

    if (this.StartDt > this.EndDt) {
      this.toastr.warningMessage(ExceptionConstant.START_DT_MUST_LESS_THAN_END_DT);
      return false;
    }

    if (this.EndDt <= this.BusinessDt) {
      this.toastr.warningMessage(ExceptionConstant.END_DT_MUST_GREATER_THAN_BUSINESS_DT);
      return false;
    }
    
    if (this.StartDt <= this.BusinessDt) {
      this.toastr.warningMessage(ExceptionConstant.START_DT_MUST_GREATER_THAN_BUSINESS_DT);
      return false;
    }
    return true;
  }

  SaveForm() {
    if (!this.ValidateDate()) {
      return false;
    }
    this.ReqAddProdObj = this.ReqEditProdObj = this.RefProductHOForm.value;
    
    if (this.Mode == "edit") {
      this.ReqEditProdObj.ProdId = this.ResGetProdHObj.ProdId;
      this.ReqEditProdObj.ProdCode = this.ResGetProdHObj.ProdCode;
      this.ReqEditProdObj.RowVersion = this.ResGetProdHObj.RowVersion;
      this.http.post(URLConstant.EditProduct, this.ReqEditProdObj).subscribe(
        (response: ResAddEditProductObj) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_ADD_DETAIL], { ProdHId: response.DraftProdHId, ProdId: response.ProdId, source: this.Source });
        }
      );
    } else {
      this.http.post(URLConstant.AddProduct, this.ReqAddProdObj).subscribe(
        (response: ResAddEditProductObj) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_ADD_DETAIL], { ProdHId: response.DraftProdHId, ProdId: response.ProdId, source: this.Source });
        }
      );
    }
  }

  Cancel() {
    this.BackToPaging();
  }

  BackToPaging() {
    if (this.Source == "return") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_RTN_PAGING], {});
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_PAGING], {});
    }
  }
}
