import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ReqByProdOffCodeAndVersionObj } from 'app/shared/model/request/product/req-by-prod-off-code-and-version-obj.model';


@Component({
  selector: 'app-copy-cancelled-application-x',
  templateUrl: './copy-cancelled-application-x.component.html',
  styleUrls: ['./copy-cancelled-application-x.component.css']
})
export class CopyCancelledApplicationXComponent implements OnInit, OnDestroy  {
  @ViewChild(UcpagingComponent) paging: UcpagingComponent;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  link: string;
  BizTemplateCode: string;
  IsNapVersionMainData: boolean = false;
  isReady: boolean = false;
  navigationSubscription;

  constructor(private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute, 
    private router: Router) { 
      this.SubscribeParam();
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.RefetchData();
        }
      });
  }

  SubscribeParam(){    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
      if (params["IsNapVersionMainData"] != null) {
        this.IsNapVersionMainData = params["IsNapVersionMainData"];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  ngOnInit() {
	  this.SetUcPaging();
  }

  RefetchData(){
    this.isReady = false;
    this.SubscribeParam();
    this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  SetUcPaging() {
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'a.BIZ_TEMPLATE_CODE';
    critObj.value = this.BizTemplateCode;
	  this.inputPagingObj.addCritInput = new Array();
    
    if(this.BizTemplateCode === CommonConstant.OPL) {
      this.inputPagingObj._url = "./assets/ucpaging/new-nap/business-process/additional-process/copy-cancelled-application/search-cancelled-app-opl.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/new-nap/business-process/additional-process/copy-cancelled-application/search-cancelled-app-opl.json";
    }
    else {
      this.inputPagingObj._url = "./assets/ucpaging/searchCancelledApp.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCancelledApp.json";
    }

    this.inputPagingObj.addCritInput.push(critObj);
  }

  async getEvent(ev) {
    if(ev.Key == "prodOff") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
    else if(ev.Key == "copy") {
      if (confirm("Are you sure to copy this application?")) {
        if(this.BizTemplateCode === CommonConstant.OPL) {
          var obj = {
            AppNo: ev.RowObj.AppNo,
            OriOfficeCode: ev.RowObj.OfficeCode,
            IsCopyCancel: true
          };
          this.http.post(URLConstant.AddNewApplicationOplFromCopy, obj).subscribe(
            response => {
              this.toastr.successMessage(response["message"]);
              this.paging.searchPagination(1);
            }
          );
        }
        else {
          var reqByProdOffCodeAndVersionObj = new ReqByProdOffCodeAndVersionObj();
          reqByProdOffCodeAndVersionObj.ProdOfferingCode = ev.RowObj.ProdOfferingCode;
          reqByProdOffCodeAndVersionObj.ProdOfferingVersion = ev.RowObj.ProdOfferingVersion;
          await this.http.post(URLConstant.GetProdStatByProdOffCodeAndVersion, reqByProdOffCodeAndVersionObj).toPromise().then(
            (response) => {
              let ProdStat = response["ProdStat"];
              let ProdStatDescr = response["ProdStatDescr"];
              if(ProdStat != "ACT"){
              this.toastr.warningMessage(ExceptionConstant.PRODUCT_HAS + ProdStatDescr);
              }
            }
          );

          var url:string;
          if(environment.isCore)
          {
            url = this.IsNapVersionMainData ? URLConstantX.CopyCancelledAppForMainDataV2 : URLConstantX.CopyCancelledAppV2;
          }
          else{
            url = this.IsNapVersionMainData ? URLConstantX.CopyCancelledAppForMainData : URLConstantX.CopyCancelledApp;
          }

          
          this.http.post(url, { AppId: ev.RowObj.AppId }).subscribe(
            response => {
              this.toastr.successMessage(response["message"]);
              this.paging.searchPagination(1);
            }
          );
        }
      }
    }
  }

}
