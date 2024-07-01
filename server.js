const express = require('express'); // Importation du module express pour créer le serveur web
const nodemailer = require('nodemailer'); // Importation du module nodemailer pour envoyer des emails
const path = require('path'); // Importation du module path pour gérer les chemins de fichiers
const fs = require('fs'); // Importation du module fs pour interagir avec le système de fichiers

const app = express(); // Initialisation de l'application express
app.use(express.static(path.join(__dirname, 'assets'))); // Middleware pour servir les fichiers statiques à partir du dossier 'assets'
app.use(express.urlencoded({ extended: true })); // Middleware pour parser les données des formulaires avec l'encodage 'application/x-www-form-urlencoded'
app.use(express.json()); // Middleware pour parser les requêtes avec l'encodage 'application/json'

const port = 8080; // Définition du port sur lequel le serveur va écouter
const commentfile = path.join(__dirname, 'comment.txt'); // Chemin vers le fichier des commentaires

// Fonction pour lire les commentaires à partir du fichier 'comment.txt'
const readCommentsFromFile = (callback) => {
  fs.readFile(commentfile, (err, data) => { // Lecture du fichier des commentaires
    if (err) {
      console.error("Erreur lors de la lecture du fichier de commentaires :", err);
      callback([]); // Si erreur, on retourne un tableau vide via le callback
      return;
    }

    try {
      const comments = JSON.parse(data); // Parsing du contenu du fichier en JSON
      callback(comments); // Retour des commentaires via le callback
    } catch (error) {
      console.error("Erreur lors du parsing du contenu du fichier de commentaires :", error);
      callback([]); // Si erreur de parsing, on retourne un tableau vide via le callback
    }
  });
};

// Route pour servir la page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Envoi de la page 'index.html' en réponse à une requête GET sur la route '/'
});

// Route pour servir la page contact.html
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html')); // Envoi de la page 'contact.html' en réponse à une requête GET sur la route '/contact'
});

// Route pour servir la page nos_offres.html
app.get('/nos_offres', (req, res) => {
  res.sendFile(path.join(__dirname, 'nos_offres.html')); // Envoi de la page 'nos_offres.html' en réponse à une requête GET sur la route '/nos_offres'
});

// Route pour servir la page notre_equipe.html
app.get('/notre_equipe', (req, res) => {
  res.sendFile(path.join(__dirname, 'notre_equipe.html')); // Envoi de la page 'notre_equipe.html' en réponse à une requête GET sur la route '/notre_equipe'
});

// Endpoint pour récupérer les 10 premiers commentaires
app.get('/comments', (req, res) => {
  readCommentsFromFile((comments) => {
    const topTenComments = comments.slice(0, 10); // Sélection des 10 premiers commentaires
    res.json(topTenComments); // Envoi des commentaires au format JSON
  });
});

// Endpoint pour enregistrer un commentaire
app.post('/post/comment', (req, res) => {
  const { name, comment } = req.body; // Extraction des données du corps de la requête
  const newComment = { name, comment }; // Création d'un nouvel objet commentaire

  readCommentsFromFile((comments) => {
    comments.unshift(newComment); // Ajout du nouveau commentaire au début du tableau

    // Limite à 10 commentaires
    if (comments.length > 10) {
      comments = comments.slice(0, 10); // Limitation du tableau à 10 éléments
    }

    // Écriture des commentaires mis à jour dans le fichier
    fs.writeFile(commentfile, JSON.stringify(comments, null, 2), (err) => {
      if (err) {
        console.error("Erreur lors de l'écriture du fichier de commentaires :", err);
        res.status(500).send("Erreur lors de l'enregistrement du commentaire."); // Envoi d'une réponse d'erreur
      } else {
        res.status(200).send("Commentaire enregistré avec succès."); // Envoi d'une réponse de succès
      }
    });
  });
});

// Route pour gérer le formulaire de contact
app.post('/send-message', (req, res) => {
  const { nom, email, subject, message } = req.body; // Extraction des données du corps de la requête

  // Création du transporteur de courrier avec le service Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jblemy2002@gmail.com', // Adresse e-mail de l'expéditeur
      pass: 'yofy pyju utnf rybz' // Mot de passe de l'expéditeur
    }
  });

  // Options du mail pour l'administrateur
  const mailOptionsAdmin = {
    from: email, // Adresse e-mail de l'expéditeur du formulaire
    to: 'jblemy2002@gmail.com', // Adresse e-mail du destinataire (administrateur)
    subject: subject, // Sujet de l'e-mail
    text: `Vous avez reçu un message de la part de ${nom} (${email}) :\n\nMessage : ${message}` // Corps du message
  };

  // Envoi de l'e-mail à l'administrateur
  transporter.sendMail(mailOptionsAdmin, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email à l\'administrateur:', error);
      res.status(500).send('Erreur lors de l\'envoi de l\'email'); // Envoi d'une réponse d'erreur
    } else {
      console.log('Email envoyé à l\'administrateur:', info.response);

      // Options du mail de confirmation pour l'expéditeur
      const mailOptionsUser = {
        from: 'jblemy2002@gmail.com', // Adresse e-mail de l'expéditeur
        to: email, // Adresse e-mail de l'utilisateur ayant rempli le formulaire
        subject: 'Confirmation de réception', // Sujet de l'e-mail de confirmation
        text: 'Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais. Merci de nous avoir contactés.' // Corps du message de confirmation
      };

      // Envoi de l'e-mail de confirmation à l'utilisateur
      transporter.sendMail(mailOptionsUser, (error, info) => {
        if (error) {
          console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
          res.status(500).send('Erreur lors de l\'envoi de l\'email de confirmation'); // Envoi d'une réponse d'erreur
        } else {
          console.log('Email de confirmation envoyé à l\'utilisateur:', info.response);
          res.status(200).send('Votre message a été envoyé avec succès et un e-mail de confirmation vous a été envoyé.'); // Envoi d'une réponse de succès
        }
      });
    }
  });
});

// L'application écoute sur le port spécifié
app.listen(port, () => {
  console.log(`Le serveur tourne à l'adresse http://localhost:${port}/`); // Message de confirmation lorsque le serveur est démarré
});
