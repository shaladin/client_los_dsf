import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgrmntObj } from 'app/shared/model/agrmnt/agrmnt.model';
import { InstallmentObj } from 'app/shared/model/app-fin-data/installment-obj.model';
import { AgrmntFeeObj } from 'app/shared/model/agrmnt-fee-obj.model';
import { AgrmntSubsidyObj } from 'app/shared/model/agrmnt-subsidy-obj.model';
import { AgrmntFinDataObj } from 'app/shared/model/agrmnt-fin-data.model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-agrmnt-financial',
  templateUrl: './agrmnt-financial.component.html',
  styleUrls: []
})
export class AgrmntFinancialComponent implements OnInit {
  @Input() AgrmntId: number;
  listSubsidy: Array<AgrmntSubsidyObj> = new Array<AgrmntSubsidyObj>();
  listAgrmntFeeObj : Array<AgrmntFeeObj> = new Array<AgrmntFeeObj>();
  agrmntFinDataObj : AgrmntFinDataObj = new AgrmntFinDataObj();
  agrmntObj: AgrmntObj = new AgrmntObj();
  listInstallment: Array<InstallmentObj> = new Array<InstallmentObj>();
  appFinDataObj: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getFinancialData();
  }

  getFinancialData(){
    var reqObj = { Id: this.AgrmntId };
    this.http.post(URLConstant.GetFinancialDataByAgrmntIdForView, reqObj).subscribe(
      (response) => {
        this.listSubsidy = response["AgrmntSubsidyObjs"];
        this.listAgrmntFeeObj = response["AgrmntFeeObjs"];
        this.agrmntFinDataObj = response["AgrmntFinDataObj"];
        this.agrmntObj = response["AgrmntObj"];
        this.listInstallment = response["InstallmentObjs"];
      }
    );
  }
}