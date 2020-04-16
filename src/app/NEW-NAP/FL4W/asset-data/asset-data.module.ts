import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AssetDataFL4WRoutingModule } from "./asset-data-routing.module";
import { AssetDataPagingComponent } from "./asset-data-paging/asset-data-paging.component";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { AssetDataAddEditComponent } from "./asset-data-add-edit/asset-data-add-edit.component";
import { UcaddressModule } from "@adins/ucaddress";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { UclookupgenericModule } from "@adins/uclookupgeneric";
import { UcviewgenericModule } from "@adins/ucviewgeneric";

@NgModule({
  imports: [
    CommonModule,
    AdInsModule,
    AssetDataFL4WRoutingModule,
    UcSubsectionModule,
    UcaddressModule,
    UcShowErrorsModule,
    UclookupgenericModule,
    UcviewgenericModule,
    
  ],
  declarations: [
    AssetDataPagingComponent,
    AssetDataAddEditComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AssetDataFL4WModule { }