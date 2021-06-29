import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';


@Component({
  selector: 'app-app-source-office-member-paging',
  templateUrl: './app-source-office-member-paging.component.html'
})
export class AppSourceOfficeMemberPagingComponent implements OnInit {

  //param: any;
  RefAppSrcId: string;
  inputPagingObj: any;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  constructor(private route: ActivatedRoute){
    this.route.queryParams.subscribe(params => {
      this.RefAppSrcId = params["RefAppSrcId"];
  })
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppSource.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppSourceOfficeMember.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppSourceOfficeMember.json";
    this.inputPagingObj.deleteUrl = URLConstant.DeleteRefAppSrcOfficeMbr;

    var whereValue = new WhereValueObj();
    whereValue.property = "RefAppSrcId";
    whereValue.value = this.RefAppSrcId;
    this.inputPagingObj.whereValue.push(whereValue);
  }

}
