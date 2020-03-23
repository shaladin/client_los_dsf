import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mou-review-general',
  templateUrl: './mou-review-general.component.html',
  styleUrls: ['./mou-review-general.component.scss'],
  providers: [NGXToastrService, DatePipe]
})
export class MouReviewGeneralComponent implements OnInit {
  mouCustObj: MouCustObj;
  mode : any;
  mouCustId : any;
  mouCustNo : any;
  mouStat : any;
  custName: any;
  mouCustDt: any;
  startDt: any;
  endDt: any;
  refNo: any;
  isRevolving: boolean;
  plafondAmt: any;
  mrMouTypeCode : any;

  mouCust: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, public datepipe: DatePipe) {
    this.route.queryParams.subscribe(params => {
      this.mouCustId = params["MouCustId"];
    })
  }

  ngOnInit() {
    var mouCustObj = { MouCustId: this.mouCustId }
    console.log(mouCustObj);
    this.http.post(AdInsConstant.GetMouCustById, mouCustObj).subscribe(
      (response) => {
        this.mouCustNo = response['MouCustNo'];
        this.custName = response['CustName'];
        this.mouCustDt = this.datepipe.transform(response['MouCustDt'], 'dd-MM-yyyy');
        this.startDt = this.datepipe.transform(response['StartDt'], 'dd-MM-yyyy');
        this.endDt = this.datepipe.transform(response['EndDt'], 'dd-MM-yyyy');
        this.refNo = response['RefNo'];
        this.plafondAmt = response['PlafondAmt'];
        this.mouStat = response['MouStat'];
        this.mrMouTypeCode = response['MrMouTypeCode'];
      })
  }

  MainInfoForm = this.fb.group({
  })

}
