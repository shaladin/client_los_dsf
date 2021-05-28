import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { PefindoObj } from 'app/shared/model/PefindoObj.model';



@Component({
  selector: 'app-pefindo-view',
  templateUrl: './pefindo-view.component.html',
  styleUrls: ['./pefindo-view.component.css']
})
export class PefindoViewComponent implements OnInit {

  AppId: number;
  CustNo: string;
  PefindoId: number;
  PefindoObj: PefindoObj = new PefindoObj();
  PefindoData: any = new Array();
  ScoreData: any = new Array();
  ContractsData: any = new Array();
  ContractsSummary: any = new Array();  
  OtherData: any = new Array();

  isPersonal: boolean = false;
  isCompany: boolean = false;
  noData: boolean = false;



  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }

    });
  }

  async ngOnInit() : Promise<void> {
    await this.GetPefindoData();
  }

  async GetPefindoData() {
    await this.http.post(URLConstant.GetAppCustByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {               
        this.CustNo = response['CustNo']
        this.PefindoObj.CustName = response['CustName'];
        this.PefindoObj.IdNo = response['IdNo'];
        this.PefindoObj.MrCustTypeCode = response['MrCustTypeCode'];
        this.PefindoObj.MrIdTypeCode = response['MrIdTypeCode'];
        this.PefindoObj.TaxIdNo = response['TaxIdNo'];        

        if(this.PefindoObj.MrCustTypeCode == "PERSONAL"){
          this.isPersonal = true;
        }else{
          this.isCompany = true;
        }
      }
    );    

    await this.http.post(URLConstant.GetPefindoCustomReport, this.PefindoObj).subscribe(
      (response) => {               
        this.PefindoId = response['Individual']['Identification'].PefindoId;
        this.PefindoData = response;        
        this.ScoreData = response['CIP']['RecordList'][0];
        this.ContractsData = response['Contracts'];
        this.ContractsSummary = response['ContractSummary'];
        this.OtherData = response['GetOtherDataReport'];
        
        
      }
    );

    
  }

}
