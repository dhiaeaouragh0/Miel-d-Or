export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "bienfaits-du-miel-naturel",
    title: "Les bienfaits méconnus du miel naturel",
    excerpt:
      "Antioxydant, énergisant, apaisant : découvrez pourquoi le miel pur mérite une place dans votre quotidien.",
    date: "2026-04-12",
    image:
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=1200&auto=format&fit=crop",
    content:
      "Le miel naturel est bien plus qu'un simple édulcorant. Riche en antioxydants, il aide à lutter contre le stress oxydatif et soutient les défenses naturelles de l'organisme. Consommé régulièrement et avec modération, il peut aussi apaiser les irritations de la gorge et favoriser un sommeil de meilleure qualité grâce à ses sucres naturels à libération lente.",
  },
  {
    slug: "comment-reconnaitre-un-vrai-miel",
    title: "Comment reconnaître un vrai miel ?",
    excerpt:
      "Texture, cristallisation, étiquette : nos conseils pour distinguer un miel authentique d'un produit transformé.",
    date: "2026-03-02",
    image:
      "https://images.unsplash.com/photo-1568526381923-caf3fd520382?q=80&w=1200&auto=format&fit=crop",
    content:
      "Un vrai miel cristallise naturellement avec le temps, contrairement à de nombreux miels industriels qui restent liquides indéfininiment grâce à un traitement thermique excessif. Vérifiez également l'origine indiquée sur l'étiquette et privilégiez les producteurs locaux qui pratiquent une récolte raisonnée.",
  },
  {
    slug: "miel-et-apiculture-en-algerie",
    title: "L'apiculture en Algérie : un savoir-faire ancestral",
    excerpt:
      "Tour d'horizon des terroirs mellifères algériens, du littoral aux hauts plateaux.",
    date: "2026-01-18",
    image:
      "https://images.unsplash.com/photo-1455471172211-32dc8d3a0f02?q=80&w=1200&auto=format&fit=crop",
    content:
      "L'Algérie bénéficie d'une diversité de climats et de flores qui donne naissance à des miels aux profils aromatiques très variés : miel de lavande des hauts plateaux, miel d'eucalyptus du littoral, ou encore miel de jujubier dans le sud. Cette richesse fait la fierté de nos apiculteurs partenaires.",
  },
];
