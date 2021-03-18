import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCollateralObj } from 'app/shared/model/CreditReview/CrdRvwCollateralObj.Model';

@Component({
  selector: 'app-crd-rvw-additional-coll',
  templateUrl: './crd-rvw-additional-coll.component.html',
  styleUrls: ['./crd-rvw-additional-coll.component.scss']
})
export class CrdRvwAdditionalCollComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number = 0;
  
  constructor(
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    await this.GetCrdRvwCollateralByCrdRvwCustInfoId();
  }

  ListCrdRvwCollateralObj: Array<CrdRvwCollateralObj> = new Array<CrdRvwCollateralObj>();
  async GetCrdRvwCollateralByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwCollateralObj: Array<CrdRvwCollateralObj> }>(URLConstant.GetCrdRvwCollateralByCrdRvwCustInfoId, { Id: this.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        this.ListCrdRvwCollateralObj = response.ListCrdRvwCollateralObj;
      }
    );
  }
}
