import app from './app';

const PORT = process.env.PORT || 4000; // ✅ Usa la variable de entorno

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});