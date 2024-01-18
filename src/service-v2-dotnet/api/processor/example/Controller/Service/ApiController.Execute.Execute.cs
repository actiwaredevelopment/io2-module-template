namespace Module.IOTemplate.Api.Processor.Example.Controller.Service;

public partial class ApiController
{
    /// <summary>
    /// Executes the specified query.
    /// </summary>
    /// <param name="executionInfo">Information needed for the execution of the Processor.</param>
    /// <returns>The result of the execution as a table</returns>
    [HttpPost]
    [Route("execute")]
    public ActionResult<Development.SDK.Module.Data.Container.Step> Execute(Development.SDK.Module.Data.Requests.Processor.ExecuteRequest? executionInfo)
    {
        try
        {
            if (executionInfo is null)
            {
                return this.BadRequest("Missing execution info");
            }

            if (executionInfo.Container is null)
            {
                return this.BadRequest("Missing container");
            }

            using var helper = new Development.SDK.Module.Controller.Helper(executionInfo.Container);

            var step = new Development.SDK.Module.Data.Container.Step()
            {
                // This value must be set to false if the query was successful
                State = Development.SDK.Module.Enums.ProcessState.Error,

                // Set output port
                ExitPort = "output",

                // Set fields
                Fields = new Dictionary<string, List<string>>(),
                HiddenFields = new Dictionary<string, List<string>>(),
            };

            if (executionInfo.Config is null)
            {
                helper.WriteMessage(Development.SDK.Module.Enums.ReportLevel.Error, "LOG_NO_CONFIGURATION_GIVEN", "The execution of the processor had to be aborted because no configuration was transferred.");

                return this.Ok(step);
            }

            // Auto format configuration parameters
            executionInfo.Config.Format(helper);

            // Validate processor configuration
            if (executionInfo.Config?.Validate(helper) == false)
            {
                step.State = Development.SDK.Module.Enums.ProcessState.Error;

                return this.Ok(step);
            }

            // Set configuration
            string loginProfileId = executionInfo.Config?.Get("login_profile") ?? string.Empty;

            // Get login profile from container or executionInfo.Config
            var loginProfile = executionInfo.Config?.GetHttpOrMicrosoft365LoginProfile(loginProfileId);

            if (loginProfile is null)
            {
                step.State = Development.SDK.Module.Enums.ProcessState.Error;

                return this.Ok(step);
            }

            // Do some stuff here...

            step.State = Development.SDK.Module.Enums.ProcessState.Done;

            return this.Ok(step);
        }
        catch (Exception ex)
        {
            return this.StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
        }
    }
}