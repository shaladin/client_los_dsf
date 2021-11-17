import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';

@Component({
  selector: 'app-mou-view-addcoll',
  templateUrl: './mou-view-addcoll.component.html',
  providers: [NGXToastrService]
})
export class MouViewAddcollComponent implements OnInit {
  @Input() MouCustId: number;

  listCollateralData: Array<any> = new Array();
  isView: boolean = false;

  constructor(private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    this.http.post(URLConstant.GetMouCustCollateralForMouViewByMouCustId, { Id: this.MouCustId }).subscribe(
      (response: GenericListObj) => {
        this.listCollateralData = response.ReturnObject;
      })
  }

  MouCustCollateralId: number = 0;
  async ViewColl(MouCustCollateralId: number) {
    this.isView = false;
    console.log(MouCustCollateralId);
    setTimeout(() => {      
      this.MouCustCollateralId = MouCustCollateralId;
      this.isView = true;
    }, 500);
  }

  Back() {
    this.isView = false;
  }
}
