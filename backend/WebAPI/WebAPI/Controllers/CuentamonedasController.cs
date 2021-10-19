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
    public class CuentaMoneda
    {
        public int IdCuenta { get; set; }
        public int IdMoneda { get; set; }

    }
    public class CuentamonedasController : ApiController
    {
        string cadenaDeConexion = ConfigurationManager.ConnectionStrings["MiConexion"].ConnectionString;

        [HttpPost]
        public IHttpActionResult Post([FromBody] CuentaMoneda cuenta)
        {
            DataTable dt = new DataTable();
            decimal TotalMonedaPrincipal = 0;
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();

                SqlCommand cmd = new SqlCommand("SELECT * FROM CuentaMonedas WHERE IdCuenta=" + cuenta.IdCuenta + " AND IdMoneda=" + cuenta.IdMoneda, conector);
                SqlDataAdapter adaptador = new SqlDataAdapter(cmd);
                adaptador.Fill(dt);
                TotalMonedaPrincipal = Convert.ToDecimal(dt.Rows[0]["TotalCuentaMoneda"].ToString());
            }
            return Ok(TotalMonedaPrincipal);
        }
    }
}
