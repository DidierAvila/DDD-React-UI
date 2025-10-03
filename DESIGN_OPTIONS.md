/**
 * PROPUESTAS DE DISEÑO PARA userTypeName - MainLayout
 * Diferentes opciones de layout para mostrar la información del usuario
 */

// OPCIÓN A: Layout Horizontal Espaciado (Implementado)
// ┌─────────────────────────────────┐
// │ Juan Pérez    │ [Admin]  [●]    │
// │ juan@email.com│               │
// └─────────────────────────────────┘
// ✅ Pros: Muy claro, separado, profesional
// ❌ Contras: Ocupa más espacio horizontal

// OPCIÓN B: Layout Compacto (Implementado)
// ┌──────────────────┐
// │      Juan Pérez  │
// │   juan@email.com │
// │        [Admin]   │
// └──────────────────┘
// ✅ Pros: Compacto, organizado verticalmente
// ❌ Contras: Más alto verticalmente

// OPCIÓN C: Badge Integrado en Avatar (NUEVA PROPUESTA)
// ┌─────────────────────────────────┐
// │ Juan Pérez              [JP]A   │
// │ juan@email.com             ●    │
// └─────────────────────────────────┘
// donde A = badge pequeño con tipo
// ✅ Pros: Muy compacto, aprovecha el avatar
// ❌ Contras: Puede ser menos legible

// OPCIÓN D: Tooltip Rico + Indicador Sutil (NUEVA PROPUESTA)
// ┌─────────────────────────────────┐
// │ Juan Pérez (A)          [JP]    │
// │ juan@email.com             ●    │
// └─────────────────────────────────┘
// donde (A) = letra pequeña del tipo
// ✅ Pros: Minimalista, información en tooltip
// ❌ No tan visible el tipo de usuario

// OPCIÓN E: Layout de Tarjeta (NUEVA PROPUESTA)
// ┌─────────────────────────────────┐
// │ ┌─────────────────┐      [JP]   │
// │ │ Juan Pérez      │         ●   │
// │ │ juan@email.com  │             │
// │ │ Admin          │             │
// │ └─────────────────┘             │
// └─────────────────────────────────┘
// ✅ Pros: Muy organizado, tipo bien visible
// ❌ Contras: Ocupa mucho espacio

export const DESIGN_OPTIONS = {
  HORIZONTAL_SPACED: 'horizontal-spaced',
  COMPACT_VERTICAL: 'compact-vertical',
  AVATAR_BADGE: 'avatar-badge',
  SUBTLE_INDICATOR: 'subtle-indicator',
  CARD_LAYOUT: 'card-layout'
};
