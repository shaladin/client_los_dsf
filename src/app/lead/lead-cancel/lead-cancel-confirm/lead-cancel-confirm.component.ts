import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsService } from 'app/shared/services/adIns.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators } from '@angular/forms';
import { LeadConfirmCancelObj } from 'app/shared/model/LeadConfirmCancelObj.Model';
import { environment } from 'environments/environment';

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
    Notes: ['']
  });
  GetListKeyValueActiveByCode = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
  ItemCancelReason: any;
  deletedArr = new Array();
  EditListLeadForCancelByListLeadId = AdInsConstant.EditListLeadForCancelByListLeadId;
  tempWfTaskListArr = new Array();
  leadUrl: string;
  tempLeadIds : string;
  tempLeadArr : Array<string>;
  WfTaskListIds : string;
  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private adInsService: AdInsService,
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
    });
    var tempObj = { 'ListLeadId': this.tempLeadArr };
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
    this.leadUrl = environment.losR3Web + '/Lead/View?LeadId=';
  }
  deleteFromTemp(leadId) {
    if (confirm('Are you sure to delete this record?')) {
      this.deletedArr.push(leadId);
      var idxToDel = 0;
      for (var i = 0; i < this.responseObj.length; i++) {
        if(this.responseObj[i]['LeadId'] == leadId){
          idxToDel = i;
          break;
        }
      }
      this.responseObj.splice(idxToDel, 1);
    }
  }

  SaveLeadConfirmCancel() {
    if(this.responseObj.length > 0){
      var leadObj : LeadConfirmCancelObj = new LeadConfirmCancelObj();
      leadObj.LeadStat = AdInsConstant.LeadStatCancel;
      leadObj.LeadStep = AdInsConstant.LeadStepCancel;
      leadObj.Notes = this.LeadConfirmCancelForm.controls.CancelReason.value;
      leadObj.MrCancelReasonCode = this.LeadConfirmCancelForm.controls.CancelReason.value;
      leadObj.Notes = this.LeadConfirmCancelForm.controls.Notes.value;
      var tempId = new Array();
      for (var i = 0; i < this.responseObj.length; i++) {
        // if (this.deletedArr.includes(this.responseObj[i]['LeadId']) == false) {
          tempId.push(this.responseObj[i]['LeadId']);
        // }
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
    else{
      this.toastr.errorMessage("No Lead Available to Cancel");
    }
  }
}
