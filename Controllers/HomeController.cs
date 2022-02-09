using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace MR.CRM.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public void Login([Bind("email")] string email, [Bind("password")] string password) {
            Console.WriteLine($"{email} {password}");
            HttpContext.Session.SetString("login", "1");
        }
    }
}