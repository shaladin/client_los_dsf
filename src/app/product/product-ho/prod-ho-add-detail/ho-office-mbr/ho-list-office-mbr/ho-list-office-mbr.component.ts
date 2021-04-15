import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UCSearchComponent } from '@adins/ucsearch';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { empty } from 'rxjs';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResGetProdBranchMbrObj, ResProdBranchMbrObj } from 'app/shared/model/Response/Product/ResGetProdBranchMbrObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-ho-list-office-mbr',
  templateUrl: './ho-list-office-mbr.component.html'
})
export class HoListOfficeMbrComponent implements OnInit {

  @ViewChild(UCSearchComponent) UCSearchComponent;
  @Input() ListOfficeMemberObjInput: any;
  @Output() componentIsOn: EventEmitter<any> = new EventEmitter();
  source: string = "";
  pageNow : number;
  pageSize : number;
  apiUrl : string;
  ProdHId : number;
  orderByKey;
  orderByValue;
  GenericByIdObj: GenericObj = new GenericObj();
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

    this.ProdHId = this.ListOfficeMemberObjInput["ProdHId"];
    var obj = {
      ProdHId: this.ListOfficeMemberObjInput["ProdHId"],
      RowVersion: ""
    }

    this.GenericByIdObj.Id = this.ListOfficeMemberObjInput["ProdHId"];
    this.http.post(URLConstant.GetListProdBranchOfficeMbrByProdHId, this.GenericByIdObj).subscribe(
      (response: ResGetProdBranchMbrObj) => {
        this.ResListProdBranchMbrObj = response.ReturnObject;
      }
    );
  }

  addOfficeMember() {
    var temp = [];
    var obj;
    if (this.ResListProdBranchMbrObj.length == 0) {
      obj = {
        isOn: false,
        result: []
      }
    } else {
      for (var i = 0; i < this.ResListProdBranchMbrObj.length; i++) {
        temp.push(this.ResListProdBranchMbrObj[i].OfficeCode);
      }
      obj = {
        isOn: false,
        result: temp
      }
    }

    this.componentIsOn.emit(obj);
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
    if (confirm('Are you sure to delete this record?')) {
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
