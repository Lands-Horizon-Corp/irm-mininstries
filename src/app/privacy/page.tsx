import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <div className="">
      <Container>
        <div className="py-[30px] md:py-24">
          <Heading
            align="left"
            className="mb-8"
            description="Effective Date: 26 August 2025"
            title="Privacy Policy"
          />
          <div className="prose max-w-none">
            <p className="mb-8 text-gray-600">
              IRM Ministries (International Revival Ministries) is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, and protect your personal information when you
              participate in our ministry activities and services.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              1. Information We Collect
            </h3>
            <p className="mb-8 text-gray-600">
              Personal Information: Name, email address, phone number, address,
              prayer requests, testimony details, and any information you
              provide when joining our ministry or participating in our
              services.
            </p>
            <p className="mb-8 text-gray-600">
              Ministry Participation: Information about your involvement in
              Bible studies, prayer meetings, worship services, and community
              outreach programs.
            </p>
            <p className="mb-8 text-gray-600">
              Technical Information: IP address, browser type, and cookies for
              website functionality and communication purposes.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              2. How We Use Your Data
            </h3>
            <p className="mb-8 text-gray-600">We use your information to:</p>
            <ul className="mb-8 list-disc space-y-2 pl-5">
              <li>Process your ministry membership and participation.</li>
              <li>
                Communicate with you about worship services, events, and
                ministry activities.
              </li>
              <li>Provide spiritual support, prayer, and pastoral care.</li>
              <li>
                Send ministry updates, newsletters, and educational resources.
              </li>
              <li>
                Coordinate community outreach and volunteer opportunities.
              </li>
              <li>Improve our website and ministry services.</li>
            </ul>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">3. Data Sharing</h3>
            <p className="mb-8 text-gray-600">
              We do not sell or rent your personal data. We maintain strict
              confidentiality and share data only with:
            </p>
            <ul className="mb-8 list-disc space-y-2 pl-5">
              <li>
                Ministry leadership and pastoral staff for spiritual care and
                guidance purposes.
              </li>
              <li>
                Our trusted service providers (e.g., email services, website
                hosting), bound by confidentiality agreements.
              </li>
              <li>
                Partner ministries or churches only with your explicit consent
                for collaborative ministry activities.
              </li>
            </ul>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">4. Data Retention</h3>
            <p className="mb-8 text-gray-600">
              We retain your data only as long as necessary for ministry
              purposes, spiritual care, and maintaining our church community
              records. You may request data deletion at any time, though some
              records may be retained for legal or pastoral care purposes as
              required by law or church governance.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              5. Your Rights and Privacy Control
            </h3>
            <p className="mb-8 text-gray-600">
              You have the right to access, correct, delete, or restrict your
              personal data. You may also opt out of ministry communications at
              any time. Contact us at info@irmministries.org for any
              data-related requests or privacy concerns.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              6. Security and Confidentiality
            </h3>
            <p className="mb-8 text-gray-600">
              We take appropriate technical and organizational measures to
              protect your data. All ministry staff and volunteers are committed
              to maintaining confidentiality of personal information shared
              within our church community.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              7. Ministry-Specific Provisions
            </h3>
            <p className="mb-8 text-gray-600">
              Prayer Requests: Information shared for prayer purposes is treated
              with utmost confidentiality and shared only with designated prayer
              ministry teams.
            </p>
            <p className="mb-8 text-gray-600">
              Pastoral Counseling: All information shared during pastoral
              counseling sessions is kept strictly confidential unless
              disclosure is required by law or necessary to prevent harm.
            </p>
            <p className="mb-8 text-gray-600">
              Testimonies and Public Sharing: We will always ask for your
              explicit permission before sharing your testimony or personal
              story publicly.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              8. Contact Information
            </h3>
            <p className="mb-8 text-gray-600">
              For questions about this Privacy Policy or to exercise your
              privacy rights, please contact us at info@irmministries.org or
              through our website contact form. Our ministry leadership is
              committed to addressing your privacy concerns promptly and
              transparently.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
