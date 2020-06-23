import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-mou-view-addcoll',
  templateUrl: './mou-view-addcoll.component.html',
  providers: [NGXToastrService]
})
export class MouViewAddcollComponent implements OnInit {
  @Input() MouCustId: number;

  listCollateralData: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    var mouCustObj = { MouCustId: this.MouCustId }
    console.log(mouCustObj);
    this.http.post(AdInsConstant.GetMouCustCollateralByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })
  }
  openView(custNo) {
    var link: string;
    var custObj = { CustNo: custNo };
    this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
      response => {
        link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response["CustId"];
        window.open(link, '_blank');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  AddCollDataForm = this.fb.group({
  })
}
