document.addEventListener("DOMContentLoaded", async function () {
    
    // 1. Sélection des éléments du DOM
    const msgReservation = document.querySelector(".msgFinal");
    const boutons = document.querySelectorAll(".btnReserver");
    const cartes = document.querySelectorAll(".veloCarte");
    const stationName = document.querySelector(".stationName");
    const heureDepart = document.querySelector(".heureDepart");

    // 2. Chargement du fichier data.json
    const reponse = await fetch("data.json");
    const data = await reponse.json();

    // 3. Affichage des infos générales de la station
    stationName.textContent = data.station.nom;
    heureDepart.textContent = data.station.horaire;

    // 4. Double boucle pour relier les vélos du JSON aux cartes HTML et afficher ceux déjà réservés
    data.velos.forEach(function (velo) {
        cartes.forEach(function (carte) {
            const nomCarte = carte.querySelector(".nomVelo").textContent;

            if (nomCarte === velo.modele) {
                carte.querySelector("img").src = velo.photosVelos;
                carte.querySelector(".refVelo").textContent = velo.ref;

                if (velo.reservePar !== "") {
                    carte.querySelector(".reservePar").textContent = velo.reservePar;
                    const statut = carte.querySelector(".statutVelo");
                    statut.textContent = "Indisponible";
                    statut.classList.remove("statutVelo");
                    statut.classList.add("veloIndispo");

                    const btnCarte = carte.querySelector(".btnReserver");
                    btnCarte.disabled = true;
                    btnCarte.textContent = "Indisponible";
                    btnCarte.classList.remove("btnReserver");
                    btnCarte.classList.add("veloIndispo");
                }
            }
        });
    });

    // 5. Fonction réutilisable pour appliquer la réservation de l'utilisateur via la référence
    function appliquerReservation(refVelosChoisie) {
        boutons.forEach(function (btn) {
            const carteVelos = btn.closest(".veloCarte");
            const refVelos = carteVelos.querySelector(".refVelo").textContent;
       
            // Si c'est le vélo choisi par l'utilisateur (comparaison sur la ref)
            if (refVelos === refVelosChoisie) {
                const statut = carteVelos.querySelector(".statutVelo");
                statut.textContent = "Indisponible";
                statut.classList.remove("statutVelo");
                statut.classList.add("veloIndispo");
                carteVelos.querySelector(".reservePar").textContent = "Vous";
            }

            // Blocage et changement de texte de tous les boutons après un choix
            btn.disabled = true;
            btn.textContent = "Indisponible";
            btn.classList.remove("btnReserver");
            btn.classList.add("veloIndispo");
        });
        
        msgReservation.innerHTML = `Le vélo <strong>${refVelosChoisie}</strong> a bien été réservé`;
    }

    // 6. Vérification au chargement si une réservation existe déjà dans le localStorage
    const velosSauvegarde = localStorage.getItem("veloReserve");
    if (velosSauvegarde) {
        appliquerReservation(velosSauvegarde);
    }

    // 7. Écoute du clic sur chaque bouton
    boutons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const carteVelos = this.closest(".veloCarte");
            const refVelos = carteVelos.querySelector(".refVelo").textContent;

            localStorage.setItem("veloReserve", refVelos);
            appliquerReservation(refVelos);
        });
    });

});