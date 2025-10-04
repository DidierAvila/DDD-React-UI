'use client';

/**
 * Componente de filtros para reportes
 * SignoSST Web Frontend - Next.js TypeScript
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { ReportFiltersProps, UsersByTypeFilters } from '../../types';
import { usersService } from '@/modules/admin/services/usersService';

const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  loading = false
}) => {
  const [userTypes, setUserTypes] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingUserTypes, setLoadingUserTypes] = useState(false);

  // Cargar tipos de usuario para el filtro
  useEffect(() => {
    const loadUserTypes = async () => {
      try {
        setLoadingUserTypes(true);
        // Usar el servicio existente para obtener tipos de usuario
        // Esto podría requerir un endpoint específico, por ahora usamos un placeholder
        // const response = await usersService.getUserTypes();
        // setUserTypes(response.data || []);
        
        // Placeholder - reemplazar con llamada real al backend
        setUserTypes([
          { id: '11111111-1111-1111-1111-111111111111', name: 'Administrador' },
          { id: '51bbeb89-b07f-4293-b185-dd96fcb9de1e', name: 'Proveedor' },
          { id: '9e43e57b-31f4-4fd4-8d97-16007b923c74', name: 'Usuario' }
        ]);
      } catch (error) {
        console.error('Error loading user types:', error);
      } finally {
        setLoadingUserTypes(false);
      }
    };

    loadUserTypes();
  }, []);

  const handleFilterChange = (key: keyof UsersByTypeFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleDateChange = (field: 'startDate' | 'endDate') => (date: Date | null) => {
    const value = date ? date.toISOString() : undefined;
    handleFilterChange(field, value);
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Filtros del Reporte
        </Typography>
        
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <Grid container spacing={3}>
            {/* Rango de fechas */}
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Fecha inicio"
                value={filters.startDate ? new Date(filters.startDate) : null}
                onChange={handleDateChange('startDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Fecha fin"
                value={filters.endDate ? new Date(filters.endDate) : null}
                onChange={handleDateChange('endDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small'
                  }
                }}
              />
            </Grid>

            {/* Tipo de usuario */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Tipo de Usuario"
                value={filters.userTypeId || ''}
                onChange={(e) => handleFilterChange('userTypeId', e.target.value || undefined)}
                disabled={loadingUserTypes}
              >
                <MenuItem value="">
                  <em>Todos los tipos</em>
                </MenuItem>
                {userTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Incluir inactivos */}
            <Grid item xs={12} sm={6} md={3}>
              <Box display="flex" alignItems="center" height="100%">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.includeInactive || false}
                      onChange={(e) => handleFilterChange('includeInactive', e.target.checked)}
                    />
                  }
                  label="Incluir usuarios inactivos"
                />
              </Box>
            </Grid>

            {/* Botones de acción */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  onClick={onApplyFilters}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : undefined}
                >
                  {loading ? 'Cargando...' : 'Aplicar Filtros'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  disabled={loading}
                >
                  Limpiar Filtros
                </Button>
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;