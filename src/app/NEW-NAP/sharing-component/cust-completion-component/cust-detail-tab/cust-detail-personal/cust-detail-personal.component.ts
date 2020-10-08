import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';

@Component({
  selector: 'app-cust-detail-personal',
  templateUrl: './cust-detail-personal.component.html',
  styleUrls: ['./cust-detail-personal.component.scss']
})
export class CustDetailPersonalComponent implements OnInit {

  AppCustId: number;

  CustDetailForm = this.fb.group({
    CustModelCode: [],
    FamilyCardNo: [],
    NoOfDependents: [],
    NoOfResidence: [],
    IsVip: [],
    IsAffiliateWithMF: [],
    NickName: [],
    MrNationalityCode: [],
    NationalityCountryCode: [],
    MrEducationCode: [],
    MrReligionCode: []
  })

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params['AppCustId'] != null) {
        this.AppCustId = params['AppCustId'];
      }
    });
  }

  ngOnInit() {
    
  }

}
