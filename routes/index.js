const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/generate', async (req, res) => {
  const data = req.body;

  // Générer le HTML du template PDF
  const html = await ejs.renderFile(path.join(__dirname, '../pdf/template.ejs'), { data });

  // Générer le PDF avec Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  // Envoyer le PDF en téléchargement
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
  res.send(pdfBuffer);
});

module.exports = router;
