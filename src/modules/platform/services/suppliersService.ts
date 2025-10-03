/**
 * Suppliers Service - Servicio para gestión de proveedores
 * Platform Web Frontend - Next.js TypeScript
 */

import { api } from '@/modules/shared/services/api';

// Interface para el dropdown de proveedores
export interface SupplierDropdown {
  value: string; // ID del proveedor
  label: string; // Nombre del proveedor
}

/**
 * Servicio para operaciones relacionadas con proveedores
 */
export const suppliersService = {
  /**
   * Obtener lista de proveedores por tipo de usuario para dropdown
   * @param userTypeId - ID del tipo de usuario
   * @returns Promise con array de proveedores para dropdown
   */
  getSuppliersByUserType: async (userTypeId: string): Promise<SupplierDropdown[]> => {
    try {
      console.log('🔍 Cargando proveedores para userTypeId:', userTypeId);

      const response = await api.get<SupplierDropdown[]>(`/Api/Auth/Users/dropdown/bytype/${userTypeId}`);

      // Validar estructura de respuesta
      if (!Array.isArray(response)) {
        console.error('❌ Respuesta inválida del servicio de proveedores:', response);
        throw new Error('Formato de respuesta inválido del servidor');
      }

      // Validar que cada elemento tenga la estructura esperada
      const validSuppliers = response.filter((supplier: any) => {
        const isValid = supplier &&
                       typeof supplier.value === 'string' &&
                       typeof supplier.label === 'string' &&
                       supplier.value.trim() !== '' &&
                       supplier.label.trim() !== '';

        if (!isValid) {
          console.warn('⚠️ Proveedor con formato inválido filtrado:', supplier);
        }

        return isValid;
      });

      console.log(`✅ ${validSuppliers.length} proveedores cargados exitosamente`);
      return validSuppliers;

    } catch (error) {
      console.error('❌ Error al cargar proveedores:', error);

      // Re-lanzar con mensaje más descriptivo
      if (error instanceof Error) {
        throw new Error(`Error al cargar proveedores: ${error.message}`);
      }

      throw new Error('Error desconocido al cargar proveedores');
    }
  },

  /**
   * Buscar proveedores por término de búsqueda
   * @param suppliers - Lista completa de proveedores
   * @param searchTerm - Término de búsqueda
   * @returns Proveedores filtrados
   */
  searchSuppliers: (suppliers: SupplierDropdown[], searchTerm: string): SupplierDropdown[] => {
    if (!searchTerm.trim()) {
      return suppliers;
    }

    const term = searchTerm.toLowerCase().trim();

    return suppliers.filter(supplier =>
      supplier.label.toLowerCase().includes(term) ||
      supplier.value.toLowerCase().includes(term)
    );
  },

  /**
   * Obtener proveedor por ID
   * @param suppliers - Lista de proveedores
   * @param supplierId - ID del proveedor a buscar
   * @returns Proveedor encontrado o null
   */
  getSupplierById: (suppliers: SupplierDropdown[], supplierId: string): SupplierDropdown | null => {
    return suppliers.find(supplier => supplier.value === supplierId) || null;
  },

  /**
   * Validar que un proveedor existe en la lista
   * @param suppliers - Lista de proveedores
   * @param supplierId - ID del proveedor a validar
   * @returns true si el proveedor existe
   */
  isValidSupplierId: (suppliers: SupplierDropdown[], supplierId: string): boolean => {
    return suppliers.some(supplier => supplier.value === supplierId);
  },

  /**
   * Obtener todos los proveedores disponibles desde el endpoint simplificado
   * @returns Promise con array de proveedores para dropdown
   */
  getSuppliers: async (): Promise<SupplierDropdown[]> => {
    try {
      console.log('🔄 Cargando proveedores desde endpoint simplificado...');

      const response = await api.get<SupplierDropdown[]>('/Api/Auth/Users/dropdown/suppliers');

      // Validar estructura de respuesta
      if (!Array.isArray(response)) {
        console.error('❌ Respuesta inválida del servicio de proveedores:', response);
        throw new Error('Formato de respuesta inválido del servidor');
      }

      // Validar que cada elemento tenga la estructura esperada
      const validSuppliers = response.filter((supplier: any) => {
        const isValid = supplier &&
                       typeof supplier.value === 'string' &&
                       typeof supplier.label === 'string' &&
                       supplier.value.trim() !== '' &&
                       supplier.label.trim() !== '';

        if (!isValid) {
          console.warn('⚠️ Proveedor con formato inválido filtrado:', supplier);
        }

        return isValid;
      });

      console.log(`✅ ${validSuppliers.length} proveedores cargados exitosamente`);
      return validSuppliers;

    } catch (error) {
      console.error('❌ Error al cargar proveedores:', error);

      // Re-lanzar con mensaje más descriptivo
      if (error instanceof Error) {
        throw new Error(`Error al cargar proveedores: ${error.message}`);
      }

      throw new Error('Error desconocido al cargar proveedores');
    }
  }
};

export default suppliersService;
