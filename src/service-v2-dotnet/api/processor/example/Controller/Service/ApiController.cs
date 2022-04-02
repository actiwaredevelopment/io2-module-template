using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace Module.IOTemplate.Api.Processor.Example.Controller.Service;

[ApiController]
[Route("/api/v2/processor/bucket/exists")]
public class ApiController : ControllerBase
{
    #region Constructor

    public ApiController(ILogger<ApiController> logger, Development.SDK.Logging.Controller.Logger sdkLogger, Controller.Processor.ExecuteController executeHandler, Controller.Processor.ConfigController configHandler, Controller.Processor.AnalyticsController analyticsHandler)
    {
        sdkLogger.Initialize(logger);
        _logger = sdkLogger;

        _analytics = analyticsHandler ?? new();
        _config = configHandler ?? new();
        _execute = executeHandler ?? new();
    }

    #endregion

    #region Fields

    private readonly Development.SDK.Logging.Controller.Logger? _logger;

    private readonly Controller.Processor.AnalyticsController _analytics;
    private readonly Controller.Processor.ConfigController _config;
    private readonly Controller.Processor.ExecuteController _execute;

    #endregion

    #region Analytic Methods

    /// <summary>
    /// Collects all configurations originating from modules and/or project settings used.
    /// </summary>
    /// <param name="config">The saved item configuration for this action.</param>
    /// <returns>All references to modules and/or project settings that this action has used; otherwise <c>null</c> if no references to modules and/or project settings exists.</returns>
    [HttpPost]
    [Route("collect")]
    public ActionResult<Development.SDK.Module.Data.Export.Dependency> CollectReferences(Development.SDK.Module.Data.Requests.Common.ConfigInformation config)
    {
        try
        {
            return Ok(_analytics.CollectReferences(config.Config, _logger));
        }
        catch (Exception ex)
        {
            return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
        }
    }

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

    /// <summary>
    /// Generates the documentation for this configuration.
    /// </summary>
    /// <param name="config">The saved item configuration for this action.</param>
    /// <param name="showPasswords">Whether passwords must be shown as plain text in the documentation.</param>
    /// <returns>The documentation for the given configuration; otherwise <c>null</c> if no documentation is to be created.</returns>
    [HttpPost]
    [Route("documentation")]
    public ActionResult<Development.SDK.Module.Data.Document.Documentation> GenerateDocumentation(Development.SDK.Module.Data.Requests.Common.GenerateDocumentation documentation)
    {
        try
        {
            // This processor needs no clean up method
            return Ok(_analytics.GenerateDocumentation(documentation.Config, documentation.ShowPasswords, new string[] { }, _logger));
        }
        catch (Exception ex)
        {
            return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
        }
    }

    #endregion

    #region Config Methods

    /// <summary>
    /// Gets the used, referenced or created items like node fields and/or language codes.
    /// </summary>
    /// <param name="config">The configuration information that can be used to generate the control. 
    /// It also contains configurations for the control that have already been saved.</param>
    /// <returns></returns>
    [HttpPost]
    [Route("config/items")]
    public ActionResult<Development.SDK.Module.Data.DataQuery.QueryItem> GetItems(Development.SDK.Module.Data.Common.ConfigInformation config)
    {
        return Ok(_config.GetUsedItems(config, _logger));
    }

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
            return Ok(_config.Validate(config, _logger));
        }
        catch (Exception ex)
        {
            return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
        }
    }

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
            return Ok(_config.Upgrade(config, _logger));
        }
        catch (Exception ex)
        {
            return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
        }
    }

    /// <summary>
    /// Gets the used, referenced or created items like node fields and/or language codes.
    /// </summary>
    /// <param name="config">The configuration information that can be used to generate the control. 
    /// It also contains configurations for the control that have already been saved.</param>
    /// <returns></returns>
    [HttpPost]
    [Route("config/update")]
    public ActionResult<Development.SDK.Module.Data.Common.Error> UpdateReferences(Development.SDK.Module.Data.Common.UpdateReferenceInformation config)
    {
        var messages = _config.UpdateReferences(config, _logger);

        if (messages != null)
        {
            return Ok(messages);
        }
        else
        {
            return NoContent();
        }
    }

    #endregion

    #region Execute Methods

    /// <summary>
    /// Executes the specified query.
    /// </summary>
    /// <param name="container">The base container that was created by the process engine.</param>
    /// <param name="config">The item configuration that was created by the save method.</param>
    /// <param name="item">The information about the query item that must be executed.</param>
    /// <returns>The result of the execution as a table</returns>
    [HttpPost]
    [Route("execute")]
    public async System.Threading.Tasks.Task<ActionResult<Development.SDK.Module.Data.Container.Step>> Execute(Development.SDK.Module.Data.Requests.Processor.ExecuteRequest executionInfo)
    {
        Development.SDK.Module.Data.DataQuery.ResultTable resultTable = new();

        using (Serilog.Context.LogContext.PushProperty("TransactionId", executionInfo.Container?.TransactionId.ToString() ?? Guid.Empty.ToString()))
        {
            try
            {
                var step = await _execute.Execute(executionInfo?.Container ?? new(),
                                                  executionInfo?.Config ?? new(),
                                                  executionInfo?.InputPort ?? "input",
                                                  false,
                                                  _logger);

                return Ok(step);
            }
            catch (Exception ex)
            {
                return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
            }
        }
    }

    /// <summary>
    /// Executes the specified query.
    /// </summary>
    /// <param name="container">The base container that was created by the process engine.</param>
    /// <param name="config">The item configuration that was created by the save method.</param>
    /// <param name="item">The information about the query item that must be executed.</param>
    /// <returns>The result of the execution as a table</returns>
    [HttpPost]
    [Route("test")]
    public async System.Threading.Tasks.Task<ActionResult<Development.SDK.Module.Data.Container.Step>> Test(Development.SDK.Module.Data.Requests.Processor.ExecuteRequest executionInfo)
    {
        Development.SDK.Module.Data.DataQuery.ResultTable resultTable = new();

        using (Serilog.Context.LogContext.PushProperty("TransactionId", executionInfo.Container?.TransactionId.ToString() ?? Guid.Empty.ToString()))
        {
            try
            {
                var step = await _execute.Execute(executionInfo?.Container ?? new(),
                                                  executionInfo?.Config ?? new(),
                                                  executionInfo?.InputPort ?? "input",
                                                  true,
                                                  _logger);

                return Ok(step);
            }
            catch (Exception ex)
            {
                return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
            }
        }
    }

    #endregion
}
