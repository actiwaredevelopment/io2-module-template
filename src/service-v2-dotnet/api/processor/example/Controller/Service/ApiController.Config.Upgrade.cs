namespace Module.IOTemplate.Api.Processor.Example.Controller.Service;

public partial class ApiController
{
    /// <summary>
    /// Called when the system wants to upgrade the current configuration.
    /// </summary>
    /// <param name="config">The configuration information that can be used to upgrade the configuration. 
    /// It also contains the module and action configurations that have already been saved.</param>
    /// <returns>
    /// Returns the item configuration that must be saved; otherwise <c>null</c> if an error occured by upgrading the item configuration.
    /// </returns>
    [HttpPost]
    [Route("config/upgrade")]
    public ActionResult<Development.SDK.Module.Data.Common.ItemConfig> Upgrade(Development.SDK.Module.Data.Common.ConfigInformation config)
    {
        try
        {
            // Define item and module configuration object
            Development.SDK.Module.Data.Common.ItemConfig? itemConfig = null;

            // Create new item configuration instance.
            itemConfig = new Development.SDK.Module.Data.Common.ItemConfig();

            if (config != null)
            {
                // Get configuration
                itemConfig.Parameters = config.Parameters;
            }

            return this.Ok(itemConfig);
        }
        catch (Exception ex)
        {
            return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
        }
    }
}