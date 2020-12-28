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
    // private route: ActivatedRoute,
    private http: HttpClient,
    // private fb: FormBuilder,
    // private router: Router
  ) { }

  async ngOnInit() {
    await this.GetCrdRvwCollateralByCrdRvwCustInfoId();
  }

  ListCrdRvwCollateralObj: Array<CrdRvwCollateralObj> = new Array<CrdRvwCollateralObj>();
  async GetCrdRvwCollateralByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwCollateralObj: Array<CrdRvwCollateralObj> }>(URLConstant.GetCrdRvwCollateralByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        // console.log(response);
        this.ListCrdRvwCollateralObj = response.ListCrdRvwCollateralObj;
      }
    );
  }
}
