import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lookup-tax-city-issuer',
  templateUrl: './lookup-tax-city-issuer.component.html'
})
export class LookupTaxCityIssuerComponent implements OnInit {
  inputObj: UcPagingObj = new UcPagingObj();;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.inputObj._url = "./assets/uclookup/NAP/lookupDistrict.json";
    this.inputObj.enviromentUrl = environment.FoundationR3Url;
    this.inputObj.pagingJson = "./assets/uclookup/NAP/lookupDistrict.json";
    var disCrit = new Array();
    var critDisObj = new CriteriaObj();
    critDisObj.DataType = 'text';
    critDisObj.restriction = AdInsConstant.RestrictionEq;
    critDisObj.propName = 'TYPE';
    critDisObj.value = 'DIS';
    disCrit.push(critDisObj);
    this.inputObj.addCritInput = disCrit;
  }

  GetResult(e) {
    this.activeModal.close(e);
  }

}
