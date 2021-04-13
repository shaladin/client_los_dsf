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

@Component({
  selector: 'app-prod-ho-add',
  templateUrl: './prod-ho-add.component.html'
})
export class ProdHoAddComponent implements OnInit {
  ProdHId: number;
  mode: string = 'add';
  source: string = '';
  BusinessDt: Date;
  StartActiveDt: Date;
  StartDt: Date;
  EndDt: Date;
  GenericByIdObj: GenericObj = new GenericObj();
  ProdHObj: ResGetProductHObj = new ResGetProductHObj();
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
      this.GenericByIdObj.Id = this.ProdHId;
      this.http.post(URLConstant.GetProdHById, this.GenericByIdObj).subscribe(
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
    this.StartDt = new Date(this.RefProductHOForm.get("StartDt").value);
    this.EndDt = new Date(this.RefProductHOForm.get("EndDt").value);

    if (this.StartDt > this.EndDt) {
      this.toastr.warningMessage("Start Date Must be Less than End Date");
      return false;
    }

    if (this.EndDt <= this.BusinessDt) {
      this.toastr.warningMessage("End Date Must be Greater than Business Date");
      return false;
    }
    
    if (this.StartDt <= this.BusinessDt) {
      this.toastr.warningMessage("Start Date Must be Greater than Business Date");
      return false;
    }
    return true;
  }

  SaveForm() {
    if (!this.ValidateDate()) {
      return false;
    }
    this.ReqAddProdObj = this.ReqEditProdObj = this.RefProductHOForm.value;
    
    if (this.mode == "edit") {
      this.ReqEditProdObj.ProdId = this.ProdHObj.ProdId;
      this.ReqEditProdObj.ProdCode = this.ProdHObj.ProdCode;
      this.ReqEditProdObj.RowVersion = this.ProdHObj.RowVersion;
      this.http.post(URLConstant.EditProduct, this.ReqEditProdObj).subscribe(
        (response: ResAddEditProductObj) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_ADD_DETAIL], { ProdHId: response.DraftProdHId, ProdId: response.ProdId, source: this.source });
        }
      );
    } else {
      this.http.post(URLConstant.AddProduct, this.ReqAddProdObj).subscribe(
        (response: ResAddEditProductObj) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_ADD_DETAIL], { ProdHId: response.DraftProdHId, ProdId: response.ProdId, source: this.source });
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
