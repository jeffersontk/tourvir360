// pages/api/revalidate.js
export default async function handler(req, res) {
  const { id } = req.query; // Pegue o ID da query string

  try {
    // Revalide a página dinâmica
    await res.revalidate(`/environment/${id}`); // Substitua pelo caminho dinâmico correto
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
