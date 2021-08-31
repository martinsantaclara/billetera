using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public partial class Cuenta
    {
        public int IdCuenta { get; set; }
        public string Cvu { get; set; }
        public string Alias { get; set; }
        public DateTime FechaAlta { get; set; }
        public string Estado { get; set; }
    }
}