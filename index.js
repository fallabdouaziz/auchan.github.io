const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express();
// permet de rendre accessible nos image en dehors du serveur
app.use('/uploads',express.static('uploads'))
//permet d'avoir un acces sur l'objet posté
const bodyParser = require('body-parser')
const jsonParser= bodyParser.json()
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//------------------------------
app.use(cors())
let connexion;

//---------------Offre--------------------
app.post('/creerOffre',jsonParser, (req, res) => {
    const query = 'insert into offre(matiere,description,datedebut,horaire) values(?,?,?,?)'
    connexion.query(query, [req.body.nom,req.body.description, req.body.date,req.body.horaire], (err,rows,fields) => {
        if (err != null) {
            res.json({message : " erreur lors de l'insertion "})
        }
        if (rows != null) {
            const quer = ' insert into user_offre(iduser,idoffre) values (?,?)'
            connexion.query(quer,[req.body.id,rows.insertId])
            res.json(rows.affectedRows)
        }

    })
}),
    app.put('/modifierOffre/:id',jsonParser, (req, res) => {
    const query = 'update offre set matiere= ?, description= ?, datedebut= ?, horaire= ? where idoffre= ?'
    connexion.query(query, [req.body.nom,req.body.description, req.body.date,req.body.horaire, req.params.id], (err,rows,fields) => {
        console.log(err)
        console.log(rows)
        if (err != null) {
            console.log(err)
            res.json({message : " erreur lors de l'insertion "})
        }
        if (rows != null) {
            console.log(rows)
            const quer = ' insert into user_offre(iduser,idoffre) values (?,?)'
            connexion.query(quer,[req.body.id,rows.insertId])
            res.json(rows.affectedRows)
        }

    })
}),
    app.delete('/supprimerOffre/:id', jsonParser,(req, res) => {
        const query ='delete from user_offre where idoffre=?'
        connexion.query(query,[req.params.id], (err, rows, fields) =>{
            if (rows.affectedRows !=0) {
                const query ='delete from offre where idoffre=?'
                connexion.query(query,[req.params.id], (err, rows, fields) =>{
                    res.json(rows)
                })
            }
        })
    }),
    app.put('/updateOffre/:id', jsonParser,(req, res) => {
        const query ='update offre set iduserd= ? where idoffre=?'
        connexion.query(query,[req.body.id, req.params.id], (err, rows, fields) =>{
            res.json(rows)
        })
    })
app.get('/offres/:id', (req, res) => {
    const query = ' select *from offre o , utilisateur u, user_offre uo where o.idoffre = uo.idoffre and u.id = uo.iduser and uo.iduser != ? and o.iduserd is null '
    connexion.query(query,[req.params.id], (err, rows, fiels) =>{
        const requete = 'select *from offre where iduser !=null '
        res.json(rows)
    })
}),
    app.get('/offresuser/:id', jsonParser, (req, res) => {
    const query = ' select *from offre o , utilisateur u, user_offre uo where o.idoffre = uo.idoffre and u.id = uo.iduser and uo.iduser= ?'
    connexion.query(query,[req.params.id], (err, rows, fiels) =>{
        res.json(rows)
    })
}),
//---------------demande--------------------
app.post('/creerDemande',jsonParser, (req, res) => {
    const query = 'insert into demande(matiere,classe,description,datedebut,horaire) values(?,?,?,?,?)'
    connexion.query(query, [req.body.nom,req.body.classe,req.body.description, req.body.date,req.body.horaire], (err,rows,fields) => {
        if (err != null) {
            res.json({message : " erreur lors de l'insertion "})
        }
        if (rows != null) {
            const quer = ' insert into user_demande(iduser,iddemande) values (?,?)'
            connexion.query(quer,[req.body.id,rows.insertId])
            res.json(rows.affectedRows)
        }

    })
})
app.get('/demandes/:id', (req, res) => {
    const query = ' select *from demande d , utilisateur u, user_demande ud where d.iddemande = ud.iddemande and u.id = ud.iduser and ud.iduser != ? and d.idusero is null'
    connexion.query(query, [req.params.id], (err, rows, fiels) =>{
        res.json(rows)
    })
}),
    app.get('/reponseDemande/:id', (req, res) => {
    const query = ' select *from demande d, user_demande ud, utilisateur u where d.iddemande= ud.iddemande and ud.iduser= ? and d.idusero= u.id'
    connexion.query(query, [req.params.id],(err, rows, fiels) =>{
        console.log(rows)
        res.json(rows)
    })
}),
    app.get('/demandesuser/:id', (req, res) => {
        const query = ' select *from demande o , utilisateur u, user_demande uo where o.iddemande = uo.iddemande and u.id = uo.iduser and uo.iduser= ?'
        connexion.query(query,[req.params.id], (err, rows, fiels) =>{
            res.json(rows)
        })
    }),
    app.put('/accepterDemande/:id', jsonParser,(req, res) => {
        const query = ' update demande set idusero = ? where iddemande =?'
        connexion.query(query,[req.body.id,req.params.id], (err, rows, fiels) =>{
            console.log(err)
            res.json(rows)
        })
    })

