import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { Validators, FormBuilder } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { Location, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-execution-detail',
  templateUrl: './mou-execution-detail.component.html',
  styleUrls: ['./mou-execution-detail.component.scss']
})
export class MouExecutionDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  businessDt: Date;
  MouCustId: number;
  WfTaskListId: number;

  MouExecutionForm = this.fb.group({
    MouCustId: [''],
    WfTaskListId: [''],
    MouCustDt: ['', [Validators.required]],
    StartDt: ['', [Validators.required]],
    EndDt: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private router: Router) {
      this.route.queryParams.subscribe(params => {
        if (params['MouCustId'] != null) {
          this.MouCustId = params['MouCustId'];
          this.MouExecutionForm.controls.MouCustId.setValue(this.MouCustId);
        }
        if (params['WfTaskListId'] != null) {
          this.WfTaskListId = params['WfTaskListId'];
          this.MouExecutionForm.controls.WfTaskListId.setValue(this.WfTaskListId);
        }
      });
    }

  ngOnInit() {
    var datePipe = new DatePipe("en-US");
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    if (currentUserContext != null && currentUserContext != undefined) {
      this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
      this.businessDt.setDate(this.businessDt.getDate() - 1);
    }

    this.httpClient.post(URLConstant.GetMouCustById, {MouCustId: this.MouCustId}).subscribe(
      (response: any) => {
        response["StartDt"] = datePipe.transform(response["StartDt"], "yyyy-MM-dd");
        response["EndDt"] = datePipe.transform(response["EndDt"], "yyyy-MM-dd");
        this.MouExecutionForm.patchValue({
          StartDt: response["StartDt"],
          EndDt: response["EndDt"]
        });
      });

    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouRequest.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
  }

  Back() {
    this.location.back();
  }

  SaveForm() {
    var request = this.MouExecutionForm.value;
    this.httpClient.post(URLConstant.MouCustExecutionActivity, request).subscribe(
      (response: any) => {
        this.toastr.successMessage(response["Message"]);
        this.router.navigate(['/Mou/Execution/Paging']);
      });

  }
}
