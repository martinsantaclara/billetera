using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class RegistroController : ApiController
    {
        string cadenaDeConexion = ConfigurationManager.ConnectionStrings["MiConexion"].ConnectionString;

        [HttpPost]
        public IHttpActionResult Post([FromBody] Registro registro)
        {
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlCommand cmd = new SqlCommand("spRegistroCliente", conector);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter paramCodRetorno = new SqlParameter("codRetorno", SqlDbType.Int);
                paramCodRetorno.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(paramCodRetorno);

                byte[] data = System.Text.Encoding.ASCII.GetBytes(registro.Password);
                data = new System.Security.Cryptography.SHA256Managed().ComputeHash(data);
                String hash = System.Text.Encoding.ASCII.GetString(data);

                cmd.Parameters.AddWithValue("nombre", registro.NombreCliente);
                cmd.Parameters.AddWithValue("email ", registro.Email);
                cmd.Parameters.AddWithValue("password", hash);
                cmd.Parameters.AddWithValue("cvu", registro.Cvu);
                cmd.Parameters.AddWithValue("alias", registro.Alias);
                cmd.Parameters.AddWithValue("pregunta1", registro.Pregunta1);
                cmd.Parameters.AddWithValue("respuesta1", registro.Respuesta1);
                cmd.Parameters.AddWithValue("pregunta2", registro.Pregunta2);
                cmd.Parameters.AddWithValue("respuesta2", registro.Respuesta2);
                cmd.Parameters.AddWithValue("pregunta3", registro.Pregunta3);
                cmd.Parameters.AddWithValue("respuesta3", registro.Respuesta3);
                cmd.Parameters.AddWithValue("estado", registro.Estado);
                cmd.ExecuteNonQuery();
                int rpta = Convert.ToInt32(cmd.Parameters["codRetorno"].Value);
                return Ok(rpta);
            }
        }
    }
}
