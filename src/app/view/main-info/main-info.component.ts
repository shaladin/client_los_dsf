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

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.scss'],
  providers: [NGXToastrService, DatePipe]
})
export class MainInfoComponent implements OnInit {
  @Input() MouCustId: any;

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
  isRevolving: any;
  plafondAmt: any;
  mrMouTypeCode : any;
  custId: any;
  custUrl: string;
  mouUrl: string;
  mouCustStatView: string;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, public datepipe: DatePipe) { }

  ngOnInit() {
    var mouCustObj = { MouCustId: this.MouCustId }
    console.log(mouCustObj);
    this.http.post(AdInsConstant.GetMouCustById, mouCustObj).pipe(
      map((response) => {
        return response;
      }),
      mergeMap((response) => {
        var custObj = { CustNo: response['CustNo'] };
        let getCustData = this.http.post(AdInsConstant.GetCustByCustNo, custObj);
        var tempResponse = [response];
        return forkJoin([tempResponse, getCustData]);
      })
    ).subscribe(
      (response) => {
        var mouData = response[0];
        var custData = response[1];

        this.mouCustNo = mouData['MouCustNo'];
        this.custName = mouData['CustName'];
        this.mouCustDt = this.datepipe.transform(mouData['MouCustDt'], 'dd-MMM-yyyy');
        this.startDt = this.datepipe.transform(mouData['StartDt'], 'dd-MMM-yyyy');
        this.endDt = this.datepipe.transform(mouData['EndDt'], 'dd-MMM-yyyy');
        this.refNo = mouData['RefNo'];
        this.plafondAmt = mouData['PlafondAmt'];
        this.mouStat = mouData['MouCustStatView'];
        this.mrMouTypeCode = mouData['MrMouTypeCode'];
        this.isRevolving = mouData['IsRevolving'] == 1 ? "Yes" : "No";
        this.custId = custData['CustId'];
        this.mouCustStatView = custData['MouCustStatView'];
        this.custUrl = environment.FoundationR3Web + '/CustomerView/Page?CustId=' + this.custId;
        this.mouUrl = '/Mou/Cust/Paging?MouCustId=' + this.MouCustId;
      }
    );
  }

  MainInfoForm = this.fb.group({
  })
}
