using Microsoft.AspNetCore.Mvc;

namespace SAS4All.Controllers
{
    public class ScheduledMealsController : Controller
    {
        public IActionResult Index(DateTime targetDate)
        {
            return View(targetDate);
        }
    }
}
