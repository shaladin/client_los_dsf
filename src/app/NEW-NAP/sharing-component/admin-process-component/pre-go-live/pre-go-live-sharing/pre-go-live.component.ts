import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';

@Component({
  selector: 'app-sharing-pre-go-live',
  templateUrl: './pre-go-live.component.html',
  styleUrls: ['./pre-go-live.component.scss']
})
export class PreGoLiveComponent implements OnInit {

  AppId: any;
  AgrmntId: any;
  result: any;
  viewObj: string;
  appTC : any;

  MainInfoForm = this.fb.group({
    AgrmntCreatedDt: ['', Validators.required],
    EffectiveDt: ['', Validators.required],
    Notes: ['', Validators.required],
    ApprovalStatus: ['']
  })
  listAppTCObj: ListAppTCObj;



  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    });
  }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLive.json";
    console.log("testets");
    var agrmntObj = new AgrmntObj;
    agrmntObj.AppId = this.AppId;
    this.http.post(AdInsConstant.GetAgrmntByAppId, agrmntObj).subscribe(
      (response) => {
        this.result = response;
        this.MainInfoForm.patchValue({
          AgrmntCreatedDt: formatDate(this.result.AgrmntCreatedDt, 'yyyy-MM-dd', 'en-US'),
          EffectiveDt: formatDate(this.result.EffectiveDt, 'yyyy-MM-dd', 'en-US'),
        })
      },
      (error) => {
        console.log(error);
      }
    );
  }

  SaveForm(){
    
    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();

    for(var i = 0; i < this.MainInfoForm.value.TCList["length"]; i++){
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.MainInfoForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.MainInfoForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.MainInfoForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.MainInfoForm.value.TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.MainInfoForm.value.TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.MainInfoForm.value.TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.MainInfoForm.value.TCList[i].Notes;
      this.listAppTCObj.AppTCObj.push(this.appTC);
    }
    console.log("isi apptc obj");
    console.log(this.listAppTCObj);
  }

}
