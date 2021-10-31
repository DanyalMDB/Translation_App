import { Injectable } from '@angular/core';
import { TranslateVoiceInputModel } from '../Models/translateVoiceInpurModel';
import { TranslationService } from './translation.service';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords: string;


  constructor(private translationService: TranslationService) { }
  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en';

    this.recognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(transcript);
    });
  }
  start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', (condition: any) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      }
      else {
        this.wordConcat();
        this.recognition.start();
      }
    });
  }
  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
    this.recognition.stop();
    console.log("End speech recognition")
  }
  wordConcat() {
    this.translationService.transalateVoice(this.tempWords).then((res) => {
      this.tempWords = res.translatedText;
      this.text = this.text + ' ' + this.tempWords + '.'; this.tempWords = '';
    }).catch((err) => {
      this.text = this.text + ' ' + "Unable to transalte the voice.";
    }).finally(() => {
    });
  }
}