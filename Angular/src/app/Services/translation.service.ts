import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateInputModel } from '../Models/translateInputModel';
import { TranslationOutputModel } from '../Models/translationOutputModel';
import { TranslationVoiceOutputModel } from '../Models/translateVoiceOutputModel';
import { TranslateVoiceInputModel } from '../Models/translateVoiceInpurModel';
@Injectable({ providedIn: 'root' })
export class TranslationService {
  uploadData: any;
  inputModel: TranslateInputModel;
  url = 'https://localhost:44331/api/TranslationWebAPI/uploadFileWithFromTo';
  voiceUrl = 'https://localhost:44331/api/TranslationWebAPI/TransalateVoice';
  constructor(private http: HttpClient) {
  }
  setData(uploadData: any, inputModel: TranslateInputModel) {
    this.uploadData = uploadData;
    this.inputModel = inputModel;
  }
  getAll(): Promise<TranslationOutputModel> {
    return this.http.post<TranslationOutputModel>
      (this.url + "?to=" + this.inputModel?.ToLanguage
        + "&from=" + this.inputModel?.FromLanguage, this.uploadData).toPromise();
  }

  transalateVoice(content: string): Promise<TranslationVoiceOutputModel> {
    return this.http.post<TranslationVoiceOutputModel>
      (this.voiceUrl + "?toLanguage=" + this.inputModel.ToLanguage
        + "&fromLanguage=" + this.inputModel.FromLanguage + "&content=" + content, null).toPromise();
  }
}
