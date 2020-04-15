import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { RFAPreGoLiveObj } from 'app/shared/model/RFAPreGoLiveObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-sharing-pre-go-live-request-for-approval',
  templateUrl: './pre-go-live-request-for-approval.component.html',
  styleUrls: ['./pre-go-live-request-for-approval.component.scss']
})
export class PreGoLiveRequestForApprovalComponent implements OnInit {
  viewObj: string;
  AppId: any;
  itemApprovedBy: any;
  AgrmntNo: any;

  MainInfoForm = this.fb.group({
    Reason: [''],
    ApprovedBy: ['', Validators.required],
    Notes: ['', Validators.required]
  })
  RFAPreGoLive: any;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr : NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.AgrmntNo = params["AgrmntNo"];
    });
  }

  ngOnInit() {
    var schmCodeObj = {
      SchmCode : "PRE_GLV_APV_CF",
      RowVersion : ""
    }
    this.http.post(AdInsConstant.GetListApprovedByForPreGoLive, schmCodeObj).subscribe(
      (response) => {
        this.itemApprovedBy = response["ReturnObject"];
        this.MainInfoForm.patchValue({
          ApprovedBy: this.itemApprovedBy[0].Key
        });
      }
    );
    this.viewObj = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLive.json";
  }


  SaveForm(){
    this.RFAPreGoLive = new RFAPreGoLiveObj();
    this.RFAPreGoLive.TransactionNo = this.AgrmntNo;
    this.RFAPreGoLive.Notes = this.MainInfoForm.controls.Notes.value;
    this.RFAPreGoLive.ApprovedBy = this.MainInfoForm.controls.ApprovedBy.value;
    this.RFAPreGoLive.RowVersion = "";

    this.http.post(AdInsConstant.CreateRFAPreGoLive, this.RFAPreGoLive).subscribe((response) => {
      this.toastr.successMessage(response['message']);
      this.router.navigateByUrl('/AdminProcess/AgreementCancellation/Paging');
    },
      (error) => {
        console.log(error);
      });
  }

}
