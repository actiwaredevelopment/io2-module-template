using Microsoft.AspNetCore.Mvc;

namespace Module.Template.Api.Info.Controller.Service;

/// <summary>
/// The controller for the registration of the routes for the function.
/// </summary>
[ApiController]
[Route("/api/v2/info")]
public class ApiController : ControllerBase
{
    #region Constructor

    /// <summary>
    /// The constructor
    /// </summary>
    /// <param name="logger"></param>
    /// <param name="informationHandler"></param>
    /// <param name="languageManager"></param>
    /// <param name="sdkLogger"></param>
    public ApiController(ILogger<ApiController> logger, Utils.Data.Common.Information informationHandler, Development.SDK.Module.Controller.LanguageManager languageManager, Development.SDK.Logging.Controller.Logger sdkLogger)
    {
        sdkLogger.Initialize(logger);
        _logger = sdkLogger;

        _languageManager = languageManager;

        _information = informationHandler ?? new();
    }

    #endregion

    #region Fields

    private readonly Development.SDK.Logging.Controller.Logger? _logger;
    private readonly Development.SDK.Module.Controller.LanguageManager? _languageManager;

    private readonly Utils.Data.Common.Information _information;

    #endregion

    #region Info Route Methods

    /// <summary>
    /// Get the information about the service.
    /// </summary>
    [HttpGet]
    public ActionResult<Development.SDK.Module.Data.Module.ServiceStatus> GetInfo()
    {
        return Ok(new Development.SDK.Module.Data.Module.ServiceStatus(_information.ProductName,
                                                                       _information.ModuleName,
                                                                       _information.ModuleVersion.ToString(),
                                                                       $"{_information.ModuleVersion.Major}.{_information.ModuleVersion.Minor}.{_information.ModuleVersion.Build}"));
    }

    /// <summary>
    /// Get the module definition.
    /// </summary>
    [HttpGet]
    [Route("module")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public ActionResult<Development.SDK.Module.Data.Module.Definition> GetModuleDefinition()
    {
        try
        {
            string moduleFile = System.IO.Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "info.json");

            if (System.IO.File.Exists(moduleFile) == true)
            {
                var definition = Newtonsoft.Json.JsonConvert.DeserializeObject<Development.SDK.Module.Data.Module.Definition>(System.IO.File.ReadAllText(moduleFile));

                return Ok(definition);
            }
            else
            {
                return NoContent();
            }
        }
        catch (System.Exception ex)
        {
            // EX: 0000
            _logger?.Critcial(_information.GetExceptionCode("0000"), "The following error occurred while reading the module definition file. Error: {0}", ex.Message);
            return StatusCode(500, ex.Message);
        }
    }

    /// <summary>
    /// Download the module.
    /// </summary>
    [HttpGet]
    [Route("module/download")]
    public ActionResult DownloadModuleInformation()
    {
        try
        {
            string moduleFile = System.IO.Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "template.zip");

            if (System.IO.File.Exists(moduleFile) == true)
            {
                return new FileStreamResult(System.IO.File.Open(moduleFile, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.ReadWrite | System.IO.FileShare.Delete), this.GetContentType(moduleFile))
                {
                    FileDownloadName = System.IO.Path.GetFileName(moduleFile)
                };
            }
            else
            {
                return NoContent();
            }
        }
        catch (System.Exception ex)
        {
            // EX: 0000
            _logger?.Critcial(_information.GetExceptionCode("0000"), "The following error occurred while reading the module definition file. Error: {0}", ex.Message);
            return StatusCode(500, ex.Message);
        }
    }

    #endregion

    #region Route Methods

    /// <summary>
    /// Gets the log information for the service.
    /// </summary>
    [HttpGet]
    [Route("log")]
    public ActionResult GetLogInformation()
    {
        return Ok(new Development.SDK.Logging.Data.EnvironmentLogSettings("/api/v2/log"));
    }

    /// <summary>
    /// Tries to open the log file as a stream.
    /// </summary>
    [HttpGet]
    [Route("log/stream")]
    public async System.Threading.Tasks.Task GetLogStreaming()
    {
        string? logFile = System.Environment.GetEnvironmentVariable("LOG_FILE");

        if (string.IsNullOrWhiteSpace(logFile) == true ||
            System.IO.File.Exists(logFile) == false)
        {
            this.Response.StatusCode = 204;
            return;
        }

        this.Response.StatusCode = 200;
        this.Response.Headers.Add(Microsoft.Net.Http.Headers.HeaderNames.ContentDisposition, $"attachment; filename=\"{System.IO.Path.GetFileName(logFile)}\"");
        this.Response.Headers.Add(Microsoft.Net.Http.Headers.HeaderNames.ContentType, "application/octet-stream");

        var inputStream = new System.IO.FileStream(logFile, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.ReadWrite | System.IO.FileShare.Delete);
        var outputStream = this.Response.Body;

        const int bufferSize = 1 << 10;
        var buffer = new byte[bufferSize];

        while (true)
        {
            var bytesRead = await inputStream.ReadAsync(buffer, 0, bufferSize);
            if (bytesRead == 0) break;
            await outputStream.WriteAsync(buffer, 0, bytesRead);
        }

        await outputStream.FlushAsync();
    }

    #endregion

    #region Helper Methods

    /// <summary>
    /// Gets the content type for the file.
    /// </summary>
    /// <param name="path">The file name</param>
    /// <returns>The content type</returns>
    private string GetContentType(string path)
    {
        var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();

        if (provider.TryGetContentType(path, out string? contentType) == true)
        {
            return contentType;
        }
        else
        {
            return "application/octet-stream";
        }
    }

    #endregion

}