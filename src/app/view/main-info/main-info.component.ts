import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { DatePipe } from '@angular/common';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ReqByCustNoObj } from 'app/shared/model/Request/ReqByCustNoObj.model';

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  providers: [NGXToastrService, DatePipe]
})
export class MainInfoComponent implements OnInit {
  @Input() MouCustId: number;

  mouCustObj: MouCustObj;
  mode: string;
  mouCustId: number;
  mouCustNo: string;
  mouStat: string;
  custName: string;
  mouCustDt: string;
  startDt: string;
  endDt: string;
  refNo: string;
  isRevolving: string;
  plafondAmt: number;
  mrMouTypeCode: string;
  custId: number;
  custUrl: string;
  mouUrl: string;
  mouCustStatView: string;
  CustNoObj: ReqByCustNoObj = new ReqByCustNoObj();

  constructor(private fb: FormBuilder, private http: HttpClient, public datepipe: DatePipe) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustById, mouCustObj).pipe(
      map((response) => {
        return response;
      }),
      mergeMap((response) => {
        this.CustNoObj.CustNo = response['CustNo'];
        let getCustData = this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj);
        var tempResponse = [response];
        return forkJoin([tempResponse, getCustData]);
      })
    ).subscribe(
      (response) => {
        var mouData = response[0];
        var custData = response[1];

        this.mouCustNo = mouData['MouCustNo'];
        this.MouCustId = mouData['MouCustId'];
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
      }
    );
  }

  MainInfoForm = this.fb.group({
  })

  OpenView(key: string) {
    if (key == "mou") {
      AdInsHelper.OpenMOUCustViewByMouCustId(this.MouCustId);
    } else if (key == "cust") {
      AdInsHelper.OpenCustomerViewByCustId(this.custId);
    }
  }
}
