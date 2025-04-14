using Microsoft.AspNetCore.Mvc;

namespace SAS4All.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult Pin()
        {
            return View();
        }

        public IActionResult Profile()
        {
            return View();
        }
    }
}
