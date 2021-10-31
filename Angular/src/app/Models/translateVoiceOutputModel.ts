import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TranslationVoiceOutputModel {  
     originalText : string | undefined;
     translatedText : string | undefined;
}