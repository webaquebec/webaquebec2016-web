export default class DateHelper {
    public static get MONTHS_LABELS(): Array<string> {
        return ["Janvier", "Février", "Mars",
            "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre",
            "Octobre", "Novembre", "Décembre"];
    }
    
    public static get DAYS_LABELS(): Array<string> {
      return ["Dimanche", "Lundi", "Mardi",
          "Mercredi", "Jeudi", "Vendredi",
          "Samedi"];
    }
}
