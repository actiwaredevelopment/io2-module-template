namespace Module.IOTemplate.Api.Processor.Example.Controller.Service;

public partial class ApiController
{
    /// <summary>
    /// Validates the item configuration.
    /// </summary>
    /// <param name="config">The item configuration that was created by the save method.</param>
    /// <returns><c>true</c> if the config is valid, otherwise <c>false</c>.</returns>
    [HttpPost]
    [Route("config/validate")]
    public ActionResult<bool> Validate(Development.SDK.Module.Data.Common.ItemConfig config)
    {
        try
        {
            return this.Ok(config.Validate(null));
        }
        catch (Exception ex)
        {
            return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
        }
    }
}