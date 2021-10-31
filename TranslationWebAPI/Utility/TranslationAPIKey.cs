using Google.Apis.Auth.OAuth2;
using Google.Cloud.Translation.V2;
using System.IO;
using TranslationWebAPI.Models;
using TranslationWebAPI.Models.TransalateVoice;

namespace TranslationWebAPI.Utility
{
    public static class TranslationAPIKey
    {
        public static string TranslateText(TranslateInputModel inputModel)
        {
            string file = Directory.GetCurrentDirectory() + ("/translationapi.json");
            //deserialize JSON from file
            string Json = File.ReadAllText(file);
            GoogleCredential credentials = GoogleCredential.FromJson(Json);
            TranslationClient client = TranslationClient.Create(credentials);

            //var response = client.TranslateText(inputModel.Content, LanguageCodes.Russian, LanguageCodes.English);
            var response = client.TranslateText(inputModel.Content.Replace("\n", "").Replace("\r", ""), inputModel.ToLanguage, inputModel.FromLanguage);

            return response.TranslatedText;
        }
        public static string TranslateVoiceText(TransalateVoiceInput inputModel)
        {
            string file = Directory.GetCurrentDirectory() + ("/translationapi.json");
            //deserialize JSON from file
            string Json = File.ReadAllText(file);
            GoogleCredential credentials = GoogleCredential.FromJson(Json);
            TranslationClient client = TranslationClient.Create(credentials);

            //var response = client.TranslateText(inputModel.Content, LanguageCodes.Russian, LanguageCodes.English);
            var response = client.TranslateText(inputModel.Content.Replace("\n", "").Replace("\r", ""), inputModel.ToLanguage, inputModel.FromLanguage);

            return response.TranslatedText;
        }
    }
}
