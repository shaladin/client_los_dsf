import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCmoObj } from 'app/shared/model/CreditReview/CrdRvwCmoObj.Model';

@Component({
  selector: 'app-crd-rvw-cmo-info',
  templateUrl: './crd-rvw-cmo-info.component.html',
  styleUrls: ['./crd-rvw-cmo-info.component.scss']
})
export class CrdRvwCmoInfoComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number = 0;

  crdRvwCmoObj: CrdRvwCmoObj = new CrdRvwCmoObj();
  constructor(
    // private route: ActivatedRoute,
    private http: HttpClient,
    // private fb: FormBuilder,
    // private router: Router
  ) { }

  async ngOnInit() {
    await this.GetCrdRvwCollateralByCrdRvwCustInfoId();
  }

  async GetCrdRvwCollateralByCrdRvwCustInfoId() {
    await this.http.post<CrdRvwCmoObj>(URLConstant.GetCrdRvwCmoBycrdRvwExposureId, { CrdRvwCustInfoId: this.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        // console.log(response);
        this.crdRvwCmoObj = response;
      }
    );
  }
}
