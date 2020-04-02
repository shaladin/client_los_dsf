import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-cust-confirmation-detail',
  templateUrl: './cust-confirmation-detail.component.html',
  styleUrls: ['./cust-confirmation-detail.component.scss']
})
export class CustConfirmationDetailComponent implements OnInit {

  viewObj: string;
  arrValue = [];
  AgrmntId: number;
  AgrmntNo: string;
  VerfResultList: any = [];
  IsSkip: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["AgrmntNo"] != null) {
        this.AgrmntNo = params["AgrmntNo"];
      }
    });
  }

  ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    this.viewObj = "./assets/ucviewgeneric/viewCustConfirmInfo.json";

    var verfResultHObj = {
      TrxRefNo: this.AgrmntNo
    }
    this.http.post(AdInsConstant.GetVerfResultHsByTrxRefNo, verfResultHObj).subscribe(
      (response) => {
        this.VerfResultList = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
