import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { DatePipe } from '@angular/common';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  providers: [NGXToastrService, DatePipe]
})
export class MainInfoComponent implements OnInit {
  @Input() MouCustId: number;

  mouCustObj: MouCustObj;
  mode : string;
  mouCustId : number;
  mouCustNo : string;
  mouStat : string;
  custName: string;
  mouCustDt: string;
  startDt: string;
  endDt: string;
  refNo: string;
  isRevolving: string;
  plafondAmt: number;
  mrMouTypeCode : string;
  custId: number;
  custUrl: string;
  mouUrl: string;
  mouCustStatView: string;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, public datepipe: DatePipe) { }

  ngOnInit() {
    var mouCustObj = { MouCustId: this.MouCustId }
    console.log(mouCustObj);
    this.http.post(URLConstant.GetMouCustById, mouCustObj).pipe(
      map((response) => {
        return response;
      }),
      mergeMap((response) => {
        var custObj = { CustNo: response['CustNo'] };
        let getCustData = this.http.post(URLConstant.GetCustByCustNo, custObj);
        var tempResponse = [response];
        return forkJoin([tempResponse, getCustData]);
      })
    ).subscribe(
      (response) => {
        var mouData = response[0];
        var custData = response[1];

        this.mouCustNo = mouData['MouCustNo'];
        this.custName = mouData['CustName'];
        this.mouCustDt = this.datepipe.transform(mouData['MouCustDt'], 'dd-MM-yyyy');
        this.startDt = this.datepipe.transform(mouData['StartDt'], 'dd-MM-yyyy');
        this.endDt = this.datepipe.transform(mouData['EndDt'], 'dd-MM-yyyy');
        this.refNo = mouData['RefNo'];
        this.plafondAmt = mouData['PlafondAmt'];
        this.mouStat = mouData['MouCustStatView'];
        this.mrMouTypeCode = mouData['MrMouTypeCode'];
        this.isRevolving = mouData['IsRevolving'] == 1 ? "Yes" : "No";
        this.custId = custData['CustId'];
        this.mouCustStatView = mouData['MouCustStatView'];
        this.custUrl = environment.FoundationR3Web + '/Customer/CustomerView/Page?CustId=' + this.custId;
        // this.custUrl = environment.FoundationR3Web + '/CustomerView/Page?CustId=' + this.custId;
        this.mouUrl = environment.losR3Web + "/Mou/Cust/View?MouCustId=" + mouData['MouCustId'];
      }
    );
  }

  MainInfoForm = this.fb.group({
  })
}
