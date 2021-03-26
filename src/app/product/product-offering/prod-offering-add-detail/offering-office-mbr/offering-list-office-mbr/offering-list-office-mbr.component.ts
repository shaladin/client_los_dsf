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
@Component({
  selector: 'app-offering-list-office-mbr',
  templateUrl: './offering-list-office-mbr.component.html'
})
export class OfferingListOfficeMbrComponent implements OnInit {

  @ViewChild(UCSearchComponent) UCSearchComponent;
  @Input() ListOfficeMemberObjInput: any;
  @Output() componentIsOn: EventEmitter<any> = new EventEmitter();
  resultData;
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

  pageNow;
  pageSize;
  apiUrl;
  ProdOfferingHId: number;
  source: string = "";

  ngOnInit() {
    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.FoundationR3Url + URLConstant.GetPagingObjectBySQL;
    this.ProdOfferingHId = this.ListOfficeMemberObjInput["param"];

    var url = URLConstant.GetListProdOfferingBranchOfficeMbrByProdHId;
    this.http.post(url, {Id : this.ProdOfferingHId}).subscribe(
      (response) => {
        this.resultData = response[CommonConstant.ReturnObj];

      }
    );
  }

  addOfficeMember() {
    // var tempIsOn = false;
    var temp = [];
    var obj;
    if (this.resultData == empty) {
      obj = {
        isOn: false,
        result: []
      }
    } else {
      for (var i = 0; i < this.resultData.length; i++) {
        temp.push(this.resultData[i].RefOfficeId);
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
      var url = URLConstant.DeleteProdOfferingOfficeMbr;
      var obj = {
        ProdOfferingBranchMbrs: [
          {
            ProdOfferingBranchMbrId: ev.ProdOfferingBranchMbrId,
            RowVersion: ""
          }
        ]
      };

      this.http.post(url, obj).subscribe(
        (response) => {
          var idx = this.resultData.findIndex(x => x.ProdOfferingBranchMbrId == ev.ProdOfferingBranchMbrId);
          if (idx > -1) this.resultData.splice(idx, 1);
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }

  DoneForm() {
    this.http.post(environment.FoundationR3Url + "/ProductOffering/SubmitProdOffering", { ProdOfferingHId: this.ProdOfferingHId }).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
      }
    );
    this.toastr.successMessage("Submitted");
    this.toastr.successMessage("Submitted");
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
