import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { DatePipe } from '@angular/common';
import { MainInfoComponent } from 'app/view/main-info/main-info.component';

@Component({
  selector: 'app-mou-review-general',
  templateUrl: './mou-review-general.component.html',
  styleUrls: ['./mou-review-general.component.scss'],
  providers: [NGXToastrService]
})
export class MouReviewGeneralComponent implements OnInit {
  mouCustObj: MouCustObj;
  MouCustId : any;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];
    })
  }

  ngOnInit() {
  }
}
