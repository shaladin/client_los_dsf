import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { MouCustDocPrintForViewObj } from 'app/shared/model/MouCustDocPrintForViewObj.model';

@Component({
  selector: 'app-customer-doc-printing-detail',
  templateUrl: './customer-doc-printing-detail.component.html',
})
export class CustomerDocPrintingDetailComponent implements OnInit {
  
  MouCustId: number;
  responseObj: Array<MouCustDocPrintForViewObj> = new Array<MouCustDocPrintForViewObj>();
  mouCustObj: MouCustObj;
  readonly CancelLink: string = NavigationConstant.MOU_CUST_DOC_PAGING;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
      }
    });
  }

  ngOnInit(): void {
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.http.post(URLConstant.GetListMouCustDocPrintForViewByMouCustId, { Id: this.MouCustId }).subscribe(
      response => {
        this.responseObj = response[CommonConstant.ReturnObj];
      },
      () => {
        this.router.navigateByUrl('Error');
      }
    );
  }

  searchRowVersion(MouCustDocPrintId) {
    for (var i = 0; i < this.responseObj.length; i++) {
      if (this.responseObj[i]["MouCustDocPrintId"] == MouCustDocPrintId) {
        return this.responseObj[i]["RowVersion"];
      }
    }
    return null;
  }

  print(MouCustDocPrintId) {
    var mouObj = { Id: MouCustDocPrintId, RowVersion: this.searchRowVersion(MouCustDocPrintId) };
    this.http.post(URLConstant.EditMouCustDocPrintSequenceNo, mouObj).subscribe(
      response => {
        var mouCustObj = { Id: this.MouCustId };
        this.http.post(URLConstant.GetListMouCustDocPrintForViewByMouCustId, mouCustObj).subscribe(
          response => {
            this.responseObj = response[CommonConstant.ReturnObj];
          },
          () => {
            this.router.navigateByUrl('Error');
          }
        );
      },
      () => {
        this.router.navigateByUrl('Error');
      }
    );
  }
}
