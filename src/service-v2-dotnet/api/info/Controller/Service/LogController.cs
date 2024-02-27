namespace Module.IOTemplate.Api.Info.Controller.Service;

/// <summary>
/// The controller for the registration of the routes for the function.
/// </summary>
[ApiController]
[Route("/api/v2/log")]
public class LogController : ControllerBase
{
    #region Constructor

    /// <summary>
    /// The constructor
    /// </summary>
    public LogController()
    {

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
        return Ok();
        // return Ok(new Development.SDK.Logging.Data.EnvironmentLogSettings("/api/v2/log"));
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
}