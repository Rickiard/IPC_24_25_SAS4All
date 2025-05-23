using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using SAS4All.Models;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SAS4All.Middleware
{
    public class AccessibilityMiddleware
    {
        private readonly RequestDelegate _next;

        public AccessibilityMiddleware(RequestDelegate next)
        {
            _next = next;
        }        public async Task InvokeAsync(HttpContext context)
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
                var settings = JsonConvert.DeserializeObject<AcessibilidadeModel>(jsonSettings);
                if (settings != null)
                {
                    return settings;
                }
            }

            // Return default settings if no cookie exists or deserialization failed
            return new AcessibilidadeModel
            {
                ModoEscuro = false,
                AltoContraste = false,
                TamanhoFonte = 16,
                Espacamento = "normal",
            };
        }        private void ApplySettingsToResponse(HttpContext context, AcessibilidadeModel settings)
        {
            // Add CSS classes to body based on settings
            var bodyClasses = new List<string>();
            
            // Alto contraste tem prioridade sobre o modo escuro
            if (settings.AltoContraste)
            {
                bodyClasses.Add("high-contrast");
            }
            else if (settings.ModoEscuro)
            {
                bodyClasses.Add("dark-mode");
            }

            if (settings.TamanhoFonte != 16)
                bodyClasses.Add($"font-size-{settings.TamanhoFonte}");

            if (settings.Espacamento != "normal")
                bodyClasses.Add($"spacing-{settings.Espacamento}");

            // Adiciona as classes ao contexto para uso nas views
            context.Items["BodyClasses"] = string.Join(" ", bodyClasses);
            
            // Adiciona as configurações completas ao contexto
            context.Items["AccessibilitySettings"] = settings;
        }
    }
}