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
    public class ClientesController : ApiController
    {
        string cadenaDeConexion = ConfigurationManager.ConnectionStrings["MiConexion"].ConnectionString;

        // GET: api/Clientes
        [HttpGet]
        public IHttpActionResult Get()
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlDataAdapter adaptador = new SqlDataAdapter("SELECT * FROM Clientes", conector);
                adaptador.Fill(dt);
            }
            return Ok(dt);
        }

        // GET: api/Clientes/5
        [HttpGet]
        public IHttpActionResult Get(int id)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                string comando = "SELECT * FROM Clientes WHERE IdCliente=" + id;
                SqlDataAdapter adaptador = new SqlDataAdapter(comando, conector);
                adaptador.Fill(dt);
            }
            return Ok(dt);
        }

        [HttpGet]
        [Route("api/clientes/byEmail")]
        //http://localhost:50571/api/clientes/byEmail/?email=martinsantaclara@gmail.com
        public IHttpActionResult Get(string email)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                string comando = "SELECT * FROM Clientes WHERE Email='"  + email + "'";
                SqlDataAdapter adaptador = new SqlDataAdapter(comando, conector);
                adaptador.Fill(dt);
            }
            return Ok(dt);
        }

        // POST: api/Clientes

        [HttpPost]
        public IHttpActionResult Post([FromBody] Registro registro)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlTransaction sqlTran = conector.BeginTransaction();

                SqlCommand cmd = new SqlCommand("SELECT * FROM Clientes WHERE NombreCliente='" + registro.NombreCliente + "' OR Email='" + registro.Email + "'",conector);
                cmd.Transaction = sqlTran;
                SqlDataAdapter adaptador = new SqlDataAdapter(cmd);
                adaptador.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    string nombre = dt.Rows[0]["NombreCliente"].ToString().Trim();
                    if (nombre==registro.NombreCliente)
                    {
                        return Ok(0);
                    }
                    else
                    {
                        return Ok(1);
                    }
                }
                else
                {
                    DataTable dt2 = new DataTable();
                    SqlCommand cmd6 = new SqlCommand("SELECT * FROM Cuentas WHERE Cvu='" + registro.Cvu + "' OR Alias='" + registro.Alias + "'", conector);
                    cmd6.Transaction = sqlTran;
                    adaptador = new SqlDataAdapter(cmd6);
                    adaptador.Fill(dt2);
                    if (dt2.Rows.Count > 0)
                    {
                      return Ok(2);  
                    }
                    else
                    {

                        SqlCommand cmd1 = new SqlCommand(@"Insert Into Cuentas (Cvu,Alias,Estado) VALUES(@Cvu,@Alias,@Estado)", conector);
                        cmd1.Transaction = sqlTran;
                        try
                        {
                            cmd1.Parameters.Add(new SqlParameter("@Cvu", registro.Cvu));
                            cmd1.Parameters.Add(new SqlParameter("@Alias", registro.Alias));
                            cmd1.Parameters.Add(new SqlParameter("@Estado", registro.Estado));
                            int i = cmd1.ExecuteNonQuery();


                            SqlCommand cmd2 = new SqlCommand("SELECT MAX(IdCuenta) AS Id FROM Cuentas", conector);
                            cmd2.Transaction = sqlTran;
                            adaptador = new SqlDataAdapter(cmd2);
                            adaptador.Fill(dt);
                            int idCuenta = Int32.Parse(dt.Rows[0]["Id"].ToString());

                            DataTable dt1 = new DataTable();
                            SqlCommand cmd3 = new SqlCommand("SELECT * FROM Monedas", conector);
                            cmd3.Transaction = sqlTran;
                            adaptador = new SqlDataAdapter(cmd3);
                            adaptador.Fill(dt1);
                            int IdMoneda = 0;


                            for (int ind = 0; ind < dt1.Rows.Count; ind++)
                            {
                                IdMoneda = Int32.Parse(dt1.Rows[ind]["IdMoneda"].ToString());
                                SqlCommand cmd4 = new SqlCommand(@"Insert Into CuentaMonedas (IdCuenta, IdMoneda) VALUES(@IdCuenta,@IdMoneda)", conector);
                                cmd4.Transaction = sqlTran;
                                cmd4.Parameters.Add(new SqlParameter("@IdCuenta", idCuenta));
                                cmd4.Parameters.Add(new SqlParameter("@IdMoneda", IdMoneda));
                                i = cmd4.ExecuteNonQuery();
                            }

                            SqlCommand cmd5 = new SqlCommand(@"Insert Into Clientes (NombreCliente, Email, Password, IdCuenta) VALUES(@NombreCliente,@Email,@Password,@IdCuenta)", conector);
                            cmd5.Transaction = sqlTran;
                            byte[] data = System.Text.Encoding.ASCII.GetBytes(registro.Password);
                            data = new System.Security.Cryptography.SHA256Managed().ComputeHash(data);
                            String hash = System.Text.Encoding.ASCII.GetString(data);
                            cmd5.Parameters.Add(new SqlParameter("@NombreCliente", registro.NombreCliente));
                            cmd5.Parameters.Add(new SqlParameter("@Email", registro.Email));
                            cmd5.Parameters.Add(new SqlParameter("@Password", hash));
                            cmd5.Parameters.Add(new SqlParameter("@IdCuenta", idCuenta));
                            i = cmd5.ExecuteNonQuery();

                            sqlTran.Commit();
                            return Ok(200);
                        }
                        catch (Exception)
                        {
                            sqlTran.Rollback();
                            return Ok(-1);
                        }
                        finally
                        {
                            conector.Close();
                        }
                    }
                }
            }
        }

        // PUT: api/Clientes/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Clientes/5
        public void Delete(int id)
        {
        }
    }
}
