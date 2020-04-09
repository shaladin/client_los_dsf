import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { GuarantorObj } from 'app/shared/model/GuarantorObj.Model';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
import { RequestAppCrdInvstgObj } from 'app/shared/model/AppCrdInvstg/RequestAppCrdInvstgObj.Model';
import { AppCrdInvstgDObj } from 'app/shared/model/AppCrdInvstg/AppCrdInvstgDObj.Model';

@Component({
  selector: 'app-view-app-cust-data',
  templateUrl: './view-app-cust-data.component.html',
  styleUrls: []
})
export class ViewAppCustDataComponent implements OnInit {

  @Input() appId: number;
  viewMainDataObj: string;
  arrValue = [];

  constructor(private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
  }

  ngOnInit(){
    this.arrValue.push(this.appId);
    this.viewMainDataObj = "./assets/ucviewgeneric/viewAppCustPersonalMainData.json";
  }
}
