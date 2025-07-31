const [loading, setLoading] = useState(false);

const handleEditSubmit = async e => {
  e.preventDefault();
  setLoading(true);
  // ...resto del código...
  setLoading(false);
};
// En los botones:
<button type="submit" disabled={loading}>Guardar</button>
<button type="button" onClick={() => setEditing(null)} disabled={loading}>Cancelar</button>