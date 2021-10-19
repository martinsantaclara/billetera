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
    public class Transaccion
    {
        public int IdClienteIngreso { get; set; }
        public int IdTransaccion { get; set; }
        public string DescripcionTransaccion { get; set; }
        public int IdCuentaIngreso { get; set; }
        public int IdMonedaIngreso { get; set; }
        public decimal MontoIngreso { get; set; }
        public int IdClienteEgreso { get; set; }
        public int IdCuentaEgreso { get; set; }
        public int IdMonedaEgreso { get; set; }
        public decimal MontoEgreso { get; set; }
        public bool Egreso { get; set; }
    }
    public class TransaccionesController : ApiController
    {
        string cadenaDeConexion = ConfigurationManager.ConnectionStrings["MiConexion"].ConnectionString;


        [HttpGet]
        public IHttpActionResult Get(int id)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlDataAdapter adaptador = new SqlDataAdapter("SELECT IdCliente,Clientes.IdCuenta,Email,Cvu,Alias FROM Clientes " +
                                                              "INNER JOIN Cuentas " +
                                                              "ON Clientes.IdCuenta=Cuentas.IdCuenta " +
                                                              "WHERE IdCliente != " + id, conector);
                adaptador.Fill(dt);
            }
            return Ok(dt);
        }


        [Route("api/transacciones/transaccion")]
        [HttpPost]

        public IHttpActionResult Post([FromBody] Transaccion transaccion)
        {
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlTransaction sqlTran = conector.BeginTransaction();

                SqlCommand cmd = new SqlCommand("UPDATE Clientes SET FechaUltimoMovimiento=getdate() WHERE IdCliente=" + transaccion.IdClienteIngreso, conector);
                cmd.Transaction = sqlTran;
                        try
                        {
                            int i = cmd.ExecuteNonQuery();

                            //decimal monto = Convert.ToDecimal(ingreso.Monto);
                            //SqlCommand cmd1 = new SqlCommand("UPDATE CuentaMonedas SET TotalCuentaMoneda+=" + ingreso.Monto + "WHERE IdCuenta="+ingreso.IdCuenta+" AND IdMoneda="+ingreso.IdMoneda, conector);
                            //cmd1.Transaction = sqlTran;
                            //i = cmd1.ExecuteNonQuery();


                            SqlCommand cmd1 = new SqlCommand(@"UPDATE CuentaMonedas SET TotalCuentaMoneda+=@TotalIngreso " +
                                                             "WHERE IdCuenta=" + transaccion.IdCuentaIngreso + " AND IdMoneda=" + transaccion.IdMonedaIngreso, conector);
                            cmd1.Transaction = sqlTran;
                            SqlParameter iTotal = new SqlParameter("@TotalIngreso", transaccion.MontoIngreso);
                            iTotal.Precision = 18; 
                            iTotal.Scale = 8;
                            cmd1.Parameters.Add(iTotal);
                            i = cmd1.ExecuteNonQuery();

                            if (transaccion.Egreso)
                            {
                                SqlCommand cmd11 = new SqlCommand(@"UPDATE CuentaMonedas SET TotalCuentaMoneda+=@TotalEgreso " +
                                                                     "WHERE IdCuenta=" + transaccion.IdCuentaEgreso + " AND IdMoneda=" + transaccion.IdMonedaEgreso, conector);
                                cmd11.Transaction = sqlTran;
                                SqlParameter eTotal = new SqlParameter("@TotalEgreso", transaccion.MontoEgreso);
                                eTotal.Precision = 18;
                                eTotal.Scale = 8;
                                cmd11.Parameters.Add(eTotal);
                                i = cmd11.ExecuteNonQuery();


                                if (transaccion.IdClienteIngreso != transaccion.IdCuentaEgreso)
                                {
                                    SqlCommand cmd21 = new SqlCommand("UPDATE Clientes SET FechaUltimoMovimiento=getdate() WHERE IdCliente=" + transaccion.IdClienteEgreso, conector);
                                    cmd21.Transaction = sqlTran;
                                    i = cmd21.ExecuteNonQuery();
                                }


                    }

                            SqlCommand cmd2 = new SqlCommand(@"INSERT INTO DetalleTransacciones (IdTransaccion, DescripcionTransaccion, 
                                                               IdCuentaIngreso, IdMonedaIngreso, MontoIngreso, 
                                                               IdCuentaEgreso, IdMonedaEgreso, MontoEgreso)" +
                                                              "VALUES (@IdTransaccion, @DescripcionTransaccion," +
                                                              "@IdCuentaIngreso,@IdMonedaIngreso,@MontoIngreso," +
                                                              "@IdCuentaEgreso,@IdMonedaEgreso,@MontoEgreso)", conector);

                            cmd2.Transaction = sqlTran;
                            cmd2.Parameters.Add(new SqlParameter("@IdTransaccion", transaccion.IdTransaccion));
                            cmd2.Parameters.Add(new SqlParameter("@DescripcionTransaccion", transaccion.DescripcionTransaccion));
                            cmd2.Parameters.Add(new SqlParameter("@IdCuentaIngreso", transaccion.IdCuentaIngreso));
                            cmd2.Parameters.Add(new SqlParameter("@IdMonedaIngreso", transaccion.IdMonedaIngreso));
                            SqlParameter iTotalTrans = new SqlParameter("@MontoIngreso", transaccion.MontoIngreso);
                            iTotalTrans.Precision = 18;
                            iTotalTrans.Scale = 8;
                            cmd2.Parameters.Add(iTotalTrans);
                            cmd2.Parameters.Add(new SqlParameter("@IdCuentaEgreso", transaccion.IdCuentaEgreso));
                            cmd2.Parameters.Add(new SqlParameter("@IdMonedaEgreso", transaccion.IdMonedaEgreso));
                            SqlParameter eTotalTrans = new SqlParameter("@MontoEgreso", transaccion.MontoEgreso);
                            eTotalTrans.Precision = 18;
                            eTotalTrans.Scale = 8;
                            cmd2.Parameters.Add(eTotalTrans);
                            i = cmd2.ExecuteNonQuery();

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

        [HttpPut]

        public IHttpActionResult Put([FromBody] Transaccion ingreso)
        {
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlTransaction sqlTran = conector.BeginTransaction();

                SqlCommand cmd = new SqlCommand("UPDATE Clientes SET FechaUltimoMovimiento=getdate() WHERE IdCliente=" + ingreso.IdClienteIngreso, conector);
                cmd.Transaction = sqlTran;
                try
                {
                    int i = cmd.ExecuteNonQuery();
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
