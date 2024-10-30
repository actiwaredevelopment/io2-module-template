namespace Module.IOTemplate.Api.Processor.Example.Controller.Service
{
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

                using Development.SDK.Module.Controller.Helper helper = new(executionInfo.Container);

                Development.SDK.Module.Data.Container.Step step = new()
                {
                    // This value must be set to false if the query was successful
                    State = Development.SDK.Module.Enums.ProcessState.Error,

                    // Set output port
                    ExitPort = "output",

                    // Set fields
                    Fields = new Dictionary<string, List<string>>(),
                    HiddenFields = new Dictionary<string, List<string>>(),

                    Messages = helper.Messages
                };

                if (executionInfo.Config is null)
                {
                    helper.WriteMessage(Development.SDK.Module.Enums.ReportLevel.Error, "LOG_NO_CONFIGURATION_GIVEN", "The execution of the processor had to be aborted because no configuration was transferred.");

                    return Ok(step);
                }

                // Auto format configuration parameters
                executionInfo.Config.Format(helper);

                // Validate processor configuration
                if (executionInfo.Config.Validate(helper) == false)
                {
                    step.State = Development.SDK.Module.Enums.ProcessState.Error;

                    return Ok(step);
                }

                Data.Config processorConfig = executionInfo.Config.GetConfig(helper);

                // Get login profile from container or executionInfo.Config
                Development.SDK.Module.Data.Credentials.Http.LoginProfile? loginProfile = executionInfo.Config.GetCredentials<Development.SDK.Module.Data.Credentials.Http.LoginProfile>(processorConfig.LoginProfile, "CREDENTIAL_STORE_KEY", "CREDENTIAL_CONFIG_KEY");

                if (loginProfile is null)
                {
                    step.State = Development.SDK.Module.Enums.ProcessState.Error;

                    return Ok(step);
                }

                // Example to load module configuration
                var moduleConfig = helper.LoadModuleConfig<object>();

                // Example execute data query
                // var resultTable = helper.ExecuteQuery("MODULE_NAME", "NAME_DER_DB_ABFRAGE", []);

                // Example execute filling rule
                // var resultTable = helper.ExecuteFillingRule(processorConfig.Object, processorConfig.FillingRule, processorConfig.ConditionFields.ToField());

                // Do some stuff here...

                step.State = Development.SDK.Module.Enums.ProcessState.Done;

                return Ok(step);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new Development.SDK.Module.Data.Common.Message(Development.SDK.Module.Enums.ReportLevel.Error, "EXCEPTION", "{0}", ex.Message));
            }
        }
    }
}