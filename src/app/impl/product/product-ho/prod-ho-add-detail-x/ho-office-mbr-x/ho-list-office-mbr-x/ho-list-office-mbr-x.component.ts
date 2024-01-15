import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResGetProdBranchMbrObj, ResProdBranchMbrObj } from 'app/shared/model/response/product/res-get-prod-branch-mbr-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ProdOfficePassingObj } from 'app/product/product-ho/prod-ho-add-detail/ProdOfficePassingObj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-ho-list-office-mbr-x',
  templateUrl: './ho-list-office-mbr-x.component.html'
})
export class HoListOfficeMbrXComponent implements OnInit {

  
  @Input() ProdHId : number;
  @Output() ComponentIsOn: EventEmitter<ProdOfficePassingObj> = new EventEmitter<ProdOfficePassingObj>();
  Source: string = "";
  GenericByIdObj: GenericObj = new GenericObj();
  PassingObj: ProdOfficePassingObj = new ProdOfficePassingObj();
  ResListProdBranchMbrObj: Array<ResProdBranchMbrObj> = new Array<ResProdBranchMbrObj>();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      this.Source = params["source"];
    })
  }

  ngOnInit() {
    this.GenericByIdObj.Id = this.ProdHId;
    this.http.post(URLConstant.GetListProdBranchOfficeMbrByProdHId, this.GenericByIdObj).subscribe(
      (response: ResGetProdBranchMbrObj) => {
        this.ResListProdBranchMbrObj = response.ReturnObject;
      }
    );
  }

  addOfficeMember() {
    if (this.ResListProdBranchMbrObj.length != 0) {
      for (var i = 0; i < this.ResListProdBranchMbrObj.length; i++) {
        this.PassingObj.result.push(this.ResListProdBranchMbrObj[i].OfficeCode);
      }
    }

    this.ComponentIsOn.emit(this.PassingObj);
  }

  deleteFromList(ProdBranchMbrId: number) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.GenericByIdObj.Id = ProdBranchMbrId;
      this.http.post(URLConstant.DeleteProductOfficeMbr, this.GenericByIdObj).subscribe(
        (response) => {
          let idx = this.ResListProdBranchMbrObj.findIndex(x => x.ProdBranchMbrId == ProdBranchMbrId);
          if (idx > -1) this.ResListProdBranchMbrObj.splice(idx, 1);
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }

  DoneForm() {
    this.GenericByIdObj.Id = this.ProdHId;

    let SubmitProductUrl = environment.isCore ? URLConstant.SubmitProductV2 : URLConstant.SubmitProduct;
    this.http.post(SubmitProductUrl, this.GenericByIdObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
      }
    );
    this.BackToPaging();
  }

  Cancel() {
    this.BackToPaging();
  }

  BackToPaging() {
    if (this.Source == "return") {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_RTN_PAGING_X],{ });
    }
    else {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_PAGING_X],{ });
    }
  }
}
