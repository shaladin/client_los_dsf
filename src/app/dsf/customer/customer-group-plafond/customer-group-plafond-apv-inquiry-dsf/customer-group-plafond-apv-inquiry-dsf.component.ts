import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CookieService } from 'ngx-cookie';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer-group-plafond-apv-inquiry-dsf',
  templateUrl: './customer-group-plafond-apv-inquiry-dsf.component.html',
  styleUrls: ['./customer-group-plafond-apv-inquiry-dsf.component.css'],
  providers: [NGXToastrService]
})
export class CustomerGroupPlafondApvInquiryDsfComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private cookieService: CookieService) {}

  ngOnInit() {
    this.inputPagingObj._url = "./assets/dsf/ucpaging/searchCustomerGroupPlafondInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/searchCustomerGroupPlafondInquiry.json";
  }

  GetCallback(ev: any) {
    
  }

}
