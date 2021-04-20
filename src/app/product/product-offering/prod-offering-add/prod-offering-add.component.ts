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
import { ReqAddProdOfferingObj, ReqEditProdOfferingObj } from 'app/shared/model/Request/Product/ReqAddEditProdOfferingObj.model';
import { ResAddEditProdOfferingObj, ResProdOfferingHObj } from 'app/shared/model/Response/Product/ResProdOfferingObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-prod-offering-add',
  templateUrl: './prod-offering-add.component.html'
})
export class ProdOfferingAddComponent implements OnInit {
  BusinessDt: Date;
  StartActiveDt: Date;
  StartDt: Date;
  EndDt: Date;
  Source: string = "";
  ProductName: string ="";
  Mode: string = "add";
  ProdOfferingId: number;
  ProdOfferingHId: number;
  ProdName : string = "ProdName";
  InputLookupObj: InputLookupObj = new InputLookupObj();
  GenericByIdObj: GenericObj = new GenericObj();
  ArrCrit : Array<CriteriaObj> = new Array<CriteriaObj>();
  ReqAddProdOfferingObj: ReqAddProdOfferingObj = new ReqAddProdOfferingObj();
  ReqEditProdOfferingObj: ReqEditProdOfferingObj = new ReqEditProdOfferingObj();
  ResProdOfferingHObj: ResProdOfferingHObj = new ResProdOfferingHObj();
  UserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

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
      this.Mode = params["mode"];
      this.Source = params["source"];
    })
  }

  ngOnInit() {
    this.InputLookupObj.urlEnviPaging = environment.losUrl;
    this.InputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";

    this.BusinessDt = new Date(this.UserContext[CommonConstant.BUSINESS_DT]);
    this.StartActiveDt = new Date(this.UserContext[CommonConstant.BUSINESS_DT]);

    let currOfcCode = this.UserContext[CommonConstant.OFFICE_CODE];
    if (currOfcCode == CommonConstant.HeadOffice) {
      this.InputLookupObj.urlJson = "./assets/uclookup/product/lookupProductForHO.json";
      this.InputLookupObj.pagingJson = "./assets/uclookup/product/lookupProductForHO.json";
      this.InputLookupObj.genericJson = "./assets/uclookup/product/lookupProductForHO.json";
    }
    else {
      this.InputLookupObj.urlJson = "./assets/uclookup/product/lookupProdOffering.json";
      this.InputLookupObj.pagingJson = "./assets/uclookup/product/lookupProdOffering.json";
      this.InputLookupObj.genericJson = "./assets/uclookup/product/lookupProdOffering.json";

      let critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'O.OFFICE_CODE';
      critObj.value = currOfcCode;
      this.ArrCrit.push(critObj);

      critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'PBM.IS_ALLOWED_CRT';
      critObj.value = '1';
      this.ArrCrit.push(critObj);

      this.InputLookupObj.addCritInput = this.ArrCrit;
    }

    if (this.Mode == "edit") {
      this.ProdOfferingForm.controls.ProdOfferingCode.disable();
      this.GenericByIdObj.Id = this.ProdOfferingHId;
      this.http.post(URLConstant.GetProdOfferingHById, this.GenericByIdObj).subscribe(
        (response : ResProdOfferingHObj) => {
          this.ResProdOfferingHObj = response;
          this.InputLookupObj.nameSelect = this.ResProdOfferingHObj.ProdName;
          this.InputLookupObj.jsonSelect = { ProdName: this.ResProdOfferingHObj.ProdName, CurrentProdHId: this.ResProdOfferingHObj.ProdHId };
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
    this.ReqAddProdOfferingObj = this.ReqEditProdOfferingObj = this.ProdOfferingForm.value;

    if (this.ValidateDate()) {
      if (this.Mode == "edit") {
        this.ReqEditProdOfferingObj.ProdOfferingCode = this.ResProdOfferingHObj.ProdOfferingCode;
        this.ReqEditProdOfferingObj.ProdOfferingId = this.ResProdOfferingHObj.ProdOfferingId;
        this.ReqEditProdOfferingObj.ProdHId =  this.ResProdOfferingHObj.ProdHId;
        this.ReqEditProdOfferingObj.ProdOfferingHId = this.ProdOfferingHId;
        this.ReqEditProdOfferingObj.ProdName = this.ProductName;
        this.ReqEditProdOfferingObj.RowVersion = this.ResProdOfferingHObj.RowVersion;
        this.http.post<ResAddEditProdOfferingObj>(URLConstant.EditProdOffering, this.ReqEditProdOfferingObj).subscribe(
          response => {
            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_ADD_DETAIL],{ ProdOfferingId: response.ProdOfferingId, ProdOfferingHId: response.DraftProdOfferingHId, source: this.Source });
          }
        );
      }
      else {
        this.ReqAddProdOfferingObj.ProdHId = this.InputLookupObj.jsonSelect.CurrentProdHId;
        this.http.post<ResAddEditProdOfferingObj>(URLConstant.AddProdOffering, this.ReqAddProdOfferingObj).subscribe(
          response => {
            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_ADD_DETAIL],{ ProdOfferingId: response.ProdOfferingId, ProdOfferingHId: response.DraftProdOfferingHId, source: this.Source });
          }
        );
      }
    }
  }

  handleOutput(event) {
    this.ProdOfferingForm.patchValue({
      ProdName: event.ProdName
    });
  }

  ValidateDate() {
    this.StartDt = new Date(this.ProdOfferingForm.get("StartDt").value);
    this.EndDt = new Date(this.ProdOfferingForm.get("EndDt").value);

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

  Cancel() {
    this.BackToPaging();
  }

  BackToPaging() {
    if (this.Source == "return") {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_RTN_PAGING],{ });
    }
    else {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_PAGING],{ });
    }
  }
}
