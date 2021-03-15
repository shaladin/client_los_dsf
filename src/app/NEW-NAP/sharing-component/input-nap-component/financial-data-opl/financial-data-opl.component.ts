import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';


@Component({
  selector: 'app-financial-data-opl',
  templateUrl: './financial-data-opl.component.html',
})
export class FinancialDataOplComponent implements OnInit {
  @Input() AppId: number = 0;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  isPaging: boolean = true;
  AppAssetId: number = 0;
  AppAssetFinDataObj: any;
  isAllAssetFinDone: boolean = true;
  isAnyDataAsset: boolean = false;
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.GetAllAssetFinancialData();
  }

  Edit(AppAssetId) {
    this.AppAssetId = AppAssetId;
    this.isPaging = false;  
  }

  BackPaging() {
    this.AppAssetId = 0;
    this.GetAllAssetFinancialData();
    this.isPaging = true;  
  }

  Cancel() {
    this.outputCancel.emit();
  }

  Next() {
    if (this.isAnyDataAsset) {
      if (this.isAllAssetFinDone) {
        this.outputTab.emit();
      }
      else {
        this.toastr.warningMessage("Please Submit All Financial Data For Each Asset");
      }
    }
    else {
      this.toastr.warningMessage("There is no Asset Data Found");
    }
  }

  GetAllAssetFinancialData() {
    this.isAllAssetFinDone = true;
    var appObj = {
      AppId: this.AppId,
    };
    this.http.post(URLConstant.GetListAppAssetFinDataGridByAppId, appObj).subscribe(
      (response) => {
        this.AppAssetFinDataObj = response;
        if (this.AppAssetFinDataObj.AppAssetFinDataGridObjs.length > 0) {
          this.isAnyDataAsset = true;
          for (let i = 0; i < this.AppAssetFinDataObj.AppAssetFinDataGridObjs.length; i++) {
            if (this.AppAssetFinDataObj.AppAssetFinDataGridObjs[i].IsFinancialDone == false) {
              this.isAllAssetFinDone = false;
              break;
            }
          }
          console.log(response);
        }
      }
    );
  }
}
