import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { LtkmCustObj } from 'app/shared/model/LTKM/LtkmCustObj.Model';
import { LtkmCustAddrForViewObj } from 'app/shared/model/LTKM/LtkmCustAddrForViewObj.Model';
import { LtkmCustBankAccObj } from 'app/shared/model/LTKM/LtkmCustBankAccObj.Model';
import { LtkmCustSocmedObj } from 'app/shared/model/LTKM/LtkmCustSocmedObj.Model';
import { LtkmCustGrpObj } from 'app/shared/model/LTKM/LtkmCustGrpObj.Model';
import { LtkmCustCompanyMgmntShrholderObj } from 'app/shared/model/LTKM/LtkmCustCompanyMgmntShrholderObj.Model';
import { LtkmCustCompanyLegalDocObj } from 'app/shared/model/LTKM/LtkmCustCompanyLegalDocObj.Model';

@Component({
  selector: 'app-view-ltkm-cust-data-company',
  templateUrl: './view-ltkm-customer-data-company.component.html',
  styleUrls: []
})
export class ViewLtkmCustDataCompanyComponent implements OnInit {

  @Input() LtkmCustId: number;
  @Input() IsNAPVersionCompletion: boolean = true;
  viewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  viewJobDataProfObj: string;
  viewJobDataEmpObj: string;
  viewJobDataSmeObj: string;
  viewJobDataNonProfObj: string;
  viewFinDataObj: UcViewGenericObj = new UcViewGenericObj();

  arrValue = [];
  isDataAlreadyLoaded: boolean = false;

  ltkmCustObj: LtkmCustObj;
  ltkmCustAddrForViewObjs: Array<LtkmCustAddrForViewObj>;
  ltkmCustBankAccObjs: Array<LtkmCustBankAccObj>;
  ltkmCustSocmedObjs: Array<LtkmCustSocmedObj>;
  ltkmCustGrpObjs: Array<LtkmCustGrpObj>;
  ltkmCustCompanyMgmntShrholderObjs: Array<LtkmCustCompanyMgmntShrholderObj>;
  ltkmCustCompanyLegalDocObjs: Array<LtkmCustCompanyLegalDocObj>;

  constructor(private http: HttpClient) {
  }

  async ngOnInit() : Promise<void>{
    //jika pake NAP versi baru maka langsung arahkan semua ke view completion tanpa init data di view lama
    if(this.IsNAPVersionCompletion) return;
    await this.getCustData();
    this.arrValue.push(this.ltkmCustObj.LtkmCustId);
    this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustCompanyMainData.json";
    this.viewMainDataObj.viewEnvironment = environment.losUrl;
    this.viewMainDataObj.whereValue = this.arrValue;

    this.viewFinDataObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustCompanyFinData.json";
    this.viewFinDataObj.viewEnvironment = environment.losUrl;
    this.viewFinDataObj.whereValue = this.arrValue;

    this.isDataAlreadyLoaded = true;
  }

  async getCustData(){
    await this.http.post(URLConstant.GetLtkmCustDataCompanyForViewByLtkmCustId, { LtkmCustId: this.LtkmCustId }).toPromise().then(
      (response) => {
        this.ltkmCustObj = response["rLtkmCustObj"];
        this.ltkmCustAddrForViewObjs = response["rLtkmCustAddrObjs"];
        this.ltkmCustCompanyMgmntShrholderObjs = response["rLtkmCustCompanyMgmntShrholderObjs"];
        this.ltkmCustBankAccObjs = response["rLtkmCustBankAccObjs"];
        this.ltkmCustCompanyLegalDocObjs = response["rLtkmCustCompanyLegalDocObjs"];
        this.ltkmCustSocmedObjs = response["rLtkmCustSocmedObjs"];
        this.ltkmCustGrpObjs = response["rLtkmCustGrpObjs"];
      });
  }
}