import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { WizardComponent } from 'angular-archwizard';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ListProductOfferingDetailObj } from 'app/shared/model/Request/Product/ListProductOfferingDetailObj.model';
import { ProductOfferingDetailObj } from 'app/shared/model/Request/Product/ProductOfferingDetailObj.model';
@Component({
  selector: 'app-offering-general-data',
  templateUrl: './offering-general-data.component.html'
})
export class OfferingGeneralDataComponent implements OnInit {

  @Input() objInput: any;

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
      this.source = params["source"];
    });
  }

  listGeneralDataObj;
  ProdOfferingHId: number;
  prodOfferingId: number;
  source: string = "";
  inputLookUpObj: InputLookupObj;

  FormCopyProdOffering = this.fb.group(
    {

    }
  );

  ngOnInit() {
    this.ProdOfferingHId = this.objInput["ProdOfferingHId"];
    this.prodOfferingId = this.objInput["ProdOfferingId"];

    this.initLookup();
  }

  initLookup() {
    let user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputLookUpObj = new InputLookupObj();
    this.inputLookUpObj.urlJson = "./assets/uclookup/product/lookupCopyProductOfferingHO.json";
    this.inputLookUpObj.pagingJson = "./assets/uclookup/product/lookupCopyProductOfferingHO.json";
    this.inputLookUpObj.genericJson = "./assets/uclookup/product/lookupCopyProductOfferingHO.json";
    this.inputLookUpObj.isRequired = false;

    var critObj = new CriteriaObj();
    critObj.propName = 'PO.PROD_OFFERING_ID';
    critObj.restriction = AdInsConstant.RestrictionNeq;
    critObj.value = this.prodOfferingId.toString();
    var arrCrit = new Array();
    arrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.propName = 'PO.REF_OFFICE_ID';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = user.OfficeId;
    arrCrit.push(critObj);

    this.inputLookUpObj.addCritInput = arrCrit;

  }

  SaveForm(event) {
    this.generateSaveObj(event);
    this.http.post(URLConstant.AddOrEditProdOfferingDetail, this.listGeneralDataObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PROD_OFFERING_PAGING], {});
      }
    );
  }

  reload() {
    if (this.inputLookUpObj.jsonSelect["ProdOfferingId"] == undefined) {
      this.toastr.warningMessage("Please select Product Offering to copied");
    }
    else {
      if (confirm('This action will overwrite your Product Component and Product Branch Member, Are you sure to copy this Product ?')) {
        this.http.post(URLConstant.CopyProductOffering, { ProdOfferingHId: this.ProdOfferingHId, FromProdOfferingId: this.inputLookUpObj.jsonSelect["ProdOfferingId"] }).subscribe(
          (response) => {
            this.toastr.successMessage("Product Offering Copied Successfully");
            window.location.reload();
          }
        );
      }
    }
  }

  NextDetail(event) {
    this.generateSaveObj(event);
    this.http.post(URLConstant.AddOrEditProdOfferingDetail, this.listGeneralDataObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.wizard.goToNextStep();
      }
    );
  }

  generateSaveObj(event) {
    this.listGeneralDataObj = new ListProductOfferingDetailObj();
    this.listGeneralDataObj.ProdOfferingDetails = new Array();
    this.listGeneralDataObj.ProdOfferingHId = this.objInput["ProdOfferingHId"];
    for (var i = 0; i < event.length; i++) {
      var GeneralDataObj = new ProductOfferingDetailObj();
      GeneralDataObj.ProdOfferingDId = event[i].ProdOfferingDId;
      GeneralDataObj.ProdOfferingHId = this.objInput["ProdOfferingHId"];
      GeneralDataObj.RefProdCompntCode = event[i].RefProdCompntCode;
      GeneralDataObj.RefProdCompntGrpCode = event[i].RefProdCompntGrpCode;
      if (event[i].IsProdOffering == true) {
        GeneralDataObj.CompntValue = event[i].OfferingCompntValue;
        GeneralDataObj.CompntValueDesc = event[i].OfferingCompntValueDesc;
        GeneralDataObj.MrProdBehaviour = event[i].OfferingMrProdBehaviour;
      } else {
        GeneralDataObj.CompntValue = event[i].HOCompntValue;
        GeneralDataObj.CompntValueDesc = event[i].HOCompntValueDesc;
        GeneralDataObj.MrProdBehaviour = event[i].HOMrProdBehaviour;
      }
      this.listGeneralDataObj.ProdOfferingDetails.push(GeneralDataObj);
    }
  }

  Cancel() {
    this.BackToPaging();
  }

  BackToPaging() {
    if (this.source == "return") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PROD_OFFERING_RTN_PAGING], {});
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PROD_OFFERING_PAGING], {});
    }
  }
}
