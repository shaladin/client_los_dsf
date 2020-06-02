import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-multi-collateral-paging',
  templateUrl: './multi-collateral-paging.component.html',
  styleUrls: ['./multi-collateral-paging.component.scss']
})
export class MultiCollateralPagingComponent implements OnInit {
  HiddenState: string;
  AppId: number;
  listCollateralDataOwnByAppId: any;
  @Output() ResponseMouAddColl: EventEmitter<any> = new EventEmitter<any>();
  @Output() objOutput: EventEmitter<any> = new EventEmitter<any>();

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
    });
  }

  ngOnInit() {
    this.GetListAppCollateralByAppId()
  }

  SetHiddenState(){
    this.HiddenState = "false";
    this.objOutput.emit(this.HiddenState)
  }

  GetListAppCollateralByAppId() {
    var obj = {
      AppId: this.AppId,
    }

    this.http.post(AdInsConstant.GetListAppCollateralByAppId, obj).subscribe(
      (response) => {
        this.listCollateralDataOwnByAppId = response["ReturnObject"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editData(AppCollateralId){
    this.objOutput.emit(AppCollateralId);
  }

  next() {
    this.ResponseMouAddColl.emit({ StatusCode: "200" });
  }
}