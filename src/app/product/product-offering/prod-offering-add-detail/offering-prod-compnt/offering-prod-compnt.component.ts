import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { WizardComponent } from 'angular-archwizard';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqAddEditProdOfferingDObj } from 'app/shared/model/Request/Product/ReqAddEditProdOfferingObj.model';
import { ProdOfferingDObj } from 'app/shared/model/Product/ProdOfferingDObj.model';

@Component({
  selector: 'app-offering-prod-compnt',
  templateUrl: './offering-prod-compnt.component.html'
})
export class OfferingProdCompntComponent implements OnInit {

  @Input() ProdOfferingHId: number;
  Source: string = "";
  ListProductComponentObj : ReqAddEditProdOfferingDObj = new ReqAddEditProdOfferingDObj();

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private wizard: WizardComponent,
    private route: ActivatedRoute,
  ) { 
    this.route.queryParams.subscribe(params => {
      this.Source = params["source"];
    });
  }

  ngOnInit() {
  }
  
  SaveForm(event) {
    this.generateSaveObj(event);
    this.http.post(URLConstant.AddOrEditProdOfferingDetail, this.ListProductComponentObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.BackToPaging();
      }
    );
  }

  NextDetail(event) {
    this.generateSaveObj(event);
    this.http.post(URLConstant.AddOrEditProdOfferingDetail, this.ListProductComponentObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.wizard.goToNextStep();
      }
    );
  }

  generateSaveObj(event){
    this.ListProductComponentObj.ProdOfferingHId = this.ProdOfferingHId;
    for (let i = 0; i < event.length; i++) {
      let GeneralDataObj = new ProdOfferingDObj();
      GeneralDataObj.ProdOfferingDId = event[i].ProdOfferingDId;
      GeneralDataObj.ProdOfferingHId = this.ProdOfferingHId;
      GeneralDataObj.RefProdCompntCode = event[i].RefProdCompntCode;
      GeneralDataObj.RefProdCompntGrpCode = event[i].RefProdCompntGrpCode;
      if(event[i].IsProdOffering == true){
        GeneralDataObj.CompntValue = event[i].OfferingCompntValue;
        GeneralDataObj.CompntValueDesc = event[i].OfferingCompntValueDesc;
        GeneralDataObj.MrProdBehaviourCode = event[i].OfferingMrProdBehaviour;  
      }else{
        GeneralDataObj.CompntValue = event[i].HOCompntValue;
        GeneralDataObj.CompntValueDesc = event[i].HOCompntValueDesc;
        GeneralDataObj.MrProdBehaviourCode = event[i].HOMrProdBehaviour;
      }
      this.ListProductComponentObj.ProdOfferingDetails.push(GeneralDataObj);
    }
  }

  Cancel()
  {
    this.BackToPaging();
  }

  BackToPaging()
  {
    if(this.Source == "return")
    {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_RTN_PAGING],{ });
    }
    else
    {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_PAGING],{ });
    }
  }

}
