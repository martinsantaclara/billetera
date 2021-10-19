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
    [AllowAnonymous]

    public class MovimientosController : ApiController
    {
        string cadenaDeConexion = ConfigurationManager.ConnectionStrings["MiConexion"].ConnectionString;

        [HttpGet]
        public IHttpActionResult Get(int id)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conector = new SqlConnection(cadenaDeConexion))
            {
                conector.Open();
                SqlDataAdapter adaptador = new SqlDataAdapter("SELECT TOP 10 * FROM ( " +
                                                              "SELECT FechaTransaccion, CONVERT(varchar,FechaTransaccion, 103) AS Fecha, CONVERT(varchar,FechaTransaccion, 24) AS Hora, " +
                                                              "DescripcionTransaccion,SimboloMoneda,MontoIngreso AS Monto " +
                                                              "FROM DetalleTransacciones INNER JOIN Monedas " +
                                                              "ON IdMonedaIngreso=IdMoneda " +
                                                              "WHERE IdTransaccion < 5 AND IdCuentaIngreso = " + id + " " +
                                                              "UNION " +
                                                              "SELECT FechaTransaccion, CONVERT(varchar,FechaTransaccion, 103) AS Fecha, CONVERT(varchar,FechaTransaccion, 24) AS Hora, " +
                                                              "DescripcionTransaccion,SimboloMoneda, Abs(MontoEgreso) AS Monto " +
                                                              "FROM DetalleTransacciones INNER JOIN Monedas " +
                                                              "ON IdMonedaEgreso=IdMoneda " +
                                                              "WHERE IdTransaccion > 4 AND IdCuentaIngreso = " + id + " " +
                                                              "UNION " +
                                                              "SELECT FechaTransaccion, CONVERT(varchar,FechaTransaccion, 103) AS Fecha, CONVERT(varchar,FechaTransaccion, 24) AS Hora, " +
                                                              "DescripcionTransaccion,SimboloMoneda, MontoEgreso AS Monto " +
                                                              "FROM DetalleTransacciones INNER JOIN Monedas " +
                                                              "ON IdMonedaEgreso=IdMoneda " +
                                                              "WHERE IdCuentaIngreso!=IdCuentaEgreso AND IdCuentaEgreso = " + id + " ) AS Q1 " +
                                                              "ORDER BY Q1.FechaTransaccion DESC", conector)
                {

                };
                adaptador.Fill(dt);
            }
            return Ok(dt);
        }

    }
}
