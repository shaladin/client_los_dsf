import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';
import { ReqMouForEditConfirmCancelObjV2_1 } from 'app/shared/model/Request/MOU/ReqMouForEditConfirmCancelObj.model';

@Component({
  selector: 'app-mou-cancel-detail',
  templateUrl: './mou-cancel-detail.component.html'
})
export class MouCancelDetailComponent implements OnInit {
  MouCustId: number = 0;
  WfTaskListId: string = '';
  MouCancelObj: ReqMouForEditConfirmCancelObjV2_1 = new ReqMouForEditConfirmCancelObjV2_1();
  MainInfoForm = this.fb.group({
    ReasonCode: ['', Validators.required],
    CancelNotes: ['', Validators.required]
  });
  itemReasonCode: Array<KeyValueObj>;
  MouCustObj: any;

  readonly CancelLink: string = NavigationConstant.MOU_CUST_CANCEL;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["MouCustId"] != null) {        
        this.MouCustId = params["MouCustId"];
      }

      if(params["WfTaskListId"] != null){
        this.WfTaskListId = params["WfTaskListId"];
      }
    });
  }

  ngOnInit() {
    var refReasonObj: ReqGetByTypeCodeObj = {
      RefReasonTypeCode: CommonConstant.RefReasonTypeCodeAppAgrCncl
    }
    this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).subscribe(
      (response) => {
        this.itemReasonCode = response[CommonConstant.ReturnObj];
        this.MainInfoForm.patchValue({
          ReasonCode: this.itemReasonCode[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetMouCustByMouCustId, {Id: this.MouCustId}).subscribe(
      (response) => {
        this.MouCustObj = response["MouCustObj"];
      }
    )
  }

  SaveForm(){
    this.MouCancelObj.ReqMouCancelObj = this.MainInfoForm.value;
    this.MouCancelObj.ReqMouCancelObj.MouCustId = this.MouCustId;
    this.MouCancelObj.WfTaskListId = this.WfTaskListId
    this.MouCancelObj.RowVersion = this.MouCustObj.RowVersion;

    this.http.post(URLConstant.EditMouForCancelByMouIdV2_1, this.MouCancelObj).subscribe(
      (response) => {
        this.toastr.successMessage(response['message']);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_CANCEL]);
      }
    )
  }

}
