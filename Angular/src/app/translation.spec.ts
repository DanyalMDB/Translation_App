import { TranslateInputModel } from "./Models/translateInputModel";
import { TranslateVoiceInputModel } from "./Models/translateVoiceInpurModel";
import TranslateOutputModel from "./shared/TranslateOutputModel";


describe('Translation', () => {
  it('should create an instance', () => {
    expect(new TranslateVoiceInputModel()).toBeTruthy();
    expect(new TranslateVoiceInputModel()).toBeTruthy();
    expect(new TranslateInputModel()).toBeTruthy();
    expect(new TranslateOutputModel()).toBeTruthy();
  });
});
