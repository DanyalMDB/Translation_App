import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 

import { AppRoutingModule, routerModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslationComponent } from './translation/translation.component';
import { TranslationService } from './Services/translation.service';
import { TranslatedComponent } from './translated/translated.component';
import { VoiceRecognitionComponent } from './voice-recognition/voice-recognition.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HeaderComponent } from './components/header/header.component';
import { ButtonsModule, CardsModule, CollapseModule, MDBBootstrapModule, WavesModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    AppComponent,
    TranslationComponent,
    TranslatedComponent,
    VoiceRecognitionComponent,
    SignUpComponent,
    HeaderComponent,
  ],
  imports: [
    routerModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    ButtonsModule,
    CardsModule,
    WavesModule,
    CollapseModule ,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule 
  ],
  providers: [ TranslationService,  HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
