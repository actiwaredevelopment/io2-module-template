namespace Module.IOTemplate.Api.Info.Controller.Service;

/// <summary>
/// The controller for the registration of the routes for the function.
/// </summary>
[ApiController]
[Route("/api/v2/info")]
public class HealthCheckController : ControllerBase
{
    #region Constructor

    /// <summary>
    /// Constructor
    /// </summary>
    public HealthCheckController(Utils.Data.Common.Information informationHandler, System.Net.Http.IHttpClientFactory httpClientFactory)
    {
        _information = informationHandler ?? new();

        _httpClient = httpClientFactory.CreateClient("health-check");
    }

    #endregion

    #region Fields

    private readonly Utils.Data.Common.Information _information;

    private readonly System.Net.Http.HttpClient _httpClient;

    #endregion

    #region Route Methods

    /// <summary>
    /// Check if the module is available
    /// </summary>
    /// <returns></returns>
    [HttpPost]
    [Route("module/health")]
    public async System.Threading.Tasks.Task<Development.SDK.Module.Data.HealthCheck.Result> HealthCheck(Development.SDK.Module.Data.HealthCheck.Request request)
    {
        return await Development.SDK.Module.Controller.HealthCheck.DoHealthCheckAsync(_httpClient, _information.ModuleId, _information.ModuleName, request.Services);
    }

    #endregion
}
