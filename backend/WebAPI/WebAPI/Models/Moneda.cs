using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Moneda
    {
        public int IdMoneda { get; set; }
        public string NombreMoneda { get; set; }
        public string SimboloMoneda { get; set; }
        public string UrlLogoMoneda { get; set; }
        public string Abreviatura { get; set; }
        public bool Criptomoneda { get; set; }



    }
}