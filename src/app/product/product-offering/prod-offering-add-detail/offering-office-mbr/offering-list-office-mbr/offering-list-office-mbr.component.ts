import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UCSearchComponent } from '@adins/ucsearch';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResGetListProdOfferingBranchMbrObj, ResProdOfferingBranchOfficeMbrObj } from 'app/shared/model/Response/Product/ResGetProdOfferingBranchMbrObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ProdOfficePassingObj } from 'app/product/product-ho/prod-ho-add-detail/ProdOfficePassingObj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-offering-list-office-mbr',
  templateUrl: './offering-list-office-mbr.component.html'
})
export class OfferingListOfficeMbrComponent implements OnInit {

  @ViewChild(UCSearchComponent) UCSearchComponent;
  @Input() ProdOfferingHId: number;
  @Output() ComponentIsOn: EventEmitter<ProdOfficePassingObj> = new EventEmitter<ProdOfficePassingObj>();
  Source: string = "";
  GenericByIdObj: GenericObj = new GenericObj();
  PassingObj: ProdOfficePassingObj = new ProdOfficePassingObj();
  ListProdOfferingBranchMbr : Array<ResProdOfferingBranchOfficeMbrObj> = new Array<ResProdOfferingBranchOfficeMbrObj>();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      this.Source = params["source"];
    });
  }

  ngOnInit() {
    this.GenericByIdObj.Id = this.ProdOfferingHId;
    this.http.post(URLConstant.GetListProdOfferingBranchOfficeMbrByProdHId, this.GenericByIdObj).subscribe(
      (response : ResGetListProdOfferingBranchMbrObj) => {
        this.ListProdOfferingBranchMbr = response.ReturnObject;
      }
    );
  }

  addOfficeMember() {
    if (this.ListProdOfferingBranchMbr.length != 0) {
      for (var i = 0; i < this.ListProdOfferingBranchMbr.length; i++) {
        this.PassingObj.result.push(this.ListProdOfferingBranchMbr[i].OfficeCode);
      }
    }
    this.ComponentIsOn.emit(this.PassingObj);
  }

  deleteFromList(ProdOfferingBranchMbrId: number) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.GenericByIdObj.Id = ProdOfferingBranchMbrId;
      this.http.post(URLConstant.DeleteProdOfferingOfficeMbr, this.GenericByIdObj).subscribe(
        (response) => {
          let idx = this.ListProdOfferingBranchMbr.findIndex(x => x.ProdOfferingBranchMbrId == ProdOfferingBranchMbrId);
          if (idx > -1) this.ListProdOfferingBranchMbr.splice(idx, 1);
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }

  DoneForm() {
    this.GenericByIdObj.Id = this.ProdOfferingHId;
    this.http.post(URLConstant.SubmitProdOffering, this.GenericByIdObj).subscribe(
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
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_RTN_PAGING],{ });
    }
    else {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_PAGING],{ });
    }
  }
}
