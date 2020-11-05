import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class FormValidateService {

    formValidate(form: any){
        this.scrollIfFormHasErrors(form).then(() => {
            // Run any additional functionality if you need to. 
          });
     }
     
    async scrollIfFormHasErrors(form): Promise<any> {
        await form.invalid;
        this.scrollToError();
    }

    private scrollToError(): void {
        const firstElementWithError = document.querySelector('input.ng-invalid');
        this.scrollTo(firstElementWithError);
    }

    private scrollTo(el: Element) {
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }
}