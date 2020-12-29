import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwDealerObj } from 'app/shared/model/CreditReview/CrdRvwDealerObj.Model';

@Component({
  selector: 'app-crd-rvw-dealer-info',
  templateUrl: './crd-rvw-dealer-info.component.html',
  styleUrls: ['./crd-rvw-dealer-info.component.scss']
})
export class CrdRvwDealerInfoComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number = 0;

  constructor(
    // private route: ActivatedRoute,
    private http: HttpClient,
    // private fb: FormBuilder,
    // private router: Router
  ) { }

  async ngOnInit() {
    await this.GetCrdRvwDealerByCrdRvwCustInfoId();
  }

  crdRvwDealerObj: CrdRvwDealerObj = new CrdRvwDealerObj();
  async GetCrdRvwDealerByCrdRvwCustInfoId() {
    await this.http.post<CrdRvwDealerObj>(URLConstant.GetCrdRvwDealerByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        console.log(response);
        this.crdRvwDealerObj = response;
      }
    );
  }
}
