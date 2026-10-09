import { Hero } from "@/components/home/Hero";
import { AudienceSplit } from "@/components/home/AudienceSplit";
import { ClientLogos } from "@/components/home/ClientLogos";
import { FleetPreview } from "@/components/home/FleetPreview";
import { FleetSpread } from "@/components/home/FleetSpread";
import { Showroom } from "@/components/home/Showroom";
import { FuelStrip } from "@/components/home/FuelStrip";
import { FareTeaser } from "@/components/home/FareTeaser";
import { WhyUs } from "@/components/home/WhyUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CorporateBand } from "@/components/home/CorporateBand";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqSection } from "@/components/home/FaqSection";
import { JsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";
import { getFaqs } from "@/lib/cms";

export const metadata = buildMetadata({
  title: "Rent a Car in Pakistan | Self-Drive, Chauffeur and Corporate Fleet",
  description:
    "Car rental across Pakistan for individuals and corporate clients. Transparent fuel-linked pricing, a maintained fleet, vetted drivers and instant booking.",
  path: "/",
});

export default async function HomePage() {
  const faqs = await getFaqs();

  return (
    <>
      <Hero />
      <FleetSpread />
      <Showroom />
      <AudienceSplit />
      <ClientLogos intro="From schools and universities to manufacturers, hospitals and multinationals, these are organisations whose people we move." />
      <FleetPreview />
      <FuelStrip />
      <FareTeaser />
      <WhyUs />
      <HowItWorks />
      <CorporateBand />
      <Testimonials />
      <FaqSection />
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
