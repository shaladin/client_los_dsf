import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';

@Component({
  selector: 'app-dup-check-md-subj-list',
  templateUrl: './dup-check-md-subj-list.component.html',
  styleUrls: []
})
export class DupCheckMdSubjListComponent implements OnInit {

  appId: number;
  wfTaskListId: number;
  viewMainInfoObj: UcViewGenericObj = new UcViewGenericObj();
  gridSubjectObj: InputGridObj = new InputGridObj();
  addObj: object = {};

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: NGXToastrService, 
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) this.appId = params['AppId'];
      if (params['WfTaskListId'] != null) this.wfTaskListId = params['WfTaskListId'];
    });
  }

  ngOnInit() {
    this.claimTaskService.ClaimTask(this.wfTaskListId);
    this.initViewMainInfo();
    this.getSubjectList();
  }

  initViewMainInfo() {
    this.gridSubjectObj.pagingJson = "./assets/ucpaging/searchAppDupCheckSubject.json";
    this.addObj["AppId"] = this.appId;
    this.addObj["WfTaskListId"] = this.wfTaskListId;
    this.viewMainInfoObj.viewInput = "./assets/ucviewgeneric/viewDupCheckSubject.json";
  }

  getSubjectList() {
    this.http.post(URLConstant.MD_GetSubjectDuplicateCheckByAppId, { "Id": this.appId }).subscribe(
      (response) => {
        let keyProp: string = 'ListSubject';
        if (!response[keyProp] || response[keyProp].length <= 0) return;
        let arSubject = new Array();

        response[keyProp].forEach(row => {
          let subjectType = '';
          if (row.IsCustomer) subjectType = 'CUSTOMER';
          else if (row.IsGuarantor) subjectType = 'GUARANTOR';
          else if (row.IsShareholder) subjectType = 'SHARE HOLDER';
          else if (row.IsFamily) subjectType = 'FAMILY';

          arSubject.push({
            'AppCustId': row.AppCustId,
            'CustName': row.CustName,
            'SubjectType': subjectType,
            'ApplicantNo': row.ApplicantNo,
            'CustNo': row.CustNo,
            'IsAppCustChecked': row.IsAppCustChecked,
            'IsExistingCust': row.IsExistingCust,
            'Negative': row.MrNegCustTypeDescr ? row.MrNegCustTypeDescr : '-',
            'IsShowEdit': !row.ApplicantNo && !row.CustNo ? 1 : 0,
          });
        });
        this.gridSubjectObj.resultData = { Data: arSubject }
      }
    );
  }

  buttonBackOnClick() {
    var bizTemplateCode = localStorage.getItem("BizTemplateCode")
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_PAGING], { "BizTemplateCode": bizTemplateCode });
  }

  buttonSubmitOnClick() {
    this.http.post(URLConstant.MD_SubmitAppDupCheck, { "AppId": this.appId, "WfTaskListId": this.wfTaskListId }).subscribe(
      response => {
        this.toastr.successMessage(response["Message"]);
        this.buttonBackOnClick();
      }
    );
  }

  viewMainInfoCallback(ev) {
    AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
  }


}
