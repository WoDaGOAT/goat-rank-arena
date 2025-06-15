
import ContactForm from "@/components/contact/ContactForm";
import { Helmet } from "react-helmet-async";

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Wodagoat</title>
        <meta name="description" content="Have a question, suggestion, or feedback? Get in touch with the Wodagoat team. We would love to hear from you!" />
      </Helmet>
      <div
        className="flex flex-col flex-grow"
        style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
      >
        <div className="flex-grow container mx-auto px-4 py-12 text-white">
          <div className="bg-white/5 p-8 rounded-lg max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">Contact Us</h1>
            <p className="text-center text-gray-300 mb-8">Have a question or feedback? We'd love to hear from you.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
