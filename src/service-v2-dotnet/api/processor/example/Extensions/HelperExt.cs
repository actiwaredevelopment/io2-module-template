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
}