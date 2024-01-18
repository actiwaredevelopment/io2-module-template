namespace Module.IOTemplate.Api.Processor.Example.Controller.Service;

public partial class ApiController
{
    /// <summary>
    /// Collects all configurations originating from modules and/or project settings used.
    /// </summary>
    /// <param name="config">The saved item configuration for this action.</param>
    /// <returns>All references to modules and/or project settings that this action has used; otherwise <c>null</c> if no references to modules and/or project settings exists.</returns>
    [HttpPost]
    [Route("analytics/collect")]
    public ActionResult<Development.SDK.Module.Data.Export.Dependency> CollectReferences(Development.SDK.Module.Data.Requests.Common.ConfigInformation config)
    {
        try
        {
            return this.Ok(new Development.SDK.Module.Data.Export.Dependency());
        }
        catch (Exception ex)
        {
            return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
        }
    }
}