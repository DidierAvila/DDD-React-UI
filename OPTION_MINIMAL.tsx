/**
 * OPCIÓN EXTRA: Layout Minimalista con Espaciado
 * Para reemplazar las opciones actuales si prefieres algo más sutil
 */

// CÓDIGO PARA REEMPLAZAR EN MAINLAYOUT:

{/* OPCIÓN MINIMALISTA: Solo texto bien espaciado */}
<Box
  sx={{
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: 180,
    gap: 1.5,
    pr: 1,
  }}
>
  {/* Nombre del usuario */}
  <Typography
    variant="body2"
    sx={{
      fontWeight: 'bold',
      fontSize: '0.9rem',
      color: 'white',
      letterSpacing: '0.5px',
    }}
  >
    {getDisplayName()}
  </Typography>

  {/* Email y tipo en la misma línea */}
  <Box sx={{ textAlign: 'right', lineHeight: 1 }}>
    <Typography
      component="span"
      variant="caption"
      sx={{
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.8)',
        mr: user.displayUserType ? 1 : 0,
      }}
    >
      {getDisplayEmail()}
    </Typography>

    {user.displayUserType && (
      <Typography
        component="span"
        variant="caption"
        sx={{
          fontSize: '0.7rem',
          color: '#81c784',
          fontWeight: 'medium',
          backgroundColor: 'rgba(255,255,255,0.1)',
          px: 1,
          py: 0.25,
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        {user.displayUserType}
      </Typography>
    )}
  </Box>
</Box>
