import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: "view-phone-verif",
  templateUrl: "./view-phone-verif.component.html",
  providers: [NGXToastrService]
})
export class ViewPhoneVerifComponent implements OnInit {
  @Input() appId: number;
  appObj = {
    AppId: 0,
    Id:0
  };
  phoneVerifObj: any;

  constructor(private http: HttpClient) {
    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.appId = params['AppId'];
    //  }
    //});
  }

  async ngOnInit(): Promise<void> {
    this.appObj.AppId = this.appId;
    this.appObj.Id = this.appId;
    this.GetPhnVerfSubjData();
  }

  GetPhnVerfSubjData() {
    this.http.post(URLConstant.GetAppPhoneVerifSubjectListByAppId, this.appObj).subscribe(
      (response) => {
        this.phoneVerifObj = response;
      }
    );
  }

  View(VerifResultHid, SubjectName) {
    window.open("/Nap/CreditProcess/PhoneVerification/Subject/View?AppId=" + this.appId + "&VerfResultHId=" + VerifResultHid + "&Name=" + SubjectName, "_blank");
  }
}