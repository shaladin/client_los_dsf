import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-cust-history',
  templateUrl: './cust-history.component.html',
  styleUrls: []
})
export class CustHistoryComponent implements OnInit {


  @Input() AppId: any;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  CustNo: any;
  result: any;
  ExstAgrmnt: any;
  AppRjct: any;
  AppPrcs: any;

  ngOnInit() {
    this.http.post(URLConstant.GetCustDataByAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        this.CustNo = response["AppCustObj"]["CustNo"];
        this.http.post(URLConstant.GetAgrmntByCustNo, { CustNo: this.CustNo }).subscribe(
          (response) => {
            this.ExstAgrmnt = response;
          });
        this.http.post(URLConstant.GetAppByCustNoAndAppStat, { CustNo: this.CustNo,AppStat:"REJECT" }).subscribe(
          (response) => {
            this.AppRjct = response;
          });
          this.http.post(URLConstant.GetAppByCustNoAndIsAppInitDone, { CustNo: this.CustNo,IsAppInitDone: false }).subscribe(
            (response) => {
              this.AppPrcs = response;
            });
      });
  }

}
