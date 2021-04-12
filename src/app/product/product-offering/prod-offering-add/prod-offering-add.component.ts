import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ProdOfferingObj } from 'app/shared/model/Request/Product/ProdOfferingObj.model';
import { ResProdOfferingHObj } from 'app/shared/model/Response/Product/ResProdOfferingObj.model';

@Component({
  selector: 'app-prod-offering-add',
  templateUrl: './prod-offering-add.component.html'
})
export class ProdOfferingAddComponent implements OnInit {
  BusinessDt: Date;
  StartActiveDt: Date;
  source: string = "";
  ProductName: string ="";
  mode: string = "add";
  prodOfferingObj: ProdOfferingObj;
  ResProdOfferingHObj: ResProdOfferingHObj = new ResProdOfferingHObj();
  ProdOfferingId: number;
  inputLookupObj: any;
  ProdOfferingHId: number;

  ProdOfferingForm = this.fb.group({
    ProdOfferingCode: ['', Validators.required],
    ProdOfferingName: ['', Validators.required],
    ProdOfferingDescr: ['', Validators.required],
    StartDt: ['', Validators.required],
    EndDt: ['', Validators.required],
  });

  constructor(private router: Router, 
              private route: ActivatedRoute, 
              private http: HttpClient, 
              private fb: FormBuilder, 
              private toastr: NGXToastrService, 
              private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      this.ProdOfferingHId = params["ProdOfferingHId"];
      this.mode = params["mode"];
      this.source = params["source"];
    })
  }

  ngOnInit() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlEnviPaging = environment.losUrl;
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";

    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.BusinessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.BusinessDt.setDate(this.BusinessDt.getDate());
    this.StartActiveDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.StartActiveDt.setDate(this.BusinessDt.getDate());
    var currOfcCode = context["OfficeCode"];
    if (currOfcCode == CommonConstant.HeadOffice) {
      this.inputLookupObj.urlJson = "./assets/uclookup/product/lookupProductForHO.json";
      this.inputLookupObj.pagingJson = "./assets/uclookup/product/lookupProductForHO.json";
      this.inputLookupObj.genericJson = "./assets/uclookup/product/lookupProductForHO.json";
    }
    else {
      this.inputLookupObj.urlJson = "./assets/uclookup/product/lookupProdOffering.json";
      this.inputLookupObj.pagingJson = "./assets/uclookup/product/lookupProdOffering.json";
      this.inputLookupObj.genericJson = "./assets/uclookup/product/lookupProdOffering.json";

      var arrCrit = new Array();
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'O.OFFICE_CODE';
      critObj.value = context["OfficeCode"];
      arrCrit.push(critObj);

      critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'PBM.IS_ALLOWED_CRT';
      critObj.value = '1';
      arrCrit.push(critObj);

      this.inputLookupObj.addCritInput = arrCrit;
    }

    if (this.mode == "edit") {

      this.ProdOfferingForm.controls.ProdOfferingCode.disable();
      this.http.post(URLConstant.GetProductOfferingMainInfo, {Id: this.ProdOfferingHId}).subscribe(
        (response : ResProdOfferingHObj) => {
          this.ResProdOfferingHObj = response;
          this.inputLookupObj.nameSelect = this.ResProdOfferingHObj.ProdName;
          this.inputLookupObj.jsonSelect = { ProdName: this.ResProdOfferingHObj.ProdName, CurrentProdHId: this.ResProdOfferingHObj.ProdHId };
          this.ProductName = this.ResProdOfferingHObj.ProdName;
          this.ProdOfferingForm.patchValue({
            ProdOfferingCode: this.ResProdOfferingHObj.ProdOfferingCode,
            ProdOfferingName: this.ResProdOfferingHObj.ProdOfferingName,
            ProdOfferingDescr: this.ResProdOfferingHObj.ProdOfferingDescr,
            StartDt: formatDate(this.ResProdOfferingHObj.StartDt, 'yyyy-MM-dd', 'en-US'),
            EndDt: formatDate(this.ResProdOfferingHObj.EndDt, 'yyyy-MM-dd', 'en-US'),
            
          })
          this.updateMinDtForEndDt();
        }
      );
    }
  }

  updateMinDtForEndDt(){
    this.StartActiveDt = this.ProdOfferingForm.controls.StartDt.value;
    if(this.ProdOfferingForm.controls.EndDt.value < this.StartActiveDt){
      this.ProdOfferingForm.controls.EndDt.setValue("");
    }
  }

  SaveForm() {
    this.prodOfferingObj = new ProdOfferingObj();
    this.prodOfferingObj = this.ProdOfferingForm.value;

    if (this.ValidateDate()) {
      if (this.mode == "edit") {
        this.prodOfferingObj.ProdOfferingCode = this.ResProdOfferingHObj.ProdOfferingCode;
        this.prodOfferingObj.ProdOfferingId = this.ResProdOfferingHObj.ProdOfferingId;
        this.prodOfferingObj.ProdHId =  this.ResProdOfferingHObj.ProdHId;
        this.prodOfferingObj.RowVersion = this.ResProdOfferingHObj.RowVersion;
        this.prodOfferingObj.ProdOfferingHId = this.ProdOfferingHId;
        this.prodOfferingObj.ProdName = this.ProductName;
        this.http.post(URLConstant.EditProdOffering, this.prodOfferingObj).subscribe(
          response => {
            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_ADD_DETAIL],{ "ProdOfferingId": response["ProdOfferingId"], "ProdOfferingHId": response["DraftProdOfferingHId"], source: this.source });
          }
        );
      }
      else {

        this.prodOfferingObj.ProdOfferingId = "0";
        this.prodOfferingObj.ProdHId = this.inputLookupObj.jsonSelect.CurrentProdHId;
        this.prodOfferingObj.RowVersion = "";
        this.http.post(URLConstant.AddProdOffering, this.prodOfferingObj).subscribe(
          response => {
            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_ADD_DETAIL],{ "ProdOfferingId": response["ProdOfferingId"], "ProdOfferingHId": response["DraftProdOfferingHId"], source: this.source });
          }
        );
      }
    }
  }
  ProdName = "ProdName";
  handleOutput(event) {
    this.ProdOfferingForm.patchValue({
      ProdName: event.ProdName
    });
  }

  ValidateDate() {
    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let businessDate = new Date(context[CommonConstant.BUSINESS_DT]);
    let startDate = new Date(this.ProdOfferingForm.get("StartDt").value);
    let endDate = new Date(this.ProdOfferingForm.get("EndDt").value);

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

  Cancel() {
    this.BackToPaging();
  }

  BackToPaging() {
    if (this.source == "return") {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_RTN_PAGING],{ });
    }
    else {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_PAGING],{ });
    }
  }
}
