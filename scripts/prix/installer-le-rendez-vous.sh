#!/bin/zsh
# Pose (ou retire) le rendez-vous hebdomadaire des prix, chaque lundi à 8 h 17.
#
#   scripts/prix/installer-le-rendez-vous.sh            pose et charge
#   scripts/prix/installer-le-rendez-vous.sh --retirer  décharge et supprime
#   scripts/prix/installer-le-rendez-vous.sh --essai    lance tout de suite, une fois
#   scripts/prix/installer-le-rendez-vous.sh --etat     dit s'il est posé et quand il a tourné
#
# launchd est le cron de macOS. Il rattrape un rendez-vous manqué au réveil de la machine : si
# l'ordinateur est éteint le lundi matin, le relevé part dès qu'il rouvre. Il ne part pas du tout
# si la machine reste éteinte toute la semaine, et c'est acceptable : le relevé est daté, un
# lundi sauté se voit dans /suivi-des-prix/.
set -e
DEPOT="${0:A:h:h:h}"
ETIQUETTE="eu.bipbop.prix-semaine"
CIBLE="$HOME/Library/LaunchAgents/$ETIQUETTE.plist"

case "${1:-}" in
  --retirer)
    launchctl bootout "gui/$UID/$ETIQUETTE" 2>/dev/null || true
    rm -f "$CIBLE"
    echo "Rendez-vous retiré."
    ;;
  --essai)
    launchctl kickstart -p "gui/$UID/$ETIQUETTE"
    echo "Lancé. Suivre : tail -f $DEPOT/releves/journal.log"
    ;;
  --etat)
    if [[ -f "$CIBLE" ]]; then
      launchctl print "gui/$UID/$ETIQUETTE" 2>/dev/null | grep -E "state|runs|last exit|program" | sed 's/^/   /' \
        || echo "   plist posé, mais non chargé dans launchd."
    else
      echo "   Aucun rendez-vous posé."
    fi
    ;;
  *)
    # Le .env doit exister : sans les adresses de flux, le relevé se rabat sur 156 lectures de
    # pages, et Thomann jette au bout de quelques dizaines.
    if [[ ! -f "$DEPOT/.env" ]]; then
      echo "⚠ Pas de .env à la racine du dépôt : THOMANN_FEED_URL et DONNER_FEED_URL y sont attendues."
    fi
    mkdir -p "$HOME/Library/LaunchAgents" "$DEPOT/releves"
    sed -e "s|__DEPOT__|$DEPOT|g" -e "s|__HOME__|$HOME|g" "$DEPOT/scripts/prix/$ETIQUETTE.plist" > "$CIBLE"
    launchctl bootout "gui/$UID/$ETIQUETTE" 2>/dev/null || true
    launchctl bootstrap "gui/$UID" "$CIBLE"
    echo "Rendez-vous posé : chaque lundi à 8 h 17, dans $DEPOT"
    launchctl print "gui/$UID/$ETIQUETTE" | grep -E "state|program|runs" | sed 's/^/   /'
    ;;
esac
