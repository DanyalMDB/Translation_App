using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TranslationWebAPI.Models
{
    public class TranslateOutputModel
    {
        
        public string FileName { get; set; } 
        public string OriginalText { get; set; }
        public string TranslatedText { get; set; }
        public string FilePath { get; set; }
    }
}
