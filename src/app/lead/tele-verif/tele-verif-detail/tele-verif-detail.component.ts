import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Stepper from 'bs-stepper';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ClaimTaskService } from 'app/shared/claimTask.service';

@Component({
  selector: 'app-tele-verif-detail',
  templateUrl: './tele-verif-detail.component.html',
})
export class TeleVerifDetailComponent implements OnInit {
  private stepper: Stepper;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  isCustData: boolean;
  isLeadData: boolean;
  WfTaskListId: number;

  readonly CancelLink: string = NavigationConstant.LEAD_TELE_VERIF_PAGING;
  constructor(private http: HttpClient, private route: ActivatedRoute, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      this.WfTaskListId = params["WfTaskListId"];
    })
  }

  ngOnInit() {
    if (this.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewLeadHeader.json";

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
    this.EnterTab('custData');
    this.stepper.to(1);
  }

  EnterTab(type) {
    if (type == "custData") {
      this.isCustData = true;
      this.isLeadData = false;
    }
    else if (type == "leadData") {
      this.isCustData = false;
      this.isLeadData = true;
    }
  }

  getValue(ev) {
    if (ev.stepMode != undefined) {
      if (ev.stepMode == "next") {
        this.stepper.next();
        this.EnterTab("leadData");
      }
      else
        this.stepper.previous();
    }
  }
}
