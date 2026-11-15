import FestPage, { festMetadata } from "@/components/arteration/FestPage";

export const dynamic = "force-dynamic";

export const generateMetadata = () => festMetadata("es");

export default function ArterationEsPage() {
  return <FestPage lang="es" />;
}
