import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Us | Sarkari Updates',
  description: 'Learn more about Sarkari Updates - India\'s trusted government job portal.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '24px' }}>About Sarkari Updates</h1>
        
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ marginBottom: '16px' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '24px' }}>
            Sarkari Updates is dedicated to providing the most accurate, fast, and comprehensive information about government jobs, admit cards, and results across India. Our AI-powered system aggregates data from 20+ official state and central websites to ensure you never miss a deadline.
          </p>

          <h2 style={{ marginBottom: '16px' }}>Disclaimer</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '24px' }}>
            We are an independent platform and are <strong>not affiliated with any government organization</strong>. All information provided is for educational and informational purposes only. We strongly recommend verifying details on the official government websites before applying.
          </p>

          <h2 style={{ marginBottom: '16px' }}>Privacy & Terms</h2>
          <p style={{ color: 'var(--text-2)' }}>
            We respect your privacy. We do not collect personal data beyond what is strictly necessary to provide you with a personalized experience (like saving jobs locally on your device). By using this website, you agree to use the information at your own risk.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
