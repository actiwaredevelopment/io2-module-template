using Microsoft.Extensions.DependencyInjection;

namespace Module.IOTemplate.Api.Processor.Example.Extensions;

public static class ServiceExt
{
    public static void AddProcessorExampleScope(this IServiceCollection services)
    {
        if (services != null)
        {
            services.AddTransient<Controller.Processor.AnalyticsController>();
            services.AddTransient<Controller.Processor.ConfigController>();
            services.AddTransient<Controller.Processor.ExecuteController>();
        }
    }
}
