import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { OutstandingTcObj } from 'app/shared/model/OutstandingTcObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-outstanding-tc-detail',
  templateUrl: './outstanding-tc-detail.component.html',
  providers: [NGXToastrService]
})
export class OutstandingTcDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: number;
  listAppTCObj: any;
  appTC: any;
  outstandingTcObj: any;
  BizTemplateCode: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.BizTemplateCode = params["BizTemplateCode"];
    });
  }

  OustandingTCForm = this.fb.group({});

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewOutstandingTC.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
    ];
  }

  SaveForm() {
    this.outstandingTcObj = new OutstandingTcObj();

    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();

    for (var i = 0; i < this.OustandingTCForm.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.OustandingTCForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.OustandingTCForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.OustandingTCForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.OustandingTCForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.OustandingTCForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.OustandingTCForm.getRawValue().TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.OustandingTCForm.getRawValue().TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.OustandingTCForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.OustandingTCForm.getRawValue().TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.OustandingTCForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.OustandingTCForm.value.TCList[i].Notes;
      this.listAppTCObj.AppTCObj.push(this.appTC);
    }

    this.outstandingTcObj.ListAppTCObj = this.listAppTCObj.AppTCObj;

    this.http.post(URLConstant.SubmitOutstandingTc, this.outstandingTcObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Nap/AddProcess/OutstandingTC/Paging"], { queryParams: { BizTemplateCode: this.BizTemplateCode } });
      }
    );
  }

  Back() {
    this.router.navigate(['/Nap/AddProcess/OutstandingTC/Paging'], { queryParams: { BizTemplateCode: this.BizTemplateCode } });
  }
}
