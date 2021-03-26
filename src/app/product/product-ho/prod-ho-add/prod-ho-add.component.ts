import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ProdHObj } from 'app/shared/model/Product/ProdHObj.model';

@Component({
  selector: 'app-prod-ho-add',
  templateUrl: './prod-ho-add.component.html'
})
export class ProdHoAddComponent implements OnInit {
  param: any;
  mode: string = 'add';
  key: any;
  criteria: CriteriaObj[] = [];
  source:string="";
  ResultResponse: any;
  SaveMode;
  ProdHOBj: any;
  businessDt: any;
  startActiveDt : any;

  RefProductHOForm = this.fb.group({
    ProdCode: ['', Validators.required],
    ProdName: ['',Validators.required],
    ProdDescr: ['',Validators.required],
    StartDt: ['',Validators.required],
    EndDt: ['',Validators.required]
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
      if(params["ProdHId"] != null){
        this.param = params["ProdHId"];
      }
      if(params["mode"] != null){
        this.mode = params["mode"];
      }
      if(params["key"] != null){
        this.key = params["key"];
      }
      if(params["source"] != null){
        this.source = params["source"];
      }
    })
  }

  ngOnInit() {
    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.businessDt.setDate(this.businessDt.getDate());
    this.startActiveDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.startActiveDt.setDate(this.businessDt.getDate());
    
    if (this.mode == "edit") {
      var tempCrit = new CriteriaObj();
      tempCrit.propName = this.key;
      tempCrit.restriction = "Eq";
      tempCrit.value = this.param;
      this.criteria.push(tempCrit);

      this.RefProductHOForm.controls.ProdCode.disable();
      this.ProdHOBj = new ProdHObj();
      this.ProdHOBj.ProdHId = this.param;
      this.http.post(URLConstant.GetProductMainInfo, this.ProdHOBj).subscribe(
        (response) => {
          this.ResultResponse = response;
          this.RefProductHOForm.patchValue({
            ProdCode: this.ResultResponse.ProdCode,
            ProdName: this.ResultResponse.ProdName,
            ProdDescr: this.ResultResponse.ProdDescr,
            StartDt: formatDate(this.ResultResponse.StartDt, 'yyyy-MM-dd', 'en-US'),
            EndDt: formatDate(this.ResultResponse.EndDt, 'yyyy-MM-dd', 'en-US')
          });
          this.updateMinDtForEndDt();

        }
      );
    }
  }
  updateMinDtForEndDt(){
    this.startActiveDt = this.RefProductHOForm.controls.StartDt.value;
    if(this.RefProductHOForm.controls.EndDt.value < this.startActiveDt){
      this.RefProductHOForm.controls.EndDt.setValue("");
    }
  }

  ClickSave(ev) {
    this.SaveMode = ev;
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
    if (this.SaveMode == "save") {
      this.ProdHOBj = new ProdHObj();
      this.ProdHOBj = this.RefProductHOForm.value;

      if (this.mode == "edit") {
        if (this.ValidateDate()) {
          this.ProdHOBj.ProdId = this.ResultResponse.ProdId;
          this.ProdHOBj.ProdCode = this.ResultResponse.ProdCode;
          this.ProdHOBj.RowVersion = this.ResultResponse.RowVersion;
          this.http.post(URLConstant.EditProduct, this.ProdHOBj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              this.BackToPaging();
            }
          );
        }
      } else {
        if (this.ValidateDate()) {
          this.ProdHOBj.RowVersion = "";
          this.http.post(URLConstant.AddProduct, this.ProdHOBj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              this.BackToPaging();
            }
          );
        }
      }
    } else { //next
      this.ProdHOBj = new ProdHObj();
      this.ProdHOBj = this.RefProductHOForm.value;
      if (this.mode == "edit") {
        if (this.ValidateDate()) {
          this.ProdHOBj.ProdId = this.ResultResponse.ProdId;
          this.ProdHOBj.ProdCode = this.ResultResponse.ProdCode;
          this.ProdHOBj.RowVersion = this.ResultResponse.RowVersion;
          this.http.post(URLConstant.EditProduct, this.ProdHOBj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_ADD_DETAIL],{ "ProdHId": response["DraftProdHId"], "ProdId" : response["ProdId"], "mode": this.mode, source : this.source });
            }
          );
        }
      } else {
        if (this.ValidateDate()) {
          this.ProdHOBj.RowVersion = "";
          this.http.post(URLConstant.AddProduct, this.ProdHOBj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_ADD_DETAIL],{ "ProdHId": response["DraftProdHId"], "ProdId" : response["ProdId"], "mode": this.mode, source : this.source });
            }
          );
        }
      }
    }
  }

  Cancel()
  {
    this.BackToPaging();
  }

  BackToPaging()
  {
    if(this.source == "return")
    {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_RTN_PAGING],{ });
    }
    else
    {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_PAGING],{ });
    }
  }
}
