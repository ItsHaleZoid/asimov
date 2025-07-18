import { Mail } from "lucide-react";
import { Badge } from "./badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"; 
import { Button } from "./button";  
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  description?: string;
  buttonText?: string;
  items: FAQItem[];
}

function FAQ({ 
  title = "Frequently Asked Questions",
  description = "We've compiled a list of frequently asked questions to help you get started with AsimovAI. If you have any questions that aren't answered here, please contact us.",
  buttonText = "Any questions? Reach out",
  items 
}: FAQProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge variant="outline">FAQ</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-regular">
                  {title}
                </h4>
                <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
                  {description}
                </p>
              </div>
              <div className="">
                <Button className="gap-4" variant="outline" asChild>
                  <Link href="mailto:support@asimovai.com">
                    {buttonText} <Mail className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem key={index} value={"index-" + index}>
                <AccordionTrigger className="text-2xl font-light tracking-tight text-left hover:text-primary transition-colors duration-200">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-300 ease-out">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export { FAQ };
export type { FAQProps, FAQItem };
