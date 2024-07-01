document.addEventListener('DOMContentLoaded', () => {
  // On attend que le DOM soit entièrement chargé avant d'exécuter ce code

  // Récupération des éléments du DOM
  const button = document.getElementById("button-menu"); // Bouton du menu
  const links = document.getElementById("links"); // Conteneur des liens de navigation
  const links_icon = document.querySelector(".button-menu i"); // Icône à l'intérieur du bouton du menu

  // Ajout d'un écouteur d'événement 'click' sur le bouton du menu
  button.addEventListener('click', () => {
    // Vérifie si les liens ont la classe 'view'
    if (links.classList.contains("view")) {
      // Si oui, retire la classe 'view' pour cacher les liens
      links.classList.remove("view");
      // Change l'icône pour afficher 'fa-bars' (icône de menu)
      links_icon.classList.add("fa-bars");
      links_icon.classList.remove("fa-times");
    } else {
      // Sinon, ajoute la classe 'view' pour afficher les liens
      links.classList.add("view");
      // Change l'icône pour afficher 'fa-times' (icône de fermeture)
      links_icon.classList.remove("fa-bars");
      links_icon.classList.add("fa-times");
    }
  });

  // Fonction pour charger les commentaires depuis le serveur
  const loadComments = async () => {
    try {
      // Fait une requête GET pour récupérer les commentaires
      const response = await fetch('/comments'); // Endpoint à définir côté serveur pour récupérer les commentaires
      // Vérifie si la réponse n'est pas ok (statut HTTP 200-299)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commentaires');
      }
      // Convertit la réponse en JSON
      const comments = await response.json(); // Convertit la réponse en JSON
      // Appelle la fonction pour afficher les commentaires
      displayComments(comments); // Appelle la fonction pour afficher les commentaires
    } catch (error) {
      console.error('Erreur :', error); // Affiche une erreur en cas d'échec
    }
  };

  // Fonction pour afficher les commentaires dans le DOM
  const displayComments = (comments) => {
    // Récupère le conteneur des commentaires
    const commentsContainer = document.getElementById('commentaires');
    // Vide le contenu existant du conteneur
    commentsContainer.innerHTML = ''; // Vide le contenu existant

    // Pour chaque commentaire dans le tableau des commentaires
    comments.forEach(comment => {
      // Crée un div pour le commentaire
      const commentDiv = document.createElement('div');
      commentDiv.classList.add('commentaire'); // Ajoute la classe 'commentaire'

      // Crée un div pour le texte du commentaire
      const texteDiv = document.createElement('div');
      texteDiv.classList.add('texte'); // Ajoute la classe 'texte'

      // Crée un div pour les détails du commentaire
      const detailsDiv = document.createElement('div');
      detailsDiv.classList.add('details'); // Ajoute la classe 'details'

      // Crée un div pour l'avatar
      const avatarDiv = document.createElement('div');
      avatarDiv.classList.add('avatar'); // Ajoute la classe 'avatar'

      // Crée un div pour la photo de l'avatar
      const photoDiv = document.createElement('div');
      photoDiv.classList.add('photo'); // Ajoute la classe 'photo'
      // Définit l'image de fond pour la photo
      photoDiv.style.backgroundImage = `url('/images/data.jpg')`;
      // Ajoute la photo au div de l'avatar
      avatarDiv.appendChild(photoDiv);

      // Crée un div pour le nom de l'auteur du commentaire
      const nameDiv = document.createElement('div');
      nameDiv.classList.add('nom'); // Ajoute la classe 'nom'
      nameDiv.textContent = comment.name; // Définit le contenu textuel avec le nom de l'auteur

      // Crée un div pour le titre 'Auteur'
      const authorDiv = document.createElement('div');
      authorDiv.classList.add('titre'); // Ajoute la classe 'titre'
      authorDiv.textContent = 'Auteur'; // Définit le contenu textuel avec le titre 'Auteur'

      // Ajoute les éléments avatar, nom et titre au div des détails
      detailsDiv.appendChild(avatarDiv);
      detailsDiv.appendChild(nameDiv);
      detailsDiv.appendChild(authorDiv);

      // Crée un paragraphe pour le texte du commentaire
      const commentParagraph = document.createElement('p');
      // Ajoute les guillemets de citation autour du commentaire
      commentParagraph.innerHTML = `<i class="fa-solid fa-quote-left"></i> ${comment.comment} <i class="fa-solid fa-quote-right"></i>`;

      // Ajoute le paragraphe au div de texte
      texteDiv.appendChild(commentParagraph);

      // Ajoute le div de texte et le div de détails au div du commentaire
      commentDiv.appendChild(texteDiv);
      commentDiv.appendChild(detailsDiv);

      // Ajoute le div du commentaire au conteneur des commentaires
      commentsContainer.appendChild(commentDiv);
    });
  };

  // Chargement des commentaires au chargement de la page
  window.addEventListener('DOMContentLoaded', loadComments);
});
