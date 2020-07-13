import { Component, OnInit, ViewChild } from '@angular/core';
import { UCSearchComponent } from '@adins/ucsearch';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { InputSearchObj } from 'app/shared/model/InputSearchObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsService } from 'app/shared/services/adIns.service';
import { LeadCancelObj } from 'app/shared/model/LeadCancelObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String, StringBuilder } from 'typescript-string-operations';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-lead-cancel',
  templateUrl: './lead-cancel.component.html',
  providers: [NGXToastrService]
})

export class LeadCancelComponent implements OnInit {
  listSelectedId: Array<any> = new Array<any>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  allowedStat = ['INP', 'NEW'];
  tempLeadCancelObj: LeadCancelObj;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router) { }

  ngOnInit() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/LeadCancelTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.losUrl;
    this.tempPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/LeadCancelTempPaging.json";
    this.tempPagingObj.ddlEnvironments = [
      {
        name: "L.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "L.LEAD_STEP",
        environment: environment.FoundationR3Url
      },
      {
        name: "L.LEAD_STAT",
        environment: environment.FoundationR3Url
      }
    ];
    this.tempPagingObj.isReady = true;

    var addCrit: CriteriaObj = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "L.LEAD_STAT";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = this.allowedStat;
    this.tempPagingObj.addCritInput.push(addCrit);

    var GetListLeadVerfUrl: string = URLConstant.GetListLeadVerf;
    var temp: Array<any>;
    this.http.post(GetListLeadVerfUrl, {}).subscribe(
      response => {
        var arrMemberList = new Array();
        for (let index = 0; index < response["ReturnObject"].length; index++) {
          arrMemberList.push(response["ReturnObject"][index].LeadId)
        }
        
        this.tempPagingObj.isReady = true;
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );
  }

  getListTemp(ev) {
    this.listSelectedId = ev.TempListObj;
  }
  
  SaveLeadCancel() {
    if (this.listSelectedId.length == 0) {
      this.toastr.errorMessage('Please Add At Least One Data');
      return;
    } else if (this.listSelectedId.length > 50) {
      this.toastr.typeErrorCustom(String.Format(ExceptionConstant.MAX_DATA, 50));
      return;
    }

    this.tempLeadCancelObj = new LeadCancelObj();
    for (let index = 0; index < this.listSelectedId.length; index++) {
      this.tempLeadCancelObj.LeadIds.push(this.listSelectedId[index].LeadId);
      if (this.listSelectedId[index].WfTaskListId != null && this.listSelectedId[index].WfTaskListId != undefined)
        this.tempLeadCancelObj.listWfTaskListId.push(this.listSelectedId[index].WfTaskListId)
    }

    var params: string = this.tempLeadCancelObj.LeadIds.join(',')
    var taskListId: string = this.tempLeadCancelObj.listWfTaskListId.join(',')
    this.router.navigate(["/Lead/ConfirmCancel"], { queryParams: { "LeadIds": params, "WfTaskListIds": taskListId } });
  }


}
