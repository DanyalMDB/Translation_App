import { Component, Injectable, OnInit } from '@angular/core';
import { VoiceRecognitionService } from '../Services/voice-recognition.service';

@Component({
  selector: 'app-voice-recognition',
  templateUrl: './voice-recognition.component.html',
  styleUrls: ['./voice-recognition.component.css'],
  providers: [VoiceRecognitionService]
})
@Injectable({ providedIn: 'root' })
export class VoiceRecognitionComponent implements OnInit {

  constructor(public service: VoiceRecognitionService) {
    this.service.init()
  }

  ngOnInit(): void {
  }

  startService() {
    this.service.start()
  }

  stopService() {
    this.service.stop()
  }


}
