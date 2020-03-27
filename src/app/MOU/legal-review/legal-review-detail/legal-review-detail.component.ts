import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-legal-review-detail',
  templateUrl: './legal-review-detail.component.html',
  styleUrls: ['./legal-review-detail.component.scss']
})
export class LegalReviewDetailComponent implements OnInit {
  viewObj: string;
  MouCustId: any;
  GetListActiveRefMasterUrl  = AdInsConstant.GetListActiveRefMaster;
  responseObj: any;
  responseRefMasterObj: any;
  GetMouCustTcForMouLglByCustMouIdUrl = AdInsConstant.GetMouCustTcForMouLglByCustMouId;
  responseMouObj: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewCustomerDocPrinting.json";
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
      }
    });
    var refObj = { "RefMasterTypeCode": "LGL_REVIEW" };
    this.http.post(this.GetListActiveRefMasterUrl, refObj).subscribe(
      response => {
        this.responseRefMasterObj = response['ReturnObject'];
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );
      // this.assetTypeObj = new AssetTypeObj();
      // this.assetTypeObj.AssetTypeId = this.assetTypeId;
      // this.AssetTypeForm.controls["AssetTypeCode"].disable();
      // this.http.post(this.getUrl, this.assetTypeObj).subscribe(
      //   response => {
      //     this.resultData = response;
      //     this.RowVersion = this.resultData.RowVersion;
      //     this.AssetTypeForm.patchValue({
      //       AssetTypeCode: this.resultData.AssetTypeCode,
      //       AssetTypeName: this.resultData.AssetTypeName,
      //       SerialNo1Label: this.resultData.SerialNo1Label,
      //       SerialNo2Label: this.resultData.SerialNo2Label,
      //       SerialNo3Label: this.resultData.SerialNo3Label,
      //       SerialNo4Label: this.resultData.SerialNo4Label,
      //       SerialNo5Label: this.resultData.SerialNo5Label,
      //       IsMndtrySerialNo1: this.resultData.IsMndtrySerialNo1,
      //       IsMndtrySerialNo2: this.resultData.IsMndtrySerialNo2,
      //       IsMndtrySerialNo3: this.resultData.IsMndtrySerialNo3,
      //       IsMndtrySerialNo4: this.resultData.IsMndtrySerialNo4,
      //       IsMndtrySerialNo5: this.resultData.IsMndtrySerialNo5,
      //       IsLoanObj: this.resultData.IsLoanObj,
      //       IsActive: this.resultData.IsActive,
      //       MaxHierarchyLevel: this.resultData.MaxHierarchyLevel
      //     });
    var mouObj = { "MouCustId": this.MouCustId };
    this.http.post(this.GetMouCustTcForMouLglByCustMouIdUrl, mouObj).subscribe(
      response => {
        this.responseMouObj = response['ReturnObject'];
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );

    
  }

}
