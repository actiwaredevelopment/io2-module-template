namespace Module.IOTemplate.Utils.Data.Common;

public class Information
{
    #region Constructor

    /// <summary>
    /// Prevents a default instance of the <see cref="Information"/> class from being created.
    /// </summary>
    public Information()
    {

    }

    #endregion

    #region Constants

    public const string CREDENTIAL_STORE_ID = "A84C08F6-170E-4F85-A610-1BE60ECCD9C6";
    public const string CREDENTIAL_STORE_CONFIG_KEY = "Module.Communication.Credential.Http";

    #endregion

    #region Information

    public string ProductName { get; init; } = "ACTIWARE: IO";
    public string ModuleName { get; init; } = "Module: IOTemplate";

    public Version ModuleVersion { get; init; } = new Version(2, 0, 0, 0000);

    #endregion

    #region Security

    internal string EncryptionKey
    {
        get { return "V6e+z1Wp601Q9lLcmOQoPtwiQQ8bE49lxe2LpH9rEBY="; }
    }

    #endregion

    #region Fields

    private string _exceptionCode = "TEMPLATE-{0}";

    #endregion

    #region Properties

    public string ExceptionCode
    {
        get { return _exceptionCode; }
    }

    #endregion

    #region Public Methods

    /// <summary>
    /// Generate exception code for active devblock.
    /// </summary>
    /// <param name="errorCounter">Set counter for error message.</param>
    /// <returns>Valid exception code number for exceptions.</returns>
    public ArgumentException GetArgumentException(string errorCounter, string defaultText, string cultureInfo, Development.SDK.Module.Controller.LanguageManager? languageManager, params object[] args)
    {
        if (string.IsNullOrWhiteSpace(errorCounter) == true)
        {
            errorCounter = "1";
        }

        // Set zero for counter to get min 4 chars
        if (errorCounter.Length < 4)
        {
            int counterLenght = 4 - errorCounter.Length;
            for (int index = 0; index < counterLenght; index++)
            {
                errorCounter = "0" + errorCounter;
            }
        }

        string exceptionCode = string.Format(this.ExceptionCode, errorCounter);

        if (languageManager != null)
        {
            return new ArgumentException($"[{exceptionCode}]: {languageManager.Exception(exceptionCode, defaultText, cultureInfo, args)}");
        }

        return new ArgumentException($"[{exceptionCode}]: {string.Format(defaultText, args)}");
    }

    /// <summary>
    /// Generate exception code for active devblock.
    /// </summary>
    /// <param name="errorCounter">Set counter for error message.</param>
    /// <returns>Valid exception code number for exceptions.</returns>
    public string GetExceptionCode(string errorCounter)
    {
        if (string.IsNullOrWhiteSpace(errorCounter) == true)
        {
            errorCounter = "1";
        }
        // Set zero for counter to get min 4 chars
        if (errorCounter.Length < 4)
        {
            int counterLenght = 4 - errorCounter.Length;
            for (int index = 0; index < counterLenght; index++)
            {
                errorCounter = "0" + errorCounter;
            }
        }
        return string.Format(this.ExceptionCode, errorCounter);
    }

    #endregion
}