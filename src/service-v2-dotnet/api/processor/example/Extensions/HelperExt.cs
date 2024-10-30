namespace Module.IOTemplate.Api.Processor.Example.Extensions;

/// <summary>
/// Extension methods to get used items and prepare the configuration for execution.
/// </summary>
public static class HelperExt
{
    /// <summary>
    /// Extracts the used items from the current configuration.
    /// </summary>
    /// <param name="config">The configuration from that the used items must be extracted.</param>
    /// <returns>The used items object.</returns>
    public static Development.SDK.Module.Data.Common.UsedItems GetUsedItems(this Development.SDK.Module.Data.Common.ItemConfig config)
    {
        // Create new used items object
        var value = new Development.SDK.Module.Data.Common.UsedItems()
        {
            NodeFields = new List<string>()
        };

        return value;
    }

    /// <summary>
    /// Extract the config from ui into the model to execute the processor
    /// </summary>
    /// <param name="itemConfig">The item config send from the processor/project service</param>
    /// <param name="helper">Instance of <see cref="Development.SDK.Module.Controller.Helper" /> to write messages and more.</param>
    /// <returns>The configurated processor configuration to execute the processor</returns>
    public static Data.Config GetConfig(this Development.SDK.Module.Data.Common.ItemConfig itemConfig, Development.SDK.Module.Controller.Helper? helper = null)
    {
        helper?.WriteMessage(Development.SDK.Module.Enums.ReportLevel.Message, "LOG_LOAD_EXAMPLE_CONFIGURATION", "Load configuration from 'Example' process node...");

        return new()
        {
            LoginProfile = itemConfig.Get("login_profile"),
            TextValue = itemConfig.Parameters.Get("text_value"),
            NumberValue = itemConfig.Parameters.GetAsInt("number_value"),
            CollectionValue = Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(itemConfig.Parameters.Get("collection_value")) ?? [],
            BooleanValue = itemConfig.Parameters.GetAsBoolean("boolean_value")
        };
    }

    /// <summary>
    /// Loads the module configuration via rpc or http.
    /// </summary>
    /// <param name="helper">The current helper.</param>
    /// <returns><c>null</c> if no module configuration was found; otherwise the module configuration.</returns>
    public static T? LoadModuleConfig<T>(this Development.SDK.Module.Controller.Helper helper)
    {
        if (helper != null)
        {
            // Define item configuration object
            // Try to load module configuration
            Development.SDK.Module.Data.Common.ItemConfig? config = helper.GetModuleConfig("MODULE_ID", []);

            if (config != null)
            {
                // Define json value
                string jsonValue = string.Empty;

                if (config.Parameters.ContainsKey("MODULE_CONFIG_KEY") == true)
                {
                    jsonValue = config.Parameters["MODULE_CONFIG_KEY"];
                }
                else if (config.Parameters.ContainsKey("MODULE_ALTERNATE_CONFIG_KEY") == true)
                {
                    jsonValue = config.Parameters["MODULE_ALTERNATE_CONFIG_KEY"];
                }

                if (string.IsNullOrEmpty(jsonValue) == false &&
                    string.IsNullOrWhiteSpace(jsonValue) == false)
                {
                    // Try to cast json to module configuration
                    return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(jsonValue);
                }
            }
        }

        return default;
    }
}