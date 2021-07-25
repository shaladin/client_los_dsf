import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'app-app-source-office-member-add',
  templateUrl: './app-source-office-member-add.component.html'
})
export class AppSourceOfficeMemberAddComponent implements OnInit {
  listSelectedCode: Array<string> = new Array<string>();
  RefAppSrcId: number;
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService,private location: Location,) {
    this.route.queryParams.subscribe(params => {
      if (params['RefAppSrcId'] != null) {
        this.RefAppSrcId = params['RefAppSrcId'];
      }
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppSource.json";
    this.viewGenericObj.viewEnvironment = environment.FoundationR3Url;
    
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/refAppSrcOfficeMbrTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.tempPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/refAppSrcOfficeMbrTempPaging.json";

    this.GetListRefAppSrcOfficeMbrByRefAppSrcId();
  }

  GetListRefAppSrcOfficeMbrByRefAppSrcId(){
    this.http.post(URLConstant.GetListRefAppSrcOfficeMbrByRefAppSrcId, { RefAppSrcId: this.RefAppSrcId }).subscribe(
      (response) => {
        var arrMemberList = new Array();
        for (let index = 0; index < response["RefAppSrcOfficeMbrObjs"].length; index++) {
          arrMemberList.push(response["RefAppSrcOfficeMbrObjs"][index].RefOfficeCode)
        }

        if (arrMemberList.length != 0) {
          const addCritList = new CriteriaObj();
          addCritList.propName = 'REF_OFFICE_CODE';
          addCritList.restriction = AdInsConstant.RestrictionNotIn;
          addCritList.listValue = arrMemberList;
          this.tempPagingObj.addCritInput.push(addCritList);
        }
        this.tempPagingObj.isReady = true;
      }
    );
  }

  getListTemp(ev) {
    console.log(ev);
    this.listSelectedCode = ev.TempListId;
  }

  SaveAppSourceOfficeMember() {
    if (this.listSelectedCode.length == 0) {
      this.toastr.errorMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }
    
    var RequestItem = {
      RefAppSrcId : this.RefAppSrcId,
      RefOfficeCodes: this.listSelectedCode
    }
    this.http.post(URLConstant.AddRefAppSrcOfficeMbr, RequestItem).subscribe(
      (response) => {
        this.toastr.successMessage(response['message']);
        AdInsHelper.RedirectUrl(this.router,["/Setting/AppSource/OfficeMember/Paging"],{ "RefAppSrcId": this.RefAppSrcId });
      });
    
  }
}