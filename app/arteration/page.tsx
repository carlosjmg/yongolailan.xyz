import FestPage, { festMetadata } from "@/components/arteration/FestPage";

export const dynamic = "force-dynamic";

export const generateMetadata = () => festMetadata("en");

export default function ArterationPage() {
  return <FestPage lang="en" />;
}
