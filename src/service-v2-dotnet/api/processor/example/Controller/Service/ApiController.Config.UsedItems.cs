namespace Module.IOTemplate.Api.Processor.Example.Controller.Service;

public partial class ApiController
{
    /// <summary>
    /// Gets the used, referenced or created items like node fields and/or language codes.
    /// </summary>
    /// <param name="config">The configuration information that can be used to generate the control. 
    /// It also contains configurations for the control that have already been saved.</param>
    /// <returns></returns>
    [HttpPost]
    [Route("config/items")]
    public ActionResult<Development.SDK.Module.Data.Common.UsedItems> GetItems(Development.SDK.Module.Data.Common.ConfigInformation? config)
    {
        try
        {
            // Get item and module configuration object
            var itemConfig = new Development.SDK.Module.Data.Common.ItemConfig()
            {
                Parameters = config?.Parameters ?? new()
            };

            return this.Ok(itemConfig?.GetUsedItems());
        }
        catch (Exception ex)
        {
            return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
        }
    }
}