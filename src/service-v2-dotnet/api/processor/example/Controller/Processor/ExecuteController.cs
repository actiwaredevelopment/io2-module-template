using Development.SDK.Module.Extensions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Module.IOTemplate.Api.Processor.Example.Controller.Processor;

public class ExecuteController
{
    #region Public Methods 

    /// <summary>
    /// Initialize the configuration controller.
    /// </summary>
    /// <param name="config">The loaded processor configuration.</param>
    /// <param name="configInfo"></param>
    public async Task<Development.SDK.Module.Data.Container.Step> Execute(Development.SDK.Module.Data.Container.Container container, Development.SDK.Module.Data.Common.ItemConfig config, string inputPort, bool inTestMode, Development.SDK.Logging.Controller.Logger logger)
    {
        Development.SDK.Module.Data.Container.Step step = new();

        // This value must be set to false if the query was successful
        step.State = Development.SDK.Module.Enums.ProcessState.Error;

        // Set fields
        step.Fields = new();

        using (var helper = new Development.SDK.Module.Controller.Helper(container))
        {
            // Link messages
            step.Messages = helper.Messages;

            if (config == null)
            {
                helper.WriteMessage(Development.SDK.Module.Enums.ReportLevel.Error, "LOG_NO_CONFIGURATION_GIVEN", "The query could not be executed because no configuration was transferred.");

                return step;
            }

            // Load configuration
            var processorConfig = config.GetConfiguration<Data.Processor.Config>(Data.Common.Constants.CONFIG_KEY);

            if (processorConfig == null)
            {
                helper.WriteMessage(Development.SDK.Module.Enums.ReportLevel.Error, "LOG_NO_CONFIGURATION_FOUND", "No configuration could be loaded or found. Please check your settings.");

                return step;
            }
        }

        // Set step state
        step.State = Development.SDK.Module.Enums.ProcessState.Done;

        // Set output port
        step.ExitPort = "output";

        return step;
    }

    #endregion
}
