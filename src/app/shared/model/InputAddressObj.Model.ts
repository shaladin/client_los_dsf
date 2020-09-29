import { InputFieldObj } from './InputFieldObj.Model';
import {NgForm, FormGroup} from '@angular/forms';
import { environment } from 'environments/environment';

export class InputAddressObj {
    enjiForm: NgForm;
    identifier: any;
    default: any;
    title : string;
    inputField: InputFieldObj;
    showAllPhn: boolean;
    showPhn1: boolean;
    showPhn2: boolean;
    showPhn3: boolean;
    requiredPhn1: boolean;
    requiredPhn2: boolean;
    requiredPhn3: boolean;
    requiredPhnExt1: boolean;
    requiredPhnExt2: boolean;
    requiredPhnExt3: boolean;
    showFax: boolean;
    showOwnership: boolean;
    showSubsection: boolean;
    showStayLength: boolean;
    isRequired: boolean;
    environmentUrl: string;
    isReadonly: boolean;

    constructor() {
        this.title = "Address Information";
        this.inputField = new InputFieldObj();
        this.showAllPhn = true;
        this.showPhn1 = true;
        this.showPhn2 = true;
        this.showPhn3 = true;
        this.requiredPhn1 = false;
        this.requiredPhn2 = false;
        this.requiredPhn3 = false;
        this.requiredPhnExt1 = false;
        this.requiredPhnExt2 = false;
        this.requiredPhnExt3 = false;
        this.showFax = true;
        this.showOwnership = false;
        this.showSubsection = true;
        this.showStayLength = false;
        this.isRequired = true;
        this.environmentUrl = environment.FoundationR3Url;
        this.isReadonly = false;
    }
}