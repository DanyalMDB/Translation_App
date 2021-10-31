import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TranslateInputModel { 
     Content : string | undefined;
     FromLanguage : string | undefined;
     ToLanguage : string | undefined; 
}
