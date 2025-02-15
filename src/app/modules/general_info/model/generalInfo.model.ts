import mongoose from 'mongoose';
import { ar7id } from '../../../../utils/unique_id/ar7id';

const siteInfoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'info_' + ar7id(),
    },
    privacyPolicy: {
      type: String,
      required: true,
    },
    termsAndConditions: {
      type: String,
      required: true,
    },
    aboutUs: {
      type: String,
      required: true,
    },
    faqs: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const generalInfoModel = mongoose.model('general_info', siteInfoSchema);

export const test = async () => {
  await generalInfoModel.create({
    privacyPolicy:
      'Privacy Policy We value your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and protect your information. 1. Information We Collect We may collect personal information such as your name, email, and usage data. 2. How We Use Your Information We use your data to improve our services, provide customer support, and communicate with you. 3. Data Protection We implement security measures to safeguard your data. However, no online service is completely secure. 4. Third-Party Services We may share limited data with trusted third-party services for analytics and marketing. 5. Changes to This Policy We may update this policy from time to time. Please review it periodically.',
    termsAndConditions:
      'Terms & Conditions By using our services, you agree to comply with these terms. Please read them carefully. 1. Acceptance of Terms By accessing or using our platform, you agree to these terms and conditions. 2. User Responsibilities You must provide accurate information and use our services responsibly. 3. Prohibited Activities You may not engage in illegal or unauthorized activities while using our services. 4. Limitation of Liability We are not liable for any damages resulting from your use of our services. 5. Changes to Terms We may update these terms at any time. Continued use of our services implies acceptance of the changes.',
    aboutUs:
      'About Us We are a company dedicated to providing high-quality services to our customers. Our mission is to create innovative solutions that enhance user experiences. 1. Who We Are We are a team of professionals passionate about technology and customer satisfaction. 2. Our Vision To be a leader in our industry by delivering exceptional products and services. 3. Our Mission To provide reliable, efficient, and user-friendly solutions that meet the needs of our customers. 4. Contact Us For any inquiries, feel free to reach out to us through our contact page.',
    faqs: [
      {
        question: 'What services do you offer?',
        answer:
          'We offer a range of services including web development, mobile app development, and software solutions.',
      },
      {
        question: 'How can I contact support?',
        answer:
          'You can reach out to our support team via email or our contact page.',
      },
      {
        question: 'Do you offer refunds?',
        answer:
          'Refund policies vary depending on the service. Please refer to our refund policy for more details.',
      },
      {
        question: 'How long does it take to complete a project?',
        answer:
          'Project timelines vary based on complexity, but we always strive to deliver within the agreed timeframe.',
      },
      {
        question: 'Where can I find more details about your terms?',
        answer:
          'You can read our Terms & Conditions for more information about our policies.',
      },
    ],
  });
  console.log('faq successful');
};
// setTimeout(() => {
//   test();
// }, 5000);
