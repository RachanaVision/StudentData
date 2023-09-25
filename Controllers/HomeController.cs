using StudentData.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StudentData.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult StudentRecord()
        {
            Student student = new Student();
            return View(student);
        }
        public ActionResult AddRecord()
        {
            return View();
        }
    }
}