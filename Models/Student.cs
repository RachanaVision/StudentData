using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StudentData.Models
{
    public class Student
    {
        public int id { get; set; }
        public string fname { get; set; }
        public string lname { get; set; }
        public string dob { get; set; }
        public string gender { get; set; }
        public string standard { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string role { get; set; }
    }
}