//---------------------user-------------------
app.get('/',(req,res) =>{
    connexion.query('select *from utilisateur',(err,rows,field)=>{
        console.log('connection dialena')
        res.json(rows)
    })
})
app.post('/connexion',jsonParser,(req,res)=>{
    console.log(req.body.email)
})

app.post('/getConnexion',jsonParser,(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const queryString ='select *from utilisateur where email= ?'
    const etudiant = connexion.query(queryString,[email], (err, rows, fields) =>{
     if(rows.length > 0) {
         const passwordCrypt = rows[0].password
         const secretkey = '0dhwlhgka84djfjjj5s5s4s544d4dfd6sffffihhfwhwifinfwfw5464454djdghdgdgfdhfhdrwwhhkwlldjdgxuxbabaibaiavtdvd'
         bcrypt.compare(password,passwordCrypt, (err, resPassword) => {
             if(resPassword){
                 const user = {
                     id:  rows[0].id,
                     nom:  rows[0].nom,
                     prenom:  rows[0].prenom
                 }
                 jwt.sign({user},secretkey,{expiresIn: '1h'},(err,token) => {
                     res.json({token})
                 })
             } else {
                    res.json({erreur: 'Identifiant incorrect'})
             }
         })

     }
    })
})
app.post('/inscription',jsonParser,(req,res)=>{
    console.log(pass)
    const email = req.body.email
    const password = req.body.password
    const nom = req.body.nom
    const prenom= req.body.prenom
    const dnaiss= req.body.dnaiss
    const cni = req.body.cni
    const adresse= req.body.adresse
    const niveau = req.body.niveau
    const tel= req.body.tel
    const queryem = 'select *from utilisateur where email = ? '
    connexion.query(queryem,[email], (err, rows,field) => {
        console.log(rows)
        if (rows.length > 0){
            res.json("email deja utilisé")
        }
        else {
            bcrypt.hash(password,10, (err, hash) =>{
                const queryString ="insert into utilisateur(nom,prenom,adresse,dnaiss,email,password,cni,tel,niveau) values (?,?,?,?,?,?,?,?,?)"
                const etudiant = connexion.query(queryString,[nom,prenom,adresse,dnaiss,email,hash,cni,tel,niveau], (err, rows, fields) =>{
                    console.log(err)
                    res.json(err)
                })
            })
        }
    })
})
app.get('/getUserByToken/:token', (req, res) => {
    res.json(jwt.decode(req.params.token))
})

app.listen(process.env.PORT, process.env.IP,function () {
    connexion = mysql.createConnection({
        host:'https://phpmyadmin.alwaysdata.com/',
        user:'levent',
        password: 'dabakhfa960509@',
        database:'levent_auchan',
    })
    console.log("demarer")
})
