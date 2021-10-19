USE [Chamigo]
GO

/****** Object:  Trigger [dbo].[trInsertaCuentaMonedas]    Script Date: 19/10/2021 10:19:16 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TRIGGER [dbo].[trInsertaCuentaMonedas] 
   ON  [dbo].[Cuentas] 
   AFTER INSERT
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @tempMoneda TABLE(IdMoneda int)
	INSERT INTO @tempMoneda(IdMoneda) SELECT IdMoneda FROM Monedas
	DECLARE @rowsMoneda int = (SELECT count(*) FROM @tempMoneda)
	DECLARE @idCuenta int = (SELECT IdCuenta FROM inserted)
	WHILE @rowsMoneda > 0
		BEGIN
			DECLARE @idMoneda int = (SELECT TOP(1) IdMoneda FROM @tempMoneda)
			INSERT INTO dbo.CuentaMonedas(IdCuenta, IdMoneda) VALUES (@idCuenta, @idMoneda)
			DELETE @tempMoneda WHERE IdMoneda=@idMoneda
			SET @rowsMoneda = (SELECT count(*) FROM @tempMoneda)
		END


    -- Insert statements for trigger here

END
GO

ALTER TABLE [dbo].[Cuentas] ENABLE TRIGGER [trInsertaCuentaMonedas]
GO

