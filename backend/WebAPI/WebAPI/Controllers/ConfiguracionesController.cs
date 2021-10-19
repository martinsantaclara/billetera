using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebAPI.Controllers
{

    public class ConfiguracionesController : ApiController
    {
        string cadenaDeConexion = ConfigurationManager.ConnectionStrings["MiConexion"].ConnectionString;

        // GET: api/Configuraciones
        [AllowAnonymous]
        [HttpGet]
        public IHttpActionResult Get()
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlDataAdapter adaptador = new SqlDataAdapter("SELECT * FROM Configuraciones", conector);
                adaptador.Fill(dt);
            }
            return Ok(dt);
        }

        // GET: api/Configuraciones/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Configuraciones
        [Authorize]
        [HttpPost]
        public IHttpActionResult Post([FromBody]string value)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlDataAdapter adaptador = new SqlDataAdapter("SELECT * FROM Configuraciones", conector);
                adaptador.Fill(dt);
            }

            return Ok(dt);

        }

        // PUT: api/Configuraciones/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Configuraciones/5
        public void Delete(int id)
        {
        }
    }
}
