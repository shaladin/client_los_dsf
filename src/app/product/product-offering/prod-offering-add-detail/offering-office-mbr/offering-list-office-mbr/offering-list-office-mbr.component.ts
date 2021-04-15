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
import { environment } from 'environments/environment';
import { ProdOfficePassingObj } from 'app/shared/model/Product/ProdOfficePassingObj.model';

@Component({
  selector: 'app-offering-list-office-mbr',
  templateUrl: './offering-list-office-mbr.component.html'
})
export class OfferingListOfficeMbrComponent implements OnInit {

  @ViewChild(UCSearchComponent) UCSearchComponent;
  @Input() ProdOfferingHId: number;
  @Output() componentIsOn: EventEmitter<ProdOfficePassingObj> = new EventEmitter();
  source: string = "";pageNow : number;
  pageSize : number;
  apiUrl : string;
  ProdHId : number;
  orderByKey;
  orderByValue;
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
      this.source = params["source"];
    });
  }

  ngOnInit() {
    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.losUrl + URLConstant.GetPagingObjectBySQL;

    this.GenericByIdObj.Id = this.ProdOfferingHId;
    this.http.post(URLConstant.GetListProdOfferingBranchOfficeMbrByProdHId, this.GenericByIdObj).subscribe(
      (response : ResGetListProdOfferingBranchMbrObj) => {
        this.ListProdOfferingBranchMbr = response.ReturnObject;
      }
    );
  }

  addOfficeMember() {
    if (this.ListProdOfferingBranchMbr.length != 0) {
    } else {
      for (var i = 0; i < this.ListProdOfferingBranchMbr.length; i++) {
        this.PassingObj.result.push(this.ListProdOfferingBranchMbr[i].OfficeCode);
      }
    }

    this.componentIsOn.emit(this.PassingObj);
  }

  deleteFromList(ev: any) {
    if (confirm('Are you sure to delete this record?')) {
      this.GenericByIdObj.Id = ev.ProdOfferingBranchMbrId;
      this.http.post(URLConstant.DeleteProdOfferingOfficeMbr, this.GenericByIdObj).subscribe(
        (response) => {
          var idx = this.ListProdOfferingBranchMbr.findIndex(x => x.ProdOfferingBranchMbrId == ev.ProdOfferingBranchMbrId);
          if (idx > -1) this.ListProdOfferingBranchMbr.splice(idx, 1);
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }

  searchSort(ev: any) {
    if (this.ListProdOfferingBranchMbr != null) {
      if (this.orderByKey == ev.target.attributes.name.nodeValue) {
        this.orderByValue = !this.orderByValue
      } else {
        this.orderByValue = true
      }
      this.orderByKey = ev.target.attributes.name.nodeValue
      let order = {
        key: this.orderByKey,
        value: this.orderByValue
      }
      this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order)
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
    if (this.source == "return") {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_RTN_PAGING],{ });
    }
    else {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_PAGING],{ });
    }
  }
}
