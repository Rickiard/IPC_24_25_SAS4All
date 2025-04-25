using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using SAS4All.Models;
using System.Threading.Tasks;

namespace SAS4All.Middleware
{
    public class AccessibilityMiddleware
    {
        private readonly RequestDelegate _next;

        public AccessibilityMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Load settings from cookie
            var settings = LoadSettingsFromCookie(context);

            // Add settings to HttpContext.Items for use in views
            context.Items["AccessibilitySettings"] = settings;

            // Apply settings to response
            ApplySettingsToResponse(context, settings);

            await _next(context);
        }

        private AcessibilidadeModel LoadSettingsFromCookie(HttpContext context)
        {
            var jsonSettings = context.Request.Cookies["UserSettings"];
            if (!string.IsNullOrEmpty(jsonSettings))
            {
                return JsonConvert.DeserializeObject<AcessibilidadeModel>(jsonSettings);
            }

            // Return default settings if no cookie exists
            return new AcessibilidadeModel
            {
                ModoEscuro = false,
                AltoContraste = false,
                TamanhoFonte = "16px",
                Espacamento = "normal",
            };
        }

        private void ApplySettingsToResponse(HttpContext context, AcessibilidadeModel settings)
        {
            // Add CSS classes to body based on settings
            var bodyClasses = new List<string>();

            if (settings.ModoEscuro)
                bodyClasses.Add("dark-mode");
            
            if (settings.AltoContraste)
                bodyClasses.Add("high-contrast");

            if (settings.TamanhoFonte != "16px")
                bodyClasses.Add($"font-size-{settings.TamanhoFonte.Replace("px", "")}");

            if (settings.Espacamento != "normal")
                bodyClasses.Add($"spacing-{settings.Espacamento}");

            context.Items["BodyClasses"] = string.Join(" ", bodyClasses);
        }
    }
} 