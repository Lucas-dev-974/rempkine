import { Search, FileText, Calculator, BookOpen } from "lucide-solid";

export const features = [
  {
    icon: <Search class="w-8 h-8 text-primary-500" />,
    title: "Recherche de Remplacements",
    description:
      "Trouvez facilement des remplaçants ou des opportunités de remplacement selon vos critères.",
    path: "/search",
  },
  {
    icon: <FileText class="w-8 h-8 text-primary-500" />,
    title: "Gestion des Contrats",
    description:
      "Création automatique de contrats adaptés à la législation locale avec signature électronique.",
    path: "/contracts",
  },
  {
    icon: <Calculator class="w-8 h-8 text-primary-500" />,
    title: "Simulateur de Rentabilité",
    description:
      "Calculez votre rentabilité nette et brute selon différents scénarios personnalisables.",
    path: "/simulator",
  },
  {
    icon: <BookOpen class="w-8 h-8 text-primary-500" />,
    title: "Guide Pas à Pas",
    description:
      "Accédez à un contenu interactif pour vous accompagner dans vos démarches administratives.",
    path: "/guide",
  },
];
