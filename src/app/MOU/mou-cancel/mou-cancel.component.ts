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
  user:any;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("UserAccess"));

    if (this.user.MrOfficeTypeCode != "HO") {
      this.router.navigate(["/Mou/UnauthorizedPage"]);
      return;
    }
    else
    {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouCancel.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
      this.inputPagingObj.deleteUrl = "";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCancel.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MC.MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url
        },
        {
          name: "MC.MOU_STAT",
          environment: environment.FoundationR3Url
        }
      ];
    }
  }

  cancelMou(event)
  {
    if (confirm("Are you sure to cancel this?"))
    {
      var mouCancel = new MouCustConfirmCancelObj;
      mouCancel.MouStat = "CAN";
      mouCancel.MouCustId = event.RowObj.MouCustId;
      mouCancel.WfTaskListId = event.RowObj.WfTaskListId;
      this.http.post(AdInsConstant.EditMouForCancelByMouId, mouCancel).subscribe(
          response => {
            this.toastr.successMessage(response["Message"]);
            // this.router.navigate(["/Mou/Cust/Cancel"]);
            // this.router.navigate(["/Mou"]);
            // this.router.navigate(["/Mou/Cust/Cancel"]);
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/Mou/Cust/Cancel']);
          });
          }
        );
    }
  }

}
