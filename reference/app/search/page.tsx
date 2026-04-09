import { SearchPageContent } from "@/components/search/SearchPageContent";
import { PageHero } from "@/components/layout/PageHero";

export const dynamic = "force-static";

export const metadata = {
  title: "Search | PROCPA",
  description: "Search across all articles, series, and references.",
};

export default function SearchPage() {
  return (
    <main>
       <SearchPageContent />
    </main>
  );
}
