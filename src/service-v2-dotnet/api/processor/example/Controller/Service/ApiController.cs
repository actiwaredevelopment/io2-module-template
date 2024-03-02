namespace Module.IOTemplate.Api.Processor.Example.Controller.Service;

/// <summary>
/// The controller for the registration of the routes for the function.
/// </summary>
[ApiController]
[Route("/api/v2/processor/example")]
public partial class ApiController : ControllerBase
{
    #region Constructor

    /// <summary>
    /// The constructor
    /// </summary>
    public ApiController(ILogger<ApiController> logger, Development.SDK.Logging.Controller.Logger sdkLogger, Development.SDK.Module.Controller.LanguageManager languageManager, Utils.Data.Common.Information information)
    {
        sdkLogger.Initialize(logger);

        _languageManager = languageManager;

        _information = information;
    }

    #endregion

    #region Fields

    private readonly Utils.Data.Common.Information _information;

    private readonly Development.SDK.Module.Controller.LanguageManager _languageManager;

    #endregion
}
