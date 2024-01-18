namespace Module.IOTemplate.Api.Processor.Example.Controller.Service;

public partial class ApiController
{
    /// <summary>
    /// Generates the documentation for this configuration.
    /// </summary>
    /// <returns>The documentation for the given configuration; otherwise <c>null</c> if no documentation is to be created.</returns>
    [HttpPost]
    [Route("analytics/documentation")]
    public ActionResult<Development.SDK.Module.Data.Document.Documentation> GenerateDocumentation(Development.SDK.Module.Data.Requests.Common.GenerateDocumentation requestBody)
    {
        try
        {
            // Get current configuration
            var config = new Development.SDK.Module.Data.Common.ItemConfig()
            {
                Credentials = requestBody.Config?.Credentials ?? new List<Development.SDK.Module.Data.Common.CredentialStoreItem>(),
                Parameters = requestBody.Config?.Parameters ?? new Dictionary<string, string>()
            };

            // Get culture info
            string cultureInfo = Request.GetCultureInfo();

            var documentation = new Development.SDK.Module.Data.Document.Documentation();

            documentation.AppendHeadline("TEMPLATE_PROCESSOR_TITLE", "Template Processor", 1, _languageManager, cultureInfo);

            // Define data table for settings
            var settings = new System.Data.DataTable();

            // Add columns
            settings.AppendColumn("DOC_COLUMN_CONFIG_KEY", "Configuration Name", _languageManager, cultureInfo);
            settings.AppendColumn("DOC_COLUMN_VALUE", "Value", _languageManager, cultureInfo);

            settings.AppendRow("LABEL_LOGIN_PROFILE", "Which login profile should be used?", config.Get("login_profile"), _languageManager, cultureInfo);

            documentation.AppendTable(settings);

            return this.Ok(documentation);
        }
        catch (Exception ex)
        {
            return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
        }
    }
}