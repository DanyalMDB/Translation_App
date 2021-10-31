
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SautinSoft;
using SautinSoft.Document;
using Syncfusion.Presentation;
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using TranslationWebAPI.Models;
using TranslationWebAPI.Models.TransalateVoice;
using TranslationWebAPI.Utility;

namespace TranslationWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TranslationWebAPIController : ControllerBase
    {
        private readonly string basePath = AppDomain.CurrentDomain.BaseDirectory + "/Files/";


        public TranslationWebAPIController()
        {
            if (!Directory.Exists(basePath)) Directory.CreateDirectory(basePath);
        }

        [HttpPost("TransalateVoice")]
        public TransalateVoiceOutput TransalateVoice(string Content, string FromLanguage, string ToLanguage)
        {
            TransalateVoiceOutput translateOutputModel = new();
            try
            {

                if (string.IsNullOrEmpty(FromLanguage))
                {
                    FromLanguage = "en";
                }
                if (string.IsNullOrEmpty(ToLanguage))
                {
                    ToLanguage = "ar";
                }
                if (string.IsNullOrEmpty(Content))
                {
                    Content = "";
                }

                TransalateVoiceInput inputModel = new()
                {
                    Content = Content,
                    FromLanguage = FromLanguage,
                    ToLanguage = ToLanguage
                };
                translateOutputModel.TranslatedText = TranslationAPIKey.TranslateVoiceText(inputModel);

            }
            catch (Exception ex)
            {
                translateOutputModel.TranslatedText = ex.ToString();
            }
            return translateOutputModel;
        }

        [HttpPost("uploadFile")]
        public TranslateOutputModel UploadFile([FromForm(Name = "file")] IFormFile resultFile)
        {
            TranslateInputModel inputModel = new();
            TranslateOutputModel translateOutputModel = new();
            try
            {
                if (resultFile != null)
                {
                    if (resultFile.Length == 0)
                    {
                        translateOutputModel.TranslatedText = "Bad request";
                        translateOutputModel.OriginalText = "Bad request";
                    }
                    else
                    {

                        using StreamReader reader = new(resultFile.OpenReadStream());
                        //Open an existing PowerPoint presentation
                        IPresentation pptxDoc = Presentation.Open(reader.BaseStream);
                        string content = "";

                        foreach (var item in pptxDoc.Slides)
                        {
                            foreach (var shape in item.Shapes)
                            {
                                IShape actualShape = shape as IShape;
                                content += actualShape.TextBody.Text;
                            }
                        }

                        inputModel.Content = content;
                        if (string.IsNullOrEmpty(inputModel.FromLanguage))
                        {
                            inputModel.FromLanguage = "en";
                        }
                        if (string.IsNullOrEmpty(inputModel.ToLanguage))
                        {
                            inputModel.ToLanguage = "ar";
                        }
                        translateOutputModel.OriginalText = content;
                        translateOutputModel.TranslatedText = TranslationAPIKey.TranslateText(inputModel);
                    }
                }
                else
                {
                    translateOutputModel = new TranslateOutputModel()
                    {
                        TranslatedText = "No file received"
                    };
                }
            }
            catch (Exception ex)
            {
                translateOutputModel = new TranslateOutputModel()
                {
                    TranslatedText = ex.ToString()
                };
            }
            return translateOutputModel;
        }

        /// <summary>
        /// Upload file read content and translate read content
        /// </summary>
        /// <param name="resultFile">File to translate</param>
        /// <param name="from">language of file</param>
        /// <param name="to">language to translate file to</param>
        /// <returns></returns>
        [HttpPost("uploadFileWithFromTo")]
        public TranslateOutputModel UploadFileWithFromTo([FromForm(Name = "file")] IFormFile resultFile,
         string from = "en", string to = "en")
        {
            TranslateInputModel inputModel = new()
            {
                ToLanguage = to,
                FromLanguage = from,
            };
            TranslateOutputModel translateOutputModel = new();

            if (resultFile != null)
            {
                // if file is not attached
                if (resultFile.Length == 0)
                {
                    translateOutputModel.TranslatedText = "Bad request";
                    translateOutputModel.OriginalText = "Bad request";
                }
                else
                {
                    using StreamReader reader = new(resultFile.OpenReadStream());
                    string extension = Path.GetExtension(resultFile.FileName);
                    DocumentCore dc = null;
                    string filePath = "";

                    //translate file according to file extension
                    if (extension == ".docx")
                    {
                        translateOutputModel.FileName = ReadWordFromStream2(DocumentCore.Load(reader.BaseStream, new DocxLoadOptions()), inputModel, ".docx");
                    }
                    else if (extension == ".pptx")
                    {

                        translateOutputModel.FileName = ReadPPTFromStream(reader.BaseStream, inputModel);
                    }
                    else if (extension == ".pdf")
                    {
                        var f = new PdfFocus();
                        // convert PDF to DOCX
                        f.OpenPdf(reader.BaseStream);
                        var file = basePath + DateTime.UtcNow.Ticks + ".docx";
                        var responseCode = f.ToWord(file);
                        //Translate DOCX file
                        if (responseCode == 0) translateOutputModel.FileName = ReadWordFromStream2(DocumentCore.Load(file, new DocxLoadOptions()), inputModel, ".docx");
                        else throw new Exception("Failed to convert pdf to docx");
                        //translateOutputModel.FileName = ReadWordFromStream2(DocumentCore.Load(reader.BaseStream, new PdfLoadOptions()), inputModel, ".pdf");
                        //translateOutputModel.FileName = ReadDocWriteToDocx(DocumentCore.Load(reader.BaseStream, new PdfLoadOptions()), inputModel, ".docx");

                        //translateOutputModel.FileName = ReadPDfFromStream(reader.BaseStream, inputModel);
                        //dc = ReadWordFromStream2(DocumentCore.Load(reader.BaseStream, new PdfLoadOptions()), inputModel,".pdf");
                    }
                    else
                    {
                        inputModel.Content = "File not supported";
                        return translateOutputModel;
                    }


                    if (string.IsNullOrEmpty(inputModel.FromLanguage))
                    {
                        inputModel.FromLanguage = "en";
                    }
                    if (string.IsNullOrEmpty(inputModel.ToLanguage))
                    {
                        inputModel.FromLanguage = "en";
                    }
                    translateOutputModel.OriginalText = inputModel.Content;
                    translateOutputModel.TranslatedText = "";//TranslationAPIKey.TranslateText(inputModel);
                }
            }
            else
            {
                translateOutputModel = new TranslateOutputModel()
                {
                    TranslatedText = "No file received"
                };
            }
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine(ex.Message);
            //    translateOutputModel = new TranslateOutputModel()
            //    {
            //        TranslatedText = ex.ToString()
            //    };
            //}
            return translateOutputModel;
        }


        private string ReadPPTFromStream(Stream stream, TranslateInputModel inputModel)
        {
            //Open an existing PowerPoint presentation
            IPresentation pptxDoc = Presentation.Open(stream);
            string content = "";

            foreach (var item in pptxDoc.Slides)
            {
                foreach (var shape in item.Shapes)
                {
                    IShape actualShape = shape as IShape;
                    content += actualShape.TextBody.Text;
                    try
                    {
                        var splitWords = actualShape.TextBody.Text.Split('\r');
                        foreach (string word in splitWords)
                        {
                            try
                            {
                                if (word.Length > 0)
                                {
                                    inputModel.Content = word;
                                    var translation = TranslationAPIKey.TranslateText(inputModel);
                                    actualShape.TextBody.Text = actualShape.TextBody.Text.Replace(word, translation);
                                }
                            }
                            catch { }
                        }
                    }
                    catch { }
                }
            }
            var filePath = AppDomain.CurrentDomain.BaseDirectory + "/Files/" + DateTime.UtcNow.Ticks + ".pptx";
            pptxDoc.Save(filePath);
            return filePath;
        }




        private string ReadDocWriteToDocx(DocumentCore dc, TranslateInputModel inputModel, string extension)
        {
            string content = "";

            // Here we explicitly set that a loadable document is Docx

            if (dc == null)
                return null;// "Failed to open file";

            DocumentCore odoc = new DocumentCore();
            DocumentBuilder db = new DocumentBuilder(odoc);

            bool pagebreak = false;
            foreach (var page in dc.GetPaginator().Pages)
            {
                string pageFilePathBase = basePath + "/temp/";
                //if path not found, create 
                if (!Directory.Exists(pageFilePathBase)) Directory.CreateDirectory(pageFilePathBase);
                //file path for new file for single page
                string pageFilePath = pageFilePathBase + DateTime.UtcNow.Ticks + ".pdf";
                //save page
                page.Save(pageFilePath, PdfSaveOptions.PdfDefault);
                //load saved file
                DocumentCore singlePageDoc = DocumentCore.Load(pageFilePath, new PdfLoadOptions() { });
                //get child elemenets
                var childElements = singlePageDoc.GetChildElements(true).ToList();
                // get all paragraphs
                var paragraphs = childElements.Where(x => x.ElementType == ElementType.Paragraph).Reverse().ToList();

                for (int i = 0; i < paragraphs.Count(); i++)
                {
                    try
                    {
                        Regex regex = new Regex(paragraphs[i].Content.ToString(), RegexOptions.IgnoreCase);

                        Paragraph par = new(odoc);
                        par.ParagraphFormat.PageBreakBefore = pagebreak;
                        //get section
                        ContentRange item = singlePageDoc.Content.Find(regex).FirstOrDefault();
                        if (item != null && item.ToString().Length > 0)
                        {
                            //read content
                            inputModel.Content = item.ToString();
                            //translate content
                            var translation = TranslationAPIKey.TranslateText(inputModel);

                            //par.ParagraphFormat.KeepWithNext = false;
                            par.Content.End.Insert(translation);
                            //insert into section
                            odoc.Sections[odoc.Sections.Count - 1].Blocks.Insert(0, par);
                            pagebreak = false;
                        }

                    }
                    catch (Exception e) { Console.WriteLine(e.Message); }
                }
                pagebreak = true;
                //add section to file
                odoc.Sections.Add(new Section(odoc));
            }
            //full file
            var filePath = basePath + DateTime.UtcNow.Ticks + extension;
            odoc.Save(filePath);
            //return file path to user
            return filePath;
        }

        private string ReadWordFromStream2(DocumentCore dc, TranslateInputModel inputModel, string extension)
        {

            // Here we explicitly set that a loadable document is Docx

            if (dc == null)//if file is null
                return null;// "Failed to open file";

            DocumentCore odoc = dc;

            //get all elements
            var childElements = dc.GetChildElements(true).ToList();
            //get all paragraphs from document
            var paragraphs = childElements.Where(x => x.ElementType == ElementType.Paragraph).ToList();

            for (int i = 0; i < paragraphs.Count(); i++)
            {
                try
                {
                    //read content from paragraph
                    inputModel.Content = paragraphs[i].Content.ToString();
                    //translate content
                    var translation = TranslationAPIKey.TranslateText(inputModel);
                    //replace read content by translated content
                    paragraphs[i].Content.Find(paragraphs[i].Content.ToString()).FirstOrDefault()?.Replace("");
                    //insert paragraph into new file
                    paragraphs[i].Content.End.Insert(translation);

                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }

            }


            var filePath = basePath + DateTime.UtcNow.Ticks + extension;
            //save file
            odoc.Save(filePath);
            //return file path to user
            return filePath;
        }
    }
}
