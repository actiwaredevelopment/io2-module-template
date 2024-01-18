namespace Module.IOTemplate.Api.Processor.Example.Extensions;

/// <summary>
/// Extension to validate the given configuration.
/// </summary>
public static class ConfigValidationExt
{
    /// <summary>
    /// Validates the given processor configuration
    /// </summary>
    public static bool Validate(this Development.SDK.Module.Data.Common.ItemConfig config, Development.SDK.Module.Controller.Helper? helper)
    {
        // Get configuration
        string loginProfileId = config.Get("login_profile");

        if (string.IsNullOrWhiteSpace(loginProfileId) == true)
        {
            helper?.WriteMessage(Development.SDK.Module.Enums.ReportLevel.Error, "LOG_NO_LOGIN_PROFILE_SELECTED", "Oops, no login profile was set in the configuration for the processor. Please check if a login profile was entered and if it still exists.");
            return false;
        }

        return true;
    }
}