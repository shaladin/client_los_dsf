import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UCSearchComponent } from '@adins/ucsearch';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { empty } from 'rxjs';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericListByIdObj } from 'app/shared/model/Generic/GenericListByIdObj.model';
import { ResGetProdBranchMbrObj } from 'app/shared/model/Response/Product/ResGetProdBranchMbrObj.model';

@Component({
  selector: 'app-ho-list-office-mbr',
  templateUrl: './ho-list-office-mbr.component.html'
})
export class HoListOfficeMbrComponent implements OnInit {

  @ViewChild(UCSearchComponent) UCSearchComponent;
  @Input() ListOfficeMemberObjInput: any;
  @Output() componentIsOn: EventEmitter<any> = new EventEmitter();
  GenericListByIdObj: GenericListByIdObj

  resultData;
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

  source: string = "";
  pageNow;
  pageSize;
  apiUrl;
  ProdHId;
  ngOnInit() {
    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.losUrl + URLConstant.GetPagingObjectBySQL;

    this.ProdHId = this.ListOfficeMemberObjInput["ProdHId"];
    var obj = {
      ProdHId: this.ListOfficeMemberObjInput["ProdHId"],
      RowVersion: ""
    }

    this.http.post(URLConstant.GetListProdBranchOfficeMbrByProdHId, {Id : this.ListOfficeMemberObjInput["ProdHId"]}).subscribe(
      (response: ResGetProdBranchMbrObj) => {
        this.resultData = response.ReturnObj;
      }
    );
  }

  addOfficeMember() {
    var temp = [];
    var obj;
    if (this.resultData == empty) {
      obj = {
        isOn: false,
        result: []
      }
    } else {
      for (var i = 0; i < this.resultData.length; i++) {
        temp.push(this.resultData[i].OfficeCode);
      }
      obj = {
        isOn: false,
        result: temp
      }
    }

    this.componentIsOn.emit(obj);
  }

  orderByKey;
  orderByValue
  searchSort(ev: any) {
    if (this.resultData != null) {
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
    if (confirm('Are you sure to delete this record?')) {
      this.GenericListByIdObj = ev.ProdBranchMbrId;

      this.http.post(URLConstant.DeleteProductOfficeMbr, this.GenericListByIdObj).subscribe(
        (response) => {
          var idx = this.resultData.findIndex(x => x.ProdBranchMbrId == ev.ProdBranchMbrId);
          if (idx > -1) this.resultData.splice(idx, 1);
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }

  DoneForm() {
    this.http.post(URLConstant.SubmitProduct, { Id: this.ProdHId }).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
      }
    );
    this.toastr.successMessage("Submitted");
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
