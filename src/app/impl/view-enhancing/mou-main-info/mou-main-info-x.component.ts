import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AdInsHelper} from 'app/shared/AdInsHelper';
import {URLConstant} from 'app/shared/constant/URLConstant';
import {UcViewGenericObj} from 'app/shared/model/UcViewGenericObj.model';
import {UcviewgenericComponent} from '@adins/ucviewgeneric';
import {MouCustObj} from 'app/shared/model/MouCustObj.Model';
import {GenericObj} from 'app/shared/model/Generic/GenericObj.Model';
import {CommonConstant} from 'app/shared/constant/CommonConstant';
import {URLConstantX} from 'app/impl/shared/constant/URLConstantX';
import {ResMouMainInfoObjX} from 'app/impl/shared/model/Response/MOU/ResMouMainInfoObjX.model';
import {NavigationConstant} from 'app/shared/constant/NavigationConstant';
import {Router} from '@angular/router';


@Component({
  selector: 'app-mou-main-info-x',
  templateUrl: './mou-main-info-x.component.html',
})
export class MouMainInfoXComponent implements OnInit {
  @Input() MouCustId: number;
  MouCustObj: MouCustObj = new MouCustObj();
  CustNoObj: GenericObj = new GenericObj();
  MouMainInfo: ResMouMainInfoObjX;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  ngOnInit() {
    this.ReloadUcViewGeneric();
  }

  ReloadUcViewGeneric() {
    this.http.post<ResMouMainInfoObjX>(URLConstantX.GetMouMainInfoByIdX, {Id: this.MouCustId}).subscribe(
      (response) => {
        this.MouMainInfo = response;
        if(this.MouMainInfo.PlafondType == CommonConstant.MOU_CUST_PLAFOND_TYPE_BOAMT){
          this.MouMainInfo.PlafondType = 'Base On Amount'
        }else{
          this.MouMainInfo.PlafondType = 'Base On Collateral'
        }
        console.log(response);
      });
  }

  ViewMou(){
    AdInsHelper.OpenMOUCustViewByMouCustId(this.MouCustId);
  }

  ViewCust() {
    if (!this.MouMainInfo.IsExistingCust) {
      AdInsHelper.OpenMOUCustViewByMouCustId(this.MouCustId);
    } else {
      this.CustNoObj.CustNo = this.MouMainInfo.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        responseCust => {
          if (responseCust['MrCustTypeCode'] == CommonConstant.CustTypeCompany) {
            AdInsHelper.OpenCustomerCoyViewByCustId(responseCust['CustId']);
          }

          if (responseCust['MrCustTypeCode'] == CommonConstant.CustTypePersonal) {
            AdInsHelper.OpenCustomerViewByCustId(responseCust['CustId']);
          }
        });
    }
  }
}
