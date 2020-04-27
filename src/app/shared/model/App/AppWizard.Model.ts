import { WizardComponent } from "angular-archwizard";

export class AppWizardObj {
    Wizard : WizardComponent;
    AppStep : string;

    constructor(Wizard : WizardComponent, AppStep : string){
        this.Wizard = Wizard;
        this.AppStep = AppStep;
    }
}