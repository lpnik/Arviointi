var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// näytä opiskelijasivu
router.get('/', function(req, res, next) {
      
    dbConn.query('select * from opintojakso order by idOpintojakso',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            res.render('opintojakso',{data:''});   
        } else {
            res.render('opintojakso',{data:rows});
        }
    });
});

router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opintojakso/add', {
        Koodi: '',
        Laajuus: '',
        Nimi: ''       
    })
})

// lisätään opintojakso
router.post('/add', function(req, res, next) {    

    let Koodi = req.body.Koodi;
    let Laajuus = req.body.Laajuus;
    let Nimi = req.body.Nimi;
    let  errors = false;

    if(Koodi.length === 0 || Laajuus.length === 0|| Nimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('virhe', "Anna kaikki tarvittavat tiedot");
        // render to add.ejs with flash message
        res.render('opintojakso/add', {
            idOpintojakso: req.params.idOpintojakso,
            Koodi: Koodi,
            Laajuus: Laajuus,
            Nimi: Nimi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Koodi: Koodi,
            Laajuus: Laajuus,
            Nimi: Nimi
        }
        
        // insert query
        dbConn.query('INSERT INTO opintojakso SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('arviointi/add', {
                    Koodi: form_data.Koodi,
                    Laajuus: form_data.Laajuus,
	    Nimi: form_data.Nimi,                 
                })
            } else {                
                req.flash('Onnistui!', 'Opintojakson tiedot lisätty kantaan.');
                res.redirect('/opintojakso');
            }
        })
    }
})

// muokkaa opintojakso taulua
router.get('/edit/(:idOpintojakso)', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
   
    dbConn.query('SELECT * FROM opintojakso WHERE idOpintojakso = ' + idOpintojakso, function(err, rows, fields) {
        if(err) throw err
         
        // jos opintojaksoa ei löydy
        if (rows.length <= 0) {
            req.flash('error', 'Opintojaksoa ei loytynyt id:lla = ' + idOpintojakso)
            res.redirect('/opintojakso')
        }
        // jos opintojakso löytyi
        else {
            // render to edit.ejs
            res.render('opintojakso/edit', {
                title: 'Muokkaa opintojaksoa', 
                idOpintojakso: rows[0].idOpintojakso,
                Koodi: rows[0].Koodi,
                Laajuus: rows[0].Laajuus,
	Nimi: rows[0].Nimi
            })
        }
    })
})

// update book data
router.post('/update/:idOpintojakso', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
    let Koodi = req.body.Koodi;
    let Laajuus = req.body.Laajuus;
    let Nimi = req.body.idNimi;
    let errors = false;

if(Koodi.length === 0 || Laajuus.length === 0|| Nimi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('Virhe', "Anna kaikki tarvittavat tiedot");
        // render to add.ejs with flash message
        res.render('opintojakso/add', {
            Koodi: Koodi,
            Laajuus: Laajuus,
            Nimi: Nimi
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Koodi: Koodi,
            Laajuus: Laajuus,
            Nimi: Nimi
        }
        // update query
        dbConn.query('UPDATE opintojakso SET ? WHERE idOpintojakso = ' + idOpintojakso, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('virhe', err)
                // render to edit.ejs
            res.render('opintojakso/add', {
            idOpintojaks9o: req.params.idOpintojakso,
            Koodi: Koodi,
            Laajuus: Laajuus,
            Nimi: Nimi
                })
            } else {
                req.flash('Onnistui!', 'Opintojakson tiedot lisatty kantaan');
                res.redirect('/opintojakso');
            }
        })
    }
})
   
// poista opintojakso
router.get('/delete/(:idOpintojakso)', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
     
    dbConn.query('DELETE FROM opintojakso WHERE idOpintojakso = ' + idOpintojakso, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('Virhe', err)
            // suuntaa uudelleen opintojaksoihin
            res.redirect('/opintojakso')
        } else {
            // set flash message
            req.flash('Onnistui!', 'Opintojakson tiedot poistettu ID = ' + idOpintojakso)
            res.redirect('/opintojakso')
        }
    })
})

module.exports = router;