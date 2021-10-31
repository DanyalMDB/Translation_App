import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslatedComponent } from '../app/translated/translated.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TranslationComponent } from './translation/translation.component';
import { VoiceRecognitionComponent } from './voice-recognition/voice-recognition.component';

const routes: Routes = [
  { path: '', component: SignUpComponent },
  { path: 'Translation', pathMatch: 'full', component: TranslationComponent },
  { path: 'VoiceRecognition', pathMatch: 'full', component: VoiceRecognitionComponent },
  { path: 'Translated', pathMatch: 'full', component: TranslatedComponent },
  { path: 'Auth', pathMatch: 'full', component: SignUpComponent }];

export const routerModule = RouterModule.forRoot(routes);
@NgModule({
  imports: [routerModule],
  exports: [RouterModule],

})
export class AppRoutingModule { }
