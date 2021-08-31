using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Registro
    {
        public string NombreCliente { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Cvu { get; set; }
        public string Alias { get; set; }
        public string Estado { get; set; }

    }
}