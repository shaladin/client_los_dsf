import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UCSearchComponent } from '@adins/ucsearch';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResGetListProdOfferingBranchMbrObj, ResGetProdOfferingBranchMbrObj, ResProdOfferingBranchOfficeMbrObj } from 'app/shared/model/Response/Product/ResGetProdOfferingBranchMbrObj.model';

@Component({
  selector: 'app-offering-list-office-mbr',
  templateUrl: './offering-list-office-mbr.component.html'
})
export class OfferingListOfficeMbrComponent implements OnInit {

  @ViewChild(UCSearchComponent) UCSearchComponent;
  @Input() ListOfficeMemberObjInput: any;
  @Output() componentIsOn: EventEmitter<any> = new EventEmitter();
  ListProdOfferingBranchMbr : Array<ResProdOfferingBranchOfficeMbrObj> = new Array<ResProdOfferingBranchOfficeMbrObj>();
  ProdOfferingHId: number;
  source: string = "";

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
    this.ProdOfferingHId = this.ListOfficeMemberObjInput["ProdOfferingHId"];

    this.http.post(URLConstant.GetListProdOfferingBranchOfficeMbrByProdHId, {Id : this.ProdOfferingHId}).subscribe(
      (response : ResGetListProdOfferingBranchMbrObj) => {
        this.ListProdOfferingBranchMbr = response.ReturnObject;
      }
    );
  }

  addOfficeMember() {
    // var tempIsOn = false;
    var temp = [];
    var obj;
    if (this.ListProdOfferingBranchMbr.length == 0) {
      obj = {
        isOn: false,
        result: []
      }
    } else {
      for (var i = 0; i < this.ListProdOfferingBranchMbr.length; i++) {
        temp.push(this.ListProdOfferingBranchMbr[i].OfficeCode);
      }
      obj = {
        isOn: false,
        result: temp
      }
    }

    this.componentIsOn.emit(obj);
  }

  deleteFromList(ev: any) {
    if (confirm('Are you sure to delete this record?')) {
      var obj = {
        ProdOfferingBranchMbrs: [
          {
            ProdOfferingBranchMbrId: ev.ProdOfferingBranchMbrId,
            RowVersion: ""
          }
        ]
      };

      this.http.post(URLConstant.DeleteProdOfferingOfficeMbr, obj).subscribe(
        (response) => {
          var idx = this.ListProdOfferingBranchMbr.findIndex(x => x.ProdOfferingBranchMbrId == ev.ProdOfferingBranchMbrId);
          if (idx > -1) this.ListProdOfferingBranchMbr.splice(idx, 1);
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }

  DoneForm() {
    this.http.post(URLConstant.SubmitProdOffering, { Id: this.ProdOfferingHId }).subscribe(
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
