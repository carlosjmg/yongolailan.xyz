import LandingPageForm from "@/components/admin/LandingPageForm";

export const dynamic = "force-dynamic";

export default function JustAnotherDayAdmin({ searchParams }: { searchParams: { saved?: string } }) {
  return (
    <LandingPageForm
      prefix="jad"
      heading="Just Another Day"
      route="/just-another-day"
      intro={
        <>
          The single&rsquo;s landing page at <b>/just-another-day</b>, reached by clicking the song in Arema Arega&rsquo;s page or in the
          music catalog.
        </>
      }
      eyebrowPlaceholder="New Single"
      audioPreview
      searchParams={searchParams}
    />
  );
}
