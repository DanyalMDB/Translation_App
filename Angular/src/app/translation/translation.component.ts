import { Component, Injectable, OnInit, } from '@angular/core';
import { Router } from '@angular/router'; 
import { TranslationOutputModel } from '../Models/translationOutputModel';
import { TranslationService } from '../Services/translation.service';
import { VoiceRecognitionService } from '../Services/voice-recognition.service';
import { AuthService } from '../Services/auth.service';
import { TranslateInputModel } from '../Models/translateInputModel';


@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css'],
  providers: [ ]
  
})
@Injectable({ providedIn: 'root' })
export class TranslationComponent implements OnInit {
  
  isError:boolean=false;
  errorMessage:string="";

  uploadData: any;
  fromLanguage: string | undefined;
  toLanguage: string | undefined;
  chosenFileName: any;
  chosenFile: any;
  snackbar: any;
  translateOutputModel: TranslationOutputModel;
 
  constructor(private translationService: TranslationService, private voiceRecognitionService: VoiceRecognitionService,
    private router: Router, private authService:AuthService) {
  }
  ngOnInit(): void {
    if(!this.authService.isLoggedIn())this.router.navigateByUrl("/");
  }
  
  setChosenFile(fileInput: Event) {
    this.isError=false;
    this.errorMessage="";
    console.log(fileInput);
    const control: any = fileInput.target;
    if (!control.files || control.length === 0) {
      this.chosenFileName = null;
      this.chosenFile = null;
    } else {
      this.chosenFileName = control.files[0].name;
      this.chosenFile = control.files[0];
    }
  }


  handleFileInput() {
    try{
    this.uploadData = new FormData();
    this.uploadData.append('file', this.chosenFile, this.chosenFileName);
    console.log("Upload data" + this.uploadData);
    }catch{
      this.isError=true;
      this.errorMessage="Failed to upload file, we cannot proceed without uploading file";
    }

  }
  changeFromLanguage(event: any) {
    this.isError=false;
    this.errorMessage="";
    this.fromLanguage = event.target.value;
    console.log(this.fromLanguage);

  }
  changeToLanguage(event: any) {
    this.isError=false;
    this.errorMessage="";
    this.toLanguage = event.target.value;
    console.log(this.toLanguage);

  }
  btnTranslated() {

    if (this.uploadData == null) {
      this.isError=true;
      this.errorMessage="No file is selected to translate";
      return;
    }
    if (this.fromLanguage == undefined || this.fromLanguage == "") {
      this.isError=true;
      this.errorMessage="Please select file language. We do not support auto detection";
      return;
    }
    if (this.toLanguage == undefined || this.toLanguage == "") {
      this.isError=true;
      this.errorMessage="Please select output file language. We should know language to translate file to.";
      return;
    }
    var translateInputModel: TranslateInputModel = {
      Content: "",
      FromLanguage: this.fromLanguage,
      ToLanguage: this.toLanguage
    }
    this.translationService.setData(this.uploadData, translateInputModel);

    this.router.navigate(['/Translated']);

  }//end of btnUpload

  btnRecord() {
    this.router.navigate(['/VoiceRecognition']);
  }//end of btnRecord
  
}//end of class
