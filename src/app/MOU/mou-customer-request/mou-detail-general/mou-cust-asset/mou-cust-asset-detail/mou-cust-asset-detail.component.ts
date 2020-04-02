import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-mou-cust-asset-detail',
  templateUrl: './mou-cust-asset-detail.component.html',
  styleUrls: ['./mou-cust-asset-detail.component.scss']
})
export class MouCustAssetDetailComponent implements OnInit {
  @Input() ListExcludeFullAssetCode: Array<string>;
  @Input() AssetTypeCode: string;
  @Input() MouCustId: number;
  inputLookupObj: InputLookupObj;

  MOUCustAssetForm = this.fb.group({
    MouCustAssetId: [0],
    MouCustId: [0],
    FullAssetCode: ['', [Validators.required]],
    FullAssetName: ['', [Validators.required]],
    RowVersion: ['']
  });

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { 
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/MOU/lookupMOUCustAsset.json";
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/MOU/lookupMOUCustAsset.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/MOU/lookupMOUCustAsset.json";
  }

  ngOnChanges(changes: SimpleChanges) {
    var criteriaList = new Array<CriteriaObj>();
    var criteriaObj = new CriteriaObj();
    criteriaObj.restriction = AdInsConstant.RestrictionEq;
    criteriaObj.propName = 'AT.ASSET_TYPE_CODE';
    criteriaObj.value = changes["AssetTypeCode"].toString();
    criteriaList.push(criteriaObj);

    criteriaObj = new CriteriaObj();
    criteriaObj.restriction = AdInsConstant.RestrictionEq;
    criteriaObj.propName = 'AM.HIERARCHY_LVL';
    criteriaObj.value = "1";
    criteriaList.push(criteriaObj);

    criteriaObj = new CriteriaObj();
    criteriaObj.restriction = AdInsConstant.RestrictionNotIn;
    criteriaObj.propName = 'AM.FULL_ASSET_CODE';
    criteriaObj.value = JSON.stringify(changes["ListExcludeFullAssetCode"]);
    criteriaList.push(criteriaObj);

    this.inputLookupObj.addCritInput = criteriaList;
  }

  ngOnInit() {
    this.MOUCustAssetForm.patchValue({
      MouCustId: this.MouCustId
    });
  }

  Save(enjiForm){
    var formData = this.MOUCustAssetForm.value;

    this.httpClient.post(AdInsConstant.AddMouCustAsset, formData).subscribe(
      (response) => {
        this.activeModal.close(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
