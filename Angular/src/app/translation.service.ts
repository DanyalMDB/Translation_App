import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateInputModel } from './Models/translateInputModel';
import { TranslationOutputModel } from './Models/translationOutputModel';
import { TranslateVoiceInputModel } from './Models/translateVoiceInpurModel';
import { TranslationVoiceOutputModel } from './Models/translateVoiceOutputModel';
@Injectable({ providedIn: 'root' })
export class TranslationService {
  url = 'https://localhost:5001/api/TranslationWebAPI/uploadFileWithFromTo';
  voiceUrl = 'https://localhost:5001/api/TranslationWebAPI/TransalateVoice';
  constructor(private http: HttpClient) {
  }

  getAll(uploadData: any, inputModel: TranslateInputModel): Observable<TranslationOutputModel> {
    return this.http.post<TranslationOutputModel>
      (this.url + "?to=" + inputModel.ToLanguage
        + "&from=" + inputModel.FromLanguage, uploadData);
  }

  transalateVoice(inputModel: TranslateVoiceInputModel): Observable<TranslationVoiceOutputModel> {
    return this.http.post<TranslationVoiceOutputModel>
      (this.voiceUrl + "?ToLanguage=" + inputModel.ToLanguage
        + "&FromLanguage=" + inputModel.FromLanguage + "&Content=" + inputModel.Content, null);
  }
}
