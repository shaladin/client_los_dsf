import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';
import { AgrmntFeeObj } from 'app/shared/model/AgrmntFeeObj.Model';
import { AgrmntSubsidyObj } from 'app/shared/model/AgrmntSubsidyObj.Model';
import { AgrmntFinDataObj } from 'app/shared/model/AgrmntFinData.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-agrmnt-financial',
  templateUrl: './agrmnt-financial.component.html',
  styleUrls: []
})
export class AgrmntFinancialComponent implements OnInit {

  @Input() AgrmntId: any;
  listSubsidy: Array<AgrmntSubsidyObj> = new Array<AgrmntSubsidyObj>();
  listAgrmntFeeObj : Array<AgrmntFeeObj> = new Array<AgrmntFeeObj>();
  agrmntFinDataObj : AgrmntFinDataObj = new AgrmntFinDataObj();
  agrmntObj: AgrmntObj = new AgrmntObj();
  listInstallment: Array<InstallmentObj> = new Array<InstallmentObj>();
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getFinancialData();
  }

  getFinancialData(){
    var reqObj = {AgrmntId: this.AgrmntId};
    this.http.post(URLConstant.GetFinancialDataByAgrmntIdForView, reqObj).subscribe(
      (response) => {
        this.listSubsidy = response["AgrmntSubsidyObjs"];
        this.listAgrmntFeeObj = response["AgrmntFeeObjs"];
        this.agrmntFinDataObj = response["AgrmntFinDataObj"];
        this.agrmntObj = response["AgrmntObj"];
        this.listInstallment = response["InstallmentObjs"];
      });
  }

}
