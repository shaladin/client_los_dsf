import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-sharing-pre-go-live-request-for-approval',
  templateUrl: './pre-go-live-request-for-approval.component.html',
  styleUrls: ['./pre-go-live-request-for-approval.component.scss']
})
export class PreGoLiveRequestForApprovalComponent implements OnInit {
  viewObj: string;
  AppId: any;
  itemApprovedBy: any;

  MainInfoForm = this.fb.group({
    Reason: ['', Validators.required],
    ApprovedBy: ['', Validators.required],
    Notes: ['', Validators.required]
  })
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    });
  }

  ngOnInit() {
    var schmCodeObj = {
      SchmCode : "PRE_GLV_APV_CF",
      RowVersion : ""
    }
    this.http.post(AdInsConstant.GetListApprovedByForPreGoLive, schmCodeObj).subscribe(
      (response) => {
        this.itemApprovedBy = response["ReturnObject"];
        this.MainInfoForm.patchValue({
          ApprovedBy: this.itemApprovedBy[0].Key
        });
      }
    );
    this.viewObj = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLive.json";
  }

}
