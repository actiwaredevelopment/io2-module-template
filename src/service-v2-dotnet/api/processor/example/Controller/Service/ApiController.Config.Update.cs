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
    [Route("config/update")]
    public ActionResult<Development.SDK.Module.Data.Common.Error> UpdateReferences(Development.SDK.Module.Data.Common.UpdateReferenceInformation config)
    {
        Development.SDK.Module.Data.Common.Error? error = null;

        if (error is not null)
        {
            return Ok(error);
        }
        else
        {
            return NoContent();
        }
    }
}