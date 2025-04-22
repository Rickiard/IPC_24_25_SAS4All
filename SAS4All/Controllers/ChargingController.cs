using Microsoft.AspNetCore.Mvc;
using SAS4ALL.Models;

namespace SAS4All.Controllers
{
    public class ChargingController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public IActionResult MBWay()
        {
            return View(new CarregamentosViewModel());
        }
    }
}
