import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { LeadConfirmCancelObj } from 'app/shared/model/Request/LEAD/LeadConfirmCancelObj.model';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericListByIdObj } from 'app/shared/model/Generic/GenericListByIdObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-lead-cancel-confirm',
  templateUrl: './lead-cancel-confirm.component.html',
  providers: [NGXToastrService]
})
export class LeadCancelConfirmComponent implements OnInit {
  responseObj = new Array();
  LeadConfirmCancelForm = this.fb.group({
    CancelReason: ['', Validators.required],
    Notes: ['']
  });
  ItemCancelReason: Array<KeyValueObj>;
  deletedArr = new Array();
  tempWfTaskListArr = new Array();
  leadUrl: string;
  tempLeadIds: string;
  tempLeadArr: Array<string>;
  WfTaskListIds: string;
  MrLeadTypeCode: string;
  title: string;
  reqIdListObj: GenericListByIdObj = new GenericListByIdObj();

  PagingLink: string;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private formValidate: FormValidateService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['LeadIds'] != null) {
        this.tempLeadIds = params['LeadIds'];
        this.tempLeadArr = this.tempLeadIds.split(',');
      }

      if (params['WfTaskListIds'] != null && params['WfTaskListIds'] != "") {
        this.WfTaskListIds = params['WfTaskListIds'];
        this.tempWfTaskListArr = this.WfTaskListIds.split(',');
      }

      if (params["MrLeadTypeCode"] != null) {
        this.MrLeadTypeCode = params["MrLeadTypeCode"];
      }
    });
    this.title = this.MrLeadTypeCode == CommonConstant.MrLeadTypeCodeLead ? CommonConstant.LeadCancelTitle : CommonConstant.SimpleLeadCancelTitle;
    this.PagingLink = this.MrLeadTypeCode == CommonConstant.MrLeadTypeCodeLead ? NavigationConstant.LEAD_CANCEL : NavigationConstant.SIMPLE_LEAD_CANCEL;
    this.reqIdListObj = { 'Ids': this.tempLeadArr.map(Number) };
    this.http.post(URLConstant.GetListLeadForLeadCancelByListLeadId, this.reqIdListObj).subscribe(
      response => {
        this.responseObj = response['ReturnObject'];
      }
    );
    let tempDdlObj = { "RefMasterTypeCode": "LEAD_CANCEL_REASON" };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, tempDdlObj).subscribe(
      response => {
        this.ItemCancelReason = response['ReturnObject'];
        this.LeadConfirmCancelForm.patchValue({
          CancelReason: this.ItemCancelReason[0].Key
        });
      }
    );
    this.leadUrl = environment.losR3Web + '/View/Lead?LeadId=';
  }

  deleteFromTemp(leadId) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.deletedArr.push(leadId);
      let idxToDel = 0;
      for (let i = 0; i < this.responseObj.length; i++) {
        if (this.responseObj[i]['LeadId'] == leadId) {
          idxToDel = i;
          break;
        }
      }
      this.responseObj.splice(idxToDel, 1);
    }
  }

  SaveLeadConfirmCancel() {
    if (this.responseObj.length > 0) {
      let leadObj: LeadConfirmCancelObj = new LeadConfirmCancelObj();
      leadObj.LeadStat = CommonConstant.LeadStatCancel;
      leadObj.LeadStep = CommonConstant.LeadStepCancel;
      leadObj.MrCancelReasonCode = this.LeadConfirmCancelForm.controls.CancelReason.value;
      leadObj.Notes = this.LeadConfirmCancelForm.controls.Notes.value;
      let tempId = new Array();
      for (let i = 0; i < this.responseObj.length; i++) {
        tempId.push(this.responseObj[i]['LeadId']);
      }
      leadObj.ListLeadId = tempId;
      leadObj.ListWfTaskListId = this.tempWfTaskListArr;

      let urlPost = environment.isCore ? URLConstant.EditListLeadForCancelByListLeadIdV2 : URLConstant.EditListLeadForCancelByListLeadId;
      
      this.http.post(urlPost, leadObj).subscribe(
        response => {
          this.toastr.successMessage(response["Message"]);
          AdInsHelper.RedirectUrl(this.router, [this.PagingLink], {"MrLeadTypeCode" : this.MrLeadTypeCode});
        }
      );
    }
    else {
      this.toastr.warningMessage(ExceptionConstant.NO_LEAD_DATA_AVAILABLE);
    }
  }
}
