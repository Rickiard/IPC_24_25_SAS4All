using Microsoft.AspNetCore.Mvc;

namespace SAS4All.Controllers
{
    public class MealsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
