using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebAPI.Controllers
{


    public class Cuenta
    {
        public int Id { get; set; }
    }
    public class MonedasController : ApiController
    {
        string cadenaDeConexion = ConfigurationManager.ConnectionStrings["MiConexion"].ConnectionString;


        [HttpGet]
        public IHttpActionResult Get()
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlDataAdapter adaptador = new SqlDataAdapter("SELECT * FROM Monedas", conector);
                adaptador.Fill(dt);
            }
            return Ok(dt);
        }

        // GET: api/Monedas/1
        //[Authorize]
        [HttpPost]
        public IHttpActionResult Post([FromBody] Cuenta cuenta)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlDataAdapter adaptador = new SqlDataAdapter("SELECT CuentaMonedas.IdMoneda, NombreMoneda, SimboloMoneda, UrlLogoMoneda, " +
                                                                     "Abreviatura, Criptomoneda, Decimales, TotalCuentaMoneda " +
                                                              "FROM CuentaMonedas " +
                                                              "INNER JOIN Monedas " +
                                                              "ON CuentaMonedas.IdCuenta = " + cuenta.Id + " " +
                                                              "AND CuentaMonedas.IdMoneda=Monedas.IdMoneda", conector);
                adaptador.Fill(dt);
            }
            return Ok(dt);
        }

        // GET: api/Monedas/5
        public string Get(string id)
        {
            return "value";
        }

        //// POST: api/Monedas
        //public void Post([FromBody]string value)
        //{
        //}

        // PUT: api/Monedas/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Monedas/5
        public void Delete(int id)
        {
        }
    }
}
