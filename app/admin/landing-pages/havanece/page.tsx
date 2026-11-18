import LandingPageForm from "@/components/admin/LandingPageForm";

export const dynamic = "force-dynamic";

export default function HavaneceAdmin({ searchParams }: { searchParams: { saved?: string } }) {
  return (
    <LandingPageForm
      prefix="hav"
      heading="Havanece"
      route="/havanece"
      intro={
        <>
          The album&rsquo;s landing page at <b>/havanece</b>, reached by clicking the cover or title in the music catalog. The vinyl at the
          bottom comes from the Merch list (the item titled &ldquo;HAVANECE · VINYL&rdquo;).
        </>
      }
      eyebrowPlaceholder="The Album"
      audioPreview={false}
      searchParams={searchParams}
    />
  );
}
