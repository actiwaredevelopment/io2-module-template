namespace Module.IOTemplate.Api.Processor.Example.Controller.Processor;

public class AnalyticsController
{
    #region Public methods

    /// <summary>
    /// Generates the documentation.
    /// </summary>
    /// <param name="documentationHelper">The documentation helper.</param>
    /// <param name="filter">The filter.</param>
    /// <param name="showPasswords">if set to <c>true</c> [show passwords].</param>
    /// <param name="item">The item.</param>
    public Development.SDK.Module.Data.Document.Documentation GenerateDocumentation(Development.SDK.Module.Data.Common.ConfigInformation config, bool showPasswords, string[] filter, Development.SDK.Logging.Controller.Logger? logger)
    {
        Development.SDK.Module.Data.Document.Documentation documentation = new();

        return documentation;
    }

    /// <summary>
    /// Collects all configurations originating from modules and/or project settings used.
    /// </summary>
    /// <param name="config">The saved item configuration for this action.</param>
    /// <returns>All references to modules and/or project settings that this action has used; otherwise <c>null</c> if no references to modules and/or project settings exists.</returns>
    public Development.SDK.Module.Data.Export.Dependency CollectReferences(Development.SDK.Module.Data.Common.ConfigInformation? config, Development.SDK.Logging.Controller.Logger? logger)
    {
        return new();
    }

    #endregion
}
