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
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div 
            layout
            className="flex gap-10 flex-col"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div 
              layout
              className="flex gap-4 flex-col"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
                <Badge variant="outline">FAQ</Badge>
              </motion.div>
              <motion.div 
                layout
                className="flex gap-2 flex-col"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.h4 
                  layout
                  className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-regular"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {title}
                </motion.h4>
                <motion.p 
                  layout
                  className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {description}
                </motion.p>
              </motion.div>
              <motion.div 
                layout
                className=""
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Button className="gap-4" variant="outline" asChild>
                  <Link href="mailto:support@asimovai.com">
                    {buttonText} <Mail className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="w-full">
            {items.map((item, index) => {
              const itemValue = `index-${index}`;
              const isOpen = openItem === itemValue;
              
              return (
                <div key={index} className="border-b border-border">
                  <button
                    className="w-full py-4 text-left flex justify-between items-center text-2xl font-light tracking-tight hover:text-primary transition-colors duration-200"
                    onClick={() => setOpenItem(isOpen ? null : itemValue)}
                  >
                    <span>{item.question}</span>
                    <motion.svg
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="ml-2 w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          ease: "easeInOut",
                          opacity: { duration: 0.2 }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 text-muted-foreground leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export { FAQ };
export type { FAQProps, FAQItem };
