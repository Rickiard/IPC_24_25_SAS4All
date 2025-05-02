﻿using Microsoft.AspNetCore.Mvc;
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
        
        [HttpPost]
        public IActionResult MBWay(CarregamentosViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Here you would process the MBWay payment
                // For now, we'll just redirect to Index
                return RedirectToAction("Index");
            }
            
            return View(model);
        }
        public IActionResult Multibanco()
        {
            return View(new CarregamentosViewModel());
        }
        public IActionResult MultibancoConfirmation()
        {
            return View(new CarregamentosViewModel());
        }
    }
}
