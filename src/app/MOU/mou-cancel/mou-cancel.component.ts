import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { MouCustConfirmCancelObj } from 'app/shared/model/MouCustConfirmCancelObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mou-cancel',
  templateUrl: './mou-cancel.component.html'
})
export class MouCancelComponent implements OnInit {
  inputPagingObj: UcPagingObj;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouCancel.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputPagingObj.deleteUrl = "";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCancel.json";
  }

  cancelMou(ev)
  {
    var mouCancel = new MouCustConfirmCancelObj;
    mouCancel.MouStat = "CAN";
    mouCancel.MouCustId = ev.RowObj.MouCustId;
    mouCancel.WfTaskListId = ev.RowObj.WfTaskListId;
    this.http.post(AdInsConstant.EditMouForCancelByMouId, mouCancel).subscribe(
        response => {
          this.toastr.successMessage(response["Message"]);
          this.router.navigate(["/Mou/Cust/Cancel"]);
        }
      );
  }

}
