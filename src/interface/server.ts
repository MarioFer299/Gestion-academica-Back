import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`
    ==========================================
    🚀 Servidor FocusLab corriendo en puerto: ${PORT}
    🌍 Entorno: ${process.env.NODE_ENV || 'development'}
    🔗 Health Check: http://localhost:${PORT}/api/health
    ==========================================
    `);
});