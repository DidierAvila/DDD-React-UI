/**
 * ServiceForm Component - Formulario para cexport function ServiceForm({ open, onClose, onSuccess, service }: ServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<CountryDropdown[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const { handleError } = useApiError();
  const { showNotification } = useNotificationContext();

  const isEditing = !!service;ditar servicios
 * Platform Web Frontend - Next.js TypeScript
 */

'use client';

import { useNotificationContext } from '@/modules/shared/components/providers/NotificationProvider';
import { useApiError } from '@/modules/shared/hooks/useApiError';
import { Search as SearchIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormGroup,
    InputAdornment,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { countriesService, CountryDropdown } from '../../services/countriesService';
import { servicesService } from '../../services/servicesService';
import { CreateServiceData, Service, UpdateServiceData } from '../../types/service';

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: Service | null; // Si está presente, es edición; si no, es creación
}

interface FormData {
  name: string;
  description: string;
  status: boolean;
  hourlyValue: number;
  supplierId: string;
  countryCodes: string[]; // Códigos de países seleccionados
}

export function ServiceForm({ open, onClose, onSuccess, service }: ServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<CountryDropdown[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const { handleError } = useApiError();
  const { showNotification } = useNotificationContext();

  const isEditing = !!service;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      status: true,
      hourlyValue: 0,
      supplierId: '',
      countryCodes: [],
    },
  });

  // Cargar países cuando se abra el modal
  useEffect(() => {
    if (open) {
      loadCountries();
      setCountrySearchTerm(''); // Reiniciar filtro de búsqueda
    }
  }, [open]);

  // Resetear formulario cuando cambie el servicio o se abra el modal
  useEffect(() => {
    if (open) {
      if (isEditing && service) {
        // Convertir countries a countryCodes para el formulario
        const countryCodes = service.countries
          ? service.countries.map(country => country.countryCode)
          : service.countryCodes || [];

        reset({
          name: service.name,
          description: service.description || '',
          status: service.status,
          hourlyValue: service.hourlyValue,
          supplierId: service.supplierId,
          countryCodes: countryCodes,
        });
      } else {
        reset({
          name: '',
          description: '',
          status: true,
          hourlyValue: 0,
          supplierId: '',
          countryCodes: [],
        });
      }
    }
  }, [open, service, isEditing, reset]);

  // Cargar países disponibles
  const loadCountries = async () => {
    setLoadingCountries(true);
    try {
      const countriesData = await countriesService.getCountriesDropdown();
      setCountries(countriesData);
    } catch (error) {
      handleError(error);
      showNotification('Error al cargar los países', 'error');
    } finally {
      setLoadingCountries(false);
    }
  };

  // Manejar cambio de países seleccionados
  const handleCountryChange = (countryCode: string, checked: boolean, currentCountries: string[]) => {
    if (checked) {
      return [...currentCountries, countryCode];
    } else {
      return currentCountries.filter((code) => code !== countryCode);
    }
  };

  // Filtrar países basado en el término de búsqueda
  const filteredCountries = countries.filter((country) =>
    country.label.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.value.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (isEditing && service) {
        // Actualizar servicio existente
        const updateData: UpdateServiceData = {
          name: data.name,
          description: data.description || undefined,
          status: data.status,
          hourlyValue: data.hourlyValue,
          supplierId: data.supplierId,
          countryCodes: data.countryCodes,
        };

        await servicesService.update(service.id, updateData);
        showNotification('Servicio actualizado exitosamente', 'success');
      } else {
        // Crear nuevo servicio
        const createData: CreateServiceData = {
          name: data.name,
          description: data.description || undefined,
          status: data.status,
          hourlyValue: data.hourlyValue,
          supplierId: data.supplierId,
          countryCodes: data.countryCodes,
        };

        await servicesService.create(createData);
        showNotification('Servicio creado exitosamente', 'success');
      }

      onSuccess();
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Formatear valor monetario
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          {isEditing ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEditing
            ? 'Modifica los datos del servicio'
            : 'Ingresa los datos del nuevo servicio'
          }
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Información básica */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Información Básica
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: 'El nombre es obligatorio',
                    minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' },
                    maxLength: { value: 100, message: 'El nombre no puede exceder 100 caracteres' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre del Servicio"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      fullWidth
                      required
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  rules={{
                    maxLength: { value: 500, message: 'La descripción no puede exceder 500 caracteres' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descripción"
                      multiline
                      rows={3}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Box>

            <Divider />

            {/* Información comercial */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Información Comercial
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Controller
                  name="hourlyValue"
                  control={control}
                  rules={{
                    required: 'El valor por hora es obligatorio',
                    min: { value: 0.01, message: 'El valor debe ser mayor a 0' },
                    max: { value: 999999999, message: 'El valor es demasiado alto' }
                  }}
                  render={({ field: { onChange, value, ...field } }) => (
                    <TextField
                      {...field}
                      label="Valor por Hora"
                      type="number"
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      error={!!errors.hourlyValue}
                      helperText={errors.hourlyValue?.message || (value > 0 && `Equivale a ${formatCurrency(value)}`)}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        inputProps: { min: 0, step: 'any' }
                      }}
                    />
                  )}
                />

                <Controller
                  name="supplierId"
                  control={control}
                  rules={{ required: 'El ID del proveedor es obligatorio' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ID del Proveedor"
                      error={!!errors.supplierId}
                      helperText={errors.supplierId?.message || 'Ingresa el GUID del proveedor'}
                      fullWidth
                      required
                      placeholder="ej: 123e4567-e89b-12d3-a456-426614174000"
                    />
                  )}
                />
              </Box>
            </Box>

            <Divider />

            {/* Países disponibles */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Países Disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selecciona los países donde estará disponible este servicio
              </Typography>

              {/* Campo de búsqueda de países */}
              <TextField
                placeholder="Buscar país..."
                value={countrySearchTerm}
                onChange={(e) => setCountrySearchTerm(e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Controller
                name="countryCodes"
                control={control}
                rules={{ required: 'Debe seleccionar al menos un país' }}
                render={({ field }) => (
                  <Box>
                    {loadingCountries ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          Cargando países...
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                        {filteredCountries.length > 0 ? (
                          <FormGroup>
                            {filteredCountries.map((country) => (
                              <FormControlLabel
                                key={`country-${country.value}`}
                                control={
                                  <Checkbox
                                    checked={field.value.includes(country.value)}
                                    onChange={(e) => {
                                      const newValue = handleCountryChange(
                                        country.value,
                                        e.target.checked,
                                        field.value
                                      );
                                      field.onChange(newValue);
                                    }}
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography variant="body2">{country.label}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Código: {country.value}
                                    </Typography>
                                  </Box>
                                }
                              />
                            ))}
                          </FormGroup>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                            No se encontraron países que coincidan con "{countrySearchTerm}"
                          </Typography>
                        )}
                      </Box>
                    )}
                    {errors.countryCodes && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        {errors.countryCodes.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Box>

            <Divider />

            {/* Estado */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Configuración
              </Typography>

              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">
                          Estado del Servicio
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {value ? 'El servicio estará disponible' : 'El servicio no estará disponible'}
                        </Typography>
                      </Box>
                    }
                  />
                )}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !isDirty}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ServiceForm;
