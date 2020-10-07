import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-cust-completion-paging',
  templateUrl: './cust-completion-paging.component.html',
  styleUrls: ['./cust-completion-paging.component.scss']
})
export class CustCompletionPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() {}

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchCustCompletion.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustCompletion.json";
  }

}
