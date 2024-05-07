import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { formatDate } from '@angular/common';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { MouCustCollateralStatXObj } from 'app/impl/shared/model/MouCustCollateralStatXObj.Model';
import { MouCustCollateralDocObj } from 'app/shared/model/mou-cust-collateral-doc-obj.model';
import { MouCustCollateralObj } from 'app/shared/model/mou-cust-collateral-obj.model';
import { ReqMouCustDsfObj } from 'app/shared/model/mou-cust-dsf-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-mou-view-addcoll-x',
  templateUrl: './mou-view-addcoll-x.component.html',
  providers: [NGXToastrService]
})
export class MouViewAddcollXComponent implements OnInit {
  @Input() MouCustId: number;

  listCollateralData: Array<any> = new Array();
  isView: boolean = false;
  listMouCustCollateralDocObj: Array<any>;
  mouCustCollateralDoc: MouCustCollateralDocObj = new MouCustCollateralDocObj();
  MouCustCollateralId: number;
  OwnerRelationshipObj: any;
  collateralObj: MouCustCollateralObj;
  collateralRegistrationObj: any;
  CollateralStatObj: MouCustCollateralStatXObj;
  ReqMouCustDsfObj: ReqMouCustDsfObj = new ReqMouCustDsfObj();
  AddCollDataForm = this.fb.group({
  })

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustCollateralForMouViewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })
    
    // CR Change Self Custom
    this.http.post<ReqMouCustDsfObj>(URLConstantDsf.GetMouCustXDsf, { Id: this.MouCustId }).subscribe(
      (response) => {
          this.ReqMouCustDsfObj = response;
        }
    )
    // CR Change Self Custom
  }

  ViewColl(MouCustCollateralId) {
    this.listMouCustCollateralDocObj = new Array<any>();
    this.MouCustCollateralId = MouCustCollateralId;
    const collObj = { Id: MouCustCollateralId };
    console.log(MouCustCollateralId);
    this.http.post(URLConstant.GetListMouCustCollateralDocsByMouCustCollateralId, { Id: MouCustCollateralId }).subscribe(
      (response) => {
        var MouCustCollateralDocs = new Array();
        MouCustCollateralDocs = response["MouCustCollateralDocs"];
        this.isView = true;
        console.log(MouCustCollateralDocs);
        if (MouCustCollateralDocs["length"] > 0) {

          for (var i = 0; i < MouCustCollateralDocs.length; i++) {
            if (MouCustCollateralId == MouCustCollateralDocs[i].MouCustCollateralId) {

              var MouCustCollateralDocObj = {
                DocCode: MouCustCollateralDocs[i].DocCode,
                DocNo: MouCustCollateralDocs[i].DocNo,
                ExpiredDt: formatDate(MouCustCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
                DocNotes: MouCustCollateralDocs[i].DocNotes,
                IsReceived: MouCustCollateralDocs[i].IsReceived
              }
              this.listMouCustCollateralDocObj.push(MouCustCollateralDocObj);
            }
          }
        }

      });


    this.http.post(URLConstantX.GetMouCustCollateralDataForUpdateByMouCustCollateralIdX, collObj).subscribe(
      (response) => {

        this.collateralObj = response['MouCustCollateral'];
        this.collateralRegistrationObj = response['MouCustCollateralRegistration'];

        console.log(this.collateralObj);
        console.log(this.collateralRegistrationObj);
      })
    this.http.post<MouCustCollateralStatXObj>(URLConstantX.GetMouCustCollateralStatXByMouCustCollateralIdX, collObj).subscribe(
      (response) => {
        this.CollateralStatObj = response
        console.log(this.CollateralStatObj);
      })
  }

  Back() {
    this.isView = false;
  }
}
