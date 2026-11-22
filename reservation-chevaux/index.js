document.addEventListener("DOMContentLoaded", async function () {
    
  // 1. Sélection des éléments principaux du DOM
  const dateCours = document.querySelector("#dateDuCours");
  const heureCours = document.querySelector("#heureDuCours");
  const moniteurNom = document.querySelector("#moniteurNom");
  const msgConfirmation = document.querySelector("#msgConfirmation");
  const boutons = document.querySelectorAll(".btnReserver");
  const cartes = document.querySelectorAll(".chevaux");

  // 2. Récupération des données depuis data.json
  const reponse = await fetch("data.json");
  const data = await reponse.json();

  // 3. Affichage des infos du cours
  dateCours.textContent = data.cours.date;
  heureCours.textContent = data.cours.heure;
  moniteurNom.textContent = data.cours.moniteur;

  // 4. Affichage des réservations déjà existantes depuis data.json (ex: Inca)
  data.chevaux.forEach(function (cheval) {
    cartes.forEach(function (carte) {
      const nomCarte = carte.querySelector(".nomCheval").textContent;
      if (nomCarte === cheval.nom && cheval.reservePar !== "") {
        carte.querySelector(".reserverPar").textContent = `Réservé par : ${cheval.reservePar}`;
      }
    });
  });

  // Fonction réutilisable pour appliquer l'état "réservé" sur l'interface
  function appliquerReservation(nomChevalChoisis) {
    boutons.forEach(function (btn) {
      const carte = btn.closest(".chevaux");
      const nomCarte = carte.querySelector(".nomCheval").textContent;

      // Si c'est le cheval choisi par l'élève, on met à jour sa carte
      if (nomCarte === nomChevalChoisis) {
        const statut = carte.querySelector(".msgStatut");
        statut.textContent = "Indisponible";
        statut.classList.remove("msgStatut");
        statut.classList.add("msgStatutReserve");
        carte.querySelector(".reserverPar").textContent = "Réservé par : Vous";
        btn.textContent = "Déjà réservé";
      }

      // On bloque tous les boutons pour empêcher une 2e réservation
      btn.disabled = true;
      btn.classList.remove("btnReserver");
      btn.classList.add("indisponible");
    });

    // Affichage du message de confirmation
    msgConfirmation.innerHTML = `<strong>${nomChevalChoisis}</strong> sera bien votre cheval pour le cours du <strong>${data.cours.date}</strong> à <strong>${data.cours.heure}</strong> avec comme moniteur <strong>${data.cours.moniteur}</strong>.<br>Veuillez être présent <em>10 min à l'avance</em> et préparer votre cheval.`;
  }

  // 5. Vérification au chargement si une réservation existe déjà dans le localStorage
  const chevalSauvegarde = localStorage.getItem("chevalReserve");
  if (chevalSauvegarde) {
    appliquerReservation(chevalSauvegarde);
  }

  // 6. Écoute du clic sur chaque bouton disponible
  boutons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const carte = this.closest(".chevaux");
      const nomCheval = carte.querySelector(".nomCheval").textContent;

      // Sauvegarde dans le localStorage
      localStorage.setItem("chevalReserve", nomCheval);

      // Mise à jour de l'affichage
      appliquerReservation(nomCheval);
    });
  });
});