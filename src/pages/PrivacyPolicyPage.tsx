
const PrivacyPolicyPage = () => {
  return (
    <>
      <div
        className="flex flex-col flex-grow"
        style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
      >
        <div className="flex-grow container mx-auto px-4 py-12 text-white">
           <div className="bg-white/5 p-8 rounded-lg max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">Privacy Policy</h1>
            <div className="space-y-4 text-gray-300">
              <h2 className="text-2xl font-semibold text-gray-100">Introduction</h2>
              <p>Welcome to wodagoat's Privacy Policy. We respect your privacy and are committed to protecting your personal data. This policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
              
              <h2 className="text-2xl font-semibold text-gray-100 mt-6">Information We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc list-inside ml-4">
                  <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                  <li><strong>Contact Data:</strong> includes email address.</li>
                  <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                  <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-100 mt-6">How We Use Your Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to perform the contract we are about to enter into or have entered into with you, and where it is necessary for our legitimate interests.</p>
              
              <h2 className="text-2xl font-semibold text-gray-100 mt-6">Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.</p>
              
              <h2 className="text-2xl font-semibold text-gray-100 mt-6">Contact Us</h2>
              <p>If you have questions or comments about this policy, you may email us at <a href="mailto:privacy@wodagoat.com" className="text-cyan-400 hover:underline">privacy@wodagoat.com</a>.</p>
            </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
