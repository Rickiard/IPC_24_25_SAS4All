using Microsoft.AspNetCore.Mvc;
using SAS4ALL.Models;

namespace SAS4ALL.Controllers
{
    public class CarregamentosController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View(new CarregamentosViewModel());
        }

        [HttpPost]
        public IActionResult Index(CarregamentosViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Aqui irias gerar a referência MB Way
                return RedirectToAction("Sucesso");
            }

            return View(model);
        }

        public IActionResult Sucesso()
        {
            return View();
        }
    }
}

