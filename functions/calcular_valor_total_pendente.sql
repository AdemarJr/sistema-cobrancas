CREATE OR REPLACE FUNCTION calcular_valor_total_pendente()
RETURNS TABLE (valor DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(SUM(c.valor), 0) AS valor
  FROM cobrancas c
  WHERE c.status IN ('PENDENTE', 'VENCIDO');
END;
$$ LANGUAGE plpgsql;
