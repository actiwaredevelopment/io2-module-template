string[] commandLineArgs = args;
string? baseDirectory = string.Empty;

if (commandLineArgs != null &&
    commandLineArgs.Length > 0 &&
    System.IO.Directory.Exists(commandLineArgs[0]) == true)
{
    baseDirectory = commandLineArgs[0];
}
else
{
    baseDirectory = System.IO.Directory.GetCurrentDirectory();
}

if (string.IsNullOrWhiteSpace(baseDirectory))
{
    baseDirectory = System.Diagnostics.Process.GetCurrentProcess().MainModule?.FileName;

    if (baseDirectory == null)
    {
        baseDirectory = Directory.GetCurrentDirectory();
    }
    else
    {
        baseDirectory = System.IO.Path.GetDirectoryName(baseDirectory);
    }
}

WebApplicationBuilder builder;

if (OperatingSystem.IsWindows() == true)
{
    // Create web application build for windows
    builder = WebApplication.CreateBuilder(new WebApplicationOptions()
    {
        ApplicationName = typeof(Program).Assembly.FullName,
        ContentRootPath = baseDirectory,
        Args = args
    });
}
else
{
    builder = WebApplication.CreateBuilder();
}

if (string.IsNullOrWhiteSpace(baseDirectory) == false)
{
    builder.Configuration.SetBasePath(baseDirectory);
}

builder.Host.UseSerilog((context, loggerConfiguration) =>
{
    loggerConfiguration.ReadFrom.Configuration(context.Configuration);
    loggerConfiguration.SetLoggerSettings("io-module-template", "/io/module/iotemplate", "2.0.0");
});

// Check if os is windows the use windows service
if (WindowsServiceHelpers.IsWindowsService())
{
    Console.WriteLine($"[INF][{DateTime.Now.ToString()}]: Start the service as windows service.");

    builder.Services.AddSingleton<IHostLifetime, WindowsServiceLifetime>();
}

// Add cors policies
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllPolicy", builder =>
    {
        builder.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    if (string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("DEFAULT_CULTURE_INFO")) == false)
    {
        options.DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture(Environment.GetEnvironmentVariable("DEFAULT_CULTURE_INFO")!);
    }
    else
    {
        options.DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture("en-US");
    }
});

// Add singleton controller with default configuration
builder.Services.AddTransient<Development.SDK.Logging.Controller.Logger>();
builder.Services.AddSingleton<Development.SDK.Module.Controller.LanguageManager>(langInstace =>
{
    if (string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("DEFAULT_CULTURE_INFO")) == false)
    {
        return new Development.SDK.Module.Controller.LanguageManager("languages", false);
    }
    else
    {
        return new Development.SDK.Module.Controller.LanguageManager("languages", false);
    }
});
builder.Services.AddSingleton<Module.IOTemplate.Utils.Data.Common.Information>();

// Add scope for api's
builder.Services.AddInfoApiScope();

// Add scope for credentials

// Add scope for actions

// Add scope for processors
builder.Services.AddProcessorExampleScope();

// Add scope for data-query addins

// Add scope for smart-search addins

// Add scope for crawler addins

// Add http client for healtch check
builder.Services.AddHttpClient();

// In production, the React files will be served from this directory
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = $"ClientApp/build";
});

// Add controllers
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
    //options.SerializerSettings.Converters.Add(new StringEnumConverter());
    options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
});

builder.Services.AddControllersWithViews().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
    //options.SerializerSettings.Converters.Add(new StringEnumConverter());
    options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
});

// Upload module file to project service (attention: the file must be in the project root directory and case sensitiv is necessary)
builder.Configuration.UploadModuleDefinition(System.IO.Path.Combine(baseDirectory ?? "", "iotemplate.zip"));

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(config =>
{
    config.CustomSchemaIds(type => type.ToString());

    config.SwaggerDoc("v2", new Microsoft.OpenApi.Models.OpenApiInfo()
    {
        Version = "v2",
        Title = "Module: Solr",
        Description = "",
        TermsOfService = new Uri("https://actiware-development.atlassian.net/wiki/spaces/AWIO/pages/1957101656"),
        Contact = new Microsoft.OpenApi.Models.OpenApiContact()
        {
            Name = "ACTIWARE Development GmbH",
            Email = "info@actiware-development.com",
            Url = new Uri("https://www.actiware-development.com")
        },
        License = new Microsoft.OpenApi.Models.OpenApiLicense()
        {
            Name = "Use under LICX",
            Url = new Uri("https://actiware-development.atlassian.net/wiki/spaces/AWIO/pages/1957101656")
        }
    });

    // Set the comments path for the Swagger JSON and UI.
    var xmlFiles = System.IO.Directory.GetFiles(AppContext.BaseDirectory, "*.xml");

    if (xmlFiles != null &&
        xmlFiles.Length > 0)
    {
        foreach (string xmlFile in xmlFiles)
        {
            if (System.IO.Path.GetFileNameWithoutExtension(xmlFile).StartsWith("io2-module-iotemplate-api") == true)
            {
                config.IncludeXmlComments(xmlFile);
            }
        }
    }
});

var app = builder.Build();

app.UseCors("AllPolicy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(config =>
    {
        config.RouteTemplate = "docs/api/{documentName}/swagger.json";
    });

    app.UseSwaggerUI(config =>
    {
        config.SwaggerEndpoint("/docs/api/v2/swagger.json", "Module: IOTemplate - API V2");
        config.RoutePrefix = "docs/api";
    });
}

app.UseStaticFiles();
app.UseSpaStaticFiles();

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";

    if (app.Environment.IsDevelopment())
    {
        spa.Options.SourcePath = System.IO.Path.GetFullPath(System.IO.Path.Combine(baseDirectory ?? System.AppDomain.CurrentDomain.BaseDirectory, "../../configuration"));
        spa.UseReactDevelopmentServer(npmScript: "start");
    }
});

app.Run();
