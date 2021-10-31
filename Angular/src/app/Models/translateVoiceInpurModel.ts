import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TranslateVoiceInputModel { 
     Content : string | undefined;
     FromLanguage : string | undefined;
     ToLanguage : string | undefined; 
}
