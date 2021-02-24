import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { ThirdPartyDukcapilRsltObj } from 'app/shared/model/ThirdPartyData/ThirdPartyDukcapilRsltObj.Model';
import { ThirdPartyPefindoRsltObj } from 'app/shared/model/ThirdPartyData/ThirdPartyPefindoRsltObj.Model';
import { ThirdPartyProfindRsltObj } from 'app/shared/model/ThirdPartyData/ThirdPartyProfindRsltObj.Model';
import { ThirdPartyRapindoRsltObj } from 'app/shared/model/ThirdPartyData/ThirdPartyRapindoRsltObj.Model';
import { ThirdPartyResultHObj } from 'app/shared/model/ThirdPartyData/ThirdPartyResultH.Model';
import { ThirdPartySlikRsltObj } from 'app/shared/model/ThirdPartyData/ThirdPartySlikRsltObj.Model';

@Component({
  selector: 'app-crd-rvw-third-party-checking',
  templateUrl: './crd-rvw-third-party-checking.component.html',
  styleUrls: ['./crd-rvw-third-party-checking.component.scss']
})
export class CrdRvwThirdPartyCheckingComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;
  @Input() AppNo: string = "";
  IsUseDigitalization: string;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,) { }

  async ngOnInit() : Promise<void> {
    await this.GetIsUseDigitalization();

    if(this.IsUseDigitalization == "1"){
      await this.GetCrdRvwThirdPartyData();
    }
  }

  ThirdPartyDukcapilRsltObj: ThirdPartyDukcapilRsltObj = new ThirdPartyDukcapilRsltObj();
  ThirdPartyPefindoRsltObj: ThirdPartyPefindoRsltObj = new ThirdPartyPefindoRsltObj();
  ThirdPartyProfindRsltObj: ThirdPartyProfindRsltObj = new ThirdPartyProfindRsltObj();
  ListThirdPartyRapindoRsltObj: Array<ThirdPartyRapindoRsltObj> = new Array<ThirdPartyRapindoRsltObj>();
  ThirdPartySlikRsltObj: ThirdPartySlikRsltObj = new ThirdPartySlikRsltObj();

  RapindoDataObj: {
    DataExist: number,
    DataActive: number,
    DataNoActive: number,
  } = {
      DataExist: 0,
      DataActive: 0,
      DataNoActive: 0,
    };
  async GetCrdRvwThirdPartyData() {
    await this.http.post<ThirdPartyResultHObj>(URLConstant.GetCrdRvwThirdPartyData, { TrxNo: this.AppNo }).toPromise().then(
      (response) => {
        this.ThirdPartyDukcapilRsltObj = response.ThirdPartyDukcapilRsltObj;
        this.ThirdPartyPefindoRsltObj = response.ThirdPartyPefindoRsltObj;
        this.ThirdPartyProfindRsltObj = response.ThirdPartyProfindRsltObj;
        this.ListThirdPartyRapindoRsltObj = response.ListThirdPartyRapindoRsltObj;
        this.ThirdPartySlikRsltObj = response.ThirdPartySlikRsltObj;

        for (let index = 0; index < this.ListThirdPartyRapindoRsltObj.length; index++) {
          const element = this.ListThirdPartyRapindoRsltObj[index];
          if(element.IsExists) this.RapindoDataObj.DataExist++;

          if(element.IsActive) this.RapindoDataObj.DataActive++;
          else this.RapindoDataObj.DataNoActive++;
        }
      }
    )
  }

  async GetIsUseDigitalization() {
    var generalSettingObj = new GeneralSettingObj();
    generalSettingObj.GsCode = CommonConstant.GSCodeIsUseDigitalization;
    await this.http.post(URLConstant.GetGeneralSettingByCode, generalSettingObj).toPromise().then(
      (response) => {
        this.IsUseDigitalization = response["GsValue"];
      }
    )
  }
  
}

