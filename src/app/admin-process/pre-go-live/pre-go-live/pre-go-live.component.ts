import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';

@Component({
  selector: 'app-pre-go-live',
  templateUrl: './pre-go-live.component.html',
  styleUrls: ['./pre-go-live.component.scss']
})
export class PreGoLiveComponent implements OnInit {

  AppId: any;
  AgrmntId: any;
  result: any;
  viewObj: string;

  MainInfoForm = this.fb.group({
    AgrmntCreatedDt: ['', Validators.required],
    EffectiveDt: ['', Validators.required],
    Notes: ['', Validators.required],
    ApprovalStatus: ['']
  })



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

}
