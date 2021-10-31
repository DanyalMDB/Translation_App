import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TranslationOutputModel {
     fileName: string | undefined;
     originalText: string | undefined;
     translatedText: string | undefined;
}