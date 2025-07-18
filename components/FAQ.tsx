import { FAQ } from "./ui/faq-section";
import { Gabarito } from "next/font/google";
import { LiquidButton } from "./ui/liquid-glass-button";
const gabarito = Gabarito({
    weight: ["400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

const items = [

    {
        question: "Which models do you support?",
        answer: "We support the most latest and advanced models: Flux.1 and Flux.1 Kontext for maximum performance and efficiency."
    },
    {
        question: "How do I get started?",
        answer: "You can choose your desired plan and start generating images immediately."
    },
    {
        question: "Is AsimovAI safe to use?",
        answer: "Yes, AsimovAI is safe to use. We porcess the data and deliver it to our servers with the highest security standards."
    },
    {
        question: "Can I get a refund if I'm not satisfied?",
        answer: "Yes, you can get a refund withing 7 days if you're not satisfied."
    },
    {
        question: "How do I contact you?",
        answer: "You can contact us by email at support@asimovai.com anytime."
    }
]


export default function FAQSection() {
    return (
        <div>
        <FAQ items={items} />
        <div className="flex items-center justify-center mb-15 mt-10">
<LiquidButton
className={`${gabarito.className} px-6 py-2 -mt-40 w-1/6 rounded-100px font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg`}
size="xl"
style={{
  background: "linear-gradient(135deg, #000dff 0%, #6600ff 100%)",
  color: "white",
  borderRadius: "100px"
}}

>
Get Started
</LiquidButton>
</div>
</div>
    )
}   