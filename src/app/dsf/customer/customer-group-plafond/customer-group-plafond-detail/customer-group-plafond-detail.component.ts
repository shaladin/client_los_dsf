import { Component, OnInit, ViewChild } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { ReceiptDsfObj } from 'app/dsf/model/ReceiptDsfObj.Model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-group-plafond-detail',
  templateUrl: './customer-group-plafond-detail.component.html',
  styleUrls: ['./customer-group-plafond-detail.component.css'],
  providers: [NGXToastrService]
})
export class CustomerGroupPlafondDetailComponent implements OnInit {

  viewCessieDetailObj: UcViewGenericObj = new UcViewGenericObj();
  pageType: string = "add";
  CessieNo: string;
  resultData: any;

  plafondProposalForm = this.fb.group({
    PlafondMax: ['',Validators.required],
    StartPlafondDate: ['',Validators.required],
    EndPlafondDate: ['',Validators.required],
  });
  readonly CancelLink: string = NavigationConstantDsf.CUSTOMER_GROUP_PLAFOND_PAGING;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] != null) {
        this.pageType = params['mode'];
      }
      if (params['CessieNo'] != null) {
        this.CessieNo = params['CessieNo'];
      }
    });
  }


 
  ngOnInit() {
    this.viewCessieDetailObj.viewInput = "./assets/ucviewgeneric/viewCessieDetail.json";
    var datePipe = new DatePipe("en-US");
    if (this.pageType == "add") {
    }
    else if (this.pageType == "edit") {
      
    }
  }

  SaveForm():void {
    

    if (this.pageType == "add") {
      
  }
  else {

  }
  }

}
