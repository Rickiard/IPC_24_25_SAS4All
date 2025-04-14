using Microsoft.AspNetCore.Mvc;

namespace SAS4All.Controllers
{
    public class TransactionsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
