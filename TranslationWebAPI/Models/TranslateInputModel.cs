using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace TranslationWebAPI.Models
{
    public class TranslateInputModel
    { 
        public string Content { get; set; }
        public string FromLanguage { get; set; }
        public string ToLanguage { get; set; }
    }
}
