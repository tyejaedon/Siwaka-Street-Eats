app.get('/username/nexus',(req,res) =>{
  const query = "SELECT personName FROM registrations WHERE personName = 'nexus'";
  db.query(query, (err, results) => {
    if (err) {
        return res.status(500).send(err);
    }
    res.json(results);
})
});