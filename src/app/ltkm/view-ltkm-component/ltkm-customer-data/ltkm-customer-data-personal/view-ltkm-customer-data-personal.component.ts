import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { environment } from 'environments/environment';
import { LtkmCustObj } from 'app/shared/model/ltkm/ltkm-cust-obj.model';
import { LtkmCustAddrForViewObj } from 'app/shared/model/ltkm/ltkm-cust-addr-for-view-obj.model';
import { LtkmCustBankAccObj } from 'app/shared/model/ltkm/ltkm-cust-bank-acc-obj.model';
import { LtkmCustSocmedObj } from 'app/shared/model/ltkm/ltkm-cust-socmed-obj.model';
import { LtkmCustGrpObj } from 'app/shared/model/ltkm/ltkm-cust-grp-obj.model';
import { LtkmCustPersonalContactPersonObj } from 'app/shared/model/ltkm/ltkm-cust-personal-contact-person-obj.model';

@Component({
  selector: 'app-view-ltkm-cust-data-personal',
  templateUrl: './view-ltkm-customer-data-personal.component.html',
  styleUrls: []
})
export class ViewLtkmCustDataPersonalDataComponent implements OnInit {

  @Input() LtkmCustId: number;
  @Input() IsNAPVersionCompletion: boolean = true;
  viewMainDataObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataProfObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataEmpObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataSmeObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataNonProfObj:  UcViewGenericObj = new UcViewGenericObj();
  viewFinDataObj:  UcViewGenericObj = new UcViewGenericObj();

  arrValue = [];
  isDataAlreadyLoaded: boolean = false;

  custModelCode: string;
  ltkmCustObj: LtkmCustObj;
  ltkmCustAddrForViewObjs: Array<LtkmCustAddrForViewObj>;
  ltkmCustBankAccObjs: Array<LtkmCustBankAccObj>;
  ltkmCustSocmedObjs: Array<LtkmCustSocmedObj>;
  ltkmCustGrpObjs: Array<LtkmCustGrpObj>;
  ltkmCustPersonalContactPersonObjs: Array<LtkmCustPersonalContactPersonObj>;

  constructor(private http: HttpClient) {
  }

  async ngOnInit(): Promise<void> {
    //jika pake NAP versi baru maka langsung arahkan semua ke view completion tanpa init data di view lama
    // if(this.IsNAPVersionCompletion) return;
    await this.getCustData();
    this.arrValue.push(this.ltkmCustObj.LtkmCustId);
    this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustPersonalMainData.json";
    this.viewMainDataObj.whereValue = this.arrValue;

    this.viewJobDataProfObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustPersonalJobDataProf.json";
    this.viewJobDataProfObj.whereValue = this.arrValue;

    this.viewJobDataEmpObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustPersonalJobDataEmp.json";
    this.viewJobDataEmpObj.whereValue = this.arrValue;

    this.viewJobDataSmeObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustPersonalJobDataSme.json";
    this.viewJobDataSmeObj.whereValue = this.arrValue;

    this.viewJobDataNonProfObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustPersonalJobDataNonProf.json";
    this.viewJobDataNonProfObj.whereValue = this.arrValue;

    this.viewFinDataObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustPersonalFinData.json";
    this.viewFinDataObj.whereValue = this.arrValue;

    this.isDataAlreadyLoaded = true;
  }

  async getCustData() {
    await this.http.post(URLConstant.GetLtkmCustDataPersonalForViewByLtkmCustId, { LtkmCustId: this.LtkmCustId }).toPromise().then(
      (response) => {
        this.ltkmCustObj = response["rLtkmCustObj"];
        this.custModelCode = response["MrCustModelCode"];        
        this.ltkmCustAddrForViewObjs = response["rLtkmCustAddrObjs"];
        this.ltkmCustBankAccObjs = response["rLtkmCustBankAccObjs"];
        this.ltkmCustSocmedObjs = response["rLtkmCustSocmedObjs"];
        this.ltkmCustGrpObjs = response["rLtkmCustGrpObjs"];
        this.ltkmCustPersonalContactPersonObjs = response["rLtkmCustPersonalContactPersonObjs"] == null ? new Array<LtkmCustPersonalContactPersonObj>() : response["rLtkmCustPersonalContactPersonObjs"];
      });
  }
}
