const router = require('express').Router();
const Url = require('../models/urlModel')
const randomstring = require('randomstring')
const slugify = require('slugify')

/* GET home page. */
router.get('/', async function (req, res, next) {
    results = await Url.find({}).exec()
    res.render('index', { title: 'Express' , results});
});

router.get('/:alias', async (req, res) => {
    const alias = req.params.alias;
    try {
        const result = await Url.findOne({alias}).exec();
        res.redirect(`http://${result.originalUrl}`)
    } catch (e) {
        return res.render('error', {message: 'no such alias', error : e})
    }
})

const regEx = {
    url: /^[\w]+([\.-][\w]+)+(\/[\w]*([\.-]?[\w]+)*)*$/i ,
    alias: /^(\w)+(([\.-])?(\w))*$/i
}

router.post('/', async function(req, res) {
    const originalUrl = req.body.urlInput
    let alias = req.body.aliasInput

    if (!regEx.url.test(originalUrl)) {
        const error = new Error('invalid url')
        return res.render('error', {message: 'invalid url', error : error})
    }
    if (!regEx.alias.test(alias)) {
        alias = slugify(alias)
        if(!alias) {
            alias = randomstring.generate(4);
        }
    }

    const newUrl = new Url({originalUrl, alias});
    try {
        await newUrl.save();
        res.redirect('/')
    } catch (e) {
        return res.render('error', {message: 'Your alias is not unique', error : e})
    }

})

module.exports = router;
