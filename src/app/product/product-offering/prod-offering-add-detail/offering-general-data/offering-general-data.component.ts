import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { WizardComponent } from 'angular-archwizard';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqAddEditProdOfferingDObj, ReqCopyProductOfferingObj } from 'app/shared/model/request/product/req-add-edit-prod-offering-obj.model';
import { ProdOfferingDObj } from 'app/shared/model/product/prod-offering-d-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { environment } from 'environments/environment';
import { UcProdOfferingCompComponent } from 'app/product/uc-prod-offering-comp/uc-prod-offering-comp.component';
@Component({
  selector: 'app-offering-general-data',
  templateUrl: './offering-general-data.component.html'
})
export class OfferingGeneralDataComponent implements OnInit {

  @Input() ProdOfferingHId: number;
  @Input() ProdOfferingId: number;
  @ViewChild(UcProdOfferingCompComponent) ucProdOfferingComp: UcProdOfferingCompComponent;
  Source: string = "";
  InputLookUpObj: InputLookupObj = new InputLookupObj();
  ArrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  ListGeneralDataObj : ReqAddEditProdOfferingDObj = new ReqAddEditProdOfferingDObj();
  ReqCopyProductOffObj: ReqCopyProductOfferingObj = new ReqCopyProductOfferingObj();
  isReady: boolean = false;

  FormCopyProdOffering = this.fb.group(
    {

    }
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    private wizard: WizardComponent,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      this.Source = params["source"];
    });
  }

  ngOnInit() {
    this.initLookup();
    this.isReady = true;
  }

  initLookup() {
    this.http.post(URLConstant.GetListProdBranchOfficeMbrByProdOfferingHId, { Id: this.ProdOfferingHId }).subscribe(
      (response) => {
        let listOffice = response[CommonConstant.ReturnObj];

    let user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.InputLookUpObj.urlJson = "./assets/uclookup/product/lookupCopyProductOfferingHO.json";
    this.InputLookUpObj.urlEnviPaging = environment.losUrl + "/v1";
    this.InputLookUpObj.pagingJson = "./assets/uclookup/product/lookupCopyProductOfferingHO.json";
    this.InputLookUpObj.genericJson = "./assets/uclookup/product/lookupCopyProductOfferingHO.json";
    this.InputLookUpObj.isRequired = false;

    let critObj = new CriteriaObj();
    critObj.propName = 'PO.PROD_OFFERING_ID';
    critObj.restriction = AdInsConstant.RestrictionNeq;
    critObj.value = this.ProdOfferingId.toString();
    this.ArrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.propName = 'PO.OFFICE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = user.OfficeCode;
    this.ArrCrit.push(critObj);
    
    let listValueOffice = new Array();
    for (let i = 0; i < listOffice.length; i++) {
      listValueOffice.push(listOffice[i].OfficeCode);
    }
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "POBM.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = listValueOffice;
    this.ArrCrit.push(addCrit);

    this.InputLookUpObj.addCritInput = this.ArrCrit;
        this.InputLookUpObj.isReady = true;
      }
    );
  }

  SaveForm(event) {
    this.generateSaveObj(event);
    this.http.post(URLConstant.AddOrEditProdOfferingDetail, this.ListGeneralDataObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PROD_OFFERING_PAGING], {});
      }
    );
  }

  GetLookup(e){
    this.ProdOfferingHId = e.ProdOfferingHId;
  }

  reload() {
    this.isReady = false;
    if (this.InputLookUpObj.jsonSelect["ProdOfferingId"] == undefined) {
      this.toastr.warningMessage(ExceptionConstant.SELECT_PROD_OFF_TO_COPY);
    }
    else {
      if (confirm(ExceptionConstant.CONFIRM_PROD_OFF_TO_COPY)) {
        this.ReqCopyProductOffObj.ProdOfferingHId = this.ProdOfferingHId;
        this.ReqCopyProductOffObj.FromProdOfferingId = this.InputLookUpObj.jsonSelect["ProdOfferingId"];
        this.http.post(URLConstant.CopyProductOffering, this.ReqCopyProductOffObj).subscribe(
          (response) => {
            this.toastr.successMessage("Product Offering Copied Successfully");
            this.ucProdOfferingComp.initiateForm();
          }
        );
      }
    }
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  NextDetail(event) {
    this.generateSaveObj(event);
    this.http.post(URLConstant.AddOrEditProdOfferingDetail, this.ListGeneralDataObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.wizard.goToNextStep();
      }
    );
  }

  generateSaveObj(event) {
    this.ListGeneralDataObj.ProdOfferingHId = this.ProdOfferingHId;
    for (var i = 0; i < event.length; i++) {
      let GeneralDataObj = new ProdOfferingDObj();
      GeneralDataObj.ProdOfferingDId = event[i].ProdOfferingDId;
      GeneralDataObj.ProdOfferingHId = this.ProdOfferingHId;
      GeneralDataObj.RefProdCompntCode = event[i].RefProdCompntCode;
      GeneralDataObj.RefProdCompntGrpCode = event[i].RefProdCompntGrpCode;
      if (event[i].IsProdOffering == true) {
        GeneralDataObj.CompntValue = event[i].OfferingCompntValue;
        GeneralDataObj.CompntValueDesc = event[i].OfferingCompntValueDesc;
        GeneralDataObj.MrProdBehaviourCode = event[i].OfferingMrProdBehaviour;
      } else {
        GeneralDataObj.CompntValue = event[i].HOCompntValue;
        GeneralDataObj.CompntValueDesc = event[i].HOCompntValueDesc;
        GeneralDataObj.MrProdBehaviourCode = event[i].HOMrProdBehaviour;
      }
      this.ListGeneralDataObj.ProdOfferingDetails.push(GeneralDataObj);
    }
  }

  Cancel() {
    this.BackToPaging();
  }

  BackToPaging() {
    if (this.Source == "return") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PROD_OFFERING_RTN_PAGING], {});
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PROD_OFFERING_PAGING], {});
    }
  }
}
