import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UCSearchComponent } from '@adins/ucsearch';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResGetProdBranchMbrObj, ResProdBranchMbrObj } from 'app/shared/model/Response/Product/ResGetProdBranchMbrObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ProdOfficePassingObj } from 'app/shared/model/Product/ProdOfficePassingObj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-ho-list-office-mbr',
  templateUrl: './ho-list-office-mbr.component.html'
})
export class HoListOfficeMbrComponent implements OnInit {

  @ViewChild(UCSearchComponent) UCSearchComponent;
  @Input() ProdHId : number;
  @Output() componentIsOn: EventEmitter<any> = new EventEmitter();
  source: string = "";
  pageNow : number;
  pageSize : number;
  apiUrl : string;
  orderByKey;
  orderByValue;
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
      this.source = params["source"];
    })
  }

  ngOnInit() {
    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.losUrl + URLConstant.GetPagingObjectBySQL;

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

    this.componentIsOn.emit(this.PassingObj);
  }

  searchSort(ev: any) {
    if (this.ResListProdBranchMbrObj != null) {
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

  deleteFromList(ev: any) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.GenericByIdObj.Id = ev.ProdBranchMbrId;

      this.http.post(URLConstant.DeleteProductOfficeMbr, this.GenericByIdObj).subscribe(
        (response) => {
          var idx = this.ResListProdBranchMbrObj.findIndex(x => x.ProdBranchMbrId == ev.ProdBranchMbrId);
          if (idx > -1) this.ResListProdBranchMbrObj.splice(idx, 1);
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }

  DoneForm() {
    this.GenericByIdObj.Id = this.ProdHId;
    this.http.post(URLConstant.SubmitProduct, this.GenericByIdObj).subscribe(
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
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_RTN_PAGING],{ });
    }
    else {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_PAGING],{ });
    }
  }
}
