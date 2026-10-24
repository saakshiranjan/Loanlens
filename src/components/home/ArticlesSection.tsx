import { ArrowRight, BookOpen } from "lucide-react";

const ARTICLES = [
  {
    category: "Credit Score",
    emoji: "📊",
    title: "How CIBIL Score Affects Your Home Loan Rate",
    summary:
      "A 50-point improvement in your CIBIL score could save you lakhs over a 20-year home loan. Here's how.",
    readTime: "5 min read",
    gradient: "from-teal-500 to-teal-700",
  },
  {
    category: "EMI Planning",
    emoji: "📅",
    title: "Should You Choose Longer Tenure to Reduce EMI?",
    summary:
      "Lower monthly EMI sounds attractive — but the true cost of a 30-year vs 20-year home loan may surprise you.",
    readTime: "4 min read",
    gradient: "from-navy-600 to-navy-800",
  },
  {
    category: "Loan Strategy",
    emoji: "💡",
    title: "Prepayment vs Investment: What's Better?",
    summary:
      "Should you use your bonus to prepay your home loan or invest in mutual funds? A clear comparison.",
    readTime: "6 min read",
    gradient: "from-violet-600 to-violet-800",
  },
  {
    category: "First-Time Borrowers",
    emoji: "🏦",
    title: "5 Documents You Must Prepare Before Applying",
    summary:
      "Missing one document can delay your loan by weeks. Here's the essential checklist for salaried applicants.",
    readTime: "3 min read",
    gradient: "from-amber-500 to-orange-600",
  },
];

export function ArticlesSection() {
  return (
    <section className="py-20 bg-slate-50" aria-label="Financial Education Articles">
      <div className="container-max section-padding">
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 bg-navy-100 text-navy-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <BookOpen className="w-4 h-4" />
              Financial Education
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950">
              Learn Before You Borrow
            </h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 text-teal-600 font-semibold text-sm hover:gap-3 transition-all"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ARTICLES.map(({ category, emoji, title, summary, readTime, gradient }) => (
            <a
              key={title}
              href="#"
              className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group card-hover flex flex-col"
            >
              <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center text-6xl`}>
                {emoji}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    {category}
                  </span>
                  <span className="text-xs text-slate-400">{readTime}</span>
                </div>
                <h3 className="font-semibold text-navy-950 text-sm leading-snug mb-2 group-hover:text-teal-700 transition-colors">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{summary}</p>
                <div className="flex items-center gap-1 text-teal-600 text-xs font-semibold mt-3 group-hover:gap-2 transition-all">
                  Read More <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
