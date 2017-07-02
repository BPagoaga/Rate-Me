const formidable = require('formidable'),
    fs = require('fs'),
    path = require('path')

module.exports = (app) => {
    app.get('/company/create', (req, res) => {
        res.render('company/company', {
            title: 'Company Registration',
            user: req.user
        });
    })

    app.post('/upload', (req, res) => {
        const form = new formidable.IncomingForm()

        form.uploadDir = path.join(__dirname, '../public/uploads')
        form.on('file', (field, file) => {
            fs.rename(file.path, path.join(form.uploadDir, file.name))
        })
        form.on('error', (err) => {
            console.error('An error occured', err)
        })
        form.on('end', () => {
            console.log('done')
        })

                console.log(form._events.file)


        form.parse(req)
    })
}