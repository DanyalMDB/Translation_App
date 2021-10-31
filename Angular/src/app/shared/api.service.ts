import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import JTranslateOutputModel from './TranslateOutputModel';
import JTranslateVoiceOutputModel from './TranslateOutputModel';
import { TranslateVoiceInputModel } from '../Models/translateVoiceInpurModel';
import TranslateOutputModel from './TranslateOutputModel';
import { TranslationVoiceOutputModel } from '../Models/translateVoiceOutputModel';

@Injectable()
export default class ApiService {
  public API = 'http://localhost:5001/api';
  public JOGGING_RECORDS_ENDPOINT = `${this.API}/Home/Translate_Click`;
  public JOGGING_RECORDS_ENDPOINT1 = `${this.API}/Home/TransalateVoice`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Array<TranslateOutputModel>> {
    return this.http.get<Array<JTranslateOutputModel>>(this.JOGGING_RECORDS_ENDPOINT);
  }
  transalateVoice(): Observable<Array<TranslationVoiceOutputModel>> {
    return this.http.get<Array<TranslationVoiceOutputModel>>(this.JOGGING_RECORDS_ENDPOINT1);
  }
}