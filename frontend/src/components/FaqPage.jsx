import React, { useState } from "react";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";

const faqData = [
  {
    question: "How does BookExchange work?",
    answer:
      "BookExchange lets users share, request, and receive books from others. List your books, browse others' listings, request a book, and exchange directly.",
  },
  {
    question: "Is BookExchange free to use?",
    answer:
      "Yes! BookExchange is completely free and promotes a community-based sharing of books.",
  },
  {
    question: "How do I request a book?",
    answer:
      "Once logged in, browse books and click 'Request Book'. You'll be redirected to fill in delivery details to confirm the request.",
  },
  {
    question: "Can I update or delete my uploaded books?",
    answer:
      "Absolutely. Head to your Dashboard → My Books. From there you can edit or remove your listings anytime.",
  },
  {
    question: "How do returns and received confirmations work?",
    answer:
      "After reading, the borrower clicks return. Once the owner receives it, they confirm it from their dashboard.",
  },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
   
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-indigo-700 mb-10 text-center">
          🙋 Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm transition"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-indigo-50 transition rounded-t"
              >
                <span className="text-lg font-medium text-gray-800 text-left">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="text-indigo-600" />
                ) : (
                  <ChevronDown className="text-indigo-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 pt-1 text-gray-600 transition">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Us Section */}
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-2">
            Still have questions or need help?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow transition"
          >
            <Mail size={18} />
            Contact Support
          </a>
        </div>
      </div>
    
  );
};

export default FaqPage;
