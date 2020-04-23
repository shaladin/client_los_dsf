import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsService } from 'app/shared/services/adIns.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators } from '@angular/forms';
import { LeadConfirmCancelObj } from 'app/shared/model/LeadConfirmCancelObj.Model';

@Component({
  selector: 'app-lead-cancel-confirm',
  templateUrl: './lead-cancel-confirm.component.html',
  providers: [NGXToastrService]
})
export class LeadCancelConfirmComponent implements OnInit {
  GetListLeadForLeadCancelByListLeadId = AdInsConstant.GetListLeadForLeadCancelByListLeadId;
  responseObj = new Array();
  LeadConfirmCancelForm = this.fb.group({
    CancelReason: ['', Validators.required],
    Notes: ['', Validators.required]
  });
  GetListKeyValueActiveByCode = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
  ItemCancelReason: any;
  deletedArr = new Array();
  EditListLeadForCancelByListLeadId = AdInsConstant.EditListLeadForCancelByListLeadId;
  tempWfTaskListArr: any = new Array();
  leadUrl: string;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private adInsService: AdInsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    var tempLeadIds;
    var tempLeadArr;
    var WfTaskListIds;
    this.route.queryParams.subscribe(params => {
      if (params['LeadIds'] != null) {
        tempLeadIds = params['LeadIds'];
        tempLeadArr = tempLeadIds.split(',');
      }
      
      if (params['WfTaskListIds'] != null && params['WfTaskListIds'] != "") {
        WfTaskListIds = params['WfTaskListIds'];
        this.tempWfTaskListArr = WfTaskListIds.split(',');
      }
      
      console.log(this.tempWfTaskListArr);
    });
    var tempObj = { 'ListLeadId': tempLeadArr };
    this.http.post(this.GetListLeadForLeadCancelByListLeadId, tempObj).subscribe(
      response => {
        this.responseObj = response['ReturnObject'];
      }
    );
    var tempDdlObj = { "RefMasterTypeCode": "LEAD_CANCEL_REASON" };
    this.http.post(this.GetListKeyValueActiveByCode, tempDdlObj).subscribe(
      response => {
        this.ItemCancelReason = response['ReturnObject'];
        this.LeadConfirmCancelForm.patchValue({
          CancelReason: this.ItemCancelReason[0].Key
        });
      }
    );
    this.leadUrl = '/Lead/View?LeadId=';
  }
  deleteFromTemp(leadId) {
    if (confirm('Are you sure to delete this record?')) {
      this.deletedArr.push(leadId);
    }
  }

  SaveLeadConfirmCancel() {
    var leadObj = new LeadConfirmCancelObj();
    leadObj.LeadStat = "CAN";
    leadObj.Notes = this.LeadConfirmCancelForm.controls.CancelReason.value;
    leadObj.MrCancelReasonCode = this.LeadConfirmCancelForm.controls.CancelReason.value;
    leadObj.Notes = this.LeadConfirmCancelForm.controls.Notes.value;
    var tempId = new Array();
    for (var i = 0; i < this.responseObj.length; i++) {
      if (this.deletedArr.includes(this.responseObj[i]['LeadId']) == false) {
        tempId.push(this.responseObj[i]['LeadId']);
      }
    }
    leadObj.ListLeadId = tempId;
    leadObj.ListWfTaskListId = this.tempWfTaskListArr;
    this.http.post(this.EditListLeadForCancelByListLeadId, leadObj).subscribe(
      response => {
        this.toastr.successMessage(response["Message"]);
        this.router.navigate(["/Lead/Cancel"]);
      }
    );
  }
}
