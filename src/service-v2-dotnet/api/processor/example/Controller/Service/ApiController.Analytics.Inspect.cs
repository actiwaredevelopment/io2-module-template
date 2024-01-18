namespace Module.IOTemplate.Api.Processor.Example.Controller.Service;

public partial class ApiController
{
    /// <summary>
    /// Inspects the settings to see if this has any misconfigurations or missing referenced elements.
    /// </summary>
    /// <param name="config">The saved item configuration for this action.</param>
    /// <returns>A list of error information that occurred during inspection; otherwise <c>null</c> if no errors occured.</returns>
    [HttpPost]
    [Route("inspect")]
    public ActionResult<List<Development.SDK.Module.Data.Common.Error>> Inspect(Development.SDK.Module.Data.Requests.Common.ConfigInformation config)
    {
        try
        {
            // This processor needs no clean up method
            return NoContent();
        }
        catch (Exception ex)
        {
            return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
        }
    }
}