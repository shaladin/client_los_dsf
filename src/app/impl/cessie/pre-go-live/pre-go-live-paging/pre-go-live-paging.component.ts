import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'cessie-pre-go-live-paging',
  templateUrl: './pre-go-live-paging.component.html'
})
export class CessiePreGoLivePagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCessiePreGoLive.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCessiePreGoLive.json";
    var critInput = new CriteriaObj();
    critInput.propName = "wFht.ACT_CODE";
    critInput.restriction = AdInsConstant.RestrictionEq;
    critInput.value = "PGLV_CESSIE";

    this.inputPagingObj.addCritInput.push(critInput);
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
    else if (ev.Key == "Edit") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_PGL_DETAIL], { "CessieHXId": ev.RowObj.CessieHXId, "CessieNo": ev.RowObj.CessieNo, "TaskListId": ev.RowObj.TaskListId});
    }
  }
}
