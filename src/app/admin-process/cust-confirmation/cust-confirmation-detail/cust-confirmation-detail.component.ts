import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { VerfResultHObj } from 'app/shared/model/VerfResultH/VerfResultH.Model';
import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CustCnfrmObj } from 'app/shared/model/CustCnfrm/CustCnfrm.Model';

@Component({
  selector: 'app-cust-confirmation-detail',
  templateUrl: './cust-confirmation-detail.component.html',
  styleUrls: ['./cust-confirmation-detail.component.scss']
})
export class CustConfirmationDetailComponent implements OnInit {

  viewObj: string;
  arrValue = [];
  AgrmntId: number;
  AppId: number;
  AgrmntNo: string;
  VerfResultList = new Array<VerfResultHObj>();
  IsSkip: boolean = false;
  appObj: AppObj = new AppObj();
  verfResultObj: VerfResultObj = new VerfResultObj();
  CustCnfrmObj: CustCnfrmObj = new CustCnfrmObj();

  constructor(private route: ActivatedRoute, private http: HttpClient, 
    private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AgrmntNo"] != null) {
        this.AgrmntNo = params["AgrmntNo"];
      }
    });
  }

  ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    this.viewObj = "./assets/ucviewgeneric/viewCustConfirmInfo.json";

    this.GetVerfResult();
  }

  GetVerfResult() {
    var verfResultHObj = {
      TrxRefNo: this.AgrmntNo
    }
    this.http.post(AdInsConstant.GetVerfResultHsByTrxRefNo, verfResultHObj).subscribe(
      (response) => {
        this.VerfResultList = response["responseVerfResultHCustomObjs"];
        this.CustCnfrmObj.AppId = this.AppId;
        this.CustCnfrmObj.AgrmntId = this.AgrmntId;
        this.CustCnfrmObj.Phone = this.VerfResultList[0].Phn;
        this.CustCnfrmObj.MrCustCnfrmResultCode = this.VerfResultList[0].MrVerfResultHStatCode;
        this.CustCnfrmObj.CnfmrNotes = this.VerfResultList[0].Notes;
        if (this.VerfResultList.length == 0) {
          this.AddNewVerfResult();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  AddNewVerfResult() {
    var AppObj = {
      AppId: this.AppId
    }
    this.http.post<AppObj>(AdInsConstant.GetAppByIds, AppObj).subscribe(
      (response) => {
        this.appObj = response;

        this.verfResultObj.TrxRefNo = this.AgrmntNo;
        this.verfResultObj.EmpNo = "-";
        this.verfResultObj.MrVerfResultStatCode = "NEW";
        this.verfResultObj.MrVerfTrxTypeCode = "CUST_CNFRM";
        this.verfResultObj.LobCode = this.appObj.LobCode;
        this.verfResultObj.LobName = this.appObj.LobCode;
        this.verfResultObj.Notes = "-";
        this.http.post(AdInsConstant.AddVerfResultAndVerfResultH, this.verfResultObj).subscribe(
          (response) => {
            this.GetVerfResult();
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  SaveForm() {
    this.http.post(AdInsConstant.AddCustCnfrm, this.CustCnfrmObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/AdminProcess/CustConfirmation/Paging"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}