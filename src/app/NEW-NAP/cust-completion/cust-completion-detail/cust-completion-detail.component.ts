import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-cust-completion-detail',
  templateUrl: './cust-completion-detail.component.html',
  styleUrls: ['./cust-completion-detail.component.scss']
})
export class CustCompletionDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  inputGridObj: InputGridObj = new InputGridObj();
  listCustCompletion: Array<any> = new Array(); 
  AppId: number;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NGXToastrService) {
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustCompletionData.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      }
    ];
    
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucpaging/gridCustCompletionData.json";
  }

  loadCustCompletionListData() {
    this.http.post(URLConstant.GetListAppCustCompletion, {AppId : this.AppId}).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response;
        this.listCustCompletion = this.inputGridObj.resultData.Data;
      }
    );
  }

  GetCallback(event){}

  GetEvent(event){
    
  }
}
