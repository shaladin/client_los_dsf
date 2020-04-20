import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';

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
    this.http.post(AdInsConstant.GetCustDataByAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        this.CustNo = response["AppCustObj"]["CustNo"];
        console.log(this.CustNo);
        this.http.post(AdInsConstant.GetAgrmntByCustNo, { CustNo: this.CustNo }).subscribe(
          (response) => {
            console.log(response);
            this.ExstAgrmnt = response;
          });
        this.http.post(AdInsConstant.GetAppByCustNoAndAppStat, { CustNo: this.CustNo }).subscribe(
          (response) => {
            console.log(response);
            this.AppRjct = response;
          });
          this.http.post(AdInsConstant.GetAppByCustNoAndIsAppInitDone, { CustNo: this.CustNo }).subscribe(
            (response) => {
              console.log(response);
              this.AppPrcs = response;
            });
      });
  }

}
