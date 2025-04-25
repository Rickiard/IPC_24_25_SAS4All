using Microsoft.AspNetCore.Mvc;

namespace SAS4All.Controllers
{
    public class ScheduledMealsController : Controller
    {
        public IActionResult Index(DateTime? date)
        {
            ViewData["Date"] = date?.ToString("yyyy-MM-dd") ?? DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }
    }
}
