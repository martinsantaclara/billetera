using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Web.Http;
using WebAPI.JWT;
using WebAPI.Models;


namespace WebAPI.Controllers
{
    [AllowAnonymous]

    public class Response
    {
        public int IdCliente { get; set; }
        public string NombreCliente { get; set; }
        public string Email { get; set; }
        public string Cvu { get; set; }
        public string Alias { get; set; }
        public string UrlFoto { get; set; }
        public string Token { get; set; }
        public int IdCuenta { get; set; }


    }

    public class AutenticacionController : ApiController
    {

        string cadenaDeConexion = ConfigurationManager.ConnectionStrings["MiConexion"].ConnectionString;

        [HttpPost]

        public IHttpActionResult Login(Login cliente)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                string comando = "SELECT IdCliente, NombreCliente, Email, Password, UrlFoto, Clientes.IdCuenta, Cvu, Alias FROM Clientes " +
                                 "INNER JOIN Cuentas ON Clientes.IdCuenta=Cuentas.IdCuenta WHERE Email='" + cliente.Email + "'";
                SqlDataAdapter adaptador = new SqlDataAdapter(comando, conector);
                adaptador.Fill(dt);

                if (dt.Rows.Count == 0)
                {
                    return Unauthorized();
                } 
                else
                {
                    byte[] data = System.Text.Encoding.ASCII.GetBytes(cliente.Password);
                    data = new System.Security.Cryptography.SHA256Managed().ComputeHash(data);
                    string hash = System.Text.Encoding.ASCII.GetString(data);
                    string pass = dt.Rows[0]["Password"].ToString().Substring(0,hash.Length);
                    bool isCredentialValid = (hash == pass);
                    if (isCredentialValid)
                    {
                        var token = TokenGenerator.GenerateTokenJwt(cliente.Email);

                        var response = new Response
                        {
                            IdCliente = Int32.Parse(dt.Rows[0]["IdCliente"].ToString()),
                            NombreCliente = dt.Rows[0]["NombreCliente"].ToString(),
                            Email = dt.Rows[0]["Email"].ToString(),
                            UrlFoto = dt.Rows[0]["UrlFoto"].ToString(),
                            Token = token,
                            IdCuenta = Int32.Parse(dt.Rows[0]["IdCuenta"].ToString()),
                            Cvu = dt.Rows[0]["Cvu"].ToString(),
                            Alias = dt.Rows[0]["Alias"].ToString(),
                        };
                        string jsonResponse = JsonConvert.SerializeObject(response);
                        return Ok(jsonResponse);
                    }
                    else
                        return Unauthorized();
                }
            }
        }
    }
}
