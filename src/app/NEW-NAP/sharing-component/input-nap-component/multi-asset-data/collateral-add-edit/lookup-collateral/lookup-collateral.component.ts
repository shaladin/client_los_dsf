import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-lookup-collateral',
  templateUrl: './lookup-collateral.component.html'
})
export class LookupCollateralComponent implements OnInit {
  @Input() AssetTypeCode: string;
  inputObj: UcPagingObj = new UcPagingObj();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.inputObj._url = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputObj.enviromentUrl = environment.FoundationR3Url;
    this.inputObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    var criteriaList = new Array<CriteriaObj>();
    var criteriaObj = new CriteriaObj();
    criteriaObj.restriction = AdInsConstant.RestrictionEq;
    criteriaObj.propName = 'B.ASSET_TYPE_CODE';
    criteriaObj.value = this.AssetTypeCode;
    criteriaList.push(criteriaObj);
    this.inputObj.addCritInput = criteriaList;
  }

  GetResult(e) {
    this.activeModal.close(e);
  }

}
