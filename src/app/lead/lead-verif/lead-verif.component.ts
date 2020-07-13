import { Component, OnInit, ViewChild } from '@angular/core';
import { UCSearchComponent } from '@adins/ucsearch';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { InputSearchObj } from 'app/shared/model/InputSearchObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsService } from 'app/shared/services/adIns.service';
import { LeadVerfObj } from 'app/shared/model/LeadVerfObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';

@Component({
  selector: 'app-lead-verif',
  templateUrl: './lead-verif.component.html',
  providers: [NGXToastrService]
})

export class LeadVerifComponent implements OnInit {
  arrLeadVerf: Array<LeadVerfObj> = new Array();
  listSelectedId: Array<any> = new Array<any>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  
  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,) { }

  ngOnInit() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/LeadVerifTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.losUrl;
    this.tempPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
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
  
  SaveLeadVerf(verifyStatus : string) {
    if (this.listSelectedId.length == 0) {
      this.toastr.errorMessage('Please Add At Least One Data');
      return;
    } 

    for (let index = 0; index < this.listSelectedId.length; index++) {
      var tempLeadVerfObj = new LeadVerfObj();
      tempLeadVerfObj.VerifyStat = verifyStatus;
      tempLeadVerfObj.LeadId = this.listSelectedId[index].LeadId;
      tempLeadVerfObj.WfTaskListId = this.listSelectedId[index].WfTaskListId
      this.arrLeadVerf.push(tempLeadVerfObj);
    }

    this.http.post(URLConstant.AddRangeLeadVerf, {LeadVerfObjs: this.arrLeadVerf}).subscribe(
      response => {
        console.log(response);
        this.toastr.successMessage(response['message']);
      },
      error => {
        console.log(error);
      }
    );
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/Lead/Verif']);
    });
  }
}