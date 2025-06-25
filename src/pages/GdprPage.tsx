
const GdprPage = () => {
  return (
    <>
      <div
        className="flex flex-col flex-grow"
        style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
      >
        <div className="flex-grow container mx-auto px-4 py-12 text-white">
          <div className="bg-white/5 p-8 rounded-lg max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">GDPR</h1>
            <div className="space-y-4 text-gray-300">
              <h2 className="text-2xl font-semibold text-gray-100">Your Rights Under GDPR</h2>
              <p>The General Data Protection Regulation (GDPR) gives you certain rights over your personal data. At wodagoat, we are committed to upholding these rights.</p>
              <p>You have the right to access, rectify, or erase your personal data, as well as the right to restrict or object to its processing. You can also request data portability.</p>
              <h2 className="text-2xl font-semibold text-gray-100 mt-6">Data Collection and Use</h2>
              <p>We collect personal data to provide and improve our service. This includes information you provide upon registration, such as your name and email address, and data generated through your use of our platform, like quiz results and rankings.</p>
              <p>We do not sell your personal data to third parties. We may share data with trusted partners for purposes like analytics and service hosting, under strict data protection agreements.</p>
              <h2 className="text-2xl font-semibold text-gray-100 mt-6">Contact Us</h2>
              <p>If you have any questions about our GDPR compliance or wish to exercise your rights, please contact us at <a href="mailto:privacy@wodagoat.com" className="text-cyan-400 hover:underline">privacy@wodagoat.com</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GdprPage;
