import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { RdlcReportObj, ReportParamObj } from 'app/shared/model/library/RdlcReportObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CookieService } from 'ngx-cookie';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-customer-group-plafond-paging',
  templateUrl: './customer-group-plafond-paging.component.html',
  styleUrls: ['./customer-group-plafond-paging.component.css'],
  providers: [NGXToastrService]
})
export class CustomerGroupPlafondPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private cookieService: CookieService) {}

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCustomerGroupPlafondRequest.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustomerGroupPlafondRequest.json";
  }

  GetCallback(ev: any) {
    
  }

}
