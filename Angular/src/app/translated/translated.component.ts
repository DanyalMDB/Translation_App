import { Component, Injectable, OnInit } from '@angular/core';
import { TranslationOutputModel } from '../Models/translationOutputModel';

import { TranslationService } from '../Services/translation.service';
import { VoiceRecognitionService } from '../Services/voice-recognition.service';

import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

enum eRecordingState {
  Ready = 1,
  Recording = 2,
  Finished = 3
}
@Component({
  selector: 'app-translated',
  templateUrl: './translated.component.html',
  styleUrls: ['./translated.component.css'],
  providers: [VoiceRecognitionService]
})
export class TranslatedComponent implements OnInit {
  translateOutputModel: TranslationOutputModel;
  click: boolean = false;
  isError: boolean = false;
  isFetching: boolean = false;
  fileUrl: string = "";
  errorMessage: string = "";
  outsideFileLink: string = "";
  sanitizer: DomSanitizer;

  recording: eRecordingState = eRecordingState.Ready;

  constructor(private translationService: TranslationService,
    public service: VoiceRecognitionService,
    private domSanitizer: DomSanitizer,
    private authService: AuthService, private router: Router) {
    this.service.init();
    this.sanitizer = domSanitizer; 
  }
  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) this.router.navigateByUrl("/");
    this.errorMessage = "";
    this.isFetching = true;
    try {
      this.translationService.getAll().then((res) => {
        this.fileUrl = "http://127.0.0.1:8887" + res.fileName.substr(res.fileName.indexOf("Files") + "Files".length);;

      }).catch((err) => {
        //this.errorMessage = err.error;
        //this.isError=true;
        //if(!this.errorMessage)
        this.errorMessage = "Failed to translate file due to unknown reasons";
      }).finally(() => {
        this.isFetching = false;
      });
    } catch (e) {
      //this.isError=true;
      this.isFetching = false;
      this.errorMessage = "Failed to translate file due to unkwon error";
    }
  };
  startService() {
    this.recording = eRecordingState.Recording;
    this.service.start()
  }

  stopService() {
    this.recording = eRecordingState.Finished;
    this.service.stop();
  }
  outsideFileLinkChange(event) {
    try {
      let value: string = event.target.value;
      value = value.substr(value.indexOf("src") + 5);
      value = value.substring(0, value.indexOf('"'));
      this.outsideFileLink = value;
    } catch { }
  }

  tranform(url): SafeUrl {
    return this._isUrlValid(url) ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : url;
  }
  transformFileUrl(url: string) {

    url = "http://127.0.0.1:8887" + url.substr(url.indexOf("Files") + "Files".length);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  private _isUrlValid(url) {
    const regex = /^http[s]?:\/\/(www\.)?(.*)?\/?(.)*/;
    let m = regex.exec(url);
    if (m == null) return false;
    return (m.index === regex.lastIndex);
  }
}
