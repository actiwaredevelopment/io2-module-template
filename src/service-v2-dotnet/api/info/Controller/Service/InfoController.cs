namespace Module.IOTemplate.Api.Info.Controller.Service;

/// <summary>
/// The controller for the registration of the routes for the function.
/// </summary>
[ApiController]
[Route("/api/v2/info")]
public class InfoController : ControllerBase
{
    #region Constructor

    /// <summary>
    /// Constructor
    /// </summary>
    public InfoController(Utils.Data.Common.Information information)
    {
        _information = information;
    }

    #endregion

    #region Fields

    private readonly Utils.Data.Common.Information? _information;

    #endregion

    #region Route Methods

    /// <summary>
    /// Get the information about the service.
    /// </summary>
    [HttpGet]
    public ActionResult<Development.SDK.Module.Data.Module.ServiceStatus> GetInfo()
    {
        return Ok(new Development.SDK.Module.Data.Module.ServiceStatus(_information?.ProductName ?? "",
            _information?.ModuleName ?? "",
            _information?.ModuleVersion?.ToString() ?? "",
            $"{_information?.ModuleVersion?.Major}.{_information?.ModuleVersion?.Minor}.{_information?.ModuleVersion?.Build}"));
    }

    #endregion
}
