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
using WebAPI.Models;

namespace WebAPI.Controllers
{
    //[EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class ProvinciasController : ApiController

    {


        string cadenaDeConexion = ConfigurationManager.ConnectionStrings["MiConexion"].ConnectionString;

       
        // GET: api/Provincias
        [HttpGet]
        public IHttpActionResult Get()
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlDataAdapter adaptador = new SqlDataAdapter("SELECT * FROM Provincias",conector);
                adaptador.Fill(dt);
            }
            return Ok(dt);
        }

        // GET: api/Provincias/5
        [HttpGet]
        public IHttpActionResult Get(int id)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                string comando = "SELECT * FROM Provincias WHERE IdProvincia=" + id;
                SqlDataAdapter adaptador = new SqlDataAdapter(comando, conector);
                adaptador.Fill(dt);
            }
            return Ok(dt);
        }

        // POST: api/Provincias
        [HttpPost]
        public IHttpActionResult Post([FromBody] Provincia provincia)
        {
            //DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlCommand cmd = new SqlCommand(@"Insert Into Provincias VALUES(@NombreProvincia)", conector);
                cmd.Parameters.Add(new SqlParameter("@NombreProvincia", provincia.NombreProvincia));
                int i = cmd.ExecuteNonQuery();
            } 
            return Ok();
        }

        // PUT: api/Provincias/5
        [HttpPut]
        public IHttpActionResult Put(int id, [FromBody] Provincia provincia)
        {
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlCommand cmd = new SqlCommand(@"Update Provincias SET NombreProvincia=@NombreProvincia WHERE IdProvincia=@id", conector);
                cmd.Parameters.Add(new SqlParameter("@id", id));
                cmd.Parameters.Add(new SqlParameter("@NombreProvincia", provincia.NombreProvincia));
                int i = cmd.ExecuteNonQuery();
            }
            return Ok();
        }

        // DELETE: api/Provincias/5
        [HttpDelete]
        public IHttpActionResult Delete(int id)
        {
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlCommand cmd = new SqlCommand(@"Delete FROM Provincias WHERE IdProvincia=@id", conector);
                cmd.Parameters.Add(new SqlParameter("@id", id));
                int i = cmd.ExecuteNonQuery();
            }
            return Ok();
        }
    }
}
