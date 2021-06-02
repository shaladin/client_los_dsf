import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { MouCustCollateralObj } from 'app/shared/model/MouCustCollateralObj.Model';
import { MouCustCollateralRegistrationObj } from 'app/shared/model/MouCustCollateralRegistrationObj.Model';
import { ListMouCustCollateralDocObj } from 'app/shared/model/ListMouCustCollateralDocObj.Model';
import { MouCustCollateralDocObj } from 'app/shared/model/MouCustCollateralDocObj.Model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-mou-view-addcoll',
  templateUrl: './mou-view-addcoll.component.html',
  providers: [NGXToastrService]
})
export class MouViewAddcollComponent implements OnInit {
  @Input() MouCustId: number;

  listCollateralData: any;
  isView:boolean = false;
  listMouCustCollateralDocObj: ListMouCustCollateralDocObj = new ListMouCustCollateralDocObj();
  mouCustCollateralDoc: MouCustCollateralDocObj = new MouCustCollateralDocObj();
  mouCustCollateralObj: MouCustCollateralObj;
  mouCustCollateralRegistrationObj: MouCustCollateralRegistrationObj;
  OwnerRelationshipObj: any;
  collateralObj: MouCustCollateralObj;
  collateralRegistrationObj: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustCollateralForMouViewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })
  }

  AddCollDataForm = this.fb.group({
  })
  ViewColl(MouCustCollateralId){
    this.isView = true;
    this.listMouCustCollateralDocObj.MouCustCollateralDocObj = new Array();
    var collObj = { Id: MouCustCollateralId };
    console.log(MouCustCollateralId);
    this.http.post(URLConstant.GetListMouCustCollateralDocsByMouCustCollateralId, { Id: MouCustCollateralId }).subscribe(
      (response) => {
        var MouCustCollateralDocs = new Array();
        MouCustCollateralDocs = response["MouCustCollateralDocs"];
        console.log(MouCustCollateralDocs);
        if (MouCustCollateralDocs["length"] > 0) {

          for (var i = 0; i < MouCustCollateralDocs.length; i++) {
            if(MouCustCollateralId==MouCustCollateralDocs[i].MouCustCollateralId){

            this.mouCustCollateralDoc = new MouCustCollateralDocObj();
            this.mouCustCollateralDoc.DocCode = MouCustCollateralDocs[i].DocCode;
            this.mouCustCollateralDoc.DocNo = MouCustCollateralDocs[i].DocNo;
            this.mouCustCollateralDoc.ExpiredDt = new Date(formatDate(MouCustCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'));
            this.mouCustCollateralDoc.DocNotes = MouCustCollateralDocs[i].DocNotes;
            this.mouCustCollateralDoc.IsReceived =  MouCustCollateralDocs[i].IsReceived;
            this.listMouCustCollateralDocObj.MouCustCollateralDocObj.push(this.mouCustCollateralDoc);
          }
          }}
       
      });

    
    this.http.post(URLConstant.GetMouCustCollateralDataForUpdateByMouCustCollateralId, collObj).subscribe(
      (response) => {

        this.collateralObj = response['MouCustCollateral'];
        this.collateralRegistrationObj = response['MouCustCollateralRegistration'];

        console.log(this.collateralObj);
        console.log(this.collateralRegistrationObj);
      })

  }

  Back(){
    this.isView = false;
  }
}
