import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj  } from "app/shared/model/UcPagingObj.Model";
import { environment } from 'environments/environment';

@Component({
  selector: 'app-mou-unfreeze-paging',
  templateUrl: './mou-unfreeze-paging.component.html',
})
export class MouUnfreezePagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();;

  constructor(private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService) {
      this.route.queryParams.subscribe((params) => {});
  }

  ngOnInit(): void {
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;

    this.inputPagingObj.pagingJson =
      "./assets/ucpaging/searchMouFreezeUnfreezePaging.json";
    this.inputPagingObj._url =
      "./assets/ucpaging/searchMouFreezeUnfreezePaging.json";
  }

  getEvent(event) {
    if(event.Key == "customer"){
        var custObj = { CustNo: event.RowObj.CustNo };
        this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
          response => {
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
        );
    }
  }
}
