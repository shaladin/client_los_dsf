import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { LeadVerfObj } from 'app/shared/model/Request/LEAD/LeadVerfObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { Router } from '@angular/router';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-lead-verif',
  templateUrl: './lead-verif.component.html'
})

export class LeadVerifComponent implements OnInit {
  arrLeadVerf: Array<LeadVerfObj> = new Array();
  listSelectedId: Array<any> = new Array<any>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router) { }

  ngOnInit() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/LeadVerifTempPaging.json";
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/LeadVerifTempPaging.json";
    this.tempPagingObj.ddlEnvironments = [
      {
        name: "L.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.tempPagingObj.isReady = true;
  }

  getListTemp(ev) {
    this.listSelectedId = ev.TempListObj;
  }

  SaveLeadVerf(verifyStatus: string) {
    if (this.listSelectedId.length == 0) {
      this.toastr.warningMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }

    for (let index = 0; index < this.listSelectedId.length; index++) {
      let tempLeadVerfObj = new LeadVerfObj();
      tempLeadVerfObj.VerifyStat = verifyStatus;
      tempLeadVerfObj.LeadId = this.listSelectedId[index].LeadId;
      tempLeadVerfObj.WfTaskListId = this.listSelectedId[index].WfTaskListId
      this.arrLeadVerf.push(tempLeadVerfObj);
    }

    this.http.post(URLConstant.AddRangeLeadVerf, { LeadVerfObjs: this.arrLeadVerf }).subscribe(
      response => {
        this.toastr.successMessage(response['message']);
      }
    );
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_VERIF], {});
    });
  }
}
