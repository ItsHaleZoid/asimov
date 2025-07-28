import { PricingCard } from "@/components/ui/pricing-card";
import { Gabarito } from 'next/font/google'


const gabarito = Gabarito({
    weight: ["400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

export default function Pricing() {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className={`${gabarito.className} text-balance text-4xl font-medium lg:text-5xl`}>Plan & Pricing</h2>
                </div>
               
                <PricingCard
                        title="Starter"
                        price="$"
                        details="For personal use and playing around with AI"
                        size="lg"
                        period="monthly"
                        features={["50 Image Generation Credits (50 Images)", "Basic support", "Personal use only", "Access to all models", "Access to 5 presets of your choice"]}
                        buttonText="Get Starter"
                        onButtonClick={() => {}}
                    />


            </div>
        </section>
    )
}