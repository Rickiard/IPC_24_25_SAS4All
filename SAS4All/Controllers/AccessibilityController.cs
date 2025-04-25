using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SAS4All.Models;

namespace SAS4All.Controllers
{
    public class AccessibilityController : Controller
    {
        // Método GET: Exibe a página inicial de definições de acessibilidade
        public IActionResult Index()
        {
            // Carrega as definições guardadas do cookie
            var configuracoesGuardadas = CarregarDefinicoesDoCookie();
            return View(configuracoesGuardadas);
        }

        // Método POST: Guarda as definições enviadas pelo formulário
        [HttpPost]
        [ValidateAntiForgeryToken] // Proteção contra ataques CSRF
        public IActionResult GuardarDefinicoes(AcessibilidadeModel modelo)
        {
            if (!ModelState.IsValid)
            {
                // Retorna à página com mensagens de erro se o modelo for inválido
                return View("Index", modelo);
            }

            try
            {
                // Guarda as definições do utilizador no cookie
                GuardarDefinicoesNoCookie(modelo);

                // Redireciona para a página inicial ou outra página específica
                return RedirectToAction("Index", "Home");
            }
            catch (Exception ex)
            {
                // Regista o erro e retorna uma mensagem amigável ao utilizador
                ModelState.AddModelError("", "Ocorreu um erro ao guardar as definições. Por favor, tente novamente.");
                return View("Index", modelo);
            }
        }

        // Método auxiliar: Carrega as definições do utilizador do cookie
        private AcessibilidadeModel CarregarDefinicoesDoCookie()
        {
            // Tenta obter o cookie "UserSettings"
            var jsonDefinicoes = HttpContext.Request.Cookies["UserSettings"];

            // Se o cookie existir, desserializa o JSON para o modelo
            if (!string.IsNullOrEmpty(jsonDefinicoes))
            {
                return JsonConvert.DeserializeObject<AcessibilidadeModel>(jsonDefinicoes);
            }

            // Se o cookie não existir, retorna um modelo com valores padrão
            return new AcessibilidadeModel
            {
                ModoEscuro = false,
                AltoContraste = false,
                TamanhoFonte = "16px",
                Espacamento = "normal",
            };
        }

        // Método auxiliar: Guarda as definições do utilizador no cookie
        private void GuardarDefinicoesNoCookie(AcessibilidadeModel modelo)
        {
            // Serializa o modelo para JSON
            var jsonDefinicoes = JsonConvert.SerializeObject(modelo);

            // Cria um cookie com as definições serializadas
            var opcoesCookie = new Microsoft.AspNetCore.Http.CookieOptions
            {
                Expires = DateTime.Now.AddDays(30), // Define a validade do cookie (30 dias)
                HttpOnly = true, // Impede que o cookie seja acedido via JavaScript
                Secure = true,   // Garante que o cookie só seja transmitido via HTTPS
                IsEssential = true // Marca o cookie como essencial
            };

            HttpContext.Response.Cookies.Append("UserSettings", jsonDefinicoes, opcoesCookie);
        }
    }
}
